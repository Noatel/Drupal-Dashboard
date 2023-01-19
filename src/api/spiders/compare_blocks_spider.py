import logging
import re
import uuid
from typing import List

import scrapy
from src.api.models import Block, Content, Page, Website, Result
from bs4 import BeautifulSoup


class CompareSpider(scrapy.Spider):
    name = 'Compare spider'

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

        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        live_blocks = filter_blocks(response=response)

        page = self.urls[self.url_position]
        # Now we assign the block, we need a way to compare the block live and the block in the database
        # We do this based on the URL.

        # Since we need to assign a group id to all the test result
        group_id = uuid.uuid4()

        # Looping through each block
        for live_block in live_blocks:
            # Get the block name and type based their classes
            soup = BeautifulSoup(live_block, "html.parser")
            block_name = soup.div['id']
            block_type = soup.div['class'][4]

            # So we need to search first if the class exsist in the content because otherwise its deleted
            custom_block = Block.objects.filter(
                page_id=page.id,
                name=block_name,
                type=block_type
            ).get()

            # if you can find the class and name in the database:
            if custom_block:
                content_block = custom_block.content.order_by('created_at').first()

                # Check if the two variables are equal
                if content_block.content == live_block:
                    # if they are equal we are going to give them a green state, nothing changed
                    # Do we even want to save if there aren't changes?
                    create_result(Result.STATUS.UNCHANGED, custom_block.id, live_block, group_id)
                else:
                    # if they edited something, give it the edited state
                    create_result(Result.STATUS.EDITED, custom_block.id, live_block, group_id)

        # Now for the next page on the components,
        # check if the position is equal to the amount of pages, and check if it's not empty
        # It's the length of the array + -1 because we start at 0
        if self.url_position < (len(self.urls) - 1):
            # Add a plus one to go to the next iteration
            self.url_position += 1

            url = response.urljoin(self.urls[self.url_position].url)

            # If the function kwargs got the variable "testing"
            if kwargs.get('testing') is True:
                scrapy.Request(url, callback=self.parse)
            else:
                next_url(self.parse, url)


def next_url(parse, url):
    # Since unit testing doesn't like yielding in the test, it needs
    # to be in another function
    yield scrapy.Request(url, callback=parse)


def create_result(status, block_id: uuid, live_block: str, group_id: uuid) -> Result:
    # for each custom content block we want sav
    result = Result.objects.create(
        block_id=block_id,
        status=status,
        data={
            'content': live_block,
        },
        group_id=group_id,
        checked=False
    )

    return result


def filter_blocks(response):
    """
            This function will filter all the blocks on the page and will return an
            array of blocks.

            :param response: The response the scraper gets from the webpage
            :return Array of Drupal blocks
    """
    return response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()
