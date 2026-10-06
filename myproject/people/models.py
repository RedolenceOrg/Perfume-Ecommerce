from django.db import models
from django.db.models import Sum

from django.contrib.auth.models import AbstractUser
from product.models import Decant, Perfume

GIFT_TIERS = [
    (25500, '5ml'),
    (60500, '10ml'),
    (115500, '20ml'),
]
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
    @property
    def qualified_gifts(self):
        spend = self.total_spend
        return [gift for threshold, gift in GIFT_TIERS if spend >= threshold]

    @property
    def pending_gifts(self):
        sent = set(self.gift_claims.filter(sent=True).values_list('gift', flat=True))
        return [g for g in self.qualified_gifts if g not in sent]

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_expired(self):
        from django.utils import timezone
        return (timezone.now() - self.created_at).seconds > 600

class Suggestions(models.Model):
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.suggestion[:30]}..."

class StockNotificationRequest(models.Model):
    # null = guest request (unauthenticated, manually entered contact info)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        null=True, blank=True, related_name='stock_notifications'
    )
    perfume = models.ForeignKey(Perfume, on_delete=models.CASCADE, related_name='notification_requests')
    # null decant = they want the full bottle, not a specific size
    decant = models.ForeignKey(
        Decant, on_delete=models.CASCADE, null=True, blank=True,
        related_name='notification_requests'
    )
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)

    def __str__(self):
        target = f"{self.decant.size}ml Decant" if self.decant else "Full Bottle"
        who = self.user.get_username() if self.user else (self.email or self.phone)
        return f"{self.perfume.name} - {target} - {who}"

class GiftClaim(models.Model):
    GIFT_CHOICES = [('3ml', '3ml Atomizer'), ('5ml', '5ml Atomizer'), ('20ml', '20ml Atomizer')]
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='gift_claims')
    gift = models.CharField(max_length=20, choices=GIFT_CHOICES)
    sent = models.BooleanField(default=True)  # a row existing = it was sent
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('profile', 'gift')