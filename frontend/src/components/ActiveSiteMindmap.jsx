import React, { useState } from 'react';

/**
 * ActiveSiteMindmap
 * Interactive Connected Dot & Pocket Mindmap Visualization:
 * - Live interactive amino acid nodes (Cys145, His41, Met165, Glu166, Gln189, Asn142)
 * - Animated particle pulses flowing along bond vectors
 * - Real-time energetic interaction readouts upon node hover/click
 */
export default function ActiveSiteMindmap({ pdbId = '7BQY', onInspectResidue }) {
  const [selectedResidue, setSelectedResidue] = useState('Cys145');

  const RESIDUES = [
    {
      id: 'Cys145',
      name: 'Cys145',
      role: 'Catalytic Dyad (Thiolate Nucleophile)',
      distance: '2.72 Å',
      interaction: 'Hydrogen Bond / Covalent Attack',
      energy: '-2.84 kcal/mol',
      x: 100,
      y: 75,
      color: '#00e5ff'
    },
    {
      id: 'His41',
      name: 'His41',
      role: 'Catalytic Dyad (General Base)',
      distance: '3.11 Å',
      interaction: 'Pi-Pi Stacking & Proton Transfer',
      energy: '-2.15 kcal/mol',
      x: 320,
      y: 80,
      color: '#8e75ff'
    },
    {
      id: 'Glu166',
      name: 'Glu166',
      role: 'S1 Subsite Anchor (Backbone H-Bond)',
      distance: '2.89 Å',
      interaction: 'Bidentate Hydrogen Bond',
      energy: '-1.92 kcal/mol',
      x: 350,
      y: 200,
      color: '#10b981'
    },
    {
      id: 'Met165',
      name: 'Met165',
      role: 'Hydrophobic S2 Pocket Roof',
      distance: '3.45 Å',
      interaction: 'Van der Waals Contact',
      energy: '-1.45 kcal/mol',
      x: 210,
      y: 240,
      color: '#f59e0b'
    },
    {
      id: 'Gln189',
      name: 'Gln189',
      role: 'S2 Flexible Entrance Loop',
      distance: '3.22 Å',
      interaction: 'Polar Amide Hydrogen Bond',
      energy: '-1.28 kcal/mol',
      x: 80,
      y: 210,
      color: '#ec4899'
    },
    {
      id: 'Asn142',
      name: 'Asn142',
      role: 'Oxyanion Hole Stabilizer',
      distance: '2.95 Å',
      interaction: 'Electrostatic Coordination',
      energy: '-1.60 kcal/mol',
      x: 140,
      y: 35,
      color: '#06b6d4'
    }
  ];

  const current = RESIDUES.find(r => r.id === selectedResidue) || RESIDUES[0];

  return (
    <div className="w-full bg-[#f6f3ed] border border-[#181715]/25 p-4 rounded-sm shadow-sm font-mono relative overflow-hidden">
      
      {/* Header telemetry strip */}
      <div className="flex items-center justify-between border-b border-[#181715]/15 pb-2 mb-3 text-[11px] text-[#6b675e]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-[#181715]">FIG 01.0 // ACTIVE SITE INTERACTION MIND-GRAPH</span>
        </div>
        <div className="bg-[#181715]/5 px-2 py-0.5 rounded border border-[#181715]/10">
          PDB: {pdbId} · ΔG: -9.84 kcal/mol
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-white/80 rounded border border-[#181715]/15 overflow-hidden">
        
        {/* Subtle coordinate crosshair */}
        <div className="absolute inset-0 bg-drafting-subgrid opacity-30 pointer-events-none"></div>

        <svg className="w-full h-full" viewBox="0 0 420 270" fill="none">
          
          {/* Active Site Pocket Cavity Outline */}
          <path
            d="M 40,90 Q 110,20 220,30 T 380,80 Q 400,180 340,230 T 120,250 Q 20,200 40,90 Z"
            stroke="#181715"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="rgba(24, 23, 21, 0.02)"
          />

          {/* Central Ligand Core (EUR-2026-Alpha) */}
          <g transform="translate(210, 135)">
            {/* Pulsing Aura */}
            <circle cx="0" cy="0" r="28" fill="rgba(142, 117, 255, 0.12)" className="animate-pulse" />
            <circle cx="0" cy="0" r="18" fill="#181715" />
            <text x="0" y="4" textAnchor="middle" fill="#faf8f5" fontSize="9" fontWeight="bold" fontFamily="IBM Plex Mono">
              LIGAND
            </text>
            <text x="0" y="-24" textAnchor="middle" fill="#181715" fontSize="8" fontWeight="600" fontFamily="IBM Plex Mono">
              EUR-2026-α
            </text>
          </g>

          {/* Vector connection lines between Central Ligand and Residues */}
          {RESIDUES.map((res) => {
            const isSelected = selectedResidue === res.id;

            return (
              <g key={res.id}>
                {/* Connection line */}
                <line
                  x1="210"
                  y1="135"
                  x2={res.x}
                  y2={res.y}
                  stroke={isSelected ? res.color : '#181715'}
                  strokeWidth={isSelected ? '2.5' : '1.2'}
                  strokeDasharray={isSelected ? 'none' : '3 3'}
                  opacity={isSelected ? 1 : 0.45}
                  className={isSelected ? 'transition-all duration-300' : ''}
                />

                {/* Animated Flow Dash when selected */}
                {isSelected && (
                  <line
                    x1="210"
                    y1="135"
                    x2={res.x}
                    y2={res.y}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-network-flow"
                  />
                )}

                {/* Distance Label Along Vector */}
                <text
                  x={(210 + res.x) / 2}
                  y={(135 + res.y) / 2 - 4}
                  textAnchor="middle"
                  fill={isSelected ? '#181715' : '#6b675e'}
                  fontSize="8"
                  fontFamily="IBM Plex Mono"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {res.distance}
                </text>

                {/* Interactive Residue Node */}
                <g
                  onClick={() => {
                    setSelectedResidue(res.id);
                    onInspectResidue?.(res);
                  }}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={res.x}
                    cy={res.y}
                    r={isSelected ? '12' : '8'}
                    fill={res.color}
                    stroke="#181715"
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all duration-200 group-hover:scale-125"
                  />
                  <text
                    x={res.x}
                    y={res.y + (res.y > 135 ? 20 : -14)}
                    textAnchor="middle"
                    fill="#181715"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="IBM Plex Mono"
                  >
                    {res.name}
                  </text>
                </g>
              </g>
            );
          })}

        </svg>

        {/* Floating Quick Instruction Tag */}
        <div className="absolute bottom-2 left-2 text-[9px] text-[#6b675e] bg-white/90 px-2 py-0.5 rounded border border-[#181715]/10">
          Click any residue node to inspect binding dyad energetics
        </div>
      </div>

      {/* Dynamic Inspector Detail Strip for Selected Residue */}
      <div className="mt-3 bg-white p-3 rounded border border-[#181715]/20 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#181715]/10 pb-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: current.color }}></span>
            <span className="font-bold text-[#181715]">{current.name}</span>
            <span className="text-[10px] text-[#6b675e]">({current.role})</span>
          </div>
          <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            ΔG: {current.energy}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#181715]">
          <div>
            <span className="text-[#6b675e] block text-[9px]">BOND DISTANCE</span>
            <span className="font-semibold">{current.distance}</span>
          </div>
          <div>
            <span className="text-[#6b675e] block text-[9px]">INTERACTION TYPE</span>
            <span className="font-semibold truncate block">{current.interaction}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#6b675e] block text-[9px]">FORCE-FIELD</span>
            <span className="font-semibold">AutoDock Vina AMBER</span>
          </div>
        </div>
      </div>

    </div>
  );
}

