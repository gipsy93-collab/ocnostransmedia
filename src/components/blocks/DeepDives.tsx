import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';

interface DeepDive {
  id: string;
  triggerLabel: string;
  content: string;
  type: string;
}

interface DeepDivesProps {
  deepDives?: DeepDive[];
  openDeepDives: string[];
  onToggle: (id: string) => void;
}

export default function DeepDives({ deepDives, openDeepDives, onToggle }: DeepDivesProps) {
  if (!deepDives || deepDives.length === 0) return null;

  return (
    <div className="mt-10 space-y-4" role="region" aria-label="Contenido opcional de profundización">
      <h4 className="text-xs font-black uppercase tracking-widest text-ocean-dark/60 flex items-center gap-2">
        <Search size={14} /> Profundiza en este contenido
      </h4>
      {deepDives.map((dive) => (
        <div key={dive.id} className="border-2 border-ocean-dark/10 rounded-3xl overflow-hidden">
          <button
            onClick={() => onToggle(dive.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(dive.id); } }}
            className="w-full p-6 bg-ocean-dark/5 hover:bg-ocean-dark/10 transition-colors flex items-center justify-between text-left"
            aria-expanded={openDeepDives.includes(dive.id)}
            aria-controls={`deep-dive-${dive.id}`}
          >
            <span className="font-bold text-ocean-dark flex items-center gap-3">
              🔍 {dive.triggerLabel}
            </span>
            <ArrowRight
              size={20}
              className={`transition-transform duration-200 ${openDeepDives.includes(dive.id) ? 'rotate-90' : ''}`}
            />
          </button>

          <AnimatePresence>
            {openDeepDives.includes(dive.id) && (
              <motion.div
                id={`deep-dive-${dive.id}`}
                role="region"
                aria-label={dive.triggerLabel}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white/60 border-t-2 border-ocean-dark/10">
                  {dive.content.includes('┌') ? (
                    <pre className="font-mono text-xs md:text-sm text-ocean-dark whitespace-pre-wrap overflow-x-auto bg-ocean-dark/5 p-4 rounded-xl" role="img" aria-label="Diagrama del modelo estadístico">
                      {dive.content}
                    </pre>
                  ) : (
                    <p className="text-sm font-medium text-ocean-dark/80 whitespace-pre-line leading-relaxed">
                      {dive.content}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
