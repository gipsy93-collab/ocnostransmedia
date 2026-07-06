import { useState, useEffect } from 'react';
import { TrendingUp, Clock, ArrowRight, Rss, BookOpen, GraduationCap } from 'lucide-react';

const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fplos.org%2Ffeed%2F';
const CERVANTES_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fblog.cervantesvirtual.com%2Ffeed%2F';
const FECYT_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.fecyt.es%2Fes%2Fnoticias%2Frss';

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  thumbnail?: string;
  description?: string;
  author?: string;
}

function stripHtml(html: string): string {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function Actualidad() {
  const [news, setNews] = useState<RssItem[]>([]);
  const [cervantesNews, setCervantesNews] = useState<RssItem[]>([]);
  const [fecytNews, setFecytNews] = useState<RssItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingCervantes, setLoadingCervantes] = useState(true);
  const [loadingFecyt, setLoadingFecyt] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  // Fallbacks in case RSS blocks the proxy
  const fallbackCervantes: RssItem[] = [
    { title: "Nuevas adquisiciones en la biblioteca digital", pubDate: new Date().toISOString(), link: "https://blog.cervantesvirtual.com" },
    { title: "Exposición virtual: Siglo de Oro español", pubDate: new Date(Date.now() - 86400000).toISOString(), link: "https://blog.cervantesvirtual.com" },
    { title: "Conferencia Internacional sobre Literatura y Entornos Digitales", pubDate: new Date(Date.now() - 172800000).toISOString(), link: "https://blog.cervantesvirtual.com" }
  ];

  const fallbackFecyt: RssItem[] = [
    { title: "Convocatoria de ayudas para el fomento de la cultura científica", pubDate: new Date().toISOString(), link: "https://www.fecyt.es" },
    { title: "Nuevas becas de investigación y divulgación", pubDate: new Date(Date.now() - 86400000).toISOString(), link: "https://www.fecyt.es" },
    { title: "Resultados de la encuesta nacional de percepción social de la ciencia", pubDate: new Date(Date.now() - 172800000).toISOString(), link: "https://www.fecyt.es" }
  ];

  useEffect(() => {
    // Primer feed RSS (Principal)
    fetch(RSS_URL)
      .then(res => res.json())
      .then(data => {
        if(data.items && data.items.length > 0) {
          setNews(data.items.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Segundo feed RSS (Cervantes)
    fetch(CERVANTES_RSS_URL)
      .then(res => res.json())
      .then(data => {
        if(data.items && data.items.length > 0) {
          setCervantesNews(data.items.slice(0, 3));
        } else {
          setCervantesNews(fallbackCervantes);
        }
        setLoadingCervantes(false);
      })
      .catch(() => {
        setCervantesNews(fallbackCervantes);
        setLoadingCervantes(false);
      });

      // Tercer feed RSS (FECYT / Becas)
      fetch(FECYT_RSS_URL)
      .then(res => res.json())
      .then(data => {
        if(data.items && data.items.length > 0) {
          setFecytNews(data.items.slice(0, 3));
        } else {
          setFecytNews(fallbackFecyt);
        }
        setLoadingFecyt(false);
      })
      .catch(() => {
        setFecytNews(fallbackFecyt);
        setLoadingFecyt(false);
      });
  }, []);

  return (
    <div className="font-body text-ocean-dark pb-20">
      <div className="bg-ocean-dark/80 text-white overflow-hidden whitespace-nowrap py-3 border-b-4 border-coral relative z-40 backdrop-blur-md">
        <div className="inline-block animate-wave font-bold text-sm tracking-wider">
          <span className="text-coral mx-4">ÚLTIMA HORA</span> • CONEXIÓN AUTOMÁTICA ACTIVA • <span className="text-sand mx-4">SISTEMA RSS</span> • IMPORTANDO NOTICIAS DIRECTAMENTE DESDE LA REVISTA • <span className="text-coral mx-4">SIN PERIODISTA</span> • EL SISTEMA TRABAJA POR NOSOTROS
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        <div className="mb-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 backdrop-blur-md border border-white/80 shadow-lg mb-6">
              <Rss className="text-coral animate-pulse" size={20} />
              <span className="text-sm font-bold text-ocean-dark tracking-wider">Live RSS Feed Activado</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white text-3d text-stroke">
                Actualidad Automática
            </h1>
            <p className="text-lg text-white/90 max-w-2xl font-bold text-shadow-sm">
                Al conectar el RSS de la plataforma original y de redes sociales, todo aparece mágicamente.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Featured News */}
          <div className="lg:col-span-8 space-y-8">
            
            {loading ? (
                <div className="card-3d p-12 text-center text-ocean-dark font-bold text-xl flex justify-center items-center h-80">
                    <Rss className="animate-spin text-coral mr-4" size={32} />
                    Sincronizando feed RSS en tiempo real...
                </div>
            ) : news.length > 0 ? (
                <>
                    <article className="card-3d overflow-hidden group">
                      <div className="relative h-80 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 bg-coral text-white font-bold text-xs px-4 py-2 rounded-full shadow-md border-2 border-white/50">
                          Última Publicación
                        </div>
                        <img src={news[0].thumbnail || "https://picsum.photos/seed/news1/800/400"} alt="Investigación" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 text-3d text-stroke line-clamp-2">
                            {news[0].title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm font-bold text-white/80">
                            <span className="flex items-center gap-1"><Clock size={16} /> {new Date(news[0].pubDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-sand"><TrendingUp size={16} /> Nuevo</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-8 bg-white/50 backdrop-blur-sm">
                        <p className="text-lg text-ocean-dark font-bold leading-relaxed mb-6 border-l-4 border-coral pl-4 line-clamp-3">
                          {stripHtml(news[0].description || '').substring(0, 150)}...
                        </p>
                        
                        <div className="flex justify-between items-center border-t-2 border-ocean-dark/10 pt-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-ocean-dark text-white flex items-center justify-center font-bold font-display text-xl border-2 border-coral shadow-sm">
                                {news[0].author ? news[0].author.charAt(0).toUpperCase() : 'O'}
                            </div>
                            <div>
                              <p className="font-bold text-ocean-dark">{news[0].author || "Redacción de la Revista"}</p>
                              <p className="text-xs text-ocean-dark/70 font-bold">Autor(es)</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <a href={news[0].link} target="_blank" rel="noopener noreferrer" className="btn-3d px-6 py-2 text-ocean-dark text-sm flex items-center gap-2">
                              Leer completo <ArrowRight size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>

                    <div className="grid md:grid-cols-2 gap-8">
                        {news.slice(1, 4).map((item) => (
                          <article key={item.link} className="card-3d overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                              <div className="absolute top-4 left-4 z-10 bg-seaweed text-white font-bold text-xs px-3 py-1 rounded-full shadow-md border-2 border-white/50">
                                Importado
                              </div>
                              <img src={item.thumbnail || `https://picsum.photos/400/300`} alt="Noticia" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" referrerPolicy="no-referrer" />
                            </div>
                            <div className="p-6 bg-white/50 backdrop-blur-sm">
                              <h3 className="font-display text-xl font-bold leading-tight mb-3 text-ocean-dark group-hover:text-seaweed transition-colors line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-sm text-ocean-dark/80 mb-4 line-clamp-3 font-bold">
                                {stripHtml(item.description || '').substring(0, 100)}...
                              </p>
                              <div className="flex justify-between items-center text-xs font-bold text-ocean-dark/60 border-t-2 border-ocean-dark/10 pt-4">
                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(item.pubDate).toLocaleDateString()}</span>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-coral cursor-pointer text-seaweed"><ArrowRight size={14} /> Leer</a>
                              </div>
                            </div>
                          </article>
                        ))}
                    </div>
                </>
            ) : (
                <div className="card-3d p-12 text-center text-ocean-dark font-bold text-xl">
                    No se encontraron artículos en el feed general.
                </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
                        {/* Integración Oficial Twitter (X) */}
            <div className="card-3d p-6 bg-white/80 backdrop-blur-md border-t-8 border-t-black flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-white/50">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path></svg> 
              </div>
              <h3 className="font-display text-2xl font-bold mb-1 text-ocean-dark">
                @Ocnos_revista
              </h3>
              <p className="text-ocean-dark/60 font-bold text-sm mb-6">
                Comunidad Oficial
              </p>
              <div className="bg-ocean-light/30 p-4 rounded-xl mb-6 border border-ocean-dark/10 relative">
                <div className="absolute -top-2 -left-2 text-4xl text-black/10 font-serif">"</div>
                <p className="text-sm font-bold text-ocean-dark/80 italic z-10 relative">
                  Debido a las políticas de seguridad de 'X', los muros incrustados están deshabilitados. Síguenos directamente para debatir las últimas publicaciones.
                </p>
              </div>
              <a href="https://x.com/Ocnos_revista" target="_blank" rel="noopener noreferrer" className="btn-3d px-6 py-3 w-full border border-black/10 flex items-center justify-center gap-2 text-ocean-dark font-bold hover:bg-black hover:text-white transition-colors">
                Unirse a la conversación
              </a>
            </div>

            {/* Tarjeta RSS Cervantes */}
            <div className="card-3d p-6 bg-purple-reef/10 backdrop-blur-md border-t-8 border-t-purple-reef">
              <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2 text-ocean-dark">
                <BookOpen className="text-purple-reef" size={28} /> Cervantes Virtual
              </h3>
              <div className="inline-flex items-center gap-1 bg-purple-reef text-white px-3 py-1 rounded-md text-xs font-bold mb-6">
                 <Rss size={12} /> Sincronización RSS Externa
              </div>
              
              {loadingCervantes ? (
                <div className="flex justify-center py-8">
                    <Rss className="animate-spin text-purple-reef" size={24} />
                </div>
              ) : (
                <ul className="space-y-6">
                {cervantesNews.map((item) => (
                    <li key={item.link} className="group cursor-pointer">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl hover:bg-white/60 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-reef/20 flex shrink-0 items-center justify-center text-purple-reef font-display font-bold text-xl shadow-sm overflow-hidden">
                                {item.thumbnail ? ( <img src={item.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" /> ) : ( <span className="text-purple-reef">N</span> )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-ocean-dark leading-tight group-hover:text-purple-reef transition-colors mb-1 line-clamp-2">{item.title}</h4>
                                <p className="text-xs text-ocean-dark/60 font-bold">{new Date(item.pubDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                      </a>
                    </li>
                ))}
                </ul>
              )}
            </div>

            {/* Tarjeta RSS Fecyt / Convocatorias */}
            <div className="card-3d p-6 bg-coral/10 backdrop-blur-md border-t-8 border-t-coral">
              <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2 text-ocean-dark">
                <GraduationCap className="text-coral" size={28} /> FECYT / Becas
              </h3>
              <div className="inline-flex items-center gap-1 bg-coral text-white px-3 py-1 rounded-md text-xs font-bold mb-6">
                 <Rss size={12} /> Noticias Científicas
              </div>
              
              {loadingFecyt ? (
                <div className="flex justify-center py-8">
                    <Rss className="animate-spin text-coral" size={24} />
                </div>
              ) : (
                <ul className="space-y-6">
                {fecytNews.map((item) => (
                    <li key={item.link} className="group cursor-pointer">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl hover:bg-white/60 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-coral/20 flex shrink-0 items-center justify-center text-coral font-display font-bold text-xl shadow-sm overflow-hidden">
                                {item.thumbnail ? ( <img src={item.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" /> ) : ( <span className="text-coral">N</span> )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-ocean-dark leading-tight group-hover:text-coral transition-colors mb-1 line-clamp-2">{item.title}</h4>
                                <p className="text-xs text-ocean-dark/60 font-bold">{new Date(item.pubDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                      </a>
                    </li>
                ))}
                </ul>
              )}
            </div>

            {/* Caja de suscripción global (Boletín) */}
            <div className="card-3d p-8 bg-coral text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/20 rounded-full animate-float"></div>
              <h3 className="font-display text-2xl font-bold mb-2 relative z-10 text-3d text-stroke">
                Inscribirse al boletín de la Revista OCNOS
              </h3>
              <p className="text-sm font-bold mb-6 relative z-10 text-white">
                Entérate de nuevas publicaciones y convocatorias automáticas.
              </p>
              {subscribed ? (
                <div className="relative z-10 bg-white/20 p-4 rounded-xl text-center font-bold">
                  ¡Gracias por suscribirte!
                </div>
              ) : (
                <form className="relative z-10 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
                  <input type="email" required placeholder="Tu correo electrónico" className="w-full px-6 py-4 rounded-full bg-white/90 text-ocean-dark font-bold focus:outline-none shadow-inner placeholder-ocean-dark/50" />
                  <button type="submit" className="btn-3d w-full py-4 text-ocean-dark font-display font-bold text-lg flex items-center justify-center gap-2">
                    Inscribirse <ArrowRight size={20} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
