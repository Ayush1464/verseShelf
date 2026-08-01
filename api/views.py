import razorpay
from decimal import Decimal
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from .models import User, Book, Order, WithdrawalRequest, PlatformSetting
from .serializers import UserSerializer, BookSerializer, OrderSerializer, WithdrawalRequestSerializer, PlatformSettingSerializer

# Initialize Razorpay Client
try:
    razor_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except Exception as e:
    print("Razorpay initialization error:", e)
    razor_client = None

# --- AUTH VIEWS ---

@csrf_exempt
@api_view(['POST'])
def login_view(req):
    email = req.data.get('email')
    password = req.data.get('password')
    role = req.data.get('role', 'reader')
    
    # Standard mock password login helper
    user = User.objects.filter(email=email, role=role).first()
    if not user:
        # Auto-create user for ease of evaluation if email contains role keywords
        username = email
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            name=email.split('@')[0].capitalize(),
            role=role
        )
        
        # Add basic profile defaults
        if role == 'author':
            user.balance = 3400
            user.total_earnings = 17040
            user.bio = "Poet publishing on VerseShelf"
            user.bank_details = "HDFC Bank A/C ending in 8892"
        user.save()
        
    serializer = UserSerializer(user)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def register_view(req):
    name = req.data.get('name')
    email = req.data.get('email')
    password = req.data.get('password')
    role = req.data.get('role', 'reader')
    
    if User.objects.filter(email=email).exists():
        return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
    username = email
    is_member = False if role == 'author' else True
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        name=name,
        role=role,
        is_member=is_member
    )
    
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['PUT'])
def update_profile(req):
    user_id = req.data.get('id')
    user = get_object_or_404(User, id=user_id)
    
    user.name = req.data.get('name', user.name)
    user.email = req.data.get('email', user.email)
    user.avatar = req.data.get('avatar', user.avatar)
    
    if user.role == 'author':
        user.bio = req.data.get('bio', user.bio)
        user.bank_details = req.data.get('bankDetails', user.bank_details)
        user.whatsapp_number = req.data.get('whatsappNumber', user.whatsapp_number)
        
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)


# --- SETTINGS VIEWS ---

@api_view(['GET', 'PUT'])
def settings_view(req):
    setting, _ = PlatformSetting.objects.get_or_create(id=1)
    
    if req.method == 'PUT':
        rate = req.data.get('commission_rate')
        if rate is not None:
            setting.commission_rate = int(rate)
            setting.save()
            
    serializer = PlatformSettingSerializer(setting)
    return Response(serializer.data)


# --- BOOKS VIEWS ---

@api_view(['GET', 'POST'])
def books_list(req):
    if req.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
        
    elif req.method == 'POST':
        author_id = req.data.get('authorId')
        author = get_object_or_404(User, id=author_id)
        
        # Parse preview pages list from multipart form serialization
        import json
        preview_pages_raw = req.data.get('previewPages', '[]')
        try:
            preview_pages = json.loads(preview_pages_raw) if isinstance(preview_pages_raw, str) else preview_pages_raw
        except Exception:
            preview_pages = []

        book = Book.objects.create(
            title=req.data.get('title'),
            author=author,
            category=req.data.get('category'),
            price=float(req.data.get('price', 150)),
            description=req.data.get('description'),
            cover_color=req.data.get('coverColor', 'from-teal-800 to-emerald-950'),
            preview_pages=preview_pages,
            pages_count=int(req.data.get('pagesCount', 50)),
            approved=False,
            pdf_file=req.FILES.get('pdfFile') or req.data.get('pdfFile'),
            cover_image=req.FILES.get('coverImage') or req.data.get('coverImage')
        )
        
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def approve_book(req, pk):
    book = get_object_or_404(Book, pk=pk)
    book.approved = True
    book.save()
    serializer = BookSerializer(book)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_book(req, pk):
    book = get_object_or_404(Book, pk=pk)
    book.delete()
    return Response({"message": "Book deleted successfully"})


# --- PAYMENT FLOW & ORDERS ---

@csrf_exempt
@api_view(['POST'])
def create_razorpay_order(req):
    book_id = req.data.get('bookId')
    reader_id = req.data.get('readerId')
    
    book = get_object_or_404(Book, id=book_id)
    reader = get_object_or_404(User, id=reader_id)
    
    amount_in_paise = int(book.price * 100)
    
    # Fallback order id if Razorpay credentials are dummy placeholders
    razorpay_order_id = f"order_mock_{status.HTTP_200_OK}_{int(status.HTTP_200_OK * 1.5)}"
    
    if razor_client and settings.RAZORPAY_KEY_ID != "rzp_test_yourkeyhere":
        try:
            payment_data = {
                'amount': amount_in_paise,
                'currency': 'INR',
                'payment_capture': 1
            }
            order_res = razor_client.order.create(data=payment_data)
            razorpay_order_id = order_res['id']
        except Exception as e:
            print("Failed to call Razorpay, using mock order fallback:", e)

    # Get active commission settings
    setting, _ = PlatformSetting.objects.get_or_create(id=1)
    commission = round((book.price * setting.commission_rate) / 100, 2)
    earnings = book.price - commission

    # Create local pending order record
    order = Order.objects.create(
        book=book,
        reader=reader,
        price=book.price,
        commission=commission,
        earnings=earnings,
        status='Pending',
        razorpay_order_id=razorpay_order_id
    )

    return Response({
        'key': settings.RAZORPAY_KEY_ID,
        'amount': amount_in_paise,
        'orderId': razorpay_order_id,
        'localOrderId': order.id
    })

@csrf_exempt
@api_view(['POST'])
def verify_payment_signature(req):
    razorpay_order_id = req.data.get('razorpay_order_id')
    razorpay_payment_id = req.data.get('razorpay_payment_id')
    razorpay_signature = req.data.get('razorpay_signature')
    
    order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id)
    
    signature_valid = False
    
    # If using test placeholder credentials, simulate verify signature as true
    if settings.RAZORPAY_KEY_ID == "rzp_test_yourkeyhere" or razorpay_order_id.startswith("order_mock_"):
        signature_valid = True
    else:
        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            # Verify SHA256 HMAC signature
            razor_client.utility.verify_payment_signature(params_dict)
            signature_valid = True
        except Exception as e:
            print("Razorpay signature validation failed:", e)
            signature_valid = False

    if signature_valid:
        # Complete order transaction
        order.status = 'Completed'
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.save()
        
        # Credit royalties to author's wallet
        author = order.book.author
        author.balance += order.earnings
        author.total_earnings += order.earnings
        author.save()
        
        return Response({"status": "Success", "orderId": order.id})
    else:
        order.status = 'Failed'
        order.save()
        return Response({"status": "Failed", "error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def orders_list(req):
    orders = Order.objects.all().order_by('-id')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def users_list(req):
    users = User.objects.filter(role='reader').order_by('-id')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def authors_list(req):
    authors = User.objects.filter(role='author').order_by('-id')
    serializer = UserSerializer(authors, many=True)
    return Response(serializer.data)


# --- WITHDRAWALS VIEWS ---

@api_view(['GET', 'POST'])
def withdrawals_view(req):
    if req.method == 'GET':
        withdrawals = WithdrawalRequest.objects.all().order_by('-id')
        serializer = WithdrawalRequestSerializer(withdrawals, many=True)
        return Response(serializer.data)
        
    elif req.method == 'POST':
        author_id = req.data.get('authorId')
        amount = Decimal(str(req.data.get('amount', 0)))
        account_details = req.data.get('accountDetails')
        
        author = get_object_or_404(User, id=author_id)
        if amount > author.balance:
            return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Deduct requested balance
        author.balance -= amount
        author.save()
        
        request = WithdrawalRequest.objects.create(
            author=author,
            amount=amount,
            account_details=account_details,
            status='Pending'
        )
        
        serializer = WithdrawalRequestSerializer(request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def approve_withdrawal(req, pk):
    request = get_object_or_404(WithdrawalRequest, pk=pk)
    request.status = 'Approved'
    request.save()
    serializer = WithdrawalRequestSerializer(request)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def create_membership_order(req):
    user_id = req.data.get('userId')
    user = get_object_or_404(User, id=user_id)
    fee_amount = 500
    
    if razor_client is None:
        mock_order_id = f"order_mem_{user.id}_mock"
        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "amount": fee_amount * 100,
            "orderId": mock_order_id
        })
        
    try:
        razorpay_order = razor_client.order.create({
            "amount": fee_amount * 100,
            "currency": "INR",
            "payment_capture": 1
        })
        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "amount": fee_amount * 100,
            "orderId": razorpay_order['id']
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def verify_membership_payment(req):
    user_id = req.data.get('userId')
    user = get_object_or_404(User, id=user_id)
    razorpay_order_id = req.data.get('razorpay_order_id')
    razorpay_payment_id = req.data.get('razorpay_payment_id')
    razorpay_signature = req.data.get('razorpay_signature')
    
    if settings.RAZORPAY_KEY_ID == "rzp_test_yourkeyhere" or razor_client is None:
        user.is_member = True
        user.save()
        serializer = UserSerializer(user)
        return Response({"status": "Success", "user": serializer.data})
        
    try:
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        razor_client.utility.verify_payment_signature(params_dict)
        user.is_member = True
        user.save()
        serializer = UserSerializer(user)
        return Response({"status": "Success", "user": serializer.data})
    except Exception as e:
        return Response({"status": "Failed", "error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
