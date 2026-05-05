from django.db import models
from django.conf import settings


STATUS_CHOICES = [('pending', 'Pending'), ('shipped', 'Shipped'), ('delivered', 'Delivered')]
# Create your models here.
class Orders(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    perfume = models.ForeignKey('product.Perfume', on_delete=models.CASCADE, related_name='orders')
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.perfume.name} - {self.status}"