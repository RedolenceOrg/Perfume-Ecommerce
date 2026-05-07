import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem

@method_decorator(csrf_protect, name='dispatch')
class AddToCartView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            cart, _ = Cart.objects.get_or_create(user=request.user)
            
            # Extract IDs
            p_id = data.get('perfume_id')
            d_id = data.get('decant_id')
            t_id = data.get('thrift_id')
            a_id = data.get('atomizer_id')
            qty = int(data.get('quantity', 1))

            # get_or_create handles the "is_decant" logic automatically 
            # by checking which FKs are present
            item, created = CartItem.objects.get_or_create(
                cart=cart,
                perfume_id=p_id,
                decant_id=d_id,
                thrift_id=t_id,
                atomizer_id=a_id
            )

            if not created:
                item.quantity += qty
            else:
                item.quantity = qty
            
            item.save()
            return JsonResponse({
                "message": "Added to cart", 
                "cart_count": cart.items.count()
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@method_decorator(csrf_protect, name='dispatch')
class CheckoutView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            cart = get_object_or_404(Cart, user=request.user)
            
            if not cart.items.exists():
                return JsonResponse({"error": "Cart is empty"}, status=400)

            with transaction.atomic():
                # 1. Create the Order
                order = Order.objects.create(
                    user=request.user,
                    total_amount=sum(i.total_price for i in cart.items.all()),
                    shipping_address=data.get('address', ''),
                    phone_number=data.get('phone', '')
                )

                # 2. Loop through items to create the Snapshot
                for item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        perfume=item.perfume,
                        product_name=item.get_item_name(),
                        price_at_purchase=item.total_price / item.quantity,
                        quantity=item.quantity
                    )
                    
                    # Stock subtraction logic would go here

                # 3. Clear the Cart
                cart.items.all().delete()

            return JsonResponse({
                "message": "Order placed!", 
                "order_id": order.id
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        


@method_decorator(csrf_protect, name='dispatch') 
class CartDetailView(LoginRequiredMixin, View):
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = []
        for item in cart.items.all():
            img = item.perfume.images.filter(is_primary=True).first()
            img_url = img.image.url if img else ""
            items.append({
                "id": item.id,
                "perfume_name":item.perfume.name,
                "variant_name": item.get_item_name(),
                "unit_price": float(item.total_price / item.quantity),
                "total_price":float(item.total_price),
                "quantity": item.quantity,
                "images":img_url
            })
        return JsonResponse({
            "items": items,
            "grand_total": sum(i['total_price'] for i in items)
        })