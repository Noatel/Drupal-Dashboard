from django.core.management import BaseCommand

from src.api.models import Page, Website
from src.api.utils import scan_page


class Command(BaseCommand):
    help = 'Get the HTML of a specific components'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        website = kwargs['components']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            scan_page(website=db_website)
