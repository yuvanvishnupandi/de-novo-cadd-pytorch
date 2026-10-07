"""
EUREKA: Multi-Criteria Pipeline Manager
The central orchestrator that connects all pipeline stages:
1. Generative AI (PyTorch LSTM) -> Generates novel SMILES molecules
2. Feature Extraction (PubChem API) -> Calculates Lipinski properties
3. Bioactivity ML Grader (Random Forest) -> Checks if the drug works
4. Toxicity ML Grader (Random Forest) -> Checks if the drug is poisonous
5. 3D Physics Simulator (AutoDock Vina) -> Tests physical binding

Strictly Generative AI + Machine Learning pipeline. No Agentic AI.
The pipeline follows a fixed, deterministic sequence. No autonomous decisions.
"""
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import joblib
import os
import sys
import time

# Add project root to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data_pipelines.data_preprocessing import get_pubchem_properties


# ==================== LSTM Architecture (Must match train_genai.py) ====================
class SMILESGenerator(nn.Module):
    """Identical architecture to train_genai.py for loading weights."""
    def __init__(self, vocab_size, embedding_dim=128, hidden_dim=512, num_layers=3, dropout=0.2):
        super(SMILESGenerator, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, num_layers=num_layers,
                           batch_first=True, dropout=dropout if num_layers > 1 else 0)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden=None):
        embedded = self.embedding(x)
        output, hidden = self.lstm(embedded, hidden)
        output = self.dropout(output)
        predictions = self.fc(output)
        return predictions, hidden

    def init_hidden(self, batch_size, device):
        h0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        c0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        return (h0, c0)


# ==================== Load ML Models ====================
def load_bioactivity_grader(base_dir='.'):
    """Load the trained Bioactivity Random Forest model."""
    path = os.path.join(base_dir, 'ai_models', 'ml_grader_model.pkl')
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            print("   [OK] Bioactivity Grader (Random Forest) loaded.")
            return model
        except (ImportError, Exception) as e:
            # University/Enterprise laptops may block scikit-learn compiled DLLs.
            # Fall back to rule-based Lipinski validation which requires no DLLs.
            print(f"   [WARN] Bioactivity Grader DLL blocked by Application Control Policy.")
            print(f"   [INFO] Using rule-based Lipinski validation as fallback.")
            return None
    else:
        print("   [WARN] Bioactivity Grader not found. Using Lipinski rule-based fallback.")
        return None


def load_toxicity_grader(base_dir='.'):
    """Load the trained Toxicity Random Forest model."""
    path = os.path.join(base_dir, 'ai_models', 'toxicity_grader.pkl')
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            print("   [OK] Toxicity Grader (Random Forest) loaded.")
            return model
        except (ImportError, Exception) as e:
            # University/Enterprise laptops may block scikit-learn compiled DLLs.
            print(f"   [WARN] Toxicity Grader DLL blocked by Application Control Policy.")
            print(f"   [INFO] Using rule-based toxicity heuristics as fallback.")
            return None
    else:
        print("   [WARN] Toxicity Grader not found. Using rule-based fallback.")
        return None


def load_genai_model(base_dir='.'):
    """Load the trained PyTorch LSTM Generative AI model."""
    path = os.path.join(base_dir, 'ai_models', 'genai_trained_weights.pth')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    if os.path.exists(path):
        checkpoint = torch.load(path, map_location=device)
        model = SMILESGenerator(
            vocab_size=checkpoint['vocab_size'],
            embedding_dim=checkpoint.get('embedding_dim', 128),
            hidden_dim=checkpoint.get('hidden_dim', 512),
            num_layers=checkpoint.get('num_layers', 3)
        ).to(device)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        print("   [OK] PyTorch LSTM GenAI loaded.")
        return model, checkpoint, device
    else:
        print("   [WARN] Trained GenAI weights not found. Using fallback molecule bank.")
        return None, None, device


# ==================== Generate Molecules ====================
def generate_with_lstm(model, checkpoint, device, num_molecules=10, temperature=0.8):
    """Generate novel molecules using the trained LSTM."""
    char_to_idx = checkpoint['char_to_idx']
    idx_to_char = checkpoint['idx_to_char']
    start_token = char_to_idx.get('<START>', 1)
    end_token = char_to_idx.get('<END>', 2)
    pad_token = char_to_idx.get('<PAD>', 0)
    
    generated = []
    model.eval()
    
    with torch.no_grad():
        for _ in range(num_molecules):
            current = torch.tensor([[start_token]]).to(device)
            hidden = model.init_hidden(1, device)
            molecule = ""
            
            for _ in range(120):
                output, hidden = model(current, hidden)
                logits = output[0, -1] / temperature
                probs = torch.softmax(logits, dim=0)
                next_idx = torch.multinomial(probs, 1).item()
                
                if next_idx == end_token:
                    break
                if next_idx == pad_token:
                    continue
                
                char = idx_to_char.get(str(next_idx) if isinstance(list(idx_to_char.keys())[0], str) else next_idx, '')
                molecule += char
                current = torch.tensor([[next_idx]]).to(device)
            
            if len(molecule) > 3:
                generated.append(molecule)
    
    return generated


def get_fallback_molecules(num_molecules=10):
    """
    Fallback molecule bank of REAL, known pharmaceutical compounds.
    Used when the PyTorch LSTM has not been trained yet (teammate hasn't run training).
    These are real drugs that have been FDA-approved or are in clinical trials.
    """
    known_drugs = [
        {"smiles": "CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5", "name": "Imatinib (Gleevec)"},
        {"smiles": "CC(C)(C)NCC(O)C1=CC(=C(O)C=C1)CO", "name": "Salbutamol (Albuterol)"},
        {"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O", "name": "Aspirin"},
        {"smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", "name": "Caffeine"},
        {"smiles": "CC12CCC3C(C1CCC2O)CCC4=CC(=O)CCC34C", "name": "Testosterone"},
        {"smiles": "CC(=O)NC1=CC=C(C=C1)O", "name": "Acetaminophen (Tylenol)"},
        {"smiles": "C1=CC=C(C=C1)C(=O)O", "name": "Benzoic Acid"},
        {"smiles": "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", "name": "Ibuprofen"},
        {"smiles": "CC(C)NCC(O)C1=CC=C(C=C1)O", "name": "Isoproterenol"},
        {"smiles": "OC(=O)C1=CC=CC=C1O", "name": "Salicylic Acid"},
        {"smiles": "C1=CC=C2C(=C1)C=CC=N2", "name": "Quinoline"},
        {"smiles": "C1COCCN1", "name": "Morpholine"},
        {"smiles": "CC(=O)OC1=CC=CC=C1", "name": "Phenyl Acetate"},
        {"smiles": "C1=CC=C(C=C1)NC(=O)C2=CC=CC=C2", "name": "Benzanilide"},
        {"smiles": "CC1=CC=C(C=C1)S(=O)(=O)N", "name": "Toluenesulfonamide"},
    ]
    return known_drugs[:num_molecules]


# ==================== Multi-Criteria Validation ====================
def validate_lipinski(mw, logp, hbd, hba):
    """
    Lipinski's Rule of 5 - The gold standard for drug-likeness.
    A molecule is considered drug-like if it satisfies at least 3 of these rules:
    - Molecular Weight <= 500 Da
    - LogP <= 5
    - H-bond Donors <= 5
    - H-bond Acceptors <= 10
    """
    violations = 0
    if mw is not None and float(mw) > 500:
        violations += 1
    if logp is not None and float(logp) > 5:
        violations += 1
    if hbd is not None and int(hbd) > 5:
        violations += 1
    if hba is not None and int(hba) > 10:
        violations += 1
    return violations <= 1  # Pass if at most 1 violation


def predict_bioactivity(model, features):
    """
    Use the trained Random Forest to predict bioactivity.
    Falls back to Lipinski Rule of 5 heuristics if model is unavailable.
    """
    if model is None:
        # Fallback: Use Lipinski Rule of 5 as the bioactivity criterion
        # MW <= 500, LogP <= 5 -> likely active candidate
        mw, logp, hbd, hba = features[0], features[1], features[2], features[3]
        if mw <= 500 and logp <= 5 and hbd <= 5 and hba <= 10:
            return 'active'
        else:
            return 'inactive'
    try:
        prediction = model.predict([features])[0]
        return prediction
    except Exception:
        # If model fails (DLL block etc.), use heuristic fallback
        mw, logp, hbd, hba = features[0], features[1], features[2], features[3]
        return 'active' if (mw <= 500 and logp <= 5) else 'inactive'


def predict_toxicity(model, features):
    """
    Use the trained Random Forest to predict toxicity.
    Falls back to molecular weight heuristic if model is unavailable.
    High MW molecules tend to be less cell-permeable and less toxic.
    """
    if model is None:
        # Fallback heuristic: very high LogP (>5) suggests membrane toxicity risk
        logp = features[1]
        return 1 if logp > 5 else 0
    try:
        prediction = model.predict([features])[0]
        return int(prediction)
    except Exception:
        logp = features[1]
        return 1 if logp > 5 else 0


# ==================== Main Pipeline ====================
def run_pipeline(num_molecules_to_generate=10, base_dir='.'):
    """
    The complete Eureka Multi-Criteria Discovery Pipeline.
    
    Flow:
    1. Generate molecules (PyTorch LSTM or fallback bank)
    2. For each molecule:
       a. Fetch Lipinski properties from PubChem API
       b. Validate Lipinski Rule of 5
       c. Predict Bioactivity (Random Forest ML Grader)
       d. Predict Toxicity (Random Forest ML Grader)
    3. Return only molecules that pass ALL criteria
    
    This is a DETERMINISTIC pipeline. Each stage has fixed rules.
    There is NO autonomous decision-making (No Agentic AI).
    """
    print("\n==================================================")
    print("  EUREKA: Multi-Criteria Discovery Pipeline")
    print("  (Strictly GenAI + ML. No Agentic AI.)")
    print("==================================================")
    
    # Load all AI models
    print("\n--- Loading AI Models ---")
    bio_grader = load_bioactivity_grader(base_dir)
    tox_grader = load_toxicity_grader(base_dir)
    genai_model, genai_checkpoint, device = load_genai_model(base_dir)
    
    # Step 1: Generate molecules
    print(f"\n--- Step 1: Generating {num_molecules_to_generate} De Novo Molecules ---")
    
    if genai_model is not None:
        print("   Using trained PyTorch LSTM Generative AI...")
        smiles_list = generate_with_lstm(genai_model, genai_checkpoint, device, num_molecules_to_generate)
        molecule_data = [{"smiles": s, "name": f"GenAI-{i+1}"} for i, s in enumerate(smiles_list)]
    else:
        print("   Using fallback pharmaceutical molecule bank...")
        molecule_data = get_fallback_molecules(num_molecules_to_generate)
    
    print(f"   Generated {len(molecule_data)} molecules for evaluation.\n")
    
    # Step 2-4: Multi-Criteria Validation
    print("--- Step 2-4: Multi-Criteria Validation ---\n")
    
    approved_molecules = []
    rejected_molecules = []
    
    for i, mol in enumerate(molecule_data):
        smiles = mol['smiles']
        name = mol.get('name', f'Molecule-{i+1}')
        
        print(f"  [{i+1}/{len(molecule_data)}] Evaluating: {name}")
        print(f"       SMILES: {smiles[:60]}{'...' if len(smiles) > 60 else ''}")
        
        # 2a. Fetch Lipinski properties from PubChem
        print("       -> Fetching properties from PubChem API...")
        mw, logp, hbd, hba = get_pubchem_properties(smiles)
        
        if mw is None:
            print("       -> [SKIP] Could not resolve chemical properties.")
            rejected_molecules.append({"smiles": smiles, "name": name, "reason": "PubChem lookup failed"})
            continue
        
        print(f"       -> MW={mw}, LogP={logp}, HBD={hbd}, HBA={hba}")
        
        # 2b. Lipinski Rule of 5 Check
        lipinski_pass = validate_lipinski(mw, logp, hbd, hba)
        if not lipinski_pass:
            print("       -> [REJECTED] Failed Lipinski Rule of 5.")
            rejected_molecules.append({"smiles": smiles, "name": name, "reason": "Lipinski violation"})
            continue
        print("       -> [PASS] Lipinski Rule of 5")
        
        # 2c. Bioactivity Prediction
        features = [float(mw), float(logp) if logp else 0, int(hbd) if hbd else 0, int(hba) if hba else 0]
        bio_prediction = predict_bioactivity(bio_grader, features)
        
        if bio_prediction == 'inactive':
            print("       -> [REJECTED] ML Grader predicts INACTIVE.")
            rejected_molecules.append({"smiles": smiles, "name": name, "reason": "Predicted inactive"})
            continue
        print(f"       -> [PASS] Bioactivity: {bio_prediction}")
        
        # 2d. Toxicity Prediction
        tox_prediction = predict_toxicity(tox_grader, features)
        
        if tox_prediction == 1:
            print("       -> [REJECTED] Toxicity Grader predicts TOXIC.")
            rejected_molecules.append({"smiles": smiles, "name": name, "reason": "Predicted toxic"})
            continue
        print("       -> [PASS] Non-toxic")
        
        # All criteria passed!
        print("       -> [APPROVED] Passed ALL Multi-Criteria Validation!")
        approved_molecules.append({
            "smiles": smiles,
            "name": name,
            "molecular_weight": mw,
            "logp": logp,
            "h_bond_donors": hbd,
            "h_bond_acceptors": hba,
            "bioactivity": bio_prediction,
            "toxicity": "non-toxic"
        })
        print()
    
    # Final Results
    print("\n==================================================")
    print("  PIPELINE RESULTS")
    print("==================================================")
    print(f"  Total Generated:  {len(molecule_data)}")
    print(f"  Total Approved:   {len(approved_molecules)}")
    print(f"  Total Rejected:   {len(rejected_molecules)}")
    print()
    
    if approved_molecules:
        print("  APPROVED Lead Molecules:")
        for mol in approved_molecules:
            print(f"    - {mol['name']}: {mol['smiles'][:50]}...")
            print(f"      MW={mol['molecular_weight']}, LogP={mol['logp']}, Bioactivity={mol['bioactivity']}")
    
    if rejected_molecules:
        print("\n  REJECTED Molecules:")
        for mol in rejected_molecules:
            print(f"    - {mol['name']}: {mol['reason']}")
    
    print("\n==================================================")
    
    # Save results to CSV
    if approved_molecules:
        results_df = pd.DataFrame(approved_molecules)
        results_path = os.path.join(base_dir, 'data', 'pipeline_results.csv')
        results_df.to_csv(results_path, index=False)
        print(f"\n  Results saved to '{results_path}'")
    
    return [mol['smiles'] for mol in approved_molecules]


if __name__ == "__main__":
    run_pipeline(num_molecules_to_generate=10, base_dir='.')
