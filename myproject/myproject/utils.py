from decouple import config
from django_ratelimit.decorators import ratelimit
from django.http import JsonResponse
from django.core.mail import send_mail
from myproject.settings import DEFAULT_FROM_EMAIL

RATE_LIMIT_ENABLED = config('RATE_LIMIT_ENABLED', default=False, cast=bool)

def user_or_ip(group, request):
    if request.user.is_authenticated:
        return f"user:{request.user.id}"
    return request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'unknown'))

def conditional_ratelimit(rate, block=True):
    def decorator(func):
        if RATE_LIMIT_ENABLED:
            return ratelimit(key=user_or_ip, rate=rate, block=block)(func)
        return func
    return decorator

def ratelimit_exceeded(request, exception=None):
    return JsonResponse(
        {'detail': 'Too many requests, please try again later.'},
        status=429
    )


def send_otp_email(email, otp):
    subject = 'Your Password Reset OTP for Redolence Nepal'
    html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>Your OTP is:</p>
            <h1 style="letter-spacing: 8px; color: #333;">{otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
            <p>If you didn't request this, ignore this email.</p>
        </div>
    """
    send_mail(
        subject=subject,
        message=f'Your OTP is: {otp}',  
        from_email=DEFAULT_FROM_EMAIL,  
        recipient_list=[email],
        html_message=html_message,
    )

def send_order_confirmation_email(email, orderId,total_amount):
    subject = 'Order Confirmation - Redolence Nepal'
    html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
            <h2>Order Confirmation</h2>
            <p>Your order has been confirmed. Your OrderID is:</p>
            <h1 style="letter-spacing: 8px; color: #333;">{orderId}</h1>
            <p>The total amount of your order is: NPR {total_amount}</p>
            <p>If you have any issues, contact us on our phone number.</p>
            <p>If you didn't place this order, please contact our support immediately.</p>
    """
    send_mail(
        subject=subject,
        message=f'Your OrderID is: {orderId}',  
        from_email=DEFAULT_FROM_EMAIL,  
        recipient_list=[email],
        html_message=html_message,
    )