"""
EUREKA: AutoDock Vina Pairwise Interaction Scoring Matrix & Energetic Decomposition
Computes full N x M receptor-ligand pairwise distance matrix and calculates exact
Gaussian steric, repulsion, hydrophobic contact, and hydrogen bond contributions.

Strictly Computational Biophysics & Matrix Calculus. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class VinaScoringMatrixCalculator:
    """
    Computes all-against-all pairwise distance and potential energy matrices
    between receptor pocket atoms and flexible ligand poses.
    """

    VDW_RADII = {
        'C': 1.70, 'A': 1.70, 'N': 1.55, 'NA': 1.55, 'OA': 1.52, 'O': 1.52,
        'F': 1.47, 'P': 1.80, 'SA': 1.80, 'S': 1.80, 'Cl': 1.75, 'Br': 1.85, 'I': 1.98, 'H': 1.20, 'HD': 1.00
    }

    # Calibrated AutoDock Vina force-field weights
    WEIGHT_GAUSS1 = -0.035579
    WEIGHT_GAUSS2 = -0.005156
    WEIGHT_REPULSION = 0.840245
    WEIGHT_HYDROPHOBIC = -0.035069
    WEIGHT_HBOND = -0.587439

    @classmethod
    def get_surface_distance(cls, r: float, type_rec: str, type_lig: str) -> float:
        """Calculates distance between van der Waals surfaces."""
        r_rec = cls.VDW_RADII.get(type_rec.upper(), 1.70)
        r_lig = cls.VDW_RADII.get(type_lig.upper(), 1.70)
        return r - (r_rec + r_lig)

    @classmethod
    def evaluate_pair_interaction(cls,
                                  r: float,
                                  type_rec: str,
                                  type_lig: str,
                                  is_hbond_pair: bool = False) -> Dict[str, float]:
        """Calculates individual energy terms for an atom pair."""
        d = cls.get_surface_distance(r, type_rec, type_lig)

        # Gauss 1 & 2
        g1 = math.exp(-((d / 0.5) ** 2))
        g2 = math.exp(-(((d - 3.0) / 2.0) ** 2))

        # Repulsion
        rep = d ** 2 if d < 0.0 else 0.0

        # Hydrophobic
        lipophilic = {'C', 'A', 'F', 'CL', 'BR', 'I'}
        if type_rec.upper() in lipophilic and type_lig.upper() in lipophilic:
            if d <= 0.5:
                hyd = 1.0
            elif d >= 1.5:
                hyd = 0.0
            else:
                hyd = 1.5 - d
        else:
            hyd = 0.0

        # Hydrogen bonding
        if is_hbond_pair:
            if d <= -0.7:
                hb = 1.0
            elif d >= 0.0:
                hb = 0.0
            else:
                hb = -d / 0.7
        else:
            hb = 0.0

        e_total = (cls.WEIGHT_GAUSS1 * g1 +
                   cls.WEIGHT_GAUSS2 * g2 +
                   cls.WEIGHT_REPULSION * rep +
                   cls.WEIGHT_HYDROPHOBIC * hyd +
                   cls.WEIGHT_HBOND * hb)

        return {
            "r_angstrom": round(r, 3),
            "surface_distance": round(d, 3),
            "gauss1": round(g1, 4),
            "gauss2": round(g2, 4),
            "repulsion": round(rep, 4),
            "hydrophobic": round(hyd, 4),
            "hbond": round(hb, 4),
            "pair_energy_kcal_mol": round(e_total, 4)
        }

    @classmethod
    def compute_interaction_matrix(cls,
                                   receptor_atoms: List[Dict[str, Any]],
                                   ligand_atoms: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates full intermolecular binding energy sum over all receptor-ligand pairs.
        """
        total_g1 = 0.0
        total_g2 = 0.0
        total_rep = 0.0
        total_hyd = 0.0
        total_hb = 0.0
        total_energy = 0.0
        contacts = []

        for rec in receptor_atoms:
            rx, ry, rz = rec.get("x", 0.0), rec.get("y", 0.0), rec.get("z", 0.0)
            rtype = rec.get("type", rec.get("elem", "C"))
            for lig in ligand_atoms:
                lx, ly, lz = lig.get("x", 0.0), lig.get("y", 0.0), lig.get("z", 0.0)
                ltype = lig.get("type", lig.get("elem", "C"))

                dist = math.sqrt((rx - lx) ** 2 + (ry - ly) ** 2 + (rz - lz) ** 2)
                if dist <= 8.0:  # 8.0 Å standard interaction cutoff
                    is_hb = (rtype in ('OA', 'NA', 'O', 'N')) and (ltype in ('OA', 'NA', 'O', 'N'))
                    pair = cls.evaluate_pair_interaction(dist, rtype, ltype, is_hb)

                    total_g1 += cls.WEIGHT_GAUSS1 * pair["gauss1"]
                    total_g2 += cls.WEIGHT_GAUSS2 * pair["gauss2"]
                    total_rep += cls.WEIGHT_REPULSION * pair["repulsion"]
                    total_hyd += cls.WEIGHT_HYDROPHOBIC * pair["hydrophobic"]
                    total_hb += cls.WEIGHT_HBOND * pair["hbond"]
                    total_energy += pair["pair_energy_kcal_mol"]

                    if dist <= 3.5:
                        contacts.append({
                            "rec_id": rec.get("id", "REC"),
                            "lig_id": lig.get("id", "LIG"),
                            "distance": round(dist, 2),
                            "energy": pair["pair_energy_kcal_mol"]
                        })

        return {
            "total_intermolecular_energy": round(total_energy, 3),
            "sum_gauss1": round(total_g1, 3),
            "sum_gauss2": round(total_g2, 3),
            "sum_repulsion": round(total_rep, 3),
            "sum_hydrophobic": round(total_hyd, 3),
            "sum_hbond": round(total_hb, 3),
            "close_contacts_count": len(contacts),
            "key_contacts": contacts[:8]
        }

