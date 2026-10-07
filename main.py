"""
EUREKA: FastAPI Web Server
The backend API server that connects the React Website Dashboard
to the Python AI pipeline.

Strictly serves as a web interface layer. No Agentic AI.
All AI logic is handled by the pipeline_manager module.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pipeline_manager import run_pipeline
from external_tools.run_vina import download_pdb, get_protein_info
from data_pipelines.data_preprocessing import get_pubchem_properties


# ==================== FastAPI App ====================
app = FastAPI(
    title="Eureka AI Pipeline API",
    description="Backend API for the Eureka Multi-Criteria Drug Discovery Pipeline. Strictly GenAI + ML.",
    version="1.0.0"
)

# Allow React frontend to connect (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Request/Response Models ====================
class DiscoveryRequest(BaseModel):
    """Request from the React frontend to discover new drug candidates."""
    target_disease_id: str = "CHEMBL3927"  # Default benchmark: COVID-19
    num_molecules: int = 5
    temperature: float = 0.8  # GenAI creativity parameter (Prompt Engineering)

class MoleculeResult(BaseModel):
    """A single molecule that passed multi-criteria validation."""
    smiles: str
    molecular_weight: Optional[float] = None
    logp: Optional[float] = None
    h_bond_donors: Optional[int] = None
    h_bond_acceptors: Optional[int] = None
    bioactivity: Optional[str] = None
    toxicity: Optional[str] = None

class DiscoveryResponse(BaseModel):
    """Response sent back to the React frontend."""
    status: str
    total_generated: int
    total_approved: int
    discovered_molecules: List[str]

class ProteinRequest(BaseModel):
    """Request to fetch a protein structure from RCSB."""
    pdb_id: str

class ProteinResponse(BaseModel):
    """Protein metadata response."""
    pdb_id: str
    title: str
    method: str
    downloaded: bool

class PropertyRequest(BaseModel):
    """Request to fetch chemical properties for a SMILES string."""
    smiles: str

class PropertyResponse(BaseModel):
    """Chemical property response."""
    smiles: str
    molecular_weight: Optional[float] = None
    logp: Optional[float] = None
    h_bond_donors: Optional[int] = None
    h_bond_acceptors: Optional[int] = None


# ==================== API Endpoints ====================

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {
        "message": "Eureka AI Backend is running!",
        "version": "1.0.0",
        "pipeline": "Multi-Criteria Drug Discovery (GenAI + ML)",
        "note": "Strictly Generative AI. No Agentic AI."
    }


@app.get("/api/status")
def get_status():
    """Check which AI models are currently loaded and available."""
    models = {}
    models['bioactivity_grader'] = os.path.exists('ai_models/ml_grader_model.pkl')
    models['toxicity_grader'] = os.path.exists('ai_models/toxicity_grader.pkl')
    models['genai_lstm'] = os.path.exists('ai_models/genai_trained_weights.pth')
    models['genai_untrained'] = os.path.exists('ai_models/genai_untrained.pth')
    
    datasets = {}
    datasets['zinc_smiles'] = os.path.exists('data/zinc_smiles.csv')
    datasets['chembl_target'] = os.path.exists('data/chembl_target_data.csv')
    datasets['chembl_cleaned'] = os.path.exists('data/chembl_cleaned_pubchem.csv')
    datasets['tox21'] = os.path.exists('data/tox21.csv')
    datasets['pdb_6lu7'] = os.path.exists('data/6lu7_target.pdb')
    
    return {"models": models, "datasets": datasets}


@app.post("/api/discover", response_model=DiscoveryResponse)
def run_discovery_pipeline(request: DiscoveryRequest):
    """
    Main endpoint: Runs the full Multi-Criteria Discovery Pipeline.
    Called when the user clicks "Discover" on the React dashboard.
    """
    print(f"\n[API] Discovery request: target={request.target_disease_id}, n={request.num_molecules}")
    
    try:
        valid_molecules = run_pipeline(
            num_molecules_to_generate=request.num_molecules,
            base_dir='.'
        )
        
        return DiscoveryResponse(
            status="success",
            total_generated=request.num_molecules,
            total_approved=len(valid_molecules),
            discovered_molecules=valid_molecules
        )
    except Exception as e:
        print(f"[API Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/protein", response_model=ProteinResponse)
def fetch_protein(request: ProteinRequest):
    """
    Downloads a protein structure from RCSB Protein Data Bank.
    Called when the user selects a disease target on the dashboard.
    """
    print(f"\n[API] Protein request: {request.pdb_id}")
    
    pdb_path = download_pdb(request.pdb_id, output_dir="data")
    info = get_protein_info(request.pdb_id)
    
    return ProteinResponse(
        pdb_id=info['pdb_id'],
        title=info['title'],
        method=info['method'],
        downloaded=pdb_path is not None
    )


@app.post("/api/properties", response_model=PropertyResponse)
def fetch_properties(request: PropertyRequest):
    """
    Fetches Lipinski Rule of 5 properties for a single SMILES string.
    Called when the user enters a custom molecule on the dashboard.
    """
    print(f"\n[API] Property request: {request.smiles[:30]}...")
    
    mw, logp, hbd, hba = get_pubchem_properties(request.smiles)
    
    return PropertyResponse(
        smiles=request.smiles,
        molecular_weight=float(mw) if mw else None,
        logp=float(logp) if logp else None,
        h_bond_donors=int(hbd) if hbd else None,
        h_bond_acceptors=int(hba) if hba else None
    )


# ==================== Server ====================
if __name__ == "__main__":
    print("==================================================")
    print("  EUREKA: FastAPI Web Server")
    print("  Strictly GenAI + ML. No Agentic AI.")
    print("==================================================")
    print("\nStarting server on http://localhost:8000")
    print("API Docs: http://localhost:8000/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
