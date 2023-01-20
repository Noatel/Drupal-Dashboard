from datetime import datetime

from celery import shared_task

from src.api.models import Scan
from src.api.utils import check_live_blocks


@shared_task(name='Check for scans')
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


@shared_task(name='Check for deleted blocks')
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
