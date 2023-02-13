import logging
from datetime import datetime

import scrapy
from scrapy import Selector

from src.api.models import Website, Checklist, Task


def format_url(url, second_url):
    """
    Function where it checks if the URL ends with a slash and add something behind
    :param url: First URL
    :param second_url:  Second URL
    :return:
    """
    if url.endswith('/'):
        return url + second_url
    else:
        return url + second_url


class CheckMetaTagSpider(scrapy.Spider):
    name = 'Metatag spider'

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
        self.status = 1
        self.comments = []

        page = self.urls[self.url_position]
        self.website_id = page.website.id

        self.check_description = False
        self.descriptions = []

        self.check_title = False
        self.titles = []

    def parse(self, response, **kwargs):
        """
              Function that check if the page is a sitemap based on
              :param response: Response of the website, {website_url}/sitemap.xml
              :return: Return if the sitemap exist, if it does return true otherwise false
        """
        checklist = Checklist.objects.filter(website__id=self.website_id).first()
        meta_description = response.xpath("//meta[@name='description']/@content").extract()
        check_description = len(meta_description) > 0

        if meta_description:
            meta_description = meta_description[0]
        else:
            if check_description:
                self.check_description = check_description
                self.descriptions.append(self.start_url)

        title = response.xpath("//title/text()").extract()
        check_title = title == ""
        if check_title:
            self.check_title = check_title
            self.titles.append(self.start_url)

        try:
            # If there are any characters in the meta descriptions, it means it exist.
            # And if it's the last page
            if len(meta_description) == 0 and title != "":
                task = Task.objects.get_or_create(
                    type=Task.TYPE[3],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment='Meta description not found on page {}'.format(self.urls[self.url_position].url)
                )
            elif len(meta_description) > 0 and title == "":
                task = Task.objects.get_or_create(
                    type=Task.TYPE[3],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment='Page title not found on page {}'.format(self.urls[self.url_position].url)
                )
            elif len(meta_description) == 0 and title == "":
                task = Task.objects.get_or_create(
                    type=Task.TYPE[3],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment='Meta description and page title not found not found'
                )

            self.status = 3
            checklist.status = 3
            checklist.save()

        except Exception as e:
            task = Task.objects.get_or_create(
                type=Task.TYPE[3],
                status=Task.STATUS[2],
                check_list=checklist,
                comment=str(e)
            )

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
