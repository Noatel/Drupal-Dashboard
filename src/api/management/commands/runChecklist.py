from django.core.management import BaseCommand
from scrapy.crawler import CrawlerProcess

from src.api.models import Website
from src.api.utils import check_for_sitemap, check_for_robots, check_for_metatags, check_for_google_analytics, \
    check_for_nice_urls, check_all


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
            if type == "1":
                check_for_sitemap(websiteId=db_website.id, process=process)
                process.start()
            elif type == "2":
                check_for_robots(websiteId=db_website.id, process=process)
                process.start()
            elif type == "3":
                check_for_metatags(websiteId=db_website.id, process=process)
                process.start()
            elif type == "4":
                check_for_google_analytics(websiteId=db_website.id, process=process)
                process.start()
            elif type == "5":
                check_for_nice_urls(websiteId=db_website.id, process=process)
            elif type == "all":
                check_all(websiteId=db_website.id)
