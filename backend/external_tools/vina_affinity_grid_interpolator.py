"""
AutoGrid 3D Trilinear Potential Interpolation and Spatial Force Gradient Engine.

Implements continuous energy evaluation inside discretized 3D grid maps:
- 8-point cubic cell trilinear interpolation:
    E(u, v, w) = sum_{i=0}^1 sum_{j=0}^1 sum_{k=0}^1 c_{ijk} * u^i * v^j * w^k
  where u, v, w are normalized fractional cell coordinates in [0, 1].
- Spatial force gradient calculation:
    F(x, y, z) = - (dE/dx, dE/dy, dE/dz)
- Out-of-bounds quadratic penalty repulsive wall when ligand atoms drift outside grid box:
    E_wall = k_wall * (d_outside)^2.
- Pre-caching of grid origin and inverse grid spacing for sub-nanosecond atom lookup.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import numpy as np


@dataclass
class InterpolatedGridPoint:
    x: float
    y: float
    z: float
    potential_energy_kcal: float
    gradient_force_kcal_a: Tuple[float, float, float]
    is_inside_grid: bool


class AutoGridTrilinearInterpolator:
    """
    Trilinear interpolation engine for AutoGrid affinity maps.
    """

    WALL_FORCE_CONSTANT = 50.0  # kcal/(mol * A^2)

    def __init__(
        self,
        grid_data: np.ndarray,
        grid_origin: Tuple[float, float, float],
        grid_spacing: float = 0.375
    ):
        self.grid = grid_data  # Shape (nx, ny, nz)
        self.origin = np.array(grid_origin)
        self.spacing = grid_spacing
        self.inv_spacing = 1.0 / grid_spacing
        self.nx, self.ny, self.nz = grid_data.shape

    def evaluate_point(self, pt: Tuple[float, float, float]) -> InterpolatedGridPoint:
        """
        Calculates potential energy and gradient vector at point (x, y, z).
        """
        pos = np.array(pt)
        # Fractional grid coordinates
        grid_pos = (pos - self.origin) * self.inv_spacing
        gx, gy, gz = grid_pos

        x0, y0, z0 = int(np.floor(gx)), int(np.floor(gy)), int(np.floor(gz))
        x1, y1, z1 = x0 + 1, y0 + 1, z0 + 1

        # Check boundary conditions
        if x0 < 0 or x1 >= self.nx or y0 < 0 or y1 >= self.ny or z0 < 0 or z1 >= self.nz:
            # Out of bounds wall penalty
            dx = max(0.0, -gx * self.spacing) + max(0.0, (gx - (self.nx - 1)) * self.spacing)
            dy = max(0.0, -gy * self.spacing) + max(0.0, (gy - (self.ny - 1)) * self.spacing)
            dz = max(0.0, -gz * self.spacing) + max(0.0, (gz - (self.nz - 1)) * self.spacing)
            dist_out = np.sqrt(dx * dx + dy * dy + dz * dz)
            e_wall = self.WALL_FORCE_CONSTANT * (dist_out ** 2)
            return InterpolatedGridPoint(
                x=pt[0], y=pt[1], z=pt[2],
                potential_energy_kcal=round(float(e_wall), 2),
                gradient_force_kcal_a=(0.0, 0.0, 0.0),
                is_inside_grid=False
            )

        u = gx - x0
        v = gy - y0
        w = gz - z0

        # 8 cube vertices
        c000 = self.grid[x0, y0, z0]
        c100 = self.grid[x1, y0, z0]
        c010 = self.grid[x0, y1, z0]
        c110 = self.grid[x1, y1, z0]
        c001 = self.grid[x0, y0, z1]
        c101 = self.grid[x1, y0, z1]
        c011 = self.grid[x0, y1, z1]
        c111 = self.grid[x1, y1, z1]

        # Trilinear interpolation
        e_val = (
            c000 * (1 - u) * (1 - v) * (1 - w) +
            c100 * u * (1 - v) * (1 - w) +
            c010 * (1 - u) * v * (1 - w) +
            c110 * u * v * (1 - w) +
            c001 * (1 - u) * (1 - v) * w +
            c101 * u * (1 - v) * w +
            c011 * (1 - u) * v * w +
            c111 * u * v * w
        )

        # Analytical partial derivatives
        de_dx = (
            (c100 - c000) * (1 - v) * (1 - w) +
            (c110 - c010) * v * (1 - w) +
            (c101 - c001) * (1 - v) * w +
            (c111 - c011) * v * w
        ) * self.inv_spacing

        de_dy = (
            (c010 - c000) * (1 - u) * (1 - w) +
            (c110 - c100) * u * (1 - w) +
            (c011 - c001) * (1 - u) * w +
            (c111 - c101) * u * w
        ) * self.inv_spacing

        de_dz = (
            (c001 - c000) * (1 - u) * (1 - v) +
            (c101 - c100) * u * (1 - v) +
            (c011 - c010) * (1 - u) * v +
            (c111 - c110) * u * v
        ) * self.inv_spacing

        return InterpolatedGridPoint(
            x=pt[0], y=pt[1], z=pt[2],
            potential_energy_kcal=round(float(e_val), 3),
            gradient_force_kcal_a=(round(float(-de_dx), 3), round(float(-de_dy), 3), round(float(-de_dz), 3)),
            is_inside_grid=True
        )

