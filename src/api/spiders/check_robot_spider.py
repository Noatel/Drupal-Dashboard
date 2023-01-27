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


class CheckRobotSpider(scrapy.Spider):
    name = 'Robot.txt spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        url = kwargs.get('url')
        website = Website.objects.filter(url=url).first()

        # If the end url ends with a slash add sitemap else /sitemap
        sitemap_url = format_url(url, '/robot.txt')

        # Set it to a self so I can access it later
        self.start_urls = [sitemap_url]
        self.start_url = sitemap_url
        self.urls = []
        self.website_id = website.id
        self.website_url = website.url
        self.status = 1

    def parse(self, response, **kwargs):
        """
              Function that check if the page is a sitemap based on
              :param response: Response of the website, {website_url}/sitemap.xml
              :return: Return if the sitemap exist, if it does return true otherwise false
        """

        checklist = Checklist.objects.filter(website__id=self.website_id).first()
        print('The status of the checklist is: {}'.format(checklist.status))
        robots = response.text.splitlines()
        print(robots)

        try:
            if robots[2] == '# robots.txt':
                # Based on the origin url get the checklist
                task = Task.objects.get_or_create(
                    type=Task.TYPE[2],
                    status=Task.STATUS[1],
                    completed_at=datetime.now(),
                    check_list=checklist,
                    comment='Robots.txt found'
                )

                self.status = 3
                checklist.status = 3
                checklist.save()
            else:
                task = Task.objects.get_or_create(
                    type=Task.TYPE[1],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment="Robots.txt not found"
                )
        except Exception as e:
            task = Task.objects.get_or_create(
                type=Task.TYPE[1],
                status=Task.STATUS[2],
                check_list=checklist,
                comment=str(e)
            )