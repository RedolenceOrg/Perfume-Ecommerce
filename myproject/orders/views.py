import json
import os
import requests
from decouple import config
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

VALLEY_DISTRICTS = ["Kathmandu", "Bhaktapur", "Lalitpur"]

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
        

        shipping_charge = 100 if serializer.validated_data['district'] in VALLEY_DISTRICTS else 150
        # discount calculation
        
        profile = request.user.profile
        discount_percent = get_discount_percent(float(profile.total_spend))
        discount_amount = cart.grand_total * discount_percent / 100
        discounted_total = cart.grand_total - discount_amount
        total_amount = discounted_total + shipping_charge

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                district= serializer.validated_data['district'],
                place = serializer.validated_data['place'],
                phone_number=serializer.validated_data['phone_number'],
                total_amount=total_amount,
                status = 'pending',
                payment_method = serializer.validated_data['payment_method'],
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
                    perfume=perfume,
                    product_type=item.product_type,  
                    product_id=item.product_id,       
                )
            if serializer.validated_data['payment_method'] == 'cod':
                for item in order.items.all():
                    product = item.get_product()
                    if product:
                        product.stock -= item.quantity
                        product.save()
                order.payment_status = 'pending'
                order.status = 'processing'
                order.save()
                cart.items.all().delete()
                return JsonResponse({'purchase_order_id': str(order.id),
                                     'message': 'Order placed successfully with Cash on Delivery. Please prepare the payment upon delivery.',
                                     'amount': float(total_amount),})

        return JsonResponse({
            'purchase_order_id': str(order.id),
            'purchase_order_name': f"Order #{order.id} by {request.user.username}",
            'return_url': f"http://localhost:3000/payment/{str(order.id)}",
            'website': 'http://localhost:3000',
            'amount': float(total_amount)*100
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
    

@method_decorator(csrf_protect, name='dispatch')
class KhaltiInitiateView(LoginRequiredMixin, View):
    def post(self, request):
        data = json.loads(request.body)
        
        response = requests.post(
            'https://dev.khalti.com/api/v2/epayment/initiate/',
            json={
                'return_url': f"http://localhost:3000/payment/{data['purchase_order_id']}",
                'website_url': 'http://localhost:3000',
                'amount': data['amount'],  # in paisa, so Rs. 100 = 10000
                'purchase_order_id': data['purchase_order_id'],
                'purchase_order_name': data['purchase_order_name'],
            },
            headers={
                'Authorization': f'Key {config("KHALTI_SECRET_KEY")}' 
            }
        )
        
        khalti_data = response.json()
        
        return JsonResponse(
            khalti_data
        )
@method_decorator(csrf_protect, name='dispatch') 
class KhaltiConfirmView(LoginRequiredMixin, View):
    def post(self, request):
        data = json.loads(request.body)
        pidx = data.get('pidx')
        order_id = data.get('order_id')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return JsonResponse({'detail': 'Order not found'}, status=404)

        # idempotency check
        if order.payment_status == 'paid':
            return JsonResponse({'status': 'Completed'})
        if order.status == 'cancelled':
            return JsonResponse({'status': 'User canceled'})

        # verify with khalti
        response = requests.post(
            'https://dev.khalti.com/api/v2/epayment/lookup/',
            json={'pidx': pidx},
            headers={'Authorization': f'Key {config("KHALTI_SECRET_KEY")}'}
        )
        khalti_data = response.json()
        status = khalti_data.get('status')

        if status == 'Completed':
            with transaction.atomic():
                for item in order.items.all():
                    product = item.get_product()
                    if product:
                        product.stock -= item.quantity
                        product.save()
                order.payment_status = 'paid'
                order.status = 'processing'
                order.save()

        elif status == 'User canceled':
            with transaction.atomic():
                order.status = 'cancelled'
                order.save()

        Cart.objects.filter(user=request.user).delete()

        return JsonResponse({'status': status})