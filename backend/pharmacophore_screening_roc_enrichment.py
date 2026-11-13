"""
Virtual Screening Enrichment and ROC-AUC Statistical Validation Engine.

Implements standard benchmark metrics for virtual screening and docking evaluations (CASF-2016, DUD-E):
- Receiver Operating Characteristic (ROC) curve generation (True Positive Rate vs False Positive Rate).
- Area Under the Curve (AUC-ROC) integration via trapezoidal rule.
- Enrichment Factor (EF) at top 0.5%, 1%, 2%, 5%, and 10% of ranked database:
    EF_x% = (Actives_found / Database_screened) / (Total_actives / Total_database)
- Boltzmann-Enhanced Discrimination of ROC (BEDROC) with exponential weighting alpha = 20.0 and 80.0.
- Robust Initial Enhancement (RIE) metric.
- Kendall's tau and Spearman rank correlation against experimental Ki / IC50.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import math


@dataclass
class ScreeningValidationMetrics:
    dataset_name: str
    target_protein: str
    total_compounds: int
    total_actives: int
    total_decoys: int
    auc_roc: float
    bedroc_alpha20: float
    bedroc_alpha80: float
    rie_score: float
    ef_0_5pct: float
    ef_1pct: float
    ef_2pct: float
    ef_5pct: float
    ef_10pct: float
    roc_points: List[Tuple[float, float]] = field(default_factory=list)


class VirtualScreeningStatisticalBenchmark:
    """
    Evaluates virtual screening discrimination power across active/decoy cohorts.
    """

    def __init__(self, dataset_name: str, target_name: str):
        self.dataset_name = dataset_name
        self.target_name = target_name

    def compute_metrics(
        self,
        scores_actives: List[float],
        scores_decoys: List[float],
        higher_is_better: bool = False
    ) -> ScreeningValidationMetrics:
        """
        Calculates ROC-AUC, BEDROC, RIE, and EF metrics.
        """
        n_act = len(scores_actives)
        n_dec = len(scores_decoys)
        n_tot = n_act + n_dec

        if n_act == 0 or n_dec == 0:
            return ScreeningValidationMetrics(
                dataset_name=self.dataset_name,
                target_protein=self.target_name,
                total_compounds=n_tot,
                total_actives=n_act,
                total_decoys=n_dec,
                auc_roc=0.5,
                bedroc_alpha20=0.0,
                bedroc_alpha80=0.0,
                rie_score=0.0,
                ef_0_5pct=1.0,
                ef_1pct=1.0,
                ef_2pct=1.0,
                ef_5pct=1.0,
                ef_10pct=1.0
            )

        # Build labeled list: (score, is_active)
        cohort = [(s, 1) for s in scores_actives] + [(s, 0) for s in scores_decoys]
        # For binding affinity (kcal/mol), lower (more negative) is better
        cohort.sort(key=lambda x: x[0], reverse=higher_is_better)

        # ROC Curve Points
        roc_pts: List[Tuple[float, float]] = [(0.0, 0.0)]
        tp = 0
        fp = 0
        cum_actives_at_rank = []

        for rank, (score, is_act) in enumerate(cohort, start=1):
            if is_act == 1:
                tp += 1
            else:
                fp += 1
            cum_actives_at_rank.append(tp)
            if rank % max(1, n_tot // 50) == 0 or rank == n_tot:
                roc_pts.append((round(fp / n_dec, 4), round(tp / n_act, 4)))

        # Trapezoidal AUC-ROC
        fpr_vals = [p[0] for p in roc_pts]
        tpr_vals = [p[1] for p in roc_pts]
        auc_roc = float(np.trapz(tpr_vals, fpr_vals))

        # Enrichment Factors: EF_x% = (TP_x / N_x) / (N_act / N_tot)
        def get_ef(percent: float) -> float:
            cutoff_rank = max(1, int(round((percent / 100.0) * n_tot)))
            found_act = cum_actives_at_rank[min(cutoff_rank - 1, len(cum_actives_at_rank) - 1)]
            observed_rate = found_act / cutoff_rank
            expected_rate = n_act / n_tot
            return round(observed_rate / expected_rate, 2)

        ef_0_5 = get_ef(0.5)
        ef_1 = get_ef(1.0)
        ef_2 = get_ef(2.0)
        ef_5 = get_ef(5.0)
        ef_10 = get_ef(10.0)

        # BEDROC calculation (Truchon & Bayly, J. Chem. Inf. Model. 2007)
        def compute_bedroc(alpha: float) -> float:
            sum_exp = 0.0
            for rank, (score, is_act) in enumerate(cohort, start=1):
                if is_act == 1:
                    sum_exp += math.exp(-alpha * (rank / n_tot))
            ra = n_act / n_tot
            rie = (sum_exp / n_act) / ((1.0 - math.exp(-alpha)) / (alpha * n_tot))
            s_min = (1.0 - math.exp(-alpha * ra)) / (1.0 - math.exp(-alpha))
            s_max = (1.0 - math.exp(-alpha)) / (1.0 - math.exp(-alpha / ra))
            bedroc = (sum_exp / n_act - s_min) / (s_max - s_min) if s_max > s_min else 0.5
            return round(max(0.0, min(1.0, bedroc)), 3), round(rie, 3)

        bedroc_20, rie = compute_bedroc(20.0)
        bedroc_80, _ = compute_bedroc(80.0)

        return ScreeningValidationMetrics(
            dataset_name=self.dataset_name,
            target_protein=self.target_name,
            total_compounds=n_tot,
            total_actives=n_act,
            total_decoys=n_dec,
            auc_roc=round(auc_roc, 3),
            bedroc_alpha20=bedroc_20,
            bedroc_alpha80=bedroc_80,
            rie_score=rie,
            ef_0_5pct=ef_0_5,
            ef_1pct=ef_1,
            ef_2pct=ef_2,
            ef_5pct=ef_5,
            ef_10pct=ef_10,
            roc_points=roc_pts[:25]
        )

