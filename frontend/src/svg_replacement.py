import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Replace Header Logo with SVG
old_header = '''            // Wrap the logo to preserve absolute layout space and prevent JS crashes
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                if (!link.hasAttribute('data-eureka-replaced')) {
                    const imgs = link.querySelectorAll('img');
                    imgs.forEach(img => { 
                        const wrapper = iframeDoc.createElement('div');
                        wrapper.style.position = 'relative';
                        wrapper.style.display = 'inline-block';
                        img.parentNode.insertBefore(wrapper, img);
                        wrapper.appendChild(img);
                        
                        img.style.visibility = 'hidden'; // Retains exact physical dimensions
                        
                        const span = iframeDoc.createElement('span');
                        span.innerHTML = 'eureka<sup style=\"font-size: 0.8rem; vertical-align: super; margin-left: 2px;\">®</sup>';
                        span.style.cssText = 'position: absolute; top: 50%; left: 0; transform: translateY(-50%); font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: inherit; font-size: 2.2rem; white-space: nowrap; pointer-events: none;';
                        wrapper.appendChild(span);
                    });
                    link.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

new_header = '''            // 100% crash-proof: Just replace the image src with a base64 SVG. No DOM structure changes.
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                const imgs = link.querySelectorAll('img');
                imgs.forEach(img => { 
                    const svg = 'data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 150 40\\'%3E%3Cstyle%3Etext { font-family: sans-serif; font-weight: 300; font-size: 32px; fill: %23111; letter-spacing: 0px; }%3C/style%3E%3Ctext x=\\'0\\' y=\\'30\\'%3Eeureka%3Ctspan font-size=\\'12px\\' baseline-shift=\\'super\\'%3E®%3C/tspan%3E%3C/text%3E%3C/svg%3E';
                    if (img.src !== svg) {
                        img.src = svg;
                        if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                        if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                    }
                });
            });'''

content = content.replace(old_header, new_header)

# Replace Footer Logo with SVG
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    const wrapper = iframeDoc.createElement('div');
                    wrapper.className = img.className; // Transfer class to maintain CSS margin-top, etc.
                    img.className = ''; // Remove from original to prevent double application
                    
                    wrapper.style.position = 'relative';
                    wrapper.style.display = 'block';
                    wrapper.style.width = '100%';
                    
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                    
                    img.style.visibility = 'hidden'; // Retains exact physical dimensions
                    
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    h1.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; display: flex; align-items: center; margin: 0; padding: 0; pointer-events: none;';
                    
                    wrapper.appendChild(h1);
                    img.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                const svg = 'data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 500 150\\'%3E%3Cstyle%3Etext { font-family: sans-serif; font-weight: 300; font-size: 140px; fill: %23111; letter-spacing: -5px; }%3C/style%3E%3Ctext x=\\'0\\' y=\\'110\\'%3Eeureka%3Ctspan font-size=\\'50px\\' baseline-shift=\\'super\\'%3E®%3C/tspan%3E%3C/text%3E%3C/svg%3E';
                if (img.src !== svg) {
                    img.src = svg;
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                }
            });'''

content = content.replace(old_footer, new_footer)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
