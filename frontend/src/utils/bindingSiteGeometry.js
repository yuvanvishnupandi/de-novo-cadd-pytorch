/**
 * EUREKA Binding Site Geometry & Cavity Druggability Indices
 * Analyzes binding pocket volumes, sphericity, convex hull approximations,
 * and active-site lipophilic envelopes.
 * Strictly deterministic geometric calculation.
 */

/**
 * Computes the 3D bounding box dimensions of an active site.
 */
export function calculatePocketBoundingBox(residueAtoms) {
  if (!residueAtoms || residueAtoms.length === 0) {
    return { min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 }, dimensions: { x: 0, y: 0, z: 0 }, volume: 0 };
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const a of residueAtoms) {
    minX = Math.min(minX, a.x);
    minY = Math.min(minY, a.y);
    minZ = Math.min(minZ, a.z);
    maxX = Math.max(maxX, a.x);
    maxY = Math.max(maxY, a.y);
    maxZ = Math.max(maxZ, a.z);
  }

  const dx = Math.max(0, maxX - minX);
  const dy = Math.max(0, maxY - minY);
  const dz = Math.max(0, maxZ - minZ);

  return {
    min: { x: Number(minX.toFixed(2)), y: Number(minY.toFixed(2)), z: Number(minZ.toFixed(2)) },
    max: { x: Number(maxX.toFixed(2)), y: Number(maxY.toFixed(2)), z: Number(maxZ.toFixed(2)) },
    dimensions: { x: Number(dx.toFixed(2)), y: Number(dy.toFixed(2)), z: Number(dz.toFixed(2)) },
    volume: Number((dx * dy * dz).toFixed(1))
  };
}

/**
 * Computes radius of gyration (Rg) of a set of 3D points:
 * Rg = sqrt( (1/N) * sum( (r_i - r_mean)^2 ) )
 */
export function calculateRadiusOfGyration(points) {
  if (!points || points.length === 0) return 0;

  let sx = 0, sy = 0, sz = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
    sz += p.z;
  }
  const n = points.length;
  const mx = sx / n;
  const my = sy / n;
  const mz = sz / n;

  let sumSq = 0;
  for (const p of points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    const dz = p.z - mz;
    sumSq += dx * dx + dy * dy + dz * dz;
  }

  return Number(Math.sqrt(sumSq / n).toFixed(2));
}

/**
 * Evaluates cavity druggability index based on pocket volume, hydrophobicity ratio, and enclosure score.
 * Based on empirical druggability heuristics of Volkamer et al. (DoGSiteScorer, 2012).
 * 
 * @param {number} pocketVolume - Estimated pocket volume in Å³
 * @param {number} hydrophobicRatio - Fraction of pocket surface that is hydrophobic [0, 1]
 * @param {number} enclosure - Enclosure ratio [0, 1]
 * @returns {{ druggabilityScore: number, classification: string }}
 */
export function evaluateCavityDruggability(pocketVolume, hydrophobicRatio = 0.55, enclosure = 0.65) {
  // Optimal drug-like pockets typically possess volume between 300 and 1000 Å³
  let volScore = 0;
  if (pocketVolume >= 300 && pocketVolume <= 1200) {
    volScore = 1.0;
  } else if (pocketVolume < 300) {
    volScore = Math.max(0, pocketVolume / 300);
  } else {
    volScore = Math.max(0, 1.0 - (pocketVolume - 1200) / 1000);
  }

  const score = Number((0.45 * volScore + 0.35 * hydrophobicRatio + 0.20 * enclosure).toFixed(2));

  let classification = 'Druggable';
  if (score < 0.40) classification = 'Difficult / Undruggable';
  else if (score < 0.65) classification = 'Moderately Druggable';
  else classification = 'Highly Druggable (Classic Pocket)';

  return {
    druggabilityScore: score,
    classification
  };
}

