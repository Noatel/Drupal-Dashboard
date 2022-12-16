from scrapy.crawler import CrawlerProcess
from src.website.models import Website

# Import the Content spider to get content from the website
# And the sitemap for getting all the URLs
from src.website.spiders.get_content_spider import ContentSpider
from src.website.spiders.get_sitemap_spider import SitemapSpider

# Based on the website that is from the database
# go to the webiste
def scan_website(website: Website):
    # The website is already validated
    url = website.url

    # Go to the website using Scrapy
    spider = CrawlerProcess()
    spider.crawl(ContentSpider, url=website.url)
    spider.start()


def get_sitemap(website: Website):
    # The website is already validated
    url = website.url

    # Go to the website using Scrapy
    spider = CrawlerProcess()
    spider.crawl(SitemapSpider, url=website.url)
    spider.start()


