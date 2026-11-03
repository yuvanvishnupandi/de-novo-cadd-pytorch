import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

old_css = '''            const style = iframeDoc.createElement('style');
            style.innerHTML = `
                /* Prevent Navbar items from wrapping */
                header li a, header nav a, .nav-item {
                    white-space: nowrap !important;
                }
            `;'''

new_css = '''            const style = iframeDoc.createElement('style');
            style.innerHTML = `
                /* Prevent Navbar items from wrapping */
                header li a, header nav a, .nav-item {
                    white-space: nowrap !important;
                }
                
                /* Force footer logo to the bottom visually without altering DOM structure */
                footer .container-fluid {
                    display: flex !important;
                    flex-direction: column !important;
                }
                footer .footer-logo {
                    order: 99 !important;
                    margin-top: 5vw !important;
                }
            `;'''

content = content.replace(old_css, new_css)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
