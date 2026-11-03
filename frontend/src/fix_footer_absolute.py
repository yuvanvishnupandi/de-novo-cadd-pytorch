import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

old_css = '''            const style = iframeDoc.createElement('style');
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

new_css = '''            const style = iframeDoc.createElement('style');
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

content = content.replace(old_css, new_css)

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
