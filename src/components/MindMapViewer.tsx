import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Info, 
  Layers, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  Sparkles,
  BookOpen,
  Palette
} from 'lucide-react';
import type { MindMapNode, MindMapEdge } from '../types/narrative';

interface MindMapViewerProps {
  titulo: string;
  descripcion: string;
  nodos: MindMapNode[];
  aristas: MindMapEdge[];
  contextData?: {
    glossary?: Array<{ term: string; definition: string }>;
    authors?: string;
  };
}

const SVG_WIDTH = 980;
const SVG_HEIGHT = 680;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;

// ============================================================================
// SET DE ICONOS GRABADOS VECTORIALES (VINTAGE ENGRAVINGS)
// Inspirados en los camafeos del ejemplo de Virginia Woolf (Genially)
// ============================================================================

export const EngravedIcons = {
  // Pluma de ave y tintero (Obras, Creación, Escritura)
  quill: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 3L7.5 14.5l-2.5 5 5-2.5L21.5 5.5a2.12 2.12 0 0 0-2.5-2.5z" />
      <path d="M14 6l4 4" />
      <path d="M4 21l3-1.5" />
      <circle cx="5.5" cy="19.5" r="0.8" fill="currentColor" />
      <path d="M16 4l-4 4" strokeDasharray="1 1" />
      <path d="M18 6l-4 4" strokeDasharray="1 1" />
    </svg>
  ),

  // Ojo analítico con grabado circular (Documental, Mirada Crítica, Análisis)
  eye: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 5.5V3M12 21v-2.5M6 7.5L4.5 6M19.5 6L18 7.5M6 16.5L4.5 18M19.5 18L18 16.5" strokeDasharray="1 1" />
      <path d="M9 12a3 3 0 0 1 3-3" strokeWidth="1.2" />
    </svg>
  ),

  // Mariposa / Polilla con grabado simétrico (Influencias, Metáfora, Semiótica)
  moth: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4v16" strokeWidth="1.8" />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <path d="M12 7c-4-4-9-2-9 4 0 5 7 5 9 1" />
      <path d="M12 7c4-4 9-2 9 4 0 5-7 5-9 1" />
      <path d="M12 12c-3 1-6 4-6 7 0 1 2 2 6-1" />
      <path d="M12 12c3 1 6 4 6 7 0 1-2 2-6-1" />
      <path d="M10 2l2 2 2-2" />
      <path d="M6 10c2 0 4-1 6-1M18 10c-2 0-4-1-6-1" strokeDasharray="1 1" />
    </svg>
  ),

  // Camafeo con busto clásico victoriano (Biografía, Sujetos, Maestras, Autores)
  cameo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="12" rx="9" ry="10" />
      <path d="M12 7a3 3 0 0 1 2.8 4c-.2.8-.8 1.5-1.3 2v1.5h-3v-1.5c-.5-.5-1.1-1.2-1.3-2A3 3 0 0 1 12 7z" />
      <path d="M8.5 18c.8-1.5 2-2.5 3.5-2.5s2.7 1 3.5 2.5" />
      <path d="M12 3v1M12 20v1M4 12h1M19 12h1" strokeDasharray="1 1" />
    </svg>
  ),

  // Libro clásico encuadernado (Marco Teórico, Literatura Infantil, Álbum)
  book: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 6h8M8 10h8M8 14h5" strokeDasharray="1.5 1.5" strokeWidth="1.2" />
      <path d="M12 2v5l2-1 2 1V2" fill="currentColor" opacity="0.3" />
    </svg>
  ),

  // Balanza clásica o Ética (Valores prosociales, Dilemas, Equidad)
  scale: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18M8 21h8" strokeWidth="1.8" />
      <path d="M5 7l7-2 7 2" />
      <path d="M2 13l3-6 3 6c0 1.7-1.3 3-3 3s-3-1.3-3-3z" />
      <path d="M16 13l3-6 3 6c0 1.7-1.3 3-3 3s-3-1.3-3-3z" />
    </svg>
  ),

  // Brújula / Rosa de los Vientos (Metodología, Exploración, Navegación)
  compass: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="12 4 14.5 10 12 12 9.5 10 12 4" fill="currentColor" opacity="0.4" />
      <polygon points="12 20 14.5 14 12 12 9.5 14 12 20" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),

  // Laurel / Rama Botánica (Estética, Diversidad, Crecimiento)
  botanical: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22C12 12 19 4 19 4S13 8 12 14c-1-6-7-10-7-10s7 8 7 8" />
      <path d="M12 15c-3-2-5 0-5 0s1 3 5 0M12 18c3-2 5 0 5 0s-1 3-5 0" />
    </svg>
  )
};

// Asignador inteligente de icono según término o posición
function getNodeIcon(label: string, index: number) {
  const l = label.toLowerCase();
  if (l.includes('obra') || l.includes('escrit') || l.includes('taller') || l.includes('texto')) return EngravedIcons.quill;
  if (l.includes('ojo') || l.includes('documen') || l.includes('crític') || l.includes('visual') || l.includes('análisis') || l.includes('estudio')) return EngravedIcons.eye;
  if (l.includes('influen') || l.includes('semiót') || l.includes('imagen') || l.includes('metáfor')) return EngravedIcons.moth;
  if (l.includes('biograf') || l.includes('maestr') || l.includes('docente') || l.includes('infantil') || l.includes('sujeto') || l.includes('autor')) return EngravedIcons.cameo;
  if (l.includes('libro') || l.includes('álbum') || l.includes('teor') || l.includes('lectura') || l.includes('liter')) return EngravedIcons.book;
  if (l.includes('valor') || l.includes('empat') || l.includes('moral') || l.includes('filosof') || l.includes('ético') || l.includes('dilema')) return EngravedIcons.scale;
  if (l.includes('diversidad') || l.includes('estétic') || l.includes('arte') || l.includes('emoción')) return EngravedIcons.botanical;
  
  const iconList = [
    EngravedIcons.book,
    EngravedIcons.scale,
    EngravedIcons.botanical,
    EngravedIcons.moth,
    EngravedIcons.eye,
    EngravedIcons.quill,
    EngravedIcons.cameo,
    EngravedIcons.compass
  ];
  return iconList[index % iconList.length];
}

// Disposición de nodos con espaciado orgánico y holgado
function layoutNodes(nodos: MindMapNode[]): (MindMapNode & { cx: number; cy: number })[] {
  const count = nodos.length;

  return nodos.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) {
      return {
        ...n,
        cx: n.x * SVG_WIDTH,
        cy: n.y * SVG_HEIGHT,
      };
    }

    // Nodo central
    if (i === 0) {
      return {
        ...n,
        cx: CENTER_X,
        cy: CENTER_Y - 10,
      };
    }

    // Distribución en 2 anillos orbitales alternados para evitar solapes de insignias anchas
    const ring = i % 2 === 0 ? 1 : 2;
    const radius = ring === 1 ? 270 : 210;
    // Rotación angular suave
    const angleStep = (2 * Math.PI) / (count - 1);
    const angle = (i - 1) * angleStep - Math.PI / 2 + (ring === 1 ? 0.25 : -0.2);

    // Ajustar límites de seguridad dentro del marco
    const rawX = CENTER_X + radius * Math.cos(angle);
    const rawY = CENTER_Y + (radius * 0.82) * Math.sin(angle);

    const safeX = Math.max(130, Math.min(SVG_WIDTH - 130, rawX));
    const safeY = Math.max(100, Math.min(SVG_HEIGHT - 90, rawY));

    return {
      ...n,
      cx: safeX,
      cy: safeY,
    };
  });
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function MindMapViewer({ titulo, descripcion, nodos, aristas, contextData }: MindMapViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados de transformación (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Estados interactivos
  const [selectedNode, setSelectedNode] = useState<(MindMapNode & { cx: number; cy: number }) | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'cards'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Selector de tema estético: 'gabinete' (Virginia Woolf) | 'academico' (Infografía)
  const [theme, setTheme] = useState<'gabinete' | 'academico'>('gabinete');

  const laidNodes = useMemo(() => layoutNodes(nodos), [nodos]);

  // Controles de zoom
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.65));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag & Pan ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement && e.target.closest('[data-node="true"]')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Drag & Pan táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Pantalla completa
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Conexiones de un nodo
  const getNodeConnections = (nodeId: string) => {
    const outgoing = aristas
      .filter((e) => e.from === nodeId)
      .map((e) => ({
        target: laidNodes.find((n) => n.id === e.to),
        label: e.label || 'se relaciona con',
        type: 'outgoing' as const
      }));

    const incoming = aristas
      .filter((e) => e.to === nodeId)
      .map((e) => ({
        target: laidNodes.find((n) => n.id === e.from),
        label: e.label || 'vinculado desde',
        type: 'incoming' as const
      }));

    return [...outgoing, ...incoming];
  };

  // Descripción contextual
  const getNodeDescription = (label: string) => {
    if (contextData?.glossary) {
      const match = contextData.glossary.find(
        (g) => g.term.toLowerCase().includes(label.toLowerCase()) || label.toLowerCase().includes(g.term.toLowerCase())
      );
      if (match) return match.definition;
    }
    return `Dimensión fundamental analizada en la investigación. Articula aspectos teóricos y metodológicos clave en el corpus de estudio publicado por la Revista Ocnos.`;
  };

  const isDark = theme === 'gabinete';

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-[#181016] text-[#F3EBE1] border border-[#d4af37]/30' 
          : 'bg-[#FBF9F4] text-[#1E293B] border border-[#2a5a75]/25'
      } ${
        isFullscreen ? 'p-4 sm:p-6 fixed inset-0 z-[10000] rounded-none' : 'p-3 sm:p-6'
      }`}
      role="region"
      aria-label={`Mapa conceptual interactivo: ${titulo}`}
    >
      {/* ===================================================================== */}
      {/* CABECERA EDITORIAL OCNOS (ESTILO LITOGRAFÍA / GABINETE)               */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#c5a059]/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif font-bold tracking-[0.2em] uppercase mb-1">
            <Sparkles size={14} className={isDark ? 'text-[#e5c07b]' : 'text-[#c5a059]'} />
            <span className={isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'}>LÁMINA CONCEPTUAL INTERACTIVA • OCNOS</span>
          </div>
          <h3 className={`font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight ${
            isDark ? 'text-[#FAF5ED]' : 'text-[#1E293B]'
          }`}>
            {titulo}
          </h3>
          <p className={`text-xs sm:text-sm max-w-3xl mt-1.5 font-serif italic ${
            isDark ? 'text-[#F3EBE1]/75' : 'text-[#475569]'
          }`}>
            {descripcion}
          </p>
        </div>

        {/* Barra de herramientas estética */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border shrink-0 backdrop-blur-md self-start md:self-auto ${
          isDark 
            ? 'bg-[#100a0e]/80 border-[#d4af37]/25 text-[#FAF5ED]' 
            : 'bg-white/85 border-[#2a5a75]/20 text-[#1E293B] shadow-sm'
        }`}>
          {/* Alternar Tema */}
          <button
            onClick={() => setTheme(theme === 'gabinete' ? 'academico' : 'gabinete')}
            className="p-2 rounded-xl hover:bg-[#c5a059]/20 transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-serif"
            title={`Cambiar a estilo ${theme === 'gabinete' ? 'Infografía Clara' : 'Gabinete Literario'}`}
          >
            <Palette size={16} className={isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'} />
            <span className="hidden lg:inline text-[11px] uppercase tracking-wider font-semibold">
              {theme === 'gabinete' ? 'Gabinete' : 'Infografía'}
            </span>
          </button>

          <div className="w-[1px] h-5 bg-[#c5a059]/30 mx-0.5" />

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl hover:bg-[#c5a059]/20 transition-colors cursor-pointer"
            title="Acercar (+)"
            aria-label="Acercar zoom"
          >
            <ZoomIn size={17} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl hover:bg-[#c5a059]/20 transition-colors cursor-pointer"
            title="Alejar (-)"
            aria-label="Alejar zoom"
          >
            <ZoomOut size={17} />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl hover:bg-[#c5a059]/20 transition-colors cursor-pointer"
            title="Restablecer encuadre"
            aria-label="Centrar mapa"
          >
            <RotateCcw size={16} />
          </button>

          <div className="w-[1px] h-5 bg-[#c5a059]/30 mx-0.5" />

          {/* Modo Tarjetas / Lienzo */}
          <button
            onClick={() => setViewMode(viewMode === 'canvas' ? 'cards' : 'canvas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards' 
                ? (isDark ? 'bg-[#e5c07b] text-[#181016]' : 'bg-[#2a5a75] text-white shadow-sm')
                : 'hover:bg-[#c5a059]/20'
            }`}
            title="Alternar entre lienzo ilustrado y cuaderno de notas"
          >
            <Layers size={15} />
            <span className="hidden sm:inline">{viewMode === 'canvas' ? 'Cuaderno' : 'Lámina'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-[#c5a059]/20 transition-colors cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VISTA 1: LIENZO INTERACTIVO ILUSTRADO (ESTILO GENIALLY VIRGINIA WOOLF) */}
      {/* ===================================================================== */}
      {viewMode === 'canvas' ? (
        <div 
          className={`relative w-full h-[520px] sm:h-[600px] md:h-[640px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors duration-300 ${
            isDark 
              ? 'bg-[#150d13] border-2 border-[#d4af37]/35 shadow-inner' 
              : 'bg-[#FAF6EE] border-2 border-[#2a5a75]/25 shadow-inner'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Textura sutil de fondo y viñeta editorial */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(${isDark ? '#d4af37' : '#2a5a75'} 0.8px, transparent 0.8px)`,
              backgroundSize: '28px 28px'
            }}
          />

          {/* Viñeta radial oscura para darle profundidad fotográfica clásica */}
          <div 
            className={`absolute inset-0 pointer-events-none ${
              isDark 
                ? 'bg-radial-vignette opacity-80' 
                : 'opacity-10'
            }`}
            style={{
              background: isDark 
                ? 'radial-gradient(circle at center, transparent 40%, rgba(14,8,12,0.85) 100%)'
                : 'radial-gradient(circle at center, transparent 60%, rgba(42,90,117,0.15) 100%)'
            }}
          />

          {/* Guía de interacción sutil en esquina */}
          <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-serif tracking-wide pointer-events-none flex items-center gap-2 ${
            isDark 
              ? 'bg-[#100a0e]/80 border-[#d4af37]/30 text-[#e5c07b]' 
              : 'bg-white/80 border-[#2a5a75]/20 text-[#2a5a75] shadow-sm'
          }`}>
            <Sparkles size={13} className={isDark ? 'text-[#e5c07b]' : 'text-[#c5a059]'} />
            <span>Haz clic sobre los medallones para abrir el dossier</span>
          </div>

          {/* SVG INTERACTIVO */}
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full h-full"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.22s ease-out'
            }}
          >
            <defs>
              {/* Filtro de sombra suave para camafeos */}
              <filter id="camafeoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
              </filter>
              <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Flecha caligráfica clásica */}
              <marker 
                id="classicArrow" 
                viewBox="0 0 12 12" 
                refX="22" 
                refY="6" 
                markerWidth="7" 
                markerHeight="7" 
                orient="auto-start-reverse"
              >
                <path 
                  d="M 1 2 L 10 6 L 1 10 C 3 7 3 5 1 2 Z" 
                  fill={isDark ? '#e5c07b' : '#2a5a75'} 
                  opacity="0.85" 
                />
              </marker>
            </defs>

            {/* ================================================================ */}
            {/* MARCO EDITORIAL CON ORLAS Y FILIGRANAS (TIPO VIRGINIA WOOLF)     */}
            {/* ================================================================ */}
            <g className="pointer-events-none" opacity={isDark ? 0.75 : 0.45}>
              {/* Filete exterior fino */}
              <rect 
                x="24" 
                y="24" 
                width={SVG_WIDTH - 48} 
                height={SVG_HEIGHT - 48} 
                rx="18" 
                fill="none" 
                stroke={isDark ? '#d4af37' : '#2a5a75'} 
                strokeWidth="1.2" 
              />
              {/* Filete interior concéntrico */}
              <rect 
                x="32" 
                y="32" 
                width={SVG_WIDTH - 64} 
                height={SVG_HEIGHT - 64} 
                rx="12" 
                fill="none" 
                stroke={isDark ? '#c5a059' : '#2a5a75'} 
                strokeWidth="0.8" 
                strokeDasharray="4 3" 
                opacity="0.6" 
              />

              {/* Florón / Filigrana Ornamental Superior Central */}
              <g transform={`translate(${CENTER_X}, 24)`} stroke={isDark ? '#e5c07b' : '#2a5a75'} fill="none">
                <path d="M -80 -1 L -35 -1" strokeWidth="1" />
                <path d="M 35 -1 L 80 -1" strokeWidth="1" />
                {/* Volutas centrales */}
                <path d="M -30 -1 C -20 -8 -10 6 0 0 C 10 6 20 -8 30 -1" strokeWidth="1.2" />
                <path d="M -15 -1 C -10 -12 0 -12 0 0 C 0 -12 10 -12 15 -1" strokeWidth="1.2" />
                <circle cx="-25" cy="-1" r="2.5" fill={isDark ? '#e5c07b' : '#2a5a75'} />
                <circle cx="25" cy="-1" r="2.5" fill={isDark ? '#e5c07b' : '#2a5a75'} />
                <circle cx="0" cy="-6" r="3" fill={isDark ? '#e5c07b' : '#2a5a75'} />
              </g>

              {/* Florón / Filigrana Ornamental Inferior Central */}
              <g transform={`translate(${CENTER_X}, ${SVG_HEIGHT - 24}) scale(1, -1)`} stroke={isDark ? '#e5c07b' : '#2a5a75'} fill="none">
                <path d="M -80 -1 L -35 -1" strokeWidth="1" />
                <path d="M 35 -1 L 80 -1" strokeWidth="1" />
                <path d="M -30 -1 C -20 -8 -10 6 0 0 C 10 6 20 -8 30 -1" strokeWidth="1.2" />
                <path d="M -15 -1 C -10 -12 0 -12 0 0 C 0 -12 10 -12 15 -1" strokeWidth="1.2" />
                <circle cx="-25" cy="-1" r="2.5" fill={isDark ? '#e5c07b' : '#2a5a75'} />
                <circle cx="25" cy="-1" r="2.5" fill={isDark ? '#e5c07b' : '#2a5a75'} />
                <circle cx="0" cy="-6" r="3" fill={isDark ? '#e5c07b' : '#2a5a75'} />
              </g>

              {/* Esquineros Ornamentales */}
              {/* Superior Izquierdo */}
              <path d="M 34 50 C 34 38 38 34 50 34" stroke={isDark ? '#e5c07b' : '#2a5a75'} strokeWidth="1.2" />
              {/* Superior Derecho */}
              <path d={`M ${SVG_WIDTH - 34} 50 C ${SVG_WIDTH - 34} 38 ${SVG_WIDTH - 38} 34 ${SVG_WIDTH - 50} 34`} stroke={isDark ? '#e5c07b' : '#2a5a75'} strokeWidth="1.2" />
              {/* Inferior Izquierdo */}
              <path d={`M 34 ${SVG_HEIGHT - 50} C 34 ${SVG_HEIGHT - 38} 38 ${SVG_HEIGHT - 34} 50 ${SVG_HEIGHT - 34}`} stroke={isDark ? '#e5c07b' : '#2a5a75'} strokeWidth="1.2" />
              {/* Inferior Derecho */}
              <path d={`M ${SVG_WIDTH - 34} ${SVG_HEIGHT - 50} C ${SVG_WIDTH - 34} ${SVG_HEIGHT - 38} ${SVG_WIDTH - 38} ${SVG_HEIGHT - 34} ${SVG_WIDTH - 50} ${SVG_HEIGHT - 34}`} stroke={isDark ? '#e5c07b' : '#2a5a75'} strokeWidth="1.2" />
            </g>

            {/* ================================================================ */}
            {/* ARISTAS Y CONEXIONES CALIGRÁFICAS                                */}
            {/* ================================================================ */}
            {aristas.map((e, idx) => {
              const from = laidNodes.find((n) => n.id === e.from);
              const to = laidNodes.find((n) => n.id === e.to);
              if (!from || !to) return null;

              const isHighlighted = 
                hoveredNodeId === from.id || 
                hoveredNodeId === to.id ||
                selectedNode?.id === from.id ||
                selectedNode?.id === to.id;

              const midX = (from.cx + to.cx) / 2;
              const midY = (from.cy + to.cy) / 2 - 20;

              // Color de línea según tema y estado
              const strokeColor = isHighlighted 
                ? (isDark ? '#e5c07b' : '#2a5a75')
                : (isDark ? '#9e8460' : '#88a8ba');

              return (
                <g key={`edge-${idx}`} className="transition-all duration-300">
                  <path
                    d={`M ${from.cx} ${from.cy} Q ${midX} ${midY} ${to.cx} ${to.cy}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.6 : 1.4}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                    opacity={isHighlighted ? 1 : 0.65}
                    markerEnd="url(#classicArrow)"
                    className="transition-colors duration-300"
                  />

                  {/* Cartela / Cinta con la relación explicativa */}
                  {e.label && (
                    <g 
                      transform={`translate(${midX}, ${midY})`}
                      className="transition-opacity duration-300 pointer-events-none"
                    >
                      {/* Fondo de cartela en pergamino / papel */}
                      <rect
                        x={-Math.min(e.label.length * 3.3 + 8, 120)}
                        y={-9}
                        width={Math.min(e.label.length * 6.6 + 16, 240)}
                        height={18}
                        rx={5}
                        fill={isDark ? '#20161e' : '#FAF6EE'}
                        stroke={isHighlighted ? (isDark ? '#e5c07b' : '#2a5a75') : (isDark ? '#c5a059' : '#88a8ba')}
                        strokeWidth={1}
                        opacity={0.95}
                        filter={isHighlighted ? 'url(#goldGlow)' : undefined}
                      />
                      <text
                        x={0}
                        y={3}
                        textAnchor="middle"
                        fill={isHighlighted ? (isDark ? '#FAF5ED' : '#1E293B') : (isDark ? '#e5c07b' : '#475569')}
                        fontSize="9.5"
                        fontFamily="Playfair Display, Georgia, serif"
                        fontStyle="italic"
                        fontWeight="600"
                      >
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ================================================================ */}
            {/* NODOS: PINS TIPO PÍLDORA Y MEDALLONES GRABADOS (ESTILO VIRGINIA) */}
            {/* ================================================================ */}
            {laidNodes.map((n, i) => {
              const isSelected = selectedNode?.id === n.id;
              const isHovered = hoveredNodeId === n.id;
              const isCentral = i === 0;
              const IconComponent = getNodeIcon(n.label, i);

              // Dimensiones de la cápsula
              const pillHeight = isCentral ? 44 : 36;
              const medallionRadius = isCentral ? 22 : 18;
              const labelLength = n.label.length;
              const textWidth = Math.min(Math.max(labelLength * 7.5, 70), 160);
              const pillWidth = textWidth + medallionRadius * 2 + 18;

              // Paleta de colores del nodo (Estilo Pergamino Antiguo / Granate)
              const pillBg = isDark
                ? (isSelected ? '#F8F3EA' : isHovered ? '#F0E7D8' : '#E9DFC9')
                : (isSelected ? '#2A5A75' : isHovered ? '#356D8C' : '#FAF6EE');
              
              const textColor = isDark
                ? '#20141C'
                : (isSelected || isHovered ? '#FAF6EE' : '#1E293B');

              const medallionBorder = isDark 
                ? (isSelected ? '#B8860B' : '#C5A059')
                : (isSelected ? '#FAF6EE' : '#2A5A75');

              return (
                <g
                  key={n.id}
                  data-node="true"
                  transform={`translate(${n.cx}, ${n.cy})`}
                  className="cursor-pointer group select-none"
                  onClick={() => setSelectedNode(n)}
                  onMouseEnter={() => setHoveredNodeId(n.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Concepto: ${n.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNode(n);
                    }
                  }}
                >
                  {/* Halo de pulsación respiratorio y suave en oro viejo */}
                  <circle
                    r={medallionRadius + 10}
                    cx={-pillWidth / 2 + medallionRadius + 3}
                    cy={0}
                    fill={isDark ? '#d4af37' : '#2a5a75'}
                    opacity={isSelected ? 0.4 : isHovered ? 0.3 : 0.15}
                    className={prefersReducedMotion ? '' : 'animate-ping origin-center'}
                    style={{ 
                      animationDuration: isSelected ? '2.4s' : '3.8s',
                      animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' 
                    }}
                  />

                  {/* CÁPSULA / PÍLDORA PRINCIPAL ESTILO GENIALLY */}
                  <g filter="url(#camafeoShadow)" className="transition-transform duration-200 group-hover:scale-[1.03]">
                    {/* Fondo redondeado de la pastilla */}
                    <rect
                      x={-pillWidth / 2}
                      y={-pillHeight / 2}
                      width={pillWidth}
                      height={pillHeight}
                      rx={pillHeight / 2}
                      fill={pillBg}
                      stroke={medallionBorder}
                      strokeWidth={isSelected ? 2 : 1.2}
                      className="transition-colors duration-200"
                    />

                    {/* Texto del Concepto */}
                    <text
                      x={-pillWidth / 2 + medallionRadius * 2 + 10}
                      y={4}
                      fill={textColor}
                      fontSize={isCentral ? 13 : 11.5}
                      fontFamily="Playfair Display, Georgia, serif"
                      fontWeight={isCentral ? '700' : '600'}
                      letterSpacing="0.2px"
                    >
                      {n.label.length > 22 ? `${n.label.substring(0, 20)}...` : n.label}
                    </text>

                    {/* CAMAFEO / MEDALLÓN CIRCULAR ENGARZADO */}
                    <g transform={`translate(${-pillWidth / 2 + medallionRadius + 3}, 0)`}>
                      {/* Borde exterior del medallón */}
                      <circle
                        r={medallionRadius}
                        fill={isDark ? '#23161F' : '#FFFFFF'}
                        stroke={medallionBorder}
                        strokeWidth={1.4}
                      />
                      {/* Aro interior con punteado ornamental de orfebrería */}
                      <circle
                        r={medallionRadius - 2.8}
                        fill="none"
                        stroke={isDark ? '#C5A059' : '#88A8BA'}
                        strokeWidth={0.8}
                        strokeDasharray="2 1.5"
                        opacity={0.8}
                      />

                      {/* Icono Grabado Clásico incrustado en el camafeo */}
                      <g 
                        transform={`translate(-${medallionRadius - 6}, -${medallionRadius - 6})`}
                        className={isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'}
                      >
                        <IconComponent width={(medallionRadius - 6) * 2} height={(medallionRadius - 6) * 2} />
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* ===================================================================== */
        /* VISTA 2: CUADERNO DE NOTAS EDITORIAL (FICHERO DE CONCEPTOS)          */
        /* ===================================================================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c5a059]/40">
          {laidNodes.map((n, i) => {
            const connections = getNodeConnections(n.id);
            const IconComponent = getNodeIcon(n.label, i);
            const isCentral = i === 0;

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between group ${
                  isDark 
                    ? 'bg-[#1e131b] hover:bg-[#281a25] border-[#d4af37]/25 hover:border-[#d4af37] shadow-lg' 
                    : 'bg-white hover:bg-[#FAF6EE] border-[#2a5a75]/20 hover:border-[#2a5a75] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                        isDark 
                          ? 'bg-[#281a25] border-[#d4af37]/40 text-[#e5c07b]' 
                          : 'bg-[#FAF6EE] border-[#2a5a75]/30 text-[#2a5a75]'
                      }`}>
                        <IconComponent width={18} height={18} />
                      </div>
                      <span className={`text-[11px] font-serif uppercase tracking-widest font-bold ${
                        isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                      }`}>
                        {isCentral ? 'Núcleo Central' : `Concepto 0${i + 1}`}
                      </span>
                    </div>
                  </div>

                  <h4 className={`font-serif text-lg font-bold tracking-tight transition-colors ${
                    isDark ? 'text-[#FAF5ED] group-hover:text-[#e5c07b]' : 'text-[#1E293B] group-hover:text-[#2a5a75]'
                  }`}>
                    {n.label}
                  </h4>

                  <p className={`text-xs mt-2.5 line-clamp-3 font-serif leading-relaxed ${
                    isDark ? 'text-[#F3EBE1]/75' : 'text-[#475569]'
                  }`}>
                    {getNodeDescription(n.label)}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#c5a059]/20 flex items-center justify-between text-xs font-serif">
                  <span className={isDark ? 'text-[#F3EBE1]/60' : 'text-[#64748B]'}>
                    {connections.length} {connections.length === 1 ? 'vínculo' : 'vínculos'}
                  </span>
                  <span className={`font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform ${
                    isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                  }`}>
                    <span>Abrir ficha</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* DOSSIER / FICHA INTERACTIVA EDITORIAL (VENTANA MODAL TIPO GENIALLY)   */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedNode && (
          <div 
            className="fixed inset-0 z-[10001] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedNode(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-concept-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full sm:max-w-2xl border-t sm:border-2 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c5a059]/50 ${
                isDark 
                  ? 'bg-gradient-to-b from-[#241721] to-[#170e15] border-[#d4af37]/40 text-[#F3EBE1]' 
                  : 'bg-gradient-to-b from-[#FFFDF9] to-[#F7F3EB] border-[#2a5a75]/30 text-[#1E293B]'
              }`}
            >
              {/* Orla superior del dossier */}
              <div className="flex items-center justify-between pb-4 border-b border-[#c5a059]/30 mb-5">
                <div className="flex items-center gap-3">
                  {/* Camafeo grande con halo */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-inner shrink-0 ${
                    isDark 
                      ? 'bg-[#181016] border-[#d4af37] text-[#e5c07b]' 
                      : 'bg-white border-[#2a5a75] text-[#2a5a75]'
                  }`}>
                    {React.createElement(
                      getNodeIcon(selectedNode.label, laidNodes.findIndex((n) => n.id === selectedNode.id)),
                      { width: 28, height: 28 }
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.2em] ${
                      isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                    }`}>
                      FICHA CONCEPTUAL • ESTUDIO OCNOS
                    </span>
                    <h3 id="modal-concept-title" className={`font-serif text-xl sm:text-2xl font-bold tracking-tight leading-tight ${
                      isDark ? 'text-[#FAF5ED]' : 'text-[#1E293B]'
                    }`}>
                      {selectedNode.label}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors cursor-pointer border ${
                    isDark 
                      ? 'bg-[#100a0e]/60 border-[#d4af37]/20 hover:bg-[#d4af37]/20 text-[#FAF5ED]' 
                      : 'bg-white border-[#2a5a75]/20 hover:bg-[#2a5a75]/10 text-[#1E293B]'
                  }`}
                  aria-label="Cerrar ficha interactiva"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Fundamentación Teórica / Metodológica */}
              <div className={`p-5 rounded-2xl border mb-6 ${
                isDark 
                  ? 'bg-[#120910]/70 border-[#d4af37]/25 text-[#F3EBE1]' 
                  : 'bg-white/80 border-[#2a5a75]/15 text-[#334155]'
              }`}>
                <div className={`flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider mb-2.5 ${
                  isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                }`}>
                  <BookOpen size={14} />
                  <span>Definición y Rol en el Modelo Teórico</span>
                </div>
                <p className="font-serif text-sm sm:text-base leading-relaxed italic">
                  "{getNodeDescription(selectedNode.label)}"
                </p>
              </div>

              {/* Red de Vínculos del Modelo Conceptual */}
              <div className="mb-6">
                <h5 className={`text-xs font-serif font-bold uppercase tracking-widest mb-3.5 flex items-center gap-2 ${
                  isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                }`}>
                  <Info size={14} />
                  <span>Vínculos Epistémicos en el Artículo ({getNodeConnections(selectedNode.id).length}):</span>
                </h5>

                <div className="space-y-2.5">
                  {getNodeConnections(selectedNode.id).map((conn, cIdx) => (
                    <div 
                      key={cIdx}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isDark 
                          ? 'bg-[#1a1018] border-[#c5a059]/20 hover:border-[#e5c07b]/50' 
                          : 'bg-white border-[#2a5a75]/15 hover:border-[#2a5a75]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-serif italic ${
                          isDark ? 'text-[#e5c07b]' : 'text-[#c5a059]'
                        }`}>
                          {conn.label}:
                        </span>
                        <span className={`text-xs sm:text-sm font-serif font-bold ${
                          isDark ? 'text-[#FAF5ED]' : 'text-[#1E293B]'
                        }`}>
                          {conn.target?.label}
                        </span>
                      </div>

                      <button
                        onClick={() => conn.target && setSelectedNode(conn.target)}
                        className={`text-xs font-serif font-bold flex items-center gap-1 hover:underline cursor-pointer self-end sm:self-auto ${
                          isDark ? 'text-[#e5c07b]' : 'text-[#2a5a75]'
                        }`}
                      >
                        <span>Examinar concepto</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie de Ficha con botón de retorno */}
              <div className="flex items-center justify-between pt-4 border-t border-[#c5a059]/25">
                <span className={`text-xs font-serif italic ${
                  isDark ? 'text-[#F3EBE1]/60' : 'text-[#64748B]'
                }`}>
                  Publicación científica arbitrada • Ocnos
                </span>

                <button
                  onClick={() => setSelectedNode(null)}
                  className={`min-h-[44px] px-6 py-2.5 rounded-xl font-serif font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
                    isDark 
                      ? 'bg-[#e5c07b] text-[#181016] hover:bg-[#d4af37]' 
                      : 'bg-[#2a5a75] text-white hover:bg-[#1f455d]'
                  }`}
                >
                  Volver a la Lámina
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
