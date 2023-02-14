import django
from src.api.models import Website, Page, Scan, Checklist, Task, PageResult
from src.api.spiders.check_page_spider import CheckPageSpider
from src.api.tests.responses import fake_response, fail_response


class CheckPageTest(django.test.TestCase):
    def setUp(self):
        # Since its a different database
        # You need to make a new website
        self.website = Website.objects.create(
            url='https://www.typify.com',
            name='Typify',
            description='Typify',
            image='testImage'
        )
        self.page1 = Page.objects.create(
            url='https://www.typify.com',
            name='Home page',
            website=self.website,
        )
        self.page2 = Page.objects.create(
            url='https://www.typify.com',
            name='Home page',
            website=self.website,
        )
        self.pages = Page.objects.filter(website=self.website)

        self.scan = Scan.objects.create(
            website=self.website,
            status=Scan.STATUS.SITEMAP
        )

        # Since there is a checklist being created when doing the website.create
        self.checklist = Checklist.objects.filter(website=self.website).first()
        self.checklist.status = '1'
        self.checklist.save()

        # Initialize the spider
        self.spider = CheckPageSpider(urls=[self.page1, self.page2])

    def test_check_page(self):
        """
              Test scenario where the whole page is being tested
        """
        page_results = PageResult.objects.filter(page__website=self.website)
        self.assertEqual(0, len(page_results))

        # Mock the response
        response = fake_response(file_name='html/typify.html', url='https://www.typify.com/')

        # Activate the spider

        item = self.spider.parse(response)
        item = list(item)

        # 21 results are created
        page_results = PageResult.objects.filter(page__website=self.website)
        self.assertEqual(21, len(page_results))

    def test_check_page_with_multiple_errors(self):
        """
              Test scenario where the whole page is being tested with test errors
        """
        page_results = PageResult.objects.filter(page__website=self.website)
        self.assertEqual(0, len(page_results))

        # Mock the response
        response = fake_response(file_name='html/typifyMultiple.html', url='https://www.typify.com/')

        # Activate the spider

        item = self.spider.parse(response)
        item = list(item)

        # 21 results are created
        page_results = PageResult.objects.filter(page__website=self.website)
        self.assertEqual(23, len(page_results))
