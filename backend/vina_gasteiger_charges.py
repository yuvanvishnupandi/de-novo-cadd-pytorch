"""
EUREKA: Gasteiger-Marsili Atomic Partial Charge Calculation Engine
Implements the iterative Gasteiger-Marsili electronegativity equalization method
(Gasteiger & Marsili, Tetrahedron 1980) for assigning partial atomic charges to
receptors and small-molecule ligands for AutoDock Vina force fields at pH 7.4.

Strictly Computational Chemistry & Quantum/Physical Principles. Zero Agentic AI.
"""

import math
from typing import Dict, List, Tuple, Optional


# ─── Valence State Electronegativity Parameters (Gasteiger-Marsili) ───────────
# chi = a + b * q + c * q^2
# Parameters: (a, b, c, valence_electrons)
GASTEIGER_PARAMETERS: Dict[str, Tuple[float, float, float, int]] = {
    'H': (7.17, 12.92, 0.0, 1),
    'C_sp3': (7.98, 9.18, 1.88, 4),
    'C_sp2': (8.79, 9.32, 1.51, 4),
    'C_sp': (10.39, 9.45, 0.73, 4),
    'N_sp3': (11.54, 13.95, 2.14, 5),
    'N_sp2': (12.87, 13.94, 1.77, 5),
    'N_sp': (15.68, 11.7, 0.0, 5),
    'O_sp3': (14.18, 12.92, 1.39, 6),
    'O_sp2': (15.60, 13.07, 1.05, 6),
    'F': (14.66, 13.85, 0.0, 7),
    'Cl': (11.00, 9.69, 1.35, 7),
    'Br': (10.08, 8.47, 1.16, 7),
    'I': (9.90, 7.96, 0.96, 7),
    'S_sp3': (10.14, 9.13, 1.38, 6),
    'P_sp3': (8.90, 8.24, 1.25, 5)
}


class GasteigerChargeCalculator:
    """
    Computes partial atomic charges using the iterative Gasteiger-Marsili
    electronegativity equalization method over molecular connection graphs.
    """

    def __init__(self, damping_factor: float = 0.5, max_iterations: int = 6):
        self.damping = damping_factor
        self.max_iter = max_iterations

    def get_atom_parameters(self, elem: str, hybridization: str = 'sp3') -> Tuple[float, float, float, int]:
        """Resolves orbital electronegativity polynomial coefficients."""
        key = f"{elem}_{hybridization}"
        if key in GASTEIGER_PARAMETERS:
            return GASTEIGER_PARAMETERS[key]
        if elem in GASTEIGER_PARAMETERS:
            return GASTEIGER_PARAMETERS[elem]
        return GASTEIGER_PARAMETERS.get(f"{elem}_sp3", (8.0, 10.0, 1.0, 4))

    def compute_electronegativity(self, a: float, b: float, c: float, q: float) -> float:
        """Calculates effective orbital electronegativity: chi = a + b*q + c*q^2."""
        return a + b * q + c * (q ** 2)

    def calculate_partial_charges(self,
                                  atoms: List[Dict[str, str]],
                                  bonds: List[Tuple[int, int, int]]) -> List[Dict[str, any]]:
        """
        Iteratively calculates partial atomic charges for a molecular graph.

        Args:
            atoms: List of dicts with 'id', 'elem', and optional 'hybridization'.
            bonds: List of tuples (atom_idx_a, atom_idx_b, bond_order).

        Returns:
            List of atoms augmented with 'partial_charge' (in elementary charge units e).
        """
        n = len(atoms)
        charges = [0.0] * n

        # Iterative charge transfer
        current_damping = self.damping
        for iteration in range(self.max_iter):
            delta_q = [0.0] * n

            for idx_a, idx_b, order in bonds:
                if idx_a >= n or idx_b >= n:
                    continue

                atom_a = atoms[idx_a]
                atom_b = atoms[idx_b]

                a1, b1, c1, _ = self.get_atom_parameters(atom_a['elem'], atom_a.get('hybridization', 'sp3'))
                a2, b2, c2, _ = self.get_atom_parameters(atom_b['elem'], atom_b.get('hybridization', 'sp3'))

                chi_a = self.compute_electronegativity(a1, b1, c1, charges[idx_a])
                chi_b = self.compute_electronegativity(a2, b2, c2, charges[idx_b])

                # Electronegativity gradient drives partial charge transfer
                if chi_a > chi_b:
                    denom = a1 + b1 + c1
                    dq = (chi_a - chi_b) / max(0.1, denom) * current_damping * order
                    delta_q[idx_a] -= dq
                    delta_q[idx_b] += dq
                elif chi_b > chi_a:
                    denom = a2 + b2 + c2
                    dq = (chi_b - chi_a) / max(0.1, denom) * current_damping * order
                    delta_q[idx_a] += dq
                    delta_q[idx_b] -= dq

            for i in range(n):
                charges[i] += delta_q[i]

            current_damping *= self.damping

        results = []
        for i, atom in enumerate(atoms):
            q_val = round(charges[i], 4)
            results.append({
                "id": atom.get("id", f"atom_{i}"),
                "elem": atom["elem"],
                "partial_charge": q_val,
                "is_polar": abs(q_val) >= 0.15
            })

        return results

    @staticmethod
    def calculate_coulombic_electrostatics(atom_charges: List[Dict[str, any]],
                                           coordinates: List[Tuple[float, float, float]],
                                           dielectric_constant: float = 4.0) -> float:
        """
        Calculates intramolecular or intermolecular Coulombic electrostatic energy
        using distance-dependent dielectric: E_coul = sum( 332.0637 * q_i * q_j / (eps * r_ij) ).
        """
        coulomb_constant = 332.0637  # kcal * Å / (mol * e^2)
        total_energy = 0.0
        n = min(len(atom_charges), len(coordinates))

        for i in range(n):
            qi = atom_charges[i]["partial_charge"]
            xi, yi, zi = coordinates[i]
            for j in range(i + 1, n):
                qj = atom_charges[j]["partial_charge"]
                xj, yj, zj = coordinates[j]
                r_ij = math.sqrt((xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2)
                if r_ij > 0.8:
                    # Distance-dependent dielectric (eps = eps_0 * r_ij) modeling solvent screening
                    effective_eps = dielectric_constant * r_ij
                    e_ij = (coulomb_constant * qi * qj) / (effective_eps * r_ij)
                    total_energy += e_ij

        return round(total_energy, 3)

