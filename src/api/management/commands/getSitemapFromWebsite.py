from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import  get_sitemap


class Command(BaseCommand):
    help = 'Get the HTML of a specific api'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--api', type=str, help="Add a api")

    def handle(self, *args, **kwargs):
        website = kwargs['api']
        db_website = Website.objects.get(url=website)

        get_sitemap(website=db_website)
