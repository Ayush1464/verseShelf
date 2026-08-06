from django.urls import path
from . import views

urlpatterns = [
    # Auth Endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/verify-otp/', views.verify_otp_view, name='verify_otp'),
    path('auth/profile/', views.update_profile, name='update_profile'),
    path('auth/forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('auth/reset-password/', views.reset_password_view, name='reset_password'),
    
    # Global Settings
    path('settings/', views.settings_view, name='settings'),
    
    # Books Endpoints
    path('books/', views.books_list, name='books_list'),
    path('books/<int:pk>/approve/', views.approve_book, name='approve_book'),
    path('books/<int:pk>/', views.delete_book, name='delete_book'),
    
    # Orders & Checkout Flows
    path('orders/create/', views.create_razorpay_order, name='create_razorpay_order'),
    path('orders/verify/', views.verify_payment_signature, name='verify_payment_signature'),
    path('orders/', views.orders_list, name='orders_list'),
    path('users/', views.users_list, name='users_list'),
    path('authors/', views.authors_list, name='authors_list'),
    path('publishers/', views.publishers_list, name='publishers_list'),
    path('authors/<int:pk>/', views.author_detail, name='author_detail'),
    
    # Withdrawals Endpoints
    path('withdrawals/', views.withdrawals_view, name='withdrawals_view'),
    path('withdrawals/<int:pk>/approve/', views.approve_withdrawal, name='approve_withdrawal'),
    
    # Membership Endpoints
    path('auth/membership/create/', views.create_membership_order, name='create_membership_order'),
    path('auth/membership/verify/', views.verify_membership_payment, name='verify_membership_payment'),
]
