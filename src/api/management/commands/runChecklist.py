from django.core.management import BaseCommand

from src.api.models import Website
from src.api.utils import check_for_sitemap, check_for_robots


class Command(BaseCommand):
    help = 'Check if the sitemap exsist'

    def add_arguments(self, parser):
        parser.add_argument('-t', '--type', type=str, help="Type")
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        type = kwargs['type']
        website = kwargs['components']
        db_website = Website.objects.filter(url=website).first()

        if db_website:
            if type == "1":
                check_for_sitemap(websiteId=db_website.id)
            elif type == "2":
                check_for_robots(websiteId=db_website.id)
            elif type == "3":
                print(344)

