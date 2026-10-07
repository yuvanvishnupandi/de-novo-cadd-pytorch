"""
EUREKA: PyTorch LSTM Generative AI Architecture (Initialization Only)
Defines and initializes the LSTM neural network architecture.
Saves an untrained model checkpoint for architecture verification.

This script does NOT train the model. For full training, run train_genai.py
on a machine with an Nvidia GPU.

Strictly Deep Learning. No Agentic AI.
"""
import torch
import torch.nn as nn
import pandas as pd
import os


class SMILESGenerator(nn.Module):
    """
    Character-level LSTM neural network for De Novo molecular generation.
    
    How it works (in simple terms):
    1. The Embedding layer teaches the AI what individual chemical characters mean
       (C = Carbon, O = Oxygen, ( = branch start, etc.)
    2. The LSTM layers act as the AI's "memory" - they remember the patterns
       of how characters are strung together in valid molecules
    3. The Linear layer predicts the very next character of the molecule
    
    This is a standard NLP-style Language Model applied to chemistry.
    It is NOT Agentic AI. The model does not make autonomous decisions.
    It simply predicts the next character based on learned probability distributions.
    """
    def __init__(self, vocab_size, embedding_dim=128, hidden_dim=512, num_layers=3, dropout=0.2):
        super(SMILESGenerator, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # Embedding: Maps each chemical character to a dense vector representation
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        
        # LSTM: The core "memory" of the generative AI
        # Uses 3 stacked layers for deeper pattern recognition
        self.lstm = nn.LSTM(
            embedding_dim, hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        
        # Dropout: Prevents overfitting during training
        self.dropout = nn.Dropout(dropout)
        
        # Fully Connected: Maps LSTM output to character probabilities
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden=None):
        """Forward pass through the neural network."""
        embedded = self.embedding(x)
        output, hidden = self.lstm(embedded, hidden)
        output = self.dropout(output)
        predictions = self.fc(output)
        return predictions, hidden
    
    def init_hidden(self, batch_size, device='cpu'):
        """Initialize hidden state with zeros."""
        h0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        c0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        return (h0, c0)


def initialize_model(base_dir='.'):
    """
    Loads the ZINC dataset to build a vocabulary, then initializes
    the LSTM architecture and saves an untrained checkpoint.
    """
    print("==================================================")
    print("  EUREKA: PyTorch GenAI Architecture Init")
    print("  (Strictly Deep Learning, No Agentic AI)")
    print("==================================================")
    
    # Load ZINC dataset to build vocabulary
    zinc_path = os.path.join(base_dir, 'data', 'zinc_smiles.csv')
    print(f"\n1. Loading ZINC dataset from '{zinc_path}'...")
    
    try:
        df = pd.read_csv(zinc_path)
        smiles_col = [col for col in df.columns if 'smiles' in col.lower()]
        if not smiles_col:
            print("Error: No 'smiles' column found.")
            return
        smiles_data = df[smiles_col[0]].dropna().tolist()[:5000]
        print(f"   Loaded {len(smiles_data)} molecules for vocabulary building.")
    except FileNotFoundError:
        print(f"   Warning: {zinc_path} not found. Using sample data.")
        smiles_data = [
            "CC(C)C1=CC=C(C=C1)C(C)C(=O)O",
            "CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C"
        ]
    
    # Build vocabulary
    print("\n2. Building chemical vocabulary...")
    all_chars = set("".join(smiles_data))
    special_tokens = {'<PAD>': 0, '<START>': 1, '<END>': 2}
    char_to_idx = {**special_tokens}
    for char in sorted(all_chars):
        if char not in char_to_idx:
            char_to_idx[char] = len(char_to_idx)
    
    idx_to_char = {idx: char for char, idx in char_to_idx.items()}
    vocab_size = len(char_to_idx)
    print(f"   Vocabulary Size: {vocab_size} unique chemical characters")
    
    # Initialize the neural network
    print("\n3. Initializing LSTM Neural Network...")
    model = SMILESGenerator(vocab_size)
    total_params = sum(p.numel() for p in model.parameters())
    print(f"   Total trainable parameters: {total_params:,}")
    print(model)
    
    # Save the untrained architecture checkpoint
    save_path = os.path.join(base_dir, 'ai_models', 'genai_untrained.pth')
    os.makedirs(os.path.join(base_dir, 'ai_models'), exist_ok=True)
    torch.save({
        'model_state_dict': model.state_dict(),
        'char_to_idx': char_to_idx,
        'idx_to_char': idx_to_char,
        'vocab_size': vocab_size,
        'embedding_dim': 128,
        'hidden_dim': 512,
        'num_layers': 3
    }, save_path)
    
    print(f"\n4. Success! Untrained architecture saved to '{save_path}'")
    print("   (Full training requires GPU. Run train_genai.py on gaming laptop.)")


if __name__ == "__main__":
    initialize_model(base_dir='.')
