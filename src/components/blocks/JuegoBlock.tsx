import { motion } from 'motion/react';
import { Gamepad2, ChevronLeft, ArrowRight, Brain, Terminal, RotateCcw, Sparkles } from 'lucide-react';
import SnakeGame from '../SnakeGame';
import QuizGameEmbedded from '../QuizGameEmbedded';
import PiramideGameEmbedded from '../PiramideGameEmbedded';

interface JuegoBlockProps {
  narrative: any;
  selectedGame: 'snake' | 'quiz' | 'piramide' | null;
  setSelectedGame: (game: 'snake' | 'quiz' | 'piramide' | null) => void;
  navigateTo: (block: any) => void;
  navigateBackward: () => void;
}

export default function JuegoBlock({ narrative, selectedGame, setSelectedGame, navigateTo, navigateBackward }: JuegoBlockProps) {
  const juegos = narrative?.blocks?.juegos;

  if (!juegos || juegos.length === 0) return null;

  if (!selectedGame) {
    return (
      <motion.div key="juego-select" role="region" aria-label="Selección de juegos"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-dark flex items-center gap-4">
              <Gamepad2 className="text-seaweed" size={48} />
              Juegos
            </h2>
            
            <div className="bg-seaweed/10 border-l-8 border-seaweed p-8 rounded-r-[2rem]">
              <p className="text-xl font-bold text-ocean-dark/80 leading-relaxed">
                Pon a prueba lo aprendido en esta sección con nuestras experiencias interactivas y consolida tu conocimiento.
              </p>
            </div>

            <div className="flex gap-4 pt-8">
              <button onClick={navigateBackward} className="btn-3d px-6 py-3 bg-ocean-dark/10 text-ocean-dark hover:bg-ocean-dark/20 transition-colors flex items-center gap-2">
                <ChevronLeft size={18} /> ANTERIOR
              </button>
              {narrative.blocks.mapa ? (
                <button onClick={() => navigateTo('mapa')} className="btn-3d px-8 py-3 bg-seaweed text-white hover:bg-ocean-dark transition-colors flex items-center gap-2">
                  CONTINUAR <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={() => navigateTo('reflexion')} className="btn-3d px-8 py-3 bg-seaweed text-white hover:bg-ocean-dark transition-colors flex items-center gap-2">
                  CONTINUAR <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6">
              {juegos.map((j: any) => (
                <button
                  key={j.juegoId}
                  onClick={() => setSelectedGame(j.juegoId as any)}
                  className="group bg-white border border-ocean-dark/10 hover:border-seaweed/50 rounded-[2rem] p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-6"
                >
                  <div className="w-20 h-20 rounded-[1.5rem] bg-seaweed/10 text-seaweed flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-seaweed group-hover:text-white transition-all shadow-sm">
                    {j.juegoId === 'snake' ? <Gamepad2 size={36} /> : j.juegoId === 'quiz' ? <Brain size={36} /> : <Terminal size={36} />}
                  </div>
                  
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-seaweed mb-2 block">
                      {j.juegoId === 'snake' ? 'Retro Arcade' : j.juegoId === 'quiz' ? 'Desafío Rápido' : 'Lógica Visual'}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-ocean-dark mb-2 group-hover:text-seaweed transition-colors">{j.titulo}</h3>
                    <p className="text-base font-medium text-ocean-dark/70 leading-relaxed line-clamp-2">{j.descripcion}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const juegoActual = juegos.find((j: any) => j.juegoId === selectedGame);
  return (
    <motion.div key="juego-play" role="region" aria-label={`Jugando: ${juegoActual?.titulo}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="card-3d p-8 md:p-12 border-t-8 border-seaweed">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-seaweed/10 text-seaweed flex items-center justify-center shrink-0 shadow-sm">
              <Gamepad2 size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-ocean-dark mb-1">{juegoActual?.titulo}</h2>
              <p className="text-base font-medium text-ocean-dark/70">{juegoActual?.descripcion}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedGame(null)}
            className="btn-3d px-6 py-3 bg-ocean-dark/5 text-ocean-dark hover:bg-ocean-dark hover:text-white transition-colors flex items-center gap-2 text-sm shrink-0"
          >
            <RotateCcw size={16} /> CAMBIAR JUEGO
          </button>
        </div>

        <div className="bg-sand/10 border border-sand/30 rounded-[1.5rem] p-6 mb-8">
          <p className="text-base font-bold text-ocean-dark/80 flex items-center gap-3">
            <Sparkles size={20} className="text-sand shrink-0" />
            <span>{juegoActual?.instrucciones}</span>
          </p>
        </div>

        <div className="bg-[#0B0C10] rounded-[2rem] overflow-hidden border-4 border-ocean-dark shadow-2xl relative z-10 min-h-[500px]">
          {selectedGame === 'snake' && <SnakeGame embedded onComplete={() => setSelectedGame(null)} />}
          {selectedGame === 'quiz' && <QuizGameEmbedded embedded onComplete={() => setSelectedGame(null)} />}
          {selectedGame === 'piramide' && <PiramideGameEmbedded embedded onComplete={() => setSelectedGame(null)} />}
        </div>
      </div>
    </motion.div>
  );
}
