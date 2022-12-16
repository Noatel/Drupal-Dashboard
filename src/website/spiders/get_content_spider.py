import logging
import re

import scrapy
from src.website.models import Block, Content, Page
from bs4 import BeautifulSoup


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
        page = Page.objects.filter(url=self.start_url).first()

        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        blocks = response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()

        # Searching for each block
        for block in blocks:
            soup = BeautifulSoup(block, "html.parser")
            block_name = soup.div['id']
            block_type = soup.div['class'][4]

            custom_block, custom_block_created = Block.objects.get_or_create(
                page_id=page.id,
                name=block_name,
                type=block_type
            )

            # for each custom content block we want save
            content, created = Content.objects.get_or_create(
                content=block,
                block_id=custom_block.id,
            )