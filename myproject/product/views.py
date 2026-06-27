
from rest_framework.views import APIView
from django.db.models import Count
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from myproject.utils import conditional_ratelimit
from .serializers import AtomizerSerializer, PerfumeListSerializer, PerfumeSerializer, ThriftSerializer
from .models import Atomizer, Perfume, Thrift,Notes
import json
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.mixins import LoginRequiredMixin
import cohere
from decouple import config

co = cohere.ClientV2(api_key = config('AI_API_KEY'))


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
    
# @method_decorator(csrf_protect, name='dispatch')
# @method_decorator(conditional_ratelimit(rate='1/hr'), name='post')
class recommender(LoginRequiredMixin, View):        
    def dispatch(self, request, *args, **kwargs):

        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required to use the scent finder."}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

        db_notes = list(Notes.objects.values_list("name", flat=True))

        # ── Prompt 1: Normalize (Using direct, flat text output model) ───────────────────
        p1_prompt = f"""You are a perfume filter normalizer.
Given these raw survey answers: {json.dumps(body)}

Return a JSON object with ONLY these keys:
- gender: "male" | "female" | "unisex"
- price_max: number or null
- collection: array from ["niche", "designer", "middle_eastern", "in_house"]
- family: array from ["Floral", "Amber", "Woody", "Fresh", "Oriental", "Citrus", "Musk", "Gourmand"]
- notes: array matched ONLY from this list: {json.dumps(db_notes)}

Map the user's free-text notes to the closest matches in the list."""

        try:
            p1 = co.chat(
                model="command-a-03-2025",  # Clean, no reasoning shenanigans
                messages=[{"role": "user", "content": p1_prompt}],
                response_format={"type": "json_object"}
            )
            # Access content directly since standard models don't return reasoning chunks
            filters = json.loads(p1.message.content[0].text)
        except Exception as e:
            return JsonResponse({"error": "Failed to parse filter normalizer", "details": str(e)}, status=500)
        
        print(filters)
       # ── DB Query ──────────────────────────────────────────────────────────────
        qs = Perfume.objects.select_related('brand').prefetch_related('images')

        if filters.get("gender"):
            qs = qs.filter(gender__iexact=filters["gender"])
            
        if filters.get("price_max"):
            qs = qs.filter(price__lte=filters["price_max"])

        if filters.get("collection"):
            qs = qs.filter(collection__in=filters["collection"])

        # FIX: Use __in to fetch perfumes matching ANY of the families/notes, then use distinct()
        if filters.get("family"):
            qs = qs.filter(family__name__in=filters["family"])

        if filters.get("notes"):  # Note the match with filters dict key
            qs = qs.filter(note__name__in=filters["notes"]) # 'note' matches your model field name

        # Always apply distinct if we filtered by ManyToMany to avoid duplicate rows
        if filters.get("family") or filters.get("notes"):
            qs = qs.distinct()

        # Let's pull the fields we need
        perfumes = list(qs.values("id", "name", "brand__name", "price", "collection", "slug")[:10])
        
        if not perfumes:
            return JsonResponse({"recommendations": []})

        for p in perfumes:
            if p.get("price") is not None:
                p["price"] = float(p["price"])

        print(perfumes)
        if not perfumes:
            return JsonResponse({"recommendations": []})

        # ── Prompt 2: Rank & pick top 3 ───────────────────────────────────────────
        p2_prompt = f"""You are a luxury perfume consultant.
Given this occasion: "{body.get('occasion')}"
And these candidate perfumes: {json.dumps(perfumes)}

Pick the top 3 best fits for the occasion.
Return a JSON object with key "recommendations": array of exactly 3 objects, each with:
- name: string
- brand: string
- reason: one sentence explaining why it fits the occasion
- slug: string (copy exactly from input)"""

        try:
            p2 = co.chat(
                model="command-a-03-2025",
                messages=[{"role": "user", "content": p2_prompt}],
                response_format={"type": "json_object"}
            )
            result = json.loads(p2.message.content[0].text)
        except Exception as e:
            return JsonResponse({"error": "Failed to generate recommendations", "details": str(e)}, status=500)
        
        # Build strict relative routing properties for your Next.js frontend links
        for rec in result.get("recommendations", []):
            if rec.get("slug"):
                rec["link"] = f"/perfume/{rec['slug']}/"
            else:
                rec["link"] = "#"

        return JsonResponse(result)