/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Semillero from './pages/Semillero';
import Actualidad from './pages/Actualidad';
import Interactivos from './pages/Interactivos';
import DetectivesLanding from './pages/detectives/DetectivesLanding';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import QuizGame from './arcade/quiz/QuizGame';
import PiramidePage from './arcade/piramide/PiramidePage';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    } else if (!prefersReducedMotion && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Cinematic hero - full window */}
      <motion.div 
        className="relative w-full h-screen max-h-[900px] cursor-pointer overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        onClick={() => navigate('/interactivos')}
        role="link"
        tabIndex={0}
        aria-label="Ir a Interactivos"
        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/interactivos'); }}
      >
        {/* Video background - cinematic full bleed */}
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
          initial={{ scale: 1.1 }}
          animate={{ scale: prefersReducedMotion ? 1 : 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <source src="/videos/carrera-ocnos.webm" type="video/webm" />
          <source src="/videos/carrera-ocnos.mp4" type="video/mp4" />
        </motion.video>

        {/* Dark gradient overlay - cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/95 via-ocean-dark/60 to-ocean-dark/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />

        {/* Centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <motion.h1 
            className="font-serif text-7xl md:text-9xl font-bold text-white tracking-wide drop-shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            OCNOS
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl text-white/90 font-serif italic tracking-widest mt-2 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          >
            Transmedia
          </motion.p>

          {/* Floating section icons */}
          <motion.div 
            className="flex items-center justify-center gap-6 md:gap-16 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link to="/interactivos" onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-coral flex items-center justify-center border-2 border-white/20 shadow-[6px_6px_0px_rgba(0,0,0,0.4)] group-hover:bg-coral/90 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0px_rgba(0,0,0,0.5)] transition-all animate-float" style={{ animationDelay: '0s', borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}>
                <Sparkles className="text-white drop-shadow-md" size={32} />
              </div>
              <span className="text-white/90 text-xs md:text-sm font-serif font-bold tracking-wider uppercase group-hover:text-white transition-colors drop-shadow-sm">Interactivos</span>
            </Link>

          </motion.div>
        </div>

        {/* Bottom bar - centered CTA */}
        <motion.div 
          className="absolute bottom-8 left-0 right-0 z-20 flex justify-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Link 
            to="/interactivos" 
            className="btn-3d px-10 py-3 md:px-12 md:py-4 text-ocean-dark text-base md:text-lg font-black tracking-widest flex items-center gap-3 hover:-translate-y-1 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            ENTRAR
            <ArrowDown size={20} />
          </Link>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-dark to-transparent z-0" />

        {/* Hand-drawn ink line separator */}
        <div className="absolute bottom-0 left-0 w-full z-30 opacity-40 pointer-events-none flex justify-center pb-2">
          <svg width="100%" height="20" viewBox="0 0 1000 20" preserveAspectRatio="none">
            <path d="M0,10 Q50,15 100,10 T200,10 T300,10 T400,10 T500,10 T600,10 T700,10 T800,10 T900,10 T1000,10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 8 30 10 40 12"/>
          </svg>
        </div>
      </motion.div>
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
            <Route path="/arcade" element={<Navigate to="/interactivos" replace />} />
            <Route path="/arcade/quiz" element={<QuizGame />} />
            <Route path="/arcade/piramide" element={<PiramidePage />} />
          </Routes>
        </Layout>
      </Router>
    </MotionConfig>
  );
}

