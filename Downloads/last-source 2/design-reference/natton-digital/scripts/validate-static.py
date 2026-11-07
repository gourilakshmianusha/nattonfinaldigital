"""Check the shipped route documents and assets; Python standard library only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import hashlib,json,sys

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
class Document(HTMLParser):
    def __init__(self,html):
        super().__init__(convert_charrefs=True)
        self.tags=[];self.ids=[];self.links=[];self.assets=[];self.scripts=[];self.in_schema=False;self.schema='';self.titles=[];self.title=False;self.title_text='';self.h1s=0
        self.feed(html)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append((tag,a))
        if 'id'in a:self.ids.append(a['id'])
        if tag=='a':self.links.append(a.get('href',''))
        if tag in ['img','video','script']and a.get('src'):self.assets.append(a['src'])
        if tag=='video'and a.get('poster'):self.assets.append(a['poster'])
        if tag=='link'and a.get('rel') in ['stylesheet','modulepreload']:self.assets.append(a.get('href',''))
        if tag=='title':self.title=True;self.title_text=''
        if tag=='h1':self.h1s+=1
        if tag=='script'and a.get('type')=='application/ld+json':self.in_schema=True;self.schema=''
    def handle_endtag(self,tag):
        if tag=='title':self.title=False;self.titles.append(self.title_text)
        if tag=='script'and self.in_schema:self.in_schema=False;self.scripts.append(json.loads(self.schema))
    def handle_data(self,data):
        if self.title:self.title_text+=data
        if self.in_schema:self.schema+=data

pages=sum([json.loads((ROOT/f'src/data/{f}.json').read_text())for f in ['products','industries']],[])
results=[];failures=[];titles=set();descriptions=set()
for p in pages:
    html=(DIST/p['path'].strip('/')/'index.html').read_text();d=Document(html);errors=[]
    if d.h1s!=1:errors.append(f'H1 count {d.h1s}')
    if d.titles!=[p['metaTitle']]:errors.append('title does not match page metadata')
    if p['metaTitle']in titles:errors.append('duplicate title')
    titles.add(p['metaTitle'])
    meta=[a.get('content')for t,a in d.tags if t=='meta'and a.get('name')=='description']
    if meta!=[p['metaDescription']]:errors.append('missing or incorrect description')
    if p['metaDescription']in descriptions:errors.append('duplicate description')
    descriptions.add(p['metaDescription'])
    if any(n>1 for n in Counter(d.ids).values()):errors.append('duplicate IDs')
    if sum(t=='header' and 'nh-header' in a.get('class','').split() for t,a in d.tags)!=1 or sum(t=='footer' for t,a in d.tags)!=1:errors.append('missing shared header/footer')
    canonical=[a.get('href')for t,a in d.tags if t=='link'and a.get('rel')=='canonical']
    if len(canonical)!=1 or not canonical[0].endswith(p['path']):errors.append('canonical missing or wrong route')
    for href in d.links:
        u=urlsplit(href)
        if not u.scheme and not u.netloc:
            if u.fragment and not u.path and unquote(u.fragment)not in d.ids:errors.append('missing anchor '+href)
            if u.path.startswith('/') and not (DIST/u.path.strip('/')/'index.html').is_file() and not (DIST/u.path.lstrip('/')).is_file():errors.append('missing internal route or asset '+href)
    for asset in d.assets:
        if asset.startswith('/')and not (DIST/asset.lstrip('/')).is_file():errors.append('missing asset '+asset)
    for t,a in d.tags:
        if t=='img'and (not a.get('alt')or not a.get('width')or not a.get('height')):errors.append('image missing alt or size')
        if t=='button'and a.get('type')!='button':errors.append('button has no explicit type')
    if len(d.scripts)!=1:errors.append('missing schema graph')
    else:
        graph=d.scripts[0]['@graph'];faq=next((x for x in graph if x['@type']=='FAQPage'),None)
        if faq is None or len(faq['mainEntity'])!=len(p['faqs']):errors.append('incorrect FAQ schema count')
        if faq:
            for actual,expected in zip(faq['mainEntity'],p['faqs']):
                if actual['name']!=expected['question']or actual['acceptedAnswer']['text']!=expected['answer']:errors.append('FAQ schema differs from visible content')
    flow_count=sum(1 for t,a in d.tags if t=='button'and 'flow-step'in a.get('class','').split())
    ambient_count=sum(1 for t,a in d.tags if 'ambient'in a.get('class','').split())
    toggle_count=sum(1 for t,a in d.tags if t=='button'and 'page-motion-toggle'in a.get('class','').split())
    if p['slug']=='business-os':
        if 'business-flow-section' not in html or 'What does the customer need?' not in html:errors.append('BusinessOS process-to-result flow missing')
    elif flow_count!=len(p['process']):errors.append('animated process does not include every stage')
    if ambient_count!=7:errors.append('background field missing')
    if toggle_count!=1:errors.append('page effects control missing')
    if p['slug']=='growth-os':
        v=next((a for t,a in d.tags if t=='video'),{})
        if not all(k in v for k in ['controls','muted','playsinline']):errors.append('video controls/defaults missing')
    for item in p['services']+p['process']:
        if item['title'].replace('&','&amp;')not in html and item['title']not in html:errors.append('section content absent from pre-rendered HTML')
    results.append({'path':p['path'],'passed':not errors,'errors':errors,'h1Count':d.h1s,'FAQCount':len(p['faqs']),'canonical':canonical[0]if canonical else None,'HTMLBytes':len(html.encode())})
    failures.extend(p['slug']+': '+e for e in errors)
manifest=json.loads((ROOT/'MEDIA-MANIFEST.json').read_text());video=manifest['growthOSVideo'];digest=hashlib.sha256((ROOT/video['file']).read_bytes()).hexdigest()
if digest!=video['sha256']:failures.append('GrowthOS original video checksum changed')
if (ROOT/video['file']).stat().st_size!=video['bytes']:failures.append('GrowthOS original video size changed')
if len(list((DIST/'media/industries').glob('*.webp')))!=6:failures.append('industry image count is not six')
if len(list((DIST/'media/products').glob('*-preview.svg')))!=3:failures.append('temporary product hero count is not three')
report={'passed':not failures,'detailPageCount':len(results),'checks':['pre-rendered copy','one H1','unique metadata','canonical route','internal links','local assets','image alt/sizes','duplicate IDs','button types','schema validity and visible FAQ parity','shared global header/footer','GrowthOS byte identity','seven background fields per detail page','five-stage animated process','page effects control'],'pages':results,'growthOSVideoSHA256':digest,'failures':failures}
(ROOT/'VALIDATION.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'passed':report['passed'],'pages':len(results),'failures':failures},indent=2))
sys.exit(bool(failures))
