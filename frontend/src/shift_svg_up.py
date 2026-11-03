import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Remove the appendChild logic and update the SVG viewBox to add bottom padding (shifts text up!)
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                const svg = 'data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 500 150\\'%3E%3Cstyle%3Etext { font-family: sans-serif; font-weight: 300; font-size: 140px; fill: %23111; letter-spacing: -5px; }%3C/style%3E%3Ctext x=\\'0\\' y=\\'110\\'%3Eeureka%3Ctspan font-size=\\'50px\\' baseline-shift=\\'super\\'%3E®%3C/tspan%3E%3C/text%3E%3C/svg%3E';
                if (img.src !== svg) {
                    img.src = svg;
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                    
                    // Safely move the logo to the bottom of the footer container so it doesn't overlap the links at the top!
                    // This avoids absolute positioning which shrinks the document and crashes GSAP.
                    if (img.parentNode && img.nextElementSibling) {
                        img.parentNode.appendChild(img);
                    }
                }
            });'''

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                // viewBox height increased from 150 to 190 to add 40 units of empty space at the bottom.
                // This naturally shifts the "eureka" text ABOVE the links below it!
                const svg = 'data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 500 190\\'%3E%3Cstyle%3Etext { font-family: sans-serif; font-weight: 300; font-size: 140px; fill: %23111; letter-spacing: -5px; }%3C/style%3E%3Ctext x=\\'0\\' y=\\'110\\'%3Eeureka%3Ctspan font-size=\\'50px\\' baseline-shift=\\'super\\'%3E®%3C/tspan%3E%3C/text%3E%3C/svg%3E';
                if (img.src !== svg) {
                    img.src = svg;
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                    
                    // PROMISE KEPT: NO DOM NODE DETACHMENT (NO APPENDCHILD).
                    // Detaching DOM nodes crashes GSAP's IntersectionObservers.
                    // The SVG internal padding solves the overlap visually without touching the DOM structure!
                }
            });'''

if old_footer in content:
    content = content.replace(old_footer, new_footer)
else:
    print("Could not find old_footer block in App.jsx!")

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
