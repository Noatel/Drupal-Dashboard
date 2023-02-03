from django.core.management import BaseCommand
from scrapy.crawler import CrawlerProcess

from src.api.models import Website
from src.api.utils import check_all


class Command(BaseCommand):
    help = 'Check if the sitemap exsist'

    def add_arguments(self, parser):
        parser.add_argument('-t', '--type', type=str, help="Type")
        parser.add_argument('-w', '--components', type=str, help="Add a components")

    def handle(self, *args, **kwargs):
        type = kwargs['type']
        website = kwargs['components']
        db_website = Website.objects.filter(url=website).first()
        process = CrawlerProcess()

        if db_website:
            check_all(websiteId=db_website.id)
