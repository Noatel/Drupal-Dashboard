from django.db.models import Count
from django.http import JsonResponse
from rest_framework import viewsets, status, pagination, mixins
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination

from src.api.models import Website, Page, Block, PageResult
from src.api.serializers import WebsiteSerializer, PageSerializer, BlockSerializer, \
    PageWithResultsSerializer, WebsiteWithPagesSerializer, WebsiteWithChecklistSerializer, PageResultsSerializer
from rest_framework.response import Response
from src.api.utils import schedule_website, schedule_checklist


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


class WebsiteViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
       API endpoint that allows components to create
    """

    queryset = Website.objects.all().order_by('name')
    serializer_class = WebsiteSerializer
    pagination_class = StandardResultsSetPagination
    paginator = PageNumberPagination()

    def get_queryset(self):
        websites = self.queryset.filter()
        return websites

    @action(methods=['get'], detail=True, url_name='pages', url_path='pages')
    def pages(self, request, pk):
        if pk:
            queryset = Page.objects.filter(website_id=pk)
            serializer = PageWithResultsSerializer(queryset, many=True)

            return JsonResponse(serializer.data)

        return Response(data='No website_id provided', status=status.HTTP_201_CREATED, content_type="application/json")

    @action(methods=['get'], detail=True, url_name='check', url_path='check')
    def check(self, request, pk):
        if pk:
            queryset = self.queryset.filter(id=pk)
            serializer = WebsiteWithChecklistSerializer(queryset, many=True)

            return Response(serializer.data)

        return Response(data='No website_id provided', status=status.HTTP_201_CREATED, content_type="application/json")

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

    class StandardResultsSetPagination(PageNumberPagination):
        page_size = 10
        page_size_query_param = 'page_size'
        max_page_size = 1000

    queryset = Page.objects.all().order_by('name')
    serializer_class = PageWithResultsSerializer
    pagination_class = StandardResultsSetPagination
    paginator = PageNumberPagination()

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


    @action(methods=['get'], detail=True, url_name='blocks', url_path='blocks')
    def results(self, request, pk):
        """
           Return a results of the test
        """
        if pk:
            queryset = Page.objects.filter(id=pk)
            serializer = PageSerializer(queryset, many=True)

            return Response(serializer.data)

        return Response(data='No website_id provided', status=status.HTTP_201_CREATED, content_type="application/json")

    def get_queryset(self):

        # Return all pages with from a website
        if self.request.GET.get('website_id'):
            id = self.request.GET.get('website_id')
            pages = Page.objects.filter(website__id=id)

        # Return a page with all the content blocks
        elif self.request.GET.get('blocks') == 'true':
            pass
            # pages = self.queryset.filter()
            # serializer = PageSerializer(queryset, many=True)

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


class UnlimtedSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ResultViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """

    queryset = PageResult.objects.all()
    serializer_class = PageResultsSerializer
    pagination_class = UnlimtedSetPagination
    paginator = PageNumberPagination()

    def get_queryset(self):
        # Return all pages with from a website
        if self.request.GET.get('page_id'):
            id = self.request.GET.get('page_id')
            page_results = PageResult.objects.filter(page__id=id)
        else:
            page_results = self.queryset.filter()
        return page_results
