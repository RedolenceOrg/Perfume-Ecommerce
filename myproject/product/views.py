
from rest_framework.views import APIView
from django.db.models import Count
from rest_framework.response import Response
from .serializers import AtomizerSerializer, PerfumeListSerializer, PerfumeSerializer, ThriftSerializer
from .models import Atomizer, AtomizerVariant, Perfume, Thrift

class getPerfumeHome(APIView):
    def get(self,request):
        new_arrivals = Perfume.objects.order_by('-date_added')[:10]
        restocked = Perfume.objects.filter(is_restocked=True)
        seasonal = Perfume.objects.filter(is_seasonal_pick =True)
        data = {
            'new_arrivals': PerfumeListSerializer(new_arrivals, many=True).data,
            'restocked': PerfumeListSerializer(restocked, many=True).data,
            'seasonal': PerfumeListSerializer(seasonal, many=True).data
        }
        return Response(data)
class FilterOptionsView(APIView):
    def get(self, request):
        brands = Perfume.objects.values_list('brand__name', flat=True).distinct()
        notes = Perfume.objects.values_list('note__name', flat=True).distinct()
        family = Perfume.objects.values_list('family__name', flat=True).distinct()
        types = Perfume.objects.values_list('type', flat=True).distinct()
        data = {
            'types': types,
            'brands': brands,
            'notes': notes,
            'families': family
        }
        return Response(data)
class ShopView(APIView):
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 12))
        
        # Get filters from query params
        brand = request.query_params.get('brand')
        family = request.query_params.get('family')
        notes = request.query_params.getlist('note')
        price_max = request.query_params.get('price_max')
        gender = request.query_params.get('gender')
        perfume_type = request.query_params.get('type')
        perfumes = Perfume.objects.all()

        # Apply filters
        if perfume_type:
            perfumes = perfumes.filter(type__iexact=perfume_type)
        if brand:
            perfumes = perfumes.filter(brand__name=brand)
        if family:
            perfumes = perfumes.filter(family__name=family)
        if notes:
            for note in notes:
                perfumes = perfumes.filter(note__name=note)
        if price_max:
            perfumes = perfumes.filter(price__lte=price_max)
        if gender:
            perfumes = perfumes.filter(gender__iexact=gender)

        # Pagination
        start = (page - 1) * limit
        end = start + limit
        total = perfumes.count()

        serializer = PerfumeListSerializer(perfumes[start:end], many=True)

        return Response({
            'perfumes': serializer.data,
            'total': total,
            'page': page,
            'has_more': end < total
        })
class PerfumeDetailView(APIView):
    def get(self, request, slug):
        perfume = Perfume.objects.get(slug=slug)
        serializer = PerfumeSerializer(perfume)
        return Response(serializer.data)


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
    
class AtomizerPage(APIView):
    def get(self, request):
        atomizers = Atomizer.objects.all().prefetch_related('variants')
        serializer = AtomizerSerializer(atomizers, many=True)
        return Response(serializer.data)
    
class ThriftPage(APIView):
    def get(self, request):
        thrifts = Thrift.objects.filter(stock__gt=0).select_related('perfume').prefetch_related('perfume__images')
        serializer = ThriftSerializer(thrifts, many=True)
        return Response(serializer.data)