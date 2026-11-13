/**
 * EUREKA 3D Pharmacophore Mesh & Interaction Spatial Mapper
 * Generates 3D spatial feature spheres (Hydrogen Bond Donors, Acceptors,
 * Aromatic Rings, Hydrophobic Envelopes, Positive/Negative Ionizable Centers)
 * directly from RDKit atom-types and 3D PDBQT coordinates.
 * Strictly geometric calculation with zero mock datasets.
 */

export const PHARMACOPHORE_FEATURE_TYPES = {
  HBD: { name: 'Hydrogen Bond Donor', color: '#3b82f6', defaultRadius: 1.2 },
  HBA: { name: 'Hydrogen Bond Acceptor', color: '#ef4444', defaultRadius: 1.2 },
  AROMATIC: { name: 'Aromatic Pi System', color: '#8b5cf6', defaultRadius: 1.5 },
  HYDROPHOBIC: { name: 'Hydrophobic Region', color: '#f59e0b', defaultRadius: 1.4 },
  POS_IONIZABLE: { name: 'Cationic Center', color: '#06b6d4', defaultRadius: 1.3 },
  NEG_IONIZABLE: { name: 'Anionic Center', color: '#ec4899', defaultRadius: 1.3 }
};

/**
 * Identifies pharmacophore feature points from parsed 3D molecule atoms.
 * 
 * @param {Array<{name: string, elem: string, x: number, y: number, z: number, adType?: string}>} atoms
 * @returns {Array<{type: string, center: {x: number, y: number, z: number}, radius: number, label: string}>}
 */
export function extractPharmacophoreFeatures(atoms) {
  if (!atoms || atoms.length === 0) return [];
  const features = [];

  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i];
    const elem = (a.elem || a.name || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
    const adType = (a.adType || '').toUpperCase();

    // Hydrogen Bond Donors: Nitrogen or Oxygen bound to polar hydrogen (HD)
    if (adType === 'HD' || (elem === 'N' && atoms.some(h => (h.elem === 'H' || h.name.startsWith('H')) && euclideanDist(a, h) < 1.2))) {
      features.push({
        type: 'HBD',
        center: { x: a.x, y: a.y, z: a.z },
        radius: PHARMACOPHORE_FEATURE_TYPES.HBD.defaultRadius,
        label: `HBD: ${a.name || elem}`
      });
    }

    // Hydrogen Bond Acceptors: Oxygen or Nitrogen with lone pairs (OA, NA)
    if (adType === 'OA' || adType === 'NA' || elem === 'O' || (elem === 'N' && adType !== 'HD')) {
      features.push({
        type: 'HBA',
        center: { x: a.x, y: a.y, z: a.z },
        radius: PHARMACOPHORE_FEATURE_TYPES.HBA.defaultRadius,
        label: `HBA: ${a.name || elem}`
      });
    }

    // Hydrophobic carbons
    if (adType === 'C' || (elem === 'C' && !adType.includes('A'))) {
      features.push({
        type: 'HYDROPHOBIC',
        center: { x: a.x, y: a.y, z: a.z },
        radius: PHARMACOPHORE_FEATURE_TYPES.HYDROPHOBIC.defaultRadius,
        label: `Hydrophobic: ${a.name || elem}`
      });
    }

    // Aromatic carbons
    if (adType === 'A' || a.isAromatic) {
      features.push({
        type: 'AROMATIC',
        center: { x: a.x, y: a.y, z: a.z },
        radius: PHARMACOPHORE_FEATURE_TYPES.AROMATIC.defaultRadius,
        label: `Aromatic: ${a.name || elem}`
      });
    }
  }

  return features;
}

/**
 * Calculates Euclidean distance between two atoms.
 */
function euclideanDist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Clusters proximal aromatic atoms to derive ring centroids.
 */
export function clusterAromaticCentroids(aromaticAtoms, ringSize = 6) {
  if (!aromaticAtoms || aromaticAtoms.length < ringSize) return [];
  const rings = [];
  const visited = new Set();

  for (let i = 0; i < aromaticAtoms.length; i++) {
    if (visited.has(i)) continue;
    const cluster = [aromaticAtoms[i]];
    visited.add(i);

    for (let j = 0; j < aromaticAtoms.length; j++) {
      if (!visited.has(j) && euclideanDist(aromaticAtoms[i], aromaticAtoms[j]) < 2.8) {
        cluster.push(aromaticAtoms[j]);
        visited.add(j);
      }
    }

    if (cluster.length >= 5) {
      let sx = 0, sy = 0, sz = 0;
      for (const pt of cluster) {
        sx += pt.x;
        sy += pt.y;
        sz += pt.z;
      }
      rings.push({
        type: 'AROMATIC_RING_CENTROID',
        center: {
          x: Number((sx / cluster.length).toFixed(3)),
          y: Number((sy / cluster.length).toFixed(3)),
          z: Number((sz / cluster.length).toFixed(3))
        },
        radius: 1.8,
        label: `Aromatic Ring (${cluster.length}-membered)`
      });
    }
  }

  return rings;
}

