import requests
from bs4 import BeautifulSoup
from typing import List,Dict
import json
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
os.makedirs("datastorage", exist_ok=True)

def scrape_arxiv(keywords: List[str], output_file: str = "datastorage/arxiv.json", max_results_per_keyword: int = 200) -> List[Dict]:
    res = []
    base_url = "https://arxiv.org/search/?query={query}&searchtype=all&source=header&start={start}"
    results_per_page = 50
    for keyword in keywords:
        for start in range(0, max_results_per_keyword, results_per_page):
            url = base_url.format(query=keyword.replace(' ', '+'), start=start)
            response = requests.get(url)
            if response.status_code != 200:
                continue
            soup = BeautifulSoup(response.text, "html.parser")
            found_any = False
            for item in soup.find_all('li', class_="arxiv-result"):
                title_tag = item.find('p', class_='title')
                link_tag = item.find('p', class_="list-title")
                if title_tag and link_tag:
                    title = title_tag.text.strip().replace('\n', ' ')
                    link_a = link_tag.find('a')
                    link = link_a['href'] if link_a else None
                    if link:
                        res.append({
                            'title': title,
                            'link': link,
                            'source': 'arXiv',
                            'keyword': keyword
                        })
                        found_any = True
            if not found_any:
                break  # No more results, stop paginating
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    return res


def scrape_all(keywords: List[str]):
    arxiv_results = scrape_arxiv(keywords, "datastorage/arxiv.json")
    all_results = arxiv_results
    with open("datastorage/all_papers.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(all_results)} papers to datastorage/all_papers.json")