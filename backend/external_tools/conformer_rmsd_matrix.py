"""
EUREKA: Conformation Pairwise RMSD Distance Matrix & Clustering Dispatcher
Calculates complete N x N symmetric Root-Mean-Square Deviation (RMSD) matrices
between multi-pose docking trajectories to validate structural convergence.

Strictly Computational Geometry & Matrix Algebra. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class ConformerRmsdMatrixEngine:
    """
    Computes all-to-all coordinate distance matrices across structural ensembles.
    """

    @staticmethod
    def calculate_pose_rmsd(coords_a: List[Tuple[float, float, float]],
                            coords_b: List[Tuple[float, float, float]]) -> float:
        """Calculates RMSD between two ordered lists of atom coordinates."""
        n = min(len(coords_a), len(coords_b))
        if n == 0:
            return 0.0

        sq_sum = sum((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2
                     for p1, p2 in zip(coords_a[:n], coords_b[:n]))
        return round(math.sqrt(sq_sum / n), 3)

    @classmethod
    def compute_all_to_all_rmsd_matrix(cls,
                                       poses: List[List[Tuple[float, float, float]]]) -> List[List[float]]:
        """
        Constructs N x N symmetric RMSD distance matrix.
        matrix[i][j] = RMSD(pose_i, pose_j).
        """
        n = len(poses)
        matrix = [[0.0] * n for _ in range(n)]

        for i in range(n):
            for j in range(i + 1, n):
                d = cls.calculate_pose_rmsd(poses[i], poses[j])
                matrix[i][j] = d
                matrix[j][i] = d

        return matrix

    @classmethod
    def find_medoid_pose(cls,
                         rmsd_matrix: List[List[float]]) -> int:
        """
        Finds the medoid pose (the conformation with the minimum average distance to all other poses).
        """
        n = len(rmsd_matrix)
        if n == 0:
            return 0

        min_avg = float('inf')
        medoid_idx = 0

        for i in range(n):
            avg_dist = sum(rmsd_matrix[i]) / max(1, n - 1)
            if avg_dist < min_avg:
                min_avg = avg_dist
                medoid_idx = i

        return medoid_idx

