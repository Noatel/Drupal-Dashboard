from rest_framework import serializers
from src.api.models import Website, Page


class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ('id', 'name', 'description', 'url', 'image')


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('id', 'name', 'url')
