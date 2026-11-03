import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix Header Logo Safely
old_header = '''            // Cleanly replace Logos in the DOM
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                if (!link.hasAttribute('data-eureka-replaced')) {
                    link.innerHTML = '<span style=\"font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: inherit; font-size: 2.2rem; display: inline-block; margin-top: -2px;\">eureka</span><sup style=\"font-size: 0.8rem; vertical-align: super; margin-left: 2px;\">®</sup>';
                    link.setAttribute('data-eureka-replaced', 'true');
                }
            });'''
            
new_header = '''            // Safely hide original logos without destroying them to prevent GSAP crash
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                if (!link.hasAttribute('data-eureka-replaced')) {
                    const imgs = link.querySelectorAll('img');
                    imgs.forEach(img => { 
                        img.style.opacity = '0'; 
                        img.style.position = 'absolute'; 
                        img.style.pointerEvents = 'none'; 
                    });
                    
                    const span = iframeDoc.createElement('span');
                    span.innerHTML = 'eureka<sup style=\"font-size: 0.8rem; vertical-align: super; margin-left: 2px;\">®</sup>';
                    span.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: inherit; font-size: 2.2rem; display: inline-block; margin-top: -2px;';
                    link.appendChild(span);
                    link.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

content = content.replace(old_header, new_header)

# Fix Footer Logo Safely
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    h1.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; display: block; text-align: left; margin: 0; padding: 0;';
                    img.parentNode.replaceChild(h1, img);
                }
            });'''

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    img.style.opacity = '0';
                    img.style.position = 'absolute';
                    img.style.pointerEvents = 'none';
                    
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    h1.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; display: block; text-align: left; margin: 0; padding: 0;';
                    
                    img.parentNode.insertBefore(h1, img);
                    img.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

content = content.replace(old_footer, new_footer)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
