import { ReactNode } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div 
            className="min-h-screen relative flex flex-col"
        >
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-ocean-dark focus:text-white focus:rounded-full focus:text-sm focus:font-black focus:uppercase focus:tracking-widest">
                Saltar al contenido principal
            </a>

            {/* Background Bubbles (Fixed) */}
            <div className="fixed top-1/4 left-1/4 w-8 h-8 rounded-full bg-white/20 animate-bubble" aria-hidden="true" style={{ animationDelay: '0s' }}></div>
            <div className="fixed top-3/4 left-1/3 w-12 h-12 rounded-full bg-white/20 animate-bubble" aria-hidden="true" style={{ animationDelay: '1s' }}></div>
            <div className="fixed top-1/2 right-1/4 w-6 h-6 rounded-full bg-white/20 animate-bubble" aria-hidden="true" style={{ animationDelay: '2s' }}></div>
            <div className="fixed top-2/3 right-1/3 w-10 h-10 rounded-full bg-white/20 animate-bubble" aria-hidden="true" style={{ animationDelay: '0.5s' }}></div>

            {/* Ambient light overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-ocean-light/5 via-transparent to-purple-reef/5 pointer-events-none z-0" />

            {/* Cinematic vignette */}
            <div className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

            {/* Floating light particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
                <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse blur-[1px]" />
                <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-ocean-light/50 rounded-full animate-pulse blur-[2px]" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-reef/40 rounded-full animate-pulse blur-[1px]" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-coral/30 rounded-full animate-pulse blur-[2px]" style={{ animationDelay: '1.5s' }} />
            </div>

            <Navbar />

            <main id="main-content" className="relative z-10 pt-20 flex-grow" role="main">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            <Footer />
        </div>
    );
}
