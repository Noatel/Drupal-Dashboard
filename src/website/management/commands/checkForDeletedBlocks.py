from django.core.management import BaseCommand

from src.website.models import Website
from src.website.utils import check_for_deleted_blocks


class Command(BaseCommand):
    help = 'Check for the deleted content blocks based on a website'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--website', type=str, help="Add a website")

    def handle(self, *args, **kwargs):
        website = kwargs['website']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            check_for_deleted_blocks(website=db_website)





