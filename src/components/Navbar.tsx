import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OcnosLogo from './OcnosLogo';

export const INDEX_SEALS = [
    {
        name: 'Scopus Q1',
        url: 'https://www.scimagojr.com/journalsearch.php?q=21100819543&tip=sid&exact=no',
        description: 'SCImago Journal Rank (Q1 Educación)',
        badgeBg: 'bg-[#eef6ee] hover:bg-[#dcf0dc] text-[#2d7a28] border-[#5fa55a]/40',
        dotColor: 'bg-[#5fa55a]'
    },
    {
        name: 'FECYT Excelente',
        url: 'https://evaluacionfecyt.fecyt.es/',
        description: 'Sello de Calidad FECYT con Mención de Excelencia',
        badgeBg: 'bg-[#fef9db] hover:bg-[#fef3be] text-[#856303] border-[#f6d51f]/50',
        dotColor: 'bg-[#d8b506]'
    },
    {
        name: 'ESCI / WoS',
        url: 'https://mjl.clarivate.com/search-results?issn=1885-446X',
        description: 'Web of Science Core Collection (Clarivate)',
        badgeBg: 'bg-[#e4f8f9] hover:bg-[#d0f3f5] text-[#006e73] border-[#01b4bc]/40',
        dotColor: 'bg-[#01b4bc]'
    },
    {
        name: 'DOAJ',
        url: 'https://doaj.org/toc/2254-9099',
        description: 'Directory of Open Access Journals (Seal)',
        badgeBg: 'bg-[#fef1e6] hover:bg-[#fee5d0] text-[#c9630e] border-[#fa8925]/40',
        dotColor: 'bg-[#fa8925]'
    }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);

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
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#bbc9ca]/40 shadow-xs transition-all duration-300" aria-label="Navegación principal">
            <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-5">
                        <Link to="/" className="block transition hover:opacity-90 shrink-0" onClick={() => setIsOpen(false)}>
                            <OcnosLogo width={210} height={50} variant="light" />
                        </Link>
                    </div>

                    {/* Scientific Indexing Seals with Functioning External Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-2.5" role="navigation" aria-label="Indexación científica">
                        {INDEX_SEALS.map((seal) => (
                            <a
                                key={seal.name}
                                href={seal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`${seal.name} - ${seal.description}`}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 border shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer ${seal.badgeBg}`}
                            >
                                <span className={`w-2 h-2 rounded-full ${seal.dotColor} shrink-0`} aria-hidden="true" />
                                <span>{seal.name}</span>
                                <ExternalLink size={12} className="opacity-60" aria-hidden="true" />
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Cerrar menú de indexación' : 'Abrir sellos de indexación'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-nav-menu"
                            className="text-on-surface hover:text-ocnos-cyan transition-colors p-2 cursor-pointer"
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-nav-menu"
                        role="navigation"
                        aria-label="Sellos de indexación en móvil"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-outline-variant/40 overflow-hidden shadow-2xl"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2.5">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2">
                                Indexación Científica de Alto Impacto
                            </p>
                            {INDEX_SEALS.map((seal, i) => (
                                <a
                                    key={seal.name}
                                    ref={i === 0 ? firstLinkRef : undefined}
                                    href={seal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${seal.badgeBg}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className={`w-2.5 h-2.5 rounded-full ${seal.dotColor}`} aria-hidden="true" />
                                        <span>{seal.name}</span>
                                    </div>
                                    <ExternalLink size={14} className="opacity-70" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
