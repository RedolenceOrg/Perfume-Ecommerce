from django.contrib import admin
from .models import Order, Cart, CartItem, OrderItem
from django.utils.html import format_html



class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('product_name', 'product_type', 'price_at_purchase', 'quantity', 'subtotal')
    readonly_fields = ('product_name', 'product_type', 'price_at_purchase', 'quantity', 'subtotal')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    ordering = ['-created_at']
    inlines = [OrderItemInline]
    list_display = ('short_id', 'user', 'colored_status', 'colored_payment_status', 'payment_method', 'total_amount', 'district', 'phone_number', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'district')
    search_fields = ('user__email', 'user__username', 'phone_number', 'place')
    readonly_fields = ('id', 'user', 'total_amount', 'payment_method', 'district', 'place', 'phone_number', 'created_at', 'reservation_expires_at')

    fields = (
        'id', 'user',
        'status', 'payment_status', 'payment_method',
        'total_amount', 'district', 'place', 'phone_number',
        'created_at',
    )

    def short_id(self, obj):
        return str(obj.id)[:8] + '...'
    short_id.short_description = 'Order ID'

    def colored_status(self, obj):
        colors = {
            'pending': '#b45309',
            'processing': '#1d4ed8',
            'shipped': '#6d28d9',
            'delivered': '#15803d',
            'cancelled': '#b91c1c',
            'returned': '#c2410c',
            'expired': '#6b7280',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:bold;">{}</span>',
            color, obj.status.upper()
        )
    colored_status.short_description = 'Status'

    def colored_payment_status(self, obj):
        colors = {
            'pending': '#b45309',
            'paid': '#15803d',
            'failed': '#b91c1c',
        }
        color = colors.get(obj.payment_status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:bold;">{}</span>',
            color, obj.payment_status.upper()
        )
    colored_payment_status.short_description = 'Payment'


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product_type', 'product_id', 'quantity']
    can_delete = False


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'updated_at']
    readonly_fields = ['user', 'created_at', 'updated_at']
    search_fields = ['user__email', 'user__username']
    ordering = ['-updated_at']
    inlines = [CartItemInline]

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Items in Cart'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False