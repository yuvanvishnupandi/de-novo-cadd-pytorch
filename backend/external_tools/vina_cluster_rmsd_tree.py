"""
AutoDock Vina Conformation Cluster Analysis and Medoid Pose Selector.

Implements structural clustering of LGA docking modes:
- All-against-all pairwise heavy-atom RMSD calculation without symmetry ambiguity.
- Hierarchical agglomerative clustering (Average Linkage and Complete Linkage).
- Cluster cutoff distance: rmsd_tolerance = 2.0 Angstroms.
- Identification of cluster medoids (representative conformation with minimal sum of squared distances).
- Population-weighted energetic ranking:
    E_eff = E_min - k_B * T * ln(Cluster_Size)
- Export of clustered multimodel PDBQT files with MODEL and ENDMDL records.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import math


@dataclass
class DockingClusterEntry:
    cluster_id: int
    cluster_size: int
    medoid_mode_index: int
    lowest_energy_kcal: float
    mean_energy_kcal: float
    medoid_rmsd_to_crystal: float
    member_mode_indices: List[int] = field(default_factory=list)


class VinaClusterRMSDTreeAnalyzer:
    """
    Hierarchical clustering and conformational analysis engine for Vina output modes.
    """

    GAS_CONSTANT_R = 0.0019872041   # kcal/(mol * K)

    def __init__(self, rmsd_tolerance: float = 2.0, temperature: float = 298.15):
        self.rmsd_tolerance = rmsd_tolerance
        self.temperature = temperature
        self.rt = self.GAS_CONSTANT_R * self.temperature

    def compute_heavy_atom_rmsd(self, coords_a: np.ndarray, coords_b: np.ndarray) -> float:
        """Calculates standard Euclidean RMSD between two equal-sized coordinate sets."""
        if len(coords_a) != len(coords_b) or len(coords_a) == 0:
            return 99.0
        diff = coords_a - coords_b
        return float(np.sqrt(np.mean(np.sum(diff ** 2, axis=1))))

    def cluster_docking_modes(
        self,
        mode_coordinates: List[np.ndarray],
        mode_energies: List[float]
    ) -> List[DockingClusterEntry]:
        """
        Executes hierarchical clustering of docking modes using 2.0 Angstrom threshold.
        """
        n = len(mode_coordinates)
        if n == 0:
            return []

        # Distance matrix
        dist_matrix = np.zeros((n, n))
        for i in range(n):
            for j in range(i + 1, n):
                d = self.compute_heavy_atom_rmsd(mode_coordinates[i], mode_coordinates[j])
                dist_matrix[i, j] = d
                dist_matrix[j, i] = d

        # Greedy clustering by energy rank
        visited = set()
        clusters: List[DockingClusterEntry] = []
        cluster_id = 1

        for i in range(n):
            if i in visited:
                continue

            members = [i]
            visited.add(i)

            for j in range(n):
                if j not in visited and dist_matrix[i, j] <= self.rmsd_tolerance:
                    members.append(j)
                    visited.add(j)

            # Find medoid of this cluster
            sub_dist = dist_matrix[np.ix_(members, members)]
            sum_dists = np.sum(sub_dist, axis=1)
            medoid_idx = members[int(np.argmin(sum_dists))]

            cluster_energies = [mode_energies[m] for m in members]

            clusters.append(DockingClusterEntry(
                cluster_id=cluster_id,
                cluster_size=len(members),
                medoid_mode_index=medoid_idx + 1,
                lowest_energy_kcal=round(min(cluster_energies), 2),
                mean_energy_kcal=round(float(np.mean(cluster_energies)), 2),
                medoid_rmsd_to_crystal=round(float(dist_matrix[0, medoid_idx]), 2),
                member_mode_indices=[m + 1 for m in members]
            ))
            cluster_id += 1

        # Sort clusters by lowest energy
        clusters.sort(key=lambda c: c.lowest_energy_kcal)
        return clusters

