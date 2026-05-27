from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem


class addCartItemSerializer(serializers.Serializer):
    product_type = serializers.ChoiceField(choices=["perfume","atomizer","decant","thrift"])
    product_id = serializers.IntegerField()
    quantity  = serializers.IntegerField(min_value =1)

class deleteCartItemSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    
class updateCartItemSerialiser(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value =1)

class PlaceOrderSerializer(serializers.Serializer):
    place  =  serializers.CharField(required = True,max_length=50)
    district  = serializers.CharField(required=True,max_length=30)
    phone_number = serializers.DecimalField(required = True, max_digits=10,decimal_places=0)
    payment_method = serializers.ChoiceField(choices=["cod","esewa",'khalti'],required=True)




class OrderSerializer(serializers.ModelSerializer):
    # Add a field for the lightweight item strings
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "status", "total_amount", "items"]  # Included 'items' here

    def get_items(self, obj):
        return [
            f"{item.product_name} {item.quantity} {int(item.price_at_purchase)}"
            for item in obj.items.all()
        ]


    


