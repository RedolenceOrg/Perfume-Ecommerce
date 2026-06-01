import base64
from datetime import timedelta
from django.shortcuts import redirect
import hashlib
import hmac 
from django.utils import timezone
import json
import requests
from decouple import config
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction

from myproject.utils import conditional_ratelimit
from .models import Cart, CartItem, Order, OrderItem
from .utils.helper import get_product, get_discount_percent,release_expired_reservations
from .serializers import deleteCartItemSerializer, updateCartItemSerialiser, addCartItemSerializer, PlaceOrderSerializer

VALLEY_DISTRICTS = ["Kathmandu", "Bhaktapur", "Lalitpur"]

RESERVATION_TIME = 60

KhaltiEnabled = config('KHALTI_ENABLED', default=False, cast=bool)
EsewaEnabled = config('ESEWA_ENABLED', default=False, cast=bool)

FrontendUrl  =config('FRONTEND_URL', default='http://localhost:3000')


def generate_esewa_signature(total_amount, transaction_uuid):
    secret = config("ESEWA_SECRET_KEY")
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={config('ESEWA_PRODUCT_CODE')}"
    
    hmac_sha256 = hmac.new(secret.encode(), message.encode(), hashlib.sha256)
    return base64.b64encode(hmac_sha256.digest()).decode('utf-8')

def decode_esewa_response(encoded_data: str) -> dict:
    decoded_bytes = base64.b64decode(encoded_data)
    decoded_str = decoded_bytes.decode('utf-8')
    return json.loads(decoded_str)


def verify_esewa_signature(data: dict) -> bool:
    secret = config("ESEWA_SECRET_KEY")
    signed_fields = data.get("signed_field_names", "").split(",")
    message = ",".join(f"{field}={data.get(field, '')}" for field in signed_fields)

    expected = base64.b64encode(
        hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
    ).decode()

    return expected == data.get("signature")

    

@method_decorator(csrf_protect, name='dispatch')
@method_decorator(conditional_ratelimit(key='ip', rate='20/m'),name='post')
class AddToCartView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            serializer = addCartItemSerializer(data=data)

            if not serializer.is_valid():
                return JsonResponse(serializer.errors, status=400)

            cart, _ = Cart.objects.get_or_create(user=request.user)

            product_type = serializer.validated_data.get("product_type")
            product_id = serializer.validated_data.get("product_id")
            qty = int(data.get("quantity", 1))

            product = get_product(product_type, product_id)

            if not product:
                return JsonResponse({"error": "Product not found"}, status=404)

            existing_item = CartItem.objects.filter(
                cart=cart,
                product_type=product_type,
                product_id=product_id
            ).first()

            # Thrift Validation
            if product_type == "thrift":
                if existing_item:
                    return JsonResponse({"error": "This thrift item is already in your cart"}, status=400)
                if product.available_stock <= 0:
                    return JsonResponse({"error": "This thrift item is out of stock"}, status=400)
                

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

            # Stock Validation
            existing_qty = existing_item.quantity if existing_item else 0
            new_total = existing_qty + qty

            if new_total > product.available_stock:
                return JsonResponse({"error": "This much quantity is out of stock"}, status=400)

            # Update / Create Item
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
            return JsonResponse({"error": str(e)}, status=400)


@method_decorator(conditional_ratelimit(key='ip', rate='20/m'), name='patch')
@method_decorator(csrf_protect, name="dispatch")
class CartUpdateView(LoginRequiredMixin, View):
    def patch(self, request):
        try: 
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'detail': 'invalid format'}, status=400)
        
        try:
            serializer = updateCartItemSerialiser(data=data)
            if not serializer.is_valid():
                return JsonResponse(serializer.errors, status=400)
            
            quantity = serializer.validated_data["quantity"]
            item_id = serializer.validated_data["item_id"]

            try:
                item = CartItem.objects.get(id=item_id, cart__user=request.user)
            except CartItem.DoesNotExist:
                return JsonResponse({'detail': "Item not found in your cart"}, status=400)
            
            product = item.get_product()
            
            if item.product_type == "thrift":
                return JsonResponse({'detail': "Cannot add more of thrift"}, status=400)
            
            if product.available_stock < quantity:
                return JsonResponse({'detail': 'Not enough stock'}, status=400)
            
            item.quantity = quantity
            item.save()


            cart = item.cart
            profile = request.user.profile
            total_spend = float(profile.total_spend) if profile.total_spend else 0.0
            discount_percent = get_discount_percent(total_spend)

            total_price = sum(float(i.total_price) for i in cart.items.all())
            discount_amount = total_price * discount_percent / 100
            grand_total = total_price - discount_amount
            
            return JsonResponse({
                'item_id': item.id,
                'quantity': item.quantity,
                'total_price': float(item.total_price),
                'grand_total': grand_total,
                'discount_percent': discount_percent,
                'discount_amount': discount_amount
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@method_decorator(conditional_ratelimit(key='ip', rate='20/m'), name='delete')
@method_decorator(csrf_protect, name='dispatch')
class CartDeleteView(LoginRequiredMixin, View):
    def delete(self, request):
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({"error": "Error parsing the json, invalid format"}, status=400)
        try:
            serializer = deleteCartItemSerializer(data=data)
            if not serializer.is_valid():
                return JsonResponse(serializer.errors, status=400)
            
            item_id = serializer.validated_data["item_id"]

            try:
                item = CartItem.objects.get(id=item_id, cart__user=request.user)
            except CartItem.DoesNotExist:
                return JsonResponse({'detail': 'Item not found in your cart'}, status=404)

            cart = item.cart
            item.delete()

            # Recalculate discount breakdown after deletion
            profile = request.user.profile
            total_spend = float(profile.total_spend) if profile.total_spend else 0.0
            discount_percent = get_discount_percent(total_spend)

            total_price = sum(float(i.total_price) for i in cart.items.all())
            discount_amount = total_price * discount_percent / 100
            grand_total = total_price - discount_amount
            
            return JsonResponse({
                'message': 'Item removed',
                'grand_total': grand_total,
                'discount_percent': discount_percent,
                'discount_amount': discount_amount
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@method_decorator(conditional_ratelimit(key='ip', rate='10/m'), name='post')
@method_decorator(csrf_protect, name='dispatch')
class CheckoutView(LoginRequiredMixin, View):
    def post(self, request):
        release_expired_reservations()
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Failed to parse data'}, status=400)

        serializer = PlaceOrderSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        
        payment_method = serializer.validated_data['payment_method']
        if payment_method == 'khalti' and not KhaltiEnabled:
            return JsonResponse({'detail': 'Khalti payments are not available yet'}, status=400)

        if payment_method == 'esewa' and not EsewaEnabled:
            return JsonResponse({'detail': 'eSewa payments are not available yet'}, status=400)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return JsonResponse({'detail': 'Cart not found'}, status=404)

        if not cart.items.exists():
            return JsonResponse({'detail': 'Cart is empty'}, status=400)
        
        shipping_charge = 100 if serializer.validated_data['district'] in VALLEY_DISTRICTS else 150
        
        profile = request.user.profile
        discount_percent = get_discount_percent(float(profile.total_spend))
        
        # Calculate totals dynamically based on individual item models
        cart_subtotal = sum(float(i.total_price) for i in cart.items.all())
        discount_amount = cart_subtotal * discount_percent / 100
        discounted_total = cart_subtotal - discount_amount
        total_amount = discounted_total + shipping_charge

        with transaction.atomic():


            for item in cart.items.all():
                product = item.get_product(lock=True)
                if not product or product.available_stock < item.quantity:
                    return JsonResponse(
                        {'detail': f'{item.get_item_name()} is out of stock'},
                        status=400
                        )


            order = Order.objects.create(
                user=request.user,
                district=serializer.validated_data['district'],
                place=serializer.validated_data['place'],
                phone_number=serializer.validated_data['phone_number'],
                total_amount=total_amount,
                status='pending',
                reservation_expires_at=timezone.now() + timedelta(seconds=RESERVATION_TIME),
                payment_method=serializer.validated_data['payment_method'],
            )

            for item in cart.items.all():
                product = item.get_product(lock = True)
                product.reserved += item.quantity # CHANGE
                product.save()

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
                    product = item.get_product(lock=True)
                    if product:
                        product.stock -= item.quantity
                        product.reserved -= item.quantity
                        product.save()
                order.payment_status = 'pending'
                order.status = 'processing'
                order.save()
                cart.items.all().delete()
                return JsonResponse({
                    'purchase_order_id': str(order.id),
                    'message': 'Order placed successfully with Cash on Delivery. Please prepare the payment upon delivery.',
                    'amount': float(total_amount),
                })
            
            if serializer.validated_data['payment_method'] == 'khalti':
                return JsonResponse({
                'purchase_order_id': str(order.id),
                'purchase_order_name': f"Order #{order.id} by {request.user.username}",
                'return_url': f"{FrontendUrl}/payment/{str(order.id)}",
                'website': FrontendUrl,
                'amount': float(total_amount) * 100
            })
        
        
            if serializer.validated_data['payment_method'] == 'esewa':
                base_amount = f"{float(total_amount) - float(shipping_charge):.2f}"  
                formatted_total = f"{float(total_amount):.2f}"                        
            
                signature = generate_esewa_signature(formatted_total, str(order.id)) 
                product_code = config("ESEWA_PRODUCT_CODE")

                return JsonResponse({
                'transaction_uuid':         str(order.id),
                'amount':                   base_amount,
                'tax_amount':               '0',
                'total_amount':             formatted_total,
                'product_delivery_charge':  str(shipping_charge),
                'product_service_charge':   '0',
                'signed_field_names':       'total_amount,transaction_uuid,product_code',
                'product_code':             product_code,
                'signature':                signature,
            })

@method_decorator(conditional_ratelimit(key='ip', rate='40/m'), name='get')
@method_decorator(csrf_protect, name='dispatch') 
class CartDetailView(LoginRequiredMixin, View):
    def get(self, request):
        release_expired_reservations()
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = []

        profile = request.user.profile
        total_spend = float(profile.total_spend) if profile.total_spend else 0.0
        discount_percent = get_discount_percent(total_spend) 

        for item in cart.items.all():
            product = item.get_product()
            img_url = ""
            quantity = item.quantity if item.quantity > 0 else 1
            unit_price = float(item.total_price / quantity)

            if product:
                if item.product_type == "atomizer":
                    img_url = product.image.url if product.image else ""
                elif item.product_type in ["perfume", "decant", "thrift"]:
                    perfume = product.perfume if hasattr(product, "perfume") else product
                    img = perfume.images.filter(is_primary=True).first()
                    img_url = img.image.url if img else ""

            items.append({  
                "id": item.id,
                "variant_name": item.get_item_name(),
                "variant_type": item.product_type,
                "unit_price": unit_price,
                "total_price": float(item.total_price),
                "quantity": item.quantity,
                "images": img_url,
                "in_stock": product.available_stock >= item.quantity if product else False
            })

        total_price = sum(i['total_price'] for i in items)
        discount_amount = total_price * discount_percent / 100
        grand_total = total_price - discount_amount

        return JsonResponse({
            "items": items,
            "grand_total": grand_total,
            "discount_percent": discount_percent,
            "discount_amount": discount_amount
        })
    

@method_decorator(csrf_protect, name='dispatch')
class KhaltiInitiateView(LoginRequiredMixin, View):
    def post(self, request):
        data = json.loads(request.body)
        
        response = requests.post(
            'https://dev.khalti.com/api/v2/epayment/initiate/',
            json={
                'return_url': f"{config('FRONTEND_URL')}/payment/{data['purchase_order_id']}",
                'website_url': config('FRONTEND_URL'),
                'amount': data['amount'],  
                'purchase_order_id': data['purchase_order_id'],
                'purchase_order_name': data['purchase_order_name'],
            },
            headers={
                'Authorization': f'Key {config("KHALTI_SECRET_KEY")}' 
            }
        )
        khalti_data = response.json()
        return JsonResponse(khalti_data)


@method_decorator(csrf_protect, name='dispatch') 
class KhaltiConfirmView(LoginRequiredMixin, View):
    def post(self, request):
        data = json.loads(request.body)
        pidx = data.get('pidx')
        order_id = data.get('purchase_order_id')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return JsonResponse({'detail': 'Order not found'}, status=404)

        if order.payment_status == 'paid':
            return JsonResponse({'status': 'Completed'})
        if order.status == 'cancelled':
            return JsonResponse({'status': 'User canceled'})

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
                    product = item.get_product(lock=True)
                    if product:
                        product.stock -= item.quantity
                        product.reserved -= item.quantity
                        product.save()
                order.payment_status = 'paid'
                order.status = 'processing'
                order.save()
            Cart.objects.filter(user=request.user).delete()

        elif status == 'User canceled':
            with transaction.atomic():
                for item in order.items.all():
                    product = item.get_product(lock=True)
                    if product:
                        product.reserved = max(0, product.reserved - item.quantity)
                        product.save()
                order.payment_status = 'failed'
                order.status = 'cancelled'
                order.save()
        return JsonResponse({'status': status})

class EsewaInitiateView(LoginRequiredMixin, View):
    def get(self, request, order_id):
        encoded = request.GET.get('data')
        if not encoded:
            return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=failed")

        try:
            data = decode_esewa_response(encoded)
        except Exception:
            return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=failed")

        if not verify_esewa_signature(data):
            return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=failed")

        if data.get('status') == 'COMPLETE':
            return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=COMPLETE")
        elif data.get('status') == 'CANCELED':
            return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=CANCELED")

        return redirect(f"{FrontendUrl}/payment/{order_id}?method=esewa&status=failed")
    
class EsewaVerifyView(LoginRequiredMixin, View):
    def get(self, request, order_id):
        esewa_status = request.GET.get('status')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return JsonResponse({'status': 'failed'}, status=404)

        if order.payment_status == 'paid':
            return JsonResponse({'status': 'success'})
        if order.status == 'cancelled':
            return JsonResponse({'status': 'cancelled'})

        if esewa_status == 'COMPLETE':
            verification = requests.get(
                'https://rc-epay.esewa.com.np/api/epay/transaction/status/',
                params={
                    'product_code': config('ESEWA_PRODUCT_CODE'),
                    'total_amount': f"{float(order.total_amount):.2f}",
                    'transaction_uuid': str(order.id),
                }
            )
            try:
                esewa_data = verification.json()
            except Exception:
                return JsonResponse({'status': 'failed'}, status=400)

            if esewa_data.get('status') != 'COMPLETE':
                return JsonResponse({'status': 'failed'}, status=400)

            with transaction.atomic():
                order = Order.objects.select_for_update().get(id=order_id, user=request.user)
                if order.payment_status == 'paid':
                    return JsonResponse({'status': 'success'})
                for item in order.items.all():
                    product = item.get_product(lock=True)
                    if product:
                        product.stock -= item.quantity
                        product.reserved -= item.quantity
                        product.save()
                order.payment_status = 'paid'
                order.status = 'processing'
                order.save()
                Cart.objects.filter(user=request.user).delete()
            return JsonResponse({'status': 'success'})
        with transaction.atomic():
            order = Order.objects.select_for_update().get(id=order_id, user=request.user)
            for item in order.items.all():
                product = item.get_product(lock=True)
                if product:
                    product.reserved = max(0, product.reserved - item.quantity)
                    product.save()
            order.payment_status = 'failed'
            order.status = 'cancelled'
            order.save()
        return JsonResponse({'status': 'cancelled'})