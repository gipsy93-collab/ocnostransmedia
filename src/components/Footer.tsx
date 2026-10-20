import { Waves, Mail, Github, Twitter, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="relative z-10 pt-8 pb-5 px-4 md:px-8 bg-[#183446] text-white border-t border-[#bbc9ca]/20" role="contentinfo">
            <div className="max-w-[1580px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-8 h-8 rounded-full bg-ocnos-coral flex items-center justify-center shadow-md border border-white/40" aria-hidden="true">
                                <Waves className="text-white" size={16} />
                            </div>
                            <span className="font-serif font-bold text-xl tracking-wide text-white">
                                REVISTA OCNOS
                            </span>
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-md leading-relaxed">
                            Plataforma interactiva de la revista para la comunicación académica y científica de las investigaciones sobre lectura en el ámbito latinoamericano.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div role="navigation" aria-label="Enlaces de indexación del pie de página">
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ocnos-cyan mb-2.5">Indexación</h4>
                        <ul className="space-y-1.5 text-xs">
                            <li><a href="https://www.scimagojr.com/journalsearch.php?q=21100819543&tip=sid&exact=no" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Scopus Q1 (SCImago)</a></li>
                            <li><a href="https://evaluacionfecyt.fecyt.es/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Sello Calidad FECYT Excelente</a></li>
                            <li><a href="https://mjl.clarivate.com/search-results?issn=1885-446X" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">ESCI / Web of Science</a></li>
                            <li><a href="https://doaj.org/toc/2254-9099" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">DOAJ Open Access</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ocnos-coral mb-2.5">Contacto</h4>
                        <div className="flex gap-2.5 mb-2.5">
                            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-ocnos-coral flex items-center justify-center text-white transition-colors border border-white/10">
                                <Twitter size={15} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Github" className="w-8 h-8 rounded-full bg-white/10 hover:bg-ocnos-coral flex items-center justify-center text-white transition-colors border border-white/10">
                                <Github size={15} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Correo electrónico" className="w-8 h-8 rounded-full bg-white/10 hover:bg-ocnos-coral flex items-center justify-center text-white transition-colors border border-white/10">
                                <Mail size={15} aria-hidden="true" />
                            </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Info size={13} aria-hidden="true" />
                            <span>Proyecto de Tinkuy Lab</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-center text-slate-400 text-[11px] font-medium tracking-wider">
                    &copy; {new Date().getFullYear()} Tinkuy: Laboratorio de Ciencia Transmedia. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
