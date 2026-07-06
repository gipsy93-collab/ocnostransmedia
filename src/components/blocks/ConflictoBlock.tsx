import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, ChevronLeft, ArrowRight, Lightbulb, Search, ChevronDown, Waves } from 'lucide-react';
import DeepDives from './DeepDives';

interface ConflictoBlockProps {
  narrative: any;
  openDeepDives: string[];
  toggleDeepDive: (id: string) => void;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function ConflictoBlock({ narrative, openDeepDives, toggleDeepDive, navigateTo, navigateBackward }: ConflictoBlockProps) {
  const [openGlossary, setOpenGlossary] = useState<number | null>(0);
  const conflicto = narrative?.blocks?.conflicto;

  if (!conflicto) return null;

  return (
    <motion.div key="conflicto" role="region" aria-label="El Problema"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-dark flex items-center gap-4">
            <Waves className="text-ocean-base" size={48} />
            El Problema
          </h2>

          <div className="prose prose-ocean max-w-none">
            <p className="text-2xl font-bold text-ocean-dark/80 leading-relaxed">
              {conflicto.problema}
            </p>
          </div>

          <div className="bg-coral/10 border-l-4 border-coral p-8 rounded-r-2xl">
            <h4 className="text-sm font-black uppercase tracking-widest text-coral mb-4 flex items-center gap-2">
              <Lightbulb size={18} /> ¿Por qué importa esto?
            </h4>
            <p className="text-lg font-bold text-ocean-dark/80 leading-relaxed">
              {conflicto.porQueImporta}
            </p>
          </div>

          {conflicto.contexto && (
            <div className="bg-ocean-dark/5 p-8 rounded-[2rem] border border-ocean-dark/10">
              <p className="text-lg font-medium text-ocean-dark/80 leading-relaxed">
                {conflicto.contexto}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-8">
            <button onClick={navigateBackward} className="btn-3d px-6 py-3 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center gap-2">
              <ChevronLeft size={18} /> ANTERIOR
            </button>
            <button onClick={() => navigateTo('viaje')} className="btn-3d px-8 py-3 bg-coral text-white hover:bg-ocean-dark transition-colors flex items-center gap-2">
              CONTINUAR <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="grid gap-4">
            {conflicto.dataPoints?.map((point: string, i: number) => (
              <div key={i} className="p-6 bg-white/60 backdrop-blur-sm border border-ocean-dark/10 rounded-[1.5rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-coral/20 text-coral flex items-center justify-center shrink-0">
                  <Lightbulb size={24} />
                </div>
                <p className="text-base font-bold text-ocean-dark leading-snug">{point}</p>
              </div>
            ))}
          </div>

          {conflicto.glossary && conflicto.glossary.length > 0 && (
            <div className="bg-sand/10 border border-sand/30 p-8 rounded-[2rem]" role="region" aria-label="Glosario de términos">
              <h4 className="text-xs font-black uppercase tracking-widest text-sand mb-6 flex items-center gap-2">
                <Search size={16} /> Micro-glosario
              </h4>
              <dl className="grid gap-3">
                {conflicto.glossary.map((item: any, i: number) => {
                  const isOpen = openGlossary === i;
                  return (
                    <div key={i} className="flex flex-col bg-white/60 border border-sand/20 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => setOpenGlossary(isOpen ? null : i)}
                        className="flex items-center justify-between p-5 w-full text-left hover:bg-sand/10 transition-colors focus:outline-none focus:ring-2 focus:ring-sand/50"
                        aria-expanded={isOpen}
                      >
                        <dt className="font-bold text-ocean-dark text-lg underline decoration-sand decoration-2 underline-offset-4 shrink-0 pr-4">{item.term}</dt>
                        <ChevronDown size={20} className={`text-sand/70 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 pt-0 border-t border-sand/10 mt-2">
                              <dd className="text-base font-medium text-ocean-dark/70 leading-relaxed mt-3">{item.definition}</dd>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          <DeepDives 
            deepDives={conflicto.deepDives} 
            openDeepDives={openDeepDives} 
            onToggle={toggleDeepDive} 
          />
        </div>
      </div>
    </motion.div>
  );
}
