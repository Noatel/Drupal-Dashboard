from scrapy.crawler import CrawlerProcess
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
def scan_page(website: Website):
    # Go to the page using Scrapy

    pages = website.pages.filter(website=website).distinct('url')

    spider = CrawlerProcess()
    spider.crawl(ContentSpider, urls=pages)
    spider.start()


def compare_blocks(website: Website):
    # Start up a crawler
    # Because we need to get the new content blocks from the website
    # and compare it with the old content blocks

    print('loading in the websites...')
    # Get the website and a list of the pages
    website = Website.objects.filter(url=website.url).first()
    # Get a list of all pages, we only want to take the URL
    print('loading in the pages...')

    #wrong (not all pages) temp for testing
    pages = website.pages.all()
    for page in pages:
        print('page with block')
        print(page.url)
        print('--------')
        print(page.blocks)
        print('--------')
    print('loading in the crawling prcoes')
    # Loop through the pages get the content
    # compare the content with the LIVE data
    spider = CrawlerProcess()

    # Now we need to find get the blocks with their content for each page
    # We do this by making the spiders ready for crawling
    # spider.crawl(CompareSpider, urls=pages)

    # Now we start the crawling
    spider.start()
