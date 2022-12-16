from django.core.management import BaseCommand

from src.website.models import Website
from src.website.utils import scan_website, get_sitemap


class Command(BaseCommand):
    help = 'Get the HTML of a specific website'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--website', type=str, help="Add a website")

    def handle(self, *args, **kwargs):
        website = kwargs['website']
        db_website = Website.objects.get(url=website)

        get_sitemap(website=db_website)
