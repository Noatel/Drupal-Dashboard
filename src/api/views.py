from django.db.models import Count, Q, Sum
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, pagination, mixins, filters
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination

from src.api.models import Website, Page, Block, PageResult, Result, PageSpeed, Task
from src.api.serializers import WebsiteSerializer, PageSerializer, BlockSerializer, \
    PageWithResultsSerializer, WebsiteWithPagesSerializer, WebsiteWithChecklistSerializer, PageResultsSerializer, \
    WebsiteWithProblemsSerializer, WebsiteWithEditsSerializer, WebsiteAllProblemsSerializer
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

    @action(methods=['get'], detail=True, url_name='known_issues', url_path='known_issues')
    def known_issues(self, request, pk):
        if pk:
            total_count = \
                PageResult.objects.exclude(attribute='meta').filter(page__website=pk).aggregate(
                    count=Count('attribute'))[
                    'count']
            return Response(total_count)

    def list(self, request, *args, **kwargs):
        if self.request.GET.get('problems'):

            serializer = WebsiteWithProblemsSerializer(self.queryset, many=True)
            return Response(serializer.data)
        elif self.request.GET.get('all_test'):
            page_results = PageResult.objects.count()
            results = Result.objects.count()
            page_speed = PageSpeed.objects.count()
            task = Task.objects.count()

            count = page_results + results + page_speed + task

            return Response(count)

        elif self.request.GET.get('all_known_issues'):
            total_count = PageResult.objects.exclude(attribute='meta').aggregate(count=Count('attribute'))['count']

            return Response(total_count)

        elif self.request.GET.get('all_problems'):
            results = PageResult.objects.values('attribute').filter(~Q(attribute='meta')).annotate(
                count=Count('attribute'))

            # Create a dictionary to store the results
            result = []
            result_dict = {}
            for r in results:
                attribute = r['attribute']
                count = r['count']
                if attribute in result_dict:
                    result_dict[attribute] += count
                else:
                    result_dict[attribute] = count

                result.append({'name': attribute, 'value': count})
            # Convert the dictionary to the desired output format

            return Response(result)

        elif self.request.GET.get('known_issue') and self.request.GET.get('website_id'):
            id = self.request.GET.get('website_id')

            total_count = PageResult.objects.filter(page__website__id=id).exclude(
                attribute='meta').aggregate(count=Count('attribute'))['count']

            return Response(total_count)

        elif self.request.GET.get('test') and self.request.GET.get('website_id'):
            website_id = self.request.GET.get('website_id')
            page_results = PageResult.objects.filter(page__website_id=website_id).count()
            results = Result.objects.filter(block__page__website_id=website_id).count()
            page_speed = PageSpeed.objects.filter(page__website_id=website_id).count()
            task = Task.objects.filter(check_list__website_id=website_id).count()

            count = page_results + results + page_speed + task

            return Response(count)
        elif self.request.GET.get('edit'):
            serializer = WebsiteWithEditsSerializer(self.queryset, many=True)

            return Response(serializer.data)

        # Use the paginator to paginate the queryset
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # If the queryset is not paginated, just serialize it and return the response
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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

    @action(methods=['post'], detail=True, url_name='schedule', url_path='schedule')
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

    queryset = Page.objects.all()
    serializer_class = PageWithResultsSerializer
    pagination_class = StandardResultsSetPagination
    paginator = PageNumberPagination()

    def list(self, request, *args, **kwargs):

        if self.request.GET.get('website_id'):
            pk = self.request.GET.get('website_id')

            queryset = Page.objects.filter(website__id=pk)
        else:
            queryset = super().get_queryset()
        if self.request.GET.get('order'):
            queryset = queryset.annotate(num_related=Count('page_results'))

            if self.request.GET.get('order') == 'true':
                queryset = queryset.order_by("-num_related")
            else:
                queryset = queryset.order_by("num_related")
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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


class ResultViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows components to create
    """

    queryset = PageResult.objects.all()
    serializer_class = PageResultsSerializer
    paginator = None

    def get_queryset(self):
        # Return all pages with from a website
        if self.request.GET.get('page_id'):
            id = self.request.GET.get('page_id')
            page_results = PageResult.objects.filter(page__id=id)
        else:
            page_results = self.queryset.filter()
        return page_results
