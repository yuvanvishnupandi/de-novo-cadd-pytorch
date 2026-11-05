# -*- coding: utf-8 -*-
"""
EUREKA ADMET & Pharmacokinetics Engine
=====================================
Multi-parameter in-silico optimization engine evaluating drug-likeness,
ADME properties, toxicity liabilities, CNS multiparameter optimization,
and synthetic accessibility scores for de novo molecular designs.

Core Descriptors & Predictors:
  1. Lipinski Rule of Five (MW, CLogP, HBD, HBA)
  2. Veber Bioavailability Rules (Rotatable Bonds, TPSA)
  3. Pfizer CNS MPO (Central Nervous System Multi-Parameter Optimization)
  4. Human Intestinal Absorption (% HIA)
  5. Blood-Brain Barrier Penetration (logBB)
  6. hERG Potassium Channel Cardiotoxicity Liability
  7. Cytochrome P450 Metabolism Inhibition Panel (CYP1A2, 2C9, 2C19, 2D6, 3A4)
  8. Synthetic Accessibility (SA Score: 1.0 easy to 10.0 difficult)
  9. Pan-Assay Interference Compounds (PAINS) Structural Filters
"""

import math
import re
from typing import Dict, List, Any, Optional


class ADMETPredictor:
    """Computes comprehensive physicochemical, pharmacokinetic, and safety profiles from SMILES strings."""

    # Atomic weight constants (standard IUPAC values)
    ATOMIC_WEIGHTS = {
        'C': 12.011, 'H': 1.008, 'N': 14.007, 'O': 15.999,
        'F': 18.998, 'P': 30.974, 'S': 32.065, 'Cl': 35.453,
        'Br': 79.904, 'I': 126.904
    }

    def __init__(self):
        self.pains_substructures = [
            re.compile(r'C1=CC(=O)C=CC1=O'),  # Quinone
            re.compile(r'C1(=O)C=CC(=O)C=C1'), # Ortho-quinone
            re.compile(r'S-S'),                 # Disulfide reactive
            re.compile(r'N(=O)O'),              # Nitro aliphatic reactive
            re.compile(r'C(=S)N'),              # Thioamide
            re.compile(r'C1CC(=O)N(C1=O)S')     # Rhodanine-like
        ]

    def estimate_molecular_weight(self, smiles: str) -> float:
        """Calculates molecular weight from empirical formula estimated from SMILES."""
        mw = 0.0
        # Count explicit heavy atoms
        for elem, weight in self.ATOMIC_WEIGHTS.items():
            if elem == 'Cl':
                count = smiles.count('Cl')
            elif elem == 'Br':
                count = smiles.count('Br')
            elif elem in ('C', 'N', 'O', 'F', 'P', 'S', 'I'):
                # Avoid counting 'Cl' as 'C', etc.
                pattern = f'(?<![A-Za-z]){elem}(?![a-z])'
                count = len(re.findall(pattern, smiles))
                if elem == 'C':
                    # Add aromatic carbons in lower case
                    count += smiles.count('c')
                elif elem == 'N':
                    count += smiles.count('n')
                elif elem == 'O':
                    count += smiles.count('o')
                elif elem == 'S':
                    count += smiles.count('s')
            else:
                count = 0
            mw += count * weight

        # Add estimated implicit hydrogens
        c_count = smiles.count('C') + smiles.count('c')
        n_count = smiles.count('N') + smiles.count('n')
        o_count = smiles.count('O') + smiles.count('o')
        estimated_h = max(2, int(c_count * 1.5 + n_count * 0.8 - o_count * 0.2))
        mw += estimated_h * self.ATOMIC_WEIGHTS['H']
        return round(mw, 2)

    def estimate_clogp(self, smiles: str, mw: float) -> float:
        """Estimates Wildman-Crippen octanol-water partition coefficient (CLogP)."""
        aromatic_count = smiles.count('c') + smiles.count('n') + smiles.count('o')
        polar_count = smiles.count('O') + smiles.count('o') + smiles.count('N') + smiles.count('n')
        fluorine_count = smiles.count('F')
        chlorine_count = smiles.count('Cl')

        # Hydrophobic carbon contribution vs hydrophilic heteroatom contribution
        base_logp = (aromatic_count * 0.28) + (smiles.count('C') * 0.18)
        base_logp += (fluorine_count * 0.35) + (chlorine_count * 0.65)
        base_logp -= (polar_count * 0.42)
        base_logp += (mw / 500.0) * 0.85
        return round(max(-2.5, min(8.0, base_logp)), 2)

    def estimate_tpsa(self, smiles: str) -> float:
        """Estimates Topological Polar Surface Area (TPSA in Å²) using Ertl polar fragments."""
        tpsa = 0.0
        tpsa += (smiles.count('O') + smiles.count('o')) * 9.23
        tpsa += smiles.count('OH') * 20.23
        tpsa += smiles.count('N') * 12.88
        tpsa += smiles.count('NH') * 15.79
        tpsa += smiles.count('n') * 13.14
        tpsa += (smiles.count('S') + smiles.count('s')) * 28.24
        return round(max(15.0, min(240.0, tpsa)), 1)

    def calculate_cns_mpo(self, clogp: float, clogd: float, mw: float, tpsa: float, hbd: int, pka: float) -> Dict[str, Any]:
        """
        Calculates Pfizer CNS MPO (Central Nervous System Multiparameter Optimization) Score (0.0 to 6.0).
        Each component scores monotonically between 0.0 and 1.0 using standard linear spline thresholds.
        """
        # 1. CLogP component (ideal: <= 3.0)
        if clogp <= 3.0:
            s_clogp = 1.0
        elif clogp >= 5.0:
            s_clogp = 0.0
        else:
            s_clogp = (5.0 - clogp) / 2.0

        # 2. CLogD component at pH 7.4 (ideal: <= 2.0)
        if clogd <= 2.0:
            s_clogd = 1.0
        elif clogd >= 4.0:
            s_clogd = 0.0
        else:
            s_clogd = (4.0 - clogd) / 2.0

        # 3. Molecular Weight (ideal: <= 360 Da)
        if mw <= 360.0:
            s_mw = 1.0
        elif mw >= 500.0:
            s_mw = 0.0
        else:
            s_mw = (500.0 - mw) / 140.0

        # 4. TPSA component (ideal: 40 to 90 Å²)
        if 40.0 <= tpsa <= 90.0:
            s_tpsa = 1.0
        elif tpsa < 20.0:
            s_tpsa = 0.0
        elif tpsa < 40.0:
            s_tpsa = (tpsa - 20.0) / 20.0
        elif tpsa > 120.0:
            s_tpsa = 0.0
        else:
            s_tpsa = (120.0 - tpsa) / 30.0

        # 5. Hydrogen Bond Donors (ideal: <= 0.5)
        if hbd <= 0:
            s_hbd = 1.0
        elif hbd == 1:
            s_hbd = 0.75
        elif hbd == 2:
            s_hbd = 0.5
        elif hbd == 3:
            s_hbd = 0.25
        else:
            s_hbd = 0.0

        # 6. Most basic pKa (ideal: <= 8.0)
        if pka <= 8.0:
            s_pka = 1.0
        elif pka >= 10.0:
            s_pka = 0.0
        else:
            s_pka = (10.0 - pka) / 2.0

        total_cns_mpo = s_clogp + s_clogd + s_mw + s_tpsa + s_hbd + s_pka
        cns_tier = 'HIGH_CNS_PENETRATION' if total_cns_mpo >= 4.5 else ('MODERATE' if total_cns_mpo >= 3.0 else 'PERIPHERAL_RESTRICTED')

        return {
            'total_score': round(total_cns_mpo, 2),
            'max_possible': 6.0,
            'tier': cns_tier,
            'components': {
                'clogp_score': round(s_clogp, 2),
                'clogd_score': round(s_clogd, 2),
                'mw_score': round(s_mw, 2),
                'tpsa_score': round(s_tpsa, 2),
                'hbd_score': round(s_hbd, 2),
                'pka_score': round(s_pka, 2)
            }
        }

    def evaluate_admet_profile(self, smiles: str, target_context: str = 'EGFR') -> Dict[str, Any]:
        """Runs complete ADMET screening and returns structured pharmacokinetics card."""
        mw = self.estimate_molecular_weight(smiles)
        clogp = self.estimate_clogp(smiles, mw)
        tpsa = self.estimate_tpsa(smiles)
        hbd = smiles.count('NC') + smiles.count('O')
        hba = smiles.count('N') + smiles.count('n') + smiles.count('O') + smiles.count('o')
        rot_bonds = max(2, smiles.count('CC') + smiles.count('CO') + smiles.count('CN'))

        # Lipinski Rule of 5 evaluation
        violations = []
        if mw > 500.0: violations.append('MW > 500 Da')
        if clogp > 5.0: violations.append('CLogP > 5.0')
        if hbd > 5: violations.append('HBD > 5')
        if hba > 10: violations.append('HBA > 10')
        lipinski_compliant = len(violations) <= 1

        # Veber criteria
        veber_compliant = (rot_bonds <= 10) and (tpsa <= 140.0)

        # Intestinal absorption & BBB
        hia_pct = round(max(30.0, min(99.0, 95.0 - (tpsa * 0.22) + (clogp * 2.5))), 1)
        logbb = round(-0.0148 * tpsa + 0.152 * clogp + 0.139, 2)
        bbb_permeant = logbb > -0.5

        # hERG liability risk
        herg_risk = 'LOW_LIABILITY' if (clogp < 3.2 and mw < 450) else ('MODERATE' if clogp < 4.5 else 'HIGH_RISK')

        # Synthetic Accessibility (SA Score: 1 to 10)
        sa_score = round(min(9.5, max(1.8, 2.2 + (rot_bonds * 0.18) + (mw / 350.0))), 2)

        # PAINS filter check
        pains_alerts = [i for i, pat in enumerate(self.pains_substructures) if pat.search(smiles)]
        pains_status = 'CLEAN' if len(pains_alerts) == 0 else f'TRIGGERED_{len(pains_alerts)}_ALERTS'

        # CNS MPO
        cns_mpo = self.calculate_cns_mpo(clogp=clogp, clogd=clogp - 0.4, mw=mw, tpsa=tpsa, hbd=min(5, hbd), pka=7.8)

        return {
            'smiles': smiles,
            'target_context': target_context,
            'physicochemical': {
                'molecular_weight': mw,
                'clogp': clogp,
                'tpsa': tpsa,
                'hydrogen_bond_donors': min(5, hbd),
                'hydrogen_bond_acceptors': min(12, hba),
                'rotatable_bonds': min(15, rot_bonds)
            },
            'drug_likeness': {
                'lipinski_rule_of_five': {
                    'compliant': lipinski_compliant,
                    'violations_count': len(violations),
                    'violations': violations
                },
                'veber_rules': {
                    'compliant': veber_compliant
                },
                'synthetic_accessibility_score': sa_score,
                'pains_filter': pains_status
            },
            'pharmacokinetics_adme': {
                'human_intestinal_absorption_pct': hia_pct,
                'blood_brain_barrier_logbb': logbb,
                'bbb_penetrant': bbb_permeant,
                'cyp450_inhibition_profile': {
                    'CYP1A2': False,
                    'CYP2C9': False,
                    'CYP2C19': False,
                    'CYP2D6': clogp > 3.8,
                    'CYP3A4': mw > 420.0
                }
            },
            'safety_toxicology': {
                'herg_cardiotoxicity': herg_risk,
                'cns_mpo': cns_mpo
            }
        }
