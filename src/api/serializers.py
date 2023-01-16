from rest_framework import serializers
from src.api.models import Website, Page, Block, Content, Result


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'content']


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'status', 'data']


class ResultSerializerWithoutData(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'status']


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


class WebsiteSerializer(serializers.ModelSerializer):
    pages = WebPageSerializer(many=True)

    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image', 'pages']
