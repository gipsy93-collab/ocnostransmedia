import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ChevronLeft, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import DeepDives from './DeepDives';

interface RevelacionBlockProps {
  narrative: any;
  openDeepDives: string[];
  toggleDeepDive: (id: string) => void;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function RevelacionBlock({ narrative, openDeepDives, toggleDeepDive, navigateTo, navigateBackward }: RevelacionBlockProps) {
  const [openHallazgo, setOpenHallazgo] = useState<number | null>(0);
  const revelacion = narrative?.blocks?.revelacion;

  if (!revelacion) return null;

  return (
    <motion.div key="revelacion" role="region" aria-label="Resultados"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-12 text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-dark inline-flex items-center gap-4">
            <GraduationCap className="text-seaweed" size={48} />
            {revelacion.title}
          </h2>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="grid gap-4">
            {revelacion.hallazgos?.map((hallazgo: any, i: number) => {
              const isOpen = openHallazgo === i;
              return (
                <div key={i} className="flex flex-col bg-white border border-ocean-dark/10 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <button 
                    onClick={() => setOpenHallazgo(isOpen ? null : i)}
                    className="flex items-center justify-between p-6 w-full text-left hover:bg-ocean-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-coral/50"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-block px-3 py-1 bg-coral/10 text-coral text-[10px] font-black uppercase rounded-full tracking-widest shrink-0">
                        HALLAZGO {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-lg font-bold text-ocean-dark m-0">
                        {hallazgo.label}
                      </h3>
                    </div>
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
                        <div className="px-6 pb-6 pt-0 border-t border-ocean-dark/5 mt-2">
                          <p className="text-base font-medium text-ocean-dark/80 leading-relaxed mt-4">
                            {hallazgo.value}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {revelacion.dataPoints && (
            <div className="flex flex-wrap gap-3 mt-6">
              {revelacion.dataPoints.map((point: string, i: number) => (
                <div key={i} className="px-5 py-3 bg-ocean-dark text-white rounded-full text-sm font-bold flex items-center gap-3 shadow-md">
                  <CheckCircle2 size={18} className="text-coral shrink-0" aria-hidden="true" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}

          <DeepDives 
            deepDives={revelacion.deepDives} 
            openDeepDives={openDeepDives} 
            onToggle={toggleDeepDive} 
          />
        </div>
      </div>
    </motion.div>
  );
}
