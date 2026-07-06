import { motion } from 'motion/react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import DeepDives from './DeepDives';

interface AperturaBlockProps {
  narrative: any;
  openDeepDives: string[];
  toggleDeepDive: (id: string) => void;
  navigateTo: (block: any) => void;
}

export default function AperturaBlock({ narrative, openDeepDives, toggleDeepDive, navigateTo }: AperturaBlockProps) {
  const metadata = narrative?.metadata;
  const apertura = narrative?.blocks?.apertura;

  if (!metadata || !apertura) return null;

  return (
    <motion.div key="apertura" role="region" aria-label="Apertura"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-seaweed/10 text-seaweed text-xs font-black uppercase tracking-widest rounded-full border border-seaweed/20">
              {metadata.journal}
            </span>
            <span className="px-4 py-1.5 bg-coral/10 text-coral text-xs font-black uppercase tracking-widest rounded-full border border-coral/20">
              {metadata.year}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-ocean-dark leading-[1.1] tracking-tight">
            {metadata.title}
          </h1>

          <p className="text-xl md:text-2xl text-ocean-dark/60 font-medium italic">
            {metadata.authors}
          </p>

          <div className="bg-ocean-light/10 p-8 rounded-[2rem] border border-white/50 shadow-sm">
            <p className="text-xl text-ocean-dark font-bold leading-relaxed">
              <Sparkles className="inline-block mr-3 text-sand" size={28} />
              {metadata.gancho}
            </p>
          </div>
          
          <div className="flex items-center gap-6 pt-8">
            <button
              onClick={() => navigateTo('conflicto')}
              className="btn-3d px-10 py-4 bg-ocean-dark text-white hover:bg-coral transition-colors flex items-center gap-3 text-lg"
            >
              INICIAR EXPLORACIÓN <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="card-3d bg-gradient-to-br from-seaweed/10 to-ocean-dark/5 p-8 border-l-8 border-seaweed">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-seaweed text-white flex items-center justify-center shrink-0 shadow-lg">
                <User size={32} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-seaweed mb-2">Tu guía en esta narrativa</p>
                <p className="text-xl font-bold text-ocean-dark mb-3 leading-tight">{apertura.personaje}</p>
                <p className="text-sm font-medium text-ocean-dark/80 leading-relaxed">{apertura.contexto}</p>
              </div>
            </div>
          </div>

          <DeepDives 
            deepDives={apertura.deepDives} 
            openDeepDives={openDeepDives} 
            onToggle={toggleDeepDive} 
          />
        </div>
      </div>
    </motion.div>
  );
}
