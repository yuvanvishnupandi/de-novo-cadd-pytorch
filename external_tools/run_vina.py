"""
EUREKA: Dynamic PDB Fetcher & AutoDock Vina 3D Physics Simulator
Downloads protein structures from the RCSB Protein Data Bank API
and runs molecular docking simulations using AutoDock Vina.
Strictly Computational Chemistry. No Agentic AI.
"""
import os
import urllib.request
import subprocess
import json


def download_pdb(pdb_id, output_dir="data"):
    """
    Dynamically fetches ANY protein structure from the RCSB Protein Data Bank.
    Instead of downloading the entire 500GB PDB database, we fetch individual
    protein files on-demand via the RCSB REST API.
    
    Args:
        pdb_id: The 4-character PDB ID (e.g., '6LU7' for COVID-19 protease)
        output_dir: Directory to save the downloaded file
    
    Returns:
        Path to the downloaded PDB file, or None if download failed
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Normalize PDB ID to uppercase
    pdb_id = pdb_id.upper().strip()
    file_path = os.path.join(output_dir, f"{pdb_id}.pdb")
    
    # Check if already downloaded
    if os.path.exists(file_path):
        file_size = os.path.getsize(file_path)
        print(f"   [{pdb_id}] Already exists locally ({file_size:,} bytes)")
        return file_path
    
    # Download from RCSB
    url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
    print(f"   Connecting to RCSB API: {url}")
    
    try:
        urllib.request.urlretrieve(url, file_path)
        file_size = os.path.getsize(file_path)
        print(f"   Success! Downloaded {pdb_id}.pdb ({file_size:,} bytes)")
        return file_path
    except urllib.error.HTTPError as e:
        print(f"   Error: PDB ID '{pdb_id}' not found on RCSB (HTTP {e.code})")
        return None
    except Exception as e:
        print(f"   Error fetching PDB: {e}")
        return None


def get_protein_info(pdb_id):
    """
    Fetches metadata about a protein from the RCSB REST API.
    Useful for displaying information on the React dashboard.
    """
    url = f"https://data.rcsb.org/rest/v1/core/entry/{pdb_id.upper()}"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            title = data.get('struct', {}).get('title', 'Unknown')
            method = data.get('exptl', [{}])[0].get('method', 'Unknown')
            return {
                'pdb_id': pdb_id.upper(),
                'title': title,
                'method': method
            }
    except Exception:
        return {'pdb_id': pdb_id.upper(), 'title': 'Unknown', 'method': 'Unknown'}


def run_vina_docking(smiles, receptor_pdb_path, center_x=0, center_y=0, center_z=0,
                     size_x=20, size_y=20, size_z=20, exhaustiveness=8,
                     vina_path="external_tools/vina_1.2.7_win.exe"):
    """
    Runs AutoDock Vina molecular docking simulation.
    
    This function requires RDKit and Meeko to be installed on the machine.
    These libraries are used to convert 1D SMILES strings into 3D molecular
    geometry that Vina can process.
    
    NOTE: RDKit requires specific C++ DLLs that may not be available on all
    machines. If this fails, it should be run on the teammate's gaming laptop
    where RDKit is properly installed.
    
    Args:
        smiles: The molecule's SMILES string
        receptor_pdb_path: Path to the receptor protein PDB file
        center_x/y/z: Coordinates of the binding site center
        size_x/y/z: Dimensions of the docking search box
        exhaustiveness: How thorough the search should be (higher = slower but better)
    
    Returns:
        Binding affinity score in kcal/mol (lower = stronger binding = better drug)
    """
    # Check if Vina executable exists
    if not os.path.exists(vina_path):
        return {"error": f"Vina executable not found at '{vina_path}'"}
    
    # Try to import RDKit (may not be available on all machines)
    try:
        from rdkit import Chem
        from rdkit.Chem import AllChem
    except ImportError:
        return {"error": "RDKit not installed. Run this on the gaming laptop where RDKit is available."}
    
    try:
        from meeko import MoleculePreparation
    except ImportError:
        return {"error": "Meeko not installed. Install with: pip install meeko"}
    
    print(f"\n   1. Converting SMILES to 3D: {smiles[:50]}...")
    
    # Convert SMILES to 3D molecule
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return {"error": f"Invalid SMILES string: {smiles}"}
    
    mol = Chem.AddHs(mol)
    embed_result = AllChem.EmbedMolecule(mol, randomSeed=42)
    if embed_result == -1:
        return {"error": "Could not generate 3D coordinates for this molecule"}
    
    AllChem.MMFFOptimizeMolecule(mol)
    
    # Prepare PDBQT ligand file using Meeko
    print("   2. Preparing PDBQT ligand for Vina...")
    try:
        preparator = MoleculePreparation()
        mol_setups = preparator.prepare(mol)
        
        ligand_pdbqt_path = "temp_ligand.pdbqt"
        for setup in mol_setups:
            pdbqt_string = setup.write_pdbqt_string()
            with open(ligand_pdbqt_path, "w") as f:
                f.write(pdbqt_string)
            break  # Only use first conformer
    except Exception as e:
        return {"error": f"Meeko preparation failed: {e}"}
    
    # Prepare receptor path
    receptor_pdbqt = receptor_pdb_path.replace('.pdb', '.pdbqt')
    if not os.path.exists(receptor_pdbqt):
        return {"error": f"Receptor PDBQT not found: {receptor_pdbqt}. Prepare receptor first."}
    
    # Run AutoDock Vina
    print(f"   3. Running AutoDock Vina simulation...")
    vina_cmd = [
        vina_path,
        "--receptor", receptor_pdbqt,
        "--ligand", ligand_pdbqt_path,
        "--center_x", str(center_x),
        "--center_y", str(center_y),
        "--center_z", str(center_z),
        "--size_x", str(size_x),
        "--size_y", str(size_y),
        "--size_z", str(size_z),
        "--exhaustiveness", str(exhaustiveness)
    ]
    
    try:
        result = subprocess.run(vina_cmd, capture_output=True, text=True, timeout=300)
        
        # Parse Vina output for the best binding affinity score
        best_score = None
        for line in result.stdout.split('\n'):
            line = line.strip()
            if line and line[0].isdigit():
                parts = line.split()
                if len(parts) >= 2:
                    try:
                        mode = int(parts[0])
                        affinity = float(parts[1])
                        if mode == 1:  # Best mode
                            best_score = affinity
                            break
                    except ValueError:
                        continue
        
        if best_score is not None:
            print(f"   Simulation Complete! Binding Affinity: {best_score} kcal/mol")
            return {"affinity_kcal_mol": best_score, "status": "success"}
        else:
            return {"error": "Could not parse Vina output", "stdout": result.stdout, "stderr": result.stderr}
            
    except subprocess.TimeoutExpired:
        return {"error": "Vina simulation timed out (>5 minutes)"}
    except Exception as e:
        return {"error": f"Vina execution error: {e}"}


if __name__ == "__main__":
    print("==================================================")
    print("  EUREKA: 3D Physics Simulator (AutoDock Vina)")
    print("==================================================")
    
    # Test 1: Dynamic PDB download
    print("\n--- Test: Dynamic PDB Download ---")
    pdb_path = download_pdb("6LU7", output_dir="data")
    
    if pdb_path:
        info = get_protein_info("6LU7")
        print(f"   Protein: {info['title']}")
        print(f"   Method:  {info['method']}")
    
    print("\n--- Test Complete ---")
    print("Note: Full docking simulation requires RDKit + Meeko (run on gaming laptop)")
