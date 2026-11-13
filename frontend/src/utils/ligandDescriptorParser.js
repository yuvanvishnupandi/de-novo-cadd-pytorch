/**
 * EUREKA Ligand Topological Fragment & Graph Decomposition Library
 * Decomposes chemical SMILES representations into functional pharmacophore graphs,
 * aromatic scaffolds, and linker chains without external black-box dependencies.
 * Strictly deterministic graph theory algorithms.
 */

/**
 * Parses simple molecular SMILES strings into atom and bond graph representations.
 * 
 * @param {string} smiles - Molecular SMILES representation
 * @returns {{
 *   atoms: Array<{id: number, symbol: string, isAromatic: boolean, charge: number, implicitH: number}>,
 *   bonds: Array<{source: number, target: number, order: number, isAromatic: boolean}>,
 *   heavyAtomCount: number,
 *   aromaticRingCount: number
 * }}
 */
export function parseSmilesToGraph(smiles) {
  if (!smiles || typeof smiles !== 'string') {
    return { atoms: [], bonds: [], heavyAtomCount: 0, aromaticRingCount: 0 };
  }

  const clean = smiles.trim();
  const atoms = [];
  const bonds = [];
  const ringClosures = new Map();
  let prevAtomIndex = null;
  let atomCounter = 0;
  let inBracket = false;
  let bracketContent = '';
  let bondOrder = 1;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '[') {
      inBracket = true;
      bracketContent = '';
      continue;
    }

    if (char === ']') {
      inBracket = false;
      const symbolMatch = bracketContent.match(/[A-Z][a-z]?/);
      const symbol = symbolMatch ? symbolMatch[0] : 'C';
      const isAromatic = symbol === symbol.toLowerCase();
      const atomId = atomCounter++;
      atoms.push({
        id: atomId,
        symbol: symbol.toUpperCase(),
        isAromatic,
        charge: bracketContent.includes('+') ? 1 : (bracketContent.includes('-') ? -1 : 0),
        implicitH: 0
      });

      if (prevAtomIndex !== null) {
        bonds.push({ source: prevAtomIndex, target: atomId, order: bondOrder, isAromatic: false });
        bondOrder = 1;
      }
      prevAtomIndex = atomId;
      continue;
    }

    if (inBracket) {
      bracketContent += char;
      continue;
    }

    // Branching
    if (char === '(') {
      // Branch opens, keep prevAtomIndex
      continue;
    }
    if (char === ')') {
      // Branch closes
      continue;
    }

    // Explicit bond orders
    if (char === '=') { bondOrder = 2; continue; }
    if (char === '#') { bondOrder = 3; continue; }
    if (char === ':') { bondOrder = 1.5; continue; }

    // Ring closures (digits 1-9)
    if (/\d/.test(char)) {
      const ringNum = parseInt(char, 10);
      if (ringClosures.has(ringNum)) {
        const ringSource = ringClosures.get(ringNum);
        bonds.push({ source: ringSource, target: prevAtomIndex, order: bondOrder, isAromatic: false });
        ringClosures.delete(ringNum);
      } else {
        ringClosures.set(ringNum, prevAtomIndex);
      }
      bondOrder = 1;
      continue;
    }

    // Organic subset atoms: B, C, N, O, P, S, F, Cl, Br, I, c, n, o, s, p
    if (/[A-Za-z]/.test(char)) {
      let symbol = char;
      if (char === 'C' && clean[i + 1] === 'l') {
        symbol = 'Cl';
        i++;
      } else if (char === 'B' && clean[i + 1] === 'r') {
        symbol = 'Br';
        i++;
      }

      const isAromatic = symbol === symbol.toLowerCase();
      const atomId = atomCounter++;
      atoms.push({
        id: atomId,
        symbol: symbol.toUpperCase(),
        isAromatic,
        charge: 0,
        implicitH: 0
      });

      if (prevAtomIndex !== null) {
        bonds.push({ source: prevAtomIndex, target: atomId, order: isAromatic ? 1.5 : bondOrder, isAromatic });
        bondOrder = 1;
      }
      prevAtomIndex = atomId;
    }
  }

  // Count aromatic atoms
  const aromaticAtoms = atoms.filter(a => a.isAromatic).length;
  const aromaticRingCount = Math.floor(aromaticAtoms / 6);

  return {
    atoms,
    bonds,
    heavyAtomCount: atoms.length,
    aromaticRingCount
  };
}

/**
 * Calculates topological diameter (longest shortest path) of the chemical graph.
 */
export function calculateTopologicalDiameter(graph) {
  if (!graph || graph.atoms.length === 0) return 0;
  const n = graph.atoms.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

  for (let i = 0; i < n; i++) dist[i][i] = 0;

  for (const b of graph.bonds) {
    if (b.source < n && b.target < n) {
      dist[b.source][b.target] = 1;
      dist[b.target][b.source] = 1;
    }
  }

  // Floyd-Warshall shortest paths
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  let maxDist = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dist[i][j] !== Infinity && dist[i][j] > maxDist) {
        maxDist = dist[i][j];
      }
    }
  }

  return maxDist;
}

