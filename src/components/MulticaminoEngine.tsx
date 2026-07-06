import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, BookOpen, Home } from 'lucide-react';
import { Narrative, BlockId, IMRyD_INDEX } from '../types/narrative';
import CinematicSection from './CinematicSection';
import DetectivesLanding from '../pages/detectives/DetectivesLanding';
import { useChatStore } from '../store/chatStore';

// Import blocks
import AperturaBlock from './blocks/AperturaBlock';
import ConflictoBlock from './blocks/ConflictoBlock';
import ViajeBlock from './blocks/ViajeBlock';
import RevelacionBlock from './blocks/RevelacionBlock';
import MarcoBlock from './blocks/MarcoBlock';
import NucleoBlock from './blocks/NucleoBlock';
import ImplicanciasBlock from './blocks/ImplicanciasBlock';
import JuegoBlock from './blocks/JuegoBlock';
import MapaBlock from './blocks/MapaBlock';
import ReflexionBlock from './blocks/ReflexionBlock';

interface Props {
  narrative: Narrative;
  onBack: () => void;
}

export default function MulticaminoEngine({ narrative, onBack }: Props) {
  const [currentBlock, setCurrentBlock] = useState<BlockId>('apertura');
  const [history, setHistory] = useState<BlockId[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [openDeepDives, setOpenDeepDives] = useState<string[]>([]);
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<'snake' | 'quiz' | 'piramide' | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const { setArticle, clearArticle } = useChatStore();

  useEffect(() => {
    setArticle(narrative.id, narrative.metadata.title);
    return () => clearArticle();
  }, [narrative.id, narrative.metadata.title, setArticle, clearArticle]);

  const visibleBlocks: BlockId[] = ['apertura', 'conflicto', 'viaje', 'revelacion', 'marco', 'nucleo'];
  if (narrative?.blocks?.implicancias) visibleBlocks.splice(6, 0, 'implicancias');
  if (narrative?.blocks?.juegos && narrative.blocks.juegos.length > 0) visibleBlocks.push('juego');
  if (narrative?.blocks?.mapa) visibleBlocks.push('mapa');
  visibleBlocks.push('reflexion');

  const currentIndex = visibleBlocks.indexOf(currentBlock);

  const navigateTo = useCallback((block: BlockId) => {
    setHistory(prev => [...prev, currentBlock]);
    setCurrentBlock(block);
  }, [currentBlock]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentBlock(prev);
    } else {
      onBack();
    }
  }, [history, onBack]);

  const navigateForward = useCallback(() => {
    const next = currentIndex + 1;
    if (next < visibleBlocks.length) {
      navigateTo(visibleBlocks[next]);
    }
  }, [currentIndex, visibleBlocks, navigateTo]);

  const navigateBackward = useCallback(() => {
    if (currentIndex > 0) {
      const prev = visibleBlocks[currentIndex - 1];
      navigateTo(prev);
    } else {
      goBack();
    }
  }, [currentIndex, visibleBlocks, navigateTo, goBack]);

  useEffect(() => {
    // Bloquear scroll del body (estándar para modales/portales full screen)
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        navigateForward();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        navigateBackward();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (openDeepDives.length > 0) {
          setOpenDeepDives([]);
        } else {
          goBack();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateForward, navigateBackward, goBack, openDeepDives]);

  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [currentBlock]);

  useEffect(() => {
    if (!completedBlocks.includes(currentBlock)) {
      setCompletedBlocks(prev => [...prev, currentBlock]);
    }
  }, [currentBlock, completedBlocks]);

  const reset = () => {
    setCurrentBlock('apertura');
    setHistory([]);
    setAnswers({});
    setOpenDeepDives([]);
    setCompletedBlocks([]);
  };

  const toggleDeepDive = (id: string) => {
    setOpenDeepDives(prev =>
      prev.includes(id)
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const renderBlock = () => {
    const commonProps = {
      narrative,
      openDeepDives,
      toggleDeepDive,
      navigateTo,
      navigateBackward
    };

    switch (currentBlock) {
      case 'apertura': return <AperturaBlock {...commonProps} />;
      case 'conflicto': return <ConflictoBlock {...commonProps} />;
      case 'viaje': return <ViajeBlock {...commonProps} />;
      case 'revelacion': return <RevelacionBlock {...commonProps} />;
      case 'marco': return <MarcoBlock {...commonProps} />;
      case 'nucleo': return <NucleoBlock narrative={narrative} navigateTo={navigateTo} />;
      case 'implicancias': return <ImplicanciasBlock narrative={narrative} navigateTo={navigateTo} navigateBackward={navigateBackward} />;
      case 'juego': return <JuegoBlock {...commonProps} selectedGame={selectedGame} setSelectedGame={setSelectedGame} />;
      case 'mapa': return <MapaBlock narrative={narrative} navigateTo={navigateTo} navigateBackward={navigateBackward} />;
      case 'reflexion': return <ReflexionBlock narrative={narrative} answers={answers} setAnswers={setAnswers} reset={reset} />;
      default: return null;
    }
  };

  const content = (
    <div data-in-narrative="true" className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 z-[9999] flex flex-col overflow-hidden">
      
      {/* Textura Global de Papel (Estética decimonónica en background) */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Elemento Decorativo: Fondo sutil de cuento infantil */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.20] mix-blend-multiply bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{ backgroundImage: `url('/assets/ocnos-ninos.png')` }}
      />

      {narrative?.id === 'detectives' ? (
        <div className="flex-1 overflow-hidden relative flex flex-col z-10">
          <header className="shrink-0 z-[60] bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg" role="navigation" aria-label="Navegación de la narrativa">
            <div className="flex items-center justify-between px-3 md:px-6 h-16">
              <div className="flex items-center gap-3">
                <BookOpen className="text-coral" size={20} />
                <span className="font-bold text-white text-sm">#LeeralosqueLeen</span>
              </div>
              <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center bg-coral text-white rounded-xl hover:bg-coral/80 transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Salir al Home"
              >
                <Home size={20} />
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <DetectivesLanding />
          </div>
        </div>
      ) : (
        <>
          <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full animate-float"></div>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-coral/10 blur-3xl rounded-full animate-float-delayed"></div>
          </div>

          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-ocean-dark focus:text-white focus:rounded-full focus:text-sm focus:font-black focus:uppercase focus:tracking-widest">
            Saltar al contenido principal
          </a>

          <header className="shrink-0 z-[60] bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg" role="navigation" aria-label="Navegación de la narrativa">
            <div className="flex items-center justify-between px-3 md:px-6 h-16">
              <button
                onClick={navigateBackward}
                className="flex items-center gap-1 md:gap-2 text-white/80 hover:text-white transition-colors font-bold text-xs md:text-sm shrink-0 px-3 py-2 rounded-xl hover:bg-white/10"
                aria-label="Navegar al bloque anterior"
              >
                <ChevronLeft size={16} /> VOLVER
              </button>

              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto px-1 flex-1 justify-center mx-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {visibleBlocks.map((blockId) => {
                  const indexItem = IMRyD_INDEX.find(i => i.id === blockId);
                  if (!indexItem) return null;
                  return (
                    <button
                      key={blockId}
                      role="tab"
                      aria-selected={currentBlock === blockId}
                      aria-label={`${indexItem.label}`}
                      onClick={() => navigateTo(blockId)}
                      tabIndex={currentBlock === blockId ? 0 : -1}
                      className={`h-9 px-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap shrink-0 ${
                        currentBlock === blockId
                          ? 'bg-white text-ocean-dark shadow-lg scale-105'
                          : completedBlocks.includes(blockId)
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80'
                      }`}
                    >
                      <span aria-hidden="true">{indexItem.icon}</span>
                      <span className="hidden md:inline">{indexItem.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {currentIndex + 1}/{visibleBlocks.length}
                </div>
                <button
                  onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center bg-coral text-white rounded-xl hover:bg-coral/80 transition-all shadow-lg hover:scale-105 active:scale-95"
                  title="Salir al Home"
                  aria-label="Volver al inicio"
                >
                  <Home size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative flex flex-col bg-white/20 backdrop-blur-sm">
            <CinematicSection intensity="low" className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
              
              {/* TUTOR: Personaje guía con burbuja de diálogo tipo cómic */}
              {narrative?.metadata?.tutor && narrative?.tutorTexts && narrative.tutorTexts[currentBlock] && (() => {
                const pos = narrative.tutorTexts[currentBlock].position || 'bottom-right';
                const isRight = pos.includes('right');
                
                return (
                  <div className={`fixed z-50 pointer-events-none hidden md:block ${
                    isRight ? 'bottom-0 right-0' : 'bottom-0 left-0'
                  }`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentBlock}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative flex flex-col ${
                          isRight ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Burbuja de Diálogo — flotando claramente ARRIBA del personaje */}
                        <div className={`relative z-20 w-64 lg:w-80 p-5 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.15)] pointer-events-auto mb-6 mx-6 ${
                          isRight ? 'mr-8' : 'ml-8'
                        }`}>
                          <p className="text-sm font-bold text-ocean-dark leading-relaxed">
                            {narrative.tutorTexts[currentBlock].text}
                          </p>
                          {/* Cola de la burbuja apuntando hacia abajo al personaje */}
                          <div 
                            className={`absolute w-5 h-5 bg-white rotate-45 shadow-[2px_2px_4px_rgb(0,0,0,0.06)] -bottom-2.5 ${
                              isRight ? 'right-12' : 'left-12'
                            }`}
                          />
                        </div>

                        {/* Avatar del Tutor — tamaño natural grande, efecto sticker con borde blanco */}
                        <motion.div
                          className="relative"
                          animate={{ rotate: [0, -1, 1, -0.5, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className={`w-[260px] lg:w-[340px] bg-white p-2.5 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.12)] border-2 border-white/80 ${
                            isRight ? '-scale-x-100' : ''
                          }`}>
                            <img
                              src={narrative.metadata.tutor.image} 
                              alt={narrative.metadata.tutor.name} 
                              className="w-full h-auto object-contain rounded-t-2xl"
                            />
                          </div>
                          {/* Badge de nombre */}
                          <div className={`absolute top-4 bg-ocean-dark text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap ${
                            isRight ? 'right-8' : 'left-8'
                          }`}>
                            {narrative.metadata.tutor.name}
                          </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                );
              })()}

              <main
                id="main-content"
                ref={mainRef}
                className={`outline-none min-h-full pb-20 relative z-10 transition-all duration-700 ease-out ${
                  narrative?.metadata?.tutor && narrative?.tutorTexts && narrative.tutorTexts[currentBlock]
                    ? narrative.tutorTexts[currentBlock].position?.includes('right') ? 'pr-0 md:pr-[300px] lg:pr-[380px]' : 'pl-0 md:pl-[300px] lg:pl-[380px]'
                    : ''
                }`}
                tabIndex={-1}
                role="main"
                aria-label={`Narrativa: ${narrative?.metadata?.title}`}
              >
                <AnimatePresence mode="wait">
                  {renderBlock()}
                </AnimatePresence>
              </main>
            </CinematicSection>
          </div>

          <footer className="h-12 bg-white/80 backdrop-blur-md border-t border-ocean-dark/10 px-6 flex items-center justify-between shrink-0 z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono font-black text-ocean-dark/60 bg-ocean-dark/5 px-2 py-1 rounded">
                ← → NAVEGAR
              </span>
              <span className="text-[10px] font-mono font-black text-ocean-dark/60 bg-ocean-dark/5 px-2 py-1 rounded">
                ESC VOLVER
              </span>
            </div>
            <div className="flex items-center gap-3 truncate">
              <div className="w-1.5 h-1.5 rounded-full bg-seaweed animate-pulse"></div>
              <span className="text-[10px] font-mono font-black text-ocean-dark/80 truncate max-w-[300px] uppercase tracking-tighter">
                {narrative?.metadata?.title}
              </span>
            </div>
          </footer>
        </>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
