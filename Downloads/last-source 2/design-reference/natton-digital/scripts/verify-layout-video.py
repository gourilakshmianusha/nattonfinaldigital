"""Check every published document, native FAQs, and solution film delivery."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.tags=[];self.ids=[];self.assets=[];self.links=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append((tag,a))
        if 'id' in a:self.ids.append(a['id'])
        if tag in ('img','video','source','script','track') and a.get('src'):self.assets.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet':self.assets.append(a['href'])
        if tag=='video' and a.get('poster'):self.assets.append(a['poster'])
        if tag=='a' and a.get('href'):self.links.append(a['href'])

errors=[];documents=list(DIST.rglob('*.html'));faq_pages=0;faq_count=0
assert len(documents)==53, f'Expected 53 documents, found {len(documents)}'
assert not (DIST/'hero-player-qa.html').exists() and not (DIST/'layout-audit.html').exists(), 'Temporary QA surface must not ship'
for path in documents:
    p=Page(path.read_text());label=str(path.relative_to(DIST))
    def require(ok,message):
        if not ok:errors.append(label+': '+message)
    require(sum(t=='h1' for t,a in p.tags)==1,'must have one H1')
    require(len(p.ids)==len(set(p.ids)),'duplicate IDs')
    require(sum(t=='header' and 'nh-header' in a.get('class','').split() for t,a in p.tags)==1,'missing shared navigation')
    for asset in p.assets:
        url=urlsplit(asset)
        if not url.scheme and url.path.startswith('/'):require((DIST/unquote(url.path).lstrip('/')).is_file(),'missing asset '+asset)
    for href in p.links:
        url=urlsplit(href)
        if url.scheme or url.netloc:continue
        if url.fragment and not url.path:require(unquote(url.fragment) in p.ids,'missing anchor '+href)
        if url.path.startswith('/'):
            target=DIST/unquote(url.path).lstrip('/')
            require(target.is_file() or (target/'index.html').is_file(),'missing route or download '+href)
    faq=any('faq-editorial-list' in a.get('class','').split() for t,a in p.tags)
    if faq:
        faq_pages+=1
        details=[a for t,a in p.tags if t=='details' and a.get('name','').endswith('-answers')]
        faq_count+=len(details)
        require(len(details)>=(3 if label=='index.html' else 4),'FAQ lost its page-specific answers')
        require(any('open' in a for a in details),'first FAQ should show its answer')

for slug,file in [('business-os','businessos'),('agentic-os','agenticos'),('ai-marketing-platform','ai-marketing')]:
    p=Page((DIST/'products'/slug/'index.html').read_text())
    videos=[a for t,a in p.tags if t=='video' and a.get('src')==f'/media/films/{file}-hero.mp4']
    assert len(videos)==1,slug+' film missing'
    assert all(x in videos[0] for x in ('controls','muted','playsinline')),slug+' player controls missing'
    assert 'autoplay' not in videos[0],slug+' should wait for a visitor to play'
    assert any(t=='track' and a.get('src')==f'/media/films/{file}-captions.vtt' for t,a in p.tags),slug+' captions missing'
p=Page((DIST/'products/growth-os/index.html').read_text())
assert any(t=='video' and a.get('src')=='/media/growthos-hero-original.mp4' and 'autoplay' not in a for t,a in p.tags), 'Original GrowthOS video should wait for user playback'
for slug in ['growth-os','business-os','agentic-os','ai-marketing-platform']:
    p=Page((DIST/'products'/slug/'index.html').read_text())
    assert any(t=='button' and 'sx-film-start' in a.get('class','').split() and a.get('aria-controls')==slug+'-hero-video' for t,a in p.tags), slug+' needs a prominent, associated play button'
assert faq_pages==39, f'Expected 32 existing and 7 restored FAQ sections, found {faq_pages}'
assert faq_count==211, f'Expected 211 useful FAQ answers, found {faq_count}'
assert not errors,'\n'.join(errors)
print(json.dumps({'documents':len(documents),'faqSections':faq_pages,'pageSpecificAnswers':faq_count,'heroFilms':4,'nativeControls':True,'captions':True,'allLocalAssetsAndAnchors':True,'temporaryQaExcluded':True}))
