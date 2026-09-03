import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NARRATIVAS } from '../data/narrativas';
import type { Narrative } from '../types/narrative';
import MulticaminoEngine from '../components/MulticaminoEngine';
import EditorialRoster from '../components/EditorialRoster';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Interactivos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [initialBlock, setInitialBlock] = useState<any>(undefined);

  useEffect(() => {
    if (location.state && (location.state as any).autoSelectId) {
      const targetId = (location.state as any).autoSelectId;
      const found = NARRATIVAS.find(n => n.id === targetId);
      if (found) {
        setSelectedNarrative(found);
        if ((location.state as any).targetBlock) {
          setInitialBlock((location.state as any).targetBlock);
        }
      }
    }
  }, [location.state]);

  if (selectedNarrative) {
    return (
      <ErrorBoundary onReset={() => setSelectedNarrative(null)}>
        <MulticaminoEngine 
          narrative={selectedNarrative} 
          initialBlock={initialBlock}
          onBack={() => {
            setSelectedNarrative(null);
            setInitialBlock(undefined);
            navigate('/interactivos', { replace: true, state: {} });
          }} 
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3fbfa] text-[#151d1d] selection:bg-ocnos-cyan/20 selection:text-ocnos-cyan">
      {/* Catálogo Editorial de Investigaciones Macaron */}
      <EditorialRoster 
        onSelectNarrative={(nar, block) => {
          setSelectedNarrative(nar);
          setInitialBlock(block);
        }}
      />
    </div>
  );
}
