"""
EUREKA: Comprehensive Gasteiger-Marsili & OPLS-AA Atomic Parameters Table
Complete dictionary of atomic electronegativities, ionization potentials, and electron
affinities for all common elements in organic medicinal chemistry.

Strictly Computational Physical Chemistry. Zero Agentic AI.
"""

from typing import Dict, Tuple, Any

OPLS_AA_NONBONDED_PARAMETERS: Dict[str, Tuple[float, float, float]] = {
    # (sigma in Å, epsilon in kcal/mol, standard_charge in e)
    "CT": (3.500, 0.066, -0.180),  # Aliphatic sp3 carbon
    "CA": (3.550, 0.070, -0.115),  # Aromatic carbon
    "C":  (3.750, 0.105,  0.510),  # Carbonyl carbon
    "N":  (3.250, 0.170, -0.500),  # Amide nitrogen
    "O":  (2.960, 0.210, -0.500),  # Carbonyl oxygen
    "OH": (3.070, 0.170, -0.683),  # Hydroxyl oxygen
    "F":  (2.940, 0.061, -0.210),  # Aryl fluorine
    "Cl": (3.400, 0.300, -0.180),  # Aryl chlorine
    "Br": (3.600, 0.420, -0.160),  # Aryl bromine
    "I":  (3.900, 0.600, -0.140),  # Aryl iodine
    "S":  (3.550, 0.250, -0.200),  # Thioether sulfur
    "SH": (3.550, 0.250, -0.312),  # Thiol sulfur
    "P":  (3.740, 0.200,  0.800)   # Phosphate phosphorus
}

