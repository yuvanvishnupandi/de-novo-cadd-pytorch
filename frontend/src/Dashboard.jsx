import React, { useState } from 'react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate backend API call delay for now
    setTimeout(() => {
      setIsSearching(false);
      setResults({
        targetName: searchQuery,
        chemblId: "CHEMBL3927", // Simulated lookup
        moleculeCount: 263
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Enveda-style ambient gradient background blobs */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[60vw] h-[60vw] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-y-1/4"></div>

      {/* Clean Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-white/5 relative z-10 backdrop-blur-md bg-black/20">
        <div className="text-2xl font-semibold tracking-tighter flex items-center gap-2">
          <span className="w-4 h-4 bg-white rounded-sm inline-block"></span>
          EUREKA
        </div>
        <div className="text-sm tracking-widest uppercase text-white/50 hidden md:block">
          Pipeline / Target Acquisition
        </div>
        <a href="/" className="text-sm text-white/60 hover:text-white transition-colors">
          &larr; Back to Landing
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-24 md:pt-32 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Define your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Target.</span>
          </h1>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            EUREKA's universal pipeline adapts to any biological target. Enter a disease name or protein sequence to dynamically ingest ChEMBL bioactivity data and begin deterministic simulation.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-[#111] ring-1 ring-white/10 rounded-2xl flex flex-col md:flex-row items-center p-2 shadow-2xl overflow-hidden gap-2 md:gap-0">
            <div className="pl-6 pr-4 text-white/40 hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'Lung Cancer' or 'COVID-19 3CL Protease'"
              className="w-full bg-transparent text-xl py-4 px-4 md:px-2 outline-none text-white placeholder:text-white/30 font-light text-center md:text-left"
              disabled={isSearching}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-gray-200 transition-colors disabled:opacity-50 flex-shrink-0 flex justify-center"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Querying...
                </span>
              ) : 'Acquire Target'}
            </button>
          </div>
        </form>

        {/* Results / Status Area */}
        {results && !isSearching && (
          <div className="mt-16 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-fuchsia-400"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-2">TARGET LOCKED</div>
                  <h2 className="text-3xl font-bold tracking-tight">{results.targetName}</h2>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs font-mono text-white/40 mb-1">CHEMBL ID</div>
                  <div className="text-xl font-mono text-white/80 bg-white/5 px-3 py-1 rounded-md">{results.chemblId}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/50 rounded-xl p-5 border border-white/5">
                  <div className="text-sm text-white/50 mb-1">Raw Molecules</div>
                  <div className="text-3xl font-light">{results.moleculeCount}</div>
                </div>
                <div className="bg-black/50 rounded-xl p-5 border border-white/5">
                  <div className="text-sm text-white/50 mb-1">Target 3D Structure</div>
                  <div className="text-xl font-light text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Available
                  </div>
                </div>
                <div className="bg-black/50 rounded-xl p-5 border border-white/5">
                  <div className="text-sm text-white/50 mb-1">Data Status</div>
                  <div className="text-xl font-light text-cyan-400">Ready for Ingestion</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <button 
                  onClick={() => window.location.hash = `#results?target=${encodeURIComponent(results.targetName)}`}
                  className="bg-white text-black px-12 py-4 rounded-full font-semibold tracking-widest uppercase hover:scale-105 transition-transform duration-300"
                >
                  Initialize Pipeline
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <label className="cursor-pointer text-white/50 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 max-w-max mx-auto px-4 py-2 border border-white/10 rounded-full hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload FASTA Sequence (.fasta)
            <input 
              type="file" 
              accept=".fasta,.txt" 
              className="hidden" 
              onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  setSearchQuery(`FASTA: ${e.target.files[0].name}`);
                }
              }} 
            />
          </label>
        </div>

      </main>
    </div>
  );
}
