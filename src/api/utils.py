import uuid
from datetime import datetime

from scrapy.crawler import CrawlerProcess
from src.api.models import Website, Page, Result, Block, Scan

# Import the Content spider to get content from the components
# And the sitemap for getting all the URLs
from src.api.spiders.compare_blocks_spider import CompareSpider
from src.api.spiders.get_content_spider import ContentSpider
from src.api.spiders.get_sitemap_spider import SitemapSpider


def get_sitemap(website: Website):
    """
    This function will get a sitemap for the assign components

    :param website: Give the components you want to get the sitemap from
    """
    # Go to the sitemap using Scrapy
    spider = CrawlerProcess()
    spider.settings
    spider.crawl(SitemapSpider, url=website.url)
    spider.start()


# Based on the components that is from the database
# go to the page
def scan_page(website: Website):
    """
        This function will go to a specifc page and retreive drupal content blocks

        :param website: Give the components you want to get the sitemap from
    """

    pages = website.pages.filter(website=website).distinct('url')
    print('{} is the amount of pages'.format(pages))

    if pages:
        spider = CrawlerProcess()
        spider.crawl(ContentSpider, urls=pages)
        spider.start()


def compare_blocks(website: Website):
    """
    First we are going to get the live blocks from the components and compare it with the blocks in the database
    When the comparison is done, we going to check all the tested blocks and check for any deleted ones
    :param website:
    :return:
    """
    check_live_blocks(website)
    # After we checked through the blocks, we need to check if there are any deleted blocks,
    # we need to search for the block that ISN'T tested

    check_for_deleted_blocks(website)


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
        print('start crawling')
        spider = CrawlerProcess()
        spider.crawl(CompareSpider, urls=pages)
        spider.start()


def check_for_deleted_blocks(website: Website):
    """
    Check for deleted blocks, we search through all the blocks with the same test id
    Get the blocks based on the group id, compare the blocks on the page,
    if there is one missing, its deleted.

    :param website:
    :return: If there is an deleted record, give back an array of results
    """
    # get all the pages based on the given url
    pages = website.pages.filter(website=website)

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


def schedule_website(websiteId: uuid.UUID):
    website = Website.objects.filter(id=websiteId).first()
    schedule, created = Scan.objects.get_or_create(
        website=website
    )

    return schedule
