from django.db import models
from django.db.models import Sum

from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    isVerified = models.BooleanField(default= False)

    pass 


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True)
    district = models.CharField(blank=True)
    place = models.CharField(blank = True)  

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    @property
    def address(self):
        return f"{self.place},{self.district}"
    @property
    def total_spend(self):
        return self.user.orders.filter(
            payment_status="paid",
            status="delivered"
        ).aggregate(
            total=Sum("total_amount")
        )["total"] or 0

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_expired(self):
        from django.utils import timezone
        return (timezone.now() - self.created_at).seconds > 600
    