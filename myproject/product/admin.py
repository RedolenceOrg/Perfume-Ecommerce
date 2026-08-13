from django.contrib import admin
from .models import (
    Atomizer, AtomizerVariant, NasalStrip,
    Perfume, PerfumeImage, PerfumeNote,
    Notes, Family, Brand,
    Decant, Longevity, Sillage, Thrift, ThriftImage,AtomizerVariantImage
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
class ThriftImageInline(admin.TabularInline):
    model = ThriftImage
    extra = 1


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
    list_display = ['name', 'brand', 'type','collection', 'gender', 'price', 'full_bottle_size','stock', 'available_stock', 'is_seasonal_pick', 'is_restocked']
    list_filter = ['type','collection', 'gender', 'brand', 'is_seasonal_pick', 'is_restocked']
    search_fields = ['name', 'brand__name']
    ordering = ['brand', 'name']
    readonly_fields = ['slug', 'reserved', 'available_stock', 'date_added']
    inlines = [PerfumeImageInline, PerfumeNoteInline, DecantInline, SillageInline, LongevityInline]

    fields = [
        'type','collection', 'name', 'brand', 'gender', 'price','full_bottle_size',
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
    inlines =  [ThriftImageInline]
    list_display = ['perfume', 'remaining_juice', 'thrift_price', 'stock', 'reserved', 'colored_available_stock']
    search_fields = ['perfume__name']
    ordering = ['-stock', 'perfume__name']
    readonly_fields = ['reserved', 'available_stock']
    fields = ['perfume', 'remaining_juice', 'thrift_price', 'stock', 'reserved', 'available_stock',]

    @admin.display(description='Available Stock', ordering='stock')
    def colored_available_stock(self, obj):
        from django.utils.html import format_html
        if obj.available_stock > 0:
            return format_html('<span style="color: green; font-weight: bold;">✅ {}</span>', obj.available_stock)
        return format_html('<span style="color: red;">❌ {}</span>', obj.available_stock)


# ──────────────────────────────────────────
# Atomizer
# ──────────────────────────────────────────

class AtomizerVariantImageInline(admin.TabularInline):
    model = AtomizerVariantImage
    extra = 4


class AtomizerVariantInline(admin.TabularInline):
    model = AtomizerVariant
    extra = 1


@admin.register(AtomizerVariant)
class AtomizerVariantAdmin(admin.ModelAdmin):
    list_display = ['atomizer', 'size', 'colors', 'price']
    # readonly_fields = ['reserved', 'available_stock']
    inlines = [AtomizerVariantImageInline]


@admin.register(Atomizer)
class AtomizerAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_premium']
    inlines = [AtomizerVariantInline]

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

@admin.register(NasalStrip)
class NasalStripAdmin(admin.ModelAdmin):
    list_display = ['price', 'available_stock']
    readonly_fields = ['available_stock']
    fields = ['price', 'stock', 'reserved', 'available_stock','image']
