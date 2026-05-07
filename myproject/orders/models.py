from django.db import models
from django.conf import settings


STATUS_CHOICES = [('pending', 'Pending'), ('shipped', 'Shipped'), ('delivered', 'Delivered')]
class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders', null =True, blank= True)
    # Snapshot of the total at checkout
    total_amount = models.DecimalField(max_digits=12, decimal_places=2,default= 0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # Billing/Shipping details (snapshot these so they don't change)
    shipping_address = models.TextField(blank = True)
    phone_number = models.CharField(max_length=15,blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    

    perfume = models.ForeignKey('product.Perfume', on_delete=models.SET_NULL, null=True)
    
    # We store the name and price as they were at the MOMENT of checkout
    product_name = models.CharField(max_length=255) # e.g., "Sauvage (10ml Decant)"
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in Order #{self.order.id}"

class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    perfume = models.ForeignKey('product.Perfume', on_delete=models.CASCADE, null=True, blank=True)
    decant = models.ForeignKey('product.Decant', on_delete=models.CASCADE, null=True, blank=True)
    thrift = models.ForeignKey('product.Thrift', on_delete=models.CASCADE, null=True, blank=True)
    atomizer = models.ForeignKey('product.AtomizerVariant', on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'perfume', 'decant', 'thrift', 'atomizer')

    def __str__(self):
        return f"{self.quantity} x {self.get_item_name()}"

    def get_item_name(self):
        # We check the specific objects to generate the name
        if self.decant:
            return f"{self.perfume.name} ({self.decant.size}ml Decant)"
        if self.thrift:
            return f"Thrifted {self.perfume.name} ({self.thrift.remaining_juice}ml)"
        if self.atomizer:
            # AtomizerVariant points to Atomizer, so we can reach the name
            return f"{self.atomizer.atomizer.name} ({self.atomizer.size}ml)"
        if self.perfume:
            return f"{self.perfume.name} (Full Bottle)"
        return "Unknown Item"

    @property
    def total_price(self):
        # Calculation based on which variant is selected
        if self.decant:
            return self.decant.price * self.quantity
        if self.thrift:
            return self.thrift.thrift_price * self.quantity
        if self.atomizer:
            return self.atomizer.price * self.quantity
        if self.perfume:
            return self.perfume.price * self.quantity
        return 0