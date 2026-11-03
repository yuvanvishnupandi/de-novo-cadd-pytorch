import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix Header Logo Safely with Wrapper
old_header = '''            // Safely hide original logos without destroying them to prevent GSAP crash
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
            
new_header = '''            // Wrap the logo to preserve absolute layout space and prevent JS crashes
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

content = content.replace(old_header, new_header)

# Fix Footer Logo Safely with Wrapper
old_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
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

new_footer = '''            const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
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

content = content.replace(old_footer, new_footer)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
