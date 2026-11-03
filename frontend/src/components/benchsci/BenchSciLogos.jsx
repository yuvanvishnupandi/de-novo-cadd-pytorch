import React from 'react';

/**
 * BenchSciLogos
 * Section 2: Trusted by world class teams
 * Exact realization with downloaded customer logos and BenchSci metrics
 */
export default function BenchSciLogos() {
  const LOGOS = [
    { name: 'Thermo Fisher Scientific', light: '/images/customer-logos/thermo-fisher-scientific.svg', dark: '/images/customer-logos/thermofisher-dark.svg' },
    { name: 'Merck', light: '/images/customer-logos/Merck.png', dark: '/images/customer-logos/Merck-dark.png' },
    { name: 'Sanofi', light: '/images/customer-logos/Sanofi.png', dark: '/images/customer-logos/Sanofi-dark.png' },
    { name: 'Pfizer', light: '/images/customer-logos/Pfizer.webp', dark: '/images/customer-logos/Pfizer-dark.png' },
    { name: 'Google', light: '/images/customer-logos/google-logo.png', dark: '/images/customer-logos/google-logo-dark.png' }
  ];

  return (
    <section className="w-full bg-[#171615] py-16 px-6 sm:px-10 border-b border-[#2e2c29] select-none">
      <div className="max-w-[1300px] mx-auto text-center">
        
        {/* Section Heading */}
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-10 font-medium">
          Trusted by world class teams
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-85">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="h-10 w-36 flex items-center justify-center grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src={logo.dark || logo.light}
                alt={logo.name}
                className="max-h-8 max-w-[130px] object-contain invert opacity-75 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Real Biological Knowledge Graph Scale Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#2e2c29] text-left">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-sans font-medium text-white tracking-tight">858M</div>
            <div className="text-xs font-mono text-neutral-400">Knowledge Graph Nodes</div>
            <div className="text-[11px] text-neutral-500">Across 241 biological edge types</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-sans font-medium text-white tracking-tight">2.2B</div>
            <div className="text-xs font-mono text-neutral-400">Relationship Edges</div>
            <div className="text-[11px] text-neutral-500">Ground-truth disease causality</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-sans font-medium text-white tracking-tight">16M+</div>
            <div className="text-xs font-mono text-neutral-400">Closed-Access Papers</div>
            <div className="text-[11px] text-neutral-500">8 years of publisher agreements</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-sans font-medium text-white tracking-tight">10x</div>
            <div className="text-xs font-mono text-neutral-400">Faster Preclinical Cycles</div>
            <div className="text-[11px] text-neutral-500">From hypothesis to wet-lab validation</div>
          </div>
        </div>

      </div>
    </section>
  );
}
