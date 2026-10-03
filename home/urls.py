from django.contrib import admin
from django.urls import path
from .views import printf , sum1 , main_page,home
urlpatterns = [
    path('nima/',printf,name='printf'),
    path('nima2/',sum1,name='sum1'),
    path('saina/',main_page,name='name_page'),
    path('',home,name='home_page'),
    
]
