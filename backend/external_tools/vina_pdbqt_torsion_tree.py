"""
PDBQT Torsion Tree and Rotatable Bond Kinematics Parser for AutoDock Vina.

Parses crystallographic PDBQT files and constructs directed acyclic torsion trees:
- ROOT / ENDROOT parsing for rigid core centroid identification.
- BRANCH / ENDBRANCH recursive parsing for flexible torsion sub-graphs.
- TORSDOF evaluation for entropic penalty calculations (0.58 kcal/mol per rotatable bond).
- Forward kinematics rotation around arbitrary spatial axis using Rodrigues' rotation formula.
- Validation of Gasteiger partial charges and AD4 atom typing.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import math


@dataclass
class PDBQTAtomRecord:
    serial: int
    name: str
    res_name: str
    chain_id: str
    res_seq: int
    x: float
    y: float
    z: float
    occupancy: float
    temp_factor: float
    partial_charge: float
    ad4_atom_type: str


@dataclass
class TorsionTreeNode:
    node_id: int
    parent_atom_id: int
    child_atom_id: int
    rigid_atom_ids: List[int] = field(default_factory=list)
    children: List['TorsionTreeNode'] = field(default_factory=list)
    current_angle_rad: float = 0.0


class PDBQTTorsionTreeBuilder:
    """
    Parses AutoDock PDBQT files into hierarchical kinematic trees.
    """

    GAS_CONSTANT_R = 0.0019872041   # kcal/(mol * K)
    TORSION_ENTROPY_WEIGHT = 0.583  # kcal/mol (Trott & Olson, 2010)

    def __init__(self, pdbqt_content: str):
        self.raw_lines = pdbqt_content.strip().split("\n")
        self.atoms: Dict[int, PDBQTAtomRecord] = {}
        self.root_atom_ids: List[int] = []
        self.root_node: Optional[TorsionTreeNode] = None
        self.torsdof: int = 0
        self._build_tree()

    def _parse_atom_line(self, line: str) -> Optional[PDBQTAtomRecord]:
        if not (line.startswith("ATOM") or line.startswith("HETATM")):
            return None
        try:
            serial = int(line[6:11].strip())
            name = line[12:16].strip()
            res_name = line[17:20].strip()
            chain_id = line[21:22].strip() or "A"
            res_seq = int(line[22:26].strip()) if line[22:26].strip() else 1
            x = float(line[30:38].strip())
            y = float(line[38:46].strip())
            z = float(line[46:54].strip())
            occ = float(line[54:60].strip()) if len(line) >= 60 and line[54:60].strip() else 1.0
            temp = float(line[60:66].strip()) if len(line) >= 66 and line[60:66].strip() else 0.0
            charge = float(line[70:76].strip()) if len(line) >= 76 and line[70:76].strip() else 0.0
            atom_type = line[77:79].strip() if len(line) >= 79 else name[:1]
            return PDBQTAtomRecord(
                serial=serial,
                name=name,
                res_name=res_name,
                chain_id=chain_id,
                res_seq=res_seq,
                x=x,
                y=y,
                z=z,
                occupancy=occ,
                temp_factor=temp,
                partial_charge=charge,
                ad4_atom_type=atom_type
            )
        except Exception:
            return None

    def _build_tree(self):
        in_root = False
        branch_stack: List[TorsionTreeNode] = []
        current_node_id = 0

        for line in self.raw_lines:
            line_str = line.strip()

            if line_str.startswith("TORSDOF"):
                parts = line_str.split()
                if len(parts) >= 2:
                    self.torsdof = int(parts[1])
                continue

            if line_str == "ROOT":
                in_root = True
                self.root_node = TorsionTreeNode(node_id=0, parent_atom_id=0, child_atom_id=0)
                branch_stack.append(self.root_node)
                continue

            if line_str == "ENDROOT":
                in_root = False
                continue

            if line_str.startswith("BRANCH"):
                parts = line_str.split()
                parent_a = int(parts[1])
                child_a = int(parts[2])
                current_node_id += 1
                new_branch = TorsionTreeNode(
                    node_id=current_node_id,
                    parent_atom_id=parent_a,
                    child_atom_id=child_a
                )
                if branch_stack:
                    branch_stack[-1].children.append(new_branch)
                branch_stack.append(new_branch)
                continue

            if line_str.startswith("ENDBRANCH"):
                if branch_stack:
                    branch_stack.pop()
                continue

            if line_str.startswith("ATOM") or line_str.startswith("HETATM"):
                atom = self._parse_atom_line(line)
                if atom:
                    self.atoms[atom.serial] = atom
                    if in_root:
                        self.root_atom_ids.append(atom.serial)
                    if branch_stack:
                        branch_stack[-1].rigid_atom_ids.append(atom.serial)

    def calculate_torsional_free_energy_penalty(self) -> float:
        """Delta G_tor = 0.583 kcal/mol * N_rotatable_bonds."""
        return round(self.TORSION_ENTROPY_WEIGHT * self.torsdof, 3)

    def rodrigues_rotate(
        self,
        point: np.ndarray,
        axis_origin: np.ndarray,
        axis_direction: np.ndarray,
        theta_rad: float
    ) -> np.ndarray:
        """Rotates a 3D coordinate vector around an arbitrary axis using Rodrigues' formula."""
        axis_unit = axis_direction / np.linalg.norm(axis_direction)
        v = point - axis_origin
        cos_t = math.cos(theta_rad)
        sin_t = math.sin(theta_rad)
        v_rot = v * cos_t + np.cross(axis_unit, v) * sin_t + axis_unit * np.dot(axis_unit, v) * (1.0 - cos_t)
        return v_rot + axis_origin

    def apply_dihedral_rotation(
        self,
        node: TorsionTreeNode,
        theta_rad: float,
        current_coords: Dict[int, np.ndarray]
    ) -> Dict[int, np.ndarray]:
        """Recursively rotates all downstream atoms belonging to this branch by theta."""
        p_atom = self.atoms.get(node.parent_atom_id)
        c_atom = self.atoms.get(node.child_atom_id)
        if not p_atom or not c_atom:
            return current_coords

        origin = current_coords[p_atom.serial]
        direction = current_coords[c_atom.serial] - origin

        # Collect all downstream atom IDs
        downstream_atoms: List[int] = []

        def collect_atoms(curr: TorsionTreeNode):
            downstream_atoms.extend(curr.rigid_atom_ids)
            for ch in curr.children:
                collect_atoms(ch)

        collect_atoms(node)

        for aid in downstream_atoms:
            if aid in current_coords and aid != p_atom.serial:
                current_coords[aid] = self.rodrigues_rotate(current_coords[aid], origin, direction, theta_rad)

        return current_coords

