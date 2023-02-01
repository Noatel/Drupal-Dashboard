import logging
import uuid

import scrapy
from src.api.models import Block, Content, PageResult
from bs4 import BeautifulSoup


class CheckPageSpider(scrapy.Spider):
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

        # From the response that I get,
        # We are going to check first if there are multiple headers

        # TODO: Uncomment
        # check_headers = self.check_headers(response=response)
        # check_ids = self.check_ids(response=response)
        check_images = self.check_images(response=response)


        # Now for the next page on the components,
        # check if the position is equal to the amount of pages, and check if it's not empty
        # It's the length of the array + -1 because we start at 0
        if self.url_position < (len(self.urls) - 1):

            # Add a plus one to go to the next iteration
            self.url_position += 1
            try:
                url = response.urljoin(self.urls[self.url_position].url)
                yield scrapy.Request(url, callback=self.parse)
            except IndexError:
                pass

    def check_headers(self, response):
        """
                This function will check if headers already exist in the response

                :param self: The URL's from the pages
                :param response: The response the scraper gets from the webpage
        """

        headers = response.xpath('//h1')
        # header_class = soup.div['class'][4]

        # If there are more than 1 h1 on the page, it needs to give a message
        if len(headers) > 1:
            # Comment field in the database:
            # In headers, first is always the class, second the content
            # example:
            # Rule: Multiple headers
            # RuleAttributes - Name: class
            # Relation many to many - Value : home-block-title main
            page = self.urls[self.url_position]

            for header in headers:
                # Since we need to assign a group id to all the test result
                group_id = uuid.uuid4()

                result_attributes, created = PageResult.objects.get_or_create(
                    page=page,
                    value=''.join(header.xpath('text()').extract()),
                    attribute='h1',
                    className=''.join(header.xpath('@class').extract()),
                )

    def check_ids(self, response):
        """
                This function will check if there are multiple id's on the page

                :param self: The URL's from the pages
                :param response: The response the scraper gets from the webpage
        """

        ids = response.xpath('//*[@id]')

        # If there are more than 1 id on the page, it needs to give a message
        if len(ids) > 1:
            page = self.urls[self.url_position]

            array_ids = []
            for id in ids:
                name = id.css('::attr(id)').extract_first()
                if name not in array_ids:
                    array_ids.append(name)
                else:
                    className = id.css('::attr(class)').extract_first()
                    result_attributes, created = PageResult.objects.get_or_create(
                        page=page,
                        value=name,
                        attribute='id',
                        className=className,
                    )

    def check_images(self, response):
        """
                This function will check if there are multiple id's on the page

                :param self: The URL's from the pages
                :param response: The response the scraper gets from the webpage
        """

        images = response.xpath('//img[@alt = "" or not(@alt)]')

        # If there are more than 1 id on the page, it needs to give a message
        if len(images) > 1:
            page = self.urls[self.url_position]

            array_ids = []
            for image in images:
                className = image.css('::attr(class)').extract_first()
                source = image.css('::attr(src)').extract_first()
                result_attributes, created = PageResult.objects.get_or_create(
                        page=page,
                        value=source,
                        attribute='alt',
                        className=className,
                    )
