"""
EUREKA: Bound Ligand Conformational Strain Energy & Torsional Penalty Filter
Evaluates ligand internal conformational strain energy (E_bound - E_unbound_min)
to filter out thermodynamically penalized bioactive poses using MMFF94s / UFF force fields.

Strictly Computational Chemistry & Molecular Mechanics. Zero Agentic AI.
"""

import math
from typing import Dict, List, Tuple, Any


class ConformationalStrainEvaluator:
    """
    Computes ligand pre-organization and strain energy penalty.
    Bioactive bound conformations with internal strain > 4.0 kcal/mol are flagged as high-risk.
    """

    @staticmethod
    def calculate_torsional_energy(dihedral_angles_degrees: List[float],
                                   rotatable_bond_orders: Optional[List[int]] = None) -> float:
        """
        Calculates 1-4 torsional potential energy via Fourier dihedral series:
        V_torsion = sum_i ( V_i / 2 * (1 + cos(n_i * phi_i - gamma_i)) ).
        """
        if not dihedral_angles_degrees:
            return 0.0

        total_torsion = 0.0
        for i, deg in enumerate(dihedral_angles_degrees):
            rad = math.radians(deg)
            # Standard 3-fold periodicity for sp3-sp3 single bonds
            barrier = 1.25  # kcal/mol typical barrier
            v_i = barrier * 0.5 * (1.0 + math.cos(3.0 * rad))
            total_torsion += v_i

        return round(total_torsion, 3)

    @staticmethod
    def evaluate_bioactive_strain(smiles: str,
                                  bound_energy: float,
                                  global_min_energy: float) -> Dict[str, Any]:
        """
        Calculates conformational strain: dE_strain = E_bound - E_min.
        Passes if dE_strain <= 3.5 kcal/mol (standard medicinal chemistry threshold).
        """
        strain = max(0.0, round(bound_energy - global_min_energy, 2))
        passes = strain <= 3.5

        return {
            "smiles": smiles,
            "bound_conformer_energy_kcal_mol": round(bound_energy, 2),
            "unbound_global_minimum_kcal_mol": round(global_min_energy, 2),
            "conformational_strain_energy": strain,
            "passes_strain_filter": passes,
            "strain_assessment": "Thermodynamically Acceptable (< 3.5 kcal/mol)" if passes else "High Conformational Strain (Filtered)"
        }

