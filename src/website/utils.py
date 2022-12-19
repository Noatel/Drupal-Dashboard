from scrapy.crawler import CrawlerProcess
from src.website.models import Website, Page

# Import the Content spider to get content from the website
# And the sitemap for getting all the URLs
from src.website.spiders.compare_blocks_spider import CompareSpider
from src.website.spiders.get_content_spider import ContentSpider
from src.website.spiders.get_sitemap_spider import SitemapSpider


def get_sitemap(website: Website):
    """
    This function will get a sitemap for the assign website

    :param website: Give the website you want to get the sitemap from
    """
    # Go to the sitemap using Scrapy
    spider = CrawlerProcess()
    spider.crawl(SitemapSpider, url=website.url)
    spider.start()


# Based on the website that is from the database
# go to the page
def scan_page(website: Website):
    """
        This function will go to a specifc page and retreive drupal content blocks

        :param website: Give the website you want to get the sitemap from
    """

    pages = website.pages.filter(website=website).distinct('url')

    spider = CrawlerProcess()
    spider.crawl(ContentSpider, urls=pages)
    spider.start()


def compare_blocks(website: Website):
    """
        This function will compare the blocks with the database and the live website

        :param website: Give the website you want to get the sitemap from
    """

    # Start up a crawler
    # Because we need to get the new content blocks from the website
    # and compare it with the old content blocks

    pages = website.pages.filter(website=website).distinct('url')

    spider = CrawlerProcess()
    spider.crawl(CompareSpider, urls=pages)
    spider.start()
