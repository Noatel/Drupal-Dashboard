from django_filters.rest_framework import filters, DjangoFilterBackend
from rest_framework import serializers
from src.api.models import Website, Page, Block, Content, Result, Task, Checklist, PageResult, PageValue


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
    content = ContentSerializer(many=True)
    results = ResultSerializerWithoutData(many=True, allow_empty=True)

    class Meta:
        model = Block
        fields = ['id', 'name', 'type', 'content', 'results']


class PageSerializer(serializers.ModelSerializer):
    blocks = BlockSerializerWithoutData(many=True)

    class Meta:
        model = Page
        fields = ['id', 'name', 'url', 'blocks']


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
    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image', ]


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
    # page_results = PageResultsSerializer(many=True)
    page_results = serializers.SerializerMethodField()
    num_related = serializers.IntegerField(read_only=True)

    class Meta:
        model = Page
        fields = ['id', 'url', 'name', 'page_results','num_related']

    def get_page_results(self, obj):
        count = obj.page_results.count()
        return count
