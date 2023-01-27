from rest_framework import serializers
from src.api.models import Website, Page, Block, Content, Result, Task, Checklist


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


class WebPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'name', 'url']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'status', 'type', 'comment']


class ChecklistSerializer(serializers.ModelSerializer):
    task = TaskSerializer(many=True)

    class Meta:
        model = Checklist
        fields = ['id', 'task']


class WebsiteSerializer(serializers.ModelSerializer):
    pages = WebPageSerializer(many=True)
    checklist = ChecklistSerializer(many=True)

    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image', 'pages', 'checklist']
