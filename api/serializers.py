from rest_framework import serializers
from .models import User, Book, Order, WithdrawalRequest, PlatformSetting

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
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

    def get_avatar(self, obj):
        if obj.avatar_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar_image.url)
            return f"http://127.0.0.1:8000{obj.avatar_image.url}"
        return obj.avatar

    def get_purchasedBookIds(self, obj):
        return list(Order.objects.filter(reader=obj, status='Completed').values_list('book_id', flat=True))

class BookSerializer(serializers.ModelSerializer):
    authorName = serializers.SerializerMethodField()
    authorId = serializers.IntegerField(source='author.id', read_only=True)
    authorWhatsapp = serializers.CharField(source='author.whatsapp_number', read_only=True)
    coverColor = serializers.CharField(source='cover_color', required=False)
    previewPages = serializers.JSONField(source='preview_pages', required=False)
    pagesCount = serializers.IntegerField(source='pages_count', required=False)
    reviewsCount = serializers.IntegerField(source='reviews_count', required=False)
    pdfUrl = serializers.SerializerMethodField()
    coverImage = serializers.SerializerMethodField()

    physicalPrice = serializers.DecimalField(source='physical_price', max_digits=8, decimal_places=2, required=False, allow_null=True)
    writerName = serializers.CharField(source='writer_name', required=False, allow_blank=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'authorId', 'authorName', 'writerName', 'authorWhatsapp', 'category', 'price', 'physicalPrice', 
            'rating', 'reviewsCount', 'description', 'coverColor', 
            'published_date', 'approved', 'previewPages', 'pagesCount', 'pdfUrl', 'coverImage'
        ]

    def get_authorName(self, obj):
        if obj.writer_name:
            return obj.writer_name
        return obj.author.name if obj.author else ""

    def get_pdfUrl(self, obj):
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
            return obj.pdf_file.url
        return None

    def get_coverImage(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    bookTitle = serializers.CharField(source='book.title', read_only=True)
    authorName = serializers.CharField(source='book.author.name', read_only=True)
    authorId = serializers.IntegerField(source='book.author.id', read_only=True)
    readerName = serializers.CharField(source='reader.name', read_only=True)
    isPhysical = serializers.BooleanField(source='is_physical', required=False)
    shippingAddress = serializers.CharField(source='shipping_address', required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = [
            'id', 'book', 'bookTitle', 'authorId', 'authorName', 'reader', 
            'readerName', 'price', 'commission', 'earnings', 'date', 'status',
            'razorpay_order_id', 'razorpay_payment_id', 'isPhysical', 'shippingAddress'
        ]

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source='author.name', read_only=True)
    authorWhatsapp = serializers.CharField(source='author.whatsapp_number', read_only=True)
    accountDetails = serializers.CharField(source='account_details', required=False, allow_blank=True)

    class Meta:
        model = WithdrawalRequest
        fields = ['id', 'author', 'authorName', 'authorWhatsapp', 'amount', 'date', 'status', 'accountDetails']

class PlatformSettingSerializer(serializers.ModelSerializer):
    physicalSurcharge = serializers.DecimalField(source='physical_surcharge', max_digits=8, decimal_places=2, required=False)

    class Meta:
        model = PlatformSetting
        fields = ['commission_rate', 'physicalSurcharge']
