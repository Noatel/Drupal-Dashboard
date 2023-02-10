import unittest
import django
from src.api.models import Website, Page, Scan, Checklist
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

        self.checklist = Checklist.objects.create(
            status=3,
            website=self.website
        )
        # Initialize the spider
        self.spider = CheckGoogleAnalyticsSpider(urls=['https://www.typify.com'])

    def test_google_analitics(self):
        """
              Test scenario where the  google analytics spider is being tested.
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

    def failed_test_google_analitics(self):
        """
              Test scenario where the google analytics spider is being tested.
              Checklist status previous: 3
              Expected status : 3
        """

        # Mock the response
        response = fake_response(file_name='html/typify_no_google_analytics.html', url='https://www.typify.com')

        # Activate the spider
        self.spider.parse(response)

        checklist = Checklist.objects.filter(website=self.website).first()

        # Found google analytics, got next status
        self.assertEqual('3', checklist.status)
