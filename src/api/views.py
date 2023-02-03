from django.db.models import Count
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from src.api.models import Website, Page, Block
from src.api.serializers import WebsiteSerializer, PageSerializer, BlockSerializer, \
    PageWithResultsSerializer
from rest_framework.response import Response
from src.api.utils import schedule_website, schedule_checklist


class WebsiteViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """
    queryset = Website.objects.all().order_by('name')
    serializer_class = WebsiteSerializer

    def get_queryset(self):
        websites = self.queryset.filter()

        return websites

    def perform_create(self, serializer):
        serializer.save()

        # website/checklist/${id}

    @action(methods=['post'], detail=True, url_name='checklist', url_path='checklist')
    def checklist(self, request, pk):
        """
           Schedule a task in based on website id
           """
        schedule = schedule_checklist(websiteId=pk)
        return Response(data='Scheduled', status=status.HTTP_201_CREATED, content_type="application/json")

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

    @action(methods=['get'], detail=True, url_name='results', url_path='results')
    def results(self, request, pk):
        """
           Return a results of the test
        """
        if pk:
            queryset = Page.objects.filter(id=pk)
            serializer = PageWithResultsSerializer(queryset, many=True)

            return Response(serializer.data)

        return Response(data='No website_id provided', status=status.HTTP_201_CREATED, content_type="application/json")

    def get_queryset(self):

        # Return all pages with from a website
        if self.request.GET.get('website_id'):
            id = self.request.GET.get('website_id')
            pages = Page.objects.filter(website__id=id)

        # Return a page with all the content blocks
        elif self.request.GET.get('blocks') == 'true':
            id = self.request.GET.get('page_id')
            # I know, it isnt pages, they are blocks
            pages = Page.objects.filter(id=id)
        # Return all pages of a specific page
        elif self.request.GET.get('page_id'):
            id = self.request.GET.get('page_id')
            pages = Page.objects.filter(id=id)

        # Return all pages
        else:
            pages = self.queryset.filter()

        return pages


class BlockViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """
    queryset = Block.objects.all().order_by('name')
    serializer_class = BlockSerializer

    def get_queryset(self):
        return self.queryset.filter()
