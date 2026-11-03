import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Revert CSS
content = re.sub(r'/\* BULLETPROOF FIX:.*clip-path: none !important;\n          }', '', content, flags=re.DOTALL)

# Revert Footer Logo
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    const parent = img.parentNode;
                    parent.style.position = 'relative';
                    
                    // Keep original image fully in layout so JS animation math is perfect
                    img.style.opacity = '0'; 
                    
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    // Float the replacement exactly over the invisible original image
                    h1.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; display: flex; align-items: center; margin: 0; padding: 0; pointer-events: none;';
                    
                    parent.insertBefore(h1, img.nextSibling);
                    img.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    h1.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; display: block; text-align: left; margin: 0; padding: 0;';
                    img.parentNode.replaceChild(h1, img);
                }
            });'''

content = content.replace(old_footer, new_footer)

# Fix Header Logo
old_header = '''            // Physically replace the Logos in the DOM without destroying original layout (prevents JS animation crashes)
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                if (!link.hasAttribute('data-eureka-replaced')) {
                    link.style.position = 'relative'; // Anchor for our injected text
                    
                    // Keep original images fully in layout so JS bounding client rect math works perfectly!
                    const imgs = link.querySelectorAll('img');
                    imgs.forEach(img => { 
                        img.style.opacity = '0'; 
                    });
                    
                    const span = iframeDoc.createElement('span');
                    span.innerHTML = 'eureka<sup style=\"font-size: 0.8rem; vertical-align: super; margin-left: 2px;\">®</sup>';
                    span.style.cssText = 'position: absolute; top: 50%; left: 0; transform: translateY(-50%); font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: inherit; font-size: 2.2rem; display: inline-block; white-space: nowrap;';
                    link.appendChild(span);
                    link.setAttribute('data-eureka-replaced', 'true');
                }
            });'''
            
new_header = '''            // Cleanly replace Logos in the DOM
            const headerLogoLinks = iframeDoc.querySelectorAll('a.logo-container');
            headerLogoLinks.forEach(link => {
                if (!link.hasAttribute('data-eureka-replaced')) {
                    link.innerHTML = '<span style=\"font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: inherit; font-size: 2.2rem; display: inline-block; margin-top: -2px;\">eureka</span><sup style=\"font-size: 0.8rem; vertical-align: super; margin-left: 2px;\">®</sup>';
                    link.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

content = content.replace(old_header, new_header)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
