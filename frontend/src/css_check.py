import urllib.request
import re

req=urllib.request.Request('http://localhost:5173/enveda_proxy')
html=urllib.request.urlopen(req).read().decode('utf-8')
css_files=re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\']', html)
for css in css_files:
    if css.startswith('/'):
        url = 'http://localhost:5173' + css
    else:
        url = css
    try:
        req2 = urllib.request.Request(url)
        css_text = urllib.request.urlopen(req2).read().decode('utf-8')
        if 'footer-logo' in css_text:
            print("Found in", url)
            matches = re.findall(r'([^}]*footer-logo[^}]*{[^}]+})', css_text)
            for m in matches:
                print(m)
    except Exception as e:
        pass
