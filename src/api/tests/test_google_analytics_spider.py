import unittest
import django
from src.api.models import Website, Page, Scan, Checklist, Task
from src.api.spiders.check_google_analytics_spider import CheckGoogleAnalyticsSpider
from src.api.spiders.get_sitemap_spider import SitemapSpider
from src.api.tests.responses import fake_response
from src.api.utils import check_all


class GoogleAnalyticsSpiderTest(django.test.TestCase):
    def setUp(self):
        # Since its a different database
        # You need to make a new website
        self.website = Website.objects.create(
            url='https://www.typify.com',
            name='Typify',
            description='Typify',
            image='testImage'
        )

        self.scan = Scan.objects.create(
            website=self.website,
            status=Scan.STATUS.SITEMAP
        )


        # Since there is a checklist being created when doing the website.create
        self.checklist = Checklist.objects.filter(website=self.website).first()
        self.checklist.status = '3'
        self.checklist.save()

        # Initialize the spider
        self.spider = CheckGoogleAnalyticsSpider(urls=['https://www.typify.com'])

    def test_google_analytics(self):
        """
              Test scenario where the  Google Analytics spider is being tested.
              in combination with the content spider
              Checklist status previous: 3
              Expected status : 4
        """

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com')

        # Activate the spider
        self.spider.parse(response)

        checklist = Checklist.objects.filter(website=self.website).first()

        # Found google analytics, got next status
        self.assertEqual('4', checklist.status)

    def test_google_analytics_failed(self):
        """
              Test scenario that there is no Google Analytics in the html
              Checklist status previous: 3
              Expected status : 3
        """

        # Mock the response
        response = fake_response(file_name='html/typify_no_google_analytics.html', url='https://www.typify.com')
        tasks = Task.objects.filter(check_list=self.checklist)

        # Check if there are 0 tasks
        self.assertEqual(0, len(tasks))

        # Activate the spider
        self.spider.parse(response)

        checklist = Checklist.objects.filter(website=self.website).first()

        # Found Google Analytics, got next status
        self.assertEqual('3', checklist.status)

        task = Task.objects.filter(check_list=checklist)
        # Check if there are 1 task
        self.assertEqual(1, len(task))
