from django.db.models import Q,F, Exists, OuterRef
from rest_framework.views import APIView
from django.db.models import Count
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from myproject.utils import conditional_ratelimit
from .serializers import AtomizerSerializer, NasalStripSerializer, PerfumeListSerializer, PerfumeSerializer, ThriftSerializer
from .models import Atomizer, Decant, NasalStrip, Perfume, Thrift,Notes
import json
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
import cohere
from decouple import config

co = cohere.ClientV2(api_key = config('AI_API_KEY'))
MAX_CANDIDATES = 15

from django.db.models import Exists, OuterRef


@method_decorator(conditional_ratelimit(rate='40/m'), name='get')
class getPerfumeHome(APIView):
    def get(self, request):
        decant_in_stock = Decant.objects.filter(
            perfume=OuterRef('pk'),
            stock__gt=F('reserved')
        )

        base_qs = (
            Perfume.objects
            .select_related('brand')
            .prefetch_related('images')
            .annotate(
                has_decant_stock=Exists(decant_in_stock)
            )
            .filter(
                Q(stock__gt=F('reserved')) |
                Q(has_decant_stock=True)
            )
        )

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
        from .models import Brand, Notes, Family,Decant

        return Response({
            'brands': list(Brand.objects.values_list('name', flat=True)),
            'notes': list(Notes.objects.values_list('name', flat=True)),
            'families': list(Family.objects.values_list('name', flat=True)),
            'types': ['Perfume', 'Attar'],
            'decant_sizes': list(
                Decant.objects.order_by('size')
                .values_list('size', flat=True)
                .distinct()
            ),
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
        decant_sizes = request.query_params.getlist('decant_size')

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

        if decant_sizes:
            matching_decant = Decant.objects.filter(
                perfume=OuterRef('pk'),
                size__in=decant_sizes,
                stock__gt=F('reserved'),
            )
            perfumes = perfumes.filter(Exists(matching_decant))

        # NEW: global stock gate — only show a perfume if EITHER the full bottle
        # has stock, OR at least one decant (any size) has stock.
        any_decant_in_stock = Decant.objects.filter(
            perfume=OuterRef('pk'),
            stock__gt=F('reserved'),
        )
        perfumes = perfumes.annotate(
            has_stock_decant=Exists(any_decant_in_stock)
        ).filter(
            Q(stock__gt=F('reserved')) | Q(has_stock_decant=True)
        )

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
        thrifts = Thrift.objects.filter(stock__gt=0).select_related('perfume')
        serializer = ThriftSerializer(thrifts, many=True)
        return Response(serializer.data)
    

@method_decorator(csrf_protect, name='dispatch')   
@method_decorator(conditional_ratelimit(rate='40/m'), name='get')
class WellBeingPage(APIView):
    def get(self, request):
        nasal_strips = NasalStrip.objects.all()
        serializer = NasalStripSerializer(nasal_strips, many=True)
        return Response(serializer.data)


@method_decorator(csrf_protect, name='dispatch')   
@method_decorator(conditional_ratelimit(rate='40/m'), name='get')
class SearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=400)

        words = query.split()
        if len(words) > 10:
            return Response({"error": "Query parameter 'q' can contain a maximum of 10 words."}, status=400)
        q_filter = Q()
        for word in words:
            q_filter &= (Q(name__icontains=word) | Q(brand__name__icontains=word))

        perfumes = (
            Perfume.objects
            .filter(q_filter)
            .select_related('brand')
            .prefetch_related('images')
            .distinct()[:10]
        )
        serializer = PerfumeListSerializer(perfumes, many=True)
        return Response(serializer.data)
    
@method_decorator(conditional_ratelimit(rate='10/hr'), name='post')
@method_decorator(csrf_protect, name='dispatch')
class recommender(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required to use the scent finder."}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

        message = body.get("message")
        if message:
            return self._handle_followup(request, body, message)
        return self._handle_initial(request, body)

    # ── survey submission ──────────────────────────────────────────────
    def _handle_initial(self, request, body):
        filters = self._normalize_filters(body)
        if filters is None:
            return JsonResponse({"error": "Failed to parse filter normalizer"}, status=500)

        candidates = self._query_candidates(filters)

        if not candidates:
            request.session["scent_finder"] = {"filters": filters, "candidates": [], "shown": []}
            request.session.modified = True
            return JsonResponse({"recommendations": []})

        result, err = self._rank(occasion=body.get("occasion"), candidates=candidates, instruction=None)
        if err:
            return JsonResponse({"error": "Failed to generate recommendations", "details": err}, status=500)

        picks = result.get("recommendations", [])
        request.session["scent_finder"] = {
            "filters": filters,
            "candidates": candidates,
            "shown": [r["slug"] for r in picks if r.get("slug")],
        }
        request.session.modified = True

        return JsonResponse({"recommendations": self._attach_links(picks)})

    # ── follow-up chat turn ─────────────────────────────────────────────
    def _handle_followup(self, request, body, message):
        state = request.session.get("scent_finder")

        # Session missing/expired — rebuild the pool from the survey answers sent alongside the message
        if not state:
            filters = self._normalize_filters(body)
            if filters is None:
                return JsonResponse({"error": "Failed to parse filter normalizer"}, status=500)
            state = {"filters": filters, "candidates": self._query_candidates(filters), "shown": []}

        all_candidates = state.get("candidates", [])
        shown = state.get("shown", [])

        # Nothing ever matched the original survey — nothing a follow-up can do about that
        if not all_candidates:
            return JsonResponse({
                "reply": "I couldn't find anything matching your original filters, so there's nothing left to refine — try retaking the quiz with a wider budget or different notes.",
                "recommendations": [],
                "exhausted": True,
            })

        remaining = [c for c in all_candidates if c["slug"] not in shown]

        # Pool matched something initially, but we've now shown all of it
        if not remaining:
            return JsonResponse({
                "reply": "That's everything that matched your original filters — retake the quiz to widen the search and see more.",
                "recommendations": [],
                "exhausted": True,
            })

        result, err = self._rank(occasion=body.get("occasion"), candidates=remaining, instruction=message)
        if err:
            return JsonResponse({"error": "Failed to generate recommendations", "details": err}, status=500)

        picks = result.get("recommendations", [])
        new_shown = list(dict.fromkeys(shown + [r["slug"] for r in picks if r.get("slug")]))
        state["shown"] = new_shown
        request.session["scent_finder"] = state
        request.session.modified = True

        # LLM found nothing suitable among what's left, but pool isn't necessarily exhausted
        exhausted = len(new_shown) >= len(all_candidates)

        return JsonResponse({
            "recommendations": self._attach_links(picks),
            "reply": result.get("reply", ""),
            "exhausted": exhausted and not picks,
        })

    # ── helpers ──────────────────────────────────────────────────────────
    def _normalize_filters(self, body):
        db_notes = list(Notes.objects.values_list("name", flat=True))
        prompt = f"""You are a perfume filter normalizer.
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
                model="command-a-03-2025",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            return json.loads(p1.message.content[0].text)
        except Exception:
            return None

    def _query_candidates(self, filters):
        qs = Perfume.objects.select_related("brand").prefetch_related("images", "family", "note")

        if filters.get("gender"):
            qs = qs.filter(gender__iexact=filters["gender"])
        if filters.get("price_max"):
            qs = qs.filter(price__lte=filters["price_max"])
        if filters.get("collection"):
            qs = qs.filter(collection__in=filters["collection"])
        if filters.get("family"):
            qs = qs.filter(family__name__in=filters["family"])
        if filters.get("notes"):
            qs = qs.filter(note__name__in=filters["notes"])
        if filters.get("family") or filters.get("notes"):
            qs = qs.distinct()

        candidates = []
        for p in qs[:MAX_CANDIDATES]:
            candidates.append({
                "id": p.id,
                "name": p.name,
                "brand": p.brand.name,
                "price": float(p.price) if p.price is not None else None,
                "collection": p.collection,
                "slug": p.slug,
                "family": [f.name for f in p.family.all()],   # adjust if `family` is FK, not M2M
                "notes": [n.name for n in p.note.all()],
                "description": p.description or "",
            })
        return candidates

    def _rank(self, occasion, candidates, instruction=None):
        if instruction:
            task = f"""The user already saw some recommendations and just said: "{instruction}"
Use each perfume's description (not just its family/notes tags) to judge fit — e.g. if they say
something is "too sweet," favor descriptions that read drier, woodier, or less gourmand even
within the same scent family, since family/notes were already locked in by their earlier survey answers."""
        else:
            task = f"""Given this occasion: "{occasion or 'general wear'}"
Pick the top 3 best fits for the occasion."""

        prompt = f"""You are a luxury perfume consultant having a conversation with a customer.
Candidate perfumes (already filtered to the customer's gender/budget/collection/family/notes — do not re-filter on these): {json.dumps(candidates)}

{task}

Only recommend perfumes present in the candidate list above — never invent one.
Return a JSON object with:
- reply: one short, conversational sentence acknowledging what the user asked for
- recommendations: array of up to 3 objects, each with name, brand, reason (one sentence, referencing why it fits their feedback), slug (copied exactly from input)
If fewer than 3 good matches exist, return fewer rather than padding with weak fits. If nothing among the candidates fits, return an empty recommendations array and say so in reply."""

        try:
            p2 = co.chat(
                model="command-a-03-2025",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            return json.loads(p2.message.content[0].text), None
        except Exception as e:
            return None, str(e)

    def _attach_links(self, recommendations):
        for rec in recommendations:
            rec["link"] = f"/perfume/{rec['slug']}/" if rec.get("slug") else "#"
        return recommendations