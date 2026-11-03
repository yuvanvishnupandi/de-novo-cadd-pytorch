import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
            footerLogos.forEach(img => {
                if (!img.hasAttribute('data-eureka-replaced')) {
                    img.style.opacity = '0';
                    img.style.position = 'absolute';
                    img.style.pointerEvents = 'none';
                    
                    const h1 = iframeDoc.createElement('h1');
                    h1.innerHTML = 'eureka<sup style=\"font-size: 4vw; vertical-align: super;\">®</sup>';
                    h1.className = 'footer-logo'; // INHERIT CSS FROM ORIGINAL SO IT DROPS TO THE BOTTOM!
                    h1.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; text-align: left; margin: 0; padding: 0;';
                    
                    img.parentNode.insertBefore(h1, img);
                    img.setAttribute('data-eureka-replaced', 'true');
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
                    h1.className = 'footer-logo';
                    h1.style.cssText = 'font-family: \\'Outfit\\', sans-serif !important; font-weight: 300; letter-spacing: -2px; color: #111; font-size: 23vw !important; line-height: 0.8; text-align: left; margin: 0; padding: 0;';
                    
                    // The logo belongs visually at the bottom of the footer.
                    // By appending it to the end of its parent container, it drops to the bottom perfectly.
                    img.parentNode.appendChild(h1);
                    img.setAttribute('data-eureka-replaced', 'true');
                }
            });'''

content = content.replace(old_footer, new_footer)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
