import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
    const location = useLocation();
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

    const navLinks = [
        { name: 'Interactivos', path: '/interactivos' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass-3d transition-all duration-300" aria-label="Navegación principal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-coral transition-colors animate-float" aria-hidden="true">
                                <Waves className="text-white" size={20} />
                            </div>
                            <span className="font-display font-bold text-lg tracking-wider text-white text-3d text-stroke uppercase">
                                Inicio
                            </span>
                        </Link>

                        {/* Badges de Calidad Oficiales */}
                        <div className="hidden md:flex items-center gap-3 border-l-2 border-white/20 pl-5 ml-5">
                            {/* Q1 Badge */}
                            <div className="group relative flex items-center justify-center bg-white/90 shadow-sm rounded-md px-2 py-1 cursor-help hover:scale-105 transition-transform">
                                <span className="bg-[#8cc63f] text-white text-xs font-bold px-2 py-0.5 rounded-sm tracking-wide">Q1</span>
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-52 p-3 rounded-lg bg-white shadow-xl border border-ocean-dark/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-center transform translate-y-2 group-hover:translate-y-0" role="tooltip">
                                    <p className="text-ocean-dark text-xs font-bold leading-relaxed">Ubicada en el Top 25% (Primer cuartil) de las revistas de literatura mundial</p>
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-white drop-shadow-sm" aria-hidden="true"></div>
                                </div>
                            </div>

                            {/* FECYT Badge */}
                            <div className="group relative flex items-center justify-center bg-white/90 shadow-sm rounded-md px-2 py-1 cursor-help hover:scale-105 transition-transform">
                                <span className="text-[#00aeb3] font-black text-xs tracking-tighter">FECYT</span>
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-52 p-3 rounded-lg bg-white shadow-xl border border-ocean-dark/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-center transform translate-y-2 group-hover:translate-y-0" role="tooltip">
                                    <p className="text-ocean-dark text-xs font-bold leading-relaxed">Avalados oficialmente por el Estado de España por su excelencia científica</p>
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-white drop-shadow-sm" aria-hidden="true"></div>
                                </div>
                            </div>
                            
                            {/* ESCI WOS Badge */}
                            <div className="group relative flex items-center justify-center bg-white/90 shadow-sm rounded-md px-2 py-1 cursor-help hover:scale-105 transition-transform gap-1">
                                <div className="w-4 h-4 rounded-full bg-[#6a3093] flex items-center justify-center shadow-inner" aria-hidden="true">
                                    <span className="text-white font-bold" style={{ fontSize: '0.45rem' }}>wos</span>
                                </div>
                                <span className="text-[#6a3093] text-[10px] font-bold uppercase tracking-wider hidden xl:block">ESCI</span>
                                <div className="absolute top-10 right-0 xl:left-1/2 xl:-translate-x-1/2 w-56 p-3 rounded-lg bg-white shadow-xl border border-ocean-dark/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-center transform translate-y-2 group-hover:translate-y-0" role="tooltip">
                                    <p className="text-ocean-dark text-xs font-bold leading-relaxed">Incluida en la Web of Science</p>
                                    <div className="absolute -top-2 right-6 xl:left-1/2 xl:-translate-x-1/2 border-[6px] border-transparent border-b-white drop-shadow-sm" aria-hidden="true"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-3" role="list" aria-label="Enlaces de navegación">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                role="listitem"
                                aria-current={location.pathname === link.path ? 'page' : undefined}
                                className={`card-3d px-5 py-2 flex items-center justify-center transition-colors group ${location.pathname === link.path ? 'bg-coral text-white' : 'hover:bg-coral'}`}
                            >
                                <span className={`font-bold ${location.pathname === link.path ? 'text-white' : 'text-ocean-dark group-hover:text-white'}`}>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-nav-menu"
                            className="text-white hover:text-coral transition-colors p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
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
                        aria-label="Menú de navegación móvil"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-ocean-dark/95 backdrop-blur-xl border-t border-white/10 overflow-hidden shadow-2xl"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.path}
                                    ref={i === 0 ? firstLinkRef : undefined}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    aria-current={location.pathname === link.path ? 'page' : undefined}
                                    className={`block px-4 py-3 rounded-2xl text-lg font-bold transition-all ${location.pathname === link.path
                                            ? 'bg-coral text-white shadow-lg translate-x-2'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
