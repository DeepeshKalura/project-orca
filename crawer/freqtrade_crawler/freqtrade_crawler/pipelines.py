# freqtrade_crawler/pipelines.py

import os
from itemadapter import ItemAdapter

class SaveToFilePipeline:
    def process_item(self, item, spider):
        # The 'scraped_content' directory will be created in the project's root.
        output_dir = 'scraped_content'
        os.makedirs(output_dir, exist_ok=True)
        
        adapter = ItemAdapter(item)
        filename = adapter.get('filename', 'untitled.txt')
        filepath = os.path.join(output_dir, filename)

        # Write the content to the designated file.
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"URL: {adapter['url']}\n")
            f.write(f"Title: {adapter['title']}\n")
            f.write("="*80 + "\n\n")
            f.write(adapter['content'])
            
        spider.log(f"Saved file {filepath}")
        
        return item
