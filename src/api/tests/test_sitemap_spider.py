import unittest

import django

from src.api.models import Website, Page, Scan
from src.api.spiders.get_sitemap_spider import SitemapSpider
from src.api.tests.responses import fake_response


class SitemapSpiderTest(django.test.TestCase):
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
        # Initialize the spider
        self.url = 'https://www.typify.com'
        self.spider = SitemapSpider(urls=[self.url])

    def test_sitemap(self):
        """
              Test scenario where the sitemap sider is being tested.
              in combination with the content spider
              Before the test: 0 pages
              After the test 65 pages
              """

        # Check if there aren't any pages in the database

        scan = Scan.objects.filter(website=self.website).first()
        self.assertEqual(str(Scan.STATUS.SITEMAP), scan.status)

        page = Page.objects.filter(website__url='https://www.typify.com')
        self.assertEqual(0, page.__len__())

        # Mock the response
        response = fake_response(file_name='xml/sitemap.xml', url='https://www.typify.com')

        # Activate the spider
        item = self.spider.parse(response)

        # Check if there are new pages in the database
        pages = Page.objects.filter(website__url='https://www.typify.com')
        self.assertEqual(65, pages.__len__())

        scan = Scan.objects.filter(website=self.website).first()
        self.assertEqual(str(Scan.STATUS.GET_DATA), scan.status)

    def test_sitemap_not_found(self):
        """
            Test scenario where the sitemap sider is being tested and get the wrong HTML (No sitemap)
            Before the test: 0 pages
            After the test 0 pages
        """
        # Check if there aren't any pages in the database
        page = Page.objects.filter(website__url='https://www.typify.com')
        self.assertEqual(0, page.__len__())

        scan = Scan.objects.filter(website=self.website).first()
        self.assertEqual(str(Scan.STATUS.SITEMAP), scan.status)

        # Mock the response
        response = fake_response(file_name='html/error.html', url='https://www.typify.com')

        # Activate the spider
        item = self.spider.parse(response)

        # Since we mock te result as a error.html, and not a valid XML
        # The system makes 0 pages
        page = Page.objects.filter(website__url='https://www.typify.com')
        self.assertEqual(0, page.__len__())

        scan = Scan.objects.filter(website=self.website).first()
        self.assertEqual(str(Scan.STATUS.SITEMAP), scan.status)
