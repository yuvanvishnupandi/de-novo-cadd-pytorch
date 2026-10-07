"""
EUREKA: ChEMBL Data Ingestion Module
Downloads bioactivity data from the ChEMBL database for a given disease target.
Strictly Data Engineering. No Agentic AI.

==============================================================================
DEFAULT BENCHMARK TARGET: SARS-CoV-2 (COVID-19) - CHEMBL3927
In the final web dashboard, the target ID will be passed dynamically
from the user's React frontend search bar to target ANY disease.
==============================================================================
"""
import pandas as pd
import os


def fetch_chembl_data(target_chembl_id="CHEMBL3927", base_dir='.'):
    """
    Downloads IC50 bioactivity data from the ChEMBL database for a specific target.
    
    Args:
        target_chembl_id: The ChEMBL ID of the disease target.
                         Default is CHEMBL3927 (SARS-CoV-2 COVID-19 3CL Protease).
                         In the final dashboard, this will be dynamic.
        base_dir: Base directory for saving the output CSV.
    
    Returns:
        DataFrame with the downloaded bioactivity data, or None on failure.
    """
    print("========================================")
    print("  EUREKA: ChEMBL Data Ingestion")
    print("========================================")
    
    try:
        from chembl_webresource_client.new_client import new_client
    except ImportError:
        print("Error: chembl_webresource_client not installed.")
        print("Install with: pip install chembl_webresource_client")
        return None
    
    print(f"\n1. Searching ChEMBL Database for target: {target_chembl_id}")
    
    print("2. Downloading IC50 Bioactivity Data (This may take a minute)...")
    activity = new_client.activity
    res = activity.filter(target_chembl_id=target_chembl_id).filter(standard_type="IC50")
    df = pd.DataFrame.from_dict(res)
    
    if df.empty:
        print("Error: No data found for this target.")
        return None
    
    print(f"   Downloaded {len(df)} raw bioactivity records.")
    
    # Clean the data (Drop rows with missing critical values)
    print("3. Cleaning data (removing missing values)...")
    df = df[df.standard_value.notna()]
    df = df[df.canonical_smiles.notna()]
    print(f"   {len(df)} valid records after cleaning.")
    
    # Save to CSV
    output_path = os.path.join(base_dir, 'data', 'chembl_target_data.csv')
    os.makedirs(os.path.join(base_dir, 'data'), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"\n4. Success! Raw data saved to '{output_path}'")
    
    return df


if __name__ == "__main__":
    fetch_chembl_data(target_chembl_id="CHEMBL3927", base_dir='.')
