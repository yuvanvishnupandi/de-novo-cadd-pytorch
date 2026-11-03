import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# 1. REVERT ALL CSS HACKS that crashed GSAP or messed up layout
old_css = '''            const style = iframeDoc.createElement('style');
            style.innerHTML = `
                /* Prevent Navbar items from wrapping */
                header li a, header nav a, .nav-item {
                    white-space: nowrap !important;
                }
                
                /* Force footer logo to the bottom using absolute positioning (ignores clearfixes/floats) */
                footer {
                    position: relative !important;
                }
                footer .container-fluid {
                    padding-bottom: 28vw !important; /* Create space for the logo at the bottom */
                }
                footer .footer-logo {
                    position: absolute !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    top: auto !important;
                }
            `;'''

new_css = '''            const style = iframeDoc.createElement('style');
            style.innerHTML = `
                /* Prevent Navbar items from wrapping */
                header li a, header nav a, .nav-item {
                    white-space: nowrap !important;
                }
            `;'''

if old_css in content:
    content = content.replace(old_css, new_css)


# 2. Re-write the SVG injection to move the logo cleanly to the bottom
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                const svg = 'data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 500 150\\'%3E%3Cstyle%3Etext { font-family: sans-serif; font-weight: 300; font-size: 140px; fill: %23111; letter-spacing: -5px; }%3C/style%3E%3Ctext x=\\'0\\' y=\\'110\\'%3Eeureka%3Ctspan font-size=\\'50px\\' baseline-shift=\\'super\\'%3E®%3C/tspan%3E%3C/text%3E%3C/svg%3E';
                if (img.src !== svg) {
                    img.src = svg;
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                }
            });'''

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
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

if old_footer in content:
    content = content.replace(old_footer, new_footer)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
