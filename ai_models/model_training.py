"""
EUREKA: ML Bioactivity Grader Training
Trains a Random Forest classifier on cleaned ChEMBL data to predict
whether a molecule is 'active' or 'inactive' against the target disease.
Strictly Machine Learning. No Agentic AI.
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os


def train_bioactivity_grader(base_dir='.'):
    """
    Trains the Bioactivity ML Grader on the cleaned ChEMBL dataset.
    The cleaned dataset must already exist (run data_preprocessing.py first).
    """
    print("========================================")
    print("  EUREKA: ML Bioactivity Grader")
    print("========================================")
    
    data_path = os.path.join(base_dir, 'data', 'chembl_cleaned_pubchem.csv')
    if not os.path.exists(data_path):
        print(f"Error: '{data_path}' not found. Run data_preprocessing.py first.")
        return None
    
    print("\n1. Loading cleaned ChEMBL dataset...")
    df = pd.read_csv(data_path)
    print(f"   Loaded {len(df)} cleaned molecules.")
    
    # The features (X) are the Lipinski properties from PubChem
    features = ['MW', 'LogP', 'NumHDonors', 'NumHAcceptors']
    
    # Check that all required columns exist
    missing = [f for f in features if f not in df.columns]
    if missing:
        print(f"Error: Missing columns: {missing}")
        return None
    
    X = df[features]
    y = df['activity_class']  # 'active' or 'inactive'
    
    print(f"   Active molecules:   {len(df[df['activity_class'] == 'active'])}")
    print(f"   Inactive molecules: {len(df[df['activity_class'] == 'inactive'])}")
    
    if len(set(y)) < 2:
        print("Error: Need both 'active' and 'inactive' samples to train.")
        return None
    
    print("\n2. Splitting data: 80% training, 20% testing...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"   Training set: {len(X_train)} molecules")
    print(f"   Test set:     {len(X_test)} molecules")
    
    print("\n3. Training Random Forest Classifier (100 decision trees)...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("\n4. Evaluating model on test data...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n   ---> Bioactivity Model Accuracy: {accuracy * 100:.2f}% <---")
    print("\n   Detailed Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # Save the trained model
    model_path = os.path.join(base_dir, 'ai_models', 'ml_grader_model.pkl')
    os.makedirs(os.path.join(base_dir, 'ai_models'), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"5. Success! Bioactivity Grader saved to '{model_path}'")
    
    return model


if __name__ == "__main__":
    train_bioactivity_grader(base_dir='.')
