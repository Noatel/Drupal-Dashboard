from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import  get_sitemap


class Command(BaseCommand):
    help = 'Get the HTML of a specific components'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        website = kwargs['components']
        db_website = Website.objects.get(url=website)

        get_sitemap(website=db_website)
