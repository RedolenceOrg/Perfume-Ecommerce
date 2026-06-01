from django.http import HttpResponse

def home(request):
    return HttpResponse("Redolence Nepal Backend")

def about(request):
    return HttpResponse("This is the about page.")