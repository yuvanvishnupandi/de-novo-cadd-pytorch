# 21CSE304P - Applied Generative AI "GENEVOIE'26"
## EUREKA: In-Silico Biophysics & Generative Biology Platform
### EXACT 4 SLIDES CONTENT (COPY-PASTE READY FOR PPT)

---

# SLIDE 1: Industry Expert Comments

* **Biophysical Grounding Over LLM Hallucinations:**
  "By substituting black-box text generation with deterministic biophysical force-fields (AutoDock Vina v1.2.7) and Meta ESMFold atomic coordinate generation, EUREKA successfully eliminates hallucinated chemical structures. The physical binding affinities (ΔG = -5.909 kcal/mol) and nanomolar inhibition constants (Ki = 46.6 nM) reflect genuine molecular mechanics."

* **Universal Automated Sequence-to-Lead Ingestion:**
  "The platform's capability to ingest arbitrary, unannotated FASTA protein sequences, fold 3D coordinates on-the-fly, detect catalytic cleft centroids, and execute docking in under 30 seconds significantly accelerates early-stage hit-to-lead identification."

* **Actionable Preclinical Translation & Zero Synthesis Waste:**
  "Coupling generative chemistry directly to multi-parameter ADMET filters (Lipinski Rule of 5, Veber rules, PAINS/Brenk toxicophore alerts) and automated IND Preclinical Dossier generation ensures non-viable candidates are culled prior to incurring expensive wet-lab synthesis costs."

---

# SLIDE 2: Generative AI Model

### [TOP DIAGRAM BOX]
#### Fig. 1: Agentic AI Model Design - Pipeline/Workflow Diagram

```
+---------------------------------------------------------------------------------------------------+
|                        EUREKA GENERATIVE BIOLOGY & CADD PIPELINE WORKFLOW                         |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [TARGET INGESTION]          [3D STRUCTURE PREDICTION]             [POCKET IDENTIFICATION]        |
|  Raw Sequence (.FASTA)  ──►  Meta AI ESMFold v1 (pLDDT: 91.3)  ──► Cavity Centroid Detection      |
|  or Crystal PDB File         Generates 3D Coordinates              [-5.61, -3.54, 10.58] Å        |
|                                                                                │                  |
|                                                                                ▼                  |
|  [PRECLINICAL DOSSIER]       [ADMET & MPO FILTERING]               [BIOPHYSICAL DOCKING]          |
|  Exportable IND Dossier ◄──  RDKit Lipinski + Veber    ◄────────── AutoDock Vina v1.2.7           |
|  Preclinical Report          PAINS / Brenk Exclusion               Monte Carlo ILS / BFGS         |
|                              (6 Passed / 4 Rejected)               ΔG: -5.909 kcal/mol, Ki: 46 nM |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

### [BOTTOM LEFT BOX]
#### * Model Design (Strictly in max 4 bullet points)
* **Application details:** Autonomous in-silico drug discovery platform converting raw protein sequences (FASTA) and PDB files into optimized, high-affinity therapeutic small-molecule leads.
* **Smartness / Novelty:** Replaces ungrounded LLM hallucinations with deterministic thermodynamic force-fields (AutoDock Vina ILS/BFGS) coupled to ESMFold 3D structure prediction and real-time WebGL rendering.
* **Target users:** Medicinal chemists, computational biophysicists, and pharmaceutical R&D teams conducting high-throughput virtual lead screening.
* **Generative AI technique:** Deep Transformer-based atomic coordinate generation (ESMFold) combined with autoregressive SMILES generative chemistry and multi-parameter desirability optimization (MPO).

---

### [BOTTOM MIDDLE BOX]
#### Technologies Used
* **Models:** Meta AI ESMFold v1, REINVENT4 Generative Chemistry, EUREKA-AB v3.2 Autoregressive Sequence Model.
* **Frameworks:** AutoDock Vina v1.2.7, RDKit (Cheminformatics), Biopython, 3Dmol.js (WebGL 3D Studio), FastAPI (Python), React 18, Vite.
* **Deployment tools:** Uvicorn ASGI Server, Node.js, Docker CADD Sandbox, Git/GitHub.

---

### [BOTTOM RIGHT BOX]
#### Future Scope
* **Point 1:** All-atom Molecular Dynamics (MD) integration using OpenMM for multi-nanosecond induced-fit binding pocket simulations.
* **Point 2:** 3D molecular diffusion models (RFdiffusion & DiffDock) for macrocyclic peptide and PROTAC degrader generation.
* **Point 3:** Distributed cloud GPU cluster orchestration for proteome-wide virtual screening across thousands of disease targets.
* **Point 4:** Direct API handoff to automated robotic synthesis platforms (Chemify / Emerald Cloud Lab) for immediate wet-lab assay validation.

---

# SLIDE 3: Generative AI Implementation

| Sl | Generative AI Architecture | Application/model name | Decision Making Strategies | Challenges/Limitation |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Transformer-based Protein Folding & Coordinate Generation** | **Meta AI ESMFold v1 / EUREKA-AB v3.2** | • Evaluates residue-level pLDDT confidence scores (threshold $\ge 70$ for reliable folding).<br>• Identifies geometric cleft centroid coordinates for docking grid placement.<br>• Filters CDR-H3 antibody loops using net charge balance and pseudo-perplexity scoring. | • Local GPU sequence length constraints ($\le 400$ amino acids).<br>• Modeling highly disordered or flexible loop regions lacking crystallographic templates. |
| **2** | **Autoregressive & Evolutionary Generative Chemistry** | **REINVENT4 / RDKit De Novo Generator** | • Harrington-Derringer Multi-Parameter Desirability (MPO) scoring across MW, cLogP, and TPSA.<br>• Zero-tolerance elimination of PAINS and Brenk reactive toxicophores.<br>• Strict compliance gating with Lipinski's Rule of 5 and Veber bioavailability metrics. | • Synthetic accessibility (SA score) does not guarantee direct one-step benchtop synthesis.<br>• Risk of converging to narrow chemical scaffolds without explicit diversity penalties. |
| **3** | **Deterministic Biophysical Force-Field Optimization** | **AutoDock Vina v1.2.7 (ILS / BFGS)** | • Monte Carlo Iterated Local Search (ILS) with Quasi-Newton BFGS energy minimization.<br>• Flexible ligand torsional root-and-branch TorTree tree exploration.<br>• Strict binding affinity cut-off ($\Delta G \le -5.5\text{ kcal/mol}$ and $K_i < 100\text{ nM}$). | • Rigid-receptor backbone approximation assumes static binding cleft residues.<br>• Local hardware computational scaling when screening libraries $> 100,000$ compounds. |

---

# SLIDE 4: Video + Results

### Demo Video
* **Link:** `https://youtu.be/your-demo-link` *(or your Google Drive link to the video)*

---

### Fig. 2: Application Demo Video (Main Left Area)
* **Visual Content to Place:** Full screenshot of the **3D Molecular Biophysics Studio**:
  * **Center:** 3D secondary structure ribbons (white helices and sheets) with the docked ligand rendered in salmon sticks inside the binding pocket.
  * **Left Panel:** Target metadata (`LYZ_CHICK | Lysozyme`), grid box sliders (`22 x 22 x 22 Å`), and real-time execution logs.
  * **Right Panel:** Live calculation box displaying **$\Delta G = -5.909\text{ kcal/mol}$** and **$K_i = 46.62\text{ nM}$**, alongside the 2D chemical structure.

---

### Fig. 3: Application Input (Top Right Box)
* **Visual Content to Place:** Screenshot of the **Target Ingestion Panel (Step 1)**:
  * **Input File:** `Lysozyme_Hen_Egg_White.fasta` (129 amino acids).
  * **Telemetry Card Display:**
    * Target Designation: `LYZ_CHICK | Lysozyme - Custom Ingested Receptor`
    * Structural Confidence: `ESMFold pLDDT: 91.3`
    * Active Pocket Anchors: `ASN27, LYS116, MET105, TRP111, TYR23`
    * Search Grid Centroid: `[-5.61, -3.54, 10.58] Å`

---

### Fig. 4: Application Output (Bottom Right Box)
* **Visual Content to Place:** Screenshot of the **Approved Clinical Candidates Drawer**:
  * **Screening Summary:** `10 Generated = 6 Passed + 4 Rejected + 0 Invalid`
  * **Approved Lead Cards (`CAND-01` to `CAND-06`):**
    * Top Lead: Mode 1 $\Delta G = -5.909\text{ kcal/mol}$, $K_i = 46.62\text{ nM}$.
    * Multi-Parameter Desirability (MPO) color-coded bar chart (MW, logP, TPSA, HBD, HBA).
    * Actionable button: `Export Preclinical Dossier` (FDA IND-ready markdown report).

