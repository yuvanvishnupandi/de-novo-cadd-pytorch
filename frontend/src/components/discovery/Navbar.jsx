import React, { useState, useEffect, useRef } from 'react';

/**
 * Navbar
 * Seamless Dark Navigation Header for EUREKA In-Silico Discovery Platform:
 * - Invisible border line (border-none)
 * - Taller (76px) and spacious
 * - Academic / Doctoral project scope (zero commercial customer fluff)
 * - Real multi-page navigation: Overview, Platform & Pipeline, 3D Biophysics Lab, Genetics Studio, Antibody Studio, Case Studies
 * - Right actions: Academic access, Specifications, Try EUREKA
 */
export default function Navbar({ onNavigate, activeTab = 'overview' }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handlePageSelect = (pageKey) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageKey);
    }
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full select-none border-none">
      {/* Invisible border glass blur background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#171615]/95 backdrop-blur-md border-none"
      />

      <div className="relative mx-auto flex max-w-[1640px] items-center justify-between px-6 sm:px-12 lg:px-16 h-[76px]">
        
        {/* Brand Logo: EUREKA wordmark */}
        <button
          onClick={() => handlePageSelect('overview')}
          className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
        >
          <img
            alt="EUREKA"
            className="h-6 w-auto"
            src="/images/eureka-logo.svg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/nav-logo.svg';
            }}
          />
        </button>

        {/* Center Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center gap-7 text-[15px] font-sans font-normal text-[#d4d4d4]">
          
          {/* Overview Link */}
          <button
            onClick={() => handlePageSelect('overview')}
            className={`py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
              activeTab === 'overview' ? 'text-white font-medium' : 'text-[#d4d4d4]'
            }`}
          >
            Overview
          </button>

          {/* Platform Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('platform')}
              className={`flex items-center gap-1.5 py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
                openDropdown === 'platform' ? 'text-white font-medium' : 'text-[#d4d4d4]'
              }`}
            >
              <span>Platform</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`h-3 w-3 text-neutral-400 transition-transform duration-200 ${
                  openDropdown === 'platform' ? 'rotate-180 text-white' : ''
                }`}
              >
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openDropdown === 'platform' && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#1e1d1b] border border-[#363534] rounded-lg shadow-2xl p-3 space-y-1.5 z-50 animate-fadeIn">
                <button
                  onClick={() => handlePageSelect('pipeline')}
                  className="block w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white text-xs">Pipeline &amp; De Novo Discovery</div>
                  <div className="text-[11px] text-neutral-400">5-stage Cryo-EM and SE(3) diffusion pipeline with 3D macromolecule</div>
                </button>
                <button
                  onClick={() => handlePageSelect('lab')}
                  className="block w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white text-xs">AutoDock Vina 3D Simulation</div>
                  <div className="text-[11px] text-neutral-400">Real-time force fields, PDB coordinates &amp; binding affinity</div>
                </button>
                <button
                  onClick={() => handlePageSelect('genetics')}
                  className="block w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white text-xs">Genomic &amp; Base Editing Studio</div>
                  <div className="text-[11px] text-neutral-400">Base-editor loci, PAM scanning &amp; CFD specificity scoring</div>
                </button>
                <button
                  onClick={() => handlePageSelect('antibody')}
                  className="block w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white text-xs">Antibody Design Studio</div>
                  <div className="text-[11px] text-neutral-400">Autoregressive sequence design, developability &amp; explanation</div>
                </button>
                <button
                  onClick={() => handlePageSelect('discovery-engines')}
                  className="block w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white text-xs">Multi-Platform Discovery Engines</div>
                  <div className="text-[11px] text-neutral-400">Sequence modeling, de novo chemistry, phenomics &amp; biophysics</div>
                </button>
              </div>
            )}
          </div>

          {/* Pipeline Direct Page Link */}
          <button
            onClick={() => handlePageSelect('pipeline')}
            className={`py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
              activeTab === 'platform' || activeTab === 'pipeline' ? 'text-white font-semibold' : 'text-[#d4d4d4]'
            }`}
          >
            Pipeline
          </button>

          {/* Interactive Lab Link */}
          <button
            onClick={() => handlePageSelect('lab')}
            className={`py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
              activeTab === 'lab' ? 'text-white font-semibold' : 'text-[#d4d4d4]'
            }`}
          >
            3D Biophysics Lab
          </button>

          {/* Genetics Studio Link */}
          <button
            onClick={() => handlePageSelect('genetics')}
            className={`py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
              activeTab === 'genetics' ? 'text-white font-semibold' : 'text-[#d4d4d4]'
            }`}
          >
            Genetics Studio
          </button>

          {/* Case Studies Link */}
          <button
            onClick={() => handlePageSelect('case-studies')}
            className={`py-2 transition-colors duration-150 hover:text-white cursor-pointer ${
              activeTab === 'case-studies' ? 'text-white font-semibold' : 'text-[#d4d4d4]'
            }`}
          >
            Case Studies
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={() => handlePageSelect('pipeline')}
            className="text-[14px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Architecture
          </button>

          <button
            onClick={() => handlePageSelect('pipeline')}
            className="text-[14px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Specifications
          </button>

          <button
            onClick={() => handlePageSelect('lab')}
            className="rounded bg-white px-5 py-2 text-[14px] font-sans font-medium text-neutral-900 transition-all hover:bg-neutral-100 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Workbench
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#1e1d1b] border-b border-[#2e2c29] px-6 py-6 space-y-4 animate-fadeIn">
          <button
            onClick={() => handlePageSelect('overview')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            Overview
          </button>
          <button
            onClick={() => handlePageSelect('platform')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            Pipeline &amp; De Novo Discovery
          </button>
          <button
            onClick={() => handlePageSelect('lab')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            3D Biophysics Lab
          </button>
          <button
            onClick={() => handlePageSelect('genetics')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            Genetics Studio
          </button>
          <button
            onClick={() => handlePageSelect('antibody')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            Antibody Studio
          </button>
          <button
            onClick={() => handlePageSelect('case-studies')}
            className="block w-full text-left text-base text-neutral-200 py-2 border-b border-neutral-800"
          >
            Case Studies
          </button>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => handlePageSelect('lab')}
              className="w-full text-center py-2.5 rounded bg-white text-neutral-900 font-medium text-sm cursor-pointer"
            >
              Launch Workbench
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

