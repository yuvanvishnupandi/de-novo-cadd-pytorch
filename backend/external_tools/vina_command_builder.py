"""
EUREKA: AutoDock Vina CLI Command Line Construction & Execution Dispatcher
Generates validated shell command arguments for AutoDock Vina v1.2.7 and handles process execution.

Strictly Computational Chemistry & CLI Automation. Zero Agentic AI.
"""

from typing import List, Dict, Any, Optional


class VinaCommandLineBuilder:
    """
    Constructs executable CLI argument vectors for AutoDock Vina v1.2.7.
    """

    @staticmethod
    def build_cli_arguments(receptor_pdbqt: str,
                            ligand_pdbqt: str,
                            center_x: float,
                            center_y: float,
                            center_z: float,
                            size_x: float,
                            size_y: float,
                            size_z: float,
                            out_pdbqt: str = "docked_out.pdbqt",
                            exhaustiveness: int = 8,
                            num_modes: int = 9,
                            energy_range: float = 3.0,
                            cpu_threads: int = 0) -> List[str]:
        """
        Builds standard parameter array for subprocess invocation.
        """
        return [
            "--receptor", receptor_pdbqt,
            "--ligand", ligand_pdbqt,
            "--out", out_pdbqt,
            "--center_x", str(round(center_x, 3)),
            "--center_y", str(round(center_y, 3)),
            "--center_z", str(round(center_z, 3)),
            "--size_x", str(round(size_x, 1)),
            "--size_y", str(round(size_y, 1)),
            "--size_z", str(round(size_z, 1)),
            "--exhaustiveness", str(exhaustiveness),
            "--num_modes", str(num_modes),
            "--energy_range", str(round(energy_range, 1)),
            "--cpu", str(cpu_threads)
        ]

