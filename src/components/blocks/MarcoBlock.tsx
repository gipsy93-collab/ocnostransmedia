import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronLeft, ArrowRight, Lightbulb, ChevronDown } from 'lucide-react';
import DeepDives from './DeepDives';

interface MarcoBlockProps {
  narrative: any;
  openDeepDives: string[];
  toggleDeepDive: (id: string) => void;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function MarcoBlock({ narrative, openDeepDives, toggleDeepDive, navigateTo, navigateBackward }: MarcoBlockProps) {
  const [openDetail, setOpenDetail] = useState<number | null>(0);
  const marco = narrative?.blocks?.marco;

  if (!marco) return null;

  return (
    <motion.div key="marco" role="region" aria-label="Discusión"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-dark flex items-center gap-4">
            <Brain className="text-sand" size={48} />
            {marco.titulo}
          </h2>

          {marco.narrativa && (
            <div className="bg-sand/10 border-l-8 border-sand p-8 rounded-r-[2rem]">
              <p className="text-xl font-bold text-ocean-dark/80 leading-relaxed">
                {marco.narrativa}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-8">
            <button onClick={navigateBackward} className="btn-3d px-6 py-3 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center gap-2">
              <ChevronLeft size={18} /> ANTERIOR
            </button>
            <button onClick={() => navigateTo('nucleo')} className="btn-3d px-8 py-3 bg-sand text-ocean-dark hover:bg-ocean-dark hover:text-white transition-colors flex items-center gap-2">
              CONTINUAR <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="grid gap-3">
            {marco.detalles?.map((detail: any, i: number) => {
              const isOpen = openDetail === i;
              return (
                <div key={i} className="flex flex-col bg-white/60 border border-ocean-dark/10 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setOpenDetail(isOpen ? null : i)}
                    className="flex items-center justify-between p-5 w-full text-left hover:bg-ocean-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-sand/50"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs font-black uppercase text-sand shrink-0 pr-4">{detail.label}</span>
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

          {marco.reflexion && (
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-sand/30 shadow-lg">
              <h4 className="font-display text-xl font-bold text-ocean-dark mb-4 flex items-center gap-3">
                <Lightbulb size={24} className="text-sand" /> Reflexión
              </h4>
              <p className="text-lg font-bold text-ocean-dark/80 italic leading-relaxed">{marco.reflexion}</p>
            </div>
          )}

          <DeepDives 
            deepDives={marco.deepDives} 
            openDeepDives={openDeepDives} 
            onToggle={toggleDeepDive} 
          />
        </div>
      </div>
    </motion.div>
  );
}
