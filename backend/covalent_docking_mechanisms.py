"""
EUREKA: Targeted Covalent Inhibitor (TCI) Kinetic & Thermodynamic Modeling Engine
Simulates two-step covalent docking: reversible non-covalent binding (K_i) followed by
irreversible chemical bond formation (k_inact) targeting catalytic nucleophiles (Cys145, Cys797, Cys12).

Strictly Computational Chemical Kinetics & Transition State Theory. Zero Agentic AI.
"""

import math
from typing import Dict, List, Tuple, Any, Optional


class CovalentInhibitorKineticModel:
    """
    Two-step covalent binding reaction model:
    E + I <==> E:I (K_i) ---> E-I (k_inact)
    Second-order inactivation rate constant: k_inact / K_i.
    """

    # Reaction barrier parameters for validated warhead-nucleophile pairs
    WARHEAD_REACTION_PARAMETERS = {
        "acrylamide": {
            "target_residue": "CYS",
            "mechanism": "Michael Addition (1,4-conjugate)",
            "activation_barrier_kcal": 15.2,
            "k_inact_s_inv": 0.048,
            "reversibility": "Irreversible"
        },
        "chloroacetamide": {
            "target_residue": "CYS",
            "mechanism": "Aliphatic Nucleophilic Substitution (SN2)",
            "activation_barrier_kcal": 13.8,
            "k_inact_s_inv": 0.125,
            "reversibility": "Irreversible"
        },
        "cyanoacrylamide": {
            "target_residue": "CYS",
            "mechanism": "Reversible Michael Addition",
            "activation_barrier_kcal": 14.1,
            "k_inact_s_inv": 0.082,
            "reversibility": "Reversible Covalent"
        },
        "vinylsulfonamide": {
            "target_residue": "CYS",
            "mechanism": "Vinyl Sulfonyl Addition",
            "activation_barrier_kcal": 16.0,
            "k_inact_s_inv": 0.022,
            "reversibility": "Irreversible"
        }
    }

    @staticmethod
    def calculate_covalent_kinetics(non_covalent_delta_g: float,
                                    warhead_type: str = "acrylamide",
                                    nucleophile_distance_angstrom: float = 1.85) -> Dict[str, Any]:
        """
        Computes two-step covalent inhibition kinetics:
        K_i = exp(delta_g / RT)
        k_inact = (k_B * T / h) * exp(-delta_G_dagger / RT)
        k_inact_over_ki = k_inact / K_i (M^-1 s^-1)
        """
        rt = 0.5925
        k_b_over_h = 6.2124e12  # s^-1 at 298.15 K

        params = CovalentInhibitorKineticModel.WARHEAD_REACTION_PARAMETERS.get(
            warhead_type, CovalentInhibitorKineticModel.WARHEAD_REACTION_PARAMETERS["acrylamide"]
        )

        # Distance penalty if warhead beta-carbon is misaligned with nucleophilic sulfur
        dist_penalty = max(0.0, (nucleophile_distance_angstrom - 2.0) * 2.5)
        effective_barrier = params["activation_barrier_kcal"] + dist_penalty

        ki_molar = math.exp(non_covalent_delta_g / rt)
        ki_nm = round(ki_molar * 1e9, 2)

        k_inact = k_b_over_h * math.exp(-effective_barrier / rt)
        k_inact = round(k_inact, 4)

        # Inactivation efficiency (M^-1 s^-1)
        k_inact_over_ki = round(k_inact / max(1e-12, ki_molar), 1)

        return {
            "warhead": warhead_type,
            "mechanism": params["mechanism"],
            "reversibility": params["reversibility"],
            "non_covalent_ki_nm": ki_nm,
            "k_inact_s_inv": k_inact,
            "inactivation_efficiency_m_inv_s_inv": k_inact_over_ki,
            "nucleophile_distance_angstrom": nucleophile_distance_angstrom,
            "chemical_activation_barrier_kcal": round(effective_barrier, 2),
            "potency_tier": "Exceptional TCI Potency (> 100,000 M^-1 s^-1)" if k_inact_over_ki > 100000 else "Potent Covalent Lead"
        }

