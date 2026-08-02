from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('reader', 'Reader'),
        ('author', 'Author'),
        ('publisher', 'Publisher'),
        ('admin', 'Admin'),
    )
    name = models.CharField(max_length=150, blank=True, default="")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='reader')
    avatar = models.URLField(max_length=500, blank=True, null=True)
    avatar_image = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True, default="")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bank_details = models.TextField(blank=True, default="")
    is_member = models.BooleanField(default=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, default="")
    mfa_code = models.CharField(max_length=6, blank=True, default="")

    def __str__(self):
        return f"{self.username} ({self.role})"

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='published_books')
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews_count = models.IntegerField(default=0)
    description = models.TextField()
    cover_color = models.CharField(max_length=100, default="from-teal-800 to-emerald-950")
    published_date = models.DateField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    preview_pages = models.JSONField(default=list)
    pages_count = models.IntegerField(default=50)
    pdf_file = models.FileField(upload_to='books/pdfs/', null=True, blank=True)
    cover_image = models.FileField(upload_to='books/covers/', null=True, blank=True)
    physical_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    writer_name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return self.title

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='orders')
    reader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    commission = models.DecimalField(max_digits=8, decimal_places=2)
    earnings = models.DecimalField(max_digits=8, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pending')
    razorpay_order_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)
    is_physical = models.BooleanField(default=False)
    shipping_address = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Order {self.id} - {self.book.title} ({self.status})"

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pending')
    account_details = models.TextField()

    def __str__(self):
        return f"Withdrawal {self.id} - {self.author.username} ({self.status})"

class PlatformSetting(models.Model):
    commission_rate = models.IntegerField(default=20)
    physical_surcharge = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)

    def __str__(self):
        return f"Commission Setting - {self.commission_rate}%"
