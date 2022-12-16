import logging

import scrapy
from scrapy import Selector


class SitemapSpider(scrapy.Spider):
    name = 'Sitemap spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        url = kwargs.get('url')

        # If the end url ends with a slash add sitemap else /sitemap
        if url.endswith('/'):
            sitemap_url = url + 'sitemap.xml'
        else:
            sitemap_url = url + '/sitemap.xml'

        # Set it to a self so I can access it later
        self.start_urls = [sitemap_url]
        self.start_url = sitemap_url
        self.urls = []

    def parse(self, response, **kwargs):
        links = response.xpath('./body').extract()
        urls = response.css("tr").extract()

        print('data')
        print(urls)
        for url in urls:
            print(url)

