# freqtrade_crawler/spiders/posts.py

import scrapy
from pathlib import Path
import re
from urllib.parse import urlparse 

class PostsSpider(scrapy.Spider):
    name = 'posts'
    allowed_domains = ['botacademy.ddns.net']
    start_urls = ['https://botacademy.ddns.net/2023/07/09/table-of-contents-for-freqtrade/']

    def parse(self, response):
        """
        Finds all article links on the page and yields a request to follow each one.
        """
        post_links = response.css('div.entry-content a::attr(href)').getall()
        self.log(f'Found {len(post_links)} links to follow.')

        for link in post_links:
            yield response.follow(link, callback=self.parse_post)

    def parse_post(self, response):
        """
        Parses each individual post page to extract the title and content.
        """
        # --- START OF CORRECTED FUNCTION ---
        def get_safe_filename(url_string):
            # First, parse the URL to get its components
            parsed_url = urlparse(url_string)
            # Now, get the path component from the parsed URL
            path_component = parsed_url.path
            
            # Sanitize the path for a safe filename
            safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', path_component.strip('/'))
            return f"{safe_name}.txt"
        # --- END OF CORRECTED FUNCTION ---

        title = response.css('h1.entry-title::text').get()
        content_paragraphs = response.css('div.entry-content p::text').getall()
        content = '\n'.join(content_paragraphs)
        
        filename = get_safe_filename(response.url)
        
        self.log(f'Scraped "{title}" from {response.url}')

        # Yield the data to be sent to the pipeline
        yield {
            'url': response.url,
            'title': title.strip() if title else 'No Title',
            'content': content,
            'filename': filename
        }
