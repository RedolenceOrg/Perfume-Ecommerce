from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem

class CartItemSerializer(serializers.ModelSerializer):
    # These read-only fields resolve the complex logic we built in the model
    name = serializers.CharField(source='get_item_name', read_only=True)
    price = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id','quantity', 'name', 'price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'created_at']

class deleteCartItemSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()


    
class updateCartItemSerialiser(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value =1)

    


