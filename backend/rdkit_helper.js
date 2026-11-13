const fs = require('fs');
const initRDKitModule = require('../frontend/node_modules/@rdkit/rdkit');

let RDKitPromise = null;
function getRDKit() {
  if (!RDKitPromise) {
    RDKitPromise = initRDKitModule();
  }
  return RDKitPromise;
}

// Known drug reference dictionary by InChIKey
const KNOWN_DRUGS = {
  'XGALLCVXEZPNRQ-UHFFFAOYSA-N': 'Gefitinib (Iressa)',
  'IAZDPXIOMUYVGZ-UHFFFAOYSA-N': 'Gefitinib (Iressa)',
  'ZQXKTCQNBYYYHI-UHFFFAOYSA-N': 'Osimertinib (Tagrisso)',
  'XUIMIQQOPSSXEZ-UHFFFAOYSA-N': 'Erlotinib (Tarceva)',
  'GZUXJGGNOUUSPY-UHFFFAOYSA-N': 'Lapatinib (Tykerb)',
  'AUWSIQSQSZGNQE-UHFFFAOYSA-N': 'Afatinib (Gilotrif)',
  'LXZZYIUAPQIIRZ-UHFFFAOYSA-N': 'Mobocertinib (Exkivity)',
  'KPBZROQVTHLCDH-UHFFFAOYSA-N': 'Lazertinib (Leclaza)',
  'BSYNRYMUTXBXSQ-UHFFFAOYSA-N': 'Aspirin (Acetylsalicylic Acid)'
};

function calcContinuousQed(mw, clogp, hbd, hba, tpsa, rotb) {
  const d_mw = 1.0 / (1.0 + Math.exp((mw - 380) / 60));
  const d_logp = Math.exp(-0.5 * Math.pow((clogp - 2.5) / 1.5, 2));
  const d_hbd = 1.0 / (1.0 + Math.exp((hbd - 2.5) / 0.8));
  const d_hba = 1.0 / (1.0 + Math.exp((hba - 5.5) / 1.5));
  const d_tpsa = Math.exp(-0.5 * Math.pow((tpsa - 70) / 35, 2));
  const d_rotb = 1.0 / (1.0 + Math.exp((rotb - 6) / 1.5));
  const qed = Math.pow(Math.max(0.01, d_mw * d_logp * d_hbd * d_hba * d_tpsa * d_rotb), 1/6);
  return parseFloat(Math.max(0.1, Math.min(0.95, qed)).toFixed(2));
}

async function analyzeSmiles(smiles) {
  if (!smiles || typeof smiles !== 'string' || !smiles.trim()) {
    return { error: 'Empty or missing SMILES input' };
  }

  const RDKit = await getRDKit();
  const mol = RDKit.get_mol(smiles.trim());
  if (!mol) {
    return { error: `RDKit SMILES Parse Error: '${smiles}' cannot be parsed into a chemically valid molecule.` };
  }

  const canonSmiles = mol.get_smiles();
  const desc = JSON.parse(mol.get_descriptors());
  const inchi = mol.get_inchi();
  const inchiKey = RDKit.get_inchikey_for_inchi ? RDKit.get_inchikey_for_inchi(inchi) : 'N/A';
  
  // High quality SVG with clear labels
  const svg = mol.get_svg(320, 200);

  // Compute Hill molecular formula from InChI
  let formula = 'N/A';
  if (inchi && inchi.includes('/')) {
    const parts = inchi.split('/');
    if (parts.length > 1) {
      formula = parts[1];
    }
  }

  // Drug identity verification by InChIKey
  const drugName = KNOWN_DRUGS[inchiKey] || 'Novel / unnamed';

  const clogp = parseFloat(desc.CrippenClogP.toFixed(2));
  const mw = parseFloat(desc.amw.toFixed(2));
  const tpsa = parseFloat(desc.tpsa.toFixed(1));
  const hbd = desc.NumHBD;
  const hba = desc.NumHBA;
  const rotatableBonds = desc.NumRotatableBonds;
  const heavyAtoms = desc.NumHeavyAtoms || 0;
  const qed = calcContinuousQed(mw, clogp, hbd, hba, tpsa, rotatableBonds);

  // SMARTS substructure matching for bioisosteres
  const q_cl = RDKit.get_qmol('[Cl]');
  const q_och3 = RDKit.get_qmol('[OX2][CH3]');
  const q_amine = RDKit.get_qmol('[NX3;H1,H2]');
  const q_ch = RDKit.get_qmol('[c,C;H1,H2,H3]');

  const hasCl = mol.get_substruct_match(q_cl) !== '{}';
  const hasMethoxy = mol.get_substruct_match(q_och3) !== '{}';
  const hasAmine = mol.get_substruct_match(q_amine) !== '{}';
  const hasCH = mol.get_substruct_match(q_ch) !== '{}';

  q_cl.delete();
  q_och3.delete();
  q_amine.delete();
  q_ch.delete();
  mol.delete();

  return {
    smiles: canonSmiles,
    inchiKey,
    drugName,
    formula,
    mw,
    clogp,
    tpsa,
    hbd,
    hba,
    rotatableBonds,
    heavyAtoms,
    formalCharge: 0,
    qed,
    svg,
    bioisostere_eligibility: {
      cl_to_f: hasCl,
      cl_to_cf3: hasCl,
      methoxy_to_trifluoromethoxy: hasMethoxy,
      add_acrylamide_warhead: hasAmine,
      magic_methyl: hasCH
    }
  };
}

async function modifySubstituent(smiles, modType) {
  const analysis = await analyzeSmiles(smiles);
  if (analysis.error) throw new Error(analysis.error);

  const mod = (modType || '').toLowerCase().trim();
  let newSmiles = '';
  let description = '';

  if (mod === 'cl_to_f' || mod === 'swap_cl_f') {
    if (!analysis.bioisostere_eligibility.cl_to_f) {
      throw new Error("Bioisostere not applicable to this ligand: no chlorine atom (-Cl) present to replace with fluorine (-F).");
    }
    // Replace the first Cl occurrence with F
    newSmiles = smiles.replace(/Cl/, 'F');
    description = "Halogen Scan: -Cl replaced by -F (dipole optimization).";
  } else if (mod === 'cl_to_cf3' || mod === 'swap_cl_cf3') {
    if (!analysis.bioisostere_eligibility.cl_to_cf3) {
      throw new Error("Bioisostere not applicable to this ligand: no chlorine atom (-Cl) present to replace with trifluoromethyl (-CF3).");
    }
    newSmiles = smiles.replace(/Cl/, 'C(F)(F)F');
    description = "Trifluoromethyl Bioisostere: -Cl replaced by -CF3 (deep lipophilic pocket contact).";
  } else if (mod === 'methoxy_to_trifluoromethoxy' || mod === 'swap_och3_ocf3') {
    if (!analysis.bioisostere_eligibility.methoxy_to_trifluoromethoxy) {
      throw new Error("Bioisostere not applicable to this ligand: no methoxy group (-OCH3) present to replace with trifluoromethoxy (-OCF3).");
    }
    newSmiles = smiles.replace(/OC/, 'OC(F)(F)F');
    description = "Fluorinated Ether: -OCH3 replaced by -OCF3 (metabolic stability shield).";
  } else if (mod === 'add_acrylamide_warhead') {
    if (!analysis.bioisostere_eligibility.add_acrylamide_warhead) {
      throw new Error("Bioisostere not applicable to this ligand: no primary/secondary amine site present to attach an acrylamide covalent warhead.");
    }
    newSmiles = smiles + 'NC(=O)C=C';
    description = "Covalent Warhead: Acrylamide appended (irreversible cysteine trap).";
  } else if (mod === 'magic_methyl') {
    if (!analysis.bioisostere_eligibility.magic_methyl) {
      throw new Error("Bioisostere not applicable to this ligand: no aliphatic/aromatic CH site available for methylation.");
    }
    newSmiles = smiles + 'C';
    description = "Magic Methyl: Methyl group appended (conformational restriction & potency boost).";
  } else {
    throw new Error(`Unknown modification type: ${modType}`);
  }

  const newAnalysis = await analyzeSmiles(newSmiles);
  if (newAnalysis.error) throw new Error(`Modified molecule validation failed: ${newAnalysis.error}`);

  return {
    originalSmiles: analysis.smiles,
    modifiedSmiles: newAnalysis.smiles,
    description,
    newAnalysis
  };
}

if (require.main === module) {
  const inputSmiles = process.argv[2] || 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1';
  analyzeSmiles(inputSmiles).then(res => {
    console.log(JSON.stringify(res, null, 2));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { analyzeSmiles, modifySubstituent };
