import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, ChevronLeft, ArrowRight, Terminal, MousePointer2, ChevronDown } from 'lucide-react';
import DeepDives from './DeepDives';

interface ViajeBlockProps {
  narrative: any;
  openDeepDives: string[];
  toggleDeepDive: (id: string) => void;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function ViajeBlock({ narrative, openDeepDives, toggleDeepDive, navigateTo, navigateBackward }: ViajeBlockProps) {
  const [openDetail, setOpenDetail] = useState<number | null>(0);
  const viaje = narrative?.blocks?.viaje;

  if (!viaje) return null;

  return (
    <motion.div key="viaje" role="region" aria-label="Método"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-dark flex items-center gap-4">
            <Microscope className="text-seaweed" size={48} />
            {viaje.titulo}
          </h2>

          <div className="p-8 bg-seaweed/10 border-l-8 border-seaweed rounded-r-[2rem]">
            <p className="text-xl font-bold text-ocean-dark/80 leading-relaxed">
              {viaje.narrativa}
            </p>
          </div>

          <div className="flex gap-4 pt-8">
            <button onClick={navigateBackward} className="btn-3d px-6 py-3 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center gap-2">
              <ChevronLeft size={18} /> ANTERIOR
            </button>
            <button onClick={() => navigateTo('revelacion')} className="btn-3d px-8 py-3 bg-seaweed text-white hover:bg-ocean-dark transition-colors flex items-center gap-2">
              CONTINUAR <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="grid gap-3">
            {viaje.detalles?.map((detail: any, i: number) => {
              const isOpen = openDetail === i;
              return (
                <div key={i} className="flex flex-col bg-white/60 border border-ocean-dark/10 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setOpenDetail(isOpen ? null : i)}
                    className="flex items-center justify-between p-5 w-full text-left hover:bg-ocean-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-seaweed/50"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs font-black uppercase text-seaweed shrink-0 pr-4">{detail.label}</span>
                    <ChevronDown size={20} className={`text-ocean-dark/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-ocean-dark/5 mt-2">
                          <span className="text-base font-bold text-ocean-dark block mt-3">{detail.value}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {viaje.limitaciones && viaje.limitaciones.length > 0 && (
            <div className="bg-ocean-dark/5 p-8 rounded-[2rem] border border-ocean-dark/10">
              <h4 className="font-display text-xl font-bold text-ocean-dark mb-6 flex items-center gap-3">
                <Terminal size={24} className="text-ocean-dark/50" /> Límites del diseño
              </h4>
              <ul className="space-y-4">
                {viaje.limitaciones.map((lim: string, i: number) => (
                  <li key={i} className="flex gap-4 text-base font-medium text-ocean-dark/80">
                    <span className="text-seaweed font-black shrink-0" aria-hidden="true">•</span>
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {viaje.reflexion && (
            <div className="bg-coral/10 p-8 rounded-[2rem] border border-coral/20">
              <h4 className="font-display text-xl font-bold text-coral mb-4 flex items-center gap-2">
                <MousePointer2 size={24} /> Reflexión
              </h4>
              <p className="text-lg font-bold text-ocean-dark/80 italic">{viaje.reflexion}</p>
            </div>
          )}

          <DeepDives 
            deepDives={viaje.deepDives} 
            openDeepDives={openDeepDives} 
            onToggle={toggleDeepDive} 
          />
        </div>
      </div>
    </motion.div>
  );
}
