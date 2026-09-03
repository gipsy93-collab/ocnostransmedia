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

  return (
    <motion.div key="mapa" role="region" aria-label="Mapa mental interactivo"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-14 flex flex-col justify-start min-h-full"
    >
      <div className="card-3d p-4 sm:p-8 md:p-10 border-t-4 border-[#c5a059]">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/30 text-ocean-dark flex items-center justify-center shadow-xs">
            <MapIcon className="text-[#a4823e]" size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ocean-dark tracking-tight">Mapa Conceptual Interactivo</h2>
            <p className="text-xs sm:text-sm text-ocean-dark/75 font-serif italic">Red epistémica y conexiones teórico-metodológicas del artículo</p>
          </div>
        </div>

        <MindMapViewer 
          titulo={mapa.titulo} 
          descripcion={mapa.descripcion} 
          nodos={mapa.nodos} 
          aristas={mapa.aristas}
          contextData={{
            glossary: narrative?.blocks?.conflicto?.glossary,
            authors: narrative?.metadata?.authors
          }}
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t-2 border-ocean-dark/10 mt-6">
          <button 
            onClick={navigateBackward} 
            className="btn-3d min-h-[44px] px-5 py-2.5 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center justify-center gap-2 text-sm font-bold w-full sm:w-auto focus-visible:ring-4 focus-visible:ring-ocean-base focus-visible:outline-none cursor-pointer"
          >
            <ChevronLeft size={16} aria-hidden="true" /> ANTERIOR
          </button>
          <button 
            onClick={() => navigateTo('reflexion')} 
            className="btn-3d min-h-[44px] px-8 py-3 bg-ocean-dark text-white hover:bg-coral transition-colors flex items-center justify-center gap-2 font-bold w-full sm:w-auto focus-visible:ring-4 focus-visible:ring-ocean-base focus-visible:outline-none cursor-pointer"
          >
            <span>CONTINUAR A REFLEXIÓN</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
