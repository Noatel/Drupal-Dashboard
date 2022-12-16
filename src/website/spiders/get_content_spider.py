import logging

import scrapy


class ContentSpider(scrapy.Spider):
    name = 'Content spider'

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
        print('url=')
        print(self.start_url)
        # From the response that i get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        blocks = response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()

        # Searching for each block
        for block in blocks:
            print('-------------------------------------')
            print(block)
            print('-------------------------------------')
