<div align="center">

## denovo-cadd-pytorch

Implementation of an in-silico computational biophysics and generative molecular design pipeline in PyTorch and RDKit.

[![PyPI - Version](https://img.shields.io/badge/pypi-v1.2.7-blue.svg)](https://pypi.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![AutoDock Vina](https://img.shields.io/badge/Docking-AutoDock_Vina_v1.2.7-brightgreen.svg)](https://vina.scripps.edu/)
[![RDKit](https://img.shields.io/badge/Cheminformatics-RDKit_WASM-orange.svg)](https://www.rdkit.org/)

<br/>

<img src="./assets/pipeline.png" width="92%" alt="Pipeline Architecture" />

</div>

## Install

```bash
$ pip install -r backend/requirements.txt
```

For the interactive WebGL 3D biophysics studio:

```bash
$ cd frontend && npm install
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
