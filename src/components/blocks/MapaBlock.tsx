import { motion } from 'motion/react';
import { Map as MapIcon, ChevronLeft, ArrowRight } from 'lucide-react';
import MindMapViewer from '../MindMapViewer';

interface MapaBlockProps {
  narrative: any;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function MapaBlock({ narrative, navigateTo, navigateBackward }: MapaBlockProps) {
  const mapa = narrative?.blocks?.mapa;

  if (!mapa) return null;

  return (
    <motion.div key="mapa" role="region" aria-label="Mapa mental"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="card-3d p-8 md:p-16 border-t-8 border-[#66FCF1]">
        <div className="flex items-center gap-3 mb-6">
          <MapIcon className="text-[#66FCF1]" size={32} />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-ocean-dark">Mapa Mental</h2>
        </div>

        <MindMapViewer titulo={mapa.titulo} descripcion={mapa.descripcion} nodos={mapa.nodos} aristas={mapa.aristas} />

        <div className="flex justify-between items-center pt-6 border-t-2 border-ocean-dark/10 mt-6">
          <button onClick={navigateBackward} className="btn-3d px-4 py-2 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center gap-2 text-sm">
            <ChevronLeft size={16} /> ANTERIOR
          </button>
          <button onClick={() => navigateTo('reflexion')} className="btn-3d px-8 py-3 bg-ocean-dark text-white hover:bg-seaweed transition-colors flex items-center gap-2">
            CONTINUAR A REFLEXIÓN <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
