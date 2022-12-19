import datetime
import uuid

import django
from django.db import models


class Website(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    description = models.TextField(null=True)
    image = models.CharField(max_length=50, null=True)

    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=False)

    last_scanned = models.DateTimeField(null=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    website = models.ForeignKey(Website, on_delete=models.CASCADE, null=True, related_name='pages', default=3)

    def __str__(self):
        return self.url


class PageSpeed(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.CharField(max_length=50, null=False)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    page = models.ForeignKey(Page, on_delete=models.CASCADE)

    def __str__(self):
        return self.page.name


class Block(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=True)

    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True, related_name='blocks', default=3)

    def __str__(self):
        return self.name


class Link(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50, null=False)
    status = models.CharField(max_length=50, null=False)
    block = models.ForeignKey(Block, on_delete=models.CASCADE)

    def __str__(self):
        return self.type


class Content(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=True)
    status = models.CharField(max_length=50, null=False)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, null=False)

    def __str__(self):
        return self.status


class Result(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=True)
    status = models.CharField(max_length=50, null=False)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, null=False)

    def __str__(self):
        return self.status
