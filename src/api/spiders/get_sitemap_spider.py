import logging

import scrapy
from scrapy import Selector

from src.api.models import Page, Website


class SitemapSpider(scrapy.Spider):
    name = 'Sitemap spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        url = kwargs.get('url')
        website = Website.objects.filter(url=url).first()

        # If the end url ends with a slash add sitemap else /sitemap
        if url.endswith('/'):
            sitemap_url = url + 'sitemap.xml'
        else:
            sitemap_url = url + '/sitemap.xml'

        # Set it to a self so I can access it later
        self.start_urls = [sitemap_url]
        self.start_url = sitemap_url
        self.urls = []
        self.website_id = website.id

    def parse(self, response, **kwargs):
        links = response.text.split('\n')

        for link in links:
            # Searching for <loc> and </loc> element
            # When found, strip and get the link
            if link[:7].replace(" ", "") == '<loc>' and link[-6:].replace(" ", "") == '</loc>':
                # Remove <loc>
                link = link.replace(link[-6:], "")
                # Remove </loc>
                link = link.replace(link[:7], "")

                # add the page
                page, created = Page.objects.get_or_create(
                    url=link,
                    name=link.rsplit('/', 1)[-1],
                    website_id=self.website_id
                )
