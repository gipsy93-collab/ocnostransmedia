import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NucleoBlockProps {
  narrative: any;
  navigateTo: (block: any) => void;
}

export default function NucleoBlock({ narrative, navigateTo }: NucleoBlockProps) {
  const nucleo = narrative?.blocks?.nucleo;

  if (!nucleo) return null;

  return (
    <motion.div key="nucleo" role="region" aria-label="Conclusión"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="card-3d p-8 md:p-16 bg-ocean-dark text-white relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-white/10 to-transparent opacity-50" aria-hidden="true"></div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-12">
            <Sparkles className="text-sand" size={16} aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Nodo Núcleo Obligatorio</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-display font-bold mb-10 text-sand drop-shadow-lg">
            {nucleo.pregunta}
          </h3>

          <div className="text-xl md:text-3xl font-bold leading-relaxed mb-16 text-white">
            {nucleo.conclusion}
          </div>

          <div className="bg-white/10 p-8 rounded-3xl border border-white/20 mb-12">
            <p className="text-xs font-mono text-white/80 uppercase tracking-widest mb-4 font-black">Referencia Formal</p>
            <p className="text-sm font-bold leading-relaxed text-white">{nucleo.formalRef}</p>
          </div>

          <button
            onClick={() => narrative.blocks.implicancias ? navigateTo('implicancias') : navigateTo('reflexion')}
            className="btn-3d px-12 py-5 bg-white text-ocean-dark text-xl hover:scale-105 transition-transform"
          >
            {narrative.blocks.implicancias ? 'VER IMPLICANCIAS' : 'CONTINUAR A REFLEXIÓN'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
