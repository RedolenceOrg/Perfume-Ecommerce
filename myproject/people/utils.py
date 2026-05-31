from django.core.mail import send_mail

from myproject.settings import DEFAULT_FROM_EMAIL

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