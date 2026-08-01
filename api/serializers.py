from rest_framework import serializers
from .models import User, Book, Order, WithdrawalRequest, PlatformSetting

class UserSerializer(serializers.ModelSerializer):
    purchasedBookIds = serializers.SerializerMethodField()
    totalEarnings = serializers.DecimalField(source='total_earnings', max_digits=10, decimal_places=2, required=False)
    bankDetails = serializers.CharField(source='bank_details', required=False, allow_blank=True)
    isMember = serializers.BooleanField(source='is_member', required=False)
    whatsappNumber = serializers.CharField(source='whatsapp_number', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'name', 'role', 'avatar', 'bio', 
            'balance', 'totalEarnings', 'bankDetails', 'purchasedBookIds', 'isMember', 'whatsappNumber'
        ]

    def get_purchasedBookIds(self, obj):
        return list(Order.objects.filter(reader=obj, status='Completed').values_list('book_id', flat=True))

class BookSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source='author.name', read_only=True)
    authorId = serializers.IntegerField(source='author.id', read_only=True)
    authorWhatsapp = serializers.CharField(source='author.whatsapp_number', read_only=True)
    coverColor = serializers.CharField(source='cover_color', required=False)
    previewPages = serializers.JSONField(source='preview_pages', required=False)
    pagesCount = serializers.IntegerField(source='pages_count', required=False)
    reviewsCount = serializers.IntegerField(source='reviews_count', required=False)
    pdfUrl = serializers.SerializerMethodField()
    coverImage = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'authorId', 'authorName', 'authorWhatsapp', 'category', 'price', 
            'rating', 'reviewsCount', 'description', 'coverColor', 
            'published_date', 'approved', 'previewPages', 'pagesCount', 'pdfUrl', 'coverImage'
        ]

    def get_pdfUrl(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None

    def get_coverImage(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    bookTitle = serializers.CharField(source='book.title', read_only=True)
    authorName = serializers.CharField(source='book.author.name', read_only=True)
    authorId = serializers.IntegerField(source='book.author.id', read_only=True)
    readerName = serializers.CharField(source='reader.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'book', 'bookTitle', 'authorId', 'authorName', 'reader', 
            'readerName', 'price', 'commission', 'earnings', 'date', 'status',
            'razorpay_order_id', 'razorpay_payment_id'
        ]

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source='author.name', read_only=True)
    authorWhatsapp = serializers.CharField(source='author.whatsapp_number', read_only=True)
    accountDetails = serializers.CharField(source='account_details', required=False, allow_blank=True)

    class Meta:
        model = WithdrawalRequest
        fields = ['id', 'author', 'authorName', 'authorWhatsapp', 'amount', 'date', 'status', 'accountDetails']

class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = ['commission_rate']
