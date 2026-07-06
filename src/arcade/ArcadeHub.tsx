import { motion } from 'motion/react';
import { Gamepad2, BookOpen, ArrowRight, BookType, Sparkles } from 'lucide-react';
import GameCard from './components/GameCard';
import { Link } from 'react-router-dom';

export default function ArcadeHub() {
  return (
    <div className="font-body text-ocean-dark pb-20">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" aria-label="Introducción al Arcade">
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-float" aria-hidden="true"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-coral/20 rounded-full blur-2xl animate-float" aria-hidden="true" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ocean-dark/40 backdrop-blur-md border border-white/20 shadow-lg mb-8"
            >
              <Sparkles className="w-4 h-4 text-coral animate-pulse" aria-hidden="true" />
              <span className="text-sm font-black text-white tracking-widest uppercase">Aprender Jugando</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white text-3d text-stroke"
            >
              OCNOS <br />
              <span className="text-coral font-pixel text-[40px] lg:text-[60px] tracking-widest" style={{ WebkitTextStroke: '0' }}>ARCADE</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mb-10 font-bold leading-relaxed max-w-2xl mx-auto text-shadow-sm"
            >
              Educación literaria, diversidad cultural y manga. Descubre una nueva forma de explorar la investigación científica a través del juego.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            <GameCard 
              title="TOMOJI PYRAMID" 
              description="Pirámide isométrica de preguntas sobre la obra de Taniguchi." 
              accent="coral" 
              gameId="qbert" 
              route="piramide" 
              icon={<Gamepad2 size={64} className="text-white opacity-80" />} 
            />
            <GameCard 
              title="SERPIENTE DEL SABER" 
              description="Recolecta conceptos académicos válidos y evita los errores." 
              accent="seaweed" 
              gameId="snake" 
              route="serpiente" 
              icon={<BookType size={64} className="text-white opacity-80" />}
            />
            <GameCard 
              title="QUIZ RETRO" 
              description="Preguntas arcade con vidas, multiplicadores y jefes finales." 
              accent="sand" 
              gameId="quiz" 
              route="quiz" 
              icon={<Sparkles size={64} className="text-white opacity-80" />}
            />
          </div>

          <div className="flex justify-center">
            <Link 
              to="/interactivos"
              className="btn-3d px-8 py-4 bg-white text-ocean-dark hover:bg-coral hover:text-white transition-colors flex items-center justify-center gap-3 font-bold rounded-full group"
            >
              <BookOpen size={20} aria-hidden="true" />
              VOLVER A NARRATIVAS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
