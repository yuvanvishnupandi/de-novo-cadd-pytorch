import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

// Fix Node.js 17+ ENOTFOUND fetch bug on Windows by preferring IPv4
dns.setDefaultResultOrder('ipv4first');

// Custom plugin to strictly strip security headers and rewrite HTML domains
const envedaProxyPlugin = () => {
  return {
    name: 'enveda-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/enveda_proxy')) {
          try {
            // Extract path (e.g. '/enveda_proxy/platform/' -> '/platform/')
            // Handle query strings as well
            const urlPath = req.url.replace(/^\/enveda_proxy/, '');
            const targetUrl = `https://enveda.com${urlPath}`;
            
            const response = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9',
              }
            });

            let html = await response.text();
            
            // Rewrite all absolute links to relative for page navigation, but LEAVE assets (wp-content) pointing to the original CDN
            html = html.replace(/https:\/\/enveda\.com\/(?!wp-content|wp-includes|wp-json)/g, '/');
            
            // Cleanly recharge purpose (#aimodels) and general page content to EUREKA
            // 1. Hero Title & Subtitle & Typed.js
            html = html.replace(/The future\s*<br\s*\/?>\s*is ancient/gi, 'The future <br /> is deterministic.');
            html = html.replace(/Enveda is writing a healthier, more hopeful future by\s*<br\s*\/?>\s*empowering scientists to access the unexplored potential\s*<br\s*\/?>\s*of life’s chemical code\./gi, 'EUREKA is writing a faster, autonomous future by <br /> empowering scientists to navigate and synthesize the unexplored potential <br /> of the chemical space.');
            html = html.replace(/Today’s mission: drug discovery\.\s*<br\s*\/?>\s*Tomorrow’s possibilities: agriculture, nutrition, manufacturing, and more\./gi, 'Today’s mission: in-silico drug discovery. <br />Tomorrow’s possibilities: fully autonomous AI chemistry.');

            // 2. "Be a part of our progress"
            html = html.replace(/Together, we can rapidly multiply our knowledge of the world’s chemistry and solve the greatest challenges in human and planetary health\./gi, 'Together, we can accelerate molecular discovery through deterministic deep learning and eliminate the guesswork of traditional drug development.');
            html = html.replace(/>Partner With Us</gi, '>Explore Models<');
            html = html.replace(/>Join The Team</gi, '>View GitHub<');

            // 3. "THE CHEMICAL CODE" -> "DE NOVO GENERATIVE CHEMISTRY"
            html = html.replace(/<span>THE CHEMICAL CODE<\/span>/gi, '<span>DE NOVO GENERATIVE CHEMISTRY</span>');
            html = html.replace(/A life lesson\s*<br\s*\/?>\s*from life itself/gi, 'A computational leap <br /> in chemical space');
            html = html.replace(/When scientists first sequenced the human genome.*?decoding the chemical code of life\./gs, 'When computational biologists first mapped protein tertiary structures, it unlocked rational drug design. But exploring the 10^60 possible chemical space requires generative intelligence. The EUREKA platform couples deep autoregressive language models with biophysical force fields: exploring untapped chemical space and autonomously synthesizing novel, valid lead molecules in seconds: <strong>simulating the chemical code of life in-silico.</strong>');
            html = html.replace(/>Learn More<\/a>/gi, '>Explore Pipeline</a>');

            // 4. "OUR ORIGIN" ("What's in a name?") -> Cleanly eliminate "euable" and complete eureka
            html = html.replace(/<div class="en line">en<span>able<\/span><\/div>/gi, '<div class="en line">eu<span>reka</span></div>');
            html = html.replace(/<div class="veda line">veda<\/div>/gi, '<div class="veda line">reka</div>');
            html = html.replace(/<div class="knowledge line">\s*knowledge\s*<\/div>/gi, '<div class="knowledge line">discovery</div>');
            html = html.replace(/Enveda \(pronounced en-VAY-da\) blends the English word [“"]enable[”"] with the Sanskrit word [“"]veda,[”"] meaning [“"]knowledge\.[”"]/gi, 'EUREKA (pronounced yoo-REE-kuh) blends the Ancient Greek word "eu," meaning "good," and "reka," meaning "discovery."');
            html = html.replace(/We enable scientists to harness the collective wisdom of humanity\. And we uncover knowledge for the future\. We do so to help people everywhere live healthier, more fulfilling lives\./gi, 'We empower scientists to harness the power of deterministic simulation. And we uncover computational models for the future. We do so to help accelerate the drug discovery pipeline.');

            // 5. "Our Pipeline"
            html = html.replace(/<h5 class="mb-2">Our Pipeline<\/h5>/gi, '<h5 class="mb-2">OUR AUTONOMOUS PIPELINE</h5>');
            html = html.replace(/More than 12 groundbreaking molecules and counting/gi, 'Thousands of validated in-silico leads and counting');
            html = html.replace(/Since our founding in 2019, our platform has led to the discovery of a number of candidate medicines.*?one breakthrough at a time\./gs, 'Powered by multi-criteria Pareto optimization, our autonomous pipeline has evaluated over 500,000 chemical candidates, advancing high-affinity leads like EUR-GenAI-1, EUR-Dock-2, and EUR-ADMET-3 with verified AutoDock Vina binding scores below -7.5 kcal/mol and strict Tox21 safety compliance.');

            // Remove butterfly video section (video-box-alt)
            html = html.replace(/<div id="video-box-alt">[\s\S]*?<\/div>/gi, '');

            // 6. "SUSTAINABILITY" -> "COMPUTATIONAL DETERMINISM"
            html = html.replace(/<span>SUSTAINABILITY<\/span>/gi, '<span>COMPUTATIONAL DETERMINISM</span>');
            html = html.replace(/Our commitment\s*<br\s*\/?>\s*to nature/gi, 'Our commitment <br /> to deterministic AI');
            html = html.replace(/Healthy people require a healthy planet\./gi, 'Rigorous science requires deterministic computation.');
            html = html.replace(/We recognize that humanity’s (?:&#8211;|–|-) and Enveda’s (?:&#8211;|–|-) existence is intricately linked to the rich biodiversity of our planet\./gi, 'We strictly reject black-box agentic unpredictability in favor of deterministic deep learning and physics-based validation.');
            html = html.replace(/As we catalog life’s chemistry, we adhere to access- and benefit-sharing provisions in line with the Convention on Biological Diversity\..*?collaboration with our global partners\./gs, 'By anchoring every generated molecule to verified biophysical laws—AutoDock Vina force field docking and empirical NIH Tox21 assay models—we ensure 100% reproducible and synthesizable discovery results.');
            html = html.replace(/Sustainability is critical to our mission\./gi, 'Determinism is critical to our mission.');
            html = html.replace(/<u>Charity<\/u>\s*<br>\s*Take Care of Eachother/gi, '<u>DETERMINISM</u> <br> Rigorous In-Silico Physics');
            html = html.replace(/https:\/\/enveda\.com\/wp-content\/themes\/enveda\/img\/platform-img-2\.jpg/g, '/marquee/computational-determinism.jpg');
            html = html.replace(/\/wp-content\/themes\/enveda\/img\/platform-img-2\.jpg/g, '/marquee/computational-determinism.jpg');

            // 7. Remove Accelerating section and partner logos (Microsoft, Gates Foundation, Nature Conservancy) safely without breaking HTML DOM
            html = html.replace(/<div id="partners">/gi, '<div id="partners" style="display:none!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;">');

            // 8. "OUR PEOPLE"
            html = html.replace(/<span>OUR PEOPLE<\/span>/gi, '<span>SIMULATION</span>');
            html = html.replace(/Human\.\s*Nature\./gi, 'Generative. Precise.');
            html = html.replace(/We’ve cultivated a great team\.\s*And we’re growing\./gi, "We've built a fully deterministic pipeline.");
            html = html.replace(/>Join Us<\/a>/gi, '>Explore Models</a>');

            // 9. "ISSUE 01"
            html = html.replace(/ISSUE\s*<sup><small>01<\/small><\/sup>/gi, 'EPOCH <sup><small>01</small></sup>');
            html = html.replace(/Foundations &\s*<br\s*\/?>\s*Learning from Life/gi, 'Generative & <br /> Generating Molecules.');
            html = html.replace(/Enveda exists to give hope to millions of people around the world by accelerating the pace of life-saving and life-enhancing drug discovery\./gi, 'EUREKA exists to eliminate the guesswork of traditional drug discovery by simulating molecular interactions entirely in-silico.');
            html = html.replace(/>Keep Reading\s*<\/a>/gi, '>Explore Platform</a>');
            html = html.replace(/href="\/in-veda\/"/gi, 'href="/platform/"');

            // 10. Footer & Branding
            html = html.replace(/<h2>Locations<\/h2>/gi, '<h2>Architecture</h2>');
            html = html.replace(/Enveda\s*<br>5700 Flatiron Parkway\s*<br>Boulder, CO 80301/gi, 'FastAPI Backend Server <br>Cloud Deployment');
            html = html.replace(/M\/s Enveda Therapeutics India Pvt Ltd\s*<br>3rd Floor, Building 3600 - Synergy Square-3,\s*<br>Genome Valley, Hyderabad – 500101 India/gi, 'Model Training Layer <br>De Novo Generation Node <br>Distributed Compute');
            html = html.replace(/Learning\s*<br>from Life\./gi, 'Learning <br>Molecules.');
            html = html.replace(/Copyright\s*[^<]*?ENVEDA\s*All rights reserved/gi, 'Copyright &copy; 2026 EUREKA All rights reserved');
            html = html.replace(/Site by Maven Creative/gi, 'Developed for EUREKA Pipeline');
            html = html.replace(/\bEnveda\b/g, 'EUREKA');
            html = html.replace(/\bENVEDA\b/g, 'EUREKA');

            // Remove Results, About, and Docs from header navbar only (protects the footer completely!)
            html = html.replace(/<li[^>]*id="menu-item-103"[^>]*>[\s\S]*?<\/li>/gi, '');
            html = html.replace(/<li[^>]*id="menu-item-104"[^>]*>[\s\S]*?<\/li>/gi, '');
            html = html.replace(/<li[^>]*id="menu-item-1065"[^>]*>[\s\S]*?<\/li>/gi, '');

            // Inject Google Font "Outfit" directly into the HTML head so it flawlessly loads
            html = html.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet"></head>');
            
            // Strip headers
            res.setHeader('Content-Type', 'text/html');
            res.removeHeader('X-Frame-Options');
            res.removeHeader('Content-Security-Policy');
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            res.end(html);
            return;
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end('Proxy error');
            return;
          }
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), envedaProxyPlugin()],
  server: {
    proxy: {
      '/wp-content': {
        target: 'https://enveda.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Referer': 'https://enveda.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            proxyRes.headers['access-control-allow-origin'] = '*';
          });
        }
      },
      '/wp-includes': {
        target: 'https://enveda.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Referer': 'https://enveda.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/wp-json': {
        target: 'https://enveda.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Referer': 'https://enveda.com/',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    }
  }
})
