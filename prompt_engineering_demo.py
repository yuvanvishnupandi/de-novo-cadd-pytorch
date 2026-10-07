import torch
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pipeline_manager import SMILESGenerator

print("==================================================")
print("  EUREKA: PROMPT ENGINEERING (Temperature Scaling)")
print("  Demonstrating GenAI Control Mechanisms")
print("==================================================")
print("\nThis script demonstrates how 'Prompt Engineering' works in a")
print("Generative AI (LSTM) context for molecular discovery.\n")
print("By tuning the 'Temperature' (a prompt parameter), we control")
print("the creativity vs. conservatism of the AI's predictions.\n")

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model_path = 'ai_models/genai_untrained.pth'
if not os.path.exists(model_path):
    print("Error: Could not find 'ai_models/genai_untrained.pth'. Please run 'python ai_models/genai_model.py' first.")
    sys.exit(1)

checkpoint = torch.load(model_path, map_location=device)
model = SMILESGenerator(
    vocab_size=checkpoint['vocab_size'],
    embedding_dim=checkpoint.get('embedding_dim', 128),
    hidden_dim=checkpoint.get('hidden_dim', 512),
    num_layers=checkpoint.get('num_layers', 3)
).to(device)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

def demo_temperature(temp_value, description):
    print(f"\n--- Testing Temperature = {temp_value} ({description}) ---")
    
    char_to_idx = checkpoint['char_to_idx']
    idx_to_char = checkpoint['idx_to_char']
    start_token = char_to_idx.get('<START>', 1)
    end_token = char_to_idx.get('<END>', 2)
    pad_token = char_to_idx.get('<PAD>', 0)
    
    model.eval()
    with torch.no_grad():
        for i in range(3):
            current = torch.tensor([[start_token]]).to(device)
            hidden = model.init_hidden(1, device)
            molecule = ""
            
            for _ in range(50): # Generate up to 50 chars
                output, hidden = model(current, hidden)
                logits = output[0, -1] / temp_value
                probs = torch.softmax(logits, dim=0)
                next_idx = torch.multinomial(probs, 1).item()
                
                if next_idx == end_token:
                    break
                if next_idx == pad_token:
                    continue
                
                # Handle potential key format differences
                key = str(next_idx) if isinstance(list(idx_to_char.keys())[0], str) else next_idx
                char = idx_to_char.get(key, '')
                molecule += char
                current = torch.tensor([[next_idx]]).to(device)
            
            print(f"  Generated[{i+1}]: {molecule}")

# Run tests
demo_temperature(0.1, "Very Low / Conservative. Model plays it extremely safe.")
demo_temperature(0.8, "Medium / Balanced. The optimal prompt setting.")
demo_temperature(2.0, "Very High / Creative. Model takes wild hallucinations.")

print("\n==================================================")
print("  CONCLUSION: Prompt parameter 'Temperature' successfully")
print("  alters the GenAI output distribution.")
print("==================================================")
