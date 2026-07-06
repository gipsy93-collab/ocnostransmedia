import { Coffee, BookOpen, PenTool, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function Blog() {
  return (
    <div className="font-body text-ocean-dark pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-coral/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-sand/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg mb-8 animate-pop-up">
              <PenTool className="text-white" size={20} />
              <span className="text-sm font-bold text-white tracking-wider">Reflexiones y Reseñas</span>
            </div>
            <h1 className="font-display text-6xl lg:text-8xl font-bold leading-tight mb-8 text-white text-3d text-stroke">
              <span className="text-coral relative inline-block">
                BLOCONOS
                <svg className="absolute -bottom-4 left-0 w-full h-5 text-sand" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-10 font-bold leading-relaxed max-w-2xl mx-auto">
              Reseñas de libros, reflexiones sobre el hábito lector y apuntes informales de nuestros investigadores.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="card-3d p-8 hover:-translate-y-2 transition-transform duration-300 relative group cursor-pointer bg-white/80 backdrop-blur-md border-t-8 border-t-coral">
              <div className="absolute top-6 right-6 text-ocean-dark/10 group-hover:text-coral/20 transition-colors">
                <BookOpen size={64} />
              </div>
              <div className="mb-6 relative z-10">
                <span className="text-xs font-bold text-coral uppercase tracking-wider bg-coral/10 px-3 py-1 rounded-full">Reseña</span>
                <h2 className="font-display text-2xl font-bold text-ocean-dark mt-4 mb-3 leading-tight group-hover:text-coral transition-colors">
                  "El infinito en un junco": Una carta de amor a los libros
                </h2>
                <p className="text-ocean-dark/70 text-sm line-clamp-3 mb-4 font-bold">
                  Irene Vallejo nos regala un viaje fascinante por la historia del libro. Analizamos por qué esta obra se ha convertido en un fenómeno editorial y qué nos dice sobre nuestro amor por la lectura.
                </p>
              </div>
              <div className="flex items-center justify-between border-t-2 border-ocean-dark/10 pt-6 mt-auto">
                <div className="flex items-center gap-3">
                  <img src="https://picsum.photos/seed/author7/32/32" alt="Autor" className="w-10 h-10 rounded-full border-2 border-coral shadow-sm" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ocean-dark">Prof. M. Vargas</span>
                    <span className="text-xs text-ocean-dark/60 flex items-center gap-1 font-bold"><Clock size={12} /> 5 min de lectura</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-ocean-dark/40 group-hover:text-coral transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm font-bold">12</span>
                </div>
              </div>
            </article>

            <article className="card-3d p-8 hover:-translate-y-2 transition-transform duration-300 relative group cursor-pointer bg-white/80 backdrop-blur-md border-t-8 border-t-sand">
              <div className="absolute top-6 right-6 text-ocean-dark/10 group-hover:text-sand/20 transition-colors">
                <Coffee size={64} />
              </div>
              <div className="mb-6 relative z-10">
                <span className="text-xs font-bold text-sand uppercase tracking-wider bg-sand/10 px-3 py-1 rounded-full">Reflexión</span>
                <h2 className="font-display text-2xl font-bold text-ocean-dark mt-4 mb-3 leading-tight group-hover:text-sand transition-colors">
                  ¿Por qué nos cuesta tanto concentrarnos al leer en pantalla?
                </h2>
                <p className="text-ocean-dark/70 text-sm line-clamp-3 mb-4 font-bold">
                  Un apunte informal sobre la fatiga digital, la lectura fragmentada y cómo recuperar la atención profunda en la era de las notificaciones constantes.
                </p>
              </div>
              <div className="flex items-center justify-between border-t-2 border-ocean-dark/10 pt-6 mt-auto">
                <div className="flex items-center gap-3">
                  <img src="https://picsum.photos/seed/author8/32/32" alt="Autor" className="w-10 h-10 rounded-full border-2 border-sand shadow-sm" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ocean-dark">Dra. L. Gómez</span>
                    <span className="text-xs text-ocean-dark/60 flex items-center gap-1 font-bold"><Clock size={12} /> 8 min de lectura</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-ocean-dark/40 group-hover:text-sand transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm font-bold">24</span>
                </div>
              </div>
            </article>

            <article className="card-3d p-8 hover:-translate-y-2 transition-transform duration-300 relative group cursor-pointer bg-white/80 backdrop-blur-md border-t-8 border-t-seaweed">
              <div className="absolute top-6 right-6 text-ocean-dark/10 group-hover:text-seaweed/20 transition-colors">
                <PenTool size={64} />
              </div>
              <div className="mb-6 relative z-10">
                <span className="text-xs font-bold text-seaweed uppercase tracking-wider bg-seaweed/10 px-3 py-1 rounded-full">Apuntes</span>
                <h2 className="font-display text-2xl font-bold text-ocean-dark mt-4 mb-3 leading-tight group-hover:text-seaweed transition-colors">
                  Diario de campo: Observando a jóvenes lectores en la biblioteca
                </h2>
                <p className="text-ocean-dark/70 text-sm line-clamp-3 mb-4 font-bold">
                  Notas etnográficas sobre cómo los adolescentes interactúan con el espacio de la biblioteca pública, qué libros hojean y cómo socializan alrededor de la lectura.
                </p>
              </div>
              <div className="flex items-center justify-between border-t-2 border-ocean-dark/10 pt-6 mt-auto">
                <div className="flex items-center gap-3">
                  <img src="https://picsum.photos/seed/author9/32/32" alt="Autor" className="w-10 h-10 rounded-full border-2 border-seaweed shadow-sm" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ocean-dark">Equipo Ocnos</span>
                    <span className="text-xs text-ocean-dark/60 flex items-center gap-1 font-bold"><Clock size={12} /> 4 min de lectura</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-ocean-dark/40 group-hover:text-seaweed transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm font-bold">8</span>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-16 text-center">
            <button className="btn-3d px-8 py-4 bg-white text-ocean-dark font-bold rounded-full hover:bg-coral hover:text-white transition-colors flex items-center gap-2 mx-auto">
              Cargar más apuntes <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
