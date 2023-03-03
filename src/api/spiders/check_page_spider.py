import logging

import scrapy
from src.api.models import PageResult, PageValue


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
        page = self.urls[self.url_position]
        page_results = PageResult.objects.filter(page=page)
        page_results.delete()

        check_headers = self.check_headers(response=response)
        check_ids = self.check_ids(response=response)
        check_images = self.check_images(response=response)
        check_order = self.check_order(response=response)
        check_meta = self.check_meta(response=response)

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
                page_value, created = PageValue.objects.update_or_create(
                    value=''.join(header.xpath('text()').extract()),
                )

                result_attributes, created = PageResult.objects.update_or_create(
                    page=page,
                    attribute='h1',
                    className=''.join(header.xpath('@class').extract()),
                    page_value=page_value
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
                    page_value, created = PageValue.objects.update_or_create(
                        value=name
                    )

                    result_attributes, created = PageResult.objects.update_or_create(
                        page=page,
                        page_value=page_value,
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

                page_value, created = PageValue.objects.update_or_create(
                    value=source
                )

                result_attributes, created = PageResult.objects.update_or_create(
                    page=page,
                    page_value=page_value,
                    attribute='alt',
                    className=className,
                )

    def check_order(self, response):
        """
                This function will check if there are multiple id's on the page

                :param self: The URL's from the pages
                :param response: The response the scraper gets from the webpage
        """
        headers = {
            'h1': False,
            'h2': False,
            'h3': False,
            'h4': False,
            'h5': False,
            'h6': False,
        }

        # Building the array
        for x in range(1, 7):
            text = response.xpath('//h{}'.format(x))
            if text:
                headers['h{}'.format(x)] = response.xpath('//h{}'.format(x))

        for x in range(1, 7):
            # If the array is empty
            if headers['h{}'.format(x)] is False:
                # check if previous is filled and one after that
                for i in range(0, len(headers) - x):
                    # The current header + the new header + 1
                    next_header = x + i + 1
                    if headers['h{}'.format(next_header)] is not False:
                        page = self.urls[self.url_position]

                        page_value, created = PageValue.objects.update_or_create(
                            value='h{} is empty but h{} is filled'.format(x, next_header),
                        )

                        result_attributes, created = PageResult.objects.update_or_create(
                            page=page,
                            page_value=page_value,
                            attribute='order',
                            className="",
                        )

    def check_meta(self, response):
        title = response.xpath("//title/text()").extract()
        meta_description = response.xpath("//meta[@name='description']/@content").extract()
        check_description = len(meta_description) > 0
        check_title = title == ""

        if check_title:
            self.check_title = check_title
            self.titles.append(self.start_url)
        if meta_description:
            meta_description = meta_description[0]
        else:
            if check_description:
                self.check_description = check_description
                self.descriptions.append(self.start_url)

        page = self.urls[self.url_position]

        print(page.url)
        print(title, meta_description)
        # Just save always the metadata for the customer to see

        page_value, created = PageValue.objects.update_or_create(
            value=[title, meta_description],
        )

        result_attributes, created = PageResult.objects.update_or_create(
            page=page,
            page_value=page_value,
            attribute='meta',
            className="",
        )
