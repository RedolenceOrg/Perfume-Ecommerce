from django.db import models
from django.conf import settings
import uuid


ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
    ('returned', 'Returned'),
]
PAYMENT_METHODS = [('esewa','Esewa'),('khalti','Khalti'),('cod','COD')]
PAYMENT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('paid', 'Paid'),
    ('failed', 'Failed'),
]
class Order(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default= uuid.uuid4,
        editable= False
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='orders')

    total_amount = models.DecimalField(max_digits=12, decimal_places=2,default= 0)

    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20,choices=PAYMENT_METHODS,default='cod')
    payment_status = models.CharField(max_length=20,choices=PAYMENT_STATUS_CHOICES,default='pending')



    district = models.CharField(max_length=30,null=False)
    place = models.CharField(max_length=50,null=False)
    phone_number = models.CharField(max_length=15)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            user_part = self.user.username
        else:
            user_part = "Deleted User"

        return f"Order #{self.id} - {user_part} - status: {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    
    product_name = models.CharField(max_length=255)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    product_type = models.CharField(max_length=20, null=True)
    product_id = models.PositiveIntegerField(null=True)
    
    perfume = models.ForeignKey(
        'product.Perfume',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def get_product(self):
        from product.models import Perfume, Decant, Thrift, AtomizerVariant
        if self.product_type == "perfume":
            return Perfume.objects.filter(id=self.product_id).first()
        if self.product_type == "decant":
            return Decant.objects.filter(id=self.product_id).first()
        if self.product_type == "thrift":
            return Thrift.objects.filter(id=self.product_id).first()
        if self.product_type == "atomizer":
            return AtomizerVariant.objects.filter(id=self.product_id).first()
        return None

    def __str__(self):
        return ""

class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def grand_total(self):
        return sum(item.total_price for item in self.items.all())

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')

    product_type = models.CharField(max_length=20)  # perfume / decant / thrift / atomizer
    product_id = models.PositiveIntegerField()

    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product_type', 'product_id')

    @property
    def unit_price(self):
        """
        Fetches the current price from the actual product model.
        """
        product = self.get_product()
        if not product:
            return 0
        
        # Thrift uses 'thrift_price', others use 'price'
        if self.product_type == "thrift":
            return getattr(product, 'thrift_price', 0)
        
        return getattr(product, 'price', 0)

    @property
    def total_price(self):
        """
        Calculates total based on quantity.
        """
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.get_item_name()}"

    def get_product(self):
        from product.models import Perfume, Decant, Thrift, AtomizerVariant

        if self.product_type == "perfume":
            return Perfume.objects.filter(id=self.product_id).first()
        if self.product_type == "decant":
            return Decant.objects.filter(id=self.product_id).first()
        if self.product_type == "thrift":
            return Thrift.objects.filter(id=self.product_id).first()
        if self.product_type == "atomizer":
            return AtomizerVariant.objects.filter(id=self.product_id).first()
        return None
    
    
    def get_item_name(self):
        product = self.get_product()

        if not product:
            return "Unknown Item"

        if self.product_type == "perfume":
            return f"{product.name} (Full Bottle)"

        if self.product_type == "decant":
            return f"{product.perfume.name} ({product.size}ml Decant)"

        if self.product_type == "thrift":
            return f"Thrifted {product.perfume.name} ({product.remaining_juice}ml)"

        if self.product_type == "atomizer":
            return f"{product.atomizer.name} ({product.size}ml in {product.colors})"

        return "Unknown"