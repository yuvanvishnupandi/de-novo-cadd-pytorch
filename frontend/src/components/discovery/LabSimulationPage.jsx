import React from 'react';
import Interactive3DLab from './Interactive3DLab';

/**
 * LabSimulationPage
 * Dedicated 3D Biophysics Laboratory Page
 * Features the dynamic 3D interactive WebGL/Canvas AutoDock Vina simulation
 * with full-screen capability, real-time mouse drag 3D rotation, and doctoral targets.
 */
export default function LabSimulationPage({ onNavigate }) {
  return (
    <div className="w-full min-h-screen bg-[#171615] text-[#f5f2ee] font-sans antialiased">
      {/* Sub-Header Breadcrumb */}
      <div className="w-full border-b border-[#2e2c29] bg-[#1a1918]/80 backdrop-blur px-6 sm:px-12 lg:px-16 py-3.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-400">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              EUREKA
            </button>
            <span>/</span>
            <span className="text-white">3D Biophysics Lab</span>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">AutoDock Vina v1.2.5</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-neutral-400">
            <span>Rigid Receptor · Flexible Ligand LGA</span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <button
              onClick={() => onNavigate('pipeline')}
              className="text-neutral-300 hover:text-white underline decoration-neutral-600 underline-offset-4 transition-colors cursor-pointer"
            >
              View Pipeline Workflow →
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Lab Simulation */}
      <div className="w-full">
        <Interactive3DLab />
      </div>

      {/* Cross-Page Action Banner */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 bg-[#141312] border-t border-[#2e2c29]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              NEXT COMPUTATIONAL STEP
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-normal text-white">
              De Novo Generative Pipeline &amp; Precision Genetics
            </h3>
            <p className="text-sm text-neutral-400 font-light max-w-xl">
              Inspect the 5-stage de novo lead discovery pipeline with macromolecular cryo-EM simulations, or simulate base editing loci in our genetics studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('pipeline')}
              className="px-5 py-2.5 rounded bg-white text-neutral-900 hover:bg-neutral-100 font-sans font-medium text-sm transition-all shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Pipeline Platform →
            </button>
            <button
              onClick={() => onNavigate('genetics')}
              className="px-5 py-2.5 rounded bg-[#242322] border border-[#363534] hover:border-neutral-500 text-neutral-300 hover:text-white font-sans font-medium text-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Genetics Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

