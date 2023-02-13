import unittest
import django
from src.api.models import Website, Page, Scan, Checklist, Task
from src.api.spiders.check_google_analytics_spider import CheckGoogleAnalyticsSpider
from src.api.spiders.check_metatag_spider import CheckMetaTagSpider
from src.api.tests.responses import fake_response
from src.api.utils import check_all


class MetaTagsSpiderTest(django.test.TestCase):
    def setUp(self):
        # Since its a different database
        # You need to make a new website
        self.website = Website.objects.create(
            url='https://www.typify.com',
            name='Typify',
            description='Typify',
            image='testImage'
        )
        self.pages = Page.objects.create(
            url='https://www.typify.com',
            name='Home page',
            website=self.website,
        )

        self.scan = Scan.objects.create(
            website=self.website,
            status=Scan.STATUS.SITEMAP
        )

        self.checklist = Checklist.objects.filter(website=self.website).first()
        self.checklist.status = '2'
        self.checklist.save()

        # Initialize the spider
        self.spider = CheckMetaTagSpider(urls=[self.pages])

    def test_meta_tags(self):
        """
              Test scenario where the MetaTags spider is being tested.
              in combination with the content spider
              Checklist status previous: 2
              Expected status : 3
        """

        checklist = Checklist.objects.filter(website=self.website).first()

        self.assertEqual('2', checklist.status)

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com')

        # Activate the spider

        item = self.spider.parse(response)
        item = list(item)

        checklist = Checklist.objects.filter(website=self.website).first()
        task = Task.objects.filter(check_list=checklist).first()

        # Found MetaTags, got next status
        self.assertEqual('3', checklist.status)

    def test_meta_tags_failed(self):
        """
              Test scenario that there is no MetaTags in the html
              Checklist status previous: 2
              Expected status : 2
        """

        # Mock the response
        response = fake_response(file_name='html/typify_no_metatags.html', url='https://www.typify.com')
        tasks = Task.objects.filter(check_list=self.checklist)

        # Check if there are 0 tasks
        self.assertEqual(0, len(tasks))

        # Activate the spider
        item = self.spider.parse(response)
        item = list(item)

        checklist = Checklist.objects.filter(website=self.website).first()

        # Only with the task meta tags, we go to the next function
        # since its not a critical step
        self.assertEqual('3', checklist.status)

        task = Task.objects.filter(check_list=checklist)
        # Check if there are 1 task
        self.assertEqual(1, len(task))
