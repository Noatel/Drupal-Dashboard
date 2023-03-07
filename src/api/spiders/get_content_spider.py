import logging
import scrapy
from src.api.models import Block, Content, Scan, Page
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
        self.testing = False

    def parse(self, response, **kwargs):
        page = self.urls[self.url_position]
        # From the response that I get,
        # search for the DIV with the ID that starts with "block" and got a class of "block-custom"
        blocks = filter_blocks(response=response)

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

        # Now for the next page on the components,
        # check if the position is equal to the amount of pages, and check if it's not empty
        # It's the length of the array + -1 because we start at 0
        if self.url_position < (len(self.urls) - 1):

            # Add a plus one to go to the next iteration
            self.url_position += 1
            try:
                url = response.urljoin(self.urls[self.url_position].url)
                yield scrapy.Request(url, callback=self.parse, dont_filter = True)
            except IndexError:
                pass
        else:
            # if there are no pages to look for anymore,
            # Get scan and set the scan to the next step
            scan = Scan.objects.filter(website_id=page.website.id).first()
            scan.status = Scan.STATUS.COMPARE_BLOCKS
            scan.save()


def filter_blocks(response):
    """
            This function will filter all the blocks on the page and will return an
            array of blocks.

            :param response: The response the scraper gets from the webpage
            :return Array of Drupal blocks
    """
    return response.xpath("//*[contains(@id,'block') and contains(@class, 'block-custom-block-class')]").extract()
