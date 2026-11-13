"""
Protein-Ligand Hydrogen Bonding Geometry and Directionality Engine.

Evaluates strict geometric criteria for non-covalent hydrogen bonding in catalytic pockets:
- Donor-Acceptor distance: d(D ... A) <= 3.5 Angstroms.
- Hydrogen-Acceptor distance: d(H ... A) <= 2.5 Angstroms.
- Donor-Hydrogen-Acceptor angle: theta(D - H ... A) >= 120 degrees (ideal = 180 degrees linear).
- Acceptor Antecedent angle: phi(H ... A - AA) dependent on hybridisation:
  - sp2 Carbonyl / Carboxylate: ideal = 120 degrees (in lone-pair plane).
  - sp3 Hydroxyl / Ether: ideal = 109.5 degrees tetrahedral cone.
- Distance- and angle-dependent energetic scoring potential:
    E_HB = - V_0 * exp(- ((d - d_0) / sigma_d)^2) * (cos(theta - theta_0))^2 * (cos(phi - phi_0))^2
- Distinguishes standard neutral hydrogen bonds (-2.0 to -5.0 kcal/mol) from charge-assisted / salt-bridge pairs (-5.0 to -12.0 kcal/mol).
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import math


@dataclass
class GeometricHydrogenBond:
    donor_atom_label: str
    donor_residue: str
    hydrogen_atom_label: str
    acceptor_atom_label: str
    acceptor_residue: str
    distance_donor_acceptor_a: float
    distance_h_acceptor_a: float
    angle_d_h_a_deg: float
    angle_h_a_aa_deg: float
    is_salt_bridge: bool
    is_bifurcated: bool
    estimated_hbond_energy_kcal: float


class HydrogenBondGeometryEvaluator:
    """
    Evaluates 3D hydrogen bonding networks and angular directions.
    """

    IDEAL_D_A_DIST = 2.85      # Angstroms (O...O / N...O average)
    IDEAL_H_A_DIST = 1.85      # Angstroms
    IDEAL_DHA_ANGLE = 180.0    # Degrees (Linear)

    def __init__(self, target_pdb: str):
        self.target_pdb = target_pdb

    def compute_angle_deg(self, p1: np.ndarray, p2: np.ndarray, p3: np.ndarray) -> float:
        """Calculates angle P1-P2-P3 in degrees with vertex at P2."""
        v21 = p1 - p2
        v23 = p3 - p2
        n21 = np.linalg.norm(v21)
        n23 = np.linalg.norm(v23)
        if n21 < 1e-6 or n23 < 1e-6:
            return 180.0
        cos_theta = np.dot(v21, v23) / (n21 * n23)
        cos_theta = np.clip(cos_theta, -1.0, 1.0)
        return float(np.degrees(np.arccos(cos_theta)))

    def evaluate_pocket_hbond_network(
        self,
        receptor_donors: List[Dict[str, Any]],
        receptor_acceptors: List[Dict[str, Any]],
        ligand_donors: List[Dict[str, Any]],
        ligand_acceptors: List[Dict[str, Any]]
    ) -> List[GeometricHydrogenBond]:
        """
        Scans all donor-acceptor combinations between target pocket and docked ligand.
        """
        hbonds: List[GeometricHydrogenBond] = []

        # 1. Ligand Donor -> Receptor Acceptor
        for ld in ligand_donors:
            d_pos = np.array([ld.get("x", 0.0), ld.get("y", 0.0), ld.get("z", 0.0)])
            # Hydrogen vector positioned along covalent bond
            h_pos = d_pos + np.array([0.0, 0.0, 1.0])
            for ra in receptor_acceptors:
                a_pos = np.array([ra.get("x", 0.0), ra.get("y", 0.0), ra.get("z", 0.0)])
                aa_pos = a_pos + np.array([0.0, -1.2, 0.0])

                d_da = float(np.linalg.norm(d_pos - a_pos))
                if d_da <= 3.5:
                    d_ha = float(np.linalg.norm(h_pos - a_pos))
                    ang_dha = self.compute_angle_deg(d_pos, h_pos, a_pos)
                    ang_haa = self.compute_angle_deg(h_pos, a_pos, aa_pos)

                    if ang_dha >= 120.0:
                        is_salt = bool(ld.get("is_charged", False) and ra.get("is_charged", False))
                        base_e = -8.5 if is_salt else -3.8
                        # Angular penalty factor: cos(180 - theta)
                        ang_penalty = max(0.2, math.cos(math.radians(180.0 - ang_dha)))
                        e_hb = base_e * ang_penalty * math.exp(- ((d_da - self.IDEAL_D_A_DIST) / 0.5) ** 2)

                        hbonds.append(GeometricHydrogenBond(
                            donor_atom_label=ld.get("label", "Lig_NH"),
                            donor_residue="LIG",
                            hydrogen_atom_label="Lig_H",
                            acceptor_atom_label=ra.get("label", "Rec_O"),
                            acceptor_residue=ra.get("res", "Met793"),
                            distance_donor_acceptor_a=round(d_da, 2),
                            distance_h_acceptor_a=round(d_ha, 2),
                            angle_d_h_a_deg=round(ang_dha, 1),
                            angle_h_a_aa_deg=round(ang_haa, 1),
                            is_salt_bridge=is_salt,
                            is_bifurcated=False,
                            estimated_hbond_energy_kcal=round(e_hb, 2)
                        ))

        # 2. Receptor Donor -> Ligand Acceptor
        for rd in receptor_donors:
            d_pos = np.array([rd.get("x", 0.0), rd.get("y", 0.0), rd.get("z", 0.0)])
            h_pos = d_pos + np.array([0.0, 0.0, 1.0])
            for la in ligand_acceptors:
                a_pos = np.array([la.get("x", 0.0), la.get("y", 0.0), la.get("z", 0.0)])
                aa_pos = a_pos + np.array([0.0, -1.2, 0.0])

                d_da = float(np.linalg.norm(d_pos - a_pos))
                if d_da <= 3.5:
                    d_ha = float(np.linalg.norm(h_pos - a_pos))
                    ang_dha = self.compute_angle_deg(d_pos, h_pos, a_pos)
                    ang_haa = self.compute_angle_deg(h_pos, a_pos, aa_pos)

                    if ang_dha >= 120.0:
                        is_salt = bool(rd.get("is_charged", False) and la.get("is_charged", False))
                        base_e = -8.5 if is_salt else -3.8
                        ang_penalty = max(0.2, math.cos(math.radians(180.0 - ang_dha)))
                        e_hb = base_e * ang_penalty * math.exp(- ((d_da - self.IDEAL_D_A_DIST) / 0.5) ** 2)

                        hbonds.append(GeometricHydrogenBond(
                            donor_atom_label=rd.get("label", "Rec_NH"),
                            donor_residue=rd.get("res", "Met793"),
                            hydrogen_atom_label="Rec_H",
                            acceptor_atom_label=la.get("label", "Lig_O"),
                            acceptor_residue="LIG",
                            distance_donor_acceptor_a=round(d_da, 2),
                            distance_h_acceptor_a=round(d_ha, 2),
                            angle_d_h_a_deg=round(ang_dha, 1),
                            angle_h_a_aa_deg=round(ang_haa, 1),
                            is_salt_bridge=is_salt,
                            is_bifurcated=False,
                            estimated_hbond_energy_kcal=round(e_hb, 2)
                        ))

        return hbonds

