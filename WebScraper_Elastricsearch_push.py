import requests
from bs4 import BeautifulSoup
import time
import sys
from elasticsearch import Elasticsearch

reload(sys)
sys.setdefaultencoding('utf8')

es_client = Elasticsearch(['https://search-evpruthvi-4ybp35u4hzzp6kkkqg7fi32fji.us-east-2.es.amazonaws.com'])

# drop_index = es_client.indices.create(index='blog-sysadmins', ignore=400)
create_index = es_client.indices.delete(index='javaprogramming', ignore=[400, 404])


mainJavaDoc = 'https://en.wikibooks.org/wiki/Java_Programming'
rawPage = requests.get(mainJavaDoc)
pageContent = BeautifulSoup(rawPage.content, 'html.parser')

anchorElements = pageContent.findAll('a')
links = []

for anchor in anchorElements:
    try:
        temp = anchor['href']
        if('/wiki/Java_Programming/' in temp):
            links.append('https://en.wikibooks.org'+temp)
    except KeyError,e:
        pass

links = links[7:100]
mainContent = []

for link in links:
    contents = []

    pageName = link.split('/')[-1:]
    page = requests.get(link)
    pageContent = BeautifulSoup(page.content, 'html.parser')
    for element in pageContent.findAll(class_='wikitable',style='float: right;'):
        element.decompose()
    for element in pageContent.findAll(class_='noprint'):
        element.decompose()

    mainElement =  pageContent.find('div', class_ = 'mw-parser-output')
    temp = ""
    title = pageName[0].replace('_',' ')
    temp = temp + '<h2>' + title + '</h2>\n'
    for element in mainElement:
        if(element.name == 'h2' or element.name == 'h3' or element.name == 'h4'):
            doc = {
                'title':title,
                'content': temp,
                'url': link
            }
            res = es_client.index(index="javaprogramming", doc_type="docs", body=doc)
            time.sleep(0.5)
            contents.append(temp)
            temp = ""
            title = ""
        if(title == ""):
            title = element.text.encode("utf8")
            title = title.replace('[edit]','')
            temp = temp + '<h2>' + title + '</h2>\n'
        else:
            dum = element.encode("utf8")
            temp = temp + dum

    if(len(temp) > 0):
        doc = {
            'title':title,
            'content': temp,
            'url': link
        }
        res = es_client.index(index="javaprogramming", doc_type="docs", body=doc)
        time.sleep(0.5)
        contents.append(temp)
        temp = ""

    mainContent.append(contents)
    contents = []
