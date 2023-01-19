import unittest

import django

from src.api.models import Website, Page, Block, Content
from src.api.spiders.get_content_spider import ContentSpider
from src.api.tests.responses import fake_response


class ContentCrawlerTest(django.test.TestCase):
    def setUp(self):
        # Prep the data

        # Since its a different database
        # You need to make a new website
        self.website = Website.objects.create(
            url='https://www.typify.com',
            name='Typify',
            description='Typify',
            image='testImage'
        )

        # Create the pages, for testing purpose we are going to create 3 pages
        self.page_one = Page.objects.create(
            url='https://www.typify.com',
            name='Typify',
            website=self.website
        )

        self.page_two = Page.objects.create(
            url='https://www.typify.com/blog/imagemagick-probleem-mijn-site-gevaar',
            name='Typify',
            website=self.website
        )

        self.page_three = Page.objects.create(
            url='https://www.typify.com/blog/weten-wie-jouw-website-bezoekt-met-leadfeeder',
            name='Typify',
            website=self.website
        )

        website = Website.objects.filter(url='https://www.typify.com').first()
        pages = website.pages.filter(website=self.website)

        # Initialize the spider
        self.spider = ContentSpider(urls=pages)

    def test_content_crawler(self):
        """
        Test scenario where getting the content is being tested
        """

        # After the pages are in the database
        # Get the blocks through the content spider

        # Check if there aren't any blocks in the database
        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(0, blocks.__len__())
        self.assertEqual(0, content.__len__())

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com')

        # Activate the spider
        item = self.spider.parse(response, testing=True)

        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(9, blocks.__len__())
        self.assertEqual(9, content.__len__())
