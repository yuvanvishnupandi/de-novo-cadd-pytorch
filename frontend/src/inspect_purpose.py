import urllib.request
import re

req = urllib.request.Request(
    'https://enveda.com/purpose/',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
html = urllib.request.urlopen(req).read().decode('utf-8')

# Print out main content sections
main_idx = html.find('<main')
if main_idx == -1:
    main_idx = html.find('id="content"')
if main_idx == -1:
    main_idx = html.find('class="site-wrapper"')

# Let's extract all sections and divs with content
sections = re.findall(r'<section[^>]*>(.*?)</section>', html, re.DOTALL)
print("Sections count:", len(sections))

# Let's search for the specific text fragments we see in user's prompt:
fragments = [
    "The future",
    "THE CHEMICAL CODE",
    "A life lesson",
    "OUR ORIGIN",
    "What’s in a name",
    "What's in a name",
    "Our Pipeline",
    "More than 12",
    "SUSTAINABILITY",
    "Our commitment",
    "Our Partners",
    "Everyone deserves",
    "Charity",
    "en-VAY-da",
    "veda"
]

for f in fragments:
    pos = html.find(f)
    if pos != -1:
        print(f"\n=== MATCH: '{f}' (pos {pos}) ===")
        print(html[pos-100:pos+500])
