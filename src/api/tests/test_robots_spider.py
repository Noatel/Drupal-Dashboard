import unittest
import django
from src.api.models import Website, Page, Scan, Checklist, Task
from src.api.spiders.check_google_analytics_spider import CheckGoogleAnalyticsSpider
from src.api.spiders.check_metatag_spider import CheckMetaTagSpider
from src.api.spiders.check_robot_spider import CheckRobotSpider
from src.api.tests.responses import fake_response, fail_response
from src.api.utils import check_all


class RobotsSpiderTest(django.test.TestCase):
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

        # Since there is a checklist being created when doing the website.create
        self.checklist = Checklist.objects.filter(website=self.website).first()
        self.checklist.status = '1'
        self.checklist.save()

        # Initialize the spider
        self.spider = CheckRobotSpider(urls=[self.pages])

    def test_robot_txt(self):
        """
              Test scenario where the robots spider is being tested.
              in combination with the content spider
              Checklist status previous: 2
              Expected status : 3
        """

        checklist = Checklist.objects.filter(website=self.website).first()

        self.assertEqual('1', checklist.status)

        # Mock the response
        response = fake_response(file_name='xml/robots.txt', url='https://www.typify.com/robots.txt')

        # Activate the spider

        item = self.spider.parse(response)
        # item = list(item)

        checklist = Checklist.objects.filter(website=self.website).first()
        task = Task.objects.filter(check_list=checklist)

        # Check if there are 1 task
        self.assertEqual(1, len(task))
        # Found MetaTags, got next status
        self.assertEqual('2', checklist.status)

    def test_robot_txt_failed(self):
        """
              Test scenario that there is no robots in the html
              Checklist status previous: 2
              Expected status : 2
        """

        # Mock the response
        # fail_response gives back a 404
        response = fail_response(file_name='xml/empty.txt', url='https://www.typify.com')
        tasks = Task.objects.filter(check_list=self.checklist)

        # Check if there are 0 tasks
        self.assertEqual(0, len(tasks))

        # Activate the spider
        item = self.spider.parse(response)

        # item = list(item)

        checklist = Checklist.objects.filter(website=self.website).first()

        self.assertEqual('1', checklist.status)

        task = Task.objects.filter(check_list=checklist)
        # Check if there are 1 task
        self.assertEqual(1, len(task))
