import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Clock, Sparkles, Search } from 'lucide-react';
import { NARRATIVAS } from '../data/narrativas';
import type { Narrative } from '../types/narrative';
import MulticaminoEngine from '../components/MulticaminoEngine';
import { StaggerContainer, StaggerItem } from '../components/Stagger';
import { Link } from 'react-router-dom';
import CinematicSection from '../components/CinematicSection';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Interactivos() {
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const galleryRef = useRef<HTMLElement>(null);

  // Último artículo publicado
  const ultimoArticulo = NARRATIVAS[0];

  const filteredNarrativas = NARRATIVAS.filter(n => 
    n.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.metadata.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedNarrative) {
    return (
      <ErrorBoundary onReset={() => setSelectedNarrative(null)}>
        <MulticaminoEngine 
          narrative={selectedNarrative} 
          onBack={() => setSelectedNarrative(null)} 
        />
      </ErrorBoundary>
    );
  }

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, narrative: Narrative) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedNarrative(narrative);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e1] relative selection:bg-coral/30">
      {/* Textura Global de Papel */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Elemento Decorativo: Fondo sutil */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.20] mix-blend-multiply bg-cover bg-center bg-no-repeat blur-[4px]"
        style={{ backgroundImage: `url('/assets/ocnos-ninos.png')` }}
      />

      {/* Hero Section */}
      <CinematicSection intensity="high" className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f1e1]/80 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase tracking-wide">Nueva experiencia de lectura</span>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Explora una nueva forma de <span className="text-primary italic font-serif">leer</span>
            </motion.h1>

            <motion.p 
              className="text-slate-600 text-lg max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Transformamos artículos científicos en narrativas interactivas multicamino para una experiencia de aprendizaje inmersiva. El rigor de la ciencia se encuentra con el juego.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <button 
                onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              >
                DESCUBRIR NARRATIVAS
                <ArrowDown className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setSelectedNarrative(ultimoArticulo)}
                className="bg-white/80 backdrop-blur-md border border-slate-200 text-primary px-8 py-4 rounded-xl font-bold hover:bg-white transition-all duration-300 hover:shadow-md"
              >
                VER ARTÍCULO
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
            <div 
              className="relative overflow-hidden border-2 border-white/50 cursor-pointer group shadow-[8px_8px_0px_rgba(42,90,117,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(42,90,117,0.4)] transition-all duration-300"
              style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}
              onClick={() => setSelectedNarrative(ultimoArticulo)}
            >
              <img 
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" 
                src={ultimoArticulo.metadata.image} 
                alt={ultimoArticulo.metadata.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  <Clock className="w-3 h-3" />
                  Última publicación
                </span>
                <h3 className="text-white font-serif font-bold text-2xl leading-tight drop-shadow-lg">
                  {ultimoArticulo.metadata.title}
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  {ultimoArticulo.metadata.authors} · OCNOS {ultimoArticulo.metadata.year}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Hand-drawn ink line separator */}
        <div className="absolute bottom-0 left-0 w-full z-30 opacity-30 pointer-events-none flex justify-center pb-4 text-primary">
          <svg width="100%" height="20" viewBox="0 0 1000 20" preserveAspectRatio="none">
            <path d="M0,10 Q50,15 100,10 T200,10 T300,10 T400,10 T500,10 T600,10 T700,10 T800,10 T900,10 T1000,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 8 30 10 40 12"/>
          </svg>
        </div>
      </CinematicSection>



      {/* Narrative Grid */}
      <CinematicSection 
        id="galeria" 
        ref={galleryRef}
        intensity="medium"
        className="py-20 max-w-7xl mx-auto px-8 relative"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 relative z-10 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Exploraciones Destacadas</h2>
            <p className="text-slate-600 mt-2 font-serif italic">Nuestras últimas publicaciones científicas interactivas.</p>
            
          <div className="mt-8 relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-amber-900/40" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfaf5] border-2 border-amber-900/10 text-slate-900 rounded-full pl-11 pr-4 py-3 focus:outline-none focus:border-amber-900/30 focus:ring-4 focus:ring-amber-900/10 transition-all font-serif placeholder:text-amber-900/40 placeholder:italic shadow-sm hover:shadow-md"
            />
          </div>

          </div>
          <Link to="/interactivos" className="text-amber-800 font-bold flex items-center gap-2 hover:underline group mb-2 md:mb-4">
            Ver todas
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          {filteredNarrativas.map((narrative, idx) => (
            <div key={narrative.id}>
              <StaggerItem>
                <div
                  className="group relative flex flex-col h-full bg-[#fcfaf5] overflow-hidden transition-all duration-500 hover:-translate-y-4 shadow-xl hover:shadow-2xl border border-amber-900/10 cursor-pointer rounded-2xl"
                  onClick={() => setSelectedNarrative(narrative)}
                  onKeyDown={(e) => handleCardKeyDown(e, narrative)}
                  tabIndex={0}
                  role="article"
                  aria-label={`Abrir narrativa: ${narrative.metadata.title}`}
                >
                  {/* Inner Border to simulate "cromo" */}
                  <div className="absolute inset-1 border border-amber-700/20 rounded-[14px] pointer-events-none z-20"></div>
                  <div className="absolute inset-2 border border-amber-700/10 rounded-[10px] pointer-events-none z-20"></div>

                  <div className="w-full h-48 shrink-0 relative overflow-hidden p-2 pb-0">
                    <div className="w-full h-full relative overflow-hidden rounded-t-[10px] border border-amber-900/10">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 origin-center filter sepia-[0.1]" 
                        src={`/assets/cromos/cromo-${(idx % 20) + 1}.png`} 
                        alt="" 
                      />
                    </div>
                    <div className="absolute top-4 left-4 bg-[#fcfaf5]/95 backdrop-blur-md border border-amber-900/20 px-3 py-1.5 rounded-lg z-30 shadow-sm">
                      <span className="text-[9px] font-bold text-amber-900 tracking-widest uppercase font-serif">Ocnos {narrative.metadata.year}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col justify-between flex-grow relative z-10">
                    <div className="flex flex-col items-center justify-center h-full">
                      <h3 className="text-lg lg:text-xl font-serif font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors text-center line-clamp-4 mb-2">
                        {narrative.metadata.title}
                      </h3>
                    </div>

                    <div className="mt-auto pt-3 border-t border-amber-900/10 text-center space-y-1">
                      <p className="text-[11px] font-bold text-slate-800 font-serif line-clamp-1">{narrative.metadata.authors}</p>
                      <div className="flex flex-col items-center justify-center text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                        <span className="break-all text-center">DOI: 10.18239/ocnos_{narrative.metadata.year}.{narrative.id}</span>
                        <span className="flex items-center gap-1 font-sans mt-0.5">
                          <Clock className="w-3 h-3" /> {narrative.metadata.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glare effect */}
                  <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-[-150%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] transition-all duration-1000 group-hover:left-[150%] ease-in-out"></div>
                  </div>
                </div>
              </StaggerItem>
            </div>
          ))}
        </StaggerContainer>


      </CinematicSection>
    </div>
  );
}
