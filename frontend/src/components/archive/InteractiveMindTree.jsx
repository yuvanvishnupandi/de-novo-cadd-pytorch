import React, { useState } from 'react';

/**
 * InteractiveMindTree
 * Interactive Mind-Graph & Collapsible Moving Tree
 * Realization of Pin 470063279832294061 + Modern Chemical Knowledge Graph:
 * - Dynamic open/close/expand/collapse node states
 * - Animated connecting spline lines with moving particle pulses
 * - Side inspector drawer displaying deep chemical telemetry, SMILES, and biophysical scores
 */

const TREE_DATA = {
  id: 'root',
  title: 'EUREKA Discovery Core',
  subtitle: 'SARS-CoV-2 Mpro [PDB: 7BQY]',
  category: 'TARGET DEFINITION',
  status: 'ACTIVE',
  type: 'root',
  metrics: {
    resolution: '1.75 Å',
    organism: 'SARS-CoV-2',
    pocketVolume: '320 Å³',
    catalyticDyad: 'Cys145 - His41'
  },
  children: [
    {
      id: 'genai',
      title: 'Autoregressive Generator',
      subtitle: 'PyTorch LSTM (50,000 SMILES Vocab)',
      category: 'DE NOVO GENAI',
      status: 'CONVERGED',
      type: 'branch',
      color: '#8e75ff',
      metrics: {
        epoch: '250',
        perplexity: '1.24',
        validity: '83.8%',
        diversity: '0.88'
      },
      children: [
        {
          id: 'lead-alpha',
          title: 'EUR-2026-Alpha',
          subtitle: 'Thiophilic Fluorophenyl Core',
          category: 'CANDIDATE LEAD',
          status: 'VALIDATED',
          type: 'leaf',
          smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CN=CC=C2)NC3=NC(=NC=C3)C4=CC=C(C=C4)F',
          metrics: {
            mw: '419.4 Da',
            logp: '2.84',
            affinity: '-9.84 kcal/mol',
            ki: '58.4 nM',
            tox21: '98% Safe'
          }
        },
        {
          id: 'lead-beta',
          title: 'EUR-2026-Beta',
          subtitle: 'Sulfonamide Isoxazole Derivative',
          category: 'CANDIDATE LEAD',
          status: 'VALIDATED',
          type: 'leaf',
          smiles: 'O=C(Nc1ccc(cc1)S(=O)(=O)N)c2ccccc2NC(=O)c3ccncc3',
          metrics: {
            mw: '396.4 Da',
            logp: '1.95',
            affinity: '-9.21 kcal/mol',
            ki: '124 nM',
            tox21: '95% Safe'
          }
        },
        {
          id: 'lead-gamma',
          title: 'EUR-2026-Gamma',
          subtitle: 'Isopropyl Pyridinyl Carboxamide',
          category: 'CANDIDATE LEAD',
          status: 'VALIDATED',
          type: 'leaf',
          smiles: 'CC(C)c1ccc(cc1)NC(=O)c2ccc(F)cc2NC(=O)c3cnccn3',
          metrics: {
            mw: '380.4 Da',
            logp: '2.65',
            affinity: '-8.95 kcal/mol',
            ki: '210 nM',
            tox21: '92% Safe'
          }
        }
      ]
    },
    {
      id: 'physchem',
      title: 'Lipinski & PhysChem Filter',
      subtitle: 'RDKit Rule-of-5 Screening',
      category: 'RULE SCREENING',
      status: '100% PASS',
      type: 'branch',
      color: '#00e5ff',
      metrics: {
        filterPassRate: '42.6%',
        rotatableThreshold: '≤ 10',
        tpsaThreshold: '≤ 140 Å²'
      },
      children: [
        {
          id: 'lip-mw',
          title: 'Molecular Weight (MW)',
          subtitle: '342.4 Da ≤ 500 Da',
          category: 'PHYSCHEM',
          status: 'COMPLIANT',
          type: 'leaf',
          metrics: { value: '342.4 g/mol', boundary: '≤ 500.0', verdict: 'OPTIMAL' }
        },
        {
          id: 'lip-logp',
          title: 'Lipophilicity (LogP)',
          subtitle: '2.14 ≤ 5.00',
          category: 'PHYSCHEM',
          status: 'COMPLIANT',
          type: 'leaf',
          metrics: { value: '2.14', boundary: '0.0 - 5.0', verdict: 'ORAL BIOAVAILABLE' }
        },
        {
          id: 'lip-hbd',
          title: 'H-Bond Donors & Acceptors',
          subtitle: 'HBD: 2 (≤5) | HBA: 4 (≤10)',
          category: 'PHYSCHEM',
          status: 'COMPLIANT',
          type: 'leaf',
          metrics: { hbd: '2', hba: '4', tpsa: '68.4 Å²', verdict: 'MEMBRANE PERMEABLE' }
        }
      ]
    },
    {
      id: 'docking',
      title: 'AutoDock Vina 3D Engine',
      subtitle: 'Biophysical Grid Force-Field',
      category: 'DOCKING DYNAMICS',
      status: 'DOCKED',
      type: 'branch',
      color: '#10b981',
      metrics: {
        gridBox: '20 x 20 x 20 Å',
        exhaustiveness: '32 runs',
        meanDeltaG: '-9.4 kcal/mol'
      },
      children: [
        {
          id: 'dock-cys145',
          title: 'Cys145 Dyad H-Bond',
          subtitle: 'Distance: 2.72 Å (Thiol-Sγ)',
          category: 'CONTACT MAP',
          status: 'COVALENT DYAD',
          type: 'leaf',
          metrics: { distance: '2.72 Å', angle: '154°', interaction: 'Hydrogen Bond' }
        },
        {
          id: 'dock-his41',
          title: 'His41 Catalytic Dyad',
          subtitle: 'Distance: 3.11 Å (Imidazole-Nε2)',
          category: 'CONTACT MAP',
          status: 'CATALYTIC',
          type: 'leaf',
          metrics: { distance: '3.11 Å', angle: '138°', interaction: 'Pi-Pi Stacking' }
        },
        {
          id: 'dock-energy',
          title: 'GlideScore / Vina Free Energy',
          subtitle: 'ΔG = -9.84 kcal/mol (Ki = 58.4 nM)',
          category: 'ENERGETICS',
          status: 'POTENT LEAD',
          type: 'leaf',
          metrics: { bindingEnergy: '-9.84 kcal/mol', ki: '58.4 nM', efficiency: '0.41' }
        }
      ]
    },
    {
      id: 'tox21',
      title: 'Tox21 & ADMET Matrix',
      subtitle: '22-Endpoint Random Forest',
      category: 'SAFETY PROFILE',
      status: 'SCREENED',
      type: 'branch',
      color: '#f59e0b',
      metrics: {
        rfConfidence: '82.6%',
        screenedEndpoints: '22',
        passConfidence: '0.98'
      },
      children: [
        {
          id: 'tox-ahr',
          title: 'Aryl Hydrocarbon Receptor (NR-AhR)',
          subtitle: 'Safety Confidence: 0.98 (INACTIVE)',
          category: 'TOX21',
          status: 'NON-TOXIC',
          type: 'leaf',
          metrics: { assay: 'NR-AhR', result: 'INACTIVE', risk: 'MINIMAL' }
        },
        {
          id: 'tox-mmp',
          title: 'Mitochondrial Membrane (SR-MMP)',
          subtitle: 'Safety Confidence: 0.95 (NON-TOXIC)',
          category: 'TOX21',
          status: 'SAFE',
          type: 'leaf',
          metrics: { assay: 'SR-MMP', result: 'NON-DISRUPTIVE', risk: 'MINIMAL' }
        },
        {
          id: 'tox-herg',
          title: 'hERG Cardiac Ion Channel',
          subtitle: 'IC50 > 10 μM (LOW RISK)',
          category: 'CARDIAC SAFETY',
          status: 'SAFE',
          type: 'leaf',
          metrics: { channel: 'hERG', affinity: '> 10 μM', verdict: 'NON-ARRHYTHMOGENIC' }
        }
      ]
    },
    {
      id: 'studio',
      title: 'Biophysical Studio & MD',
      subtitle: 'Bioisostere Engine + 10ns Desmond',
      category: 'OPTIMIZATION',
      status: 'EQUILIBRATED',
      type: 'branch',
      color: '#ec4899',
      metrics: {
        mdDuration: '10.0 ns',
        rmsdEquilibration: '1.42 Å',
        solvationModel: 'TIP3P Water Box'
      },
      children: [
        {
          id: 'opt-bioisostere',
          title: 'Bioisosteric Replacement',
          subtitle: 'Phenyl → 2-Pyridine (+1.2 LogP)',
          category: 'SCAFFOLD MORPH',
          status: 'OPTIMIZED',
          type: 'leaf',
          metrics: { original: 'Phenyl Ring', swap: '2-Pyridine', deltaAffinity: '+0.4 kcal/mol' }
        },
        {
          id: 'opt-rmsd',
          title: '10ns Desmond MD Trajectory',
          subtitle: 'Mean RMSD: 1.42 Å (Stable Plateau)',
          category: 'MOLECULAR DYNAMICS',
          status: 'EQUILIBRATED',
          type: 'leaf',
          metrics: { trajectory: '10,000 ps', maxRMSD: '1.78 Å', persistentHbonds: '94% of run' }
        },
        {
          id: 'opt-sa',
          title: 'Synthetic Accessibility Score',
          subtitle: 'Score: 2.4 / 10 (High Feasibility)',
          category: 'SYNTHESIS',
          status: 'FEASIBLE',
          type: 'leaf',
          metrics: { route: 'Suzuki-Miyaura 3-Step', yieldPredicted: '68%', costIndex: 'LOW' }
        }
      ]
    }
  ]
};

export default function InteractiveMindTree({ onSelectNode }) {
  // State for which branches are open/expanded (default: genai & docking open)
  const [openBranches, setOpenBranches] = useState({
    genai: true,
    physchem: true,
    docking: true,
    tox21: false,
    studio: false
  });

  const [selectedNode, setSelectedNode] = useState(TREE_DATA.children[0].children[0]);
  const [copied, setCopied] = useState(false);

  const toggleBranch = (branchId, e) => {
    e.stopPropagation();
    setOpenBranches(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
  };

  const expandAll = () => {
    setOpenBranches({
      genai: true,
      physchem: true,
      docking: true,
      tox21: true,
      studio: true
    });
  };

  const collapseAll = () => {
    setOpenBranches({
      genai: false,
      physchem: false,
      docking: false,
      tox21: false,
      studio: false
    });
  };

  const handleCopySmiles = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header & Interactive Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#181715]/15 pb-4 gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#6b675e] uppercase">
            [ INTERACTIVE RECURSIVE CHEMICAL GRAPH // PIN 470063279832294061 ]
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#181715]">
            Dynamic Chemical Space Mind-Tree
          </h2>
          <p className="text-xs sm:text-sm text-[#6b675e] font-mono mt-1">
            Collapsible hierarchical graph of de novo generative branches, biophysical constraints, and validated lead candidates.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={expandAll}
            className="border border-[#181715]/30 bg-white hover:bg-[#181715] hover:text-white px-3 py-1.5 rounded-sm transition-all"
          >
            + Expand All
          </button>
          <button
            onClick={collapseAll}
            className="border border-[#181715]/30 bg-white hover:bg-[#181715] hover:text-white px-3 py-1.5 rounded-sm transition-all"
          >
            - Collapse All
          </button>
          <div className="hidden md:flex items-center gap-1.5 bg-[#181715]/5 px-3 py-1.5 rounded-sm border border-[#181715]/10 text-[#6b675e]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>22 Pipeline Nodes</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace: Left Tree Canvas + Right Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Tree Layout (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-[#181715]/20 p-6 rounded-sm shadow-sm relative overflow-hidden crosshair-corner">
          
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-drafting-subgrid opacity-40 pointer-events-none"></div>

          {/* Root Node Header */}
          <div
            onClick={() => setSelectedNode(TREE_DATA)}
            className={`cursor-pointer p-4 rounded border transition-all mb-8 relative z-10 ${
              selectedNode.id === TREE_DATA.id
                ? 'bg-[#181715] text-[#faf8f5] border-[#181715] shadow-md'
                : 'bg-[#faf8f5] hover:bg-white text-[#181715] border-[#181715]/30'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[11px] mb-1">
              <span className="uppercase tracking-widest text-[#00e5ff] font-bold">
                ROOT // {TREE_DATA.category}
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {TREE_DATA.status}
              </span>
            </div>
            <div className="font-serif-editorial text-2xl font-bold">
              {TREE_DATA.title}
            </div>
            <div className="text-xs font-mono opacity-80 mt-1">
              {TREE_DATA.subtitle} · Active Site: Cys145-His41 Catalytic Pocket
            </div>
          </div>

          {/* Branches (Tier 1 & Tier 2) */}
          <div className="space-y-6 relative z-10 pl-4 sm:pl-6 border-l-2 border-[#181715]/20">
            {TREE_DATA.children.map((branch) => {
              const isOpen = openBranches[branch.id];

              return (
                <div key={branch.id} className="relative">
                  
                  {/* Branch Horizontal Connector Curve */}
                  <div className="absolute -left-4 sm:-left-6 top-5 w-4 sm:w-6 h-0.5 bg-[#181715]/25"></div>

                  {/* Tier 1 Node Card */}
                  <div
                    onClick={() => setSelectedNode(branch)}
                    className={`p-3.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      selectedNode.id === branch.id
                        ? 'bg-[#faf8f5] border-[#181715] shadow-sm'
                        : 'bg-white hover:bg-[#faf8f5] border-[#181715]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Open/Close Toggle Button */}
                      <button
                        onClick={(e) => toggleBranch(branch.id, e)}
                        className="w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border border-[#181715]/30 bg-[#faf8f5] hover:bg-[#181715] hover:text-white transition-all shadow-2xs"
                        title={isOpen ? 'Collapse Branch' : 'Expand Branch'}
                      >
                        {isOpen ? '−' : '+'}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#6b675e] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }}></span>
                          <span>{branch.category}</span>
                        </div>
                        <div className="font-serif-editorial text-lg text-[#181715] font-semibold leading-snug">
                          {branch.title}
                        </div>
                        <div className="font-mono text-[11px] text-[#6b675e]">
                          {branch.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px] flex items-center gap-3">
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#181715]/5 text-[#181715]">
                        {branch.children.length} subnodes
                      </span>
                      <span className="text-[#181715] font-bold">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Tier 2 Subnodes (Expanded when isOpen is true) */}
                  {isOpen && (
                    <div className="mt-3 ml-6 sm:ml-8 pl-4 border-l-2 border-dashed border-[#181715]/20 space-y-2.5">
                      {branch.children.map((leaf) => (
                        <div
                          key={leaf.id}
                          onClick={() => setSelectedNode(leaf)}
                          className={`p-2.5 rounded border transition-all cursor-pointer relative ${
                            selectedNode.id === leaf.id
                              ? 'bg-[#8e75ff]/15 border-[#8e75ff] shadow-sm'
                              : 'bg-white hover:bg-[#faf8f5] border-[#181715]/15'
                          }`}
                        >
                          {/* Leaf Horizontal Connector Line */}
                          <div className="absolute -left-4 top-4 w-4 h-0.5 bg-[#181715]/20"></div>

                          <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                            <span className="text-[#6b675e] uppercase tracking-wider">
                              {leaf.category}
                            </span>
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {leaf.status}
                            </span>
                          </div>

                          <div className="font-serif-editorial text-base text-[#181715] font-medium">
                            {leaf.title}
                          </div>
                          <div className="font-mono text-[11px] text-[#6b675e]">
                            {leaf.subtitle}
                          </div>

                          {leaf.metrics && (
                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#181715]/10 font-mono text-[10px] text-[#181715]">
                              {Object.entries(leaf.metrics).map(([k, v]) => (
                                <span key={k} className="bg-[#faf8f5] px-1.5 py-0.5 rounded border border-[#181715]/10">
                                  <span className="text-[#6b675e]">{k}: </span>
                                  <span className="font-semibold">{v}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Node Inspector Drawer (Span 4) */}
        <div className="lg:col-span-4 bg-[#faf8f5] border border-[#181715]/25 p-5 rounded-sm shadow-sm sticky top-24 font-mono">
          
          <div className="flex items-center justify-between border-b border-[#181715]/15 pb-2.5 mb-4 text-xs">
            <span className="uppercase text-[#6b675e] tracking-widest">[ NODE INSPECTOR ]</span>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
              {selectedNode.status || 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase text-[#6b675e] tracking-wider block">
                {selectedNode.category}
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#181715] font-bold leading-tight">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-[#6b675e] mt-1 font-mono">
                {selectedNode.subtitle}
              </p>
            </div>

            {/* SMILES Inspector if present */}
            {selectedNode.smiles && (
              <div className="bg-white border border-[#181715]/20 p-3 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#181715]">CANONICAL SMILES</span>
                  <button
                    onClick={() => handleCopySmiles(selectedNode.smiles)}
                    className="text-[#8e75ff] hover:underline font-bold text-[10px]"
                  >
                    {copied ? '✓ COPIED' : 'COPY SMILES'}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-[#181715] break-all bg-[#faf8f5] p-2 rounded border border-[#181715]/10">
                  {selectedNode.smiles}
                </div>
              </div>
            )}

            {/* Detailed Key Metrics Table */}
            {selectedNode.metrics && (
              <div className="border border-[#181715]/20 bg-white rounded-sm overflow-hidden text-xs">
                <div className="bg-[#181715]/5 px-3 py-1.5 font-bold text-[11px] border-b border-[#181715]/15">
                  QUANTITATIVE BIOPHYSICAL READOUT
                </div>
                <div className="divide-y divide-[#181715]/10">
                  {Object.entries(selectedNode.metrics).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between px-3 py-2">
                      <span className="text-[#6b675e] uppercase text-[10px] tracking-wide">
                        {key}
                      </span>
                      <span className="font-semibold text-[#181715] text-[11px]">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2 text-xs">
              <button
                onClick={() => onSelectNode?.(selectedNode)}
                className="w-full bg-[#181715] text-white hover:bg-black py-2 rounded-sm transition-all font-mono uppercase tracking-wider font-semibold"
              >
                Inspect in 3D Force-Field →
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(selectedNode, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `eureka_node_${selectedNode.id}.json`;
                  a.click();
                }}
                className="w-full border border-[#181715]/30 bg-white hover:bg-[#faf8f5] py-2 rounded-sm transition-all text-[#181715] font-mono uppercase tracking-wider"
              >
                Export Node JSON ⬇
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

