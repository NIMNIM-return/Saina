from django.shortcuts import render
from django.http import HttpResponse

def printf(request):
    return HttpResponse('<p>salam</p>')

def sum1(request):
    return HttpResponse('<div> <p>salam2</p> </div>')

def main_page(request):
    return render(request=request,template_name='index.html')

from django.shortcuts import render

from .models import Product, Slide


def home(request):
    return render(request, "index.html", {
        "slides": Slide.objects.filter(is_active=True),
        "products": Product.objects.filter(is_active=True, is_featured=True).select_related("category"),
    })
