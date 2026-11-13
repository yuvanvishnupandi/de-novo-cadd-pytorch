"""
EUREKA: 3D Molecular Electrostatic Potential (MEP) & Coulombic Grid Surface Mapping
Calculates 3D continuous electrostatic potential fields V(r) around macromolecular receptors
and ligands for coloring Connolly surfaces and electrostatic complementation scoring.

Strictly Computational Biophysics & Classical Electrostatics. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any


class MolecularElectrostaticPotentialGrid:
    """
    Computes electrostatic potential V(r) on a 3D rectilinear lattice:
    V(r) = sum_i ( q_i / (4 * pi * eps_0 * |r - r_i|) ).
    """

    def __init__(self,
                 grid_spacing: float = 1.0,
                 dielectric: float = 4.0):
        self.spacing = grid_spacing
        self.dielectric = dielectric
        self.conversion_factor = 332.0637  # kcal * Å / (mol * e^2)

    def calculate_potential_at_point(self,
                                     point: Tuple[float, float, float],
                                     atom_coordinates: List[Tuple[float, float, float]],
                                     atom_charges: List[float]) -> float:
        """Calculates electrostatic potential in kcal/(mol*e) at a single 3D point."""
        px, py, pz = point
        total_v = 0.0

        for (ax, ay, az), q in zip(atom_coordinates, atom_charges):
            r = math.sqrt((px - ax) ** 2 + (py - ay) ** 2 + (pz - az) ** 2)
            if r > 0.8:  # Exclude nuclear collision singularity
                v_i = (self.conversion_factor * q) / (self.dielectric * r)
                total_v += v_i

        return round(total_v, 3)

    def compute_surface_color_mapping(self,
                                      surface_points: List[Tuple[float, float, float]],
                                      atom_coordinates: List[Tuple[float, float, float]],
                                      atom_charges: List[float]) -> List[Dict[str, Any]]:
        """
        Maps electrostatic potential onto Connolly surface nodes.
        Positive V(r) -> Blue (Basic / Cationic), Negative V(r) -> Red (Acidic / Anionic).
        """
        colored_points = []
        for pt in surface_points:
            v_val = self.calculate_potential_at_point(pt, atom_coordinates, atom_charges)

            # Normalized RGB gradient: -15 kcal/mol (deep red) to +15 kcal/mol (deep blue)
            norm = max(-1.0, min(1.0, v_val / 15.0))
            if norm < 0:
                # Red spectrum
                r_c = 239
                g_c = int(68 * (1.0 + norm))
                b_c = int(68 * (1.0 + norm))
            else:
                # Blue spectrum
                r_c = int(59 * (1.0 - norm))
                g_c = int(130 * (1.0 - norm))
                b_c = 246

            hex_color = f"#{r_c:02x}{g_c:02x}{b_c:02x}"
            colored_points.append({
                "x": pt[0],
                "y": pt[1],
                "z": pt[2],
                "potential_kcal_mol_e": v_val,
                "color": hex_color
            })

        return colored_points

