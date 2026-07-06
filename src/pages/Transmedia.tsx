import { useState, useRef, useMemo, useEffect, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ArrowRight, Waves, Clock, Mic, Gamepad2, Headphones, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NARRATIVAS } from '../data/narrativas';

function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = useMemo(() => Array.from({ length: 32 }, () => Math.floor(Math.random() * 80) + 15), []);
  return (
    <div className="flex items-end justify-center h-10 gap-[2px]">
      {bars.map((h, i) => (
        <div key={i} className={`w-[3px] rounded-full transition-all ${isPlaying ? 'bg-white/60' : 'bg-white/10'}`}
          style={{ height: `${isPlaying ? h : 6}%`, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

export default function Transmedia() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Items reales del carrusel: podcasts desde NARRATIVAS + juegos
  const podcastItems = NARRATIVAS.map(n => ({
    id: `podcast-${n.id}`,
    title: n.metadata.title,
    subtitle: `${n.metadata.authors} · ${n.metadata.duration}`,
    image: n.metadata.image,
    type: 'podcast' as const,
    badge: 'Podcast',
    audioSrc: '/assets/lo_que_realmente_leemos.m4a',
  }));

  const gameItems = NARRATIVAS.map(n => {
    let gameRoute = '/interactivos';
    if (n.id === 'manga') gameRoute = '/arcade/quiz';
    else if (n.id === 'multiliteracidad') gameRoute = '/arcade/piramide';
    else if (n.id === 'dislexia') gameRoute = '/arcade/quiz';
    else if (n.id === 'escritura') gameRoute = '/arcade/quiz';
    else if (n.id === 'pisa') gameRoute = '/arcade/quiz';
    else if (n.id === 'detectives') gameRoute = '/interactivos/detectives';

    return {
      id: `game-${n.id}`,
      title: n.metadata.title,
      subtitle: 'Juego interactivo disponible',
      image: n.metadata.image,
      type: 'juego' as const,
      badge: 'Juego Interactivo',
      gameLink: gameRoute,
    };
  });

  const carruselItems = [...podcastItems, ...gameItems];

  const featuredItem = carruselItems[carouselIndex];

  const cambiaItem = (i: number) => {
    setCarouselIndex(i);
    // Si hay audio reproduciéndose, lo detenemos al cambiar de item
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCarouselIndex(prev => (prev + 1) % carruselItems.length), 6000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCarouselIndex(prev => (prev + 1) % carruselItems.length), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleToggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); return; }
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const fmt = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  const onMeta = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const onTime = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };

  return (
    <div className="min-h-screen bg-[#0c1117] overflow-hidden">
      <audio ref={audioRef} src="/assets/lo_que_realmente_leemos.m4a"
        onTimeUpdate={onTime} onLoadedMetadata={onMeta} onEnded={() => setIsPlaying(false)} preload="metadata" />

      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={featuredItem.id}
              src={featuredItem.image}
              alt=""
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1117] via-[#0c1117]/60 to-[#0c1117]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.span
            key={`tag-${featuredItem.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-xs font-bold text-white/80 tracking-widest uppercase mb-8"
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${featuredItem.type === 'podcast' ? 'bg-coral' : 'bg-purple-reef'}`} />
            {featuredItem.badge} — Transmedioteca
          </motion.span>

          <motion.h1
            key={`title-${featuredItem.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4 max-w-3xl mx-auto"
          >
            {featuredItem.title}
          </motion.h1>

          <motion.p
            key={`sub-${featuredItem.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-white/50 max-w-lg mx-auto mb-10"
          >
            {featuredItem.subtitle}
          </motion.p>

          {featuredItem.type === 'juego' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link to={featuredItem.gameLink || '/interactivos'}
                className="bg-purple-reef text-white px-12 py-5 rounded-full font-bold text-lg tracking-wider hover:bg-purple-reef/90 transition-all hover:-translate-y-1 shadow-2xl shadow-purple-reef/30 inline-flex items-center gap-3">
                <Gamepad2 size={20} /> JUGAR AHORA
              </Link>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleToggle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-coral text-white px-12 py-5 rounded-full font-bold text-lg tracking-wider hover:bg-coral/90 transition-all hover:-translate-y-1 shadow-2xl shadow-coral/30 inline-flex items-center gap-3"
            >
              {isPlaying ? (
                <><Pause size={20} /> PAUSAR</>
              ) : (
                <><Play size={20} fill="currentColor" /> ESCUCHAR AHORA</>
              )}
            </motion.button>
          )}

          {/* Reproductor visible solo cuando hay un podcast activo */}
          {featuredItem.type === 'podcast' && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 max-w-xl mx-auto"
            >
              <AudioVisualizer isPlaying={isPlaying} />
              <div className="flex items-center gap-3 mt-3">
                <span className="text-white/30 text-xs font-mono">{fmt(currentTime)}</span>
                <input type="range" min={0} max={duration || 100} value={currentTime}
                  onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = +e.target.value; setCurrentTime(+e.target.value); }}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-coral [&::-webkit-slider-thumb]:rounded-full" />
                <span className="text-white/30 text-xs font-mono">{fmt(duration)}</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c1117] to-transparent z-10" />
      </section>

      {/* ===== CARRUSEL PEQUEÑO ===== */}
      <section className="relative z-20 -mt-16 pb-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase">Navegar</span>
              <div className="flex gap-2">
                {carruselItems.map((_, i) => (
                  <button key={i} onClick={() => cambiaItem(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === carouselIndex ? 'w-6 bg-coral' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
                ))}
              </div>
            </div>

            <div className="relative h-20 md:h-24">
              <AnimatePresence mode="wait">
                {carruselItems.map((item, i) =>
                  i === carouselIndex ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center gap-5 cursor-pointer"
                      onClick={() => cambiaItem((i + 1) % carruselItems.length)}
                    >
                      <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${item.type === 'podcast' ? 'text-coral' : 'text-purple-reef'}`}>
                          {item.badge}
                        </span>
                        <h3 className="text-white font-bold text-sm md:text-lg truncate max-w-[400px]">{item.title}</h3>
                        <p className="text-white/40 text-xs truncate max-w-[350px]">{item.subtitle}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); cambiaItem((i + 1) % carruselItems.length); }}
                        className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <ArrowRight size={16} className="text-white/60" />
                      </button>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PODCASTS GALLERY ===== */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-14">
          <div>
            <span className="text-coral text-xs font-bold tracking-[0.3em] uppercase">Artículos</span>
            <h2 className="text-4xl font-bold text-white mt-2">Podcasts</h2>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8" style={{ scrollbarWidth: 'none' }}>
          {podcastItems.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              onClick={() => cambiaItem(carruselItems.indexOf(p))}
              className="min-w-[260px] md:min-w-[300px] group cursor-pointer shrink-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] mb-5 bg-ocean-dark/20">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" src={p.image} alt={p.title} />
                <div className="absolute inset-0 bg-[#0c1117]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-coral flex items-center justify-center shadow-xl"><Play size={24} className="ml-1" fill="white" /></div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold">Podcast</div>
              </div>
              <h3 className="text-white font-bold text-sm leading-tight group-hover:text-coral transition-colors line-clamp-2">{p.title}</h3>
              <p className="text-white/30 text-xs mt-1 truncate">{p.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== GAMES ===== */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-14">
          <div>
            <span className="text-purple-reef text-xs font-bold tracking-[0.3em] uppercase">Interactivos</span>
            <h2 className="text-4xl font-bold text-white mt-2">Juegos por Artículo</h2>
          </div>
          <Link to="/interactivos" className="text-white/30 text-xs font-bold tracking-widest uppercase hover:text-purple-reef transition-colors">Ver Todos</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8" style={{ scrollbarWidth: 'none' }}>
          {gameItems.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              onClick={() => cambiaItem(carruselItems.indexOf(g))}
              className="min-w-[260px] md:min-w-[300px] group cursor-pointer shrink-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] mb-5 bg-gradient-to-br from-ocean-dark/30 to-[#0d1b1e]">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" src={g.image} alt={g.title} />
                <div className="absolute inset-0 bg-[#0c1117]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-purple-reef flex items-center justify-center shadow-xl"><Gamepad2 size={24} className="text-white" /></div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold">Juego</div>
              </div>
              <h3 className="text-white font-bold text-sm leading-tight group-hover:text-purple-reef transition-colors line-clamp-2">{g.title}</h3>
              <p className="text-white/30 text-xs mt-1">{g.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 mt-16 py-16 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Waves className="text-ocean-light w-5 h-5" />
          <span className="text-lg font-bold text-white tracking-[0.3em] uppercase">Transmedioteca</span>
        </div>
        <div className="flex flex-wrap justify-center gap-10 mb-10">
          <Link to="/interactivos" className="text-white/30 text-xs tracking-[0.25em] uppercase hover:text-coral transition-colors">Interactivos</Link>
        </div>
        <p className="text-white/10 text-xs">© 2024 OCNOS Transmedia</p>
      </footer>
    </div>
  );
}
