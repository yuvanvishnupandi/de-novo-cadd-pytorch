import sys
import time

try:
    from chembl_webresource_client.new_client import new_client
except ImportError:
    print("Error: chembl_webresource_client not installed. Run: pip install chembl_webresource_client")
    sys.exit(1)

def analyze_target_novelty(target_query):
    """
    Simulates the first step of the EUREKA pipeline:
    Searching ChEMBL to verify if a target has existing drugs.
    """
    print(f"--- EUREKA Data Pipeline: ChEMBL Verification ---")
    print(f"Querying target: {target_query}\n")
    
    target_api = new_client.target
    
    print("[1/3] Searching for target in ChEMBL database...")
    search_results = target_api.search(target_query)
    
    if not search_results:
        print(f"[RESULT] No targets found for '{target_query}'.")
        print("CONCLUSION: Target is completely NOVEL. Requires 100% De Novo generation from FASTA sequence.")
        return
        
    # Get the best match
    target = search_results[0]
    target_chembl_id = target['target_chembl_id']
    pref_name = target['pref_name']
    
    print(f"[2/3] Match Found: {pref_name} ({target_chembl_id})")
    print(f"      Target Type: {target['target_type']}")
    
    # Now check for existing approved drugs/bioactivities
    print(f"[3/3] Scanning for existing bioactivity data (IC50) for {target_chembl_id}...")
    activity_api = new_client.activity
    activities = activity_api.filter(target_chembl_id=target_chembl_id, pchembl_value__isnull=False).only(['molecule_chembl_id', 'pchembl_value', 'standard_type', 'standard_value', 'standard_units'])
    
    # In a real scenario, we'd fetch all, but we limit to check if it's heavily drugged
    print("Fetching records (this may take a moment)...")
    try:
        # Fetching a small batch to check existence
        batch = activities[:50]
        if len(batch) == 0:
            print(f"\n[RESULT] 0 active compounds found.")
            print("CONCLUSION: Target is UNDRUGGABLE by known compounds. Proceeding to De Novo Generation.")
        elif len(batch) < 10:
            print(f"\n[RESULT] Only {len(batch)} active compounds found. Target is highly challenging.")
            print("CONCLUSION: Existing chemical space is insufficient. Proceeding to De Novo Generation to expand space.")
        else:
            print(f"\n[RESULT] Abundant existing compounds found (>{len(batch)} records).")
            print("CONCLUSION: Target is heavily drugged. EUREKA will use these as seed structures to generate novel, highly optimized derivatives.")
            
            # Print a few examples for the biologist
            print("\nExisting Seed Compounds (For AI Inspiration):")
            for i, act in enumerate(batch[:3]):
                print(f"  - Molecule: {act['molecule_chembl_id']} | {act['standard_type']}: {act['standard_value']} {act['standard_units']}")
                
    except Exception as e:
        print(f"\n[ERROR] Failed to fetch activities: {e}")
        print("Proceeding with blind De Novo Generation.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="EUREKA ChEMBL Target Analyzer")
    parser.add_argument("--target", type=str, default="KRAS", help="Target name or disease")
    args = parser.parse_args()
    
    analyze_target_novelty(args.target)
