import uuid
from django.db import models


class Website(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    description = models.TextField(null=True)
    image = models.CharField(max_length=50, null=True)
    deleted_at = models.DateTimeField

    class Meta:
        app_label = 'Website'
        db_table = 'website'


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)

    deleted_at = models.DateTimeField(null=True)
    last_scanned = models.DateTimeField(null=True)

    website = models.ForeignKey(Website, on_delete=models.CASCADE, null=True)

    class Meta:
        app_label = 'Page'
        db_table = 'page'


class PageSpeed(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.CharField(max_length=50, null=False)

    deleted_at = models.DateTimeField
    created_at = models.DateTimeField

    page = models.ForeignKey(Page, on_delete=models.CASCADE)

    class Meta:
        app_label = 'PageSpeed'
        db_table = 'page_speed'


class Block(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=True)

    updated_at = models.DateTimeField
    deleted_at = models.DateTimeField
    created_at = models.DateTimeField

    page = models.ForeignKey(Page, on_delete=models.CASCADE)

    class Meta:
        app_label = 'Block'
        db_table = 'block'


class Link(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50, null=False)
    status = models.CharField(max_length=50, null=False)

    block = models.ForeignKey(Block, on_delete=models.CASCADE)

    class Meta:
        app_label = 'Link'
        db_table = 'link'


class Content(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=True)
    status = models.CharField(max_length=50, null=False)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, null=False)
    db_table = 'content'

    class Meta:
        app_label = 'Content'


class Result(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=True)
    status = models.CharField(max_length=50, null=False)

    block = models.ForeignKey(Block, on_delete=models.CASCADE, null=False)

    class Meta:
        app_label = 'Meta'
        db_table = 'auth_permission'
