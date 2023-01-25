import unittest

import django

from src.api.models import Website, Page, Block, Content, Result
from src.api.spiders.compare_blocks_spider import CompareSpider
from src.api.spiders.get_content_spider import ContentSpider
from src.api.tests.responses import fake_response


class CompareSpiderTest(django.test.TestCase):
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
        self.spider_content = ContentSpider(urls=pages)
        self.spider_compare = CompareSpider(urls=pages)

    def test_content_spider(self):
        """
        Test scenario where getting the content is being compared
        This test is for the UNCHANGED data with the database and live database
        """

        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(0, blocks.__len__())
        self.assertEqual(0, content.__len__())

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com')

        # Activate the spider
        item = self.spider_content.parse(response)
        item = list(item)
        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(9, blocks.__len__())
        self.assertEqual(9, content.__len__())

        # Check for 0 test results
        result = Result.objects.all()
        self.assertEqual(0, result.__len__())

        item = self.spider_compare.parse(response)
        item = list(item)

        # Check for test results
        results = Result.objects.all()
        self.assertEqual(9, results.__len__())

        # Checking if the value in the database is the same as the "live" data
        for result in results:
            self.assertEqual(str(Result.STATUS.UNCHANGED), result.status)

    def test_content_spider_changed_data(self):
        """
        Test scenario where getting the content is being compared
        This test is for the UNCHANGED data with the database and live database
        """

        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(0, blocks.__len__())
        self.assertEqual(0, content.__len__())

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com')

        # Activate the spider
        item = self.spider_content.parse(response)
        item = list(item)

        blocks = Block.objects.all()
        content = Content.objects.all()

        self.assertEqual(9, blocks.__len__())
        self.assertEqual(9, content.__len__())

        # Check for 0 test results
        result = Result.objects.all()
        self.assertEqual(0, result.__len__())

        # Now we going to change the html file to the other mock file
        response = fake_response(file_name='html/typify_changed.html', url='https://www.typify.com')
        item = self.spider_compare.parse(response)
        item = list(item)

        # Check for test results
        results = Result.objects.all()
        self.assertEqual(9, results.__len__())

        # Checking if the value in the database is the same as the "live" data
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[0].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[1].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[2].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[3].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[4].status)

        self.assertEqual(str(Result.STATUS.EDITED), results[5].status)

        self.assertEqual(str(Result.STATUS.UNCHANGED), results[6].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[7].status)
        self.assertEqual(str(Result.STATUS.UNCHANGED), results[8].status)

