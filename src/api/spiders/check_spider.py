import logging

import scrapy
from scrapy import Selector

from src.api.models import Page, Website


class CheckSitemapSpider(scrapy.Spider):
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
        print(response.text)
        xml = response.xpath('/').extract()
        print(xml)
        xml = response.xpath('urlset').extract()
        print(xml)
        xml = response.xpath('/urlset').extract()
        print(xml)
        # print(xml[:7].replace(" ", "") )
        # if xml[:7].replace(" ", "") == '<?xml>':
        #     pas
    # return False
