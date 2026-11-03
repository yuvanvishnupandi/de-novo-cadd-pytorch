import React from 'react';

export default function BenchSciFooter({ onNavigate }) {
  const handleNav = (e, sectionId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="flex w-full flex-col items-center justify-end bg-[#171615] border-t border-[#2e2c29] text-[#a1a1a1]">
      <div className="mx-auto flex w-full max-w-[var(--page-max)] flex-col px-[var(--page-gutter-mobile)] md:px-8 py-14">
        <div className="flex w-full flex-col items-start gap-10 md:grid md:grid-cols-4 md:gap-8">
          {/* Brand Col */}
          <div className="flex flex-col items-start justify-start gap-4">
            <div className="flex items-center gap-3">
              <img
                alt="BenchSci"
                loading="lazy"
                width="148"
                height="20"
                className="h-5 w-auto invert brightness-200"
                src="/images/footer-logo.svg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/nav-logo.svg';
                }}
              />
            </div>
            <p className="max-w-[300px] text-[14px] leading-relaxed text-[#8a8782]">
              The integrated generative biology &amp; in-silico pharmacology workbench uniting structure prediction, force fields, and literature evidence.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-emerald-400">
                Core Physics Engines Online (Vina &amp; AF3)
              </span>
            </div>
          </div>

          {/* Directory Link Columns (All internal links - NO external redirects) */}
          <div className="col-start-3 col-span-2 grid w-full grid-cols-2 sm:grid-cols-3 gap-6 md:flex md:items-start md:gap-8">
            <ul className="flex flex-1 flex-col gap-2.5 border-l border-[#2e2c29] pl-4">
              <li className="font-mono text-[11px] uppercase tracking-wider text-[#d4d4d4] font-semibold mb-1">
                Platform
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  Interactive 3D Lab
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'top-platforms')}
                >
                  Top 8 AI Platforms
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'product-overview')}
                >
                  Evidence Graph
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'features')}
                >
                  Foundation Models
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'stats')}
                >
                  Industry Benchmarks
                </a>
              </li>
            </ul>

            <ul className="flex flex-1 flex-col gap-2.5 border-l border-[#2e2c29] pl-4">
              <li className="font-mono text-[11px] uppercase tracking-wider text-[#d4d4d4] font-semibold mb-1">
                Discovery Workflows
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  De Novo Generation
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  AutoDock Vina Docking
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  Retrosynthesis Routes
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  Tox21 Safety Screening
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  Antibody Maturation
                </a>
              </li>
            </ul>

            <ul className="flex flex-1 flex-col gap-2.5 border-l border-[#2e2c29] pl-4">
              <li className="font-mono text-[11px] uppercase tracking-wider text-[#d4d4d4] font-semibold mb-1">
                Data &amp; Specs
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'top-platforms')}
                >
                  ChEMBL 33 Standards
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'top-platforms')}
                >
                  PDB 3D Coordinates
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'top-platforms')}
                >
                  PubChem BioAssays
                </a>
              </li>
              <li className="font-mono text-[12px] leading-[20px]">
                <a
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => handleNav(e, 'interactive-lab')}
                >
                  Export SDF &amp; JSON
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex w-full flex-col gap-6 pt-16 sm:flex-row sm:items-center sm:justify-between border-t border-[#2e2c29] mt-12">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] leading-[20px] text-[#737373]">
            <p className="text-[#a1a1a1]">BenchSci © 2026. All rights reserved.</p>
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Standards
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of In-Silico Use
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              HIPAA &amp; SOC2 Type II Certified
            </span>
          </div>

          {/* Theme display badge matching BenchSci exact theme widget */}
          <div className="relative inline-flex items-center gap-1 rounded bg-[#242322] border border-[#363534] p-1">
            <button
              type="button"
              aria-label="System Dark Theme"
              className="flex h-7 px-2.5 items-center justify-center rounded bg-[#171615] text-xs font-mono text-emerald-400 gap-1.5 shadow-sm"
            >
              <img
                alt=""
                width="14"
                height="14"
                className="invert"
                src="/images/footer-icon-moon.svg"
              />
              <span>DARK (OBSIDIAN)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

