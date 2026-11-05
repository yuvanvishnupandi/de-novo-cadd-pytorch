import React, { useState, useEffect } from 'react';
import Navbar from './components/discovery/Navbar';
import HeroSection from './components/discovery/HeroSection';
import ProductPillars from './components/discovery/ProductPillars';
import CoreCapabilities from './components/discovery/CoreCapabilities';
import BottleneckMetrics from './components/discovery/BottleneckMetrics';
import AntibodyDesignStudio from './components/discovery/AntibodyDesignStudio';
import DiscoveryEnginesSuite from './components/discovery/DiscoveryEnginesSuite';
import ProteinDesignStudio from './components/discovery/ProteinDesignStudio';
import GeneticLocusEngineering from './components/discovery/GeneticLocusEngineering';
import Interactive3DLab from './components/discovery/Interactive3DLab';
import WorkbenchCTA from './components/discovery/WorkbenchCTA';
import PreFooterMolecule from './components/discovery/PreFooterMolecule';
import Footer from './components/discovery/Footer';

// Dedicated Standalone Page Endpoints
import PlatformPipelinePage from './components/discovery/PlatformPipelinePage';
import LabSimulationPage from './components/discovery/LabSimulationPage';
import GeneticsStudioPage from './components/discovery/GeneticsStudioPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [notification, setNotification] = useState(null);

  const resolveRoute = (input) => {
    const raw = (input || '').replace(/^#\/?/, '').replace(/^\/|\/$/g, '').toLowerCase().trim();
    if (['platform', 'pipeline', 'de-novo-pipeline'].includes(raw)) return 'pipeline';
    if (['lab', 'interactive-lab', 'docking', 'simulation', 'vina'].includes(raw)) return 'lab';
    if (['genetics', 'genetic-tailoring', 'crispr', 'base-editing'].includes(raw)) return 'genetics';
    if (['case-studies', 'cradle', 'cradle-engineering'].includes(raw)) return 'case-studies';
    if (['antibody', 'converge', 'converge-studio'].includes(raw)) return 'antibody';
    if (['engines', 'discovery-engines'].includes(raw)) return 'engines';
    if (['overview', 'home', ''].includes(raw)) return 'overview';
    return raw;
  };

  const getActiveRouteFromWindow = () => {
    // Check hash first (e.g. #platform, #lab, #genetics)
    const hashPart = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (hashPart) {
      return resolveRoute(hashPart);
    }
    // Check pathname (e.g. /platform, /pipeline, /lab, /genetics)
    const pathPart = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase().trim();
    if (pathPart) {
      return resolveRoute(pathPart);
    }
    return 'overview';
  };

  // Sync with browser URL hash and pathname for real multi-page endpoints
  useEffect(() => {
    const syncRoute = () => {
      const route = getActiveRouteFromWindow();
      if (['platform', 'pipeline', 'lab', 'genetics'].includes(route)) {
        setCurrentPage(route === 'platform' ? 'pipeline' : route);
        // Ensure the URL is clean: root path + canonical hash, e.g. /#pipeline
        const canonicalUrl = `/#${route === 'platform' ? 'pipeline' : route}`;
        if (window.location.pathname !== '/' || window.location.hash !== `#${route}`) {
          window.history.replaceState(null, '', canonicalUrl);
        }
      } else if (route === 'case-studies') {
        setCurrentPage('overview');
        setTimeout(() => {
          const el = document.getElementById('cradle-engineering');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else if (route === 'antibody') {
        setCurrentPage('overview');
        setTimeout(() => {
          const el = document.getElementById('converge-studio');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else if (route === 'engines') {
        setCurrentPage('overview');
        setTimeout(() => {
          const el = document.getElementById('discovery-engines');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        setCurrentPage('overview');
        if (window.location.pathname !== '/' && !window.location.hash) {
          window.history.replaceState(null, '', '/');
        }
      }
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const navigateTo = (pageKey) => {
    const route = resolveRoute(pageKey);

    if (['platform', 'pipeline', 'lab', 'genetics'].includes(route)) {
      const canonicalRoute = route === 'platform' ? 'pipeline' : route;
      setCurrentPage(canonicalRoute);
      window.history.pushState(null, '', `/#${canonicalRoute}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'case-studies') {
      setCurrentPage('overview');
      window.history.pushState(null, '', '/#cradle-engineering');
      setTimeout(() => {
        const el = document.getElementById('cradle-engineering');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (route === 'engines') {
      setCurrentPage('overview');
      window.history.pushState(null, '', '/#discovery-engines');
      setTimeout(() => {
        const el = document.getElementById('discovery-engines');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (route === 'antibody') {
      setCurrentPage('overview');
      window.history.pushState(null, '', '/#converge-studio');
      setTimeout(() => {
        const el = document.getElementById('converge-studio');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      // overview or in-page anchor
      setCurrentPage('overview');
      const cleanKey = route === 'overview' ? '' : route;
      window.history.pushState(null, '', cleanKey ? `/#${cleanKey}` : '/');
      if (cleanKey) {
        const el = document.getElementById(cleanKey);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExplorePipeline = () => {
    navigateTo('pipeline');
  };

  return (
    <div className="min-h-screen bg-[#171615] text-[#f5f2ee] font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col justify-between">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded bg-[#1e1d1b] border border-emerald-500/50 px-4 py-3 text-sm text-emerald-300 shadow-2xl backdrop-blur-md transition-all">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-neutral-400 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Navigation Header */}
      <Navbar
        onNavigate={navigateTo}
        activeTab={currentPage}
      />

      {/* Conditional Multi-Page View Rendering */}
      {(currentPage === 'platform' || currentPage === 'pipeline') && (
        <main className="w-full flex-1">
          <PlatformPipelinePage onNavigate={navigateTo} />
        </main>
      )}

      {currentPage === 'lab' && (
        <main className="w-full flex-1">
          <LabSimulationPage onNavigate={navigateTo} />
        </main>
      )}

      {currentPage === 'genetics' && (
        <main className="w-full flex-1">
          <GeneticsStudioPage onNavigate={navigateTo} />
        </main>
      )}

      {currentPage === 'overview' && (
        <main className="w-full flex-1 flex flex-col">
          {/* Section 1: Hero with Hardware-Accelerated Halftone Video */}
          <div id="overview">
            <HeroSection
              onLaunchLab={() => navigateTo('lab')}
              onAcademicSignup={handleExplorePipeline}
            />
          </div>

          {/* Section 2: Product Overview & 3 Scientific Pillars */}
          <div id="product-overview">
            <ProductPillars
              onExplorePlatform={() => navigateTo('pipeline')}
            />
          </div>

          {/* Section 3: Core Architectural Capabilities (Halftone Video Cards) */}
          <div id="features">
            <CoreCapabilities
              onSelectFeature={(cardIndex) => {
                if (cardIndex === 1) navigateTo('antibody');
                else if (cardIndex === 2) navigateTo('lab');
                else navigateTo('pipeline');
              }}
            />
          </div>

          {/* Section 4: Generative Antibody Studio (Generate, Predict, Explain with Color Matching & Typing Animation) */}
          <div id="converge-studio">
            <AntibodyDesignStudio />
          </div>

          {/* Section 5: Integrated Multi-Platform Discovery Engines */}
          <div id="discovery-engines">
            <DiscoveryEnginesSuite
              onLaunchLab={() => navigateTo('lab')}
              onLaunchPipeline={() => navigateTo('pipeline')}
            />
          </div>

          {/* Section 6: Protein Engineering Case Studies with 3D Stacked Card Scroll Effect */}
          <div id="cradle-engineering">
            <ProteinDesignStudio />
          </div>

          {/* Section 7: Precision Genetics & Base Editing Loci */}
          <div id="genetic-tailoring">
            <GeneticLocusEngineering />
          </div>

          {/* Section 8: Preclinical Fragmented Bottleneck Stats */}
          <div id="stats">
            <BottleneckMetrics
              onExploreSolutions={() => navigateTo('pipeline')}
            />
          </div>

          {/* Section 9: Rotating Molecule Pre-Footer Section (molecule-rotate-beforefooter.mp4) */}
          <div id="pre-footer">
            <PreFooterMolecule
              onLaunchLab={() => navigateTo('lab')}
            />
          </div>

          {/* Section 10: Halftone CTA Banner */}
          <div id="cta">
            <WorkbenchCTA
              onLaunchWorkbench={() => navigateTo('lab')}
              onExploreAntibody={() => navigateTo('antibody')}
            />
          </div>
        </main>
      )}

      {/* Primary Discovery Footer */}
      <Footer
        onNavigate={navigateTo}
      />
    </div>
  );
}
