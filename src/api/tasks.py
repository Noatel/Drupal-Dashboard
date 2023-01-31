from datetime import datetime

from celery import shared_task
from django.db.models import Q

from src.api.models import Website, Scan, Checklist
from src.api.utils import schedule_website, check_live_blocks, check_all


@shared_task(name='testing')
def hello():
    print("Hello there!")


@shared_task(name='schedule all websites')
def schedule_all_websites():
    websites = Website.objects.all()

    for website in websites:
        schedule_website(website.id).delay()


@shared_task(name='check_for_scans')
def check_for_scans():
    """Check for tasks that haven't started yet """
    scans = Scan.objects.filter(completed_at=None)

    for scan in scans:
        scan.started_at = datetime.now()
        scan.save(update_fields=['started_at'])
        websiteId = scan.website.id
        check_live_blocks(websiteId=websiteId).delay()

        scan.completed_at = datetime.now()
        scan.save()
        scan.save(update_fields=['completed_at'])


@shared_task(name='check_for_deleted_blocks')
def check_for_deleted_blocks():
    """Check for deleted contenblocks """
    pass
    # scans = Scan.objects.filter(started_at=None)
    #
    # print('currently {} scans found'.format(len(scans)))
    # for scan in scans:
    #     print(scan.id)
    #     scan.started_time = datetime.now()
    #     scan.save()
    #
    #     check_live_blocks(websiteId=scan.website.id).delay()


@shared_task(name='check_for_checklist')
def check_for_checklist():
    """Check for tasks that haven't completed yet """
    checklists = Checklist.objects.filter(~Q(status=6))

    for checklist in checklists:
        check_all(websiteId=checklist.website_id)
