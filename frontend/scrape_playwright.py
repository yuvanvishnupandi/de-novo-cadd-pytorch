import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        print("Navigating to enveda.com...")
        await page.goto("https://enveda.com/", wait_until="networkidle", timeout=60000)
        
        print("Page loaded. Executing DOM text replacements...")
        await page.evaluate("""() => {
            const walkDomAndReplace = (node) => {
                if (node.nodeType === 3) {
                    let text = node.nodeValue;
                    let original = text;
                    text = text.replace(/Life is smart\\.\\s*Let[\\’\\']s learn from it\\./gi, "Physics is smart. Let's simulate it.");
                    text = text.replace(/Enveda is learning from life to discover medicines/gi, "EUREKA is using Generative AI to discover medicines");
                    text = text.replace(/4X faster/gi, "10X faster");
                    text = text.replace(/The greatest resource\\s*for drug discovery is\\s*the great unknown/gi, 'The greatest resource for drug discovery is deterministic simulation');
                    text = text.replace(/Learning\\s*from Life\\./gi, 'Learning from Data.');
                    text = text.replace(/©\\s*202[0-9]\\s*ENVEDA/gi, '© 2026 EUREKA');
                    text = text.replace(/Human\\.\\s*Nature\\./gi, 'Generative. Precise.');
                    text = text.replace(/\\bEnveda\\b/gi, 'EUREKA');
                    text = text.replace(/\\bENVEDA\\b/gi, 'EUREKA');
                    
                    if (text.trim() === 'Platform') text = 'Dashboard';
                    if (text.trim() === 'Purpose') text = 'AI Models';
                    if (text.trim() === 'People') text = 'Simulation';
                    if (text.includes('In-Veda')) text = 'Results';
                    if (text.trim() === 'News') text = 'About';
                    if (text.trim() === 'Press') text = 'Docs';
                    if (text.trim() === 'Careers') text = 'Export';
        
                    if (text !== original) {
                        node.nodeValue = text;
                    }
                } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        walkDomAndReplace(node.childNodes[i]);
                    }
                }
            };
            walkDomAndReplace(document.body);
            
            // Hide SVGs and add EUREKA logo via CSS
            const style = document.createElement('style');
            style.innerHTML = `
                svg[class*="logo"], .logo svg, a[href="/"] svg, .footer-logo svg {
                    display: none !important;
                }
                a[href="/"]::after, .logo::after, .footer-logo::after {
                    content: 'EUREKA';
                    font-family: inherit;
                    font-weight: 800;
                    letter-spacing: -1px;
                    color: currentColor;
                }
                a[href="/"]::after { font-size: 2rem; }
                .footer-logo::after {
                    font-size: 15vw !important;
                    line-height: 1;
                    display: block;
                    text-align: center;
                    margin-bottom: 2rem;
                }
            `;
            document.head.appendChild(style);
        }""")
        
        print("Waiting 5 seconds for animations to settle...")
        await page.wait_for_timeout(5000)
        
        print("Saving perfect static DOM dump to public/enveda_clone.html...")
        html_content = await page.content()
        with open("public/enveda_clone.html", "w", encoding="utf8") as f:
            f.write(html_content)
            
        print("Done!")
        await browser.close()

asyncio.run(main())
