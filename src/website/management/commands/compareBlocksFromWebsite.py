from django.core.management import BaseCommand

from src.website.models import Page
from src.website.utils import scan_page


class Command(BaseCommand):
    help = 'Get the HTML of a specific website'

    def add_arguments(self, parser):
        parser.add_argument('-w', '--website', type=str, help="Add a website")

    def handle(self, *args, **kwargs):
        pass
