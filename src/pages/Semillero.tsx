import { Leaf, BookOpen, Users, Star, ArrowRight, Menu, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Semillero() {
  return (
    <div className="font-body text-ocean-dark pb-20">
      {/* Hero Section */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d mb-6">
                <span className="w-3 h-3 rounded-full bg-seaweed animate-pulse"></span>
                <span className="text-sm font-bold text-white">Cultivando Ideas</span>
              </div>
                            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white text-3d text-stroke">
                ¿Crees que tu trabajo <span className="text-seaweed">de aula</span> destaca? <br />
                <span className="text-seaweed text-3xl md:text-5xl mt-4 block">
                  postula tu trabajo y publica con nosotros
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 font-bold text-shadow-sm">
                Un espacio dedicado a los jóvenes investigadores. Aprende, colabora y publica tus primeros artículos en el campo de los estudios sobre lectura.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0 mb-8">
                <input
                  type="text"
                  placeholder="Busca mentores, temas o artículos..."
                  className="w-full pl-12 pr-4 py-4 rounded-full glass-3d border-2 border-white/50 focus:border-white shadow-lg outline-none transition-all text-ocean-dark placeholder-ocean-dark/50 font-bold"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-dark/50" size={20} />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-seaweed rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md border-2 border-white/50">
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-bold text-white/80">
                <span>Tendencias:</span>
                <span className="px-3 py-1 glass-3d rounded-full shadow-sm cursor-pointer hover:text-white transition-colors">#Alfabetización</span>
                <span className="px-3 py-1 glass-3d rounded-full shadow-sm cursor-pointer hover:text-white transition-colors">#LecturaDigital</span>
              </div>
            </div>

            {/* Visual Composition */}
            <div className="relative mt-12 lg:mt-0 flex justify-center animate-float">
              <div className="relative w-[24rem] h-[24rem] sm:w-[30rem] sm:h-[30rem] md:w-[36rem] md:h-[36rem]">
                {/* Main Shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-seaweed to-ocean-base rounded-[3rem] shadow-2xl animate-sway opacity-90 rotate-6"></div>

                {/* Image Container with Tenor Embed */}
                <div className="absolute inset-4 bg-ocean-dark rounded-[2.5rem] overflow-hidden border-4 border-white/50 shadow-inner -rotate-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-ocean-light/20 z-10 mix-blend-color pointer-events-none"></div>
                  <div className="absolute inset-0 bg-seaweed/10 z-10 mix-blend-multiply pointer-events-none"></div>
                  
                  {/* Container to force the GIF to stretch and cover the square, eliminating margins */}
                  <div className="absolute min-w-[180%] min-h-[180%] flex items-center justify-center">
                    <div className="tenor-gif-embed w-full pointer-events-none" data-postid="7817705" data-share-method="host" data-aspect-ratio="1.75" data-width="100%">
                      <a href="https://tenor.com/view/computer-cat-working-type-typing-gif-7817705">Computer Cat GIF</a>from <a href="https://tenor.com/search/computer-gifs">Computer GIFs</a>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-6 -right-6 glass-3d p-4 sm:p-6 rounded-2xl shadow-xl border-2 border-white/50 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                      <Star className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-ocean-dark/70 font-bold uppercase">Mentores</p>
                      <p className="font-display font-bold text-ocean-dark text-lg sm:text-xl">+50 Activos</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 glass-3d p-4 sm:p-6 rounded-2xl shadow-xl border-2 border-white/50 animate-float-delayed z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-ocean-dark/70 font-bold uppercase">Publicaciones</p>
                      <p className="font-display font-bold text-ocean-dark text-lg sm:text-xl">120+ Artículos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 text-white text-3d text-stroke">Conecta con Mentores</h2>
              <p className="text-white/90 font-bold max-w-2xl text-lg">Investigadores experimentados listos para guiar tus primeros pasos.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-white font-bold hover:text-seaweed transition-colors text-3d">
              Ver todos <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mentor Card 1 */}
            <div className="card-3d p-6 group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/50 group-hover:border-seaweed transition-colors shadow-md">
                  <img src="https://picsum.photos/seed/mentor1/200/200" alt="Mentor 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-0 right-1/2 translate-x-12 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                  <div className="w-6 h-6 bg-seaweed rounded-full text-white flex items-center justify-center text-xs font-bold">
                    Dr.
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-ocean-dark mb-1">Dra. Elena Martínez</h3>
                <p className="text-sm text-seaweed font-bold mb-4">Especialista en Literatura Infantil</p>
                <p className="text-sm text-ocean-dark/70 mb-6 line-clamp-2 font-bold">Investigadora principal en proyectos de fomento a la lectura en edades tempranas.</p>
                <button className="btn-3d w-full py-3 text-ocean-dark">
                  Solicitar Mentoría
                </button>
              </div>
            </div>

            {/* Mentor Card 2 */}
            <div className="card-3d p-6 group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/50 group-hover:border-sand transition-colors shadow-md">
                  <img src="https://picsum.photos/seed/mentor2/200/200" alt="Mentor 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-0 right-1/2 translate-x-12 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                  <div className="w-6 h-6 bg-sand rounded-full text-white flex items-center justify-center text-xs font-bold">
                    Mg.
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-ocean-dark mb-1">Mg. Carlos Ruiz</h3>
                <p className="text-sm text-sand font-bold mb-4">Lectura Digital y Nuevos Medios</p>
                <p className="text-sm text-ocean-dark/70 mb-6 line-clamp-2 font-bold">Analizando cómo las nuevas tecnologías transforman nuestros hábitos lectores.</p>
                <button className="btn-3d w-full py-3 text-ocean-dark">
                  Solicitar Mentoría
                </button>
              </div>
            </div>

            {/* Mentor Card 3 */}
            <div className="card-3d p-6 group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/50 group-hover:border-purple-reef transition-colors shadow-md">
                  <img src="https://picsum.photos/seed/mentor3/200/200" alt="Mentor 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-0 right-1/2 translate-x-12 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                  <div className="w-6 h-6 bg-purple-reef rounded-full text-white flex items-center justify-center text-xs font-bold">
                    Dr.
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-ocean-dark mb-1">Dr. Ana Silva</h3>
                <p className="text-sm text-purple-reef font-bold mb-4">Comprensión Lectora</p>
                <p className="text-sm text-ocean-dark/70 mb-6 line-clamp-2 font-bold">Estrategias cognitivas y metacognitivas en la comprensión de textos complejos.</p>
                <button className="btn-3d w-full py-3 text-ocean-dark">
                  Solicitar Mentoría
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
