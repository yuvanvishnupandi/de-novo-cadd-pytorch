import React, { useState } from 'react';

/**
 * BenchSciNav
 * Exact recreation of BenchSci sticky glass navigation bar:
 * - Exact BenchSci logo (/images/nav-logo.svg)
 * - Navigation links with dropdown menus
 * - Zero external link redirects (routes internally)
 * - Sign in, Contact us, and Try EMET / Discovery Suite CTA buttons
 */
export default function BenchSciNav({ onNavigate, activeTab }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="sticky top-0 z-50 w-full dark select-none">
      {/* Background glass blur effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px bottom-0 bg-[#171615]/90 backdrop-blur-[32px] backdrop-saturate-150 transition-opacity duration-200 border-b border-[#2e2c29]"
      ></div>

      <div className="relative mx-auto flex max-w-[1300px] items-center justify-between gap-8 px-6 sm:px-10 py-3.5 h-[68px]">
        
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate?.('overview')}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            alt="BenchSci"
            className="h-5 w-auto invert"
            src="/images/nav-logo.svg"
          />
        </div>

        {/* Center Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center gap-1 text-[14px] font-sans text-neutral-200">
          
          {/* Platform Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('platform')}
              className={`px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors duration-150 hover:text-white ${
                openDropdown === 'platform' ? 'text-white bg-white/5' : 'text-neutral-300'
              }`}
            >
              <span>Platform</span>
              <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'platform' ? 'rotate-180' : ''}`}>
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openDropdown === 'platform' && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#1e1d1b] border border-[#363534] rounded-lg shadow-2xl p-3 space-y-1.5 z-50">
                <button
                  onClick={() => { onNavigate?.('lab'); setOpenDropdown(null); }}
                  className="w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors group"
                >
                  <div className="font-semibold text-white text-xs group-hover:text-blue-400">AlphaFold 3D & Molecular Docking</div>
                  <div className="text-[11px] text-neutral-400">Real-time force fields, PDB coordinates & binding affinity</div>
                </button>
                <button
                  onClick={() => { onNavigate?.('top8'); setOpenDropdown(null); }}
                  className="w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors group"
                >
                  <div className="font-semibold text-white text-xs group-hover:text-blue-400">Top 8 AI Drug Discovery Engines</div>
                  <div className="text-[11px] text-neutral-400">Converge Bio, Isomorphic Labs, PostEra & BenchSci suite</div>
                </button>
                <button
                  onClick={() => { onNavigate?.('evidence'); setOpenDropdown(null); }}
                  className="w-full text-left p-2.5 rounded hover:bg-white/5 transition-colors group"
                >
                  <div className="font-semibold text-white text-xs group-hover:text-blue-400">Preclinical Evidence (ASCEND)</div>
                  <div className="text-[11px] text-neutral-400">Extracts preclinical proof from 38M+ papers & figures</div>
                </button>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('solutions')}
              className={`px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors duration-150 hover:text-white ${
                openDropdown === 'solutions' ? 'text-white bg-white/5' : 'text-neutral-300'
              }`}
            >
              <span>Solutions</span>
              <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'solutions' ? 'rotate-180' : ''}`}>
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openDropdown === 'solutions' && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1d1b] border border-[#363534] rounded-lg shadow-2xl p-3 space-y-1 z-50">
                <button onClick={() => { onNavigate?.('targets'); setOpenDropdown(null); }} className="w-full text-left p-2 rounded hover:bg-white/5 text-xs text-neutral-200 hover:text-white">
                  Target Identification & Validation
                </button>
                <button onClick={() => { onNavigate?.('generator'); setOpenDropdown(null); }} className="w-full text-left p-2 rounded hover:bg-white/5 text-xs text-neutral-200 hover:text-white">
                  De Novo Molecular Generation
                </button>
                <button onClick={() => { onNavigate?.('admet'); setOpenDropdown(null); }} className="w-full text-left p-2 rounded hover:bg-white/5 text-xs text-neutral-200 hover:text-white">
                  Tox21 Preclinical Safety Screening
                </button>
                <button onClick={() => { onNavigate?.('lab'); setOpenDropdown(null); }} className="w-full text-left p-2 rounded hover:bg-white/5 text-xs text-neutral-200 hover:text-white">
                  Translational Biophysics & Docking
                </button>
              </div>
            )}
          </div>

          {/* Top 8 Platforms Direct Link */}
          <button
            onClick={() => { onNavigate?.('top8'); setOpenDropdown(null); }}
            className={`px-3.5 py-2 rounded transition-colors duration-150 hover:text-white ${
              activeTab === 'top8' ? 'text-white font-semibold' : 'text-neutral-300'
            }`}
          >
            Top 8 AI Platforms
          </button>

          {/* Interactive 3D Lab */}
          <button
            onClick={() => { onNavigate?.('lab'); setOpenDropdown(null); }}
            className={`px-3.5 py-2 rounded transition-colors duration-150 hover:text-white ${
              activeTab === 'lab' ? 'text-white font-semibold' : 'text-neutral-300'
            }`}
          >
            Interactive 3D Lab
          </button>

          {/* Customers */}
          <button
            onClick={() => { onNavigate?.('customers'); setOpenDropdown(null); }}
            className="px-3.5 py-2 rounded text-neutral-300 hover:text-white transition-colors"
          >
            Customers
          </button>

          {/* Security */}
          <button
            onClick={() => { onNavigate?.('security'); setOpenDropdown(null); }}
            className="px-3.5 py-2 rounded text-neutral-300 hover:text-white transition-colors"
          >
            Security
          </button>

          {/* Pricing */}
          <button
            onClick={() => { onNavigate?.('pricing'); setOpenDropdown(null); }}
            className="px-3.5 py-2 rounded text-neutral-300 hover:text-white transition-colors"
          >
            Pricing
          </button>

        </div>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('login')}
            className="text-[14px] text-neutral-300 hover:text-white transition-colors px-2 py-1"
          >
            Sign in
          </button>

          <button
            onClick={() => onNavigate?.('contact')}
            className="rounded border border-white/40 bg-transparent text-white hover:border-white/20 hover:bg-white/10 h-8 px-3 py-1.5 text-[14px] transition-all font-medium"
          >
            Contact us
          </button>

          <button
            onClick={() => onNavigate?.('lab')}
            className="rounded bg-white text-neutral-900 hover:bg-neutral-100 h-8 px-3.5 py-1.5 text-[14px] font-semibold transition-all shadow-sm"
          >
            Try EMET
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#171615] border-b border-neutral-800 px-6 py-4 space-y-3 font-sans text-sm">
          <button onClick={() => { onNavigate?.('overview'); setMobileMenuOpen(false); }} className="block w-full text-left py-1.5 text-neutral-300">
            Home
          </button>
          <button onClick={() => { onNavigate?.('top8'); setMobileMenuOpen(false); }} className="block w-full text-left py-1.5 text-neutral-300">
            Top 8 AI Platforms (GHP 2026)
          </button>
          <button onClick={() => { onNavigate?.('lab'); setMobileMenuOpen(false); }} className="block w-full text-left py-1.5 text-neutral-300">
            Interactive 3D Lab (AlphaFold / Vina)
          </button>
          <button onClick={() => { onNavigate?.('targets'); setMobileMenuOpen(false); }} className="block w-full text-left py-1.5 text-neutral-300">
            Target Hub
          </button>
          <button onClick={() => { onNavigate?.('pricing'); setMobileMenuOpen(false); }} className="block w-full text-left py-1.5 text-neutral-300">
            Pricing
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <button onClick={() => { onNavigate?.('lab'); setMobileMenuOpen(false); }} className="w-full bg-white text-neutral-900 py-2 rounded font-semibold text-center">
              Try EMET for free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

