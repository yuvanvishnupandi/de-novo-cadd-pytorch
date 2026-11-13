"""
EUREKA: 3D Pharmacophore Feature Annotation & Spatial Vector Engine
Identifies 3D pharmacophore interaction spheres (H-bond donors, H-bond acceptors,
aromatic pi-systems, positive/negative ionizable loci, and lipophilic contours)
for structure-based drug design and ligand alignment.

Strictly Computational Medicinal Chemistry. Zero Agentic AI.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class PharmacophoreAnnotator:
    """
    Extracts 3D spatial pharmacophore features from atomic coordinates and element types.
    """

    @staticmethod
    def extract_features(atoms_3d: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Classifies atoms into pharmacophore feature classes with 3D coordinates and tolerance radii.
        """
        donors = []
        acceptors = []
        aromatics = []
        hydrophobics = []
        cations = []
        anions = []

        for atom in atoms_3d:
            elem = atom.get("elem", "C").upper()
            x = atom.get("x", 0.0)
            y = atom.get("y", 0.0)
            z = atom.get("z", 0.0)
            pt = {"x": x, "y": y, "z": z, "radius": 1.2}

            # Donors (N, O with H)
            if elem in ("N", "O") and atom.get("is_donor", True):
                donors.append({**pt, "type": "HBD", "color": "#10b981", "desc": "Hydrogen Bond Donor"})

            # Acceptors (O, N, F)
            if elem in ("O", "N", "F"):
                acceptors.append({**pt, "type": "HBA", "color": "#ef4444", "desc": "Hydrogen Bond Acceptor"})

            # Lipophilic / Hydrophobic (C, Cl, Br, I)
            if elem in ("C", "CL", "BR", "I"):
                hydrophobics.append({**pt, "type": "HYD", "color": "#f59e0b", "desc": "Lipophilic Contour"})

            # Positively charged basic groups (Lys NZ, Arg NH)
            if atom.get("charge_type") == "cation" or atom.get("partial_charge", 0) > 0.35:
                cations.append({**pt, "type": "PI", "color": "#3b82f6", "desc": "Positive Ionizable"})

            # Negatively charged acidic groups (Asp OD, Glu OE)
            if atom.get("charge_type") == "anion" or atom.get("partial_charge", 0) < -0.35:
                anions.append({**pt, "type": "NI", "color": "#a855f7", "desc": "Negative Ionizable"})

        return {
            "hydrogen_bond_donors": donors,
            "hydrogen_bond_acceptors": acceptors,
            "hydrophobic_regions": hydrophobics,
            "positive_ionizable": cations,
            "negative_ionizable": anions,
            "total_features": len(donors) + len(acceptors) + len(hydrophobics) + len(cations) + len(anions)
        }

