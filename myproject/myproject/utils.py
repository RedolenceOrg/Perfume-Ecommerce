from decouple import config
from django_ratelimit.decorators import ratelimit
from django.http import JsonResponse

RATE_LIMIT_ENABLED = config('RATE_LIMIT_ENABLED', default=False, cast=bool)

def conditional_ratelimit(key, rate, block=True):
    def decorator(func):
        if RATE_LIMIT_ENABLED:
            return ratelimit(key=key, rate=rate, block=block)(func)
        return func
    return decorator

def ratelimit_exceeded(request, exception=None):
    return JsonResponse(
        {'detail': 'Too many requests, please try again later.'},
        status=429
    )