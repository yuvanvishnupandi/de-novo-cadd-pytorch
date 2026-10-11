"""
EUREKA: Tox21 Toxicity Preprocessing & ML Grader Training
Processes the Tox21 dataset and trains a Random Forest classifier
to predict whether a molecule is toxic or non-toxic.
Strictly Machine Learning. No Agentic AI.
"""
import pandas as pd
import pubchempy as pcp
import os
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib


def get_pubchem_properties(smiles):
    """Fetches Lipinski properties from PubChem for a given SMILES string."""
    try:
        compounds = pcp.get_compounds(smiles, namespace='smiles')
        if compounds:
            c = compounds[0]
            return c.molecular_weight, c.xlogp, c.h_bond_donor_count, c.h_bond_acceptor_count
    except Exception:
        pass
    time.sleep(0.2)
    return None, None, None, None


def run_tox21_preprocessing(base_dir='.'):
    """
    Main pipeline to process Tox21 toxicity data and train the Toxicity ML Grader.
    """
    print("========================================")
    print("  EUREKA: Toxicity ML Grader (Tox21)")
    print("========================================")
    
    tox_path = os.path.join(base_dir, 'data', 'tox21.csv')
    if not os.path.exists(tox_path):
        print(f"Error: tox21.csv not found at '{tox_path}'")
        return None
    
    print("\n1. Loading Tox21 dataset...")
    df = pd.read_csv(tox_path)
    print(f"   Loaded {len(df)} molecules.")
    
    # Tox21 has 12 toxicity assay columns. If ANY assay returns 1, the molecule is toxic.
    toxicity_columns = [col for col in df.columns if col not in ['mol_id', 'smiles']]
    df['is_toxic'] = df[toxicity_columns].max(axis=1).fillna(0).astype(int)
    
    toxic_count = df['is_toxic'].sum()
    safe_count = len(df) - toxic_count
    print(f"   Toxic molecules: {toxic_count}")
    print(f"   Safe molecules:  {safe_count}")
    
    # Use top 150 molecules for the benchmark (API rate-limit safe)
    df_sample = df.head(150).copy()
    
    print(f"\n2. Fetching Lipinski features for {len(df_sample)} molecules from PubChem API...")
    print("   (This may take several minutes)\n")
    
    results = []
    for i, smiles in enumerate(df_sample['smiles']):
        mw, logp, hbd, hba = get_pubchem_properties(smiles)
        results.append((mw, logp, hbd, hba))
        if (i + 1) % 25 == 0:
            print(f"   Processed {i + 1}/{len(df_sample)} molecules...")
    
    df_sample[['MW', 'LogP', 'NumHDonors', 'NumHAcceptors']] = pd.DataFrame(results, index=df_sample.index)
    df_sample = df_sample.dropna(subset=['MW', 'LogP'])
    print(f"\n   Successfully fetched properties for {len(df_sample)} molecules.")
    
    # Save the cleaned Tox21 dataset
    tox_clean_path = os.path.join(base_dir, 'data', 'tox21_cleaned.csv')
    df_sample.to_csv(tox_clean_path, index=False)
    print(f"   Cleaned data saved to '{tox_clean_path}'")
    
    # Train the Toxicity ML Grader
    print("\n3. Training Toxicity ML Grader (Random Forest)...")
    features = ['MW', 'LogP', 'NumHDonors', 'NumHAcceptors']
    X = df_sample[features]
    y = df_sample['is_toxic']
    
    if len(set(y)) < 2:
        print("Error: Dataset does not contain both toxic and non-toxic samples.")
        return None
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n   ---> Toxicity Model Accuracy: {accuracy * 100:.2f}% <---")
    print("\n   Detailed Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # Save the trained model
    model_path = os.path.join(base_dir, 'ai_models', 'toxicity_grader.pkl')
    os.makedirs(os.path.join(base_dir, 'ai_models'), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"4. Success! Toxicity Grader saved to '{model_path}'")
    
    return model


if __name__ == "__main__":
    run_tox21_preprocessing(base_dir='.')
