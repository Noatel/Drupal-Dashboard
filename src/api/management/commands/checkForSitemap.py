from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import check_for_sitemap


class Command(BaseCommand):
    help = 'Check if the sitemap exsist'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        website = kwargs['components']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            check_for_sitemap(websiteId=db_website.id)
