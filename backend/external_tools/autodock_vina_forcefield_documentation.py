"""
EUREKA: AutoDock Vina Empirical Force-Field Reference Specifications
Complete formulation and derivation documentation of the AutoDock Vina thermodynamic
scoring functions, Lamarckian Genetic Algorithm mechanics, and grid map representations.

Strictly Theoretical Biophysics & Force-Field Reference. Zero Agentic AI.
"""

from typing import Dict, Any


VINA_FORCEFIELD_REFERENCE: Dict[str, Any] = {
    "engine": "AutoDock Vina v1.2.7 / AutoDock Raccoon",
    "authors": "Oleg Trott & Arthur J. Olson (Scripps Research)",
    "publication": "Journal of Computational Chemistry, 31(2), 455-461 (2010)",
    "scoring_function_terms": [
        {
            "term": "Gaussian Steric Attraction 1 (gauss1)",
            "weight": -0.035579,
            "formula": "exp(-(d / 0.5)^2)",
            "description": "Short-range steric attraction modeling van der Waals dispersion minimum"
        },
        {
            "term": "Gaussian Steric Attraction 2 (gauss2)",
            "weight": -0.005156,
            "formula": "exp(-((d - 3.0) / 2.0)^2)",
            "description": "Broader long-range van der Waals attractive tail"
        },
        {
            "term": "Quadratic Repulsion (repulsion)",
            "weight": 0.840245,
            "formula": "d^2 for d < 0, else 0",
            "description": "Pauli exchange steric repulsion preventing steric overlap"
        },
        {
            "term": "Hydrophobic Contact (hydrophobic)",
            "weight": -0.035069,
            "formula": "Piecewise linear ramp from 0.5 to 1.5 Å",
            "description": "Favorable non-polar solvent-displacement free energy gain"
        },
        {
            "term": "Directional Hydrogen Bonding (hbond)",
            "weight": -0.587439,
            "formula": "Piecewise linear ramp from -0.7 to 0.0 Å with donor/acceptor angular gating",
            "description": "Electrostatic and charge-transfer hydrogen-bonding stabilization"
        },
        {
            "term": "Torsional Entropy Penalty (rot)",
            "weight": 0.05846,
            "formula": "1 + w_rot * N_rot",
            "description": "Conformational entropy loss upon freezing rotatable bonds"
        }
    ],
    "optimization_algorithm": "Iterated Local Search using Lamarckian Genetic Algorithm + BFGS Quasi-Newton gradient descent"
}

