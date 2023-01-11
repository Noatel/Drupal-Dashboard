from rest_framework import serializers
from src.api.models import Website, Page, Block, Content


class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['id', 'name', 'description', 'url', 'image']


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'content']


class BlockSerializer(serializers.ModelSerializer):
    content = ContentSerializer(many=True)

    class Meta:
        model = Block
        fields = ['id', 'name', 'type', 'content']


class PageSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True)

    class Meta:
        model = Page
        fields = ['id', 'name', 'url', 'blocks']
