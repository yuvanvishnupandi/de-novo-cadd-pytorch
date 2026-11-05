# EUREKA: Precision Base-Editing & Locus Engineering Specifications

This document defines the genomic locus engineering parameters and cutting-free base editing modalities integrated into EUREKA.

---

## 1. Validated Target Loci

| Locus | Target Gene | Clinical Indication | Editor Modality | Protospacer Window | On-Target Efficiency | CFD Off-Target Score |
|---|---|---|---|---|---|---|
| **1p32.3 · Exon 1** | PCSK9 | Hypercholesterolemia | Adenine Base Editor (ABE8e) | Positions 4 – 8 (PAM: NGG) | 83.6% | <0.01% (CFD = 0.002) |
| **3p21.31 · Δ32** | CCR5 | HIV-1 Entry Resistance | Dual Cas9 Nickase + PEmax | 32-bp deletion (PAM: NGG) | 81.4% | 0.00% (Zero Indels) |
| **2p16.1 · Enhancer +58** | BCL11A | Sickle Cell / β-Thalassemia | CRISPR-Cas12a (Cpf1) | GATA1 motif (PAM: TTTV) | 84.2% | <0.04% (CIRC-seq) |
| **18q12.1** | TTR | ATTR Amyloidosis | Cytosine Base Editor (hA3A-CBE) | Positions 3 – 9 (PAM: NGG) | 83.1% | <0.02% (Target-Seq) |

---

## 2. Specificity Metric Formulations

Cutting-Frequency Determination (CFD) off-target scores are evaluated across the genome:

$$CFD = \prod_{i=1}^{20} M(i, \text{mismatch}) \times P(\text{PAM})$$

Where $M(i, \text{mismatch})$ represents position-weighted mismatch penalties and $P(\text{PAM})$ represents non-canonical PAM tolerance weights.

