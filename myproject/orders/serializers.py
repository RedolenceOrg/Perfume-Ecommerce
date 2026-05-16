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



    


