import { useState, useMemo, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Award, 
  BookOpen, 
  ExternalLink, 
  Play, 
  ChevronRight,
  ChevronLeft,
  User,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  X,
  Gamepad2,
  Bookmark,
  Filter,
  Layers
} from 'lucide-react';
import { NARRATIVAS } from '../data/narrativas';
import type { Narrative } from '../types/narrative';

// Roles y arquetipos temáticos de estilo RPG/Editorial
const NPC_CLASSES: Record<string, { role: string; tag: string; icon: string; statImpact: number; statRigor: number }> = {
  // Vol. 25 Núm. 2 (2026)
  tea_mujeres: { role: "Pionera Neurodiversa", tag: "Metacognición & TEA", icon: "🧠", statImpact: 97, statRigor: 96 },
  placer_secundaria: { role: "Defensora del Disfrute", tag: "Lectura por Placer", icon: "📖", statImpact: 93, statRigor: 94 },
  tiktok_lij: { role: "Estratega de Pantallas", tag: "BookTok & LIJ", icon: "📱", statImpact: 96, statRigor: 91 },
  naturaleza_albumes: { role: "Ecocrítica de Paisajes", tag: "Naturaleza & Álbum", icon: "🌿", statImpact: 92, statRigor: 95 },
  mediacion_vulnerable: { role: "Sembradora de Letras", tag: "Alfabetización Familiar", icon: "🌱", statImpact: 95, statRigor: 93 },
  creatividad_lectora: { role: "Alquimista Creativo", tag: "Pensamiento Divergente", icon: "💡", statImpact: 91, statRigor: 94 },
  no_ficcion_bibliotecas: { role: "Archivera de Saberes", tag: "No Ficción & Biblioteca", icon: "🏛️", statImpact: 89, statRigor: 96 },
  perfiles_no_ficcion: { role: "Cartógrafo de Curiosidades", tag: "Perfiles Lectores", icon: "🧭", statImpact: 90, statRigor: 93 },
  fonologica_vulnerabilidad: { role: "Ingeniero Fonológico", tag: "Ciencia de la Lectura", icon: "🔬", statImpact: 98, statRigor: 97 },
  transmedia_videojuego: { role: "Tejedor Transmedia", tag: "Videojuegos & Cuentos", icon: "🎮", statImpact: 95, statRigor: 92 },
  memoria_mexique: { role: "Custodia de la Memoria", tag: "Exilio & Guerra Civil", icon: "🚢", statImpact: 97, statRigor: 96 },
  distractores_lectura: { role: "Centinela de la Atención", tag: "Neuropsicología & Foco", icon: "⚡", statImpact: 96, statRigor: 98 },
  // Vol. 25 Núm. 1 (2026)
  dime_modelo: { role: "Arquitecto Inferencial", tag: "Modelo DIME & Primaria", icon: "📐", statImpact: 94, statRigor: 97 },
  lectura_resistente: { role: "Lector Subversivo", tag: "Lectura Resistente & Género", icon: "🛡️", statImpact: 95, statRigor: 93 },
  narrativa_digital_comparada: { role: "Narrador Bimodal", tag: "Tradición vs. Digital", icon: "🎭", statImpact: 92, statRigor: 95 },
  libros_digitales_infantil: { role: "Guía de Primera Infancia", tag: "Libros-App & Mediación", icon: "🧸", statImpact: 93, statRigor: 94 },
  pantalla_vs_papel: { role: "Ergónomo de la Lectura", tag: "Papel vs. Smartphone", icon: "📲", statImpact: 96, statRigor: 97 },
  escritura_academica: { role: "Maestra del Discurso", tag: "Escritura Analítica & Rúbricas", icon: "🖋️", statImpact: 91, statRigor: 96 },
  clasicos_lij_maestros: { role: "Reinventora de Mitos", tag: "Clásicos LIJ & Formación", icon: "🧚", statImpact: 94, statRigor: 92 },
  situaciones_lomloe: { role: "Diseñadora Curricular", tag: "LOMLOE & Retos Literarios", icon: "🎯", statImpact: 93, statRigor: 95 },
  patrones_bibliotecas_madrid: { role: "Cartógrafo del Préstamo", tag: "Big Data & Manga/Thriller", icon: "📊", statImpact: 98, statRigor: 96 },
  prosodia_lectores_vasco: { role: "Escultor del Silencio", tag: "Fonética & Prosodia", icon: "🎙️", statImpact: 90, statRigor: 98 },
  // Vol. 24 Núm. 2 (2025)
  prelectocat_cribado: { role: "Centinela Precoz", tag: "Cribado Infantil & RAN", icon: "🛡️", statImpact: 96, statRigor: 95 },
  conciencia_fonologica_aula: { role: "Maestra del Código", tag: "Conciencia Fonémica & Phonics", icon: "🔤", statImpact: 97, statRigor: 96 },
  pequeneces_tropologia: { role: "Hermenéutico Rebelde", tag: "Tropología & Crítica 1891", icon: "📜", statImpact: 89, statRigor: 94 },
  inclusion_discapacidad_lectura: { role: "Puente Inclusivo", tag: "Lectura Fácil & Ciudadanía", icon: "🤝", statImpact: 98, statRigor: 92 },
  mejora_comprension_factores: { role: "Estratega Inferencial", tag: "Textos Discontinuos & PIRLS", icon: "📊", statImpact: 94, statRigor: 95 },
  metacognicion_universitarios: { role: "Calibrador de la Mente", tag: "Test ARCO & MARSI", icon: "🧠", statImpact: 92, statRigor: 97 },
  pausas_lectura_evolucion: { role: "Cronista del Silencio", tag: "Prosodia Temporal & Praat", icon: "⏱️", statImpact: 91, statRigor: 98 },
  albumes_infantil_valores: { role: "Sembradora de Asombro", tag: "Álbum & Empatía Infantil", icon: "🎨", statImpact: 95, statRigor: 93 },
  motivacion_preferencias_adolescentes: { role: "Voz Adolescente", tag: "Escala EMPL-A & Papel", icon: "🔥", statImpact: 94, statRigor: 94 },
  etnografia_lectores_vulnerables: { role: "Trinchera Crítica", tag: "Justicia Curricular & Conurbano", icon: "✊", statImpact: 99, statRigor: 96 },
  // Vol. 24 Núm. 1 (2025)
  desapego_lectura_digital: { role: "Ecólogo de Pantallas", tag: "Desapego Digital & Interfaces", icon: "💻", statImpact: 95, statRigor: 96 },
  ambiente_alfabetizador_hogar: { role: "Guardiana del Hogar", tag: "HLE & Lectura Familiar", icon: "🏡", statImpact: 96, statRigor: 94 },
  narracion_digital_albumes: { role: "Crítica Audiovisual", tag: "Videocuentos & Semiótica", icon: "🎬", statImpact: 92, statRigor: 95 },
  cuentos_hadas_censura: { role: "Arqueólogo de Archivos", tag: "Censura Ibérica & Folclore", icon: "🗝️", statImpact: 94, statRigor: 97 },
  juegos_funciones_ejecutivas: { role: "Ludomaga Inclusiva", tag: "Juegos de Mesa & INTARSE", icon: "🎲", statImpact: 97, statRigor: 95 },
  literatura_infantil_sexual: { role: "Educadora de Afectos", tag: "ESI & Prevención del Abuso", icon: "🛡️", statImpact: 98, statRigor: 96 },
  movimientos_oculares_dislexia: { role: "Fisióloga de la Mirada", tag: "Eye-Tracking & Fisiología", icon: "👁️", statImpact: 93, statRigor: 99 },
  empoderamiento_comic_portugues: { role: "Revolucionaria Gráfica", tag: "Cómic Feminista Luso", icon: "✊", statImpact: 95, statRigor: 93 },
  tdah_dislexia_lectura_escucha: { role: "Alquimista Auditiva", tag: "TDAH + Dislexia & Audio", icon: "🎧", statImpact: 98, statRigor: 97 },
  hermann_hesse_adolescente: { role: "Filósofa del Despertar", tag: "Hesse & Crisis Existencial", icon: "🌱", statImpact: 93, statRigor: 92 },
  // Vol. 23 Núm. 2 (2024)
  escala_macronarrativa_universitaria: { role: "Arquitecta del Relato", tag: "Macronarrativa & Estructura", icon: "🏛️", statImpact: 93, statRigor: 96 },
  autorregulacion_lectura_cientifica: { role: "Estratega Epistémica", tag: "ARA & Papers Científicos", icon: "🔬", statImpact: 95, statRigor: 97 },
  lectura_digital_ejecutiva: { role: "Neurolectora Ejecutiva", tag: "Updating & Inhibición", icon: "⚡", statImpact: 94, statRigor: 98 },
  narraciones_gamificadas_docentes: { role: "Ludomáster Pedagógica", tag: "Gamificación & Misiones", icon: "🎲", statImpact: 97, statRigor: 93 },
  alfabetizacion_matematica_infantil: { role: "Exploradora de Símbolos", tag: "Confluencia & Asamblea", icon: "🔢", statImpact: 96, statRigor: 95 },
  profesores_expertos_clasicos_eso: { role: "Navegante de Clásicos", tag: "Voz Alta & Diálogo Vivo", icon: "📖", statImpact: 98, statRigor: 96 },
  autoficcion_recepcion_goodreads: { role: "Desmitificador del Yo", tag: "Autoficción & Goodreads", icon: "🪞", statImpact: 91, statRigor: 94 },
  tic_comprension_primaria: { role: "Guardiana de la Calma", tag: "Paciencia Cognitiva & TIC", icon: "🛡️", statImpact: 96, statRigor: 95 },
  intertextualidad_album_infantil: { role: "Detective Semiótica", tag: "Intericonicidad & Ecos", icon: "🔍", statImpact: 94, statRigor: 97 },
  influencers_booktok_tiktok: { role: "Heraldo de BookTok", tag: "Vulnerabilidad & Prescripción", icon: "📱", statImpact: 99, statRigor: 92 },
  // Vol. 23 Núm. 1 (2024)
  fernanda_melchor_goodreads_nlp: { role: "Analista de Sentimientos", tag: "PLN en R & Oxímoron", icon: "🌪️", statImpact: 97, statRigor: 98 },
  educacion_literaria_redes_sociales: { role: "Educomunicadora Global", tag: "PRISMA & Redes Sociales", icon: "🌐", statImpact: 94, statRigor: 96 },
  alfabetizacion_videorresenas_docentes: { role: "Cineasta Pedagógica", tag: "Videorreseñas & Oratoria", icon: "🎥", statImpact: 95, statRigor: 94 },
  sindrome_irlen_lectura: { role: "Fisioterapeuta Visual", tag: "Irlen & Filtros de Color", icon: "👓", statImpact: 99, statRigor: 97 },
  lectura_recreativa_bibliotecas_universitarias: { role: "Custodia del Sosiego", tag: "Biblioterapia & Ocio", icon: "🛋️", statImpact: 95, statRigor: 93 },
  vidas_objetos_it_fiction: { role: "Hada de las Cosas", tag: "It-Fiction & Memoria", icon: "🧸", statImpact: 92, statRigor: 95 },
  cuentos_clasicos_streaming_transmedia: { role: "Tejedora de Pantallas", tag: "Streaming & Reciclaje", icon: "📺", statImpact: 96, statRigor: 94 },
  didactica_literaria_primaria_vasco_navarra: { role: "Voz de la Infancia", tag: "Poesía Escolar & Euskadi", icon: "🌱", statImpact: 94, statRigor: 96 },
  canon_premios_lij: { role: "Crítica de Laureles", tag: "Canon LIJ & Premios", icon: "🏆", statImpact: 93, statRigor: 97 },
  // Artículos anteriores
  multiliteracidad: { role: "Archimaga Semiótica", tag: "Multimodalidad", icon: "✨", statImpact: 92, statRigor: 95 },
  apadrinamiento: { role: "Mentora de Lecturas", tag: "Didáctica Comunitaria", icon: "🤝", statImpact: 96, statRigor: 90 },
  pdae: { role: "Estratega Curricular", tag: "Diseño Pedagógico", icon: "📐", statImpact: 88, statRigor: 94 },
  lectura_creacion: { role: "Poeta Experimental", tag: "Escritura Poética", icon: "✍️", statImpact: 90, statRigor: 89 },
  genero_chile: { role: "Defensora de Voces", tag: "Estudios Críticos", icon: "⚖️", statImpact: 94, statRigor: 96 },
  comic_historia: { role: "Cronista Gráfico", tag: "Memoria y Viñetas", icon: "📜", statImpact: 91, statRigor: 93 },
  preferencias_lectoras: { role: "Cartógrafa de Hábitos", tag: "Sociología Lectora", icon: "🧭", statImpact: 87, statRigor: 92 },
  diversidad_comics: { role: "Explorador Inclusivo", tag: "Diversidad y Cómic", icon: "🎨", statImpact: 93, statRigor: 91 },
  iconograficos: { role: "Decodificador Visual", tag: "Cultura Iconográfica", icon: "👁️", statImpact: 89, statRigor: 97 },
  habitacion_ellas: { role: "Guardiana de la Palabra", tag: "Literatura Femenina", icon: "🌿", statImpact: 95, statRigor: 92 },
  ensayo_comic: { role: "Ensayista Gráfico", tag: "Narrativa Ilustrada", icon: "🖋️", statImpact: 90, statRigor: 94 },
  booktuber: { role: "Heraldo Transmedia", tag: "Comunidades Digitales", icon: "📡", statImpact: 97, statRigor: 88 },
  competencia_global: { role: "Diplomática Planetaria", tag: "Educación Global", icon: "🌍", statImpact: 94, statRigor: 95 },
  comic_sensibilizacion: { role: "Mediador Empático", tag: "Sensibilización Social", icon: "🌱", statImpact: 92, statRigor: 91 },
  manga: { role: "Canalizador Intercultural", tag: "Manga & Educación", icon: "⛩️", statImpact: 95, statRigor: 93 }
};

interface IssueGroup {
  id: string;
  volume: string;
  number: string;
  year: string;
  label: string;
  shortLabel: string;
}

const OCNOS_ISSUES: IssueGroup[] = [
  { id: '25-2', volume: '25', number: '2', year: '2026', label: 'Vol. 25 Núm. 2 (2026)', shortLabel: 'Vol. 25(2)' },
  { id: '25-1', volume: '25', number: '1', year: '2026', label: 'Vol. 25 Núm. 1 (2026)', shortLabel: 'Vol. 25(1)' },
  { id: '24-2', volume: '24', number: '2', year: '2025', label: 'Vol. 24 Núm. 2 (2025)', shortLabel: 'Vol. 24(2)' },
  { id: '24-1', volume: '24', number: '1', year: '2025', label: 'Vol. 24 Núm. 1 (2025)', shortLabel: 'Vol. 24(1)' },
  { id: '23-2', volume: '23', number: '2', year: '2024', label: 'Vol. 23 Núm. 2 (2024)', shortLabel: 'Vol. 23(2)' },
  { id: '23-1', volume: '23', number: '1', year: '2024', label: 'Vol. 23 Núm. 1 (2024)', shortLabel: 'Vol. 23(1)' },
  { id: '22-2', volume: '22', number: '2', year: '2023', label: 'Vol. 22 Núm. 2 (2023)', shortLabel: 'Vol. 22(2)' },
  { id: '22-1', volume: '22', number: '1', year: '2023', label: 'Vol. 22 Núm. 1 (2023)', shortLabel: 'Vol. 22(1)' },
];

const isNarrativePlayable = (narrative?: Narrative | null): boolean => {
  if (!narrative) return false;
  if (narrative.id === 'manga' || narrative.id === 'detectives') return true;
  if (narrative.blocks?.juegos && narrative.blocks.juegos.length > 0) return true;
  if (['transmedia_videojuego', 'multiliteracidad', 'juegos_funciones_ejecutivas', 'narraciones_gamificadas_docentes'].includes(narrative.id)) return true;
  return false;
};

interface EditorialRosterProps {
  onSelectNarrative?: (narrative: Narrative, targetBlock?: any) => void;
}

export default function EditorialRoster({ onSelectNarrative }: EditorialRosterProps = {}) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [selectedIssue, setSelectedIssue] = useState<string>('todos');
  const [playableFilter, setPlayableFilter] = useState<'all' | 'playable' | 'reading'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');
  
  const rosterListRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'todos', label: 'Todas las Investigaciones' },
    { id: 'didactica', label: 'Didáctica, Cognición e Inclusión' },
    { id: 'comics', label: 'Cómics, Álbum y Memoria' },
    { id: 'digital', label: 'Digital, BookTok y Transmedia' },
  ];

  const filteredNarrativas = useMemo(() => {
    return NARRATIVAS.filter(n => {
      // 1. Filtro temático
      if (activeFilter === 'didactica') {
        const didacticaIds = [
          'tea_mujeres', 'placer_secundaria', 'mediacion_vulnerable', 'creatividad_lectora',
          'perfiles_no_ficcion', 'fonologica_vulnerabilidad', 'distractores_lectura',
          'dime_modelo', 'lectura_resistente', 'pantalla_vs_papel', 'escritura_academica',
          'situaciones_lomloe', 'prosodia_lectores_vasco', 'prelectocat_cribado',
          'conciencia_fonologica_aula', 'inclusion_discapacidad_lectura', 'mejora_comprension_factores',
          'metacognicion_universitarios', 'pausas_lectura_evolucion', 'etnografia_lectores_vulnerables',
          'ambiente_alfabetizador_hogar', 'juegos_funciones_ejecutivas', 'literatura_infantil_sexual',
          'movimientos_oculares_dislexia', 'tdah_dislexia_lectura_escucha', 'hermann_hesse_adolescente',
          'escala_macronarrativa_universitaria', 'autorregulacion_lectura_cientifica', 'lectura_digital_ejecutiva',
          'narraciones_gamificadas_docentes', 'alfabetizacion_matematica_infantil', 'profesores_expertos_clasicos_eso',
          'tic_comprension_primaria', 'alfabetizacion_videorresenas_docentes', 'sindrome_irlen_lectura',
          'lectura_recreativa_bibliotecas_universitarias', 'didactica_literaria_primaria_vasco_navarra',
          'apadrinamiento', 'pdae', 'lectura_creacion', 'competencia_global', 'preferencias_lectoras'
        ];
        if (!didacticaIds.includes(n.id)) return false;
      } else if (activeFilter === 'comics') {
        const comicsIds = [
          'naturaleza_albumes', 'no_ficcion_bibliotecas', 'memoria_mexique', 'clasicos_lij_maestros',
          'patrones_bibliotecas_madrid', 'pequeneces_tropologia', 'albumes_infantil_valores',
          'cuentos_hadas_censura', 'empoderamiento_comic_portugues', 'autoficcion_recepcion_goodreads',
          'intertextualidad_album_infantil', 'vidas_objetos_it_fiction', 'canon_premios_lij',
          'comic_historia', 'diversidad_comics', 'iconograficos', 'ensayo_comic',
          'comic_sensibilizacion', 'manga'
        ];
        if (!comicsIds.includes(n.id)) return false;
      } else if (activeFilter === 'digital') {
        const digitalIds = [
          'tiktok_lij', 'transmedia_videojuego', 'narrativa_digital_comparada', 'libros_digitales_infantil',
          'motivacion_preferencias_adolescentes', 'desapego_lectura_digital', 'narracion_digital_albumes',
          'influencers_booktok_tiktok', 'fernanda_melchor_goodreads_nlp', 'educacion_literaria_redes_sociales',
          'cuentos_clasicos_streaming_transmedia', 'multiliteracidad', 'booktuber', 'genero_chile',
          'habitacion_ellas'
        ];
        if (!digitalIds.includes(n.id)) return false;
      }

      // 2. Filtro por número / volumen de revista
      if (selectedIssue !== 'todos') {
        const targetIssue = OCNOS_ISSUES.find(i => i.id === selectedIssue);
        if (targetIssue) {
          const journal = n.metadata?.journal || '';
          const matches = journal.includes(targetIssue.volume) && journal.includes(`(${targetIssue.number})`);
          if (!matches) return false;
        }
      }

      // 3. Filtro por jugabilidad
      const playable = isNarrativePlayable(n);
      if (playableFilter === 'playable' && !playable) return false;
      if (playableFilter === 'reading' && playable) return false;

      // 4. Barra para buscar
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const npc = NPC_CLASSES[n.id];
        const matchTitle = (n.metadata?.title || '').toLowerCase().includes(q);
        const authorsStr = typeof n.metadata?.authors === 'string' ? n.metadata.authors : Array.isArray(n.metadata?.authors) ? (n.metadata.authors as string[]).join(' ') : '';
        const matchAuthors = authorsStr.toLowerCase().includes(q);
        const matchDoi = (n.metadata?.doi || '').toLowerCase().includes(q);
        const matchJournal = (n.metadata?.journal || '').toLowerCase().includes(q);
        const matchRole = npc ? npc.role.toLowerCase().includes(q) : false;
        const matchTag = npc ? npc.tag.toLowerCase().includes(q) : false;
        const matchGancho = n.metadata?.gancho ? n.metadata.gancho.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchAuthors && !matchDoi && !matchJournal && !matchRole && !matchTag && !matchGancho) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilter, selectedIssue, playableFilter, searchQuery]);

  // Agrupación estructurada por números de revista
  const groupedArticles = useMemo(() => {
    const groups: Array<{ issue: IssueGroup; items: Narrative[] }> = [];
    for (const issue of OCNOS_ISSUES) {
      if (selectedIssue !== 'todos' && issue.id !== selectedIssue) continue;
      const items = filteredNarrativas.filter(n => {
        const journal = n.metadata?.journal || '';
        return journal.includes(issue.volume) && journal.includes(`(${issue.number})`);
      });
      if (items.length > 0) {
        groups.push({ issue, items });
      }
    }
    return groups;
  }, [filteredNarrativas, selectedIssue]);

  // Si el índice seleccionado queda fuera del filtro actual, ajustamos
  useEffect(() => {
    const isCurrentInFiltered = filteredNarrativas.some(n => n.id === NARRATIVAS[selectedIndex]?.id);
    if (!isCurrentInFiltered && filteredNarrativas.length > 0) {
      const newIdx = NARRATIVAS.findIndex(n => n.id === filteredNarrativas[0].id);
      if (newIdx !== -1) setSelectedIndex(newIdx);
    }
  }, [filteredNarrativas, selectedIndex]);

  const selectedNarrative: Narrative = NARRATIVAS[selectedIndex] || NARRATIVAS[0];

  const npcClass = NPC_CLASSES[selectedNarrative.id] || {
    role: "Investigador OCNOS",
    tag: "Ciencia Transmedia",
    icon: "🔬",
    statImpact: 90,
    statRigor: 90,
  };

  const cromoImage = selectedNarrative.metadata?.image || '/assets/portadas/naturaleza_albumes.jpg';

  // Anunciar a lectores de pantalla cuando cambia de personaje
  const handleSelectCharacter = (index: number, announce: boolean = true) => {
    setSelectedIndex(index);
    if (announce && NARRATIVAS[index]) {
      const nar = NARRATIVAS[index];
      setScreenReaderAnnouncement(`Investigación seleccionada: ${nar.metadata.title}, por ${nar.metadata.authors}`);
    }
  };

  const handleLaunchNarrative = (narrativeId?: string, targetBlock?: any) => {
    const idToOpen = narrativeId || selectedNarrative.id;
    if (onSelectNarrative) {
      const found = NARRATIVAS.find(n => n.id === idToOpen);
      if (found) {
        onSelectNarrative(found, targetBlock);
        return;
      }
    }
    const query = new URLSearchParams({ nar: idToOpen });
    if (targetBlock) query.set('b', String(targetBlock));
    navigate(`/interactivos?${query.toString()}`);
  };

  // Navegación rápida de personajes (Siguiente / Anterior)
  const handlePrevCharacter = () => {
    const currentFilteredIdx = filteredNarrativas.findIndex(n => n.id === selectedNarrative.id);
    const prevFilteredIdx = (currentFilteredIdx - 1 + filteredNarrativas.length) % filteredNarrativas.length;
    const globalIdx = NARRATIVAS.findIndex(n => n.id === filteredNarrativas[prevFilteredIdx].id);
    if (globalIdx !== -1) handleSelectCharacter(globalIdx);
  };

  const handleNextCharacter = () => {
    const currentFilteredIdx = filteredNarrativas.findIndex(n => n.id === selectedNarrative.id);
    const nextFilteredIdx = (currentFilteredIdx + 1) % filteredNarrativas.length;
    const globalIdx = NARRATIVAS.findIndex(n => n.id === filteredNarrativas[nextFilteredIdx].id);
    if (globalIdx !== -1) handleSelectCharacter(globalIdx);
  };

  // Manejo de teclado accesible en la cuadrícula de personajes
  const handleKeyDownGrid = (e: KeyboardEvent<HTMLDivElement>, currentIdx: number, item: Narrative) => {
    const currentFilteredIdx = filteredNarrativas.findIndex(n => n.id === item.id);
    let targetFilteredIdx = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetFilteredIdx = (currentFilteredIdx + 1) % filteredNarrativas.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetFilteredIdx = (currentFilteredIdx - 1 + filteredNarrativas.length) % filteredNarrativas.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetFilteredIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetFilteredIdx = filteredNarrativas.length - 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLaunchNarrative(item.id);
      return;
    }

    if (targetFilteredIdx !== -1) {
      const nextNarrative = filteredNarrativas[targetFilteredIdx];
      const nextGlobalIdx = NARRATIVAS.findIndex(n => n.id === nextNarrative.id);
      if (nextGlobalIdx !== -1) {
        handleSelectCharacter(nextGlobalIdx);
        // Enfocar la tarjeta seleccionada
        const targetElement = document.getElementById(`roster-card-${nextNarrative.id}`);
        targetElement?.focus();
      }
    }
  };

  return (
    <section 
      aria-label="Catálogo interactivo de investigaciones y personajes"
      className="relative w-full bg-[#f3fbfa] text-[#151d1d] py-10 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 selection:bg-ocnos-cyan/20 selection:text-ocnos-cyan"
    >
      {/* Región ARIA en vivo para accesibilidad de lectores de pantalla */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      {/* Luz Atmosférica Sutil de Paleta Macaron */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-ocnos-cyan/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-ocnos-coral/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-80 h-80 bg-ocnos-green/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-[1580px] mx-auto">
        
        {/* ========================================================================= */}
        {/* CABECERA EDITORIAL ACCESIBLE Y FILTROS RESPONSIVE                         */}
        {/* ========================================================================= */}
        <div className="mb-8 md:mb-10 border-b border-outline-variant/40 pb-6 md:pb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-palette-coralLight border border-palette-coral/30 text-ocnos-coral text-[11px] font-bold tracking-widest uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-ocnos-coral animate-pulse" />
                <span>Edición Interactiva Cuatrimestral</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight uppercase" style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
                Artículos Interactivos
              </h2>
              <p className="mt-2 text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
                Cada artículo cuenta con una experiencia interactiva guiada por su autor/a. Selecciona un perfil, sumérgete en las investigaciones con datos empíricos o navega por el mapa conceptual relacional.
              </p>
            </div>

            {/* BARRA DE BÚSQUEDA ACCESIBLE */}
            <div className="w-full lg:w-96 flex flex-col items-start lg:items-end gap-2">
              <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant bg-palette-yellowLight/70 px-3.5 py-1.5 rounded-xl border border-palette-yellow/40 shadow-2xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocnos-yellow opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d8b506]" />
                </span>
                <span>Consejo: Usa las flechas <strong className="text-on-surface font-bold">[← ↑ → ↓]</strong> para navegar</span>
              </div>

              <div className="w-full relative">
                <label htmlFor="search-input" className="sr-only">Buscar artículos e investigaciones</label>
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden="true" />
                <input
                  id="search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar título, autor, tema o DOI (10.18239)..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 hover:border-ocnos-cyan focus:border-ocnos-cyan text-on-surface placeholder:text-on-surface-variant/60 text-xs sm:text-sm rounded-full pl-10 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-ocnos-cyan/20 transition-all font-sans shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-md transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BARRA DE FILTROS: NÚMEROS DE REVISTA, MODALIDAD Y TEMÁTICAS */}
          <div className="space-y-4 pt-1">
            {/* 1. Selector de Números de Revista */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1 font-mono">
                <Bookmark size={14} className="text-ocnos-cyan" aria-hidden="true" />
                Números:
              </span>
              <button
                onClick={() => setSelectedIssue('todos')}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap font-medium cursor-pointer flex items-center gap-1.5 border ${
                  selectedIssue === 'todos'
                    ? 'bg-ocnos-yellow text-slate-900 font-extrabold shadow-md shadow-ocnos-yellow/30 border-ocnos-yellow scale-105'
                    : 'bg-white hover:bg-surface-container text-on-surface-variant border-outline-variant/50 shadow-2xs'
                }`}
              >
                <span>Todos los Números</span>
                <span className="text-[10px] opacity-75 font-normal">({NARRATIVAS.length})</span>
              </button>
              {OCNOS_ISSUES.map(issue => {
                const isIssueActive = selectedIssue === issue.id;
                const count = NARRATIVAS.filter(n => (n.metadata?.journal || '').includes(issue.volume) && (n.metadata?.journal || '').includes(`(${issue.number})`)).length;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                      isIssueActive
                        ? 'bg-ocnos-yellow text-slate-900 font-extrabold shadow-md shadow-ocnos-yellow/30 border-ocnos-yellow scale-105'
                        : 'bg-white hover:bg-surface-container text-on-surface-variant font-medium border-outline-variant/50 shadow-2xs'
                    }`}
                  >
                    <span>{issue.shortLabel}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* 2. Selector de Modalidad (Con Juego / Solo Lectura) y Categorías Temáticas */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
              <div className="flex items-center flex-wrap gap-2 text-xs">
                {/* Filtro de Modalidad de Juego */}
                <div className="inline-flex p-1 rounded-xl bg-white border border-outline-variant/50 shadow-2xs mr-2">
                  <button
                    onClick={() => setPlayableFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all font-medium ${
                      playableFilter === 'all'
                        ? 'bg-on-surface text-white font-bold shadow-2xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setPlayableFilter('playable')}
                    className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center gap-1.5 ${
                      playableFilter === 'playable'
                        ? 'bg-palette-cyanLight text-ocnos-cyan border border-ocnos-cyan/30 shadow-2xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Gamepad2 size={13} className="text-ocnos-cyan animate-pulse" />
                    Con Juego ({NARRATIVAS.filter(isNarrativePlayable).length})
                  </button>
                  <button
                    onClick={() => setPlayableFilter('reading')}
                    className={`px-3 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                      playableFilter === 'reading'
                        ? 'bg-surface-container-high text-on-surface font-bold shadow-2xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <BookOpen size={13} />
                    Solo Lectura ({NARRATIVAS.filter(n => !isNarrativePlayable(n)).length})
                  </button>
                </div>

                {/* Selector de Categorías Temáticas */}
                <span className="text-on-surface-variant text-xs font-semibold ml-1">Ejes:</span>
                {categories.map(cat => {
                  const isCatActive = activeFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      id={`tab-${cat.id}`}
                      aria-selected={isCatActive}
                      aria-controls="roster-grid"
                      onClick={() => setActiveFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap text-xs font-medium cursor-pointer border ${
                        isCatActive
                          ? 'bg-on-surface text-white font-semibold border-on-surface shadow-2xs'
                          : 'bg-white hover:bg-surface-container text-on-surface-variant border-outline-variant/50 shadow-2xs'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Indicador de Conteo */}
              <div className="text-xs font-bold tracking-wider text-ocnos-orange flex items-center gap-1.5 self-start lg:self-auto">
                <span className="inline-block w-2 h-2 rounded-full bg-ocnos-orange" />
                <span>
                  {filteredNarrativas.length} {filteredNarrativas.length === 1 ? 'investigación encontrada' : 'investigaciones encontradas'}
                  {selectedIssue !== 'todos' ? ` en ${OCNOS_ISSUES.find(i => i.id === selectedIssue)?.shortLabel}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SELECTOR RÁPIDO MÓVIL (VISIBLE SOLO EN PANTALLAS PEQUEÑAS < lg)           */}
        {/* ========================================================================= */}
        <div className="block lg:hidden mb-6 bg-white/5 border border-white/15 rounded-2xl p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-sand uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              Selector Rápido Móvil
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevCharacter}
                aria-label="Investigador anterior"
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white active:scale-90 transition-transform"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextCharacter}
                aria-label="Investigador siguiente"
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white active:scale-90 transition-transform"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carrusel de Avatares Móvil */}
          <div 
            className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
            role="tablist"
            aria-label="Investigadores disponibles en móvil"
          >
            {filteredNarrativas.map((item) => {
              const actualIdx = NARRATIVAS.findIndex(n => n.id === item.id);
              const isSelected = actualIdx === selectedIndex;
              const miniCromo = item.metadata?.image || '/assets/portadas/naturaleza_albumes.jpg';

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectCharacter(actualIdx)}
                  aria-label={`Ver ${item.metadata.title}`}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-sand text-ocean-dark font-bold border-sand shadow-md ring-2 ring-sand/50'
                      : 'bg-white/10 text-white/90 border-white/10 hover:bg-white/15'
                  }`}
                >
                  <img src={miniCromo} alt="" className="w-6 h-6 object-cover rounded-md" aria-hidden="true" />
                  <span className="text-xs truncate max-w-[130px]">{typeof item.metadata?.authors === 'string' ? item.metadata.authors.split(' ')[0] : ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTENEDOR DUAL: SHOWCASE PRINCIPAL (5 COLS) + GRID ROSTER (7 COLS)       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* PANEL IZQUIERDO: STAGE / SHOWCASE DEL INVESTIGADOR (5 cols)  */}
          {/* ============================================================ */}
          <article 
            ref={showcaseRef}
            id="investigador-panel"
            role="region"
            aria-label={`Ficha de investigación: ${selectedNarrative.metadata.title}`}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-outline-variant/60 shadow-xl group editorial-card"
          >
            {/* Glow accents in corner with fresh palette colors */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-ocnos-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-ocnos-coral/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header del Showcase: Indicador P1 y DOI */}
            <div className="flex items-center justify-between text-xs pb-5 border-b border-outline-variant/30 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-coralLight border border-palette-coral/40 text-ocnos-coral font-bold tracking-wide">
                <Zap size={13} className="animate-pulse text-ocnos-coral" aria-hidden="true" />
                <span>INVESTIGADOR ACTIVO [P1]</span>
              </span>
              <span className="font-mono text-outline text-[11px] hover:text-ocnos-cyan transition cursor-pointer font-medium truncate max-w-[200px]" title={selectedNarrative.metadata.doi}>
                DOI: {selectedNarrative.metadata.doi}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNarrative.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col relative z-10"
              >
                {/* Grabado / Cromo Principal del Personaje */}
                <div 
                  onClick={() => handleLaunchNarrative()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLaunchNarrative(); }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Iniciar lectura de ${selectedNarrative.metadata.title}`}
                  className="relative my-6 rounded-2xl overflow-hidden bg-gradient-to-b from-surface-container to-surface-container-high p-2.5 border border-outline-variant/50 shadow-inner group cursor-pointer focus-visible:ring-4 focus-visible:ring-ocnos-cyan focus-visible:outline-none"
                  title="Haz clic para entrar a la narrativa"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[16/11] flex items-center justify-center bg-[#fdfbf7]">
                    <motion.img
                      src={cromoImage}
                      alt={`Ilustración de la investigación ${selectedNarrative.metadata.title}`}
                      className="w-full h-full object-cover filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                      animate={prefersReducedMotion ? {} : { 
                        y: [0, -4, 0],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />

                    {/* Insignia de Jugabilidad en Portada Principal */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md border border-white/40 text-[11px] text-on-surface font-semibold shadow-xs">
                      {isNarrativePlayable(selectedNarrative) ? (
                        <>
                          <Gamepad2 size={13} className="text-ocnos-green animate-pulse" />
                          <span>JUEGO DISPONIBLE</span>
                        </>
                      ) : (
                        <>
                          <BookOpen size={13} className="text-ocnos-cyan" />
                          <span>MODO LECTURA & MAPA</span>
                        </>
                      )}
                    </div>

                    {/* Publicación y año */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md border border-white/40 text-[11px] text-on-surface font-mono font-bold shadow-xs">
                      {selectedNarrative.metadata.year} • {selectedNarrative.metadata.journal}
                    </div>

                    {/* Insignia de Clase NPC */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-outline-variant/40 flex items-center gap-1.5 shadow-md">
                      <span className="text-sm" aria-hidden="true">{npcClass.icon}</span>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{npcClass.role}</span>
                    </div>
                  </div>
                </div>

                {/* Título y Autor */}
                <h3 
                  onClick={() => handleLaunchNarrative()}
                  className="font-serif text-xl sm:text-2xl font-bold text-on-surface leading-tight mb-2 hover:text-ocnos-cyan transition-colors cursor-pointer"
                >
                  {selectedNarrative.metadata.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium flex items-center gap-1.5 mb-4">
                  <User size={14} className="text-ocnos-cyan shrink-0" aria-hidden="true" />
                  <span>{selectedNarrative.metadata.authors}</span>
                </p>

                {/* Cita / Gancho Textual (Dialogue Box RPG) */}
                <blockquote className="relative bg-surface-container-low border-l-4 border-ocnos-cyan rounded-r-xl p-4 mb-5 text-xs sm:text-sm italic text-on-surface leading-relaxed font-serif">
                  <span className="text-ocnos-cyan font-serif text-lg leading-none mr-1" aria-hidden="true">“</span>
                  {selectedNarrative.metadata.gancho || selectedNarrative.blocks.apertura.gancho}
                  <span className="text-ocnos-cyan font-serif text-lg leading-none ml-1" aria-hidden="true">”</span>
                </blockquote>

                {/* Barras de Atributos Científicos y Tiempo */}
                <div className="space-y-3 mb-6 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-ocnos-orange" aria-hidden="true" />
                      Tiempo Estimado
                    </span>
                    <span className="font-bold text-on-surface">{selectedNarrative.metadata.duration}</span>
                  </div>

                  {/* Barra 1: Nivel de Profundidad */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <Award size={14} className="text-ocnos-coral" aria-hidden="true" />
                        Nivel de Profundidad
                      </span>
                      <span className="font-bold text-ocnos-coral">{selectedNarrative.metadata.depth}</span>
                    </div>
                    <div 
                      className="w-full h-2 bg-slate-200 rounded-full overflow-hidden" 
                      role="progressbar" 
                      aria-valuenow={npcClass.statImpact} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                      aria-label={`Nivel de profundidad: ${selectedNarrative.metadata.depth}`}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-ocnos-cyan to-ocnos-coral rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${npcClass.statImpact}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Barra 2: Rigor Metodológico */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <BookOpen size={14} className="text-ocnos-green" aria-hidden="true" />
                        Rigor Metodológico
                      </span>
                      <span className="font-bold text-ocnos-green">{npcClass.statRigor}%</span>
                    </div>
                    <div 
                      className="w-full h-2 bg-slate-200 rounded-full overflow-hidden" 
                      role="progressbar" 
                      aria-valuenow={npcClass.statRigor} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                      aria-label={`Rigor metodológico: ${npcClass.statRigor}%`}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-ocnos-green to-ocnos-cyan rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${npcClass.statRigor}%` }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción Accesibles */}
                <div className="flex flex-wrap items-stretch gap-2.5 pt-1">
                  <button
                    onClick={() => handleLaunchNarrative()}
                    aria-label={`Entrar a la investigación: ${selectedNarrative.metadata.title}`}
                    className="flex-1 min-w-[170px] min-h-[46px] bg-gradient-to-r from-ocnos-coral to-ocnos-orange hover:opacity-95 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:ring-4 focus-visible:ring-ocnos-coral focus-visible:outline-none"
                  >
                    <Play size={15} className="fill-white" aria-hidden="true" />
                    <span>EXPLORAR INVESTIGACIÓN</span>
                  </button>

                  {isNarrativePlayable(selectedNarrative) && (
                    <button
                      onClick={() => handleLaunchNarrative(selectedNarrative.id, 'juego')}
                      aria-label={`Jugar minijuego interactivo de: ${selectedNarrative.metadata.title}`}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-palette-greenLight hover:bg-palette-green text-ocnos-green-dark hover:text-white font-bold text-xs sm:text-sm border border-ocnos-green/40 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-ocnos-green focus-visible:outline-none shrink-0 shadow-xs"
                      title="Jugar minijuego interactivo del artículo"
                    >
                      <Gamepad2 size={15} className="animate-pulse" />
                      <span>JUGAR</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleLaunchNarrative(selectedNarrative.id, 'mapa')}
                    aria-label={`Abrir mapa mental interactivo de: ${selectedNarrative.metadata.title}`}
                    className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-palette-cyanLight hover:bg-ocnos-cyan text-ocnos-cyan-dark hover:text-white font-bold text-xs sm:text-sm border border-ocnos-cyan/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-4 focus-visible:ring-ocnos-cyan focus-visible:outline-none shrink-0"
                    title="Explorar grafo de conceptos"
                  >
                    <span>🗺️</span>
                    <span>GRAFO</span>
                  </button>

                  {selectedNarrative.metadata.doi && (
                    <a
                      href={`https://doi.org/${selectedNarrative.metadata.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir artículo original en nueva pestaña (DOI: ${selectedNarrative.metadata.doi})`}
                      className="min-h-[46px] min-w-[46px] rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/50 transition-all flex items-center justify-center focus-visible:ring-4 focus-visible:ring-ocnos-cyan focus-visible:outline-none"
                      title="Ver artículo original (DOI)"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </article>

          {/* ============================================================ */}
          {/* PANEL DERECHO: GRID ROSTER AGRUPADO POR NÚMEROS (7 cols)   */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 text-xs text-on-surface-variant font-mono uppercase tracking-wider">
              <span>Organizado por Números // Total: {filteredNarrativas.length}</span>
              <span className="hidden sm:inline">Selecciona o haz clic para entrar</span>
            </div>

            {/* Listado / Grid de Artículos agrupados por Número */}
            <div 
              ref={rosterListRef}
              id="roster-grid"
              role="listbox"
              aria-label="Listado de artículos e investigadores de OCNOS agrupados por números"
              className="space-y-6 lg:max-h-[820px] lg:overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent"
            >
              {groupedArticles.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 shadow-sm">
                  <BookOpen size={42} className="mx-auto text-outline mb-3" aria-hidden="true" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface mb-2">
                    No se encontraron investigaciones
                  </h3>
                  <p className="text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
                    No hay artículos que coincidan con el término de búsqueda o la combinación de filtros aplicada.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIssue('todos');
                      setActiveFilter('todos');
                      setPlayableFilter('all');
                    }}
                    className="px-5 py-2.5 bg-ocnos-yellow text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-ocnos-yellow/90 transition-all shadow-md cursor-pointer"
                  >
                    Restablecer Filtros y Búsqueda
                  </button>
                </div>
              ) : (
                groupedArticles.map(({ issue, items }) => (
                  <div key={issue.id} className="space-y-3">
                    {/* Cabecera del Número / Volumen de Revista */}
                    <div className="sticky top-0 z-20 bg-[#f3fbfa]/95 backdrop-blur-md py-2 border-b border-outline-variant/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-ocnos-cyan text-sm" aria-hidden="true">📚</span>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-on-surface tracking-wide">
                          {issue.label}
                        </h3>
                        <span className="bg-palette-cyanLight text-ocnos-cyan text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-ocnos-cyan/30 font-bold">
                          {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-outline">{issue.year}</span>
                    </div>

                    {/* Cuadrícula de tarjetas de este número */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      {items.map((item) => {
                        const actualIndex = NARRATIVAS.findIndex(n => n.id === item.id);
                        const isSelected = actualIndex === selectedIndex;
                        const cardClass = NPC_CLASSES[item.id] || {
                          role: "Investigador/a",
                          tag: "General",
                          icon: "📖",
                          statImpact: 90,
                          statRigor: 90
                        };
                        const itemCromo = item.metadata?.image || '/assets/portadas/naturaleza_albumes.jpg';
                        const itemPlayable = isNarrativePlayable(item);

                        return (
                          <motion.div
                            key={item.id}
                            id={`roster-card-${item.id}`}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onClick={() => {
                              handleSelectCharacter(actualIndex);
                              handleLaunchNarrative(item.id);
                            }}
                            onMouseEnter={() => handleSelectCharacter(actualIndex, false)}
                            onKeyDown={(e) => handleKeyDownGrid(e, actualIndex, item)}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.015 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
                            className={`group relative rounded-2xl p-4 sm:p-4.5 transition-all duration-200 cursor-pointer border flex flex-col justify-between focus-visible:ring-4 focus-visible:ring-ocnos-cyan focus-visible:outline-none min-h-[140px] editorial-card ${
                              isSelected
                                ? 'card-active-sync -translate-y-0.5'
                                : 'bg-white hover:border-ocnos-cyan/70'
                            }`}
                          >
                            {/* Badges superiores: Selección Activa e Ícono de Advertencia de Jugabilidad */}
                            <div className="flex items-center justify-between w-full mb-1">
                              {isSelected ? (
                                <div className="bg-ocnos-cyan text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1" aria-hidden="true">
                                  <CheckCircle2 size={11} className="text-white" />
                                  ACTIVO
                                </div>
                              ) : <div />}

                              {/* ÍCONO ADVIRTIENDO SI SE PUEDE JUGAR O NO */}
                              <div>
                                {itemPlayable ? (
                                  <span 
                                    className="inline-flex items-center gap-1 bg-palette-greenLight text-ocnos-green font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-ocnos-green/30"
                                    title="Experiencia interactiva: Este artículo cuenta con minijuego jugable"
                                    aria-label="Minijuego interactivo disponible"
                                  >
                                    <Gamepad2 size={11} className="text-ocnos-green shrink-0 animate-pulse" aria-hidden="true" />
                                    <span>JUGABLE</span>
                                  </span>
                                ) : (
                                  <span 
                                    className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant font-medium text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-outline-variant/40"
                                    title="Modalidad: Lectura multicamino y mapa conceptual"
                                    aria-label="Modo lectura"
                                  >
                                    <BookOpen size={10} className="text-outline shrink-0" aria-hidden="true" />
                                    <span>LECTURA</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              {/* Miniatura de Cromo con indicador de portada */}
                              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-[#fdfbf7] border border-outline-variant/40 overflow-hidden flex items-center justify-center p-0.5">
                                <img
                                  src={itemCromo}
                                  alt=""
                                  aria-hidden="true"
                                  className="w-full h-full object-cover rounded-lg filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                              </div>

                              {/* Textos del Roster Card */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-ocnos-cyan mb-0.5">
                                  <span aria-hidden="true">{cardClass.icon}</span>
                                  <span className="truncate">{cardClass.role}</span>
                                </div>

                                <h4 className="font-serif text-sm sm:text-base font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-ocnos-cyan transition-colors">
                                  {item.metadata.title}
                                </h4>

                                <p className="text-xs text-on-surface-variant truncate mt-1">
                                  {item.metadata.authors}
                                </p>
                              </div>
                            </div>

                            {/* Barra inferior de la tarjeta */}
                            <div className="mt-3.5 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                              <span className="flex items-center gap-1">
                                <Clock size={13} className="text-ocnos-orange" aria-hidden="true" />
                                {item.metadata.duration}
                              </span>
                              <span className="text-ocnos-coral font-semibold text-[11px] uppercase tracking-wider bg-palette-coralLight px-2 py-0.5 rounded-md border border-ocnos-coral/20">
                                {cardClass.tag}
                              </span>
                              <span className="text-xs text-ocnos-cyan font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                                <span>Abrir</span>
                                <ChevronRight size={14} aria-hidden="true" />
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
