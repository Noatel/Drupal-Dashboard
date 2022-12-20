from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from . import views
from .views import RegisterUserAPIView, UserDetailAPI

router = routers.DefaultRouter()
router.register(r'websites', views.WebsiteViewSet, 'api')
router.register(r'pages', views.PageViewSet, 'page')

urlpatterns = [
    path('', include(router.urls)),

    path("get-details", UserDetailAPI.as_view()),
    path('register', RegisterUserAPIView.as_view()),
]
