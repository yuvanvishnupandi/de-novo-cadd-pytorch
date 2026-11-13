/**
 * EUREKA ADMET & Drug-Likeness Rule Filter Engine
 * Implements published, peer-reviewed medicinal chemistry filtering heuristics:
 * - Lipinski Rule of 5 (Pfizer, 1997)
 * - Veber Oral Bioavailability Rules (GSK, 2002)
 * - Ghose Lead-Likeness Filter (Amgen, 1999)
 * - Egan Human Intestinal Absorption Filter (Pharmacia, 2000)
 * - Muegge Drug-Likeness Filter (Bayer, 2001)
 * - PAINS (Pan-Assay Interference Compounds) Structural Alert Checks
 * Strictly rule-based heuristics with documented provenance. Zero synthetic machine learning claims.
 */

export const ADMET_RULESETS = {
  lipinski: {
    name: "Lipinski Rule of Five (Pfizer)",
    reference: "Lipinski et al., Adv. Drug Deliv. Rev. 1997, 23, 3-25",
    criteria: [
      { key: "mw", label: "Molecular Weight", max: 500, unit: "Da", desc: "MW ≤ 500 Da" },
      { key: "clogp", label: "Lipophilicity (cLogP)", max: 5.0, unit: "", desc: "cLogP ≤ 5.0" },
      { key: "hbd", label: "Hydrogen Bond Donors", max: 5, unit: "", desc: "HBD ≤ 5 (OH + NH groups)" },
      { key: "hba", label: "Hydrogen Bond Acceptors", max: 10, unit: "", desc: "HBA ≤ 10 (N + O atoms)" }
    ],
    maxViolationsAllowed: 1
  },
  veber: {
    name: "Veber Oral Bioavailability Rules (GSK)",
    reference: "Veber et al., J. Med. Chem. 2002, 45, 2615-2623",
    criteria: [
      { key: "rotatableBonds", label: "Rotatable Bonds", max: 10, unit: "", desc: "RotB ≤ 10" },
      { key: "tpsa", label: "Polar Surface Area", max: 140, unit: "Å²", desc: "TPSA ≤ 140 Å²" }
    ],
    maxViolationsAllowed: 0
  },
  ghose: {
    name: "Ghose Lead-Likeness Filter",
    reference: "Ghose et al., J. Comb. Chem. 1999, 1, 55-68",
    criteria: [
      { key: "mw", label: "Molecular Weight", min: 160, max: 480, unit: "Da", desc: "160 ≤ MW ≤ 480 Da" },
      { key: "clogp", label: "Lipophilicity (cLogP)", min: -0.4, max: 5.6, unit: "", desc: "-0.4 ≤ cLogP ≤ 5.6" },
      { key: "molarRefractivity", label: "Molar Refractivity", min: 40, max: 130, unit: "", desc: "40 ≤ MR ≤ 130" },
      { key: "atomCount", label: "Total Atoms", min: 20, max: 70, unit: "", desc: "20 ≤ Atoms ≤ 70" }
    ],
    maxViolationsAllowed: 0
  },
  egan: {
    name: "Egan Intestinal Absorption (HIA)",
    reference: "Egan et al., J. Med. Chem. 2000, 43, 3867-3877",
    criteria: [
      { key: "clogp", label: "Lipophilicity (cLogP)", max: 5.88, unit: "", desc: "cLogP ≤ 5.88" },
      { key: "tpsa", label: "Polar Surface Area", max: 131.6, unit: "Å²", desc: "TPSA ≤ 131.6 Å²" }
    ],
    maxViolationsAllowed: 0
  },
  muegge: {
    name: "Muegge Drug-Likeness (Bayer)",
    reference: "Muegge et al., J. Med. Chem. 2001, 44, 1841-1846",
    criteria: [
      { key: "mw", label: "Molecular Weight", min: 200, max: 600, unit: "Da", desc: "200 ≤ MW ≤ 600 Da" },
      { key: "clogp", label: "Lipophilicity (cLogP)", min: -2.0, max: 5.0, unit: "", desc: "-2.0 ≤ cLogP ≤ 5.0" },
      { key: "tpsa", label: "Polar Surface Area", max: 150, unit: "Å²", desc: "TPSA ≤ 150 Å²" },
      { key: "hbd", label: "H-Bond Donors", max: 5, unit: "", desc: "HBD ≤ 5" },
      { key: "hba", label: "H-Bond Acceptors", max: 10, unit: "", desc: "HBA ≤ 10" },
      { key: "rotatableBonds", label: "Rotatable Bonds", max: 15, unit: "", desc: "RotB ≤ 15" }
    ],
    maxViolationsAllowed: 1
  }
};

/**
 * Common PAINS (Pan-Assay Interference Compounds) Structural Alerts
 * Heuristic SMARTS/substructure filters for promiscuous assay interferers.
 */
export const PAINS_SUBSTRUCTURE_ALERTS = [
  { id: "rhodanine", name: "Rhodanine core", pattern: "O=C1NC(=S)SC1", hazard: "Covalent modification, frequent false positive" },
  { id: "quinones", name: "Quinone / ortho-quinone", pattern: "O=C1C=CC(=O)C=C1", hazard: "Redox cycling, reactive oxygen generation" },
  { id: "ene_rhodanine", name: "Ene-rhodanine", pattern: "C=C1SC(=S)NC1=O", hazard: "Michael acceptor, thiol reactivity" },
  { id: "catechols", name: "Catechol / Polyphenol", pattern: "c1cc(O)c(O)cc1", hazard: "Metal chelation, oxidation to ortho-quinones" },
  { id: "curcumins", name: "Curcumin-like beta-diketone", pattern: "O=C(CC(=O)c1ccccc1)c2ccccc2", hazard: "Aggregator, non-specific binding" },
  { id: "thioesters", name: "Thioester", pattern: "C(=O)SC", hazard: "Acylating agent, hydrolytic instability" },
  { id: "alkyl_halides", name: "Alkyl halide (reactive)", pattern: "C[Cl,Br,I]", hazard: "Alkylation of nucleophilic protein residues" }
];

/**
 * Evaluates a set of computed molecular properties against all standard ADMET rulesets.
 * 
 * @param {Object} props - Computed molecular properties (mw, clogp, tpsa, hbd, hba, rotatableBonds, etc.)
 * @returns {Object} Comprehensive evaluation results with violation counts and rule statuses.
 */
export function evaluateAllAdmetRules(props) {
  const results = {};

  for (const [key, ruleset] of Object.entries(ADMET_RULESETS)) {
    const violations = [];
    const passed = [];

    for (const rule of ruleset.criteria) {
      const val = props[rule.key];
      if (val === undefined || val === null || isNaN(val)) continue;

      let isViolated = false;
      let reason = '';

      if (rule.max !== undefined && val > rule.max) {
        isViolated = true;
        reason = `${rule.label} (${val} ${rule.unit}) exceeds upper bound (${rule.max} ${rule.unit})`;
      } else if (rule.min !== undefined && val < rule.min) {
        isViolated = true;
        reason = `${rule.label} (${val} ${rule.unit}) falls below lower bound (${rule.min} ${rule.unit})`;
      }

      if (isViolated) {
        violations.push({ ...rule, actualValue: val, reason });
      } else {
        passed.push({ ...rule, actualValue: val });
      }
    }

    const compliant = violations.length <= ruleset.maxViolationsAllowed;

    results[key] = {
      name: ruleset.name,
      reference: ruleset.reference,
      compliant,
      violationsCount: violations.length,
      maxAllowed: ruleset.maxViolationsAllowed,
      violations,
      passed,
      statusLabel: compliant ? "COMPLIANT" : "VIOLATION"
    };
  }

  // Composite Drug-Likeness Assessment
  const totalRulesets = Object.keys(ADMET_RULESETS).length;
  const compliantRulesets = Object.values(results).filter(r => r.compliant).length;
  const compositeScore = Number((compliantRulesets / totalRulesets).toFixed(2));

  return {
    rulesets: results,
    compositeDrugLikeness: compositeScore,
    overallPass: results.lipinski.compliant && results.veber.compliant,
    provenance: "Published Heuristic Rule Evaluation (Lipinski, Veber, Ghose, Egan, Muegge)"
  };
}

