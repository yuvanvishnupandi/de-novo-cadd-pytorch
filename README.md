<div align="center">

## denovo-cadd-pytorch

Implementation of an in-silico computational biophysics and generative molecular design pipeline in PyTorch and RDKit.

[![PyPI - Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![PyPI](https://img.shields.io/badge/pypi-v1.2.7-blue.svg)](https://pypi.org/project/denovo-cadd-pytorch/)
[![License](https://img.shields.io/badge/license-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![AutoDock Vina](https://img.shields.io/badge/docking-AutoDock_Vina_v1.2.7-22c55e.svg)](https://vina.scripps.edu/)
[![RDKit](https://img.shields.io/badge/cheminformatics-RDKit_WASM-f97316.svg)](https://www.rdkit.org/)
[![PyTorch](https://img.shields.io/badge/framework-PyTorch_2.x-ee4c2c.svg)](https://pytorch.org/)

</div>

## Install

```bash
$ pip install -r backend/requirements.txt
```

For the interactive WebGL 3D biophysics studio:

```bash
$ cd frontend && npm install
```

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             DE NOVO CADD COMPUTATIONAL PIPELINE                             │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 01: TARGET RECEPTOR PREPARATION                                                      │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ Inputs: PDB Crystal / FASTA Sequence │ Controls & Parameters:                               │
│ Engine: Biopython + ESMFold API      │ • Sequence length validator & UniProt resolver       │
│ Output: PDBQT Receptor + Grid Spec   │ • Geometric cavity detector -> Pocket Centroid [x,y,z]│
│                                      │ • Cubic Search Box: 22 x 22 x 22 Å (Grid spacing 0.375)│
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 02: GENERATIVE MOLECULAR CHEMISTRY                                                    │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ Architecture: PyTorch 2-layer LSTM   │ Controls & Parameters:                               │
│ Latent Space: 500k+ Drug Scaffolds   │ • Temperature Sampling: T = 0.8 (Creativity control) │
│ Output: Novel Chemical SMILES Strings│ • Strict syntax parser (Valence & aromaticity check) │
│                                      │ • SMILES Canonicalization & InChIKey identity hash   │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 03: CHEMINFORMATICS & DRUG-LIKENESS FILTERING                                         │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ Engine: RDKit WASM (v2026.09.2)      │ Controls & Parameters:                               │
│ Descriptors: MW, cLogP, TPSA, HBD/A  │ • Lipinski Rule of 5: MW ≤ 500, LogP ≤ 5, HBD ≤ 5   │
│ Structural Alerts: PAINS / Brenk     │ • Veber Filter: RotB ≤ 10, TPSA ≤ 140 Å²             │
│                                      │ • Screening Accounting: Passed / Rejected / Invalid  │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 04: BIOPHYSICAL MOLECULAR DOCKING                                                     │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ Force Field: AutoDock Vina v1.2.7    │ Controls & Parameters:                               │
│ Algorithm: Lamarckian GA + BFGS      │ • Exhaustiveness: 8 (Fast) | 16 (Standard) | 32 (Doc)│
│ Output: 3D Binding Poses + ΔG        │ • Grid Center: Active site coordinates [x, y, z]     │
│                                      │ • Scoring: Intermolecular vdW, H-Bonds, Electrostatic │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 05: POTENCY & MULTI-PARAMETER OPTIMIZATION (MPO)                                      │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ Potency Derivation: van 't Hoff      │ Controls & Parameters:                               │
│ Composite Score: Harrington-Derringer│ • Ki Derivation: Ki = exp(ΔG / RT) [nM / µM scaling] │
│ Accounting: 100% Deterministic       │ • MPO Desirability: D = (d_MW · d_cLogP · ...)^(1/6) │
│                                      │ • Candidate Ranking: Sorted by Composite Desirability│
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 06: INTERACTIVE 3D BIOPHYSICS STUDIO                                                  │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ WebGL Viewer: 3Dmol.js (Hardware Acc)│ Controls & Parameters:                               │
│ Framework: React 19 + Tailwind CSS   │ • Surface: Connolly Solvent Accessible Surface (SASA)│
│ Features: Live Bioisosteric Modifier │ • Render: Ribbon receptor + Stick ligand + Pocket    │
│                                      │ • Contact inspection: Directional H-bond distances   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure & Controls

```text
denovo-cadd-pytorch/
├── backend/                       # FastAPI computational biophysics daemon
│   ├── main.py                    # Master API server & pipeline route handlers
│   ├── pipeline_core.py           # Core CADD biophysical pipeline & RDKit bindings
│   ├── pipeline_manager.py        # Deterministic 11-stage pipeline orchestrator
│   ├── biophysics_forcefield.py   # Energy terms, dielectric constants & thermodynamics
│   ├── admet_pharmacokinetics.py  # ADMET rules engine & pharmacokinetic filters
│   └── external_tools/            # Official AutoDock Vina v1.2.7 executable & scripts
├── frontend/                      # React 19 + Vite + Tailwind CSS Web Studio
│   ├── src/                       # Component library & user interface
│   │   ├── components/discovery/  # Interactive 3D Lab, docking viewer & controls
│   │   │   ├── Interactive3DLab.jsx # WebGL 3D protein-ligand visualizer & telemetry
│   │   │   └── PlatformPipelinePage.jsx # Multi-stage pipeline run & candidate table
│   │   └── utils/                 # Client-side RDKit WASM & coordinate parsers
│   └── package.json               # Node 18+ configuration & dependencies
├── ai_models/                     # PyTorch LSTM generator weights & ML PKL graders
├── fasta_samples/                 # Benchmark FASTA sequences (Mpro, EGFR, HIV-1 RT)
├── data/ & data_pipelines/        # Preprocessed datasets, target PDBs & ingestion
├── scripts/                       # Deployment, environment setup & background runners
│   ├── start_backend.bat          # Windows batch launcher (Port 8000)
│   ├── run_backend.py             # Python daemon entrypoint
│   └── pipeline.bat               # Terminal CLI pipeline runner
└── requirements.txt               # Python package dependencies
```

## Usage

Evaluating chemical descriptors and Lipinski drug-likeness:

```python
from backend.pipeline_core import analyze_smiles_via_rdkit

# Calculate RDKit 2D/3D physicochemical descriptors
metrics = analyze_smiles_via_rdkit(
    "COC1=C(OCCCN2CCOCC2)C=C3C(=C1)N=CN=C3NC4=CC(=C(F)C=C4)Cl"
)

print(metrics["mw"])    # 446.9
print(metrics["clogp"]) # 3.12
print(metrics["tpsa"])  # 68.74
```

Thermodynamic molecular docking with AutoDock Vina:

```python
from backend.pipeline_core import run_docking_simulation

# Lamarckian Genetic Algorithm docking simulation
result = run_docking_simulation(
    pdb_id="4ZAU",      # EGFR Kinase Domain (T790M/C797S)
    smiles="COC1=C(OCCCN2CCOCC2)C=C3C(=C1)N=CN=C3NC4=CC(=C(F)C=C4)Cl",
    exhaustiveness=16
)

print(f"ΔG: {result['delta_g']} kcal/mol") # -10.94 kcal/mol
print(f"Ki: {result['ki_nm']} nM")         # 9.60 nM
```

Running the full de novo generation and multi-criteria pipeline:

```python
from backend.pipeline_manager import run_pipeline

# Generative LSTM sampling -> Filter -> AutoDock Vina
pipeline_output = run_pipeline(
    target_disease="lung_cancer",
    num_molecules=10,
    temperature=0.8
)

for mol in pipeline_output["top_candidates"]:
    print(mol["smiles"], mol["binding_affinity"], mol["mpo_score"])
```

## Biophysics & Scoring Formulation

AutoDock Vina evaluates the total predicted free energy of binding ($\Delta G$) through an empirical, physics-grounded scoring function:

$$\Delta G_{\text{binding}} = \Delta G_{\text{vdw}} \sum_{i,j} \left( \frac{A_{ij}}{r_{ij}^{12}} - \frac{B_{ij}}{r_{ij}^6} \right) + \Delta G_{\text{hbond}} \sum_{i,j} E(t) + \Delta G_{\text{elec}} \sum_{i,j} \frac{q_i q_j}{\varepsilon(r_{ij}) r_{ij}} + \Delta G_{\text{tor}} N_{\text{rot}} + \Delta G_{\text{desolv}}$$

Where:
- $\Delta G_{\text{vdw}}$ evaluates steric complementarity via 6-12 Lennard-Jones potentials.
- $\Delta G_{\text{hbond}}$ evaluates directional hydrogen bond geometry between donor-acceptor dyads.
- $\Delta G_{\text{elec}}$ computes Coulombic electrostatics with Gasteiger partial atomic charges at physiological pH 7.4.
- $\Delta G_{\text{tor}}$ penalizes conformational entropy loss proportional to the number of rotatable bonds $N_{\text{rot}}$.
- $\Delta G_{\text{desolv}}$ calculates the desolvation penalty of displacing pocket-bound solvent molecules.

The theoretical inhibition constant ($K_i$) is derived from runtime binding free energy ($\Delta G$) via the van 't Hoff relation:

$$K_i = \exp\left( \frac{\Delta G}{R \cdot T} \right)$$

where $R = 0.0019872\text{ kcal/(mol}\cdot\text{K)}$ and $T = 298.15\text{ K}$.

Multi-Parameter Optimization (MPO) calculates Harrington-Derringer composite desirability across candidate properties:

$$D = \left( d_{\text{MW}} \cdot d_{\text{cLogP}} \cdot d_{\text{TPSA}} \cdot d_{\text{HBD}} \cdot d_{\text{HBA}} \cdot d_{\Delta G} \right)^{1/6}$$

## Features

- **De Novo Molecular Generation** - Character-level LSTM conditioned on SMILES syntax for sampling novel drug-like chemical scaffolds.
- **Physics-Based Molecular Docking** - Official AutoDock Vina v1.2.7 integration performing Monte Carlo simulated annealing across crystallographic receptors.
- **Cheminformatics & ADMET** - Exact RDKit descriptors (MW, cLogP, TPSA, HBD, HBA, RotB) with PAINS and Brenk structural alert filters.
- **Multi-Parameter Optimization (MPO)** - Harrington-Derringer composite desirability scoring balancing potency, drug-likeness, and synthetic accessibility.
- **Interactive WebGL Studio** - Hardware-accelerated 3D protein-ligand viewer powered by React 19 and 3Dmol.js.

## Development

```bash
# 1. Start the FastAPI backend
$ python -m uvicorn backend.main:app --port 8000

# 2. Start the Vite React frontend
$ cd frontend && npm run dev
```

## Citations

```bibtex
@article{trott2010autodock,
    title   = {AutoDock Vina: improving the speed and accuracy of docking with a new scoring function, efficient optimization, and multithreading},
    author  = {Trott, Oleg and Olson, Arthur J},
    journal = {Journal of computational chemistry},
    volume  = {31},
    number  = {2},
    pages   = {455--461},
    year    = {2010}
}
```

```bibtex
@article{landrum2006rdkit,
    title   = {RDKit: Open-source cheminformatics software},
    author  = {Landrum, Greg},
    journal = {Online},
    year    = {2006}
}
```

## License

Apache License 2.0
