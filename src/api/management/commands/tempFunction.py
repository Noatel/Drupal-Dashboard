from django.core.management import BaseCommand
from src.api.utils import temp_function


class Command(BaseCommand):
    help = 'Check for the deleted content blocks based on a components'

    def handle(self, *args, **kwargs):
            temp_function()





