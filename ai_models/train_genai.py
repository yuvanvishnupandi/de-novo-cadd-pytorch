"""
EUREKA: PyTorch LSTM Generative AI - Full Training Script
Trains a character-level LSTM neural network on the ZINC molecular dataset
to learn the grammar of chemistry (SMILES notation) and generate
novel, De Novo molecular structures.

Strictly Deep Learning Generative AI. No Agentic AI.

NOTE: This script is designed to run on a machine with an Nvidia GPU.
      Your teammate should pull this from GitHub and run it on their gaming laptop.
      After training completes, they push the 'genai_trained_weights.pth' file
      back to the repository for the entire team to use.
"""
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
import os
import json


# ==================== GPU/CPU Detection ====================
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


# ==================== Dataset Class ====================
class SMILESDataset(Dataset):
    """
    Custom PyTorch Dataset that converts SMILES strings into
    integer-encoded sequences for the LSTM to learn from.
    """
    def __init__(self, smiles_list, max_len=120):
        # Filter out molecules that are too long
        self.smiles = [s for s in smiles_list if isinstance(s, str) and 0 < len(s) <= max_len]
        
        # Build the vocabulary (the "alphabet" of chemistry)
        all_chars = set("".join(self.smiles))
        # Add special tokens
        self.special_tokens = {'<PAD>': 0, '<START>': 1, '<END>': 2}
        self.char_to_idx = {**self.special_tokens}
        for char in sorted(all_chars):
            if char not in self.char_to_idx:
                self.char_to_idx[char] = len(self.char_to_idx)
        
        self.idx_to_char = {idx: char for char, idx in self.char_to_idx.items()}
        self.vocab_size = len(self.char_to_idx)
        self.max_len = max_len

    def __len__(self):
        return len(self.smiles)

    def __getitem__(self, idx):
        smile = self.smiles[idx]
        # Encode: <START> + characters + <END> + <PAD> padding
        encoded = [self.special_tokens['<START>']]
        encoded += [self.char_to_idx[c] for c in smile]
        encoded.append(self.special_tokens['<END>'])
        
        # Pad to max_len + 2 (for START and END tokens)
        total_len = self.max_len + 2
        while len(encoded) < total_len:
            encoded.append(self.special_tokens['<PAD>'])
        encoded = encoded[:total_len]
        
        # Input: everything except the last token
        # Target: everything except the first token (shifted by 1)
        x = torch.tensor(encoded[:-1], dtype=torch.long)
        y = torch.tensor(encoded[1:], dtype=torch.long)
        return x, y


# ==================== Neural Network Architecture ====================
class SMILESGenerator(nn.Module):
    """
    Character-level LSTM Generative Model.
    
    Architecture:
    - Embedding Layer: Converts character indices to dense vectors
    - LSTM Layers (x3): Learns sequential patterns in SMILES grammar
    - Dropout: Prevents overfitting
    - Linear Layer: Predicts the next character
    
    This is a standard Deep Learning architecture (Seq2Seq / Language Model).
    It is NOT Agentic AI. The model does not make autonomous decisions.
    It simply predicts the next character based on learned patterns.
    """
    def __init__(self, vocab_size, embedding_dim=128, hidden_dim=512, num_layers=3, dropout=0.2):
        super(SMILESGenerator, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            embedding_dim, hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden=None):
        embedded = self.embedding(x)
        output, hidden = self.lstm(embedded, hidden)
        output = self.dropout(output)
        predictions = self.fc(output)
        return predictions, hidden
    
    def init_hidden(self, batch_size):
        """Initialize hidden state with zeros."""
        h0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        c0 = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(device)
        return (h0, c0)


# ==================== Molecule Generation (Inference) ====================
def generate_molecules(model, dataset, num_molecules=10, max_length=120, temperature=0.8):
    """
    Uses the trained LSTM to generate novel SMILES strings.
    
    This is the core Generative AI function. It uses 'temperature sampling'
    (a Prompt Engineering technique) to control the creativity of the AI:
    - Low temperature (0.5): Conservative, more valid molecules
    - High temperature (1.2): Creative, more diverse but possibly invalid
    """
    model.eval()
    generated = []
    
    with torch.no_grad():
        for i in range(num_molecules):
            # Start with the <START> token
            current_char = torch.tensor([[dataset.special_tokens['<START>']]]).to(device)
            hidden = model.init_hidden(1)
            molecule = ""
            
            for _ in range(max_length):
                output, hidden = model(current_char, hidden)
                
                # Apply temperature scaling (Prompt Engineering for GenAI)
                logits = output[0, -1] / temperature
                probabilities = torch.softmax(logits, dim=0)
                
                # Sample the next character from the probability distribution
                next_idx = torch.multinomial(probabilities, 1).item()
                
                # Stop if we hit the <END> token
                if next_idx == dataset.special_tokens['<END>']:
                    break
                # Skip padding tokens
                if next_idx == dataset.special_tokens['<PAD>']:
                    continue
                
                next_char = dataset.idx_to_char.get(next_idx, '')
                molecule += next_char
                current_char = torch.tensor([[next_idx]]).to(device)
            
            if len(molecule) > 3:  # Only keep molecules with meaningful length
                generated.append(molecule)
                print(f"   Generated Molecule {i+1}: {molecule}")
    
    return generated


# ==================== Training Loop ====================
def train_model(base_dir='.'):
    """Main training function."""
    print("==================================================")
    print("  EUREKA: PyTorch LSTM Generative AI Training")
    print("  (Strictly Deep Learning GenAI, No Agentic AI)")
    print("==================================================")
    print(f"\nUsing device: {device}")
    if device.type == 'cuda':
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB")
    
    # Load ZINC dataset
    zinc_path = os.path.join(base_dir, 'data', 'zinc_smiles.csv')
    print(f"\n1. Loading ZINC dataset from '{zinc_path}'...")
    
    try:
        df = pd.read_csv(zinc_path)
        # Find the SMILES column (handle different column names)
        smiles_col = [col for col in df.columns if 'smiles' in col.lower()]
        if not smiles_col:
            print("Error: No 'smiles' column found in zinc_smiles.csv")
            return
        smiles_data = df[smiles_col[0]].dropna().tolist()
        print(f"   Total molecules available: {len(smiles_data)}")
    except Exception as e:
        print(f"Error loading ZINC: {e}")
        return
    
    # Use a reasonable subset based on available compute
    train_size = min(100000, len(smiles_data))
    smiles_data = smiles_data[:train_size]
    print(f"   Using {train_size} molecules for training.")
    
    # Create dataset and dataloader
    print("\n2. Building vocabulary and encoding sequences...")
    dataset = SMILESDataset(smiles_data)
    print(f"   Vocabulary size: {dataset.vocab_size} unique chemical characters")
    print(f"   Valid sequences: {len(dataset)}")
    
    num_workers = 4 if device.type == 'cuda' else 0
    dataloader = DataLoader(dataset, batch_size=256, shuffle=True, num_workers=num_workers)
    
    # Initialize model
    print("\n3. Initializing LSTM Neural Network...")
    model = SMILESGenerator(dataset.vocab_size).to(device)
    total_params = sum(p.numel() for p in model.parameters())
    print(f"   Total parameters: {total_params:,}")
    print(model)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss(ignore_index=dataset.special_tokens['<PAD>'])
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=2, factor=0.5)
    
    # Training
    epochs = 10
    best_loss = float('inf')
    print(f"\n4. Starting Training for {epochs} epochs...\n")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        num_batches = 0
        
        for batch_idx, (x, y) in enumerate(dataloader):
            x, y = x.to(device), y.to(device)
            
            optimizer.zero_grad()
            output, _ = model(x)
            
            # Reshape for CrossEntropyLoss: (batch * seq_len, vocab_size) vs (batch * seq_len)
            loss = criterion(output.reshape(-1, dataset.vocab_size), y.reshape(-1))
            loss.backward()
            
            # Gradient clipping to prevent exploding gradients (standard DL practice)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)
            optimizer.step()
            
            total_loss += loss.item()
            num_batches += 1
            
            if batch_idx % 50 == 0:
                print(f"   Epoch [{epoch+1}/{epochs}] | Batch [{batch_idx}/{len(dataloader)}] | Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / num_batches
        scheduler.step(avg_loss)
        current_lr = optimizer.param_groups[0]['lr']
        print(f"\n==> Epoch {epoch+1} Complete | Avg Loss: {avg_loss:.4f} | LR: {current_lr:.6f}")
        
        # Save best model
        if avg_loss < best_loss:
            best_loss = avg_loss
            save_path = os.path.join(base_dir, 'ai_models', 'genai_trained_weights.pth')
            os.makedirs(os.path.join(base_dir, 'ai_models'), exist_ok=True)
            torch.save({
                'model_state_dict': model.state_dict(),
                'char_to_idx': dataset.char_to_idx,
                'idx_to_char': dataset.idx_to_char,
                'vocab_size': dataset.vocab_size,
                'embedding_dim': 128,
                'hidden_dim': 512,
                'num_layers': 3,
                'best_loss': best_loss,
                'epoch': epoch + 1
            }, save_path)
            print(f"   [SAVED] New best model (loss: {best_loss:.4f}) -> '{save_path}'")
        
        # Generate sample molecules every 2 epochs to show training progress
        if (epoch + 1) % 2 == 0:
            print(f"\n   --- Sample Generations at Epoch {epoch+1} ---")
            samples = generate_molecules(model, dataset, num_molecules=3, temperature=0.8)
            print()
    
    print("\n==================================================")
    print("  TRAINING COMPLETE!")
    print(f"  Best Loss: {best_loss:.4f}")
    print(f"  Model saved to: ai_models/genai_trained_weights.pth")
    print("==================================================")
    
    # Final generation demo
    print("\n5. Generating 10 novel molecules with the trained model...\n")
    final_molecules = generate_molecules(model, dataset, num_molecules=10, temperature=0.8)
    
    # Save generated molecules to a CSV for the pipeline
    if final_molecules:
        gen_df = pd.DataFrame({'smiles': final_molecules})
        gen_path = os.path.join(base_dir, 'data', 'generated_molecules.csv')
        gen_df.to_csv(gen_path, index=False)
        print(f"\n   Generated molecules saved to '{gen_path}'")


if __name__ == "__main__":
    train_model(base_dir='.')
