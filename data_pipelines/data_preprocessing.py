"""
EUREKA: Data Preprocessing Module
Fetches Lipinski Rule of 5 properties from PubChem API and classifies bioactivity.
Strictly Generative AI / ML pipeline. No Agentic AI.
"""
import pandas as pd
import pubchempy as pcp
import os
import time


# ==============================================================================
# REUSABLE FUNCTION: Can be imported by other scripts (pipeline_manager, etc.)
# ==============================================================================
def get_pubchem_properties(smiles):
    """
    Connects to the live PubChem database to calculate Lipinski Rule of 5
    molecular properties for a given SMILES string.
    
    Returns: (molecular_weight, xlogp, h_bond_donors, h_bond_acceptors)
    """
    try:
        compounds = pcp.get_compounds(smiles, namespace='smiles')
        if compounds:
            c = compounds[0]
            return c.molecular_weight, c.xlogp, c.h_bond_donor_count, c.h_bond_acceptor_count
    except Exception:
        pass
    time.sleep(0.2)  # Rate-limit protection for the free PubChem API
    return None, None, None, None


def classify_activity(ic50):
    """
    Classifies a molecule's bioactivity based on its IC50 value.
    IC50 < 1000 nM  = 'active'   (strong drug candidate)
    IC50 > 10000 nM = 'inactive' (poor drug candidate)
    Everything else = 'intermediate' (discarded from training)
    """
    try:
        val = float(ic50)
        if val < 1000:
            return 'active'
        elif val > 10000:
            return 'inactive'
        else:
            return 'intermediate'
    except:
        return 'inactive'


def run_chembl_preprocessing(base_dir='.'):
    """
    Main preprocessing pipeline for ChEMBL bioactivity data.
    Loads raw ChEMBL data, fetches Lipinski properties from PubChem,
    classifies activity, and saves the cleaned dataset.
    """
    print("========================================")
    print("  EUREKA: ChEMBL Data Preprocessing")
    print("========================================")
    
    # Try multiple possible file locations
    possible_paths = [
        os.path.join(base_dir, 'data', 'chembl_target_data.csv'),
        os.path.join(base_dir, 'data', 'bioactivity_data_raw.csv'),
    ]
    
    file_path = None
    for path in possible_paths:
        if os.path.exists(path):
            file_path = path
            break
    
    if file_path is None:
        print("Error: No ChEMBL data file found in data/ folder.")
        return None
    
    print(f"\n1. Loading ChEMBL raw data from '{file_path}'...")
    df = pd.read_csv(file_path)
    print(f"   Loaded {len(df)} molecules.")
    
    # Process all molecules via the live PubChem API
    print(f"\n2. Fetching Lipinski Rule of 5 properties from PubChem API for all {len(df)} molecules...")
    print("   (This may take several minutes depending on your internet speed)\n")
    
    results = []
    for i, smiles in enumerate(df['canonical_smiles']):
        mw, logp, hbd, hba = get_pubchem_properties(smiles)
        results.append((mw, logp, hbd, hba))
        if (i + 1) % 25 == 0:
            print(f"   Processed {i + 1}/{len(df)} molecules...")
    
    df[['MW', 'LogP', 'NumHDonors', 'NumHAcceptors']] = pd.DataFrame(results, index=df.index)
    df = df.dropna(subset=['MW'])
    print(f"\n   Successfully fetched properties for {len(df)} molecules.")
    
    # Classify bioactivity
    print("\n3. Classifying bioactivity based on IC50 values...")
    df['activity_class'] = df['standard_value'].apply(classify_activity)
    df_clean = df[df['activity_class'] != 'intermediate']
    
    print(f"   Active molecules:   {len(df_clean[df_clean['activity_class'] == 'active'])}")
    print(f"   Inactive molecules: {len(df_clean[df_clean['activity_class'] == 'inactive'])}")
    
    # Save cleaned dataset
    output_file = os.path.join(base_dir, 'data', 'chembl_cleaned_pubchem.csv')
    df_clean.to_csv(output_file, index=False)
    print(f"\n4. Success! {len(df_clean)} cleaned molecules saved to '{output_file}'")
    
    return df_clean


if __name__ == "__main__":
    run_chembl_preprocessing(base_dir='.')
