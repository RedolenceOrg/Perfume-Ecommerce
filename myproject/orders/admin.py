from django.contrib import admin
from django.utils.html import format_html
from .models import Order, Cart, CartItem, OrderItem
from people.models import GiftClaim  # adjust import path to wherever GiftClaim actually lives
from django.utils.safestring import mark_safe

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
    list_display = (
        'short_id', 'user', 'colored_status', 'colored_payment_status',
        'payment_method', 'total_amount', 'district', 'phone_number',
        'gift_status', 'created_at',
    )
    list_filter = ('status', 'payment_status', 'payment_method', 'district')
    search_fields = ('user__email', 'user__username', 'phone_number', 'place')
    readonly_fields = ('id', 'user', 'total_amount', 'payment_method', 'district', 'place', 'phone_number', 'created_at', 'reservation_expires_at')
    actions = ['mark_gift_sent']

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



    def gift_status(self, obj):
            pending = obj.user.profile.pending_gifts
            if not pending:
                return "-"  # plain string is fine, nothing to escape
            return format_html(
                '<span style="background:#b91c1c; color:white; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:bold;">GIFT PENDING: {}</span>',
                ", ".join(pending)
            )
    gift_status.short_description = 'Gift'

    def mark_gift_sent(self, request, queryset):
        count = 0
        for order in queryset:
            profile = order.user.profile
            for gift in profile.pending_gifts:
                _, created = GiftClaim.objects.get_or_create(profile=profile, gift=gift)
                if created:
                    count += 1
        self.message_user(request, f"Marked {count} gift(s) as sent.")
    mark_gift_sent.short_description = "Mark pending gift(s) as sent for selected orders"


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
        return True