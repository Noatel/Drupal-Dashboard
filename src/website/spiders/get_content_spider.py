import logging
import re
import uuid

import scrapy
from src.website.models import Block, Content, Page
from bs4 import BeautifulSoup


class ContentSpider(scrapy.Spider):
    name = 'Content spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        urls = kwargs.get('urls')

        # Set it to a self so I can access it later
        self.start_urls = [urls[0].url]
        self.start_url = urls[0].url
        self.url_position = 0
        self.urls = urls

    def parse(self, response, **kwargs):
        """
        This function will receive a response from the scrapy webscraper.
        When he got the response, filter for a block and save it to the database.
        After saving the blocks and their contents, go to the next page.

        :param response: The response the scraper gets from the webpage
        """
        page = self.urls[self.url_position]

        # Since we need to assign a group id to all the test result

        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        blocks = response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()
        for block in blocks:
            # Get the block name and type based their classes
            soup = BeautifulSoup(block, "html.parser")
            block_name = soup.div['id']
            block_type = soup.div['class'][4]

            # Try to save both blocks and content.
            # If its already exist, the system doesn't make another one
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

        # Now for the next page on the website,
        # check if the position is equal to the amount of pages, and check if it's not empty
        # It's the length of the array + -1 because we start at 0
        if self.url_position < (len(self.urls) - 1):

            # Add a plus one to go to the next iteration
            self.url_position += 1

            next_url = response.urljoin(self.urls[self.url_position].url)

            # print('from url: {}'.format(self.urls[self.url_position]))
            # print('to url: {}'.format(response.request.url))

            # Yield the request to the next page which call this function again.
            yield scrapy.Request(next_url, callback=self.parse)
