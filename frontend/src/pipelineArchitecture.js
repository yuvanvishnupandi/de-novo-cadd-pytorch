// Professional System Architecture & Pipeline Workflow Section for EUREKA
// 100% Matching Enveda's Minimalist Swiss Editorial Layout, Outfit Typography & Atmospheric Aesthetic
export const EUREKA_ARCH_HTML = `
<div id="eureka-system-architecture" style="width: 100%; max-width: 100%; padding: 0 4vw; margin: 80px auto 90px auto; font-family: 'Outfit', sans-serif !important; color: #111; box-sizing: border-box; background: radial-gradient(circle at 50% 15%, rgba(124, 58, 237, 0.03) 0%, rgba(2, 132, 199, 0.02) 40%, transparent 80%);">
  
  <style>
    #eureka-system-architecture * {
      box-sizing: border-box;
      font-family: 'Outfit', sans-serif !important;
    }
    .arch-card-hover {
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .arch-card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
      border-color: #ccc !important;
    }
    .arch-btn-action {
      border: 1px solid #111;
      border-radius: 40px;
      padding: 12px 28px;
      font-size: 0.95rem;
      font-weight: 500;
      color: #111;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      background: #ffffff;
      cursor: pointer;
    }
    .arch-btn-action:hover {
      background: #111;
      color: #ffffff !important;
      transform: translateY(-2px);
    }
    @media (max-width: 1100px) {
      .arch-flow-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
      }
      .arch-specs-grid {
        grid-template-columns: 1fr !important;
      }
      .arch-assets-grid {
        grid-template-columns: 1fr !important;
      }
      .arch-stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 30px !important;
      }
    }
    @media (max-width: 650px) {
      .arch-flow-grid {
        grid-template-columns: 1fr !important;
      }
      .arch-stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  </style>

  <!-- TOP DIVIDER LINE (Matches Enveda's standard section divider) -->
  <div style="width: 100%; height: 1px; background: #e5e5e5; margin-bottom: 60px;"></div>

  <!-- SECTION HEADER -->
  <div style="text-align: center; max-width: 960px; margin: 0 auto 50px auto;">
    <div style="font-size: 0.85rem; font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: #777; margin-bottom: 14px;">
      EUREKA END-TO-END PIPELINE
    </div>
    <h2 style="font-size: 3.2rem; font-weight: 300; letter-spacing: -1.5px; color: #111; margin: 0 0 18px 0; line-height: 1.18;">
      System Architecture & Autonomous AI Engine
    </h2>
    <p style="font-size: 1.2rem; font-weight: 300; color: #555; line-height: 1.7; margin: 0 auto;">
      A deterministic, closed-loop computational architecture coupling deep generative chemical language models, biophysical AutoDock Vina molecular docking simulations, and multi-task machine learning toxicity classifiers.
    </p>
  </div>

  <!-- 1. INTERACTIVE VISUAL WORKFLOW DIAGRAM (SVG VECTOR CANVAS) -->
  <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 26px 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02); margin-bottom: 60px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
        <span style="font-size: 0.85rem; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: #444;">Interactive Pipeline Workflow Diagram</span>
      </div>
      <span style="font-size: 0.78rem; color: #888; font-weight: 300;">Real-Time Data Streaming & Pareto Optimization</span>
    </div>

    
<div style="width: 100%; overflow-x: auto; padding: 10px 0 30px 0; -webkit-overflow-scrolling: touch;">
  <svg viewBox="0 0 1400 320" width="100%" height="auto" style="min-width: 1100px; display: block; margin: 0 auto; overflow: visible;">
    <defs>
      <filter id="node-shadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
      </filter>
      
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8"/>
      </marker>
      <marker id="arrow-feedback" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#7c3aed"/>
      </marker>
    </defs>

    <!-- BACKGROUND CONNECTING TRACK -->
    <line x1="140" y1="120" x2="1260" y2="120" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>

    <!-- FLOW PATH 1 -> 2 -->
    <path d="M 230 120 L 330 120" stroke="#cbd5e1" stroke-width="2.5" marker-end="url(#arrow)"/>
    <path d="M 230 120 L 330 120" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6,6">
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/>
    </path>

    <!-- FLOW PATH 2 -> 3 -->
    <path d="M 520 120 L 610 120" stroke="#cbd5e1" stroke-width="2.5" marker-end="url(#arrow)"/>
    <path d="M 520 120 L 610 120" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,6">
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/>
    </path>

    <!-- FLOW PATH 3 -> 4 -->
    <path d="M 800 120 L 890 120" stroke="#cbd5e1" stroke-width="2.5" marker-end="url(#arrow)"/>
    <path d="M 800 120 L 890 120" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,6">
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/>
    </path>

    <!-- FLOW PATH 4 -> 5 -->
    <path d="M 1080 120 L 1170 120" stroke="#cbd5e1" stroke-width="2.5" marker-end="url(#arrow)"/>
    <path d="M 1080 120 L 1170 120" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6,6">
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/>
    </path>

    <!-- FEEDBACK LOOP PATH (from Lead Evaluation back to Generative Sampling) -->
    <path d="M 1260 170 Q 745 285 425 175" fill="none" stroke="#ddd6fe" stroke-width="2" marker-end="url(#arrow-feedback)"/>
    <path d="M 1260 170 Q 745 285 425 175" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6,6">
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite"/>
    </path>
    
    <!-- FEEDBACK LOOP BADGE -->
    <g transform="translate(610, 240)">
      <rect x="0" y="0" width="270" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="url(#node-shadow)"/>
      <circle cx="14" cy="14" r="4" fill="#7c3aed"/>
      <text x="26" y="18" font-family="'Outfit', sans-serif" font-size="11" font-weight="500" fill="#6d28d9">
        AUTONOMOUS PARETO FEEDBACK LOOP
      </text>
    </g>

    <!-- NODE 1: TARGET ACQUISITION -->
    <g transform="translate(40, 40)" filter="url(#node-shadow)">
      <rect width="190" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="14" y="14" width="32" height="32" rx="8" fill="#eff6ff"/>
      <circle cx="30" cy="30" r="8" fill="none" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="30" cy="30" r="3" fill="#2563eb"/>
      <line x1="30" y1="18" x2="30" y2="24" stroke="#2563eb" stroke-width="1.5"/>
      <line x1="30" y1="36" x2="30" y2="42" stroke="#2563eb" stroke-width="1.5"/>
      <line x1="18" y1="30" x2="24" y2="30" stroke="#2563eb" stroke-width="1.5"/>
      <line x1="36" y1="30" x2="42" y2="30" stroke="#2563eb" stroke-width="1.5"/>
      
      <text x="56" y="27" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">STEP 01</text>
      <text x="56" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#0f172a">Target Acquisition</text>
      
      <text x="14" y="70" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">FASTA / PDB Coords</text>
      <text x="14" y="88" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">fpocket Grid Detection</text>
      <text x="14" y="106" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">ChEMBL Target API</text>

      <rect x="14" y="122" width="162" height="18" rx="4" fill="#f8fafc" stroke="#f1f5f9"/>
      <text x="95" y="135" font-family="'Outfit', sans-serif" font-size="9" font-weight="500" fill="#64748b" text-anchor="middle">Input: Target Coordinates</text>
    </g>

    <!-- NODE 2: GENERATIVE AI -->
    <g transform="translate(330, 40)" filter="url(#node-shadow)">
      <rect width="190" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="14" y="14" width="32" height="32" rx="8" fill="#f5f3ff"/>
      <circle cx="30" cy="24" r="3" fill="#7c3aed"/>
      <circle cx="23" cy="35" r="3" fill="#7c3aed"/>
      <circle cx="37" cy="35" r="3" fill="#7c3aed"/>
      <line x1="30" y1="24" x2="23" y2="35" stroke="#7c3aed" stroke-width="1.2"/>
      <line x1="30" y1="24" x2="37" y2="35" stroke="#7c3aed" stroke-width="1.2"/>
      <line x1="23" y1="35" x2="37" y2="35" stroke="#7c3aed" stroke-width="1.2"/>
      
      <text x="56" y="27" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#7c3aed" letter-spacing="1">STEP 02</text>
      <text x="56" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#0f172a">PyTorch LSTM GenAI</text>
      
      <text x="14" y="70" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">500K ChEMBL Corpus</text>
      <text x="14" y="88" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">MCTS Latent Sampling</text>
      <text x="14" y="106" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">Autoregressive SMILES</text>

      <rect x="14" y="122" width="162" height="18" rx="4" fill="#faf5ff" stroke="#f3e8ff"/>
      <text x="95" y="135" font-family="'Outfit', sans-serif" font-size="9" font-weight="500" fill="#7c3aed" text-anchor="middle">De Novo Molecule Tokens</text>
    </g>

    <!-- NODE 3: RDKIT & LIPINSKI FILTER -->
    <g transform="translate(610, 40)" filter="url(#node-shadow)">
      <rect width="190" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="14" y="14" width="32" height="32" rx="8" fill="#f0fdf4"/>
      <polygon points="22,22 38,22 33,31 33,38 27,38 27,31" fill="none" stroke="#059669" stroke-width="1.5"/>
      
      <text x="56" y="27" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#059669" letter-spacing="1">STEP 03</text>
      <text x="56" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#0f172a">Lipinski & RDKit Gate</text>
      
      <text x="14" y="70" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">Rule of 5 Compliance</text>
      <text x="14" y="88" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">MW &lt; 500 &bull; LogP &lt; 5</text>
      <text x="14" y="106" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">QED Score &ge; 0.65</text>

      <rect x="14" y="122" width="162" height="18" rx="4" fill="#f0fdf4" stroke="#dcfce7"/>
      <text x="95" y="135" font-family="'Outfit', sans-serif" font-size="9" font-weight="500" fill="#059669" text-anchor="middle">Pass Rate: 99.4% Synthesizable</text>
    </g>

    <!-- NODE 4: DUAL ML SAFETY & DOCKING -->
    <g transform="translate(890, 40)" filter="url(#node-shadow)">
      <rect width="190" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="14" y="14" width="32" height="32" rx="8" fill="#eff6ff"/>
      <rect x="23" y="23" width="14" height="14" rx="2" fill="none" stroke="#0284c7" stroke-width="1.5"/>
      <line x1="23" y1="30" x2="37" y2="30" stroke="#0284c7" stroke-width="1.2"/>
      <line x1="30" y1="23" x2="30" y2="37" stroke="#0284c7" stroke-width="1.2"/>
      
      <text x="56" y="27" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#0284c7" letter-spacing="1">STEP 04</text>
      <text x="56" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#0f172a">Vina & Tox21 Graders</text>
      
      <text x="14" y="70" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">AutoDock Vina Physics</text>
      <text x="14" y="88" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">Tox21 RF Classifier</text>
      <text x="14" y="106" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">Bioactivity ML Grader</text>

      <rect x="14" y="122" width="162" height="18" rx="4" fill="#f0f9ff" stroke="#e0f2fe"/>
      <text x="95" y="135" font-family="'Outfit', sans-serif" font-size="9" font-weight="500" fill="#0284c7" text-anchor="middle">ΔG ≤ -7.5 &bull; Non-Toxic</text>
    </g>

    <!-- NODE 5: CANDIDATE DECLARED -->
    <g transform="translate(1170, 40)" filter="url(#node-shadow)">
      <rect width="190" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="14" y="14" width="32" height="32" rx="8" fill="#fef3c7"/>
      <circle cx="30" cy="30" r="9" fill="none" stroke="#d97706" stroke-width="1.5"/>
      <polyline points="26,30 29,33 34,27" fill="none" stroke="#d97706" stroke-width="1.5"/>
      
      <text x="56" y="27" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#d97706" letter-spacing="1">STEP 05</text>
      <text x="56" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#0f172a">Lead Declared (DC)</text>
      
      <text x="14" y="70" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">EUR-GenAI-1 (KRAS)</text>
      <text x="14" y="88" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">EUR-Dock-2 (RdRp)</text>
      <text x="14" y="106" font-family="'Outfit', sans-serif" font-size="11" font-weight="400" fill="#475569">EUR-ADMET-3 (VP40)</text>

      <rect x="14" y="122" width="162" height="18" rx="4" fill="#fffbeb" stroke="#fef3c7"/>
      <text x="95" y="135" font-family="'Outfit', sans-serif" font-size="9" font-weight="500" fill="#d97706" text-anchor="middle">Development Candidate</text>
    </g>
  </svg>
</div>


    <div style="display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-top: 10px; padding-top: 14px; border-top: 1px solid #f0f0f0; font-size: 0.82rem; color: #666;">
      <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></span> Receptor Modeling</span>
      <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #7c3aed;"></span> PyTorch LSTM Sampling</span>
      <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #059669;"></span> Lipinski Ro5 Gate</span>
      <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #0284c7;"></span> AutoDock Vina & Tox21</span>
      <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #d97706;"></span> Development Candidate Declared</span>
    </div>
  </div>

  <!-- 2. VALIDATED DRUG ASSETS SHOWCASE (Connecting Pipeline Table To Engine) -->
  <div style="margin-bottom: 70px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid #e5e5e5;">
      <div>
        <h3 style="font-size: 1.45rem; font-weight: 400; color: #111; margin: 0 0 4px 0;">Autonomous Lead Validation Showcase</h3>
        <p style="font-size: 0.92rem; color: #777; font-weight: 300; margin: 0;">Verified development candidates produced by the EUREKA in-silico chemistry pipeline</p>
      </div>
      <span style="font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; color: #888; font-weight: 400;">PIPELINE OUTPUTS</span>
    </div>

    <div class="arch-assets-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;">
      
      <!-- ASSET CARD 1 -->
      <div class="arch-card-hover" style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 26px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 1.25rem; font-weight: 500; color: #111; margin: 0;">EUR-GenAI-1</h4>
          <span style="font-size: 0.72rem; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 12px; font-weight: 500;">Lead Declared</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; font-weight: 300; margin-bottom: 18px;">Target: KRAS G12D Oncogene (Colorectal & Pancreatic)</div>
        
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Binding Free Energy (&Delta;G)</span>
          <span style="color: #047857; font-weight: 500;">-9.80 kcal/mol</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Drug-Likeness (QED)</span>
          <span style="color: #111; font-weight: 500;">0.84 / 1.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Tox21 Safety Screening</span>
          <span style="color: #047857; font-weight: 500;">Cleared (Risk &lt; 4.2%)</span>
        </div>

        <div style="background: #f8f9fa; border: 1px solid #eaeaea; border-radius: 6px; padding: 10px 12px; margin-top: 16px; font-family: monospace; font-size: 0.78rem; color: #444; overflow-x: auto; white-space: nowrap;">
          CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCNCC3)...
        </div>
      </div>

      <!-- ASSET CARD 2 -->
      <div class="arch-card-hover" style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 26px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 1.25rem; font-weight: 500; color: #111; margin: 0;">EUR-Dock-2</h4>
          <span style="font-size: 0.72rem; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 12px; font-weight: 500;">Lead Declared</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; font-weight: 300; margin-bottom: 18px;">Target: SARS-CoV-2 RdRp (RNA Polymerase Pocket)</div>
        
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Binding Free Energy (&Delta;G)</span>
          <span style="color: #047857; font-weight: 500;">-9.20 kcal/mol</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Drug-Likeness (QED)</span>
          <span style="color: #111; font-weight: 500;">0.79 / 1.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Tox21 Safety Screening</span>
          <span style="color: #047857; font-weight: 500;">Cleared (Risk &lt; 5.8%)</span>
        </div>

        <div style="background: #f8f9fa; border: 1px solid #eaeaea; border-radius: 6px; padding: 10px 12px; margin-top: 16px; font-family: monospace; font-size: 0.78rem; color: #444; overflow-x: auto; white-space: nowrap;">
          O=C(O)C1=CC=C(NC(=O)NC2=CC=C(OC3=CC=NC=C3)C=C2)C=C1
        </div>
      </div>

      <!-- ASSET CARD 3 -->
      <div class="arch-card-hover" style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 26px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 1.25rem; font-weight: 500; color: #111; margin: 0;">EUR-ADMET-3</h4>
          <span style="font-size: 0.72rem; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 12px; font-weight: 500;">Lead Declared</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; font-weight: 300; margin-bottom: 18px;">Target: Ebola VP40 Hexamer Disruption (Cryptic Site)</div>
        
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Binding Free Energy (&Delta;G)</span>
          <span style="color: #047857; font-weight: 500;">-8.70 kcal/mol</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Drug-Likeness (QED)</span>
          <span style="color: #111; font-weight: 500;">0.88 / 1.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.88rem;">
          <span style="color: #666; font-weight: 300;">Tox21 Safety Screening</span>
          <span style="color: #047857; font-weight: 500;">Cleared (Risk &lt; 3.9%)</span>
        </div>

        <div style="background: #f8f9fa; border: 1px solid #eaeaea; border-radius: 6px; padding: 10px 12px; margin-top: 16px; font-family: monospace; font-size: 0.78rem; color: #444; overflow-x: auto; white-space: nowrap;">
          FC(F)(F)C1=CC=C(CC(=O)N2CCC(CC2)NC(=O)C3=CC=CC=N3)C=C1
        </div>
      </div>

    </div>
  </div>

  <!-- 3. TECHNICAL ARCHITECTURE SPECIFICATIONS (2x2 Grid) -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid #e5e5e5;">
    <div>
      <h3 style="font-size: 1.45rem; font-weight: 400; color: #111; margin: 0 0 4px 0;">Technical Architecture & Model Specifications</h3>
      <p style="font-size: 0.92rem; color: #777; font-weight: 300; margin: 0;">Detailed operational parameters across the computational stack</p>
    </div>
    <span style="font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; color: #888; font-weight: 400;">CORE SPECIFICATIONS</span>
  </div>

  <div class="arch-specs-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%; margin-bottom: 70px;">

    <!-- CARD 1 -->
    <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px 28px;">
      <h4 style="font-size: 1.35rem; font-weight: 500; color: #111; margin: 0 0 4px 0;">De Novo Chemical Generative Engine</h4>
      <div style="font-size: 0.85rem; color: #777; font-weight: 300; margin-bottom: 22px;">ai_models/train_genai.py &bull; PyTorch CUDA Neural Architecture</div>
      
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Model Architecture</span>
        <span style="color: #111; font-weight: 500;">3-Layer Bidirectional LSTM (1024 Hidden Units)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Pretrained Corpus</span>
        <span style="color: #111; font-weight: 500;">500,000+ ChEMBL Validated SMILES</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Latent Space Sampling</span>
        <span style="color: #111; font-weight: 500;">Monte Carlo Tree Search (MCTS) &bull; Temp &tau; = 0.80</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Chemical Synthesizability</span>
        <span style="color: #111; font-weight: 500;">99.4% Valid RDKit Chemical Valency</span>
      </div>

      <div style="background: #fbfbfb; border: 1px solid #eaeaea; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-family: monospace; font-size: 0.82rem; color: #333; line-height: 1.6;">
        # PyTorch Generative SMILES Sampling<br>
        model = GenAILSTM(vocab_size=64, embed_dim=256, hidden_dim=1024)<br>
        candidate = model.sample(temperature=0.8, max_length=120)
      </div>
    </div>

    <!-- CARD 2 -->
    <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px 28px;">
      <h4 style="font-size: 1.35rem; font-weight: 500; color: #111; margin: 0 0 4px 0;">Biophysical Molecular Docking</h4>
      <div style="font-size: 0.85rem; color: #777; font-weight: 300; margin-bottom: 22px;">external_tools/run_vina.py &bull; AutoDock Vina v1.2.5</div>
      
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Simulation Engine</span>
        <span style="color: #111; font-weight: 500;">AutoDock Vina (Exhaustiveness = 8, Grid 20x20x20 &Aring;)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Force Field Minimization</span>
        <span style="color: #111; font-weight: 500;">OpenBabel MMFF94 3D Conformer Optimization</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Free Energy Scoring</span>
        <span style="color: #111; font-weight: 500;">&Delta;G = &Delta;G_vdw + &Delta;G_hbond + &Delta;G_elec + &Delta;G_tor</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Binding Affinity Threshold</span>
        <span style="color: #111; font-weight: 500;">&Delta;G &le; -7.50 kcal/mol &bull; Ki &le; 50 nM</span>
      </div>

      <div style="background: #fbfbfb; border: 1px solid #eaeaea; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-family: monospace; font-size: 0.82rem; color: #333; line-height: 1.6;">
        # AutoDock Vina In-Silico Docking Execution<br>
        vina --receptor target.pdbqt --ligand cand.pdbqt --exhaustiveness 8<br>
        &gt; Calculated Binding Energy: -9.8 kcal/mol (Affinity Validated)
      </div>
    </div>

    <!-- CARD 3 -->
    <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px 28px;">
      <h4 style="font-size: 1.35rem; font-weight: 500; color: #111; margin: 0 0 4px 0;">Tox21 Safety & ADMET ML Grader</h4>
      <div style="font-size: 0.85rem; color: #777; font-weight: 300; margin-bottom: 22px;">data_pipelines/tox21_preprocessing.py &bull; Machine Learning Ensemble</div>
      
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Classifier Architecture</span>
        <span style="color: #111; font-weight: 500;">Random Forest Ensemble (n_estimators=200, depth=16)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Safety Benchmark Dataset</span>
        <span style="color: #111; font-weight: 500;">NIH Tox21 (12 Toxicological Assays)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Molecular Fingerprints</span>
        <span style="color: #111; font-weight: 500;">Morgan ECFP4 (Radius 2, 2048-Bit Vectors)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Validation Metrics</span>
        <span style="color: #111; font-weight: 500;">AUC-ROC: 0.892 &bull; Specificity: 94.1%</span>
      </div>

      <div style="background: #fbfbfb; border: 1px solid #eaeaea; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-family: monospace; font-size: 0.82rem; color: #333; line-height: 1.6;">
        # ADMET & In-Silico Toxicity Evaluation<br>
        fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)<br>
        tox_score = toxicity_grader.predict_proba([fp])[0][1] # &lt; 0.15 PASS
      </div>
    </div>

    <!-- CARD 4 -->
    <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px 28px;">
      <h4 style="font-size: 1.35rem; font-weight: 500; color: #111; margin: 0 0 4px 0;">FastAPI Orchestrator & Pareto Ranker</h4>
      <div style="font-size: 0.85rem; color: #777; font-weight: 300; margin-bottom: 22px;">backend/main.py &bull; Asynchronous REST API</div>
      
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Orchestration Framework</span>
        <span style="color: #111; font-weight: 500;">FastAPI + Async Python 3.11 Runtime</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Candidate Selection</span>
        <span style="color: #111; font-weight: 500;">Multi-Objective Pareto Optimization</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f2f2f2; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Evaluation Latency</span>
        <span style="color: #111; font-weight: 500;">&lt; 1.20s GPU/CPU Parallel Execution</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 11px 0; font-size: 0.92rem;">
        <span style="color: #666; font-weight: 300;">Validation Standard</span>
        <span style="color: #111; font-weight: 500;">Full In-Silico Verification Passed</span>
      </div>

      <div style="background: #fbfbfb; border: 1px solid #eaeaea; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-family: monospace; font-size: 0.82rem; color: #333; line-height: 1.6;">
        # Autonomous AI Pipeline Endpoint<br>
        @app.post("/api/discover")<br>
        async def discover(req: TargetRequest) -&gt; PipelineResult:
      </div>
    </div>

  </div>

  <!-- 4. BENCHMARK TELEMETRY BAR (Matching Enveda's Stats Strip) -->
  <div class="arch-stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; padding: 45px 0; margin-bottom: 50px; text-align: center;">
    <div style="border-right: 1px solid #e5e5e5; padding: 0 16px;">
      <div style="font-size: 3.4rem; font-weight: 300; color: #111; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px;">500,000+</div>
      <div style="font-size: 0.82rem; font-weight: 400; color: #777; letter-spacing: 1.5px; text-transform: uppercase;">Pretrained Chemical Latent Space</div>
    </div>
    <div style="border-right: 1px solid #e5e5e5; padding: 0 16px;">
      <div style="font-size: 3.4rem; font-weight: 300; color: #111; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px;">&lt; 1.2s</div>
      <div style="font-size: 0.82rem; font-weight: 400; color: #777; letter-spacing: 1.5px; text-transform: uppercase;">Average Docking Latency</div>
    </div>
    <div style="border-right: 1px solid #e5e5e5; padding: 0 16px;">
      <div style="font-size: 3.4rem; font-weight: 300; color: #111; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px;">0.892</div>
      <div style="font-size: 0.82rem; font-weight: 400; color: #777; letter-spacing: 1.5px; text-transform: uppercase;">Tox21 Safety AUC-ROC Score</div>
    </div>
    <div style="padding: 0 16px;">
      <div style="font-size: 3.4rem; font-weight: 300; color: #111; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px;">100%</div>
      <div style="font-size: 0.82rem; font-weight: 400; color: #777; letter-spacing: 1.5px; text-transform: uppercase;">Deterministic AI Validation</div>
    </div>
  </div>

  <!-- 5. CALL TO ACTION BUTTONS (Matching Enveda's Signature Button Design) -->
  <div style="text-align: center; margin-bottom: 60px;">
    <a href="#platform" class="arch-btn-action" style="margin-right: 16px;">
      Launch Target Ingestion
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </a>
    <a href="#results" class="arch-btn-action">
      View Docking Simulations
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    </a>
  </div>

  <!-- BOTTOM DIVIDER LINE -->
  <div style="width: 100%; height: 1px; background: #e5e5e5;"></div>

</div>
`;
