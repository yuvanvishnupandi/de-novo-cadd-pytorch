import React, { useMemo } from 'react';
import { computeBackboneDihedrals } from '../../utils/ramachandranCalculator';

/**
 * RamachandranPlotModal
 * Interactive Backbone Dihedral Angle (Phi/Psi) Distribution Plot
 * Demonstrates crystallographic structural quality and secondary structure distributions
 * based on Ramachandran, Ramakrishnan, and Sasisekharan (1963).
 */
export default function RamachandranPlotModal({ isOpen, onClose, targetName, residues = [] }) {
  if (!isOpen) return null;

  // Transform residues to dihedral coordinates
  const dihedralData = useMemo(() => {
    return computeBackboneDihedrals(residues);
  }, [residues]);

  // Statistics
  const stats = useMemo(() => {
    const total = dihedralData.filter(d => d.phi !== null && d.psi !== null).length;
    if (total === 0) return { total: 0, favored: 0, allowed: 0, disallowed: 0, favoredPct: 0 };

    let favored = 0;
    let allowed = 0;
    let disallowed = 0;

    for (const d of dihedralData) {
      if (d.phi === null || d.psi === null) continue;
      if (d.region === 'alpha_core' || d.region === 'beta_core' || d.region === 'left_helix') {
        favored++;
      } else if (d.region === 'allowed') {
        allowed++;
      } else {
        disallowed++;
      }
    }

    return {
      total,
      favored,
      allowed,
      disallowed,
      favoredPct: Number(((favored / total) * 100).toFixed(1)),
      allowedPct: Number(((allowed / total) * 100).toFixed(1)),
      disallowedPct: Number(((disallowed / total) * 100).toFixed(1))
    };
  }, [dihedralData]);

  // SVG coordinate transformation (-180 to +180 -> 0 to 360)
  const mapCoord = (val) => ((val + 180) / 360) * 320;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1918] border border-neutral-700 rounded-xl p-6 text-neutral-200 shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Ramachandran Backbone Dihedral Distribution (φ/ψ)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-base px-2 py-1 rounded hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 mb-4">
          Target: <span className="text-emerald-400 font-bold">{targetName || 'Protein Structure'}</span> | 
          Validated Residues: <span className="text-white">{stats.total}</span> | 
          Favored Core Regions: <span className="text-emerald-400 font-bold">{stats.favoredPct}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* SVG Plot */}
          <div className="md:col-span-2 flex justify-center bg-[#121110] p-4 rounded-xl border border-neutral-800">
            <svg viewBox="0 0 320 320" className="w-72 h-72 select-none border border-neutral-700 bg-[#0d0c0c]">
              {/* Axes */}
              <line x1="160" y1="0" x2="160" y2="320" stroke="#333" strokeDasharray="2 2" />
              <line x1="0" y1="160" x2="320" y2="160" stroke="#333" strokeDasharray="2 2" />

              {/* Favored Beta-Sheet Region (Top-Left) */}
              <rect x={mapCoord(-160)} y={320 - mapCoord(170)} width={mapCoord(-100) - mapCoord(-160)} height={mapCoord(170) - mapCoord(110)} fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="0.5" />
              <text x={mapCoord(-130)} y={320 - mapCoord(140)} fill="#10b981" fontSize="9" textAnchor="middle">β-sheet</text>

              {/* Favored Alpha-Helix Region (Bottom-Left) */}
              <rect x={mapCoord(-90)} y={320 - mapCoord(-20)} width={mapCoord(-40) - mapCoord(-90)} height={mapCoord(-20) - mapCoord(-70)} fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="0.5" />
              <text x={mapCoord(-65)} y={320 - mapCoord(-45)} fill="#3b82f6" fontSize="9" textAnchor="middle">α-helix</text>

              {/* Left-handed Helix Region (Top-Right) */}
              <rect x={mapCoord(40)} y={320 - mapCoord(60)} width={mapCoord(80) - mapCoord(40)} height={mapCoord(60) - mapCoord(20)} fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="0.5" />
              <text x={mapCoord(60)} y={320 - mapCoord(40)} fill="#8b5cf6" fontSize="8" textAnchor="middle">Left α</text>

              {/* Residue Dihedral Points */}
              {dihedralData.map((d, idx) => {
                if (d.phi === null || d.psi === null) return null;
                const cx = mapCoord(d.phi);
                const cy = 320 - mapCoord(d.psi);
                let ptColor = '#f59e0b';
                if (d.region === 'alpha_core') ptColor = '#3b82f6';
                else if (d.region === 'beta_core') ptColor = '#10b981';
                else if (d.region === 'left_helix') ptColor = '#8b5cf6';
                else if (d.region === 'disallowed') ptColor = '#ef4444';

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill={ptColor}
                    opacity="0.8"
                  >
                    <title>{`${d.resName}${d.resNum}: φ=${d.phi}°, ψ=${d.psi}° (${d.region})`}</title>
                  </circle>
                );
              })}

              {/* Axis Labels */}
              <text x="160" y="315" fill="#666" fontSize="8" textAnchor="middle">φ (Phi, -180° to +180°)</text>
              <text x="5" y="160" fill="#666" fontSize="8" textAnchor="start" transform="rotate(-90 10,160)">ψ (Psi, -180° to +180°)</text>
            </svg>
          </div>

          {/* Quality Metrics */}
          <div className="space-y-3 bg-[#121110] p-4 rounded-xl border border-neutral-800">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
              Structure Quality Summary
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-semibold">Favored Core:</span>
                <span className="text-white font-bold">{stats.favored} ({stats.favoredPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-semibold">Allowed Regions:</span>
                <span className="text-white font-bold">{stats.allowed} ({stats.allowedPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-rose-400 font-semibold">Steric Outliers:</span>
                <span className="text-white font-bold">{stats.disallowed} ({stats.disallowedPct}%)</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 pt-3 border-t border-neutral-800 leading-relaxed">
              Based on empirical steric clash limits of Ramachandran et al. (1963). High-resolution crystallographic targets typically exhibit &gt; 90% in favored core regions.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-1.5 rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

