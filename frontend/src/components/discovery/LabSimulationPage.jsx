import React from 'react';
import Interactive3DLab from './Interactive3DLab';

/**
 * LabSimulationPage
 * Molecular Discovery Studio Page
 * Houses the pure file-based ingestion pipeline, 11-stage deterministic CADD execution,
 * and 3D WebGL biophysics simulation environment.
 */
export default function LabSimulationPage({ onNavigate }) {
  return (
    <div className="w-full min-h-screen bg-[#141312] text-[#f5f2ee] font-sans antialiased">
      <Interactive3DLab onNavigate={onNavigate} />
    </div>
  );
}
