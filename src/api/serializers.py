from django.db.models import Count
from django_filters.rest_framework import filters, DjangoFilterBackend
from rest_framework import serializers
from src.api.models import Website, Page, Block, Content, Result, Task, Checklist, PageResult, PageValue, PageSpeed


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'content']


class ResultSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Result
        fields = ['id', 'status', 'data', 'created_at']


class ResultSerializerWithoutData(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Result
        fields = ['id', 'status', 'created_at']


class BlockSerializer(serializers.ModelSerializer):
    content = ContentSerializer(many=True)
    results = ResultSerializer(many=True, allow_empty=True)

    class Meta:
        model = Block
        fields = ['id', 'name', 'type', 'content', 'results']


class BlockSerializerWithoutData(serializers.ModelSerializer):
    # content = ContentSerializer(many=True)
    results = ResultSerializerWithoutData(many=True, allow_empty=True)

    class Meta:
        model = Block
        fields = ['id', 'name', 'type', 'content', 'results']


class PageSpeedSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = PageSpeed
        fields = ['created_at', 'amount']


class PageSerializer(serializers.ModelSerializer):
    blocks = BlockSerializerWithoutData(many=True)
    page_speed = PageSpeedSerializer(many=True)

    class Meta:
        model = Page
        fields = ['id', 'name', 'url', 'blocks', 'page_speed']


class PageResultsValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageValue
        fields = ['value']


class PageResultsSerializer(serializers.ModelSerializer):
    page_value = PageResultsValueSerializer()

    class Meta:
        model = PageResult
        fields = ['id', 'attribute', 'className', 'page_value']


class ResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageResult
        fields = ['attribute']


class WebPageSerializer(serializers.ModelSerializer):
    # page_results = ResultsSerializer(many=True)

    class Meta:
        model = Page
        fields = ['id', 'name', 'url']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'status', 'type', 'comment', 'completed_at']


class ChecklistSerializer(serializers.ModelSerializer):
    task = TaskSerializer(many=True)

    class Meta:
        model = Checklist
        fields = ['id', 'task', 'status']


class WebsiteSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image', 'created_at']


class WebsiteWithChecklistSerializer(serializers.ModelSerializer):
    checklist = ChecklistSerializer(many=True)

    class Meta:
        model = Website
        fields = ['id', 'name', 'checklist']


class WebsiteWithPagesSerializer(serializers.ModelSerializer):
    pages = WebPageSerializer(many=True)
    checklist = ChecklistSerializer(many=True)

    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image', 'pages', 'checklist']


class PageWithResultsSerializer(serializers.ModelSerializer):
    page_results = serializers.SerializerMethodField()
    num_related = serializers.IntegerField(read_only=True)

    class Meta:
        model = Page
        fields = ['id', 'url', 'name', 'page_results', 'num_related']

    def get_page_results(self, obj):
        count = obj.page_results.count()
        return count


class PageWithProblemsSerializer(serializers.ModelSerializer):
    page_results = serializers.SerializerMethodField()
    ordering = ('-page_results',)

    class Meta:
        model = Page
        fields = ['id', 'name', 'page_results']

    def get_page_results(self, obj):
        count = obj.page_results.count()

        return count


class WebsiteWithProblemsSerializer(serializers.ModelSerializer):
    pages = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = ['id', 'name', 'pages']

    def get_pages(self, obj):
        pages_queryset = obj.pages.annotate(num_blocks=Count('page_results')).order_by('-num_blocks')[:3]
        serializer = PageWithProblemsSerializer(pages_queryset, many=True)
        return serializer.data


class BlockWithEditsSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Block
        ordering = ('-created_at',)
        fields = ['id', 'name', 'created_at']


class PageWithEditsSerializer(serializers.ModelSerializer):
    blocks = BlockWithEditsSerializer(many=True)

    class Meta:
        model = Page
        fields = ['id', 'name', 'blocks']


class WebsiteWithEditsSerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField()
    pages = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = ('id', 'name', 'pages', 'results')

    def get_results(self, website):
        blocks = website.pages.values_list('blocks__id', flat=True).exclude(blocks__content=False)
        results = Result.objects.filter(block_id__in=blocks, checked=True).order_by('-created_at')[:5]
        return ResultSerializerWithoutData(results, many=True).data

    def get_pages(self, website):
        return PageSerializer(website.pages.all()[:5], many=True).data


class WebsiteAllProblemsSerializer(serializers.ModelSerializer):
    pages = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = ['id', 'pages']

    def get_pages(self, obj):
        pages_queryset = obj.pages.all().order_by('-created_at')[:5]
        serializer = PageWithEditsSerializer(pages_queryset, many=True)
        return serializer.data
