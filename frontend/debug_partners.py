import urllib.request
import re

req = urllib.request.Request('https://enveda.com/purpose/', headers={'User-Agent': 'Mozilla/5.0'})
raw_html = urllib.request.urlopen(req).read().decode('utf-8')

match = re.search(r'<div id="partners">[\s\S]*?</div>\s*</div>\s*</div>', raw_html)
if match:
    print('Match span:', match.span())
    print('Matched text ending:\n', match.group(0)[-200:])
    print('Remaining after match:\n', raw_html[match.end():match.end()+300])
