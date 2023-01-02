from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.decorators import action

from src.api.models import Website, Page
from src.api.serializers import WebsiteSerializer, PageSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from src.api.utils import schedule_website


class WebsiteViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """
    queryset = Website.objects.all().order_by('name')
    serializer_class = WebsiteSerializer

    def perform_create(self, serializer):
        serializer.save()

    def get_queryset(self):
        return self.queryset.filter()

    @action(methods=['post'], detail=True)
    def schedule(self, request, pk):
        """
        Schedule a task in based on website id
        """

        schedule = schedule_website(websiteId=pk)

        return Response(data='Scheduled', status=status.HTTP_201_CREATED, content_type="application/json")


class PageViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """
    queryset = Page.objects.all().order_by('name')
    serializer_class = PageSerializer

    def get_queryset(self):
        if self.request.GET.get('website_id'):
            id = self.request.GET.get('website_id')
            pages = Page.objects.filter(website__id=id)
        else:
            pages = self.queryset.filter()

        return pages
