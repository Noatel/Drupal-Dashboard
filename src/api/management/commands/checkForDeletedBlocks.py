from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import check_for_deleted_blocks


class Command(BaseCommand):
    help = 'Check for the deleted content blocks based on a api'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--api', type=str, help="Add a api")

    def handle(self, *args, **kwargs):
        website = kwargs['api']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            check_for_deleted_blocks(website=db_website)





