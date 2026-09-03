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
    <motion.div key="apertura" role="region" aria-label="Apertura de la investigación"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-14 flex flex-col justify-start min-h-full"
    >
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="px-3 sm:px-4 py-1.5 bg-seaweed/10 text-seaweed text-xs font-black uppercase tracking-widest rounded-full border border-seaweed/20">
              {metadata.journal}
            </span>
            <span className="px-3 sm:px-4 py-1.5 bg-coral/10 text-coral text-xs font-black uppercase tracking-widest rounded-full border border-coral/20">
              {metadata.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-ocean-dark leading-tight tracking-tight break-words">
            {metadata.title}
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-ocean-dark/70 font-medium italic">
            {metadata.authors}
          </p>

          <div className="bg-ocean-light/10 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-[2rem] border border-white/60 shadow-sm">
            <p className="text-base sm:text-xl text-ocean-dark font-bold leading-relaxed">
              <Sparkles className="inline-block mr-2.5 text-sand shrink-0" size={24} aria-hidden="true" />
              {metadata.gancho}
            </p>
          </div>
          
          <div className="flex items-center gap-4 pt-4 sm:pt-6">
            <button
              onClick={() => navigateTo('conflicto')}
              className="btn-3d min-h-[48px] px-8 py-3.5 bg-ocean-dark text-white hover:bg-coral transition-colors flex items-center justify-center gap-3 text-base sm:text-lg w-full sm:w-auto font-bold focus-visible:ring-4 focus-visible:ring-ocean-base focus-visible:outline-none cursor-pointer"
            >
              <span>INICIAR EXPLORACIÓN</span>
              <ArrowRight size={20} aria-hidden="true" />
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
