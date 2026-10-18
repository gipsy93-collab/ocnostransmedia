import { motion } from 'motion/react';
import { Map as MapIcon, ChevronLeft, ArrowRight } from 'lucide-react';
import MindMapViewer from '../MindMapViewer';

interface MapaBlockProps {
  narrative: any;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function MapaBlock({ narrative, navigateTo, navigateBackward }: MapaBlockProps) {
  const mapa = narrative?.mapa || narrative?.blocks?.mapa;

  if (!mapa) return null;

  // Recolectar glosarios de todos los bloques posibles para máxima cobertura
  const allGlossary = [
    ...(narrative?.blocks?.conflicto?.glossary || []),
    ...(narrative?.blocks?.viaje?.glossary || []),
    ...(narrative?.blocks?.marco?.glossary || []),
    ...(narrative?.glossary || []),
  ];

  return (
    <motion.div
      key="mapa"
      role="region"
      aria-label="Mapa conceptual interactivo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full h-full flex-1 flex flex-col justify-between overflow-hidden p-1.5 sm:p-3"
    >
      <div className="w-full h-full flex-1 flex flex-col bg-white/95 dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden min-h-0">
        {/* Cabecera compacta de fase con botones de navegación integrados */}
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 mb-2 border-b border-slate-200/60 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-ocnos-cyan/15 text-ocnos-cyan-dark dark:text-ocnos-cyan flex items-center justify-center font-bold shadow-2xs shrink-0">
              <MapIcon size={16} aria-hidden="true" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#183446] dark:text-white truncate">
                Red Epistémica & Mapa Conceptual
              </h2>
              {narrative?.metadata?.authors && (
                <p className="text-[11px] text-slate-500 font-sans truncate">
                  {narrative.metadata.authors}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={navigateBackward} 
              className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              title="Volver al bloque anterior"
            >
              <ChevronLeft size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <button 
              onClick={() => navigateTo('reflexion')} 
              className="h-8 px-4 rounded-full bg-gradient-to-r from-ocnos-coral to-ocnos-orange hover:opacity-95 text-white shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              title="Continuar a la fase de reflexión"
            >
              <span>Reflexión</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Visor interactivo a pantalla completa ocupando todo el alto y ancho */}
        <div className="flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col">
          <MindMapViewer 
            titulo={mapa.titulo} 
            descripcion={mapa.descripcion} 
            nodos={mapa.nodos} 
            aristas={mapa.aristas}
            contextData={{
              glossary: allGlossary,
              authors: narrative?.metadata?.authors,
              metadata: narrative?.metadata
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
