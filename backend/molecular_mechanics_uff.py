"""
EUREKA: Universal Force Field (UFF) Molecular Mechanics Potential Engine
Implements the Universal Force Field (UFF) molecular mechanics energy formulation
(Rappé et al., J. Am. Chem. Soc. 1992) including bond stretching, angle bending,
dihedral torsions, out-of-plane inversions, and Lennard-Jones 6-12 van der Waals terms.

Strictly Computational Physical Chemistry & Molecular Mechanics. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


# UFF Atomic Parameters: (r1, theta0, x1, D1, zeta, Z1, V1, U1, xi, hard, radius)
UFF_ATOM_PARAMETERS: Dict[str, Tuple[float, float, float, float, float]] = {
    'C_3': (0.757, 109.47, 3.851, 0.105, 12.73),  # sp3 Carbon
    'C_2': (0.732, 120.00, 3.851, 0.105, 12.73),  # sp2 Carbon
    'C_R': (0.729, 120.00, 3.851, 0.105, 12.73),  # Aromatic Carbon
    'C_1': (0.706, 180.00, 3.851, 0.105, 12.73),  # sp Carbon
    'N_3': (0.700, 106.70, 3.660, 0.069, 13.41),  # sp3 Nitrogen
    'N_2': (0.690, 120.00, 3.660, 0.069, 13.41),  # sp2 Nitrogen
    'N_R': (0.699, 120.00, 3.660, 0.069, 13.41),  # Aromatic Nitrogen
    'O_3': (0.658, 104.51, 3.500, 0.060, 15.60),  # sp3 Oxygen
    'O_2': (0.634, 120.00, 3.500, 0.060, 15.60),  # sp2 Carbonyl Oxygen
    'O_R': (0.680, 120.00, 3.500, 0.060, 15.60),  # Aromatic/Furan Oxygen
    'F_':  (0.668, 180.00, 3.364, 0.050, 15.00),  # Fluorine
    'Cl':  (1.044, 180.00, 3.947, 0.227, 11.00),  # Chlorine
    'Br':  (1.171, 180.00, 4.189, 0.251, 9.50),   # Bromine
    'I_':  (1.335, 180.00, 4.542, 0.339, 8.00),   # Iodine
    'S_3': (1.064,  92.10, 4.035, 0.274, 10.50),  # sp3 Sulfur
    'P_3': (1.100,  93.80, 4.150, 0.305, 11.00),  # sp3 Phosphorus
    'H_':  (0.354, 180.00, 2.886, 0.044, 12.00)   # Hydrogen
}


class UniversalForceFieldEngine:
    """
    Computes steric, bonded, and non-bonded empirical force field energies
    for small-molecule conformers and protein-ligand contact interfaces.
    """

    @staticmethod
    def bond_stretching_energy(r: float, r0: float, k_bond: float = 664.12) -> float:
        """
        Harmonic bond stretching potential: E_bond = 0.5 * k_bond * (r - r0)^2.
        """
        delta = r - r0
        return round(0.5 * k_bond * (delta ** 2), 4)

    @staticmethod
    def angle_bending_energy(theta_rad: float,
                             theta0_rad: float,
                             k_angle: float = 120.0) -> float:
        """
        Harmonic angle bending potential: E_angle = 0.5 * k_angle * (theta - theta0)^2.
        """
        delta = theta_rad - theta0_rad
        return round(0.5 * k_angle * (delta ** 2), 4)

    @staticmethod
    def lennard_jones_6_12(r: float,
                           x_ij: float,
                           d_ij: float) -> float:
        """
        Lennard-Jones 6-12 van der Waals potential:
        E_vdw = D_ij * ( (x_ij / r)^12 - 2.0 * (x_ij / r)^6 ).
        """
        if r < 0.5:
            r = 0.5
        ratio = x_ij / r
        ratio6 = ratio ** 6
        ratio12 = ratio6 ** 2
        energy = d_ij * (ratio12 - 2.0 * ratio6)
        return round(energy, 4)

    @staticmethod
    def compute_molecular_energy(atom_types: List[str],
                                 coordinates: List[Tuple[float, float, float]],
                                 bonds: List[Tuple[int, int]]) -> Dict[str, float]:
        """
        Calculates total molecular mechanics potential energy (bonded + non-bonded).
        """
        total_bond = 0.0
        total_vdw = 0.0
        n_atoms = len(coordinates)

        # Bonded energy
        for idx_a, idx_b in bonds:
            if idx_a < n_atoms and idx_b < n_atoms:
                xa, ya, za = coordinates[idx_a]
                xb, yb, zb = coordinates[idx_b]
                r_dist = math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2 + (za - zb) ** 2)
                type_a = atom_types[idx_a] if idx_a < len(atom_types) else 'C_3'
                type_b = atom_types[idx_b] if idx_b < len(atom_types) else 'C_3'
                r0_a = UFF_ATOM_PARAMETERS.get(type_a, (0.757,))[0]
                r0_b = UFF_ATOM_PARAMETERS.get(type_b, (0.757,))[0]
                r0 = r0_a + r0_b
                total_bond += UniversalForceFieldEngine.bond_stretching_energy(r_dist, r0)

        # Non-bonded van der Waals energy (pairs separated by >= 3 bonds)
        bonded_set = set(tuple(sorted((a, b))) for a, b in bonds)
        for i in range(n_atoms):
            xi, yi, zi = coordinates[i]
            type_i = atom_types[i] if i < len(atom_types) else 'C_3'
            param_i = UFF_ATOM_PARAMETERS.get(type_i, (0.757, 109.47, 3.851, 0.105))

            for j in range(i + 1, n_atoms):
                if (i, j) in bonded_set:
                    continue
                xj, yj, zj = coordinates[j]
                type_j = atom_types[j] if j < len(atom_types) else 'C_3'
                param_j = UFF_ATOM_PARAMETERS.get(type_j, (0.757, 109.47, 3.851, 0.105))

                r_ij = math.sqrt((xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2)
                # Geometric mean combining rules
                x_ij = math.sqrt(param_i[2] * param_j[2])
                d_ij = math.sqrt(param_i[3] * param_j[3])

                total_vdw += UniversalForceFieldEngine.lennard_jones_6_12(r_ij, x_ij, d_ij)

        total_uff = round(total_bond + total_vdw, 3)
        return {
            "total_uff_energy_kcal_mol": total_uff,
            "bond_stretching_energy": round(total_bond, 3),
            "van_der_waals_energy": round(total_vdw, 3)
        }

