from django.contrib import admin
from .models import Atomizer, AtomizerVariant, Perfume, PerfumeImage, PerfumeNote, Notes, Family, Brand,Decant,Longevity,Sillage, Thrift


class DecantInline(admin.TabularInline):
    model = Decant
    extra = 1  # number of empty rows shown by default

class PerfumeImageInline(admin.TabularInline):
    model = PerfumeImage
    extra = 1

class PerfumeNoteInline(admin.TabularInline):
    model = PerfumeNote
    extra = 3  # number of empty rows shown by default

class SillageInline(admin.StackedInline):
    model = Sillage
    extra = 1

class LongevityInline(admin.StackedInline):
    model = Longevity
    extra = 1

class AtomizerVariantInline(admin.TabularInline):
    exclude = ['reserved']
    model = AtomizerVariant


class PerfumeAdmin(admin.ModelAdmin):
    search_fields = ['name', 'brand__name'] 
    exclude = ['slug']
    inlines = [DecantInline,SillageInline, LongevityInline, PerfumeNoteInline, PerfumeImageInline]

class AtomizerAdmin(admin.ModelAdmin):
    inlines = [AtomizerVariantInline]

admin.site.register(Perfume, PerfumeAdmin)
admin.site.register(Notes)
admin.site.register(Family)
admin.site.register(Brand)
admin.site.register(Atomizer,AtomizerAdmin)
admin.site.register(Thrift)