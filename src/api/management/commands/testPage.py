from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import check_for_deleted_blocks, scan_page_test, activate_test


class Command(BaseCommand):
    help = 'Activate a spider for testing a page'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        website = kwargs['components']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            # activate_test(scanId='33b4d29f-34ee-46e8-9454-7a1d3217280b')
            scan_page_test(websiteId=db_website.id)





