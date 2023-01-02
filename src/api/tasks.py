from celery import shared_task

from src.api.models import Scan
from src.api.utils import start_scan


@shared_task()
def check_for_tasks():
    """Check for tasks that haven't started yet """
    scans = Scan.objects.filter(started_at=None)

    for scan in scans:
        start_scan(websiteId=scan.website.id)

