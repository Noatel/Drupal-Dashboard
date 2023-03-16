import logging
import string
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


class CheckNiceUrlsSpider(scrapy.Spider):
    name = 'Check nice urls spider'

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

    def parse(self, response, **kwargs):
        """
              Function that check if the page is a Google Analytics based on
              :param response: Response of the website, {website_url}/sitemap.xml
              :return: Return if the sitemap exist, if it does return true otherwise false
        """

        # Since the whole website is going to be checked,

        checklist = Checklist.objects.filter(website__id=self.website_id).first()

        link_tag = response.xpath("//link[@rel='canonical']/@href").extract()

        # List of the type of content that is going to be checked
        # Feel free to add more, example: /node/12131
        types = ["node"]

        # Check if the array types includes in the canonical url
        # If It's for example node in the URL, it's not a nice url
        # Some say it's a mean URL
        matching = [s for s in link_tag if any(xs in s for xs in types)]

        if len(matching) > 0:
            self.comments.append(matching)

        try:
            # If there is matching 0 and it's the last page
            if len(matching) == 0 and self.url_position == (len(self.urls) - 1):

                # Based on the origin url get the checklist
                task = Task.objects.get_or_create(
                    type=Task.TYPE[5],
                    status=Task.STATUS[1],
                    completed_at=datetime.now(),
                    check_list=checklist,
                    comment='Only Nice URL found on the website'
                )

                self.status = 5
                checklist.status = 5
                checklist.save()
            # IF there is a matching
            elif len(matching) > 0 and self.url_position == (len(self.urls) - 1):
                task = Task.objects.get_or_create(
                    type=Task.TYPE[4],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment=self.comments
                )
        except Exception as e:
            task = Task.objects.get_or_create(
                type=Task.TYPE[4],
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
