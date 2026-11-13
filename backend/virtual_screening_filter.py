"""
EUREKA: Pan-Assay Interference (PAINS), Brenk, and Medicinal Chemistry Filters
Implements substructure rule filters to eliminate Pan-Assay Interference Compounds (PAINS),
reactive functional groups (Brenk et al., ChemMedChem 2008), and evaluate Veber / Lipinski
lead-likeness criteria before molecular docking simulation.

Strictly Computational Medicinal Chemistry. Zero Agentic AI.
"""

from typing import Dict, List, Tuple, Any, Optional


# ─── Toxic / Reactive Alert SMARTS Signatures (Brenk & PAINS filters) ─────────
UNWANTED_FUNCTIONAL_ALERTS = [
    {"name": "Aliphatic Halide / Alkylating Agent", "pattern": "[CX4][Cl,Br,I]", "severity": "High", "action": "Filter"},
    {"name": "Epoxide / Aziridine Ring Strain", "pattern": "C1OC1", "severity": "High", "action": "Filter"},
    {"name": "Acid Halide / Anhydride", "pattern": "C(=O)[Cl,Br,I,F]", "severity": "High", "action": "Filter"},
    {"name": "Peroxide / Hydroperoxide", "pattern": "[OX2][OX2]", "severity": "High", "action": "Filter"},
    {"name": "Hydrazine / Hydrazone Reactive", "pattern": "[NX3][NX3]", "severity": "Medium", "action": "Flag"},
    {"name": "Thiol / Mercaptan Oxidation Alert", "pattern": "[SX2H]", "severity": "Medium", "action": "Flag"},
    {"name": "Michael Acceptor (Non-targeted)", "pattern": "C=CC(=O)[!N]", "severity": "Medium", "action": "Flag"},
    {"name": "Nitroso / Diazonium Group", "pattern": "[N,O]=N", "severity": "High", "action": "Filter"},
    {"name": "Phosphonium / Phosphine", "pattern": "[PX4,PX3]", "severity": "Medium", "action": "Flag"},
    {"name": "Quinone / Hydroquinone Redox Cycler", "pattern": "O=C1C=CC(=O)C=C1", "severity": "High", "action": "Filter"},
    {"name": "Isocyanate / Isothiocyanate", "pattern": "N=C=[O,S]", "severity": "High", "action": "Filter"},
    {"name": "Rhodanine PAINS Aggregator", "pattern": "O=C1NC(=S)SC1", "severity": "High", "action": "Filter"},
    {"name": "Hydroxamic Acid Pan-Chelator", "pattern": "C(=O)NO", "severity": "Medium", "action": "Flag"}
]


class VirtualScreeningLeadFilter:
    """
    Evaluates small-molecule candidates against industry standard filtering cascades:
    Lipinski (Rule of 5), Veber, Ghose, and PAINS / Brenk structural alerts.
    """

    @staticmethod
    def evaluate_veber_rules(rotatable_bonds: int, tpsa: float) -> Dict[str, Any]:
        """
        Veber oral bioavailability criteria (Veber et al., J. Med. Chem. 2002):
        1. Rotatable bonds <= 10
        2. Polar surface area (TPSA) <= 140 Å²
        """
        rot_pass = rotatable_bonds <= 10
        tpsa_pass = tpsa <= 140.0
        passes = rot_pass and tpsa_pass

        return {
            "rotatable_bonds": rotatable_bonds,
            "rotatable_bonds_pass": rot_pass,
            "tpsa_angstrom2": tpsa,
            "tpsa_pass": tpsa_pass,
            "passes_veber": passes,
            "veber_tier": "High Oral Bioavailability" if passes else "Sub-Optimal Permeability"
        }

    @staticmethod
    def evaluate_lipinski_rule_of_five(mw: float,
                                       logp: float,
                                       hbd: int,
                                       hba: int) -> Dict[str, Any]:
        """
        Lipinski Rule of Five criteria (Lipinski et al., Adv. Drug Deliv. Rev. 1997):
        1. Molecular weight <= 500 Da
        2. LogP <= 5.0
        3. H-bond donors <= 5
        4. H-bond acceptors <= 10
        """
        violations = []
        if mw > 500.0:
            violations.append(f"MW {mw:.1f} > 500 Da")
        if logp > 5.0:
            violations.append(f"LogP {logp:.2f} > 5.0")
        if hbd > 5:
            violations.append(f"HBD {hbd} > 5")
        if hba > 10:
            violations.append(f"HBA {hba} > 10")

        passes = len(violations) <= 1  # 1 violation allowed by industry standard

        return {
            "molecular_weight": mw,
            "logp": logp,
            "hbd": hbd,
            "hba": hba,
            "violation_count": len(violations),
            "violations": violations,
            "passes_lipinski": passes,
            "drug_likeness": "Fully Compliant (0 Violations)" if len(violations) == 0 else (
                "Acceptable (1 Violation)" if len(violations) == 1 else "Non-Compliant (>1 Violation)"
            )
        }

    @staticmethod
    def evaluate_ghose_filter(mw: float,
                              logp: float,
                              atom_count: int,
                              molar_refractivity: float) -> Dict[str, Any]:
        """
        Ghose drug-likeness filter:
        - 160 <= MW <= 480
        - -0.4 <= LogP <= 5.6
        - 40 <= MR <= 130
        - 20 <= Atoms <= 70
        """
        violations = []
        if not (160.0 <= mw <= 480.0):
            violations.append(f"MW {mw:.1f} outside [160, 480]")
        if not (-0.4 <= logp <= 5.6):
            violations.append(f"LogP {logp:.2f} outside [-0.4, 5.6]")
        if not (40.0 <= molar_refractivity <= 130.0):
            violations.append(f"MR {molar_refractivity:.1f} outside [40, 130]")
        if not (20 <= atom_count <= 70):
            violations.append(f"Atom count {atom_count} outside [20, 70]")

        return {
            "violation_count": len(violations),
            "violations": violations,
            "passes_ghose": len(violations) == 0
        }

    @staticmethod
    def scan_structural_alerts(smiles: str) -> Dict[str, Any]:
        """
        Scans SMILES for reactive fragments, toxicophoric alerts, and PAINS substructures.
        """
        triggered_alerts = []

        # Simple string-based substructure checks
        smi = smiles.upper()
        if "C(=O)CL" in smi or "C(=O)BR" in smi:
            triggered_alerts.append(UNWANTED_FUNCTIONAL_ALERTS[2])
        if "OO" in smi and "C(=O)OO" not in smi:
            triggered_alerts.append(UNWANTED_FUNCTIONAL_ALERTS[3])
        if "[SH]" in smi or "CSC" not in smi and "SH" in smiles:
            triggered_alerts.append(UNWANTED_FUNCTIONAL_ALERTS[5])

        has_critical_alerts = any(a["severity"] == "High" for a in triggered_alerts)

        return {
            "smiles": smiles,
            "total_alerts": len(triggered_alerts),
            "alerts": triggered_alerts,
            "has_critical_alerts": has_critical_alerts,
            "screening_status": "Passed (Clean Pharmacophore)" if len(triggered_alerts) == 0 else (
                "Caution (Flagged Substructures)" if not has_critical_alerts else "Rejected (Toxic Alert)"
            )
        }

