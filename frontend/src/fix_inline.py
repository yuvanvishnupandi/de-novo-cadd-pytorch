import re

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Remove display: block from footer h1 inline style
content = content.replace("display: block; ", "")

with open('c:/Users/yuvan/OneDrive/Documents/eureka/frontend/src/App.jsx', 'w') as f:
    f.write(content)
print('Done!')
