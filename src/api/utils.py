import csv
import uuid
from datetime import datetime

import requests
from scrapy import crawler
from scrapy.crawler import CrawlerProcess
from scrapy.utils.log import configure_logging

from twisted.internet import reactor
from src.api.models import Website, Result, Scan, Checklist, Task, Page
from src.api.spiders.check_google_analytics_spider import CheckGoogleAnalyticsSpider
from src.api.spiders.check_metatag_spider import CheckMetaTagSpider
from src.api.spiders.check_nice_urls_spider import CheckNiceUrlsSpider
from src.api.spiders.check_page_spider import CheckPageSpider
from src.api.spiders.check_robot_spider import CheckRobotSpider
from src.api.spiders.check_sitemap_spider import CheckSitemapSpider
from src.api.spiders.compare_blocks_spider import CompareSpider
from src.api.spiders.get_content_spider import ContentSpider
from src.api.spiders.get_sitemap_spider import SitemapSpider
from multiprocessing import Queue
from billiard.context import Process


def get_sitemap(website: Website):
    """
    This function will get a sitemap for the assign components

    :param website: Give the components you want to get the sitemap from
    """
    # Go to the sitemap using Scrapy
    run_spider(SitemapSpider, urls=[website.url])


# Based on the components that is from the database
# go to the page
def scan_page(website: Website):
    """
        This function will go to a specifc page and retreive drupal content blocks

        :param website: Give the components you want to get the sitemap from
    """

    pages = website.pages.filter(website=website).distinct('url')

    if pages:
        run_spider(ContentSpider, urls=pages)


def scan_page_test(website: Website):
    """
        This function will go to a specifc page and retreive drupal content blocks

        :param website: Give the components you want to get the sitemap from
    """

    pages = website.pages.filter(website=website).distinct('url')

    if pages:
        run_spider(CheckPageSpider, urls=pages)


def compare_blocks(website: Website):
    """
    First we are going to get the live blocks from the components and compare it with the blocks in the database
    When the comparison is done, we going to check all the tested blocks and check for any deleted ones
    :param website:
    :return:
    """
    check_live_blocks(websiteId=website.id)
    # After we checked through the blocks, we need to check if there are any deleted blocks,
    # we need to search for the block that ISN'T tested

    check_for_deleted_blocks(websiteId=website.id)


def check_live_blocks(websiteId: uuid.UUID):
    """
        This function will compare the blocks with the database and the live components

        :param websiteId: Give the components you want to get the sitemap from
    """

    # Start up a crawler
    # Because we need to get the new content blocks from the components
    # and compare it with the old content blocks

    website = Website.objects.filter(id=websiteId).first()
    pages = list(website.pages.filter(website=website).distinct('url'))

    if pages:
        run_spider(CompareSpider, urls=pages)


def check_for_deleted_blocks(websiteId: uuid.UUID):
    """
    Check for deleted blocks, we search through all the blocks with the same test id
    Get the blocks based on the group id, compare the blocks on the page,
    if there is one missing, its deleted.

    :param websiteId:
    :return: If there is an deleted record, give back an array of results
    """
    # get all the pages based on the given url
    website = Website.objects.filter(id=websiteId).first()
    pages = Page.objects.filter(website=website)

    # Loop through the pages
    for page in pages:
        # for each page, there is a new group id
        group_id = None

        # Loop through all the blocks that are on a pages
        # Now we're going to check if the block is being tested

        for block in page.blocks.all():
            # This SHOULD give one result back for each test
            results = Result.objects.filter(block__id=block.id, checked=False).all()

            if results:

                # But for safety we are going to for loop it
                for result in results:
                    group_id = result.group_id
                    result.checked = True
                    result.save()

            elif not results and group_id is not None:
                result = Result.objects.create(
                    block_id=block.id,
                    status=Result.STATUS.DELETED,
                    data={
                        'content': '',
                    },
                    group_id=group_id,
                    checked=True
                )
    # if there are no pages to look for anymore,
    # Get scan and set the scan to the next step
    scan = Scan.objects.filter(website_id=website.id).first()
    scan.status = Scan.STATUS.COMPLETED
    scan.save()


def schedule_website(websiteId: uuid.UUID):
    website = Website.objects.filter(id=websiteId).first()

    # Get the sitemap
    schedule, created = Scan.objects.get_or_create(
        website=website
    )

    # schedule it
    schedule.status = Scan.STATUS[0]
    schedule.save()

    return schedule


def schedule_checklist(websiteId: uuid.UUID):
    checklist = Checklist.objects.filter(website__id=websiteId).first()
    tasks = Task.objects.filter(check_list_id=checklist.id)
    for task in tasks:
        task.delete()

    checklist.status = 0
    checklist.save()


def check_all(websiteId: uuid.UUID):
    # Call the Crawler process to start up the spiders
    website = Website.objects.filter(id=websiteId).first()
    pages = website.pages.filter(website=website).distinct('url')
    checklist = Checklist.objects.filter(website_id=website.id).first()

    configure_logging()
    # Set up the spiders

    # FROM: Status[0] - Not started
    # TO: Status[1] - Sitemap
    if checklist.status == '0':
        run_spider(CheckSitemapSpider, urls=[website.url])

    # FROM: Status[1] - Sitemap
    # TO: Status[2] - Robots
    if checklist.status == '1':
        run_spider(CheckRobotSpider, urls=[website.url])

    # FROM: Status[2] - Robots
    # TO: Status[3] - MetaTags
    if checklist.status == '2':
        run_spider(CheckMetaTagSpider, urls=pages)

    # FROM: Status[3] - MetaTags
    # TO: Status[4] - Google Analytics
    if checklist.status == '3':
        run_spider(CheckGoogleAnalyticsSpider, urls=[website.url])

    # FROM: Status[4] - Google analytics
    # TO: Status[5] - Nice URL's
    if checklist.status == '4':
        run_spider(CheckNiceUrlsSpider, urls=pages)

    # FROM: Status - Nice Url's
    # TO: Status - Completed
    if checklist.status == '5':
        checklist.status = 6
        checklist.save()


def run_spider(spider, *args, **kwargs):
    def f(q):
        try:
            runner = crawler.CrawlerProcess()

            deferred = runner.crawl(spider, urls=kwargs.get('urls'))
            deferred.addBoth(lambda _: reactor.stop())
            reactor.run()
            q.put(None)
        except Exception as e:
            q.put(e)

    q = Queue()
    p = Process(target=f, args=(q,))
    p.start()
    result = q.get()
    p.join()

    if result is not None:
        raise result


def activate_test(scanId: uuid.UUID):
    scan = Scan.objects.filter(id=scanId).first()

    if str(scan.status) == str(Scan.STATUS.SITEMAP):
        get_sitemap(scan.website)
    elif str(scan.status) == str(Scan.STATUS.GET_DATA):
        scan_page(scan.website)
    elif str(scan.status) == str(Scan.STATUS.COMPARE_BLOCKS):
        compare_blocks(scan.website)
    elif str(scan.status) == str(Scan.STATUS.COMPLETED):
        scan.completed_at = datetime.now()
        scan.save()
