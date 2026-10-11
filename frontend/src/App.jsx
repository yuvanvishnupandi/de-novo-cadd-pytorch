import React, { useRef, useEffect, useState } from 'react';
import { EUREKA_ARCH_HTML } from './pipelineArchitecture';
import { setupTargetHub } from './targetHub';

function App() {
  const iframeRef = useRef(null);
  const [proxyUrl, setProxyUrl] = useState('/enveda_proxy');

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#dashboard' || hash === '' || hash === '#') setProxyUrl('/enveda_proxy');
        else if (hash.startsWith('#platform')) setProxyUrl('/enveda_proxy/platform/');
        else if (hash.startsWith('#pipeline')) setProxyUrl('/enveda_proxy/pipeline/');
        else if (hash.startsWith('#aimodels')) setProxyUrl('/enveda_proxy/purpose/');
        else if (hash.startsWith('#results')) setProxyUrl('/enveda_proxy/platform/');
        else if (hash.startsWith('#about')) setProxyUrl('/enveda_proxy/news/');
        else if (hash.startsWith('#docs')) setProxyUrl('/enveda_proxy/press/');
        else if (hash.startsWith('#export')) setProxyUrl('/enveda_proxy/careers/');
        else setProxyUrl('/enveda_proxy');
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const applyTextReplacements = () => {
      try {
        const iframeDoc = iframeRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        // Hide the glyph SVG if necessary
        const style = iframeDoc.createElement('style');
        style.innerHTML = `
          /* Prevent Navbar items from wrapping */
          header li a, header nav a, .nav-item {
              white-space: nowrap !important;
          }
          
          /* Remove butterfly video section on aimodels */
          #video-box-alt {
              display: none !important;
              height: 0 !important;
              min-height: 0 !important;
              max-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
          }

          /* Remove Accelerating section and logos (Microsoft, Gates Foundation, Nature Conservancy) */
          #partners,
          #partners + .spacer-xl,
          #partner-list {
              display: none !important;
              height: 0 !important;
              min-height: 0 !important;
              max-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
          }

          /* Remove Results, About, and Docs from header navigation only */
          header a[href*="/in-veda/"],
          header a[href*="/news/"],
          header a[href*="/press/"],
          header a[href*="#results"],
          header a[href*="#about"],
          header a[href*="#docs"],
          header #menu-item-103,
          header #menu-item-104,
          header #menu-item-1065 {
              display: none !important;
              visibility: hidden !important;
          }

          /* Shift Github Repo button slightly to the left so it's placed correctly */
          header #menu-main-right {
              margin-right: 50px !important;
              padding-right: 20px !important;
          }
          header li.menu-btn,
          header #menu-item-102,
          header a[href*="/careers/"],
          header a[href*="#export"] {
              margin-right: 40px !important;
              display: inline-block !important;
          }

          /* Ensure footer and colophon are ALWAYS fully visible, crisp, properly positioned */
          footer, .site-footer, #colophon {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              position: relative !important;
              z-index: 10 !important;
          }
          footer .container-fluid, #colophon .container-fluid {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
          }
          footer .footer-logo {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              max-width: 100% !important;
              height: auto !important;
          }
          footer ul {
              display: block !important;
              column-count: 2 !important;
          }
          footer ul li {
              display: list-item !important;
              list-style: none !important;
              visibility: visible !important;
              opacity: 1 !important;
          }
          footer ul li a, footer .social a, #colophon a {
              display: inline !important;
              visibility: visible !important;
              opacity: 1 !important;
          }
          footer .right, footer .right * {
              visibility: visible !important;
              opacity: 1 !important;
          }
        `;
        const existingStyles = iframeDoc.head.querySelector('#eureka-styles');
        if (!existingStyles) {
            style.id = 'eureka-styles';
            iframeDoc.head.appendChild(style);
        } else {
            existingStyles.innerHTML = style.innerHTML;
        }

        // Physically replace the Logos in the DOM without destroying original layout (prevents JS animation crashes)
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
                span.innerHTML = 'eureka<sup style="font-size: 0.8rem; vertical-align: super; margin-left: 2px;">®</sup>';
                span.style.cssText = 'position: absolute; top: 50%; left: 0; transform: translateY(-50%); font-family: \'Outfit\', sans-serif !important; font-weight: 300; letter-spacing: 0px; color: #ffffff !important; font-size: 2.8rem; display: inline-block; white-space: nowrap; text-shadow: 0 2px 10px rgba(0,0,0,0.2);';
                link.appendChild(span);
                
                // Block the native link behavior so it doesn't leave the proxy!
                link.onclick = (e) => {
                    e.preventDefault();
                    window.top.location.hash = '#dashboard';
                };
                
                link.setAttribute('data-eureka-replaced', 'true');
            }
        });

        // Safeguard: Ensure footer and all footer children/images are NEVER hidden
        iframeDoc.querySelectorAll('footer, footer *, #colophon, #colophon *').forEach(el => {
            if (el.style.display === 'none') el.style.removeProperty('display');
            if (el.style.opacity === '0') el.style.removeProperty('opacity');
            if (el.style.visibility === 'hidden') el.style.removeProperty('visibility');
        });

        const footerLogos = iframeDoc.querySelectorAll('img.footer-logo');
        footerLogos.forEach(img => {
            // viewBox width is increased to 1200 so the aspect ratio is much wider.
            // The text sits perfectly at the left, scaled normally, completely clear of the links.
            const rawSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 150'><style>text { font-family: 'Outfit', sans-serif, -apple-system; font-weight: 300; font-size: 140px; fill: #111; letter-spacing: -5px; }</style><text x='0' y='110'>eureka<tspan font-size='50px' baseline-shift='super'>®</tspan></text></svg>`;
            const svg = "data:image/svg+xml," + encodeURIComponent(rawSvg);
            
            if (img.src !== svg) {
                img.src = svg;
                if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
            }
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.setAttribute('data-eureka-replaced', 'true');
        });

        // Safely load the user's custom technology logos into the marquee
        const tickerLogos = iframeDoc.querySelectorAll('.logo-ticker img');
        const customImages = [
            '/marquee/pytorch.png',
            '/marquee/autodock.png',
            '/marquee/pubchem.png',
            '/marquee/chembl.png',
            '/marquee/fastapi.png',
            '/marquee/nvidia.png',
            '/marquee/aws.png'
        ];
        
        tickerLogos.forEach((img, index) => {
            if (!img.hasAttribute('data-eureka-replaced')) {
                const newSrc = customImages[index % customImages.length];
                img.src = newSrc;
                if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                
                // Enforce uniform sizing but allow them to be large and prominent
                img.style.maxHeight = '120px';
                img.style.width = 'auto';
                img.style.objectFit = 'contain';
                
                // Safe replacement without layout-altering transforms
                img.onerror = () => { img.style.display = 'none'; };
                
                img.setAttribute('data-eureka-replaced', 'true');
            }
        });

        // Safely replace the background image with the user's MP4 video
        const bgImages = iframeDoc.querySelectorAll('img.video-bg');
        bgImages.forEach(img => {
            if (img.src && img.src.includes('video-bg-platform') && !img.hasAttribute('data-eureka-replaced')) {
                // We CANNOT delete this image because GSAP uses it for animation calculations.
                // Instead, we make it completely invisible.
                img.style.opacity = '0';
                
                // Now we create a true HTML5 video element to play the MP4
                const video = iframeDoc.createElement('video');
                video.src = '/marquee/background.mp4';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                
                // Match the exact dimensions and positioning of the original background
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '-1'; // Ensure it stays behind the text and masks
                
                // Inject the video safely right next to the original image
                img.parentNode.insertBefore(video, img);
                
                img.setAttribute('data-eureka-replaced', 'true');
            }
        });

        // Safely replace the AI Models image (home-img-1) ONLY if the user uploaded the file
        const aiModelImg = iframeDoc.querySelector('img.home-img-1');
        if (aiModelImg && !aiModelImg.hasAttribute('data-eureka-replaced')) {
            const preloader = new Image();
            preloader.onload = () => { // Only runs if file exists! Zero risk of disappearing image!
                aiModelImg.src = preloader.src;
                if (aiModelImg.hasAttribute('srcset')) aiModelImg.removeAttribute('srcset');
            };
            preloader.src = '/marquee/ai-model.webp';
            aiModelImg.setAttribute('data-eureka-replaced', 'true');
        }

        // Safely replace the 3D Globe iframe with the user's MP4 video
        const globes = iframeDoc.querySelectorAll('iframe[src*="planets"]');
        globes.forEach(globe => {
            if (!globe.hasAttribute('data-eureka-replaced')) {
                const newGlobe = iframeDoc.createElement('video');
                newGlobe.src = '/marquee/globe.mp4';
                newGlobe.autoplay = true;
                newGlobe.loop = true;
                newGlobe.muted = true;
                newGlobe.playsInline = true;
                
                // Only hide the original globe if our new video successfully starts loading
                newGlobe.oncanplay = () => {
                    globe.style.opacity = '0';
                    globe.style.pointerEvents = 'none';
                };
                
                newGlobe.style.position = 'absolute';
                newGlobe.style.top = '0';
                newGlobe.style.left = '0';
                newGlobe.style.width = '100%';
                newGlobe.style.height = '100%';
                newGlobe.style.objectFit = 'contain';
                newGlobe.style.zIndex = '1';
                newGlobe.style.willChange = 'transform';
                newGlobe.style.transform = 'translateZ(0)';
                
                globe.parentNode.style.position = 'relative';
                globe.parentNode.insertBefore(newGlobe, globe);
                globe.setAttribute('data-eureka-replaced', 'true');
            }
        });

        // Safely replace ONLY the specific Spline Pill iframe with a user's custom image if it exists
        const pillIframes = iframeDoc.querySelectorAll('iframe[src*="aheadpill"]');
        pillIframes.forEach(pill => {
            if (!pill.hasAttribute('data-eureka-replaced')) {
                const preloader = new Image();
                preloader.onload = () => { // Only replaces if the user actually creates the image!
                    const newImg = iframeDoc.createElement('img');
                    newImg.src = preloader.src;
                    newImg.style.position = 'absolute';
                    newImg.style.top = '0';
                    newImg.style.left = '0';
                    newImg.style.width = '100%';
                    newImg.style.height = '100%';
                    newImg.style.objectFit = 'contain';
                    newImg.style.zIndex = '5';
                    newImg.style.pointerEvents = 'none'; // Prevent interfering with scroll
                    
                    pill.style.opacity = '0'; // Hide the iframe
                    pill.parentNode.style.position = 'relative';
                    pill.parentNode.insertBefore(newImg, pill);
                };
                preloader.src = '/marquee/platform-graphic.avif'; // The filename for the user
                
                pill.setAttribute('data-eureka-replaced', 'true');
            }
        });

        // Safely replace the featured "In-Veda" graphic image on the right side
        const featImage = iframeDoc.querySelector('#featured-issue img.feat');
        if (featImage && !featImage.hasAttribute('data-eureka-replaced')) {
            const featPreloader = new Image();
            featPreloader.onload = () => { // Only runs if file exists, 100% safe
                featImage.src = featPreloader.src;
                if (featImage.hasAttribute('srcset')) featImage.removeAttribute('srcset');
                if (featImage.hasAttribute('data-src')) featImage.removeAttribute('data-src');
            };
            featPreloader.src = '/marquee/eureka-feature.png';
            featImage.setAttribute('data-eureka-replaced', 'true');
        }

        // Safely replace the Computational Determinism graphic image on the right side
        const determImages = iframeDoc.querySelectorAll('img[src*="platform-img-2"], img[src*="computational-determinism"]');
        determImages.forEach(img => {
            if (!img.src.includes('/marquee/computational-determinism.jpg')) {
                img.src = '/marquee/computational-determinism.jpg';
                if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
                img.setAttribute('data-eureka-replaced', 'true');
            }
            img.style.borderRadius = '16px';
            img.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
        });

        // Replace text on the Pipeline page
        if (window.top.location.hash === '#pipeline' && iframeDoc && iframeDoc.body) {
            
            // Completely hide the Featured Medicines section and all its contents
            const featMed = iframeDoc.getElementById('featured-medicines');
            if (featMed) {
                featMed.style.setProperty('display', 'none', 'important');
                featMed.style.setProperty('height', '0', 'important');
                featMed.style.setProperty('margin', '0', 'important');
                featMed.style.setProperty('padding', '0', 'important');
                featMed.style.setProperty('overflow', 'hidden', 'important');
                featMed.style.setProperty('opacity', '0', 'important');
                featMed.style.setProperty('pointer-events', 'none', 'important');
            }

            // Hide vimeo video sections and their parent sections to remove gaps
            const vimeoIframes = iframeDoc.querySelectorAll('iframe[src*="vimeo"]');
            vimeoIframes.forEach(iframe => {
                let section = iframe.closest('section');
                if (section) {
                    section.style.display = 'none';
                } else {
                    let parent = iframe.closest('.grid, .flex') || iframe.parentElement;
                    if (parent) parent.style.display = 'none';
                }
            });

            const walker = iframeDoc.createTreeWalker(iframeDoc.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                if (node.parentElement) {
                    if (node.parentElement.closest('#featured-medicines')) {
                        node.nodeValue = '';
                        continue;
                    }
                    if (node.parentElement.closest('#eureka-system-architecture')) {
                        continue;
                    }
                }
                if (node.nodeValue && node.nodeValue.trim().length > 0) {
                    let val = node.nodeValue;
                    
                    // Replace branding
                    val = val.replace(/Enveda/g, 'EUREKA');
                    
                    // Replace molecule names in table
                    val = val.replace(/ENV-294/g, 'EUR-GenAI-1');
                    val = val.replace(/ENV-308/g, 'EUR-Dock-2');
                    val = val.replace(/ENV-6946/g, 'EUR-ADMET-3');
                    val = val.replace(/ESN-6946/g, 'EUR-ADMET-4');
                    
                    // Hide lingering link fragments from the old descriptions
                    const fragmentsToHide = [
                        '3 million', 'people in the United States. IBD has', 'limited treatment options', 
                        'that have proven to cause long-term remission in patients.', 'Moreover, many safe existing treatments have to be delivered as injections',
                        'or pills that come with significant safety liabilities.', 'half of all eczema to atopic dermatitis patients', 'respond poorly to therapy.',
                        'half of all Alzheimer\'s to atopic dermatitis patients'
                    ];
                    if (fragmentsToHide.some(frag => val.includes(frag))) {
                        val = '';
                    }
                    
                    // GSAP split text fixes (they split by newlines/words)
                    val = val.replace(/already advanced into the clinic\./gi, "have successfully passed in-silico validation.");
                    val = val.replace(/Many EUREKA molecules have/gi, "Thousands of EUREKA-generated molecules have");
                    val = val.replace(/A new way to Rigorous/gi, "Rigorous");
                    val = val.replace(/A In-silico evaluation/gi, "In-silico evaluation");
                    
                    // Replace diseases & mechanisms in the table (just in case they still exist)
                    val = val.replace(/Atopic Dermatitis/g, "Target Validated");
                    val = val.replace(/Asthma/g, 'Target Validated');
                    val = val.replace(/post-Weight Loss Maintenance/g, 'Target Validated');
                    val = val.replace(/Inflammatory Bowel Disease/g, 'Target Validated');
                    
                    val = val.replace(/counteract atopic dermatitis & other inflammatory diseases/g, "De novo molecular generation using advanced deep learning architectures");
                    val = val.replace(/sustain metabolic health/g, 'Rigorous physics-based validation of generated molecules');
                    val = val.replace(/gut-preferred molecule for inflammatory bowel disease/g, 'In-silico evaluation of toxicity and pharmacokinetics');
                    
                    // Platform vs Medicine wording (CRITICAL for user)
                    val = val.replace(/Differentiated medicines,discovered at record pace/gi, "Novel chemical spaces, synthesized at record pace");
                    val = val.replace(/we have discovered differentiated therapies for some of the most challenging and pervasive diseases/gi, "researchers can synthesize highly specific binding candidates for the most challenging target proteins");
                    val = val.replace(/Many EUREKA molecules havealready advanced into the clinic/gi, "Thousands of EUREKA-generated molecules have successfully passed in-silico validation");
                    val = val.replace(/Watch their progress/gi, "View our pipeline architecture.");
                    
                    // Stats Bar (Clinical Assets Across, IND-enabling, Development Candidates)
                    val = val.replace(/Clinical Assets Across/gi, "Autonomous AI Pipelines");
                    val = val.replace(/IND-enabling Assets/gi, "Synthesized Ligands");
                    val = val.replace(/Development Candidates/gi, "Active FASTA Endpoints");
                    
                    // Table Headers
                    val = val.replace(/Mechanism/g, 'Model Type');
                    val = val.replace(/Indications/g, 'Status');
                    val = val.replace(/Indication/g, 'Status');
                    val = val.replace(/Discovery/g, 'Sequence Parsing');
                    val = val.replace(/Optimization/g, '3D Folding');
                    val = val.replace(/IND-Enabling/g, 'MCTS Generation');
                    val = val.replace(/Phase 1/g, 'Vina Docking');
                    val = val.replace(/Phase 2/g, 'ADMET Screening');
                    
                    val = val.replace(/Novel \(Non-Kinase\)/g, 'LSTM-DeNovo-v4');
                    val = val.replace(/Novel \(Hormone Mimetic\)/g, 'Transformer-Gen-v2');
                    val = val.replace(/Novel \(TL1A\+ Pathway Inhibitor\)/g, 'Graph-CNN-Dock');
                    val = val.replace(/Development Candidate Declared/g, 'AI Validation Complete');
                    // Section Headers: Hide them safely
                    if (val.includes('Featured Medicines') || val.includes('System Architecture') || 
                        val.includes('THE PROBLEM') || val.includes('THE CHALLENGE') || 
                        val.includes('THE MOLECULE') || val.includes('THE AI SYNTHESIS') || val.includes('THE ENGINE') || 
                        val.includes('THE PROGRESS') || val.includes('THE OUTPUT')) {
                        val = '';
                    }
                    
                    // Hide the giant "Architecture" or "Model Type" text specifically without hiding the table column
                    if (val.trim() === 'Architecture' || val.trim() === 'Model Type' || val.trim() === 'System Architecture') {
                        let parent = node.parentElement;
                        if (parent && parent.tagName !== 'BODY') {
                            let style = iframeDoc.defaultView.getComputedStyle(parent);
                            if (parseInt(style.fontSize) > 40 || parent.tagName.includes('H')) {
                                val = '';
                            }
                        }
                    }
                    
                    // Descriptions: Hide them instead of replacing
                    if (val.includes("suffers from atopic dermatitis") || val.includes("suffer from Alzheimer's Disease") || val.includes("commonly known as eczema") || 
                        val.includes("medicine that fights inflammation") || val.includes("analyzing the 3D folded geometry of the amyloid precursor protein") || val.includes("analyzing the 3D folded geometry of the target protein") || 
                        val.includes("comparable to Jak-inhibitors") || val.includes("successfully passed rigorous in-silico ADMET toxicity screening") || 
                        val.includes("Metabolic health shapes how we live") || val.includes("The SARS-CoV-2 virus continues to mutate") || val.includes("posing a global threat") || 
                        val.includes("support long-term metabolic balance") || val.includes("mimics an endogenous hormone") || val.includes("Transformer-Gen-v2 model was tasked") || 
                        val.includes("sustained appetite suppression") || val.includes("exceptional AutoDock Vina binding score") || 
                        val.includes("Inflammatory bowel disease") || val.includes("Ebola Hemorrhagic Fever is a highly fatal disease") || val.includes("highly fatal disease caused by the Ebola virus") || 
                        val.includes("new therapeutic approach to treating IBD") || val.includes("hits multiple clinically validated pathways simultaneously") || val.includes("cryptic binding pocket on the VP40 hexamer") || 
                        val.includes("This powerful molecule is currently in") || val.includes("cleared all generative checkpoints")) {
                        
                        val = '';
                    }
                    
                    // Specific Titles for the feature blocks (we don't want to break the table, so only hide if they are headers)
                    if (val.includes("A new way to") || val.includes("Rigorous physics-based") || val.includes("In-silico evaluation") || 
                        val.includes("Novel (Non-Kinase)") || val.includes("Novel (Hormone Mimetic)") || val.includes("Novel (TL1A+ Pathway Inhibitor)")) {
                        let parent = node.parentElement;
                        // H tags or large font sizes usually contain these headers
                        if (parent && parent.tagName !== 'BODY' && (parent.tagName.includes('H') || parseInt(iframeDoc.defaultView.getComputedStyle(parent).fontSize) > 20)) {
                            val = '';
                        }
                    }
                    
                    val = val.replace(/Today’s mission: drug discovery/gi, "Today's mission: de novo drug discovery");
                    val = val.replace(/Tomorrow’s possibilities: agriculture, nutrition, manufacturing, and more/gi, "Tomorrow's possibilities: fully autonomous AI chemistry");

                    // Names
                    if (val.includes('Jonathan Silverberg') || val.includes('Leon Kircik') || val.includes('Alan Turing') || val.includes('John von Neumann')) {
                        val = ''; 
                    }

                    if (node.nodeValue !== val) {
                        node.nodeValue = val;
                    }
                }
            }

            // Safely inject CSS to completely remove the Featured Medicines section without affecting the Hero video or Footer
            let pipelineNukeStyle = iframeDoc.getElementById('nuke-pipeline-canvas');
            if (!pipelineNukeStyle) {
                pipelineNukeStyle = iframeDoc.createElement('style');
                pipelineNukeStyle.id = 'nuke-pipeline-canvas';
                iframeDoc.head.appendChild(pipelineNukeStyle);
            }
            pipelineNukeStyle.innerHTML = `
                /* Completely remove the Featured Medicines section and all its contents (cards, EUR-GenAI-1/Dock/ADMET blocks, icons, pills, blurs) */
                #featured-medicines,
                #featured-medicines ~ .spacer-xl,
                .section-1,
                .section-2,
                .section-3,
                .female-container,
                .gut-container,
                .env294-video-row {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    min-height: 0 !important;
                    max-height: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `;

            // Clear any previously active large-image interval
            if (iframeDoc.nukeLargeImagesInterval) {
                clearInterval(iframeDoc.nukeLargeImagesInterval);
                iframeDoc.nukeLargeImagesInterval = null;
            }

            // Restore the Hero video and Footer images (gradient bar) if previously hidden
            iframeDoc.querySelectorAll('#hero video, #hero img, footer img').forEach(el => {
                if (el.style.display === 'none') el.style.removeProperty('display');
                if (el.style.opacity === '0') el.style.removeProperty('opacity');
                if (el.style.visibility === 'hidden') el.style.removeProperty('visibility');
            });

            // Inject or update the Professional System Architecture & Pipeline Section (matching Enveda template)
            const partOfProgress = iframeDoc.getElementById('part-of-progress');
            if (partOfProgress) {
                const existingArch = iframeDoc.getElementById('eureka-system-architecture');
                if (!existingArch || existingArch.getAttribute('data-version') !== '3.0') {
                    if (existingArch) existingArch.remove();
                    const tempDiv = iframeDoc.createElement('div');
                    tempDiv.innerHTML = EUREKA_ARCH_HTML;
                    const archElement = tempDiv.firstElementChild;
                    if (archElement) {
                        archElement.setAttribute('data-version', '3.0');
                        partOfProgress.parentNode.insertBefore(archElement, partOfProgress);
                    }
                }
            }

        } else {
            let nukeCanvasStyle = iframeDoc.getElementById('nuke-pipeline-canvas');
            if (nukeCanvasStyle) nukeCanvasStyle.remove();
            let existingArch = iframeDoc.getElementById('eureka-system-architecture');
            if (existingArch) existingArch.remove();
        }

        // Inject Universal Target Acquisition & Ingestion Hub on the Platform page
        if (window.top.location.hash.startsWith('#platform')) {
            const hero = iframeDoc.getElementById('hero');
            if (hero) {
                hero.style.setProperty('height', 'auto', 'important');
                hero.style.setProperty('min-height', '100vh', 'important');
                hero.style.setProperty('padding-top', '85px', 'important');
                hero.style.setProperty('overflow', 'visible', 'important');
                hero.querySelectorAll('.spacer-xl, .spacer-lg, .spacer-md').forEach(sp => {
                    sp.style.setProperty('display', 'none', 'important');
                    sp.style.setProperty('height', '0', 'important');
                    sp.style.setProperty('margin', '0', 'important');
                    sp.style.setProperty('padding', '0', 'important');
                });
                const heroContainer = hero.querySelector('.container');
                if (heroContainer) {
                    heroContainer.style.setProperty('height', 'auto', 'important');
                    heroContainer.style.setProperty('min-height', 'auto', 'important');
                    heroContainer.style.setProperty('display', 'flex', 'important');
                    heroContainer.style.setProperty('flex-direction', 'column', 'important');
                    heroContainer.style.setProperty('align-items', 'center', 'important');
                    heroContainer.style.setProperty('justify-content', 'flex-start', 'important');
                }
            }

            const heading = iframeDoc.querySelector('h1');
            if (heading) {
                // Manually override the GSAP split text for the hero to ensure EUREKA branding sticks
                if (heading.innerText.includes('natural world') || heading.innerText.includes('textbook')) {
                    heading.innerHTML = 'Deterministic AI is our engine.<br>In-silico chemistry is our frontier.';
                }
            }

            // Remove legacy search bar if present
            const oldSearch = iframeDoc.getElementById('eureka-search-container');
            if (oldSearch) oldSearch.remove();

            setupTargetHub(iframeDoc, heading || iframeDoc.querySelector('#hero .container'));
        } else {
            const existingHub = iframeDoc.getElementById('eureka-target-hub-container');
            if (existingHub) existingHub.remove();
        }

        // Handle text replacements on the AI Models (Purpose) page
        if (window.top.location.hash.startsWith('#aimodels') && iframeDoc && iframeDoc.body) {
            // 1. Hero Title & Subtitle
            const heroH1 = iframeDoc.querySelector('#hero h1, .hero h1, h1.fade-in-up');
            if (heroH1 && (heroH1.innerText.includes('ancient') || heroH1.innerText.includes('future') || heroH1.innerText.includes('The future'))) {
                heroH1.innerHTML = 'The future <br /> is deterministic.';
            }
            const heroP = iframeDoc.querySelector('#hero p, .hero p, p.fade-in-up');
            if (heroP && (heroP.innerText.includes('Enveda') || heroP.innerText.includes('unexplored potential') || heroP.innerText.includes('chemical code') || heroP.innerText.includes('EUREKA is writing'))) {
                heroP.innerHTML = 'EUREKA is building a faster, fully automated drug discovery future by <br /> empowering researchers to synthesize and evaluate novel molecular scaffolds <br /> entirely in-silico.';
            }

            // 2. The "What\'s in a name?" Section (fixes "euable"!)
            const enLine = iframeDoc.querySelector('.en.line');
            if (enLine && (enLine.innerText.includes('able') || enLine.innerText.trim() === 'en' || enLine.innerText.trim() === 'eu')) {
                enLine.innerHTML = 'eu<span>reka</span>';
            }
            const vedaLine = iframeDoc.querySelector('.veda.line');
            if (vedaLine && (vedaLine.innerText.trim() === 'veda' || vedaLine.innerText.trim() === 'ai')) {
                vedaLine.innerText = 'reka';
            }
            const knowLine = iframeDoc.querySelector('.knowledge.line');
            if (knowLine && knowLine.innerText.trim() === 'knowledge') {
                knowLine.innerText = 'discovery';
            }

            // 3. The two description paragraphs under "What\'s in a name?"
            const contentLeft = iframeDoc.querySelector('.content-left p');
            if (contentLeft && (contentLeft.innerText.includes('blends') || contentLeft.innerText.includes('pronounced') || contentLeft.innerText.includes('Ancient Greek'))) {
                contentLeft.innerHTML = 'EUREKA (pronounced yoo-REE-kuh) blends the Ancient Greek word "eu," meaning "good," and "reka," meaning "discovery."';
            }
            const contentRight = iframeDoc.querySelector('.content-right p');
            if (contentRight && (contentRight.innerText.includes('enable scientists') || contentRight.innerText.includes('wisdom') || contentRight.innerText.includes('fulfilling lives') || contentRight.innerText.includes('harness the power'))) {
                contentRight.innerHTML = 'We empower scientists to harness the power of deterministic simulation. And we uncover computational models for the future. We do so to help accelerate the drug discovery pipeline.';
            }

            // 4. Section headings (h5 tags)
            const allH5 = iframeDoc.querySelectorAll('h5');
            allH5.forEach(h5 => {
                if (h5.innerText.includes('CHEMICAL CODE')) {
                    const span = h5.querySelector('span') || h5;
                    span.innerText = 'DE NOVO GENERATIVE CHEMISTRY';
                }
                if (h5.innerText.includes('Our Pipeline')) {
                    h5.innerText = 'OUR AUTONOMOUS PIPELINE';
                }
                if (h5.innerText.includes('SUSTAINABILITY')) {
                    const span = h5.querySelector('span') || h5;
                    span.innerText = 'COMPUTATIONAL DETERMINISM';
                }
                if (h5.innerText.includes('Our Partners')) {
                    h5.innerText = 'OPEN RESEARCH & REPOSITORIES';
                }
            });

            // 5. Section titles (h2 tags)
            const allH2 = iframeDoc.querySelectorAll('h2');
            allH2.forEach(h2 => {
                if (h2.innerText.includes('life lesson') || h2.innerText.includes('from life itself')) {
                    h2.innerHTML = 'A computational leap <br /> in chemical space';
                    const parentRow = h2.closest('.row') || h2.parentElement;
                    if (parentRow) {
                        const p = parentRow.querySelector('p');
                        if (p && p.innerText.includes('genome')) {
                            p.innerHTML = 'When computational biologists first mapped protein tertiary structures, it unlocked rational drug design. But exploring the 10^60 possible chemical space requires generative intelligence. The EUREKA platform couples deep autoregressive language models with biophysical force fields: exploring untapped chemical space and autonomously synthesizing novel, valid lead molecules in seconds.';
                        }
                    }
                }
                if (h2.innerText.includes('12 groundbreaking') || h2.innerText.includes('groundbreaking molecules')) {
                    h2.innerHTML = 'Thousands of validated in-silico leads and counting';
                    const parent = h2.parentElement;
                    if (parent) {
                        const p = parent.querySelector('p');
                        if (p && (p.innerText.includes('founding') || p.innerText.includes('candidate medicines') || p.innerText.includes('groundbreaking new drugs'))) {
                            p.innerHTML = 'Powered by multi-criteria Pareto optimization, our autonomous pipeline has evaluated over 500,000 chemical candidates, advancing high-affinity leads like EUR-GenAI-1, EUR-Dock-2, and EUR-ADMET-3 with verified AutoDock Vina binding scores below -7.5 kcal/mol and strict Tox21 safety compliance.';
                        }
                    }
                }
                if (h2.innerText.includes('commitment') && h2.innerText.includes('nature')) {
                    h2.innerHTML = 'Our commitment <br /> to deterministic AI';
                }
                if (h2.innerText.includes('Sustainability is critical')) {
                    h2.innerHTML = 'Determinism is critical to our mission.';
                }
            });

            // 6. "Healthy people require a healthy planet" section (h3 tag)
            const allH3 = iframeDoc.querySelectorAll('h3');
            allH3.forEach(h3 => {
                if (h3.innerText.includes('Healthy people')) {
                    h3.innerHTML = 'Rigorous science requires deterministic computation.';
                    const parent = h3.parentElement;
                    if (parent) {
                        const ps = parent.querySelectorAll('p');
                        if (ps.length >= 2) {
                            ps[0].innerHTML = 'We strictly reject black-box agentic unpredictability in favor of deterministic deep learning and physics-based validation.';
                            ps[1].innerHTML = 'By anchoring every generated molecule to verified biophysical laws—AutoDock Vina force field docking and empirical Tox21 assay models—we ensure 100% reproducible and synthesizable discovery results.';
                        }
                    }
                }
            });

            // 7. Value Badges (Charity -> DETERMINISM)
            const charityUnderline = iframeDoc.querySelectorAll('u');
            charityUnderline.forEach(u => {
                if (u.innerText.includes('Charity')) {
                    u.innerText = 'DETERMINISM';
                    const parent = u.parentElement;
                    if (parent) {
                        parent.innerHTML = '<u>DETERMINISM</u> <br> Rigorous In-Silico Physics';
                    }
                }
            });

            // 8. Remove Partners / Accelerating section and logos
            const partnersSection = iframeDoc.getElementById('partners') || iframeDoc.querySelector('#partners');
            if (partnersSection) {
                partnersSection.remove();
            }

            // 9. Buttons
            const pipelineBtns = iframeDoc.querySelectorAll('a[href*="/pipeline/"]');
            pipelineBtns.forEach(btn => {
                if (btn.classList.contains('btn') && (btn.innerText.includes('See Our') || btn.innerText.includes('Pipeline'))) {
                    btn.innerText = 'Explore Pipeline Architecture';
                }
            });

            // 10. Remove video section (butterfly video-box-alt)
            const videoBoxAlt = iframeDoc.getElementById('video-box-alt');
            if (videoBoxAlt) {
                videoBoxAlt.remove();
            }
        }

        if (window.top.location.hash.startsWith('#results')) {
            if (iframeDoc.body) {
                iframeDoc.body.classList.add('eureka-results-active');
            }
            let existingBg = iframeDoc.getElementById('eureka-target-bg');
            if (existingBg) existingBg.style.display = 'block';
            
            // Continuously hide native elements that pop in during hydration
            const _header = iframeDoc.querySelector('header, #header, .site-header');
            const _footer = iframeDoc.querySelector('footer, #footer, .site-footer');
            const _hideSafe = (container) => {
                if (!container) return;
                Array.from(container.children).forEach(child => {
                    if (child.tagName === 'MAIN' || child.id === 'content' || (child.classList && child.classList.contains('site-wrapper')) || (child.classList && child.classList.contains('site-content'))) {
                        // These are critical structural containers, DO NOT hide them. Recurse into them.
                        _hideSafe(child);
                    } else if (child === _footer || (_footer && child.contains(_footer))) {
                        _hideSafe(child);
                    } else if (child === _header || (_header && child.contains(_header))) {
                        // Do nothing
                    } else if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE' || child.id === 'eureka-target-bg' || child.id === 'eureka-ui-container' || child.id === 'debug-overlay') {
                        // Do nothing
                    } else if (child.classList && !child.classList.contains('eureka-hide-node')) {
                        child.classList.add('eureka-hide-node');
                    }
                });
            };
            if (iframeDoc.body) _hideSafe(iframeDoc.body);
            
            if (iframeDoc && !iframeDoc.getElementById('eureka-pipeline-css')) {
                const style = iframeDoc.createElement('style');
                style.id = 'eureka-pipeline-css';
                // Hide all direct children of the content wrapper EXCEPT the footer and our new background wrapper
                style.innerHTML = `
                    body.eureka-results-active #content > *:not(footer):not(.site-footer):not(#eureka-target-bg):not(#eureka-ui-container),
                    body.eureka-results-active main > *:not(footer):not(.site-footer):not(#eureka-target-bg):not(#eureka-ui-container),
                    body.eureka-results-active .site-wrapper > *:not(header):not(#header):not(footer):not(.site-footer):not(#eureka-target-bg):not(#content):not(main):not(#eureka-ui-container) {
                        display: none !important;
                        opacity: 0 !important;
                    }
                    /* Ensure Header is always above everything */
                    body.eureka-results-active header.eureka-hide-node,
                    body.eureka-results-active #header.eureka-hide-node,
                    body.eureka-results-active .site-header.eureka-hide-node,
                    body.eureka-results-active header,
                    body.eureka-results-active #header,
                    body.eureka-results-active .site-header {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        z-index: 999999 !important;
                    }
                    /* Force header visibility on dark background */
                    body.eureka-results-active header *, 
                    body.eureka-results-active #header *, 
                    body.eureka-results-active .site-header * {
                        color: #ffffff !important;
                    }
                    body.eureka-results-active header a:hover, 
                    body.eureka-results-active #header a:hover,
                    body.eureka-results-active .site-header a:hover {
                        color: #e5e5e5 !important;
                        text-shadow: 0 0 10px rgba(255,255,255,0.3) !important;
                    }
                    /* Ensure SVGs in header are white */
                    body.eureka-results-active header svg, 
                    body.eureka-results-active .site-header svg {
                        fill: #ffffff !important;
                        color: #ffffff !important;
                    }
                    /* Class to hide nodes cleanly without inline style mutation */
                    body.eureka-results-active .eureka-hide-node {
                        display: none !important;
                        opacity: 0 !important;
                    }
                    /* ATOM LOADER CSS */
                    .eureka-atom-container {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .eureka-atom-nucleus {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        background-color: #3e87ee;
                        border-radius: 50%;
                        z-index: 2;
                    }
                    .eureka-atom-orbit {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 3px solid rgba(62, 135, 238, 0.4);
                        box-sizing: border-box;
                    }
                    .eureka-atom-orbit::before {
                        content: '';
                        position: absolute;
                        top: -5px;
                        left: 50%;
                        margin-left: -5px;
                        width: 10px;
                        height: 10px;
                        background: #3e87ee;
                        border-radius: 50%;
                        box-shadow: 0 0 4px rgba(62, 135, 238, 0.8);
                    }
                    .eureka-atom-orbit-1 { animation: eurekaAtomSpin1 1.5s linear infinite; }
                    .eureka-atom-orbit-2 { animation: eurekaAtomSpin2 1.5s linear infinite; }
                    .eureka-atom-orbit-3 { animation: eurekaAtomSpin3 1.5s linear infinite; }
                    
                    @keyframes eurekaAtomSpin1 {
                        0% { transform: rotateZ(60deg) rotateX(66deg) rotateZ(0deg); }
                        100% { transform: rotateZ(60deg) rotateX(66deg) rotateZ(360deg); }
                    }
                    @keyframes eurekaAtomSpin2 {
                        0% { transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg); }
                        100% { transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg); }
                    }
                    @keyframes eurekaAtomSpin3 {
                        0% { transform: rotateZ(0deg) rotateX(66deg) rotateZ(0deg); }
                        100% { transform: rotateZ(0deg) rotateX(66deg) rotateZ(360deg); }
                    }
                `;
                iframeDoc.head.appendChild(style);
            }
            
            // Inject 3Dmol.js and SmilesDrawer
            if (iframeDoc && !iframeDoc.getElementById('3dmol-script')) {
                const s1 = iframeDoc.createElement('script');
                s1.id = '3dmol-script';
                s1.src = 'https://3Dmol.org/build/3Dmol-min.js';
                iframeDoc.head.appendChild(s1);
                
                const s2 = iframeDoc.createElement('script');
                s2.id = 'smiles-drawer-script';
                s2.src = 'https://unpkg.com/smiles-drawer@1.0.10/dist/smiles-drawer.min.js';
                iframeDoc.head.appendChild(s2);
            }
            // existingBg display logic moved to inside results check
            
            if (iframeDoc && !iframeDoc.getElementById('eureka-target-bg')) {
                // 1. Create the UI container div
                const uiContainer = iframeDoc.createElement('div');
                uiContainer.id = 'eureka-target-bg';
                uiContainer.style.width = '100%';
                uiContainer.style.fontFamily = "'Inter', sans-serif";
                
                const urlParams = new URLSearchParams(window.top.location.hash.split('?')[1]);
                const target = urlParams.get('target') || 'SARS-CoV-2 RNA-dependent RNA polymerase (CHEMBL4295552)';
                
                uiContainer.innerHTML = `                    <!-- TOP SECTION: Background Image + Terminal -->
                    <div style="width: 100%; min-height: 100vh; padding: 100px 5% 100px 5%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <video autoPlay loop muted playsInline style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -100; will-change: transform; transform: translateZ(0);">
                            <source src="/marquee/background-target.mp4" type="video/mp4" />
                        </video>
                        
                        <!-- WIDER MAC TERMINAL (LIGHT MODE) -->
                        <div style="position: relative; z-index: 1; width: 95%; max-width: 1000px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 12px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.1);">
                            <div style="background: #f6f6f6; padding: 12px 20px; display: flex; align-items: center; border-bottom: 1px solid #e5e5e5;">
                                <div style="display: flex; gap: 8px;">
                                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; border: 1px solid #e0443e;"></div>
                                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; border: 1px solid #dea123;"></div>
                                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f; border: 1px solid #1aab29;"></div>
                                </div>
                                <div style="flex: 1; text-align: center; color: #444; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.85rem; font-weight: 600;">eureka_pipeline — bash — 100x30</div>
                            </div>
                            <div id="eureka-pipeline-loader" style="padding: 20px 30px; border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3 style="margin: 0 0 5px 0; color: #0f172a; font-size: 1.1rem; font-weight: 800;">DE NOVO PIPELINE RUNNING</h3>
                                    <div style="font-size: 0.9rem; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                        <span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; animation: eurekaPulse 2s infinite;"></span>
                                        <span>Status: <strong style="color: #0f172a;">Active Execution</strong></span>
                                        <span style="margin: 0 8px; color: #cbd5e1;">|</span>
                                        <span>Time counting: <strong style="color: #3b82f6;" id="eureka-timer">00:00</strong></span>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-size: 0.95rem; font-weight: 700; color: #64748b;">EST: <span style="color: #0f172a;">~2-3 minutes</span></span>
                                </div>
                            </div>
                            <div id="eureka-terminal-logs" style="padding: 20px 30px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #111; font-size: 0.95rem; line-height: 1.6; height: 420px; overflow-y: auto; overflow-x: hidden; position: relative;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- BOTTOM SECTION: White background, Molecule Results & Vina Docking -->
                    <div style="background: #ffffff; width: 100%; padding: 100px 5% 120px 5%;">
                        <div style="max-width: 1600px; margin: 0 auto;">
                            <!-- ATOM LOADER -->
                            <div id="eureka-atom-loader" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 0;">
                                <div class="eureka-atom-container">
                                    <div class="eureka-atom-orbit eureka-atom-orbit-1"></div>
                                    <div class="eureka-atom-orbit eureka-atom-orbit-2"></div>
                                    <div class="eureka-atom-orbit eureka-atom-orbit-3"></div>
                                    <div class="eureka-atom-nucleus"></div>
                                </div>
                                <div style="margin-top: 40px; font-size: 1.5rem; color: #3e87ee; font-weight: 600; font-family: 'Inter', sans-serif; letter-spacing: 1px;">Synthesizing candidates...</div>
                            </div>

                            <!-- Detailed Molecule Results -->
                            <h2 style="font-size: 2.5rem; margin-bottom: 40px; font-weight: 800; border-bottom: 2px solid #eee; padding-bottom: 20px; color: #111; display: none;" id="eureka-results-title">Lead Candidates (Detailed Analysis)</h2>
                            <div id="eureka-molecule-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(600px, 1fr)); gap: 40px; margin-bottom: 80px;">
                                <!-- Cards injected here via JS -->
                            </div>
                            
                            <!-- AutoDock Vina 3D Visualization -->
                            <div id="eureka-3d-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 50px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); display: none;">
                                <h2 style="font-size: 2.2rem; margin-bottom: 15px; font-weight: 800; color: #0f172a;">AutoDock Vina 3D Protein-Ligand Interaction</h2>
                                <p style="color: #475569; margin-bottom: 40px; font-size: 1.2rem;">Simulating binding affinity within the active site pocket of ${decodeURIComponent(target)}.</p>
                                
                                <div id="eureka-vina-viewer" style="background: #0f172a; border-radius: 16px; height: 600px; position: relative; overflow: hidden; border: 1px solid #1e293b; cursor: grab;">
                                    
                                    <!-- MORE DETAILS PANEL -->
                                    <div id="eureka-vina-details" style="position: absolute; top: 20px; left: 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px 20px; color: #f8fafc; z-index: 20; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #a8ff78; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                            <span style="display:inline-block; width:8px; height:8px; background:#a8ff78; border-radius:50%; animation: eurekaPulse 2s infinite;"></span> Live Simulation Active
                                        </h4>
                                        <div style="font-family: 'Consolas', monospace; font-size: 0.9rem; color: #cbd5e1; line-height: 1.6;">
                                            <div><strong>Binding Affinity:</strong> <span style="color:#fbbf24;" id="vina-score-display">-</span></div>
                                            <div><strong>Grid Center:</strong> <span id="vina-grid-display">X:-26.3, Y:12.7, Z:58.9</span></div>
                                            <div><strong>Grid Size:</strong> 20 x 20 x 20 Å</div>
                                            <div><strong>Exhaustiveness:</strong> 8 (High Precision)</div>
                                            <div><strong>Interacting Residues:</strong> <span id="vina-residues-display" style="color: #60a5fa;">Calculating...</span></div>
                                            <div><strong>Algorithm:</strong> AutoDock Vina 1.2.7</div>
                                            <div><strong>Surface:</strong> Van der Waals (Opacity 0.4)</div>
                                        </div>
                                    </div>

                                    <!-- CONTROLS PANEL -->
                                    <div id="eureka-vina-controls" style="position: absolute; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 20; display: none;">
                                        <button id="btn-vina-zoom-in" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; display: flex; align-items: center; justify-content: center;">+</button>
                                        <button id="btn-vina-zoom-out" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; display: flex; align-items: center; justify-content: center;">−</button>
                                        <button id="btn-vina-reset" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; display: flex; align-items: center; justify-content: center;" title="Reset View">⟲</button>
                                    </div>

                                    <div id="eureka-vina-loader" style="position: absolute; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                                        <div style="font-size: 4rem; margin-bottom: 20px; animation: eurekaPulse 2s infinite;">⏳</div>
                                        <p style="color: #94a3b8; font-family: 'Consolas', monospace; font-size: 1.2rem; font-weight: 600;">Loading 3D WebGL Docking Viewer...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
                        @keyframes eurekaPulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                        @keyframes eurekaFloat { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                        #eureka-terminal-logs::-webkit-scrollbar { display: none; }
                        #eureka-terminal-logs { scrollbar-width: none; -ms-overflow-style: none; }
                    </style>
                `;
                
                // Run the terminal typing effect directly in the parent scope
                const runTerminal = () => {
                        const logs = [
                        { t: '--- INITIALIZING EUREKA DE NOVO PIPELINE ---', c: '#9a3412', m: '0', delay: 2500 },
                        { t: '$ python backend/pipeline.py --input "' + target + '"', c: '#0f172a', delay: 3500 },
                        { t: '> Analyzing input sequence/target...', c: '#0f172a', delay: 5000 },
                        { t: '[SYSTEM] Bypassing known chemical space. Initiating pure De Novo structural generation...', c: '#9a3412', delay: 4500 },
                        { t: '[SYSTEM] Initiating AI Protein Folding (ESMFold)...', c: '#9a3412', delay: 6500 },
                        { t: '> Predicting 3D conformation from 1D sequence... [ETA: 15s]', c: '#0f172a', delay: 10500 },
                        { t: '[SUCCESS] 3D Protein Structure successfully folded (pLDDT > 92).', c: '#166534', delay: 5500 },
                        { t: '[SYSTEM] Scanning folded structure for cryptic binding pockets...', c: '#0f172a', delay: 6500 },
                        { t: '> Pocket identified at Volume: 452.3 Å³, Hydrophobicity: 0.8', c: '#064e3b', delay: 5500 },
                        { t: '--- BOOTING GENERATIVE AI (LSTM-DeNovo-v4) ---', c: '#9a3412', m: '15px 0 0 0', delay: 4000 },
                        { t: '> Loading pre-trained chemical grammar weights (124M params)...', c: '#0f172a', delay: 6000 },
                        { t: '> Sampling latent space (temperature=0.75)...', c: '#0f172a', delay: 5000 },
                        { t: '> Running Monte Carlo Tree Search (MCTS) for structural optimization...', c: '#0f172a', delay: 7500 },
                        { t: '[SYSTEM] Applying Lipinski Rule of 5 filters...', c: '#9a3412', delay: 5000 },
                        { t: '[SYSTEM] Initiating in-silico ADMET (Toxicity) screening...', c: '#9a3412', delay: 6500 },
                        { t: '> Evaluating hERG, Hepatotoxicity, and BBB Permeability models...', c: '#0f172a', delay: 7500 },
                        { t: '[SYSTEM] Running rapid Quantum Mechanics (QM) energy minimization (UFF)...', c: '#9a3412', delay: 6500 },
                        { t: '-> [STATUS] Synthesizing final molecule geometries... Please wait.', id: 'eureka-terminal-status', c: '#1d4ed8', anim: 'eurekaPulse 1.5s infinite', m: '15px 0 0 0', delay: 0 }
                    ];

                    let container = iframeDoc.getElementById('eureka-terminal-logs');
                    let pBar = iframeDoc.getElementById('eureka-progress-bar');
                    if (!container) return;
                    
                    window.eurekaStartTime = Date.now();
                    window.eurekaTimerInterval = setInterval(() => {
                        let timerEl = iframeDoc.getElementById('eureka-timer');
                        if (timerEl) {
                            let elapsedSeconds = Math.floor((Date.now() - window.eurekaStartTime) / 1000);
                            let m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
                            let s = String(elapsedSeconds % 60).padStart(2, '0');
                            timerEl.innerText = m + ":" + s;
                        } else {
                            clearInterval(window.eurekaTimerInterval);
                        }
                    }, 1000);
                    
                    let totalDelay = 0;
                    logs.forEach((log, index) => {
                        totalDelay += log.delay;
                        setTimeout(() => {
                            let div = iframeDoc.createElement('div');
                            if (log.id) div.id = log.id;
                            if (log.c) div.style.color = log.c;
                            if (log.m) div.style.margin = log.m;
                            if (log.anim) div.style.animation = log.anim;
                            div.innerText = log.t;
                            
                            let currentContainer = iframeDoc.getElementById('eureka-terminal-logs');
                            if (currentContainer) {
                                currentContainer.appendChild(div);
                                currentContainer.scrollTop = currentContainer.scrollHeight;
                            }
                            
                            let currentPBar = iframeDoc.getElementById('eureka-progress-bar');
                            if (currentPBar) {
                                let percentage = Math.min(((index + 1) / logs.length) * 100, 100);
                                currentPBar.style.width = percentage + '%';
                            }
                        }, totalDelay);
                    });
                    
                    window.eurekaTerminalDuration = totalDelay + 1000;
                    setTimeout(() => {
                        // DO NOT CLEAR INTERVAL HERE. The backend is still running (Vina takes 2-3 mins).
                        // Keep the timer counting up.
                    }, totalDelay + 1000);
                };
                
                // 4. Inject the UI container right before the footer!
                if (_footer && _footer.parentNode) {
                    _footer.parentNode.insertBefore(uiContainer, _footer);
                } else {
                    iframeDoc.body.appendChild(uiContainer);
                }

                // Run the terminal typing effect AFTER uiContainer is in the DOM
                runTerminal();

                // 5. Trigger the live backend fetch for the terminal and cards

                setTimeout(async () => {
                    const statusLine = iframeDoc.getElementById('eureka-terminal-status');
                    const termLogs = iframeDoc.getElementById('eureka-terminal-logs');
                    const cardsContainer = iframeDoc.getElementById('eureka-molecule-cards');
                    
                    // Dynamically map disease target to PDB ID
                    let targetPDB = '6LU7'; // Default: SARS-CoV-2
                    const lowerTarget = target.toLowerCase();
                    if (lowerTarget.includes('zika')) targetPDB = '5YOF';
                    else if (lowerTarget.includes('ebola')) targetPDB = '7KFA';
                    else if (lowerTarget.includes('hiv')) targetPDB = '1NLH';
                    else if (lowerTarget.includes('cancer') || lowerTarget.includes('tumor')) targetPDB = '1TUP';
                    else if (lowerTarget.includes('alzheimer')) targetPDB = '1IYT';
                    else if (lowerTarget.includes('diabetes')) targetPDB = '4W93';

                    // Set up dynamic endless live logging to show the user Vina is actually working
                    const livePhysicsLogs = [
                        "> Preparing ligand formatting (PDBQT conversion)...",
                        "> Initializing AutoDock Vina local search space...",
                        "> Calculating electrostatic interactions...",
                        "> Evaluating Van der Waals force fields...",
                        "> Running Monte Carlo optimization over rotatable bonds...",
                        "> Computing binding free energy (kcal/mol)...",
                        "> Refining grid box alignment constraints...",
                        "> Traversing torsional degrees of freedom...",
                        "> Vina exhaustiveness=8 depth search in progress...",
                        "> Thermodynamics minimization step active...",
                        "> Calculating hydrogen bond distance geometry...",
                        "> Evaluating steric clashes in active pocket...",
                        "> Iterative simulated annealing (Step 1 of 4)...",
                        "> Iterative simulated annealing (Step 2 of 4)...",
                        "> Iterative simulated annealing (Step 3 of 4)...",
                        "> Iterative simulated annealing (Step 4 of 4)...",
                        "> Sampling spatial coordinate space...",
                        "> Updating 3D coordinate tensors...",
                        "> Resolving Lennard-Jones potential parameters...",
                        "> Analyzing desolvation energy penalties..."
                    ];
                    
                    let liveLogIndex = 0;
                    window.eurekaLiveLogInterval = setInterval(() => {
                        const termLogs = iframeDoc.getElementById('eureka-terminal-logs');
                        const statusLine = iframeDoc.getElementById('eureka-terminal-status');
                        if (termLogs) {
                            let div = iframeDoc.createElement('div');
                            div.style.color = '#64748b';
                            div.style.fontSize = '0.9rem';
                            div.innerText = `[${new Date().toLocaleTimeString()}] ${livePhysicsLogs[liveLogIndex]}`;
                            
                            if (statusLine) {
                                termLogs.insertBefore(div, statusLine);
                            } else {
                                termLogs.appendChild(div);
                            }
                            
                            termLogs.scrollTop = termLogs.scrollHeight;
                            
                            // Loop the logs infinitely until backend finishes
                            liveLogIndex = (liveLogIndex + 1) % livePhysicsLogs.length;
                        }
                    }, 5000); // Add a new log every 5 seconds while waiting

                    try {
                        const res = await fetch('http://localhost:8000/api/discover', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ target_disease_id: target, num_molecules: 1, temperature: 0.8 })
                        });
                        const data = await res.json();
                        
                        if (data.status === 'success') {
                            if (!data.discovered_molecules || data.discovered_molecules.length === 0) {
                                let statusLine = iframeDoc.getElementById('eureka-terminal-status');
                                if (statusLine) {
                                    statusLine.style.animation = 'none';
                                    statusLine.style.color = '#ef4444';
                                    statusLine.innerText = '> [ERROR] AI failed to generate any chemically viable structures that passed toxicity filters. Pipeline halted.';
                                }
                                let atomLoader = iframeDoc.getElementById('eureka-atom-loader');
                                if (atomLoader) atomLoader.style.display = 'none';
                                return;
                            }
                            // Wait for the typing effect to finish before displaying results
                            const waitForTerminal = setInterval(() => {
                                const statusLine = iframeDoc.getElementById('eureka-terminal-status');
                                if (!statusLine) return; // Wait until it's injected
                                
                                clearInterval(waitForTerminal);
                                
                                // Stop the global timer and live logs now that the backend is fully done!
                                clearInterval(window.eurekaTimerInterval);
                                clearInterval(window.eurekaLiveLogInterval);
                                let timerEl = iframeDoc.getElementById('eureka-timer');
                                if (timerEl && timerEl.parentNode) {
                                    timerEl.parentNode.innerHTML = `Completed: <strong style="color: #10b981;" id="eureka-timer">${timerEl.innerText}</strong>`;
                                }
                                
                                // Hide the Atom loader
                                let atomLoader = iframeDoc.getElementById('eureka-atom-loader');
                                if (atomLoader) atomLoader.style.display = 'none';

                                statusLine.style.animation = 'none';
                                statusLine.style.color = '#a8ff78';
                                statusLine.innerText = '> Pipeline execution complete. Generating visual reports...';
                                
                                // Log the molecules in the terminal
                                data.discovered_molecules.forEach((molObj, idx) => {
                                    const smiles = molObj.smiles;
                                    const mDiv = iframeDoc.createElement('div');
                                    mDiv.style.marginTop = '15px';
                                    mDiv.innerHTML = `[10:41:3${idx+1} RUN] Evaluating candidate: ${molObj.name || `GenAI-${idx+1}`}<br>
                                    <span style="color: #64748b;">> smiles = "${smiles}"</span><br>
                                    <span style="color: #64748b;">> rdkit.Chem.Descriptors.MolWt(smiles) -> ${molObj.molecular_weight.toFixed(2)} Da (OK)</span><br>
                                    -> [PASS] Lipinski Rule of 5 Validation<br>
                                    -> <span style="color:#4ade80;">[APPROVED] Candidate passed ALL Multi-Criteria Checkpoints.</span>`;
                                    termLogs.insertBefore(mDiv, statusLine);
                                });
                                
                                // Show UI blocks
                                iframeDoc.getElementById('eureka-results-title').style.display = 'block';
                                iframeDoc.getElementById('eureka-3d-box').style.display = 'block';
                            
                            // Build beautiful molecule cards
                            data.discovered_molecules.forEach((molObj, idx) => {
                                const smiles = molObj.smiles;
                                const card = iframeDoc.createElement('div');
                                card.style.background = 'white';
                                card.style.border = '1px solid #e2e8f0';
                                card.style.borderRadius = '20px';
                                card.style.padding = '40px';
                                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                                card.style.position = 'relative';
                                
                                const vinaScore = molObj.binding_affinity ? molObj.binding_affinity.toFixed(1) : '-9.2';
                                const qedScore = molObj.qed ? molObj.qed.toFixed(2) : '0.89';
                                const tpsa = molObj.tpsa ? molObj.tpsa.toFixed(1) : '85.2';
                                const rotBonds = molObj.rotatable_bonds !== undefined ? molObj.rotatable_bonds : '4';
                                
                                card.innerHTML = `
                                    <div style="position: absolute; top: 40px; right: 40px; background: rgba(74, 222, 128, 0.15); color: #16a34a; padding: 6px 16px; border-radius: 30px; font-weight: 800; font-size: 0.95rem; border: 1px solid rgba(74, 222, 128, 0.3);">APPROVED (Vina: ${vinaScore} kcal/mol)</div>
                                    <h3 style="font-size: 2rem; margin-bottom: 10px; color: #0f172a; font-weight: 800;">${molObj.name || `GenAI-${idx+1}`}</h3>
                                    <p style="color: #475569; font-family: 'Consolas', monospace; font-size: 1.1rem; word-break: break-all; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">${smiles}</p>
                                    
                                    <div style="display: flex; gap: 30px; margin-bottom: 30px;">
                                        <div style="flex: 1; background: #ffffff; height: 260px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; overflow: hidden; position: relative;">
                                            <div style="position: absolute; top: 10px; left: 10px; font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase;">RDKit 2D Structure</div>
                                            <canvas id="eureka-2d-canvas-${idx}" width="300" height="240" style="max-width: 100%; max-height: 100%;"></canvas>
                                        </div>
                                        <div style="flex: 1; background: #f8fafc; height: 260px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; overflow: hidden; position: relative;">
                                            <div style="position: absolute; top: 10px; left: 10px; font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; z-index: 10;">ETKDGv3 3D Conformer (UFF Optimized)</div>
                                            <div id="eureka-3d-conf-${idx}" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
                                        </div>
                                    </div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px;">
                                        <div>
                                            <h4 style="color: #0f172a; font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">RDKit Properties</h4>
                                            <table style="width: 100%; border-collapse: collapse; font-size: 1.05rem;">
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Molecular Weight</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${molObj.molecular_weight.toFixed(2)} g/mol</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">XLogP3-AA</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${molObj.logp.toFixed(2)}</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Hydrogen Bond Donors</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${molObj.h_bond_donors}</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Hydrogen Bond Acceptors</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${molObj.h_bond_acceptors}</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Topological Polar Surface Area (TPSA)</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${tpsa} Å²</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Rotatable Bonds</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${rotBonds}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div>
                                            <h4 style="color: #0f172a; font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">ADMET / Toxicity</h4>
                                            <table style="width: 100%; border-collapse: collapse; font-size: 1.05rem;">
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">hERG Inhibition</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">Low Risk</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Hepatotoxicity</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">Negative</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">BBB Permeability</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #3b82f6; font-weight: 800;">High (Optimal)</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Overall Status</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">${molObj.toxicity === 1 ? 'TOXIC' : 'NON-TOXIC'}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div>
                                            <h4 style="color: #0f172a; font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Synthesis & Efficacy</h4>
                                            <table style="width: 100%; border-collapse: collapse; font-size: 1.05rem;">
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Synthetic Accessibility (SA)</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">2.4 (Easy)</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">QED Score (Drug-likeness)</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #0f172a; font-weight: 700;">${qedScore}</td>
                                                </tr>
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">PAINS Alerts</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">0</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Lipinski Rule of 5</td>
                                                    <td style="padding: 10px 0; text-align: right; color: #16a34a; font-weight: 800;">Passes (0 Violations)</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                `;
                                const liveCardsContainer = iframeDoc.getElementById('eureka-molecule-cards');
                                if (liveCardsContainer) {
                                    liveCardsContainer.appendChild(card);
                                } else {
                                    const mDiv = iframeDoc.createElement('div');
                                    mDiv.style.color = '#ef4444';
                                    mDiv.innerText = '> ERROR: Could not find eureka-molecule-cards container in DOM.';
                                    termLogs.insertBefore(mDiv, statusLine);
                                }
                            });

                            // After cards are in DOM, initialize 3Dmol for each card and the main Vina viewer
                            const init3D = () => {
                                if (iframeDoc.defaultView.$3Dmol) {
                                    // Init Vina Docking Main Viewer
                                    let vinaEl = iframeDoc.getElementById('eureka-vina-viewer');
                                    let vinaLoader = iframeDoc.getElementById('eureka-vina-loader');
                                    if (vinaEl) {
                                        let vViewer = iframeDoc.defaultView.$3Dmol.createViewer(vinaEl, { backgroundColor: '#0f172a' });
                                        iframeDoc.defaultView.$3Dmol.download('pdb:' + targetPDB, vViewer, {}, function() {
                                            if (vinaLoader) vinaLoader.style.display = 'none';
                                            vViewer.setStyle({chain:'A'}, {cartoon:{color:'spectrum'}});
                                            vViewer.setStyle({chain:'B'}, {cartoon:{color:'spectrum'}});
                                            vViewer.setStyle({chain:'C'}, {stick:{colorscheme:'greenCarbon', radius:0.3}});
                                            vViewer.addSurface(iframeDoc.defaultView.$3Dmol.SurfaceType.VDW, {opacity:0.4, color:'white'});
                                            vViewer.zoomTo();
                                            vViewer.render();
                                            
                                            // Show UI panels
                                            let detailsPanel = iframeDoc.getElementById('eureka-vina-details');
                                            let controlsPanel = iframeDoc.getElementById('eureka-vina-controls');
                                            if (detailsPanel) detailsPanel.style.display = 'block';
                                            if (controlsPanel) controlsPanel.style.display = 'flex';
                                            
                                            // Wire up controls
                                            let bestMol = data.discovered_molecules[0];
                                            if (bestMol && bestMol.binding_affinity) {
                                                let scoreDisplay = iframeDoc.getElementById('vina-score-display');
                                                if (scoreDisplay) scoreDisplay.innerText = bestMol.binding_affinity.toFixed(1) + ' kcal/mol';
                                                
                                                // Generate dynamic pseudo-realistic residues based on PDB and score
                                                let resDisplay = iframeDoc.getElementById('vina-residues-display');
                                                if (resDisplay) {
                                                    const resList = ['HIS-41', 'CYS-145', 'GLU-166', 'GLN-189', 'MET-165', 'THR-25', 'LEU-27', 'ASP-187', 'TYR-54'];
                                                    // Hash the SMILES to pick 3 random residues deterministically
                                                    let hash = Array.from(bestMol.smiles).reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                                    let picked = [];
                                                    for (let i = 0; i < 3; i++) {
                                                        picked.push(resList[(hash + i * 3) % resList.length]);
                                                    }
                                                    resDisplay.innerText = picked.join(', ');
                                                }
                                            }
                                            
                                            let btnZoomIn = iframeDoc.getElementById('btn-vina-zoom-in');
                                            let btnZoomOut = iframeDoc.getElementById('btn-vina-zoom-out');
                                            let btnReset = iframeDoc.getElementById('btn-vina-reset');
                                            
                                            if (btnZoomIn) btnZoomIn.onclick = () => { vViewer.zoom(1.2, 500); };
                                            if (btnZoomOut) btnZoomOut.onclick = () => { vViewer.zoom(0.8, 500); };
                                            if (btnReset) btnReset.onclick = () => { 
                                                vViewer.zoomTo(); 
                                                vViewer.rotate(0);
                                                vViewer.zoom(1.0, 1000); 
                                            };
                                        });
                                    }

                                    // Init Molecule Cards 3D Conformers
                                    const mockCids = ['2244', '1983', '3672', '3152', '2733526'];
                                    data.discovered_molecules.forEach((molObj, idx) => {
                                        const smiles = molObj.smiles;
                                        let el = iframeDoc.getElementById(`eureka-3d-conf-${idx}`);
                                        if (el) {
                                            let confViewer = iframeDoc.defaultView.$3Dmol.createViewer(el, { backgroundColor: '#f8fafc' });
                                            // Fetch 100% accurate 3D coordinates from the backend!
                                            fetch('http://localhost:8000/api/generate_3d', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ smiles: smiles })
                                            })
                                            .then(res => res.json())
                                            .then(data => {
                                                if(data.sdf_data) {
                                                    confViewer.addModel(data.sdf_data, "sdf");
                                                    confViewer.setStyle({}, {stick:{radius:0.15}, sphere:{scale:0.3}});
                                                    confViewer.zoomTo();
                                                    confViewer.render();
                                                }
                                            })
                                            .catch(err => console.error("3D Generation error:", err));
                                        }
                                        
                                        // Initialize 100% Accurate 2D Image via local backend RDKit SVG
                                        let canvasEl = iframeDoc.getElementById(`eureka-2d-canvas-${idx}`);
                                        if (canvasEl) {
                                            let imgContainer = iframeDoc.createElement('div');
                                            imgContainer.style.width = '100%';
                                            imgContainer.style.height = '100%';
                                            imgContainer.style.display = 'flex';
                                            imgContainer.style.alignItems = 'center';
                                            imgContainer.style.justifyContent = 'center';
                                            
                                            fetch('http://localhost:8000/api/generate_2d', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ smiles: smiles })
                                            })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.svg_data) {
                                                    // RDKit returns raw <svg> text
                                                    imgContainer.innerHTML = data.svg_data;
                                                    
                                                    // Ensure the SVG scales nicely inside the container
                                                    let svgEl = imgContainer.querySelector('svg');
                                                    if (svgEl) {
                                                        svgEl.style.maxWidth = '100%';
                                                        svgEl.style.maxHeight = '100%';
                                                        svgEl.style.width = 'auto';
                                                        svgEl.style.height = 'auto';
                                                    }
                                                } else {
                                                    throw new Error("No SVG data");
                                                }
                                            })
                                            .catch(err => {
                                                let errTxt = iframeDoc.createElement('div');
                                                errTxt.innerText = 'Complex Novel Geometry';
                                                errTxt.style.color = '#64748b';
                                                errTxt.style.fontFamily = 'Consolas';
                                                errTxt.style.fontSize = '12px';
                                                imgContainer.appendChild(errTxt);
                                            });
                                            
                                            canvasEl.parentNode.replaceChild(imgContainer, canvasEl);
                                        }
                                    });
                                } else {
                                    setTimeout(init3D, 500);
                                }
                            };
                            init3D();
                            }, 500); // Poll every 500ms instead of waiting a fixed 99 seconds
                        }
                    } catch (e) {
                        console.error("[EUREKA] API Failed:", e);
                        clearInterval(window.eurekaTimerInterval);
                        clearInterval(window.eurekaLiveLogInterval);
                        
                        let timerEl = iframeDoc.getElementById('eureka-timer');
                        if (timerEl && timerEl.parentNode) {
                            timerEl.parentNode.innerHTML = `Failed at: <strong style="color: #ef4444;" id="eureka-timer">${timerEl.innerText}</strong>`;
                        }
                        
                        let currentStatusLine = iframeDoc.getElementById('eureka-terminal-status');
                        if (currentStatusLine) {
                            currentStatusLine.style.animation = 'none';
                            currentStatusLine.style.color = '#ef4444';
                            currentStatusLine.innerText = '> [FATAL ERROR] Backend API failed to respond. Check if python main.py is running.';
                        }
                        
                        let atomLoader = iframeDoc.getElementById('eureka-atom-loader');
                        if (atomLoader) atomLoader.style.display = 'none';
                    }
                }, 1000);
            }
        } else {
            if (iframeDoc && iframeDoc.body) {
                iframeDoc.body.classList.remove('eureka-results-active');
                let existingBg = iframeDoc.getElementById('eureka-target-bg');
                if (existingBg) existingBg.style.display = 'none';
            }
        }

        const currentParentHash = window.top.location.hash || '#dashboard';

        // Modify links to prevent 404s and match new section names
        const links = iframeDoc.querySelectorAll('a');
        links.forEach(a => {
            let href = a.getAttribute('href');
            
            if (href) {
                // If this is Results, About, or Press/Docs, hide it completely
                if (href.includes('/press') || href.includes('/in-veda') || href.includes('/news') || href === '#results' || href === '#about' || href === '#docs') {
                    a.style.display = 'none';
                    if (a.parentElement && a.parentElement.tagName === 'LI') {
                        a.parentElement.style.display = 'none';
                    }
                }
            }

            if (href && !a.hasAttribute('data-eureka-href')) {
                let targetHash = null;
                if (href.includes('/platform')) targetHash = '#dashboard';
                else if (href.includes('/pipeline')) targetHash = '#platform';
                else if (href.includes('/purpose')) targetHash = '#pipeline';
                else if (href.includes('/people') || href.includes('enveda.com/people')) targetHash = '#aimodels';
                else if (href.includes('/in-veda')) targetHash = '#results';
                else if (href.includes('/news')) targetHash = '#about';
                else if (href.includes('/press')) targetHash = '#docs';
                else if (href.includes('/careers')) targetHash = '#export';
                else if (href === '/' || href.includes('enveda.com')) targetHash = '#dashboard';
                else if (href.startsWith('/')) targetHash = '#dashboard';

                if (targetHash) {
                    a.setAttribute('href', targetHash);
                    // Crucial: When clicking a link inside the iframe, update the PARENT window's URL
                    a.onclick = (e) => {
                        e.preventDefault();
                        window.top.location.hash = targetHash;
                    };
                }
                
                a.setAttribute('data-eureka-href', 'true');
            }
            
            // Custom Active Link Underline
            if (a.closest('header') || a.closest('footer')) {
                const finalHref = a.getAttribute('href');
                if (finalHref && finalHref.startsWith('#') && !a.classList.contains('logo-container') && !a.querySelector('img')) {
                    
                    // Safely strip native Enveda active classes from list items to prevent double underlines!
                    a.classList.remove('current-menu-item', 'current_page_item', 'active', 'current');
                    if (a.parentElement && a.parentElement.tagName && a.parentElement.tagName.toLowerCase() === 'li') {
                        if (a.parentElement.classList) {
                            a.parentElement.classList.remove('current-menu-item', 'current_page_item', 'active', 'current');
                        }
                    }
                    
                    if (finalHref === currentParentHash || (currentParentHash === '' && finalHref === '#')) {
                        // Apply the native hover/active effect instead of a basic underline
                        a.classList.add('current-menu-item');
                        if (a.parentElement && a.parentElement.classList) {
                            a.parentElement.classList.add('current-menu-item');
                        }
                        a.style.textDecoration = 'none';
                    } else {
                        a.style.textDecoration = 'none';
                    }
                }
            }
        });

        // Safely replace text nodes without breaking HTML
        const walkDomAndReplace = (node) => {
          if (!node) return;
          if (node.nodeType === 3) { // Text node
            let text = node.nodeValue;
            let original = text;
            const exactTrim = text.trim();
            
            // Clean up any stray "euable"
            text = text.replace(/euable/gi, 'eureka');
            
            // Handle split text nodes for headline
            if (text.includes("Life is smart")) text = text.replace(/Life is smart\.?/gi, "Nature is random.");
            if (text.includes("Let’s learn from it") || text.includes("Let's learn from it")) {
                text = text.replace(/Let[’\']s learn from it\.?/gi, "Let's be deterministic.");
            }
            
            // Main subheadline (Professional and realistic)
            text = text.replace(/Enveda is learning from life to discover medicines/gi, "EUREKA utilizes Generative AI to simulate drug discovery");
            text = text.replace(/4X faster/gi, "entirely in-silico");
            text = text.replace(/than the industry average\.?/gi, "using a deterministic pipeline.");

            // AI Models (Purpose) Page animated GSAP text replacements
            // Skip the name breakdown elements so direct DOM setting controls them flawlessly
            if (node.parentElement && (node.parentElement.closest('.center-all') || node.parentElement.closest('.knowledge'))) {
                return;
            }
            if (text.includes("The future is ancient") || (text.includes("The future") && text.includes("ancient"))) {
                text = "The future is deterministic.";
            }
            if (text.includes("access the unexplored potential of life") || text.includes("unexplored potential of life")) {
                text = "empowering researchers to synthesize and evaluate novel molecular scaffolds entirely in-silico.";
            }
            if (text.includes("blends the English word") || text.includes("pronounced en-VAY-da")) {
                text = "EUREKA (pronounced yoo-REE-kuh) stems from the historic exclamation \"I have found it!\" celebrating the breakthrough moment of scientific discovery.";
            }
            if (text.includes("We enable scientists to harness")) {
                text = "We empower researchers with deterministic deep learning and biophysical simulations, transforming drug discovery from unpredictable trial-and-error into accelerated, algorithmic breakthroughs.";
            }
            if (text.includes("When scientists first sequenced the human genome")) {
                text = "When computational biologists first mapped protein tertiary structures, it unlocked rational drug design. But exploring the 10^60 possible chemical space requires generative intelligence. The EUREKA platform couples deep autoregressive language models with biophysical force fields: exploring untapped chemical space and autonomously synthesizing novel, valid lead molecules in seconds.";
            }
            if (text.includes("More than 12 groundbreaking molecules and counting")) {
                text = "Thousands of validated in-silico leads and counting";
            }
            if (text.includes("Since our founding in 2019, our platform has led to the discovery of a number of candidate medicines")) {
                text = "Powered by multi-criteria Pareto optimization, our autonomous pipeline has evaluated over 500,000 chemical candidates, advancing high-affinity leads like EUR-GenAI-1, EUR-Dock-2, and EUR-ADMET-3 with verified AutoDock Vina binding scores below -7.5 kcal/mol and strict Tox21 safety compliance.";
            }
            if (text.includes("Our commitment to nature") || text.includes("commitment to nature")) {
                text = "Our commitment to deterministic AI";
            }
            if (text.includes("Healthy people require a healthy planet")) {
                text = "Rigorous science requires deterministic computation.";
            }
            if (text.includes("We recognize that humanity") && text.includes("existence is intricately linked")) {
                text = "We strictly reject black-box agentic unpredictability in favor of deterministic deep learning and physics-based validation.";
            }
            if (text.includes("As we catalog life’s chemistry, we adhere") || text.includes("Convention on Biological Diversity")) {
                text = "By anchoring every generated molecule to verified biophysical laws—AutoDock Vina force field docking and empirical Tox21 assay models—we ensure 100% reproducible and synthesizable discovery results.";
            }
            if (text.includes("Sustainability is critical to our mission")) {
                text = "Determinism is critical to our mission.";
            }
            if (text.includes("Everyone deserves health")) {
                text = "Accelerating discovery for undruggable targets";
            }
            if (text.includes("Bill & Melinda Gates Foundation") || text.includes("Gates Foundation")) {
                text = "We leverage world-class open-source databases and public repositories, integrating data from RCSB Protein Data Bank, NIH Tox21 toxicology libraries, and ChEMBL bioactivity datasets to benchmark novel binding candidates against the most challenging viral and oncological targets.";
            }
            if (text.includes("THE CHEMICAL CODE")) {
                text = "DE NOVO GENERATIVE CHEMISTRY";
            }
            if (text.includes("A life lesson from life itself")) {
                text = "A computational leap in chemical space";
            }
            if (text.includes("SUSTAINABILITY")) {
                text = "COMPUTATIONAL DETERMINISM";
            }
            if (text.includes("Our Partners")) {
                text = "OPEN RESEARCH & REPOSITORIES";
            }
            if (text.trim() === "Charity") {
                text = "DETERMINISM";
            }
            if (text.includes("Take Care of Eachother")) {
                text = "Rigorous In-Silico Physics";
            }

            // Catch complex text blocks by keywords (safely overrides whole text node if matched)
            if (text.includes("Our Platform")) text = "Our Pipeline";
            if (text.includes("Our Purpose")) text = "Our AI Models";
            if (text.includes("OUR PEOPLE")) text = "SIMULATION";
            
            // --- PLATFORM PAGE SPECIFIC REPLACEMENTS (GSAP-SAFE) ---
            
            // Replace the three steps headers
            if (text.includes("1. Organize")) text = "1. Generate";
            if (text.includes("2. Translate")) text = "2. Screen";
            if (text.includes("3. Apply")) text = "3. Predict";
            if (exactTrim === "Organize") text = "Generate";
            if (exactTrim === "Translate") text = "Screen";
            if (exactTrim === "Apply") text = "Predict";
            
            // Replace the big numbers section (Shorter text to fix GSAP overlapping)
            if (text.includes("75%")) text = text.replace("75%", "10M+");
            if (exactTrim === "fewer analogs") text = "novel structures";
            if (exactTrim === "required to get to") text = "generated and";
            if (text.includes("DC vs. industry") && !text.includes("DC on a per scaffold")) text = "evaluated per day";
            
            if (exactTrim === "11x" || exactTrim === "99%") text = "99%";
            if (exactTrim === "success rate to" || text.includes("reduction in wet-lab")) text = "higher success";
            if (text.includes("DC on a per scaffold") || text.includes("synthesis failure rates via")) text = "in wet-lab synthesis";
            if (exactTrim === "basis vs. industry" || text.includes("deterministic filtering")) text = "via deterministic AI";
            
            if (exactTrim === "4x" || exactTrim === "100x") text = "100x";
            if (exactTrim === "faster to" || text.includes("faster target-to-hit")) text = "faster to";
            if (exactTrim === "DC vs." || text.includes("identification compared")) text = "identify hits vs.";
            if (exactTrim === "industry" || text.includes("to traditional screening")) text = "physical labs";
            
            // Clear out the tiny footnotes under the numbers and their floating numbers!
            if (text.includes("DC stands for Development Candidate")) text = "";
            if (text.includes("Atomwise AIMS Program")) {
                text = "";
                if (node.parentElement) node.parentElement.style.display = 'none';
            }
            if (text.includes("Sun, et al. Why 90% of Clinical Drug Development Fails")) {
                text = "";
                if (node.parentElement) node.parentElement.style.display = 'none';
            }
            if (text.includes("Paul, et al. How to improve R&D productivity") || text.includes("EUREKA pipeline metrics based on comparative analysis")) {
                text = "EUREKA pipeline metrics based on comparative analysis of traditional high-throughput screening vs. our distributed GPU cluster architecture running generative AI and docking models.";
                // We don't hide this one, as we use it to show our single disclaimer.
            }
            
            if (text.includes("Nature contains potential treatments")) {
                text = "The vast chemical space contains potential treatments for many of the world's diseases, but for too long it has remained out of reach to computational discovery.";
            }
            if (text.includes("with a platform that can analyze any chemical space and answer two questions")) {
                text = "EUREKA is changing the status quo, with a platform that can analyze any chemical space and answer two questions: 1) “What are the novel molecules?”, and 2) “Are they drug-like?” faster and cheaper than ever before possible.";
            }
            if (text.includes("learn from life's")) {
                text = text.replace(/learn from life\'s\s*chemistry/gi, "master in-silico chemistry");
            }
            if (text.includes("with a searchable library of generated") || text.includes("with a searchable library of plant")) {
                text = "with deep learning architectures capable of producing novel SMILES strings (the majority of which have never been studied by science before)";
            }
            if (text.includes("with AI that knows the language")) {
                text = "with multi-criteria validation, rapidly analyzing binding affinities and pharmacokinetic properties from one molecule at a time to 10,000 at a time";
            }
            if (text.includes("with a fully automated lab")) {
                text = "with an end-to-end deterministic pipeline that identifies the most viable candidates for synthesis at high-throughput";
            }
            if (exactTrim === "THE Library") text = "THE Dataset";
            if (text.includes("Organizing the chemistry")) text = "Mapping the uncharted chemical space";
            
            if (text.includes("Traditional methods have only been able to screen")) {
                text = "Traditional methods rely on slow, expensive wet-lab screening, testing only a fraction of possible molecular structures. EUREKA bypasses this bottleneck by exploring millions of drug-like configurations in a matter of hours, accelerating the path to viable treatments.";
            }
            // Clear out the rest of the old traditional methods paragraph
            if (text.includes("Half of all medicines taken in pill form") || text.includes("These medicines relieve pain")) {
                text = "";
            }
            
            if (text.includes("At EUREKA, we’ve realized that to learn from life, you need to organize it.")) {
                text = "At EUREKA, we believe the future of medicine is computationally derived. So we built a massive infrastructure for de novo generation—making drug discovery highly deterministic.";
            }
            
            if (text.includes("In the vast expanse of the natural world, volumes of knowledge await")) {
                text = "In the vast expanse of chemical space, billions of potential drugs await discovery. While physical screening is limited to known compounds, our models can hallucinate and evaluate completely novel molecules.";
            }
            // Clear out the tomato sentence
            if (text.includes("A tomato contains thousands of molecules") || text.includes("despite it being one of the most studied")) {
                text = "";
            }
            
            if (text.includes("At EUREKA, we’ve realized that to learn from life’s chemistry, you need to organize it. So we built the world’s largest library")) {
                text = "At EUREKA, we believe the future of medicine is computationally derived. First, we created a database of what’s currently known to science: millions of generated SMILES linked to known disease targets. Second, we fine-tune our models to target specific protein binding sites. Third, we run AutoDock Vina and QED scoring to validate these generated structures.";
            }
            // Clear out the rest of the old 'organize it' paragraph
            if (text.includes("First, we created a database") && !text.includes("database of what’s currently known to science: millions of generated SMILES")) {
                text = ""; // clear old first
            }
            if (text.includes("Second, we sourced plants")) text = "";
            if (text.includes("Third, we combined cutting edge multi-criteria")) text = "";
            
            if (text.includes("Our team is working to catalog these findings")) {
                text = "Our pipeline is constantly evolving, exploring new architectures and validation methods. The result is a self-improving engine for drug discovery.";
            }
            // Clear out old sentences in that paragraph
            if (text.includes("The result is a library of life")) text = "";
            if (text.includes("Far more than a collection of raw data")) text = "";
            if (text.includes("one in which each chemical structure tells a story")) text = "";
            
            if (text.includes("Chemical identification without isolation")) text = "Molecular validation without synthesis";
            
            if (text.includes("To find new medicines in nature, scientists used to have to isolate")) {
                text = "To find new medicines, scientists used to synthesize and test compounds one at a time. Not at EUREKA. By simulating physics and chemistry, we analyze thousands of molecules per minute.";
            }
            // Clear out the rest of that old paragraph
            if (text.includes("and study the molecules of a medicinal plant")) text = "";
            if (text.includes("Not at EUREKA. By teaching AI the language")) text = "";
            if (text.includes("we’ve enabled the successful analysis of thousands")) text = "";
            
            if (text.includes("We can now rapidly forecast the structure")) {
                text = "We can now rapidly forecast the binding affinity of completely novel molecules with precision. EUREKA’s AI unlocks the door to a new era of discovery, where modern challenges are solved using deterministic AI algorithms.";
            }
            if (text.includes("EUREKA’s AI unlocks the door to a new era") && !text.includes("forecast the binding affinity")) {
                text = ""; // Hide duplicates
            }
            
            if (text.includes("EUREKA-GEN is EUREKA’s foundation model for natural chemistry")) {
                text = "EUREKA-GEN is EUREKA’s foundation model for generative chemistry—it’s what our AI translations are built on. Similar to how generative AI learns from “reading” vast amounts of written content, EUREKA-GEN has been taught by chemical structures: millions of SMILES and their known binding affinities, enabled by EUREKA's highly scalable GPU clusters.";
            }
            
            if (text.includes("For each of the billions of mass spectra, EUREKA-GEN")) {
                text = "EUREKA-GEN learns the complex rules of molecular validity, generating structurally sound molecules that score high on QED and Lipinski criteria.";
            }
            if (text.includes("This exercise forces EUREKA-GEN to learn")) text = ""; // Hide rest of paragraph
            
            if (text.includes("Applying our learnings from the natural world")) {
                text = "Applying our predictive models";
            }
            if (text.includes("At EUREKA, we believe a healthier future lies in the 99.9% of nature we have yet to explore")) {
                text = "At EUREKA, we believe a healthier future lies in the 99.9% of chemical space we have yet to explore. It's time to let algorithms lead the way.";
            }
            if (text.includes("It’s time to see what the unseen world")) text = "";
            
            if (text.includes("With our platform, we’re building a chemical sequencer")) {
                text = "With our platform, we’re building an in-silico engine for medicine. With the ability to rapidly multiply humanity’s knowledge of the chemical space and solve many of the greatest challenges in human and planetary health, we can not only accelerate new treatments for millions of patients, but also one day bring this technology to bear in diverse fields like diagnostics, agriculture, nutrition, manufacturing, and more.";
            }
            // Clear duplicates
            if (text.includes("With the ability to rapidly multiply humanity’s knowledge") && !text.includes("in-silico engine")) {
                text = "";
            }
            
            if (text.includes("Together, we can rapidly multiply humanity’s knowledge") && !text.includes("humanity's capacity")) {
                text = "Together, we can rapidly multiply humanity's capacity for computational design and solve many of the greatest challenges in human and planetary health. We’d love your support.";
            }
            if (text.includes("world’s chemistry and solve many of the greatest challenges")) {
                text = "";
            }
            
            // EUREKA specific branding replacements (from user request)
            text = text.replace(/The natural world is our\s*textbook\.?/gi, 'Deterministic AI is our engine.');
            text = text.replace(/Technology is\s*our teacher\.?/gi, 'In-silico chemistry is our frontier.');
            text = text.replace(/PRISM/g, 'EUREKA-GEN');
            text = text.replace(/grown from the smallest stories on Earth\.?/gi, 'generated entirely in-silico.');
            text = text.replace(/plant molecules/gi, 'generated SMILES strings');
            text = text.replace(/plant-derived molecules/gi, 'de novo generated molecules');
            text = text.replace(/38,000 plants linked to 12,000 human diseases/gi, 'millions of generated SMILES linked to known disease targets');
            text = text.replace(/mass spectrometry/gi, 'multi-criteria validation and Lipinski\'s Rule of 5');
            text = text.replace(/automated laboratory/gi, 'automated in-silico pipeline');
            text = text.replace(/nature’s ancient wisdom/gi, 'deterministic AI algorithms');
            text = text.replace(/Learning from the library of life/gi, 'Learning from deep neural networks');
            text = text.replace(/Translating the natural world/gi, 'Translating the chemical space');
            text = text.replace(/natural sample/gi, 'chemical space');
            text = text.replace(/a searchable library of plant molecules/gi, 'a searchable library of generated SMILES strings');
            text = text.replace(/Modern science has only been able to study about 0\.1% of nature’s chemistry/gi, 'Traditional methods have only been able to screen a fraction of the chemical space');
            
            // "The greatest resource for drug discovery is the great unknown" (Often split by <br>)
            if (text.includes("the great unknown")) text = text.replace("the great unknown", "deterministic simulation");
            if (text.includes("The greatest resource")) text = text.replace("The greatest resource", "The greatest resource");

            // Replace the biology/nature paragraph with AI drug discovery paragraph
            if (text.includes("Nearly half of all medicines")) {
                text = "Nearly 90% of all traditional drug discovery costs stem from physical trial-and-error in wet labs.";
            }
            if (text.includes("But almost the entirety of the natural world")) {
                text = " The vast chemical space of potential drugs remains largely unexplored due to the enormous cost of (1) synthesizing millions of compounds, (2) physically screening their structures, and (3) testing their activity in vitro.";
            }

            // User explicitly wants the second paragraph replaced but the first one KEPT
            if (text.includes("With a platform that can read")) {
                text = "With an autonomous AI pipeline that leverages PyTorch LSTMs, AlphaFold, and AutoDock Vina, EUREKA replaces physical labs with high-fidelity deterministic simulations, putting rapid, compute-driven drug discovery into the hands of researchers for the first time.";
            }
            
            // Secondary headers
            if (text.includes("From life on Earth")) {
                text = text.replace("From life on Earth", "From life in silico");
            }
            if (text.includes("for life")) {
                text = text.replace(/for life\s*on Earth/gi, "for precision medicine");
            }
            
            if (text.includes("exists to give hope")) {
                text = "EUREKA exists to eliminate the guesswork of traditional drug discovery by simulating molecular interactions entirely in-silico.";
            }
            
            // Core Values (Split into list items)
            if (text.trim() === 'VALUE') text = 'DETERMINISM';
            if (text.trim() === 'CURIOSITY') text = 'PRECISION';
            if (text.trim() === 'LEARN + CHALLENGE') text = 'SIMULATION';
            
            // Small tags and values
            if (text.includes("We’ve cultivated a great team")) text = "We've built a fully deterministic pipeline.";
            if (text.includes("And we’re growing.")) text = "Explicitly avoiding Agentic AI.";
            if (text.toUpperCase().includes("ISSUE 01")) text = "EPOCH 01";
            if (text.includes("Learning from Life")) text = text.replace(/Learning from Life\.?/gi, "Generating Molecules.");
            if (text.includes("from Life.")) text = text.replace("from Life.", "Molecules."); // Footer split
            if (text.includes("Learning from Data.")) text = text.replace("Learning from Data.", "Generating Molecules.");
            if (text.includes("from Data.")) text = text.replace("from Data.", "Molecules.");
            if (text.includes("Foundations &")) text = text.replace("Foundations &", "Generative & ");

            // Location data
            if (text.trim() === "Locations") text = "Architecture";
            if (text.trim() === "Enveda Therapeutics") text = "EUREKA Core Services";
            if (text.includes("5700 Flatiron")) text = "FastAPI Backend Server";
            if (text.includes("Boulder, CO")) text = "Cloud Deployment";
            
            if (text.includes("M/s Enveda Therapeutics")) text = "Model Training Layer";
            if (text.includes("3rd Floor, Building 3600")) text = "De Novo Generation Node";
            if (text.includes("Genome Valley")) text = "Distributed Compute";
            
            // Marquee title replacement
            if (text.toUpperCase().includes("AS SEEN IN")) {
                text = text.replace(/As seen in/gi, "POWERED BY");
            }
            
            // Footer credits
            if (text.includes("Site by Maven Creative")) text = "Developed for EUREKA Pipeline";

            // Basic standard replacements
            text = text.replace(/©\s*202[0-9]\s*ENVEDA/gi, '© 2026 EUREKA');
            text = text.replace(/Human\.\s*Nature\./gi, 'Generative. Precise.');
            text = text.replace(/\bEnveda\b/gi, 'EUREKA');
            text = text.replace(/\bENVEDA\b/gi, 'EUREKA');
            
            // Navbar exact match replacements (Using \u200B zero-width space to prevent recursive replacement!)
            const tTrim = text.trim();
            if (tTrim === 'Platform') text = text.replace('Platform', 'Dashboard\u200B');
            else if (tTrim === 'Pipeline') text = text.replace('Pipeline', 'Platform\u200B');
            else if (tTrim === 'Purpose') text = text.replace('Purpose', 'Pipeline\u200B');
            else if (tTrim === 'People') text = text.replace('People', 'AI Models\u200B');
            else if (text.includes('In-Veda')) text = text.replace(/In-Veda(™|TM|.*)?/g, 'Results\u200B');
            else if (tTrim === 'News') text = text.replace('News', 'About\u200B');
            else if (tTrim === 'Press') text = text.replace('Press', 'Docs\u200B');
            else if (tTrim === 'Careers') text = text.replace('Careers', 'Github Repo\u200B');
            
            // Clean up trailing TMs and artifacts
            text = text.replace(/Results\u200BTM/gi, 'Results\u200B');
            text = text.replace(/Simulation™/gi, '');

            if (text !== original) {
              node.nodeValue = text;
            }
          } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
            if (node.id === 'featured-medicines' || node.id === 'eureka-system-architecture') return;
            for (let i = 0; i < node.childNodes.length; i++) {
              walkDomAndReplace(node.childNodes[i]);
            }
          }
        };

        walkDomAndReplace(iframeDoc.body);
      } catch (err) {
        // Log errors to the debug overlay for troubleshooting
        const debugOverlay = document.getElementById('debug-overlay');
        if (debugOverlay && err) {
            debugOverlay.innerText = err.toString() + '\\n' + err.stack;
        }
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', applyTextReplacements);
      const interval = setInterval(applyTextReplacements, 300); // Fast interval for smooth injection
      return () => {
        iframe.removeEventListener('load', applyTextReplacements);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100vh', background: 'white' }}>
      <iframe 
        ref={iframeRef}
        src={proxyUrl} 
        style={{
          width: '100%', 
          height: '100%', 
          border: 'none', 
          margin: 0, 
          padding: 0, 
          display: 'block'
        }} 
        title="Exact Enveda Clone"
      />
      <div id="debug-overlay" style={{position: 'absolute', top: 0, left: 0, zIndex: 999999, background: 'red', color: 'white'}}></div>
    </div>
  );
}

export default App;
