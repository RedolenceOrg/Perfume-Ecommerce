from django.contrib import admin
from .models import (
    Atomizer, AtomizerVariant,
    Perfume, PerfumeImage, PerfumeNote,
    Notes, Family, Brand,
    Decant, Longevity, Sillage, Thrift
)


# ──────────────────────────────────────────
# Inlines
# ──────────────────────────────────────────

class DecantInline(admin.TabularInline):
    model = Decant
    extra = 1
    fields = ['size', 'price', 'stock', 'reserved', 'available_stock']
    readonly_fields = ['reserved', 'available_stock']


class ThriftInline(admin.TabularInline):
    model = Thrift
    extra = 0
    fields = ['remaining_juice', 'thrift_price', 'stock', 'reserved', 'available_stock']
    readonly_fields = ['reserved', 'available_stock']


class PerfumeImageInline(admin.TabularInline):
    model = PerfumeImage
    extra = 1
    fields = ['image', 'is_primary']


class PerfumeNoteInline(admin.TabularInline):
    model = PerfumeNote
    extra = 3
    fields = ['note', 'type']


class SillageInline(admin.StackedInline):
    model = Sillage
    extra = 1


class LongevityInline(admin.StackedInline):
    model = Longevity
    extra = 1


class AtomizerVariantInline(admin.TabularInline):
    model = AtomizerVariant
    extra = 0
    fields = ['size', 'price', 'colors', 'stock', 'reserved', 'available_stock', 'image']
    readonly_fields = ['reserved', 'available_stock']


# ──────────────────────────────────────────
# Perfume
# ──────────────────────────────────────────

@admin.register(Perfume)
class PerfumeAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'type', 'gender', 'price', 'stock', 'available_stock', 'is_seasonal_pick', 'is_restocked']
    list_filter = ['type', 'gender', 'brand', 'is_seasonal_pick', 'is_restocked']
    search_fields = ['name', 'brand__name']
    ordering = ['brand', 'name']
    readonly_fields = ['slug', 'reserved', 'available_stock', 'date_added']
    inlines = [PerfumeImageInline, PerfumeNoteInline, DecantInline, SillageInline, LongevityInline]

    fields = [
        'type', 'name', 'brand', 'gender', 'price',
        'description', 'family',
        'stock', 'reserved', 'available_stock',
        'is_seasonal_pick', 'is_restocked',
        'slug', 'date_added',
    ]


# ──────────────────────────────────────────
# Decant standalone
# ──────────────────────────────────────────

@admin.register(Decant)
class DecantAdmin(admin.ModelAdmin):
    list_display = ['perfume', 'size', 'price', 'stock', 'reserved', 'available_stock']
    search_fields = ['perfume__name']
    ordering = ['perfume__name']
    readonly_fields = ['reserved', 'available_stock']
    fields = ['perfume', 'size', 'price', 'stock', 'reserved', 'available_stock']


# ──────────────────────────────────────────
# Thrift standalone
# ──────────────────────────────────────────
@admin.register(Thrift)
class ThriftAdmin(admin.ModelAdmin):
    
    list_display = ['perfume', 'remaining_juice', 'thrift_price', 'stock', 'reserved', 'colored_available_stock']
    search_fields = ['perfume__name']
    ordering = ['-stock', 'perfume__name']
    readonly_fields = ['reserved', 'available_stock']
    fields = ['perfume', 'remaining_juice', 'thrift_price', 'stock', 'reserved', 'available_stock']

    @admin.display(description='Available Stock', ordering='stock')
    def colored_available_stock(self, obj):
        from django.utils.html import format_html
        if obj.available_stock > 0:
            return format_html('<span style="color: green; font-weight: bold;">✅ {}</span>', obj.available_stock)
        return format_html('<span style="color: red;">❌ {}</span>', obj.available_stock)


# ──────────────────────────────────────────
# Atomizer
# ──────────────────────────────────────────

@admin.register(Atomizer)
class AtomizerAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_premium', 'variant_count']
    inlines = [AtomizerVariantInline]

    def variant_count(self, obj):
        return obj.variants.count()
    variant_count.short_description = 'Variants'


@admin.register(AtomizerVariant)
class AtomizerVariantAdmin(admin.ModelAdmin):
    list_display = ['atomizer', 'size', 'price', 'colors', 'stock', 'reserved', 'available_stock']
    search_fields = ['atomizer__name']
    readonly_fields = ['reserved', 'available_stock']
    fields = ['atomizer', 'size', 'price', 'colors', 'stock', 'reserved', 'available_stock', 'image']


# ──────────────────────────────────────────
# Supporting models
# ──────────────────────────────────────────

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
