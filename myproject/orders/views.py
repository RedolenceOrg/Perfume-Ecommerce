import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .utils.helper import get_product,get_discount_percent
from .serializers import deleteCartItemSerializer,updateCartItemSerialiser, addCartItemSerializer,PlaceOrderSerializer

@method_decorator(csrf_protect, name='dispatch')
class AddToCartView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)

            serializer = addCartItemSerializer(data = data)

            if not serializer.is_valid():
                return JsonResponse(serializer.errors,status = 400)
            #get_or_create returns a tuple of the cart and a boolean representing newly created or not

            cart, _ = Cart.objects.get_or_create(user=request.user)

            product_type = serializer.validated_data.get("product_type")
            product_id = serializer.validated_data.get("product_id")
            qty = int(data.get("quantity", 1))

            # Get actual product
            product = get_product(product_type, product_id)

            if not product:
                return JsonResponse({
                    "error": "Product not found"
                }, status=404)

            # Check if already exists in cart
            existing_item = CartItem.objects.filter(
                cart=cart,
                product_type=product_type,
                product_id=product_id
            ).first()

            # =========================
            # THRIFT VALIDATION
            # =========================
            if product_type == "thrift":

                if existing_item:
                    return JsonResponse({
                        "error": "This thrift item is already in your cart"
                    }, status=400)

                CartItem.objects.create(
                    cart=cart,
                    product_type=product_type,
                    product_id=product_id,
                    quantity=1
                )

                return JsonResponse({
                    "message": "Added thrift item",
                    "cart_count": cart.items.count()
                }, status=200)

            # =========================
            # STOCK VALIDATION
            # =========================

            existing_qty = existing_item.quantity if existing_item else 0
            new_total = existing_qty + qty

            # Assumes product has stock field
            if new_total > product.stock:
                return JsonResponse({
                    "error": "This much quantity is out of stock"
                }, status=400)

            # =========================
            # UPDATE / CREATE CART ITEM
            # =========================

            if existing_item:
                existing_item.quantity = new_total
                existing_item.save()

                return JsonResponse({
                    "message": "Cart quantity updated",
                    "already_in_cart": True,
                    "cart_count": cart.items.count()
                }, status=200)

            CartItem.objects.create(
                cart=cart,
                product_type=product_type,
                product_id=product_id,
                quantity=qty
            )

            return JsonResponse({
                "message": "Added to cart",
                "already_in_cart": False,
                "cart_count": cart.items.count()
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)
        

@method_decorator(csrf_protect, name = "dispatch")
class CartUpdateView(LoginRequiredMixin,View):
    def patch(self,request):
        try: 
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({'detail': 'invalid format'},status = 400)
        
        try:
            serializer = updateCartItemSerialiser(data = data)


            if not serializer.is_valid():
                return JsonResponse(serializer.errors,status= 400)
            
            
            quantity = serializer.validated_data["quantity"]
            item_id = serializer.validated_data["item_id"]

            try:
                item = CartItem.objects.get(id = item_id, cart__user = request.user)
            except CartItem.DoesNotExist:
                return JsonResponse({'detail':"Item not found in your cart"},status = 400)
            
            product = item.get_product()
            
            if item.product_type == "thrift":
                return JsonResponse({'detail':"Cannot add more of thrift"},status = 400)
            
            if product.stock < quantity:
                return JsonResponse({'detail':'Not enough stock'},status =400)
            
            
            item.quantity = quantity

            item.save()

            cart = item.cart
            grand_total = sum(
                float(i.total_price) for i in cart.items.all())
            
            return JsonResponse({
            'item_id': item.id,
            'quantity': item.quantity,
            'total_price': float(item.total_price),
            'grand_total': grand_total
            })


        
        except Exception as e:
            return JsonResponse(e,status =400)
            




@method_decorator(csrf_protect, name= 'dispatch')
class CartDeleteView(LoginRequiredMixin,View):
    def delete(self,request):
        try:
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({"Error parsing the json, invalid format"})
        try:
            serializer = deleteCartItemSerializer(data=data)
            if not serializer.is_valid():
                return JsonResponse({serializer.errors},status = 400)
            
            item_id = serializer.validated_data["item_id"]

            try:
                item = CartItem.objects.get(
                    id=item_id,
                    cart__user=request.user  # security check
                    )
            except CartItem.DoesNotExist:
                return JsonResponse(
                {'detail': 'Item not found in your cart'},
                status=404
            )

            item.delete()


            cart = Cart.objects.get(user=request.user)

            grand_total = sum(
            float(i.total_price)
            for i in cart.items.all())
            
            return JsonResponse({
            'message': 'Item removed',
            'grand_total': grand_total})
        except Exception as e:
            return JsonResponse({
                "error":str(e)
            })
    



@method_decorator(csrf_protect, name='dispatch')
class CheckoutView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Failed to parse data'}, status=400)

        serializer = PlaceOrderSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return JsonResponse({'detail': 'Cart not found'}, status=404)

        if not cart.items.exists():
            return JsonResponse({'detail': 'Cart is empty'}, status=400)

        # stock check before transaction
        for item in cart.items.all():
            product = item.get_product()
            if not product or product.stock < item.quantity:
                return JsonResponse(
                    {'detail': f'{item.get_item_name()} is out of stock'},
                    status=400
                )

        # discount calculation
        profile = request.user.profile
        discount_percent = get_discount_percent(float(profile.total_spend))
        discount_amount = cart.grand_total * discount_percent / 100
        discounted_total = cart.grand_total - discount_amount

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                shipping_address=serializer.validated_data['shipping_address'],
                phone_number=serializer.validated_data['phone_number'],
                total_amount=discounted_total,
            )

            for item in cart.items.all():
                product = item.get_product()

                perfume = None
                if item.product_type == 'perfume':
                    perfume = product
                elif item.product_type in ['decant', 'thrift']:
                    perfume = product.perfume

                OrderItem.objects.create(
                    order=order,
                    product_name=item.get_item_name(),
                    price_at_purchase=item.unit_price,
                    quantity=item.quantity,
                    subtotal=item.total_price,
                    perfume=perfume
                )

                product.stock -= item.quantity
                product.save()

            cart.items.all().delete()

        return JsonResponse({
            'order_id': str(order.id),
            'discount_percent': float(discount_percent),
            'discount_amount': float(discount_amount),
            'total_amount': float(discounted_total),
        })

@method_decorator(csrf_protect, name='dispatch') 
class CartDetailView(LoginRequiredMixin, View):
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = []

        for item in cart.items.all():
            product = item.get_product()

            img_url = ""
            if product:
                if item.product_type == "atomizer":
                    img_url = product.image.url if product.image else ""
                elif item.product_type in ["perfume", "decant", "thrift"] and product:
                    perfume = product.perfume if hasattr(product, "perfume") else product
                    img = perfume.images.filter(is_primary=True).first()
                    img_url = img.image.url if img else ""

            items.append({  
                "id": item.id,
                "variant_name": item.get_item_name(),
                "variant_type":item.product_type,
                "unit_price": float(item.total_price / item.quantity),
                "total_price": float(item.total_price),
                "quantity": item.quantity,
                "images": img_url,
                "in_stock":product.stock >= item.quantity if product else False
            })

        return JsonResponse({
            "items": items,
            "grand_total": sum(i['total_price'] for i in items)
        })