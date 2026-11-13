/**
 * EUREKA Solvent-Accessible Surface Area (SASA) & Solvation Energy Engine
 * Implements the Shrake-Rupley numerical integration algorithm (1973)
 * with Eisenberg-McLachlan atomic solvation parameters (1986).
 * Computes exact hydrophobic and hydrophilic surface exposures from 3D coordinates.
 * Strictly deterministic physics algorithm.
 */

// Standard Bondi van der Waals radii (Å)
export const BONDI_VDW_RADII = {
  H: 1.20,
  C: 1.70,
  N: 1.55,
  O: 1.52,
  F: 1.47,
  P: 1.80,
  S: 1.80,
  CL: 1.75,
  BR: 1.85,
  I: 1.98
};

// Probe sphere radius (water molecule ~ 1.40 Å)
export const WATER_PROBE_RADIUS = 1.40;

// Eisenberg-McLachlan atomic solvation parameters (cal / (mol * Å²))
export const ATOMIC_SOLVATION_PARAMETERS = {
  C: 16.0,   // Carbon (hydrophobic penalty)
  N: -6.0,   // Neutral Nitrogen (polar favorable solvation)
  O: -6.0,   // Neutral Oxygen (polar favorable solvation)
  S: 21.0,   // Sulfur
  P: -10.0   // Phosphorus
};

/**
 * Generates an approximately uniform distribution of N points on a unit sphere
 * using the golden spiral (Fibonacci sphere) algorithm.
 * 
 * @param {number} numPoints - Number of test points on the sphere (default 96)
 * @returns {Array<{x: number, y: number, z: number}>}
 */
export function generateFibonacciSpherePoints(numPoints = 96) {
  const points = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  for (let i = 0; i < numPoints; i++) {
    const theta = 2 * Math.PI * i / phi;
    const y = 1 - (i / (numPoints - 1)) * 2; // -1 to +1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const x = radiusAtY * Math.cos(theta);
    const z = radiusAtY * Math.sin(theta);
    points.push({ x, y, z });
  }

  return points;
}

/**
 * Computes Solvent-Accessible Surface Area (SASA) for an array of 3D atoms
 * using the Shrake-Rupley numerical method.
 * 
 * @param {Array<{name: string, elem: string, x: number, y: number, z: number}>} atoms
 * @param {number} probeRadius - Probe radius in Å (default 1.40 Å for H2O)
 * @param {number} pointsPerSphere - Integration points (default 96)
 * @returns {{
 *   totalSasa: number,
 *   hydrophobicSasa: number,
 *   polarSasa: number,
 *   estimatedSolvationEnergyKcal: number,
 *   atomSasa: Array<number>
 * }}
 */
export function computeShrakeRupleySasa(atoms, probeRadius = WATER_PROBE_RADIUS, pointsPerSphere = 96) {
  if (!atoms || atoms.length === 0) {
    return { totalSasa: 0, hydrophobicSasa: 0, polarSasa: 0, estimatedSolvationEnergyKcal: 0, atomSasa: [] };
  }

  const n = atoms.length;
  const testPoints = generateFibonacciSpherePoints(pointsPerSphere);
  const atomRadii = atoms.map(a => {
    const elem = (a.elem || a.name || 'C').replace(/[^a-zA-Z]/g, '').toUpperCase();
    return (BONDI_VDW_RADII[elem] || 1.70) + probeRadius;
  });

  const atomSasa = new Array(n).fill(0);
  let totalSasa = 0;
  let hydrophobicSasa = 0;
  let polarSasa = 0;
  let solvationFreeEnergyCal = 0;

  for (let i = 0; i < n; i++) {
    const ai = atoms[i];
    const ri = atomRadii[i];
    const elem = (ai.elem || ai.name || 'C').replace(/[^a-zA-Z]/g, '').toUpperCase();

    // Identify spatial neighbors within (ri + rj)
    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const aj = atoms[j];
      const rj = atomRadii[j];
      const maxDist = ri + rj;
      const dx = ai.x - aj.x;
      const dy = ai.y - aj.y;
      const dz = ai.z - aj.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < maxDist * maxDist) {
        neighbors.push({ x: aj.x, y: aj.y, z: aj.z, rSq: rj * rj, distSq });
      }
    }

    let accessibleCount = 0;

    for (let p = 0; p < pointsPerSphere; p++) {
      const tp = testPoints[p];
      // Point on expanded sphere
      const px = ai.x + tp.x * ri;
      const py = ai.y + tp.y * ri;
      const pz = ai.z + tp.z * ri;

      let occluded = false;
      for (let k = 0; k < neighbors.length; k++) {
        const nb = neighbors[k];
        const dpx = px - nb.x;
        const dpy = py - nb.y;
        const dpz = pz - nb.z;
        if (dpx * dpx + dpy * dpy + dpz * dpz < nb.rSq) {
          occluded = true;
          break;
        }
      }

      if (!occluded) {
        accessibleCount++;
      }
    }

    // Surface of sphere = 4 * pi * ri^2
    const sphereArea = 4 * Math.PI * ri * ri;
    const sasa_i = (accessibleCount / pointsPerSphere) * sphereArea;
    atomSasa[i] = Number(sasa_i.toFixed(2));
    totalSasa += sasa_i;

    const asp = ATOMIC_SOLVATION_PARAMETERS[elem] || (elem === 'C' ? 16.0 : -6.0);
    solvationFreeEnergyCal += sasa_i * asp;

    if (elem === 'C' || elem === 'S' || elem === 'CL' || elem === 'F' || elem === 'BR') {
      hydrophobicSasa += sasa_i;
    } else {
      polarSasa += sasa_i;
    }
  }

  return {
    totalSasa: Number(totalSasa.toFixed(1)),
    hydrophobicSasa: Number(hydrophobicSasa.toFixed(1)),
    polarSasa: Number(polarSasa.toFixed(1)),
    estimatedSolvationEnergyKcal: Number((solvationFreeEnergyCal / 1000.0).toFixed(2)),
    atomSasa
  };
}

