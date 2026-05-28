from django.contrib import admin
from .models import Order,Cart,CartItem,OrderItem
from django.utils.html import format_html

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('product_name', 'price_at_purchase', 'quantity', 'subtotal', 'product_type')
    readonly_fields = ('product_name', 'price_at_purchase', 'quantity', 'subtotal', 'product_type')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    ordering = ['-created_at']
    inlines = [OrderItemInline]
    list_display = ('id', 'user', 'colored_status', 'colored_payment_status', 'payment_method', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method')
    readonly_fields = ('id', 'created_at')

    def colored_status(self, obj):
        colors = {
            'pending': '#b45309',
            'processing': '#1d4ed8',
            'shipped': '#6d28d9',
            'delivered': '#15803d',
            'cancelled': '#b91c1c',
            'returned': '#c2410c',
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


admin.site.register(Cart)
admin.site.register(CartItem)
