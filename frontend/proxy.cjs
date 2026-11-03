const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://enveda.com',
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true, // Required for responseInterceptor
  headers: {
    'Referer': 'https://enveda.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Encoding': 'identity'
  },
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    // Strip security headers
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['access-control-allow-origin'];
    
    // Add lenient CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    // Only modify HTML responses
    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
        let html = responseBuffer.toString('utf8');
        
        // Text Replacements
        html = html.replace(/Life is smart\.\s*Let[’\']s learn from it\./gi, "Physics is smart. Let's simulate it.");
        html = html.replace(/Enveda is learning from life to discover medicines/gi, "EUREKA is using Generative AI to discover medicines");
        html = html.replace(/4X faster/gi, "10X faster");
        
        html = html.replace(/>\s*Platform\s*</gi, '>Dashboard<');
        html = html.replace(/>\s*Purpose\s*</gi, '>AI Models<');
        html = html.replace(/>\s*People\s*</gi, '>Simulation<');
        html = html.replace(/>\s*In-Veda(™|TM|<sup>TM<\/sup>)?\s*</gi, '>Results<');
        html = html.replace(/>\s*News\s*</gi, '>About<');
        html = html.replace(/>\s*Press\s*</gi, '>Docs<');
        html = html.replace(/>\s*Careers\s*</gi, '>Export<');
        
        html = html.replace(/The greatest resource\s*for drug discovery is\s*the great unknown/gi, 'The greatest resource for drug discovery is deterministic simulation');
        html = html.replace(/Learning\s*from Life\./gi, 'Learning from Data.');
        html = html.replace(/©\s*202[0-9]\s*ENVEDA/gi, '© 2026 EUREKA');
        html = html.replace(/Human\.\s*Nature\./gi, 'Generative. Precise.');
        
        // Replace Enveda everywhere, including domains in links so they don't show up in the status bar!
        html = html.replace(/\bEnveda\b/g, 'EUREKA');
        html = html.replace(/\bENVEDA\b/g, 'EUREKA');
        html = html.replace(/\benveda\.com\b/g, 'eureka.com');
        html = html.replace(/\benveda\b/gi, 'eureka');
        
        // Remove the intro text on the People page as requested by the user
        html = html.replace(/The people behind our progress/gi, "");
        html = html.replace(/Our work is a group effort[^<]*?Join us on the journey\./gi, "");
        html = html.replace(/We invest in learn-it-alls[^<]*?we encourage you to apply\./gi, "");
        
        // Inject CSS to hide SVGs and show EUREKA
        const cssInjection = `
        <style>
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
        </style>
        </head>
        `;
        html = html.replace('</head>', cssInjection);
        
        return html;
    }
    
    // Return original buffer for non-HTML (images, css, js)
    return responseBuffer;
  }),
  cookieDomainRewrite: {
    '*': 'localhost'
  }
}));

app.listen(8080, () => {
  console.log('Flawless EUREKA Proxy running on http://localhost:8080');
});
