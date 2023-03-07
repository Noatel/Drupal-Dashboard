import datetime
import uuid

import django
from django.db import models
from django.db.models import JSONField
from django.db.models.signals import post_save
from django.dispatch import receiver
from model_utils import Choices
from setuptools._entry_points import _


class Website(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    description = models.TextField(null=True)
    image = models.CharField(max_length=255, null=True)

    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name


@receiver(post_save, sender=Website)
def create_checklist(sender, instance, **kwargs):
    checklist = Checklist.objects.get_or_create(website=instance)


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
    TYPE = Choices(
        (1, 'PAGE_TEST', _('Page test')),
        (2, 'STRESS_TEST', _('Stress test')),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, null=False, related_name='page_speed')

    type = models.CharField(max_length=50, null=False, choices=TYPE)
    v_users = models.IntegerField(max_length=50, null=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    amount = models.DecimalField(max_digits=50, null=True, decimal_places=2)

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
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name='content', null=False, default=3)

    def __str__(self):
        return self.block.name


class Result(models.Model):
    STATUS = Choices(
        (1, 'UNCHANGED', _('Unchanged')),
        (2, 'EDITED', _('Edited')),
        (3, 'DELETED', _('Deleted')),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group_id = models.UUIDField(null=False, editable=False)
    data = JSONField()
    status = models.CharField(max_length=50, null=False, choices=STATUS)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, null=False, related_name='results', default=3)
    checked = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return self.status


class Scan(models.Model):
    STATUS = Choices(
        (1, 'SITEMAP', _('Sitemap')),
        (2, 'GET_DATA', _('Get the data')),
        (3, 'COMPARE_BLOCKS', _('Compare the blocks and check for deleted blocks')),
        (4, 'COMPLETED', _('Completed')),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=50, null=False, choices=STATUS)

    website = models.ForeignKey(Website, on_delete=models.CASCADE, null=True, related_name='scan', default=3)

    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    scheduled_at = models.DateTimeField(blank=True, null=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)


class Checklist(models.Model):
    STATUS = ((
        ('NOT_STARTED', _('Not started')),
        ('SITEMAP', _('Sitemap')),
        ('ROBOTS', _('Robots')),
        ('METATAGS', _('Meta tags')),
        ('GOOGLE', _('Google Analytics')),
        ('NICEURL', _('Nice urls')),
        ('COMPLETED', _('Completed')),
    ))
    status = models.CharField(max_length=50, null=False, choices=STATUS, default=1)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    website = models.ForeignKey(Website, on_delete=models.CASCADE, null=True, related_name='checklist', default=3)


class Task(models.Model):
    TYPE = ((
        ('NOT_STARTED', _('Not started')),
        ('SITEMAP', _('Sitemap')),
        ('ROBOTS', _('Robots')),
        ('METATAGS', _('Meta tags')),
        ('GOOGLE', _('Google Analytics')),
        ('NICEURL', _('Nice urls')),
    ))

    STATUS = ((
        ('NOT_STARTED', _('Not started')),
        ('SUCCESS', _('Success')),
        ('FAILED', _('Failed')),
    ))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    check_list = models.ForeignKey(Checklist, on_delete=models.CASCADE, null=True, related_name='task', default=3)
    comment = models.CharField(max_length=255, null=True)

    type = models.CharField(max_length=50, null=False, choices=TYPE, default=1)
    status = models.CharField(max_length=50, null=False, choices=STATUS, default=1)

    created_at = models.DateTimeField(default=django.utils.timezone.now)
    completed_at = models.DateTimeField(blank=True, null=True)


class PageValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    value = JSONField()

    def __str__(self):
        return self.value


class PageResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, null=False, related_name='page_results', default=3)
    page_value = models.ForeignKey(PageValue, on_delete=models.CASCADE, null=False, related_name='page_result',
                                   default=3)

    attribute = models.CharField(max_length=255, null=True)
    className = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.attribute
