from django.urls import path, include
from rest_framework.routers import DefaultRouter

from src.api.views import WebsiteViewSet, PageViewSet

router = DefaultRouter()
router.register('websites', WebsiteViewSet, basename='website')
router.register('pages', PageViewSet, basename='page')

api_urlpatterns = [
    path('', include(router.urls)),
    path('websites/{id}/pages', include(router.urls)),
]
