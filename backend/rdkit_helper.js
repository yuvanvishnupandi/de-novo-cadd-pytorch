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
  'KPBZROQVTHLCDH-UHFFFAOYSA-N': 'Lazertinib (Leclaza)'
};

async function analyzeSmiles(smiles) {
  const RDKit = await getRDKit();
  const mol = RDKit.get_mol(smiles);
  if (!mol) {
    return { error: 'Invalid SMILES string' };
  }

  const canonSmiles = mol.get_smiles();
  const desc = JSON.parse(mol.get_descriptors());
  const inchi = mol.get_inchi();
  const inchiKey = RDKit.get_inchikey_for_inchi ? RDKit.get_inchikey_for_inchi(inchi) : 'N/A';
  const svg = mol.get_svg(280, 180);

  // Compute Hill molecular formula from inchi or atoms
  // InChI starts with e.g. InChI=1S/C22H24ClFN4O3/...
  let formula = 'N/A';
  if (inchi && inchi.includes('/')) {
    const parts = inchi.split('/');
    if (parts.length > 1) {
      formula = parts[1]; // First part after InChI=1S/ is the chemical formula in Hill notation!
    }
  }

  // Name resolution
  const drugName = KNOWN_DRUGS[inchiKey] || 'Novel / unnamed';

  const clogp = desc.CrippenClogP;
  const mw = desc.amw;
  const tpsa = desc.tpsa;

  mol.delete();

  return {
    smiles: canonSmiles,
    inchiKey,
    drugName,
    formula,
    mw: parseFloat(mw.toFixed(2)),
    clogp: parseFloat(clogp.toFixed(2)),
    tpsa: parseFloat(tpsa.toFixed(1)),
    hbd: desc.NumHBD,
    hba: desc.NumHBA,
    rotatableBonds: desc.NumRotatableBonds,
    svg
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

module.exports = { analyzeSmiles };
