import { motion } from 'motion/react';
import { Outlet } from 'react-router-dom';

export default function ArcadeLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden text-ocean-dark font-body pb-20">
      <a href="#arcade-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-ocean-dark focus:text-white focus:rounded-full focus:text-sm focus:font-black focus:uppercase focus:tracking-widest">
        Saltar al contenido del arcade
      </a>

      <nav className="fixed top-[60px] md:top-[80px] left-0 w-full z-40 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[50px]">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-ocean-dark text-lg uppercase tracking-widest text-shadow-sm">OCNOS Arcade</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/arcade" className="font-black text-xs uppercase tracking-widest text-ocean-dark hover:text-coral transition-colors">HUB</a>
            <a href="/interactivos" className="font-black text-xs uppercase tracking-widest text-ocean-dark/70 hover:text-ocean-dark transition-colors">SALIR</a>
          </div>
        </div>
      </nav>

      <main id="arcade-content" className="flex-1 relative z-10 pt-[50px]">
        <Outlet />
      </main>
    </div>
  );
}
