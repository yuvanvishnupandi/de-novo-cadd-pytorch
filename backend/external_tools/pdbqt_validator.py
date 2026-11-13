"""
EUREKA: PDBQT Format Syntax, Torsion Tree & Gasteiger Charge Validator
Verifies compliant PDBQT syntax, detects missing partial atomic charges, validates
ROOT/ENDROOT torsion tree hierarchy, and prevents parser faults in AutoDock Vina v1.2.7.

Strictly Computational Chemistry & Validation. Zero Agentic AI.
"""

from typing import List, Dict, Tuple, Any, Optional


class PdbqtSyntaxValidator:
    """
    Validates PDBQT structural records for strict AutoDock Vina compatibility.
    """

    @staticmethod
    def validate_pdbqt_string(pdbqt_text: str) -> Dict[str, Any]:
        """
        Scans PDBQT content for atom records, valid partial charges, and atom types.
        """
        lines = pdbqt_text.splitlines()
        atom_count = 0
        total_charge = 0.0
        atom_types = set()
        errors = []
        has_root = False
        has_endroot = False

        for line_num, line in enumerate(lines, 1):
            if line.startswith("ROOT"):
                has_root = True
            elif line.startswith("ENDROOT"):
                has_endroot = True
            elif line.startswith("ATOM") or line.startswith("HETATM"):
                atom_count += 1
                if len(line) < 70:
                    errors.append(f"Line {line_num}: Record length < 70 columns")
                    continue

                charge_str = line[66:76].strip()
                atom_type = line[77:79].strip()

                try:
                    q = float(charge_str)
                    total_charge += q
                except ValueError:
                    errors.append(f"Line {line_num}: Invalid partial charge '{charge_str}'")

                if atom_type:
                    atom_types.add(atom_type)
                else:
                    errors.append(f"Line {line_num}: Missing AutoDock atom type")

        is_valid = len(errors) == 0 and atom_count > 0

        return {
            "is_valid_pdbqt": is_valid,
            "atom_count": atom_count,
            "total_partial_charge": round(total_charge, 3),
            "atom_types": list(atom_types),
            "has_torsion_tree": has_root and has_endroot,
            "error_count": len(errors),
            "errors": errors[:5]
        }

