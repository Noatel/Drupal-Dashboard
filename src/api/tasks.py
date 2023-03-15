import uuid
from datetime import datetime

from afstudeerOpdracht.celery import app
from celery import shared_task
from django.db.models import Q

from src.api.models import Website, Scan, Checklist
from src.api.utils import schedule_website as u_schedule_website, check_live_blocks as u_check_live_blocks, \
    check_all as u_check_all, \
    activate_test as u_activate_test, \
    scan_page_test as u_scan_page_test


@app.task(shared=True, name='schedule all websites')
def schedule_all_websites():
    websites = Website.objects.all()
    print('yo scheduler iik begin nu met schedulen')
    print(websites)
    print(len(websites))
    for website in websites:
        print('daar ga ik')
        schedule_website.delay(websiteId=website.id)


@app.task(shared=True)
def schedule_website(websiteId=uuid.UUID):
    u_schedule_website(websiteId=websiteId)


@app.task(shared=True)
def check_for_scans():
    """Check for tasks that haven't started yet """
    scans = Scan.objects.filter(completed_at=None)

    for scan in scans:
        activate_test.delay(scanId=scan.id)


@app.task(shared=True)
def activate_test(scanId=uuid.UUID):
    scan = Scan.objects.filter(id=scanId).first()
    scan.started_at = datetime.now()
    scan.save(update_fields=['started_at'])
    u_activate_test(scanId=scan.id)


@app.task(shared=True)
def check_for_deleted_blocks():
    """Check for deleted contenblocks """
    scans = Scan.objects.filter(started_at=None)

    for scan in scans:
        check_live_blocks.delay(scanId=scan.id)


@app.task(shared=True)
def check_live_blocks(scanId=uuid.UUID):
    scan = Scan.objects.filter(id=scanId).first()
    scan.started_time = datetime.now()
    scan.save()

    u_check_live_blocks(websiteId=scan.website.id).delay()


@app.task(shared=True)
def check_for_checklist():
    """Check for tasks that haven't completed yet """
    checklists = Checklist.objects.filter(~Q(status=6))
    for checklist in checklists:
        check_all.delay(websiteId=checklist.website_id)


@app.task(shared=True)
def check_all(websiteId=uuid.UUID):
    u_check_all(websiteId=websiteId)


@app.task(shared=True)
def run_page_scan():
    # TODO: ONLY SPECIFC PAGES NOT ALL
    websites = Website.objects.all()
    for website in websites:
        scan_page_test.delay(websiteId=website.id)


@app.task(shared=True)
def scan_page_test(websiteId=uuid.UUID):
    u_scan_page_test(websiteId=websiteId)


@app.task(shared=True)
def reset_status_for_scans():
    """Check for tasks that haven't started yet """
    scans = Scan.objects.filter(~Q(completed_at=None))

    for scan in scans:
        activate_test.delay(scanId=scan.id)


@app.task(shared=True)
def activate_test(scanId=uuid.UUID):
    scan = Scan.objects.filter(id=scanId).first()
    scan.completed_at = None
    scan.status = Scan.STATUS.SITEMAP
    scan.started_at = datetime.now()
    scan.save(update_fields=['completed_at', 'started_at', 'status'])

    u_activate_test(scanId=scan.id)
