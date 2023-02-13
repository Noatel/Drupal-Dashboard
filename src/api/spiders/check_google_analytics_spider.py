import logging
import string
from datetime import datetime

import scrapy
from scrapy import Selector

from src.api.models import Website, Checklist, Task


class CheckGoogleAnalyticsSpider(scrapy.Spider):
    name = 'Google Analytics spider'

    def __init__(self, *args, **kwargs):
        # Disable the logging (Not needed)
        logging.getLogger('scrapy').propagate = False

        # Set the URL from the argument to a variable
        urls = kwargs.get('urls')
        url = urls[0]
        website = Website.objects.filter(url=url).first()

        # Set it to a self so I can access it later
        self.start_urls = [url]
        self.start_url = url
        self.urls = []
        self.website_id = website.id
        self.website_url = website.url
        self.status = 1

    def parse(self, response, **kwargs):
        """
              Function that check if the page is a google analytics based on
              :param response: Response of the website, {website_url}/sitemap.xml
              :return: Return if the sitemap exist, if it does return true otherwise false
        """

        checklist = Checklist.objects.filter(website__id=self.website_id).first()

        # If the script tag with the data-drupal-selector (drupal-settings-json) found
        # Check for the tag Google analytics
        script_tags = response.xpath("//script[@data-drupal-selector]").extract()

        # Its standard on False
        google_analytics = False

        # if the text Google Analytics is found in the scripttags
        if 'google_analytics' in str(script_tags[0]):
            google_analytics = True
        try:
            # If the 'google_analytics' is found in the script tag
            if google_analytics:
                # Based on the origin url get the checklist
                task = Task.objects.get_or_create(
                    type=Task.TYPE[4],
                    status=Task.STATUS[1],
                    completed_at=datetime.now(),
                    check_list=checklist,
                    comment='Google Analytics tag found'
                )

                self.status = 4
                checklist.status = 4
                checklist.save()
            else:
                task = Task.objects.get_or_create(
                    type=Task.TYPE[4],
                    status=Task.STATUS[2],
                    check_list=checklist,
                    comment="Google Analytics tag not found"
                )
        except Exception as e:
            task = Task.objects.get_or_create(
                type=Task.TYPE[4],
                status=Task.STATUS[2],
                check_list=checklist,
                comment=str(e)
            )
