import React, { useState, useEffect } from 'react';
import BenchSciNav from './components/benchsci/BenchSciNav';
import BenchSciHero from './components/benchsci/BenchSciHero';
import BenchSciLogos from './components/benchsci/BenchSciLogos';
import BenchSciProduct from './components/benchsci/BenchSciProduct';
import BenchSciFeatures from './components/benchsci/BenchSciFeatures';
import BenchSciStats from './components/benchsci/BenchSciStats';
import Top8PlatformsSection from './components/benchsci/Top8PlatformsSection';
import Interactive3DLab from './components/benchsci/Interactive3DLab';
import BenchSciNews from './components/benchsci/BenchSciNews';
import BenchSciCTA from './components/benchsci/BenchSciCTA';
import BenchSciFooter from './components/benchsci/BenchSciFooter';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);

  // Target ID mapping for clean internal routing with ZERO external redirects
  const SECTION_MAP = {
    overview: 'overview',
    lab: 'interactive-lab',
    'interactive-lab': 'interactive-lab',
    top8: 'top-platforms',
    'top-platforms': 'top-platforms',
    evidence: 'product-overview',
    'product-overview': 'product-overview',
    features: 'features',
    targets: 'interactive-lab',
    generator: 'interactive-lab',
    admet: 'interactive-lab',
    stats: 'stats',
    customers: 'logos',
    logos: 'logos',
    security: 'features',
    pricing: 'cta',
    news: 'news',
    cta: 'cta',
    contact: 'cta',
    login: 'interactive-lab'
  };

  // Smooth scroll handler for all internal navigation
  const scrollToSection = (navKey) => {
    const targetId = SECTION_MAP[navKey] || navKey;
    setActiveTab(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAcademicSignup = () => {
    showToast('Academic & Research access initiated: Full API & 38M+ papers enabled for session.');
    scrollToSection('interactive-lab');
  };

  const handleLaunchLab = () => {
    scrollToSection('interactive-lab');
  };

  return (
    <div className="min-h-screen bg-[#171615] text-[#f5f2ee] font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded bg-[#1e1d1b] border border-emerald-500/50 px-4 py-3 text-sm text-emerald-300 shadow-2xl backdrop-blur-md transition-all animate-bounce">
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

      {/* Sticky Obsidian BenchSci Header */}
      <BenchSciNav
        onNavigate={scrollToSection}
        activeTab={activeTab}
      />

      {/* Main Content Sections */}
      <main className="w-full flex flex-col">
        {/* Section 1: Hero with Halftone Video */}
        <div id="overview">
          <BenchSciHero
            onLaunchLab={handleLaunchLab}
            onAcademicSignup={handleAcademicSignup}
          />
        </div>

        {/* Section 2: Customer Logos & Scale Metrics */}
        <div id="logos">
          <BenchSciLogos />
        </div>

        {/* Section 3: Product Overview & 3 Pillars */}
        <div id="product-overview">
          <BenchSciProduct
            onExplorePlatform={() => scrollToSection('features')}
          />
        </div>

        {/* Section 4: What makes the platform different (Halftone Cards) */}
        <div id="features">
          <BenchSciFeatures
            onSelectFeature={(cardIndex) => {
              if (cardIndex === 1) scrollToSection('top-platforms');
              else if (cardIndex === 2) scrollToSection('interactive-lab');
              else scrollToSection('product-overview');
            }}
          />
        </div>

        {/* Section 5: Preclinical Fragmented Bottleneck Stats */}
        <div id="stats">
          <BenchSciStats
            onExploreSolutions={() => scrollToSection('top-platforms')}
          />
        </div>

        {/* Section 6: Top 8 AI Drug Discovery Platforms (GHP News 2026 Ranking) */}
        <div id="top-platforms">
          <Top8PlatformsSection
            onTryPlatform={(platformId) => {
              scrollToSection('interactive-lab');
              showToast(`Loaded ${platformId.toUpperCase()} pipeline parameters into In-Silico Workbench.`);
            }}
          />
        </div>

        {/* Section 7: Live In-Silico Interactive 3D Lab (Vina, AF3, PostEra, Tox21) */}
        <div id="interactive-lab">
          <Interactive3DLab />
        </div>

        {/* Section 8: Peer-Reviewed News & Benchmark Reports */}
        <div id="news">
          <BenchSciNews
            onSelectNews={(article) => {
              showToast(`Opened: ${article.title.substring(0, 40)}...`);
            }}
          />
        </div>

        {/* Section 9: Halftone CTA Banner */}
        <div id="cta">
          <BenchSciCTA
            onLaunchWorkbench={handleLaunchLab}
          />
        </div>
      </main>

      {/* Section 10: Obsidian BenchSci Footer with Zero External Redirects */}
      <BenchSciFooter
        onNavigate={scrollToSection}
      />
    </div>
  );
}
