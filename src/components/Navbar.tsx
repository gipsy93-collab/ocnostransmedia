import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OcnosLogo from './OcnosLogo';

export const INDEX_SEALS = [
    {
        name: 'Scopus Q1',
        url: 'https://www.scimagojr.com/journalsearch.php?q=21100819543&tip=sid&exact=no',
        description: 'SCImago Journal Rank (Q1 Educación)',
        badgeBg: 'bg-[#5fa55a]/15 hover:bg-[#5fa55a]/25 text-[#98e294] border-[#5fa55a]/35',
        dotColor: 'bg-[#5fa55a]'
    },
    {
        name: 'FECYT Excelente',
        url: 'https://evaluacionfecyt.fecyt.es/',
        description: 'Sello de Calidad FECYT con Mención de Excelencia',
        badgeBg: 'bg-[#f6d51f]/15 hover:bg-[#f6d51f]/25 text-[#ffe866] border-[#f6d51f]/35',
        dotColor: 'bg-[#f6d51f]'
    },
    {
        name: 'ESCI / WoS',
        url: 'https://mjl.clarivate.com/search-results?issn=1885-446X',
        description: 'Web of Science Core Collection (Clarivate)',
        badgeBg: 'bg-[#01b4bc]/15 hover:bg-[#01b4bc]/25 text-[#6ee7ed] border-[#01b4bc]/35',
        dotColor: 'bg-[#01b4bc]'
    },
    {
        name: 'DOAJ',
        url: 'https://doaj.org/toc/2254-9099',
        description: 'Directory of Open Access Journals (Seal)',
        badgeBg: 'bg-[#fa8925]/15 hover:bg-[#fa8925]/25 text-[#ffb573] border-[#fa8925]/35',
        dotColor: 'bg-[#fa8925]'
    }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);

    const isHome = location.pathname === '/';

    const handleLogoClick = (e: React.MouseEvent) => {
        setIsOpen(false);
        if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => firstLinkRef.current?.focus(), 100);
        }
    }, [isOpen]);

    return (
        <nav 
            className="fixed top-0 w-full z-50 bg-[#183446]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)] transition-all duration-300" 
            aria-label="Navegación principal"
        >
            <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Brand / Logo: funge como botón de inicio y lleva al hero principal */}
                    <div className="flex items-center space-x-6 shrink-0">
                        <Link 
                            to="/" 
                            className="group block transition-transform duration-200 active:scale-98 cursor-pointer" 
                            onClick={handleLogoClick}
                            title="Ir al inicio de Revista Ocnos"
                            aria-label="Ir al inicio de Revista Ocnos"
                        >
                            <OcnosLogo variant="dark" />
                        </Link>
                    </div>

                    {/* Recuadro de Revista OJS + Sellos de Indexación Científica (Desktop) */}
                    <div className="hidden md:flex items-center space-x-2 shrink-0" role="navigation" aria-label="Enlaces institucionales e indexación">
                        {/* Recuadro distintivo Revista OJS */}
                        <a
                            href="https://www.revistaocnos.com/index.php/ocnos/es"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Acceder al portal oficial de Revista Ocnos en Open Journal Systems"
                            className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-200 border shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer bg-[#fa5457]/20 hover:bg-[#fa5457]/30 text-[#ff8e91] border-[#fa5457]/45"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fa5457] shrink-0 animate-pulse" aria-hidden="true" />
                            <span>Revista OJS</span>
                            <ExternalLink size={11} className="opacity-80" aria-hidden="true" />
                        </a>

                        <div className="h-4 w-px bg-white/20 mx-1" aria-hidden="true" />

                        {/* Sellos de Indexación */}
                        {INDEX_SEALS.map((seal) => (
                            <a
                                key={seal.name}
                                href={seal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`${seal.name} - ${seal.description}`}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-200 border shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer ${seal.badgeBg}`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${seal.dotColor} shrink-0 animate-pulse`} aria-hidden="true" />
                                <span>{seal.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Botón de Menú Móvil */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-nav-menu"
                            className="text-white hover:text-[#fa8925] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Móvil Desplegable */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-nav-menu"
                        role="navigation"
                        aria-label="Menú de navegación móvil"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#112633]/98 backdrop-blur-2xl border-t border-white/10 overflow-hidden shadow-2xl"
                    >
                        <div className="px-5 pt-5 pb-6 space-y-3">
                            {/* Acceso oficial a Revista OJS en móvil */}
                            <a
                                ref={firstLinkRef}
                                href="https://www.revistaocnos.com/index.php/ocnos/es"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-[#fa5457]/20 border border-[#fa5457]/45 text-[#ff8e91] hover:bg-[#fa5457]/30 transition-colors shadow-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#fa5457] animate-pulse" aria-hidden="true" />
                                    <span>Revista OJS (Portal Oficial)</span>
                                </div>
                                <ExternalLink size={14} className="opacity-80" />
                            </a>

                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 pt-2">
                                Indexación de Alto Impacto
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {INDEX_SEALS.map((seal) => (
                                    <a
                                        key={seal.name}
                                        href={seal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${seal.badgeBg}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${seal.dotColor}`} aria-hidden="true" />
                                            <span>{seal.name}</span>
                                        </div>
                                        <ExternalLink size={12} className="opacity-70" aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
