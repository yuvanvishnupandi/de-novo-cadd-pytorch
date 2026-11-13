/**
 * EUREKA Ramachandran Backbone Dihedral Angle Engine
 * Computes phi (φ) and psi (ψ) protein backbone torsion angles from 3D ATOM coordinates.
 * Strictly deterministic vector math.
 */

/**
 * Calculates vector dot product.
 */
export function vectorDot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculates vector cross product.
 */
export function vectorCross(v1, v2) {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
}

/**
 * Calculates vector magnitude (norm).
 */
export function vectorMagnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Normalizes a vector.
 */
export function vectorNormalize(v) {
  const m = vectorMagnitude(v);
  if (m === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / m, y: v.y / m, z: v.z / m };
}

/**
 * Computes dihedral (torsion) angle in degrees between four points: p1 -> p2 -> p3 -> p4.
 * Torsion angle around the bond p2-p3.
 * Returns angle in degrees (-180° to +180°).
 */
export function computeDihedralAngle(p1, p2, p3, p4) {
  const b1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const b2 = { x: p3.x - p2.x, y: p3.y - p2.y, z: p3.z - p2.z };
  const b3 = { x: p4.x - p3.x, y: p4.y - p3.y, z: p4.z - p3.z };

  const n1 = vectorCross(b1, b2);
  const n2 = vectorCross(b2, b3);

  const m1 = vectorCross(n1, vectorNormalize(b2));

  const x = vectorDot(n1, n2);
  const y = vectorDot(m1, n2);

  const rad = Math.atan2(y, x);
  return Number((rad * (180.0 / Math.PI)).toFixed(1));
}

/**
 * Classifies a (phi, psi) pair into classic Ramachandran conformational regions:
 * - 'alpha_core': Favored right-handed alpha-helix
 * - 'beta_core': Favored extended beta-sheet
 * - 'left_helix': Favored left-handed alpha-helix
 * - 'allowed': Generously allowed outer contours
 * - 'disallowed': Sterically strained / disallowed
 */
export function classifyRamachandranRegion(phi, psi) {
  // Alpha helix core: phi around -60, psi around -45
  if (phi >= -90 && phi <= -40 && psi >= -70 && psi <= -20) {
    return 'alpha_core';
  }
  // Beta sheet core: phi around -120 to -140, psi around +130 to +150
  if (phi >= -160 && phi <= -100 && psi >= 110 && psi <= 170) {
    return 'beta_core';
  }
  // Left-handed alpha helix: phi around +60, psi around +40
  if (phi >= 40 && phi <= 80 && psi >= 20 && psi <= 60) {
    return 'left_helix';
  }
  // Generously allowed
  if ((phi < 0 && psi < 180 && psi > -100) || (phi > 0 && psi > -20 && psi < 100)) {
    return 'allowed';
  }
  return 'disallowed';
}

/**
 * Computes all backbone dihedral angles (phi, psi, omega) for a chain of residues.
 * Requires PDB atom records with N, CA, C, O atoms.
 */
export function computeBackboneDihedrals(residues) {
  const results = [];
  if (!residues || residues.length < 3) return results;

  for (let i = 0; i < residues.length; i++) {
    const cur = residues[i];
    const prev = i > 0 ? residues[i - 1] : null;
    const next = i < residues.length - 1 ? residues[i + 1] : null;

    let phi = null;
    let psi = null;
    let omega = null;

    // Phi: C(prev) -> N(cur) -> CA(cur) -> C(cur)
    if (prev && prev.C && cur.N && cur.CA && cur.C) {
      phi = computeDihedralAngle(prev.C, cur.N, cur.CA, cur.C);
    }

    // Psi: N(cur) -> CA(cur) -> C(cur) -> N(next)
    if (next && cur.N && cur.CA && cur.C && next.N) {
      psi = computeDihedralAngle(cur.N, cur.CA, cur.C, next.N);
    }

    // Omega: CA(cur) -> C(cur) -> N(next) -> CA(next) (peptide planar bond ~ 180°)
    if (next && cur.CA && cur.C && next.N && next.CA) {
      omega = computeDihedralAngle(cur.CA, cur.C, next.N, next.CA);
    }

    const region = (phi !== null && psi !== null) ? classifyRamachandranRegion(phi, psi) : 'unassigned';

    results.push({
      resName: cur.resName,
      resNum: cur.resNum,
      chain: cur.chain,
      phi,
      psi,
      omega,
      region
    });
  }

  return results;
}

