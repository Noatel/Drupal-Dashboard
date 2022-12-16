import logging
import re

import scrapy
from src.website.models import Block, Content, Page, Website
from bs4 import BeautifulSoup


class CompareSpider(scrapy.Spider):
    name = 'Compare spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False
        # Set the URL from the argument to a variable
        url = kwargs.get('url')
        # Set it to a self so I can access it later
        self.start_urls = [url]
        self.start_url = url
        self.urls = []

    def parse(self, response, **kwargs):
        print(self.start_url)
