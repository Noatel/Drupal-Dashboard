import logging
import re
import uuid

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
        self.start_urls = [urls[0].url]
        self.start_url = urls[0].url
        self.url_position = 0
        self.urls = urls

    def parse(self, response, **kwargs):

        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        live_blocks = response.xpath(
            "//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()

        # Now we assign the block, we need a way to compare the block live and the block in the database
        # We do this based on the URL.

        page = self.urls[self.url_position]
        database_blocks = Block.objects.filter(page=page)
        # Looping through each block

        for live_block, database_block in zip(live_blocks, database_blocks):
            # First we need to check if the live content block isn't deleted, empty

            # So these are all the blocks, since we want te to create a history of all the content blocks
            # we only take the newest one, so we filter op created_at
            content_block = database_block.content.order_by('created_at').first()
            if not live_block:
                # TODO: Need more testing
                create_content(Content.STATUS.DELETED, database_block.id, live_block)
                continue

            # Check if the two variables are equal
            if content_block.content == live_block:
                # if they are equal we are g    oing to give them a green state, nothing changed
                create_content(Content.STATUS.UNCHANGED, database_block.id, live_block)
            else:
                # if they edited something, give it the edited state
                create_content(Content.STATUS.EDITED, database_block.id, live_block)

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


def create_content(status, block_id: uuid, live_block: str) -> Content:
    # for each custom content block we want save
    content, created = Content.objects.get_or_create(
        content=live_block,
        block_id=block_id,
        status=status
    )

    return content
