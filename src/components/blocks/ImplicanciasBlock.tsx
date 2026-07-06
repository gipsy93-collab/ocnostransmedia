import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ChevronLeft, ArrowRight, Brain, Book, ChevronDown } from 'lucide-react';

interface ImplicanciasBlockProps {
  narrative: any;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function ImplicanciasBlock({ narrative, navigateTo, navigateBackward }: ImplicanciasBlockProps) {
  const [openCognitiva, setOpenCognitiva] = useState<number | null>(0);
  const [openEscritura, setOpenEscritura] = useState<number | null>(0);
  const implicancias = narrative?.blocks?.implicancias;

  if (!implicancias) return null;

  return (
    <motion.div key="implicancias" role="region" aria-label="Implicancias"
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
            {implicancias.title}
          </h2>
        </div>

        <div className="lg:col-span-6">
          <div className="p-10 bg-coral/10 border border-coral/20 rounded-[2.5rem] h-full shadow-lg">
            <h3 className="font-display text-2xl font-bold text-coral mb-8 flex items-center gap-4">
              <Brain size={32} /> Tareas Cognitivas
            </h3>
            <div className="grid gap-3">
              {implicancias.tareasCognitivas?.map((tarea: any, i: number) => {
                const isOpen = openCognitiva === i;
                return (
                  <div key={i} className="flex flex-col bg-white/60 border border-coral/20 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => setOpenCognitiva(isOpen ? null : i)}
                      className="flex items-center justify-between p-5 w-full text-left hover:bg-coral/10 transition-colors focus:outline-none focus:ring-2 focus:ring-coral/50"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-ocean-dark text-lg shrink-0 pr-4">{tarea.nombre}</span>
                      <ChevronDown size={20} className={`text-coral/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-coral/10 mt-2">
                            <p className="text-base font-medium text-ocean-dark/70 leading-relaxed mt-3">{tarea.objetivo}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-8">
          <div className="p-10 bg-seaweed/10 border border-seaweed/20 rounded-[2.5rem] shadow-lg">
            <h3 className="font-display text-2xl font-bold text-seaweed mb-8 flex items-center gap-4">
              <Book size={32} /> Tareas de Escritura
            </h3>
            <div className="grid gap-3">
              {implicancias.tareasEscritura?.map((tarea: any, i: number) => {
                const isOpen = openEscritura === i;
                return (
                  <div key={i} className="flex flex-col bg-white/60 border border-seaweed/20 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => setOpenEscritura(isOpen ? null : i)}
                      className="flex items-center justify-between p-5 w-full text-left hover:bg-seaweed/10 transition-colors focus:outline-none focus:ring-2 focus:ring-seaweed/50"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-ocean-dark text-lg shrink-0 pr-4">{tarea.nombre}</span>
                      <ChevronDown size={20} className={`text-seaweed/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-seaweed/10 mt-2">
                            <p className="text-base font-medium text-ocean-dark/70 leading-relaxed mt-3">{tarea.objetivo}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-ocean-dark/5 p-8 rounded-3xl text-center">
            <p className="text-xs font-mono text-ocean-dark/60 uppercase tracking-widest">{implicancias.ref}</p>
          </div>

          <div className="flex justify-center gap-6 pt-4">
            <button onClick={navigateBackward} className="btn-3d px-6 py-4 bg-white text-ocean-dark hover:bg-ocean-dark/10 transition-colors flex items-center gap-2">
              <ChevronLeft size={18} /> ANTERIOR
            </button>
            <button onClick={() => navigateTo('reflexion')} className="btn-3d px-10 py-4 bg-ocean-dark text-white hover:bg-seaweed transition-colors flex items-center gap-3">
              CONTINUAR A REFLEXIÓN <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
