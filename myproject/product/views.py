
from rest_framework.views import APIView
from django.db.models import Count
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from myproject.utils import conditional_ratelimit
from .serializers import AtomizerSerializer, PerfumeListSerializer, PerfumeSerializer, ThriftSerializer
from .models import Atomizer, AtomizerVariant, Perfume, Thrift


@method_decorator(conditional_ratelimit(rate='40/m'), name='get')
class getPerfumeHome(APIView):
    def get(self, request):
        base_qs = Perfume.objects.select_related('brand').prefetch_related('images')

        new_arrivals = base_qs.order_by('-date_added')[:10]
        restocked = base_qs.filter(is_restocked=True)
        seasonal = base_qs.filter(is_seasonal_pick=True)

        return Response({
            'new_arrivals': PerfumeListSerializer(new_arrivals, many=True).data,
            'restocked': PerfumeListSerializer(restocked, many=True).data,
            'seasonal': PerfumeListSerializer(seasonal, many=True).data,
        })
    
@method_decorator(conditional_ratelimit(rate='40/m'), name='get')
class FilterOptionsView(APIView):
    def get(self, request):
        from .models import Brand, Notes, Family

        return Response({
            'brands': list(Brand.objects.values_list('name', flat=True)),
            'notes': list(Notes.objects.values_list('name', flat=True)),
            'families': list(Family.objects.values_list('name', flat=True)),
            'types': ['Perfume', 'Attar'],
        })
    
@method_decorator(conditional_ratelimit(rate='60/m'), name='get')
class ShopView(APIView):
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 12))

        brand = request.query_params.get('brand')
        family = request.query_params.getlist('family')
        notes = request.query_params.getlist('note')
        price_max = request.query_params.get('price_max')
        price_min = request.query_params.get('price_min')
        gender = request.query_params.get('gender')
        perfume_type = request.query_params.get('type')
        perfume_collections = request.query_params.getlist('collection')

        perfumes = Perfume.objects.select_related('brand').prefetch_related('images')

        if perfume_type:
            perfumes = perfumes.filter(type__iexact=perfume_type)
        if perfume_collections:
            perfumes = perfumes.filter(collection__in=perfume_collections)
        if brand:
            perfumes = perfumes.filter(brand__name=brand)
        if family:
            for fam in family:
                perfumes = perfumes.filter(family__name=fam)
        if notes:
            for note in notes:
                perfumes = perfumes.filter(note__name=note)
        if price_min:
            perfumes = perfumes.filter(price__gte=price_min)
        if price_max:
            perfumes = perfumes.filter(price__lte=price_max)
        if gender:
            perfumes = perfumes.filter(gender__iexact=gender)

        # ✅ distinct only when M2M filters are applied (they cause duplicate rows)
        if family or notes:
            perfumes = perfumes.distinct()

        start = (page - 1) * limit
        end = start + limit
        total = perfumes.count()

        return Response({
            'perfumes': PerfumeListSerializer(perfumes[start:end], many=True).data,
            'total': total,
            'page': page,
            'has_more': end < total,
        })
    
@method_decorator(conditional_ratelimit(rate='60/m'), name='get')
class PerfumeDetailView(APIView):
    def get(self, request, slug):
        try:
            perfume = Perfume.objects.select_related('brand', 'longevity', 'sillage') \
                .prefetch_related('family', 'images', 'decant_set', 'perfumenote_set__note') \
                .get(slug=slug)
        except Perfume.DoesNotExist:
            return Response(status=404)

        data = PerfumeSerializer(perfume).data
        all_notes = (
            data['notes']['top'] +
            data['notes']['middle'] +
            data['notes']['base']
        )

        related = Perfume.objects.filter(note__name__in=all_notes) \
                .exclude(slug=slug) \
                .select_related('brand') \
                .prefetch_related('images') \
                .annotate(match_count=Count('note', distinct=True)) \
                .order_by('-match_count')[:10]

        return Response({
            'perfume': data,
            'related': PerfumeListSerializer(related, many=True).data
        })


@method_decorator(conditional_ratelimit(rate='60/m'), name='get')
class RelatedPerfumesView(APIView):
    def get(self, request):
        notes = request.query_params.getlist('note')
        exclude_slug = request.query_params.get('exclude')
        
        perfumes = Perfume.objects.filter(note__name__in=notes)\
            .exclude(slug=exclude_slug)\
            .annotate(match_count=Count('note'))\
            .order_by('-match_count')[:10]
        
        serializer = PerfumeListSerializer(perfumes, many=True)
        return Response(serializer.data)

@method_decorator(conditional_ratelimit(rate='40/m'), name='get')    
class AtomizerPage(APIView):
    def get(self, request):
        atomizers = Atomizer.objects.all().prefetch_related('variants')
        serializer = AtomizerSerializer(atomizers, many=True)
        return Response(serializer.data)

@method_decorator(conditional_ratelimit(rate='40/m'), name='get')   
class ThriftPage(APIView):
    def get(self, request):
        thrifts = Thrift.objects.filter(stock__gt=0).select_related('perfume').prefetch_related('perfume__images')
        serializer = ThriftSerializer(thrifts, many=True)
        return Response(serializer.data)