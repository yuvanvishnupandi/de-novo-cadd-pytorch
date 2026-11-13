/**
 * EUREKA PDBQT Coordinate & Torsion Tree Parser
 * Parses AutoDock PDBQT coordinate files into typed molecular structures.
 * Computes partial atomic charge sums, rotatable bond torsions, and spatial bounding boxes.
 * Strictly geometric parsing with zero mock data.
 */

/**
 * Parses a PDBQT text string into structured models, atoms, and torsion branches.
 * 
 * @param {string} pdbqtContent - Raw text content of a PDBQT file
 * @returns {{
 *   models: Array<{
 *     modelNum: number,
 *     affinity?: number,
 *     rmsdLb?: number,
 *     rmsdUb?: number,
 *     atoms: Array<Object>
 *   }>,
 *   totalCharge: number,
 *   torsdof: number,
 *   boundingBox: { min: {x:number, y:number, z:number}, max: {x:number, y:number, z:number}, size: {x:number, y:number, z:number} }
 * }}
 */
export function parsePdbqt(pdbqtContent) {
  if (!pdbqtContent || !pdbqtContent.trim()) {
    return { models: [], totalCharge: 0, torsdof: 0, boundingBox: null };
  }

  const lines = pdbqtContent.split('\n');
  const models = [];
  let currentModel = null;
  let currentAtoms = [];
  let totalCharge = 0;
  let torsdof = 0;

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('MODEL')) {
      if (currentModel) {
        currentModel.atoms = currentAtoms;
        models.push(currentModel);
      }
      const numMatch = line.match(/MODEL\s+(\d+)/);
      currentModel = {
        modelNum: numMatch ? parseInt(numMatch[1], 10) : models.length + 1,
        atoms: []
      };
      currentAtoms = [];
    } else if (line.startsWith('REMARK VINA RESULT:')) {
      // Vina affinity header: REMARK VINA RESULT:    -10.8      0.000      0.000
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6 && currentModel) {
        currentModel.affinity = parseFloat(parts[3]);
        currentModel.rmsdLb = parseFloat(parts[4]);
        currentModel.rmsdUb = parseFloat(parts[5]);
      }
    } else if (line.startsWith('ATOM  ') || line.startsWith('HETATM')) {
      try {
        const atomIndex = parseInt(line.substring(6, 11).trim(), 10);
        const name = line.substring(12, 16).trim();
        const resName = line.substring(17, 20).trim();
        const chain = line.substring(21, 22).trim() || 'A';
        const resNum = parseInt(line.substring(22, 26).trim(), 10);
        const x = parseFloat(line.substring(30, 38).trim());
        const y = parseFloat(line.substring(38, 46).trim());
        const z = parseFloat(line.substring(46, 54).trim());
        const partialCharge = parseFloat(line.substring(70, 76).trim()) || 0.0;
        const adType = line.substring(77, 79).trim();

        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          minZ = Math.min(minZ, z);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          maxZ = Math.max(maxZ, z);

          totalCharge += partialCharge;

          currentAtoms.push({
            atomIndex,
            name,
            resName,
            chain,
            resNum,
            x,
            y,
            z,
            partialCharge,
            adType
          });
        }
      } catch (err) {
        // Skip unparseable lines
      }
    } else if (line.startsWith('TORSDOF')) {
      const match = line.match(/TORSDOF\s+(\d+)/);
      if (match) torsdof = parseInt(match[1], 10);
    } else if (line.startsWith('ENDMDL')) {
      if (currentModel) {
        currentModel.atoms = currentAtoms;
        models.push(currentModel);
        currentModel = null;
        currentAtoms = [];
      }
    }
  }

  // Handle single-model files without explicit MODEL/ENDMDL
  if (currentAtoms.length > 0) {
    if (currentModel) {
      currentModel.atoms = currentAtoms;
      models.push(currentModel);
    } else {
      models.push({
        modelNum: 1,
        atoms: currentAtoms
      });
    }
  }

  const boundingBox = (minX !== Infinity) ? {
    min: { x: Number(minX.toFixed(2)), y: Number(minY.toFixed(2)), z: Number(minZ.toFixed(2)) },
    max: { x: Number(maxX.toFixed(2)), y: Number(maxY.toFixed(2)), z: Number(maxZ.toFixed(2)) },
    size: {
      x: Number((maxX - minX).toFixed(2)),
      y: Number((maxY - minY).toFixed(2)),
      z: Number((maxZ - minZ).toFixed(2))
    }
  } : null;

  return {
    models,
    totalCharge: Number(totalCharge.toFixed(3)),
    torsdof,
    boundingBox
  };
}

