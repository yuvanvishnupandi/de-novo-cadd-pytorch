"""
EUREKA: Ligand Efficiency (LE), LLE, BEI, and Physicochemical Metric Suite
Calculates structural efficiency indexes: Ligand Efficiency (LE), Lipophilic Ligand
Efficiency (LLE), Binding Efficiency Index (BEI), Surface Efficiency Index (SEI),
and Fit Quality (FQ) to prevent molecular obesity during lead optimization.

Strictly Computational Medicinal Chemistry. Zero Agentic AI.
"""

import math
from typing import Dict, Any, Optional


class LigandEfficiencyCalculator:
    """
    Computes standard medicinal chemistry efficiency indexes:
    - LE = -delta_G / N_heavy
    - LLE = pKi - cLogP
    - BEI = pKi / (MW / 1000)
    - SEI = pKi / (TPSA / 100)
    - FQ = LE / LE_scale
    """

    @staticmethod
    def compute_all_metrics(delta_g_kcal_mol: float,
                            heavy_atom_count: int,
                            molecular_weight: float,
                            logp: float,
                            tpsa: float) -> Dict[str, Any]:
        """
        Computes all standard efficiency metrics for candidate small molecule.
        """
        rt = 0.5925
        ki_molar = math.exp(delta_g_kcal_mol / rt)
        pki = -math.log10(max(1e-14, ki_molar))
        pki = round(pki, 2)

        # 1. Ligand Efficiency (LE): kcal/(mol * heavy_atom)
        le = round(-delta_g_kcal_mol / max(1, heavy_atom_count), 3)

        # 2. Lipophilic Ligand Efficiency (LLE)
        lle = round(pki - logp, 2)

        # 3. Binding Efficiency Index (BEI)
        bei = round(pki / max(0.1, molecular_weight / 1000.0), 2)

        # 4. Surface Efficiency Index (SEI)
        sei = round(pki / max(0.1, tpsa / 100.0), 2)

        # 5. Fit Quality (FQ) vs Hopkins maximal LE scaling
        # LE_scale = 0.072 + 8.98 / N_heavy
        le_scale = 0.072 + 8.98 / max(1, heavy_atom_count)
        fq = round(le / le_scale, 2)

        return {
            "pKi": pki,
            "ligand_efficiency_le": le,
            "le_threshold_status": "Acceptable (LE >= 0.30)" if le >= 0.30 else "Sub-Optimal LE (< 0.30)",
            "lipophilic_ligand_efficiency_lle": lle,
            "lle_threshold_status": "Optimal (LLE >= 5.0)" if lle >= 5.0 else "Lipophilic Liability (LLE < 5.0)",
            "binding_efficiency_index_bei": bei,
            "surface_efficiency_index_sei": sei,
            "fit_quality_fq": fq,
            "fq_assessment": "High Thermodynamic Optimization (FQ >= 0.85)" if fq >= 0.85 else "Room for Optimization"
        }

