import { Waves, Mail, Github, Twitter, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="relative z-10 pt-20 pb-10 px-4 md:px-8 bg-ocean-dark/10 backdrop-blur-lg border-t border-white/20" role="contentinfo">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center shadow-lg border-2 border-white/50" aria-hidden="true">
                                <Waves className="text-white" size={20} />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-wider text-white text-3d text-stroke">
                                REVISTA OCNOS
                            </span>
                        </div>
                        <p className="text-white/80 font-bold max-w-sm leading-relaxed">
                            Explorando las fronteras de la investigación sobre lectura y alfabetización a través de experiencias transmedia e interactivas.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div role="navigation" aria-label="Enlaces del pie de página">
                        <h4 className="font-display font-bold text-white text-lg mb-6 uppercase tracking-widest">Navegación</h4>
                        <ul className="space-y-4">
                            <li><Link to="/interactivos" className="text-white/70 hover:text-white transition-colors font-bold">Interactivos</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="font-display font-bold text-white text-lg mb-6 uppercase tracking-widest">Contacto</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-coral transition-all border border-white/20">
                                <Twitter size={18} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Github" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-coral transition-all border border-white/20">
                                <Github size={18} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Correo electrónico" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-coral transition-all border border-white/20">
                                <Mail size={18} aria-hidden="true" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 font-bold text-sm">
                            <Info size={16} aria-hidden="true" />
                            <span>Proyecto de Tinkuy Lab</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-white/50 text-xs font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Tinkuy: Laboratorio de Ciencia Transmedia. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
