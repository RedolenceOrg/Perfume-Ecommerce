from rest_framework import serializers
from .models import Atomizer, AtomizerVariant, Decant, Perfume,Notes, PerfumeImage,PerfumeNote,Brand,Family, Thrift

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['name']
class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = ['name']
        
class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ['name']


class PerfumeNoteSerializer(serializers.ModelSerializer):
    note = NotesSerializer()
    
    class Meta:
        model = PerfumeNote
        fields = ['note', 'type']

class PerfumeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfumeImage
        fields = ['image', 'is_primary']


class PerfumeListSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source='brand.name')
    primary_image = serializers.SerializerMethodField()
    secondary_image = serializers.SerializerMethodField()

    def get_primary_image(self, obj):
        img = next((i for i in obj.images.all() if i.is_primary), None) or obj.images.first()
        return img.image.url if img else None

    def get_secondary_image(self, obj):
        img = next((i for i in obj.images.all() if not i.is_primary), None)
        return img.image.url if img else None

    class Meta:
        model = Perfume
        fields = ['id', 'name', 'brand', 'price', 'collection', 'primary_image', 'secondary_image', 'slug']

class DecantSerializer(serializers.ModelSerializer):
    available_stock = serializers.ReadOnlyField()
    class Meta:
        model = Decant
        fields = ['id','size', 'price','available_stock']

class SillageSerializer(serializers.Serializer):
    level = serializers.CharField()
class LongevitySerializer(serializers.Serializer):
    level = serializers.CharField()

class PerfumeSerializer(serializers.ModelSerializer):

    type = serializers.CharField(source='get_type_display', read_only=True)
    notes = PerfumeNoteSerializer(source='perfumenote_set', many=True, read_only=True)
    brand = BrandSerializer()
    family = FamilySerializer(many=True)
    images = PerfumeImageSerializer(many=True, read_only=True)
    decant = DecantSerializer(source='decant_set', many=True, read_only=True)
    longevity = LongevitySerializer(read_only=True)
    sillage = SillageSerializer(read_only=True)
    available_stock = serializers.ReadOnlyField()

    class Meta:
        model = Perfume
        fields = [
            'id', 'type', 'name', 'brand', 'price', 'description',
            'family', 'notes', 'gender', 'slug', 'images',
            'decant', 'longevity', 'sillage', 'available_stock','collection','full_bottle_size'
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        brand = data.pop('brand')
        data['brand'] = brand['name']


        family = data.pop('family')
        data['family'] = [f['name'] for f in family]
        
        notes = data.pop('notes')
        data['notes'] = {
            'top': [n['note']['name'] for n in notes if n['type'] == 'top'],
            'middle': [n['note']['name'] for n in notes if n['type'] == 'middle'],
            'base': [n['note']['name'] for n in notes if n['type'] == 'base'],
        }
        return data

class AtomizerVariantSerializer(serializers.ModelSerializer):
    available_stock = serializers.ReadOnlyField()
    class Meta:
        model = AtomizerVariant
        fields = ['id','size', 'price','colors','available_stock','image']


class AtomizerSerializer(serializers.ModelSerializer):
    variants = AtomizerVariantSerializer(many=True,read_only=True)
    class Meta:
        model = Atomizer
        fields = ['id','name','description','is_premium','variants']

class ThriftSerializer(serializers.ModelSerializer):
    image = PerfumeImageSerializer(source='perfume.images', many=True, read_only=True)
    perfume_name = serializers.CharField(source='perfume.name', read_only=True)
    brand = serializers.CharField(source='perfume.brand.name', read_only=True)
    perfume_id = serializers.IntegerField(source='perfume.id',read_only= True)
    available_stock = serializers.ReadOnlyField()
    class Meta:
        model = Thrift
        fields = ['id','perfume_id','perfume_name','brand','remaining_juice', 'thrift_price','image','available_stock']


