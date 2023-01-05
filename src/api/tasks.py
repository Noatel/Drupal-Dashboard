from datetime import datetime
from celery import shared_task

from afstudeerOpdracht.celery_app import app as celery_app
from src.api.models import Scan
from src.api.utils import start_scan


@shared_task(name='Check for scans')
@celery_app.task(shared=True)
def check_for_scans():
    """Check for tasks that haven't started yet """
    scans = Scan.objects.filter(started_at=None)

    print('currently {} scans found'.format(len(scans)))
    for scan in scans:
        print(scan.id)
        scan.started_time = datetime.now()
        scan.save()

        start_scan(websiteId=scan.website.id).delay()


@shared_task(name='testing')
@celery_app.task(shared=True)
def hello():
    print("Hello there!")
