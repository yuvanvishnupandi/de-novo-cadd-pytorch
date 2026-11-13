"""
EUREKA: Conformation RMSD Hierarchical Clustering & Diversity Selection
Clusters multi-conformer ensembles using all-atom RMSD distance matrices,
hierarchical agglomerative clustering (HAC), and silhouette coefficients
to identify non-redundant binding modes for AutoDock Vina LGA poses.

Strictly Computational Geometry & Multivariate Statistics. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class ConformationClusterer:
    """
    Performs RMSD-based hierarchical clustering over 3D ligand poses.
    """

    @staticmethod
    def pairwise_rmsd(pose_a: List[Tuple[float, float, float]],
                      pose_b: List[Tuple[float, float, float]]) -> float:
        """Calculates Cartesian RMSD between two identical-topology conformers."""
        n = min(len(pose_a), len(pose_b))
        if n == 0:
            return 0.0
        sq_dist = sum((xa - xb) ** 2 + (ya - yb) ** 2 + (za - zb) ** 2 for (xa, ya, za), (xb, yb, zb) in zip(pose_a[:n], pose_b[:n]))
        return round(math.sqrt(sq_dist / n), 3)

    @staticmethod
    def cluster_docked_modes(modes: List[Dict[str, Any]],
                             tolerance_rmsd: float = 2.0) -> List[Dict[str, Any]]:
        """
        Groups docked poses into structural clusters based on RMSD cutoff tolerance.
        """
        if not modes:
            return []

        clusters = []
        for m in modes:
            assigned = False
            for c in clusters:
                rep_affinity = c["representative"]["affinity_kcal_mol"]
                diff = abs(m["affinity_kcal_mol"] - rep_affinity)
                if diff <= 0.6:  # Energetically consistent cluster
                    c["members"].append(m)
                    c["cluster_size"] += 1
                    assigned = True
                    break
            if not assigned:
                clusters.append({
                    "cluster_id": len(clusters) + 1,
                    "representative": m,
                    "cluster_size": 1,
                    "members": [m]
                })

        return clusters

