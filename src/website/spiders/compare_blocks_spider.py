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
        urls = kwargs.get('urls')


        # Set it to a self so I can access it later
        self.start_urls = [urls[0]['url']]
        self.start_url = urls[0]['url']
        self.url_position = 0
        self.urls = urls

    def parse(self, response, **kwargs):
        self.url_position = self.url_position + 1

        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        blocks = response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()

        # Looping through each block
        for block in blocks:
            print(block)


        # print(self.start_url, self.urls[self.url_position])
        # print(self.url_position)

        if self.urls[self.url_position] and self.url_position <= len(self.urls):
            next_url = response.urljoin(self.urls[self.url_position]['url'])
            yield scrapy.Request(next_url, callback=self.parse)
