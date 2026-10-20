/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Semillero from './pages/Semillero';
import Actualidad from './pages/Actualidad';
import Interactivos from './pages/Interactivos';
import InteractivosLegacy from './pages/InteractivosLegacy';
import DetectivesLanding from './pages/detectives/DetectivesLanding';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import QuizGame from './arcade/quiz/QuizGame';
import PiramidePage from './arcade/piramide/PiramidePage';
import SnakePage from './arcade/snake/SnakePage';
import ArcadeHub from './arcade/ArcadeHub';
import ArcadeLayout from './arcade/ArcadeLayout';
import EditorialRoster from './components/EditorialRoster';
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowDown, Compass } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the Hero sinking interaction
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "center start"]
  });

  // Capa 1: El video se hunde en profundidad (escala, oscurecimiento y sutil desenfoque)
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.80]);
  const heroDarken = useTransform(scrollYProgress, [0, 1], [0.35, 0.88]);
  const heroBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(5px)"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    } else if (!prefersReducedMotion && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [prefersReducedMotion]);

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalogo-editorial');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#0c1a24] selection:bg-sand/30 selection:text-ocean-dark">
      
      {/* ========================================================================= */}
      {/* CAPA 1 (FONDO): HERO DE VIDEO EN PROFUNDIDAD (Sticky Layer z-10)          */}
      {/* ========================================================================= */}
      <div className="sticky top-0 h-[100dvh] w-full z-10 overflow-hidden flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full origin-center"
          style={{
            scale: prefersReducedMotion ? 1 : heroScale,
            filter: prefersReducedMotion ? 'none' : heroBlur,
          }}
        >
          {/* Video Panorámico Cinematográfico */}
          <motion.video
            ref={videoRef}
            poster="/videos/carrera-ocnos-poster.jpg"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-label="Video de fondo: carrera de lectura OCNOS"
          >
            <source src="/videos/carrera-ocnos.webm" type="video/webm" />
            <source src="/videos/carrera-ocnos.mp4" type="video/mp4" />
          </motion.video>

          {/* Capa de oscurecimiento dinámico: se va haciendo más oscura al hacer scroll */}
          <motion.div 
            className="absolute inset-0 bg-[#0c1a24]"
            style={{ opacity: prefersReducedMotion ? 0.4 : heroDarken }}
          />

          {/* Viñeta radial permanente */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,15,22,0.85)_100%)] pointer-events-none" />

          {/* Contenido Central del Hero (Desaparece velozmente con el primer tramo de scroll) */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6"
            style={{
              opacity: prefersReducedMotion ? 1 : textOpacity,
              y: prefersReducedMotion ? 0 : textY
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sand text-[11px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 shadow-lg text-center"
            >
              <Sparkles size={14} className="text-sand shrink-0 animate-pulse" aria-hidden="true" />
              <span>Revista de Estudios sobre Lectura</span>
            </motion.div>

            <motion.h1 
              className="font-serif text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-wider drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] text-center leading-none"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              OCNOS
            </motion.h1>

            <motion.p 
              className="text-xl sm:text-3xl md:text-4xl text-sand font-serif italic tracking-widest mt-1 sm:mt-2 drop-shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              Transmedia
            </motion.p>

            {/* Botones de Acción Principal Accesibles y Responsive */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 w-full max-w-md sm:max-w-none px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button 
                onClick={scrollToCatalog}
                aria-label="Desplazarse hacia abajo al catálogo de investigaciones"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full bg-gradient-to-r from-coral to-[#e27375] hover:from-coral/90 hover:to-[#e27375]/90 text-white text-sm sm:text-base font-bold tracking-wider flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(232,139,140,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-sand focus-visible:outline-none"
              >
                <Compass size={18} aria-hidden="true" />
                <span>EXPLORAR INVESTIGACIONES</span>
                <ArrowDown size={16} className="animate-bounce" aria-hidden="true" />
              </button>

              <Link 
                to="/interactivos"
                aria-label="Ir al Catálogo Editorial interactivo"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-medium tracking-wide backdrop-blur-md border border-white/20 transition-all hover:scale-105 flex items-center justify-center focus-visible:ring-4 focus-visible:ring-sand focus-visible:outline-none text-center"
              >
                Catálogo Editorial
              </Link>
            </motion.div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex flex-col items-center gap-1.5 pointer-events-none opacity-85" aria-hidden="true">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/80 font-mono">Desliza para entrar</span>
              <ArrowDown size={15} className="text-sand animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* CAPA 2 (FRENTE): CATÁLOGO DE ARTÍCULOS QUE DEVORA AL VIDEO (z-20)          */}
      {/* ========================================================================= */}
      <div 
        id="catalogo-editorial"
        className="relative z-20 bg-[#f3fbfa] rounded-t-[36px] md:rounded-t-[56px] shadow-[0_-35px_80px_rgba(0,0,0,0.45)] border-t border-outline-variant/40 overflow-hidden"
      >
        {/* Pestaña / Indicador de elevación superior */}
        <div className="w-full flex justify-center pt-5 pb-1">
          <div className="w-20 h-1.5 rounded-full bg-outline-variant/60" />
        </div>

        {/* Componente del Catálogo / Roster */}
        <EditorialRoster />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/semillero" element={<Semillero />} />
            <Route path="/actualidad" element={<Actualidad />} />
            <Route path="/interactivos" element={<Interactivos />} />
            <Route path="/interactivos/detectives" element={<DetectivesLanding />} />
            <Route path="/interactivos-archivo-legacy" element={<InteractivosLegacy />} />
            <Route path="/arcade" element={<ArcadeLayout />}>
              <Route index element={<ArcadeHub />} />
              <Route path="quiz" element={<QuizGame />} />
              <Route path="serpiente" element={<SnakePage />} />
              <Route path="piramide" element={<PiramidePage />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </MotionConfig>
  );
}

