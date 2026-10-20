import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { NARRATIVAS, getNarrativeById } from '../data/narrativas';
import type { Narrative, BlockId } from '../types/narrative';
import { IMRyD_INDEX } from '../types/narrative';
import MulticaminoEngine from '../components/MulticaminoEngine';
import EditorialRoster from '../components/EditorialRoster';
import ErrorBoundary from '../components/ErrorBoundary';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

function isKnownBlock(value: string | null): value is BlockId {
  return !!value && IMRyD_INDEX.some((i) => i.id === value);
}

export default function Interactivos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const narParam = searchParams.get('nar');
  const blockParam = searchParams.get('b');

  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Metadatos rápidos para previsualización inmediata si están en el catálogo
  const catalogEntry = useMemo(
    () => (narParam ? NARRATIVAS.find((n) => n.id === narParam) || null : null),
    [narParam]
  );

  // Carga asíncrona bajo demanda de la narrativa completa
  useEffect(() => {
    let isCancelled = false;

    if (!narParam) {
      setSelectedNarrative(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getNarrativeById(narParam)
      .then((narrative) => {
        if (isCancelled) return;
        if (narrative) {
          setSelectedNarrative(narrative);
          setError(null);
        } else {
          setError(`No se encontró la investigación con ID "${narParam}".`);
          setSelectedNarrative(null);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error cargando narrativa:', err);
        setError('Ocurrió un error al cargar la investigación interactiva.');
        setSelectedNarrative(null);
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [narParam]);

  // Compatibilidad: navegaciones antiguas que usaban history state
  useEffect(() => {
    const st = location.state as { autoSelectId?: string; targetBlock?: string } | null;
    if (st?.autoSelectId) {
      const query = new URLSearchParams({ nar: st.autoSelectId });
      if (st.targetBlock) query.set('b', String(st.targetBlock));
      navigate({ pathname: '/interactivos', search: query.toString() }, { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const openNarrative = (narrative: Narrative, block?: BlockId) => {
    const query = new URLSearchParams({ nar: narrative.id });
    if (block) query.set('b', block);
    setSearchParams(query);
  };

  const closeNarrative = () => {
    setSearchParams(new URLSearchParams());
    setSelectedNarrative(null);
    setError(null);
  };

  // Estado de Carga
  if (loading && !selectedNarrative) {
    return (
      <div className="min-h-screen bg-[#f3fbfa] flex flex-col items-center justify-center p-6 text-[#151d1d]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-ocnos-cyan/20 flex flex-col items-center text-center animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ocnos-cyan/20 to-ocnos-coral/20 flex items-center justify-center text-ocnos-cyan mb-4">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <span className="text-xs uppercase font-mono tracking-widest text-ocnos-cyan font-bold mb-2">
            Ocnos Multicamino
          </span>
          <h2 className="text-lg font-serif font-bold text-[#183446] mb-2 line-clamp-2">
            {catalogEntry?.metadata?.title || 'Preparando narrativa interactiva...'}
          </h2>
          <p className="text-xs text-[#183446]/60 mb-6">
            Cargando bloques de lectura, evidencias IMRyD y desafíos cognitivos.
          </p>
          <button
            onClick={closeNarrative}
            className="text-xs text-[#183446]/50 hover:text-ocnos-cyan flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <div className="min-h-screen bg-[#f3fbfa] flex flex-col items-center justify-center p-6 text-[#151d1d]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-serif font-bold text-[#183446] mb-2">
            Investigación no disponible
          </h2>
          <p className="text-xs text-[#183446]/70 mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={closeNarrative}
            className="px-5 py-2.5 bg-ocnos-cyan text-white text-xs font-bold rounded-xl shadow-md hover:bg-ocnos-cyan/90 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo Editorial
          </button>
        </div>
      </div>
    );
  }

  // Narrativa Activa
  if (selectedNarrative) {
    return (
      <ErrorBoundary onReset={closeNarrative}>
        <MulticaminoEngine
          key={selectedNarrative.id}
          narrative={selectedNarrative}
          initialBlock={isKnownBlock(blockParam) ? blockParam : undefined}
          onBack={closeNarrative}
        />
      </ErrorBoundary>
    );
  }

  // Roster del Catálogo
  return (
    <div className="min-h-screen bg-[#f3fbfa] text-[#151d1d] selection:bg-ocnos-cyan/20 selection:text-ocnos-cyan overflow-x-hidden">
      {/* Catálogo Editorial de Investigaciones Macaron */}
      <EditorialRoster onSelectNarrative={openNarrative} />
    </div>
  );
}
