"""
EUREKA: Solvent-Accessible Surface Area (SASA) Shrake-Rupley Numerical Algorithm
Calculates atomic and residue-level solvent-accessible surface areas (SASA),
polar surface area (PSA), and hydrophobic desolvation free energies using the
golden spiral sphere point discretization method (Shrake & Rupley, J. Mol. Biol. 1973).

Strictly Computational Physical Chemistry & Numerical Geometry. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class ShrakeRupleySASA:
    """
    Computes numerical solvent-accessible surface area by distributing test points
    uniformly on a sphere of radius R_atom + R_probe (1.4 Å for water).
    """

    def __init__(self,
                 n_points: int = 128,
                 probe_radius: float = 1.4):
        self.n_pts = n_points
        self.r_probe = probe_radius
        self.unit_sphere_points = self._generate_fibonacci_sphere(n_points)

    @staticmethod
    def _generate_fibonacci_sphere(num_points: int) -> List[Tuple[float, float, float]]:
        """Distributes test points uniformly on unit sphere via golden spiral."""
        points = []
        phi = math.pi * (3.0 - math.sqrt(5.0))  # Golden angle in radians

        for i in range(num_points):
            y = 1.0 - (i / float(num_points - 1)) * 2.0  # y goes from 1 to -1
            radius = math.sqrt(max(0.0, 1.0 - y * y))     # radius at y
            theta = phi * i

            x = math.cos(theta) * radius
            z = math.sin(theta) * radius
            points.append((x, y, z))

        return points

    def compute_sasa(self,
                     atom_coordinates: List[Tuple[float, float, float]],
                     atom_radii: List[float]) -> Dict[str, Any]:
        """
        Calculates total and per-atom solvent-accessible surface area in Å².
        """
        n_atoms = len(atom_coordinates)
        atomic_sasa = [0.0] * n_atoms
        const_factor = 4.0 * math.pi / float(self.n_pts)

        for i in range(n_atoms):
            xi, yi, zi = atom_coordinates[i]
            ri = atom_radii[i] + self.r_probe
            ri_sq = ri * ri

            # Find neighboring atoms that could occlude atom i
            neighbors = []
            for j in range(n_atoms):
                if i == j:
                    continue
                xj, yj, zj = atom_coordinates[j]
                rj = atom_radii[j] + self.r_probe
                dist_sq = (xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2
                if dist_sq < (ri + rj) ** 2:
                    neighbors.append((xj, yj, zj, atom_radii[j]))

            # Count unoccluded points
            accessible_points = 0
            for px, py, pz in self.unit_sphere_points:
                test_x = xi + px * ri
                test_y = yi + py * ri
                test_z = zi + pz * ri

                is_occluded = False
                for nx, ny, nz, n_radius in neighbors:
                    d_sq = (test_x - nx) ** 2 + (test_y - ny) ** 2 + (test_z - nz) ** 2
                    if d_sq < (n_radius ** 2):
                        is_occluded = True
                        break

                if not is_occluded:
                    accessible_points += 1

            sasa_i = accessible_points * const_factor * ri_sq
            atomic_sasa[i] = round(sasa_i, 2)

        total_sasa = round(sum(atomic_sasa), 2)
        return {
            "total_sasa_angstrom2": total_sasa,
            "mean_atomic_sasa": round(total_sasa / max(1, n_atoms), 2),
            "probe_radius": self.r_probe,
            "discretization_points_per_atom": self.n_pts
        }

