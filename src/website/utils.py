from asyncio import tasks

from celery.app import task
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from scrapy.utils.log import configure_logging
from twisted.internet import reactor, defer

from src.website.models import Website, Page

# Import the Content spider to get content from the website
# And the sitemap for getting all the URLs
from src.website.spiders.compare_blocks_spider import CompareSpider
from src.website.spiders.get_content_spider import ContentSpider
from src.website.spiders.get_sitemap_spider import SitemapSpider


def get_sitemap(website: Website):
    # Go to the sitemap using Scrapy
    spider = CrawlerProcess()
    spider.crawl(SitemapSpider, url=website.url)
    spider.start()


# Based on the website that is from the database
# go to the page
def scan_page(page: Page):
    # Go to the page using Scrapy
    spider = CrawlerProcess()
    spider.crawl(ContentSpider, url=page.url)
    spider.start()


@defer.inlineCallbacks
def crawl(url=str, runner=CrawlerRunner):
    yield runner.crawl(CompareSpider, url=url)

def compare_blocks(website: Website):
    # Start up a crawler
    # Because we need to get the new content blocks from the website
    # and compare it with the old content blocks

    # Get the website and a list of the pages
    website = Website.objects.filter(url=website.url).first()
    pages = website.pages.all()

    # Loop through the pages get the content
    # compare the content with the LIVE data
    configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
    runner = CrawlerRunner()

    for page in pages:
        # Now we need to find get the blocks with their content for each page
        # We do this by making the spiders ready for crawling

        # print("prepare running" + page.url)
        # yield process.crawl(CompareSpider, url=page.url, query="dvh")
        crawl(page.url, runner)

    # Now we start the crawling
    reactor.run()
