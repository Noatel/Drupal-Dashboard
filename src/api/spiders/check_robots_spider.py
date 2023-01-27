import logging
from datetime import datetime

import scrapy
from scrapy import Selector

from src.api.models import Page, Website, Checklist, Task


class CheckForRobots(scrapy.Spider):
    name = 'Sitemap spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        url = kwargs.get('url')
        website = Website.objects.filter(url=url).first()

        # If the end url ends with a slash add sitemap else /sitemap
        if url.endswith('/'):
            sitemap_url = url + 'robots.txt'
        else:
            sitemap_url = url + '/robots.txt'

        # Set it to a self so I can access it later
        self.start_urls = [sitemap_url]
        self.start_url = sitemap_url
        self.urls = []
        self.website_id = website.id

    def parse(self, response, **kwargs):
        """
        Function that check if the page is a sitemap based on
        :param response: Response of the website, {website_url}/sitemap.xml
        :return: Return if the sitemap exist, if it does return true otherwise false
        """
        checklist = Checklist.objects.filter(website__id=self.website_id).first()

        # try:
        robots = dict(zip(*(line.split('|') for line in response.text.splitlines())))
        print(robots)
