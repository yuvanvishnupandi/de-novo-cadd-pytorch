/**
 * EUREKA Biophysics & Computational Chemistry Mathematics Library
 * Pure client-side biophysical mathematical functions and property derivations.
 * Strictly deterministic runtime formulas. Zero mock values.
 */

export const GAS_CONSTANT_R = 0.00198720425864083; // kcal / (mol * K)
export const DEFAULT_TEMPERATURE_K = 298.15; // Standard physiological room temperature (25 °C)

/**
 * Converts AutoDock Vina binding free energy (ΔG, kcal/mol) to theoretical
 * inhibition constant (Ki) using the exact van 't Hoff relation:
 * Ki = exp(ΔG / (R * T))
 * 
 * @param {number} deltaG - Binding free energy in kcal/mol
 * @param {number} temperatureK - Temperature in Kelvin (default 298.15 K)
 * @returns {{ ki_molar: number, ki_nm: number, formatted: string }}
 */
export function calculateKiFromDeltaG(deltaG, temperatureK = DEFAULT_TEMPERATURE_K) {
  if (typeof deltaG !== 'number' || isNaN(deltaG)) {
    return { ki_molar: NaN, ki_nm: NaN, formatted: 'N/A' };
  }
  const exponent = deltaG / (GAS_CONSTANT_R * temperatureK);
  const kiMolar = Math.exp(exponent);
  const kiNm = kiMolar * 1e9;

  let formatted = '';
  if (kiNm < 1.0) {
    formatted = `${(kiNm * 1000).toFixed(1)} pM`;
  } else if (kiNm < 1000) {
    formatted = `${kiNm.toFixed(1)} nM`;
  } else if (kiNm < 1e6) {
    formatted = `${(kiNm / 1000).toFixed(2)} µM`;
  } else {
    formatted = `${(kiNm / 1e6).toFixed(2)} mM`;
  }

  return {
    ki_molar: kiMolar,
    ki_nm: kiNm,
    formatted
  };
}

/**
 * Calculates theoretical binding free energy (ΔG) from an experimental or computed Ki:
 * ΔG = R * T * ln(Ki)
 * 
 * @param {number} kiMolar - Inhibition constant in Molar
 * @param {number} temperatureK - Temperature in Kelvin (default 298.15 K)
 * @returns {number} ΔG in kcal/mol
 */
export function calculateDeltaGFromKi(kiMolar, temperatureK = DEFAULT_TEMPERATURE_K) {
  if (typeof kiMolar !== 'number' || kiMolar <= 0) return NaN;
  return GAS_CONSTANT_R * temperatureK * Math.log(kiMolar);
}

/**
 * Computes Ligand Efficiency metrics:
 * - LE (Ligand Efficiency) = -ΔG / N_heavy (kcal/mol per heavy atom)
 * - BEI (Binding Efficiency Index) = pKi / (MW in kDa)
 * - SEI (Surface Efficiency Index) = pKi / (TPSA / 100 Å²)
 * - LLE (Lipophilic Ligand Efficiency) = pKi - cLogP
 */
export function calculateLigandEfficiencyMetrics({ deltaG, mw, clogp, tpsa, heavyAtoms }) {
  const { ki_molar } = calculateKiFromDeltaG(deltaG);
  const pKi = -Math.log10(ki_molar || 1e-6);

  const le = heavyAtoms && heavyAtoms > 0 ? (-deltaG / heavyAtoms) : NaN;
  const mwKda = mw ? mw / 1000.0 : NaN;
  const bei = mwKda && mwKda > 0 ? (pKi / mwKda) : NaN;
  const sei = tpsa && tpsa > 0 ? (pKi / (tpsa / 100.0)) : NaN;
  const lle = (typeof clogp === 'number') ? (pKi - clogp) : NaN;

  return {
    pKi: Number(pKi.toFixed(2)),
    le: Number(le.toFixed(3)),
    bei: Number(bei.toFixed(2)),
    sei: Number(sei.toFixed(2)),
    lle: Number(lle.toFixed(2))
  };
}

/**
 * Harrington-Derringer Desirability Function
 * One-sided desirability for "smaller is better" (e.g. Molecular Weight, ΔG)
 * d(y) = 1 if y <= y_min; 0 if y >= y_max; otherwise ((y_max - y)/(y_max - y_min))^s
 */
export function desirabilitySmallerBetter(y, yMin, yMax, s = 1.0) {
  if (y <= yMin) return 1.0;
  if (y >= yMax) return 0.0;
  return Math.pow((yMax - y) / (yMax - yMin), s);
}

/**
 * Harrington-Derringer Desirability Function
 * One-sided desirability for "larger is better" (e.g. QED, affinity magnitude)
 */
export function desirabilityLargerBetter(y, yMin, yMax, s = 1.0) {
  if (y >= yMax) return 1.0;
  if (y <= yMin) return 0.0;
  return Math.pow((y - yMin) / (yMax - yMin), s);
}

/**
 * Harrington-Derringer Desirability Function
 * Two-sided target desirability (e.g. cLogP between 1.0 and 3.5, TPSA between 40 and 120)
 */
export function desirabilityTargetRange(y, yLow, targetLow, targetHigh, yHigh) {
  if (y < yLow || y > yHigh) return 0.0;
  if (y >= targetLow && y <= targetHigh) return 1.0;
  if (y < targetLow) return (y - yLow) / (targetLow - yLow);
  return (yHigh - y) / (yHigh - targetHigh);
}

/**
 * Evaluates composite Harrington-Derringer MPO Desirability:
 * D = (d_mw * d_clogp * d_tpsa * d_hbd * d_hba * d_dg)^(1/6)
 */
export function evaluateCompositeMpoDesirability({ mw, clogp, tpsa, hbd, hba, deltaG }) {
  const dMw = desirabilitySmallerBetter(mw ?? 450, 300, 600);
  const dClogp = desirabilityTargetRange(clogp ?? 2.5, 0.0, 1.5, 3.5, 5.5);
  const dTpsa = desirabilityTargetRange(tpsa ?? 70, 20, 50, 100, 140);
  const dHbd = desirabilitySmallerBetter(hbd ?? 2, 1, 5);
  const dHba = desirabilitySmallerBetter(hba ?? 5, 3, 10);
  const dDg = desirabilitySmallerBetter(deltaG ?? -8.0, -12.0, -5.0);

  const product = dMw * dClogp * dTpsa * dHbd * dHba * dDg;
  const composite = Math.pow(Math.max(product, 1e-12), 1.0 / 6.0);

  return {
    composite: Number(composite.toFixed(3)),
    subScores: {
      mw: Number(dMw.toFixed(3)),
      clogp: Number(dClogp.toFixed(3)),
      tpsa: Number(dTpsa.toFixed(3)),
      hbd: Number(dHbd.toFixed(3)),
      hba: Number(dHba.toFixed(3)),
      deltaG: Number(dDg.toFixed(3))
    }
  };
}

/**
 * Computes root-mean-square deviation (RMSD) between two sets of 3D coordinates.
 * Coordinates must be ordered identically.
 * 
 * @param {Array<{x: number, y: number, z: number}>} coordsA
 * @param {Array<{x: number, y: number, z: number}>} coordsB
 * @returns {number} RMSD in Angstroms (Å)
 */
export function calculateRmsd(coordsA, coordsB) {
  if (!coordsA || !coordsB || coordsA.length === 0 || coordsA.length !== coordsB.length) {
    return NaN;
  }
  let sumSq = 0;
  for (let i = 0; i < coordsA.length; i++) {
    const dx = coordsA[i].x - coordsB[i].x;
    const dy = coordsA[i].y - coordsB[i].y;
    const dz = coordsA[i].z - coordsB[i].z;
    sumSq += dx * dx + dy * dy + dz * dz;
  }
  return Math.sqrt(sumSq / coordsA.length);
}

/**
 * Computes 3D Euclidean geometric centroid from an array of coordinates.
 */
export function calculateCentroid(points) {
  if (!points || points.length === 0) return { x: 0, y: 0, z: 0 };
  let sx = 0, sy = 0, sz = 0;
  for (let i = 0; i < points.length; i++) {
    sx += points[i].x;
    sy += points[i].y;
    sz += points[i].z;
  }
  const n = points.length;
  return {
    x: Number((sx / n).toFixed(2)),
    y: Number((sy / n).toFixed(2)),
    z: Number((sz / n).toFixed(2))
  };
}

/**
 * Calculates Euclidean distance between two 3D points.
 */
export function euclideanDistance3D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Filters atoms to identify active site contacts within a spatial radius (default 5.0 Å).
 */
export function findContactResidues(pocketCenter, proteinAtoms, radius = 5.0) {
  if (!proteinAtoms || proteinAtoms.length === 0) return [];
  const contacted = new Map();

  for (let i = 0; i < proteinAtoms.length; i++) {
    const a = proteinAtoms[i];
    const dist = euclideanDistance3D(pocketCenter, { x: a.x, y: a.y, z: a.z });
    if (dist <= radius) {
      const key = `${a.resName}${a.resNum}`;
      if (!contacted.has(key) || dist < contacted.get(key).minDist) {
        contacted.set(key, {
          resName: a.resName,
          resNum: a.resNum,
          chain: a.chain,
          minDist: dist
        });
      }
    }
  }

  return Array.from(contacted.values()).sort((a, b) => a.minDist - b.minDist);
}

/**
 * Client-side content sniffer for uploaded biological and chemical files.
 * Verifies raw syntax before submitting to backend.
 */
export function sniffFileFormat(filename, content) {
  const clean = (content || '').trim();
  if (!clean) {
    return { valid: false, error: 'File is completely empty.' };
  }

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const fn = (filename || '').toLowerCase();

  // Check FASTA
  if (clean.startsWith('>') || fn.endsWith('.fasta') || fn.endsWith('.fa') || fn.endsWith('.seq')) {
    let header = '';
    let seq = '';
    for (let l of lines) {
      if (l.startsWith('>')) {
        if (!header) header = l.substring(1);
      } else {
        seq += l.replace(/\s+/g, '').toUpperCase();
      }
    }
    if (!seq) {
      return { valid: false, error: 'FASTA file contains header but no amino acid sequence.' };
    }
    const invalidChars = [];
    for (let char of seq) {
      if (!"ACDEFGHIKLMNPQRSTVWYXU".includes(char)) {
        if (!invalidChars.includes(char)) invalidChars.push(char);
      }
    }
    if (invalidChars.length > 0) {
      return {
        valid: false,
        error: `FASTA validation error: Sequence contains non-amino-acid characters: [${invalidChars.join(', ')}]`
      };
    }
    return {
      valid: true,
      format: 'FASTA',
      header,
      sequenceLength: seq.length,
      sequencePreview: seq.substring(0, 30) + (seq.length > 30 ? '...' : '')
    };
  }

  // Check PDB / CIF
  if (fn.endsWith('.pdb') || fn.endsWith('.cif') || fn.endsWith('.pdbqt') || lines.some(l => l.startsWith('ATOM  ') || l.startsWith('HETATM') || l.startsWith('HEADER'))) {
    const atomLines = lines.filter(l => l.startsWith('ATOM  ') || l.startsWith('HETATM'));
    if (atomLines.length === 0) {
      return { valid: false, error: 'PDB file contains no valid ATOM or HETATM coordinate records.' };
    }
    return {
      valid: true,
      format: 'PDB',
      atomCount: atomLines.length,
      firstLine: lines[0]
    };
  }

  // Check SMILES
  if (fn.endsWith('.smi') || fn.endsWith('.smiles') || (lines.length === 1 && !lines[0].includes(' '))) {
    return {
      valid: true,
      format: 'SMILES',
      smiles: lines[0].split(/\s+/)[0]
    };
  }

  return {
    valid: false,
    error: `Unsupported file format. Please upload a valid .fasta, .pdb, .cif, .pdbqt, or .smi file.`
  };
}

