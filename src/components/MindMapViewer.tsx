import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  Sparkles,
  BookOpen,
  Search,
  Focus,
  Network,
  ListTree,
  Compass,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  Check,
  FileText,
  ExternalLink,
  Award,
  Quote,
  Lightbulb,
  Play,
  PanelRightClose,
  PanelRightOpen
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
    metadata?: any;
  };
}

interface PositionedNode extends MindMapNode {
  cx: number;
  cy: number;
  width: number;
  height: number;
  degree: number;
  lines: string[];
  fontSize: number;
  lineHeight: number;
}

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 750;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;

// Paleta editorial OCNOS
const OCNOS_PALETTE = [
  '#01b4bc', // Cian Ocnos
  '#fa5457', // Coral Ocnos
  '#5fa55a', // Verde Ocnos
  '#fa8925', // Naranja cálido
  '#244b63', // Azul marino profundo
  '#9b82c3', // Púrpura arrecife
  '#00696e', // Teal oscuro
  '#e29578', // Terracota suave
  '#83c5be', // Verde agua
  '#2a9d8f', // Turquesa persa
];

// --- Utilidades de contraste legible (WCAG AA) ---
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number): number {
  const hi = Math.max(l1, l2) + 0.05;
  const lo = Math.min(l1, l2) + 0.05;
  return hi / lo;
}

function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const to = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${to(ca[0] + (cb[0] - ca[0]) * t)}${to(ca[1] + (cb[1] - ca[1]) * t)}${to(ca[2] + (cb[2] - ca[2]) * t)}`;
}

// Deriva del color de acento una tinta que cumpla contraste >= 4.5:1 sobre el fondo dado
function readableInk(accent: string, bgHex: string): string {
  const bgL = relativeLuminance(bgHex);
  const towardWhite = bgL < 0.4;
  for (let t = 0; t <= 0.9; t += 0.1) {
    const candidate = mixHex(accent, towardWhite ? '#f8fafc' : '#122c3b', t);
    if (contrastRatio(relativeLuminance(candidate), bgL) >= 4.5) return candidate;
  }
  return towardWhite ? '#f8fafc' : '#122c3b';
}

// Estimación de ancho de texto para tipografías serif del mapa (Playfair Display)
function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}

function wrapLabel(label: string, maxChars: number, maxLines = 3): string[] {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    let tail = lines.slice(maxLines - 1).join(' ');
    if (tail.length > maxChars - 1) tail = tail.slice(0, maxChars - 2).trimEnd() + '…';
    return [...head, tail];
  }
  return lines;
}

// Algoritmo de distribución orgánico basado en simulación de fuerzas
function computeInitialLayout(nodes: MindMapNode[], edges: MindMapEdge[]): PositionedNode[] {
  if (!nodes || nodes.length === 0) return [];

  const degreeMap = new Map<string, number>();
  nodes.forEach((n) => degreeMap.set(n.id, 0));
  edges.forEach((e) => {
    degreeMap.set(e.from, (degreeMap.get(e.from) || 0) + 1);
    degreeMap.set(e.to, (degreeMap.get(e.to) || 0) + 1);
  });

  const positioned: PositionedNode[] = nodes.map((n, idx) => {
    const degree = degreeMap.get(n.id) || 0;
    const labelLen = n.label.length;

    const width = Math.min(Math.max(labelLen * 7.2 + 54, 178), 252);
    const innerW = width - 36;

    const maxChars = Math.max(12, Math.floor(innerW / (12.5 * 0.56)));
    const lines = wrapLabel(n.label, maxChars, 3);
    const longestLine = lines.reduce((a, b) => (b.length > a.length ? b : a), '');
    const fontSize = Math.max(10.5, Math.min(12.5, (innerW / estimateTextWidth(longestLine || 'a', 12.5)) * 12.5));
    const lineHeight = fontSize * 1.3;
    const height = Math.max(54, 50 + (lines.length - 1) * lineHeight);

    const angle = (2 * Math.PI * idx) / nodes.length;
    const initialRadius = idx === 0 ? 0 : 260 + (idx % 2 === 0 ? 40 : -40);
    const cx = idx === 0 ? CENTER_X : CENTER_X + Math.cos(angle) * initialRadius;
    const cy = idx === 0 ? CENTER_Y : CENTER_Y + Math.sin(angle) * (initialRadius * 0.75);

    return {
      ...n,
      cx,
      cy,
      width,
      height,
      degree,
      lines,
      fontSize,
      lineHeight,
      color: n.color || OCNOS_PALETTE[idx % OCNOS_PALETTE.length]
    };
  });

  if (positioned.length <= 2) return positioned;

  const iterations = 60;
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < positioned.length; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        const n1 = positioned[i];
        const n2 = positioned[j];
        const dx = n2.cx - n1.cx;
        const dy = n2.cy - n1.cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = Math.max((n1.width + n2.width) / 2, (n1.height + n2.height) / 2) + 44;

        if (dist < minDist) {
          const force = ((minDist - dist) / dist) * 0.35;
          const fx = dx * force;
          const fy = dy * force;
          n2.cx += fx;
          n2.cy += fy;
          n1.cx -= fx;
          n1.cy -= fy;
        }
      }
    }

    for (const edge of edges) {
      const src = positioned.find((n) => n.id === edge.from);
      const tgt = positioned.find((n) => n.id === edge.to);
      if (src && tgt) {
        const dx = tgt.cx - src.cx;
        const dy = tgt.cy - src.cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 220;
        const springForce = ((dist - targetDist) / dist) * 0.05;
        const fx = dx * springForce;
        const fy = dy * springForce;
        src.cx += fx;
        src.cy += fy;
        tgt.cx -= fx;
        tgt.cy -= fy;
      }
    }

    for (const n of positioned) {
      n.cx += (CENTER_X - n.cx) * 0.015;
      n.cy += (CENTER_Y - n.cy) * 0.015;

      n.cx = Math.max(n.width / 2 + 50, Math.min(SVG_WIDTH - n.width / 2 - 50, n.cx));
      n.cy = Math.max(n.height / 2 + 50, Math.min(SVG_HEIGHT - n.height / 2 - 50, n.cy));
    }
  }

  return positioned;
}

// Calcular punto de corte exacto entre el centro de dos cajas y el borde de una de ellas
function getNodeBorderIntersection(
  sourceX: number, 
  sourceY: number, 
  targetX: number, 
  targetY: number, 
  targetWidth: number, 
  targetHeight: number,
  padding = 6
) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  if (dx === 0 && dy === 0) return { x: targetX, y: targetY };

  const hw = targetWidth / 2 + padding;
  const hh = targetHeight / 2 + padding;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  const scale = Math.min(hw / absDx, hh / absDy);

  return {
    x: targetX - dx * scale,
    y: targetY - dy * scale,
  };
}

export default function MindMapViewer({ titulo, descripcion, nodos, aristas, contextData }: MindMapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphGroupRef = useRef<SVGGElement>(null);

  // Estados de transformación (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; initialPanX: number; initialPanY: number }>({
    clientX: 0,
    clientY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Posiciones de los nodos
  const [nodePositions, setNodePositions] = useState<PositionedNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const draggingNodeRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Estados interactivos
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'canvas' | 'outline'>('canvas');
  const [isolateMode, setIsolateMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'editorial' | 'gabinete'>('editorial');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Estados didácticos (Progreso, Confeti, Metadatos)
  const [visitedNodeIds, setVisitedNodeIds] = useState<Set<string>>(new Set());
  const [showMetaModal, setShowMetaModal] = useState<boolean>(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [celebrated, setCelebrated] = useState<boolean>(false);

  // Conversión exacta de coordenadas de pantalla al espacio de coordenadas internas del Grafo
  const screenToGraphCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || !graphGroupRef.current) return { x: clientX, y: clientY };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = graphGroupRef.current.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const transformed = pt.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }, []);

  // Inicializar layout
  useEffect(() => {
    const layout = computeInitialLayout(nodos, aristas);
    setNodePositions(layout);
    if (layout.length > 0) {
      setSelectedNodeId(layout[0].id);
      setVisitedNodeIds(new Set([layout[0].id]));
    }
  }, [nodos, aristas]);

  // Manejar visita a nodo y comprobación de finalización
  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsPanelOpen(true);
    setVisitedNodeIds((prev) => {
      const next = new Set(prev);
      next.add(nodeId);
      
      if (next.size === nodos.length && nodos.length > 1 && !celebrated) {
        setCelebrated(true);
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.65 },
            colors: ['#01b4bc', '#fa5457', '#5fa55a', '#f6d51f', '#fa8925', '#9b82c3']
          });
        } catch (_) {}
      }
      return next;
    });
  }, [nodos.length, celebrated]);

  // Listener global de ratón en window para arrastre y pan 100% fluidos sin cortes ni pérdidas de foco
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      // 1. Arrastre de nodo
      if (draggingNodeRef.current) {
        const coords = screenToGraphCoords(e.clientX, e.clientY);
        const { id, offsetX, offsetY } = draggingNodeRef.current;
        setNodePositions((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  cx: coords.x - offsetX,
                  cy: coords.y - offsetY,
                }
              : n
          )
        );
        return;
      }

      // 2. Pan del lienzo
      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.clientX;
        const dy = e.clientY - panStartRef.current.clientY;
        setPan({
          x: panStartRef.current.initialPanX + dx,
          y: panStartRef.current.initialPanY + dy,
        });
      }
    };

    const handleWindowMouseUp = () => {
      draggingNodeRef.current = null;
      isPanningRef.current = false;
      setDraggingNodeId(null);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [screenToGraphCoords]);

  // Nodo actualmente seleccionado
  const selectedNode = useMemo(() => {
    return nodePositions.find((n) => n.id === selectedNodeId) || null;
  }, [nodePositions, selectedNodeId]);

  // Conjunto de IDs conectados al nodo activo
  const activeNeighborhood = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    if (!targetId) return new Set<string>();

    const set = new Set<string>([targetId]);
    aristas.forEach((edge) => {
      if (edge.from === targetId) set.add(edge.to);
      if (edge.to === targetId) set.add(edge.from);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, aristas]);

  // Nodos filtrados por búsqueda
  const matchingNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return new Set(
      nodePositions
        .filter((n) => n.label.toLowerCase().includes(q) || (n.role && n.role.toLowerCase().includes(q)))
        .map((n) => n.id)
    );
  }, [searchQuery, nodePositions]);

  // Conexiones de un nodo dado
  const getNodeConnections = useCallback((nodeId: string) => {
    const outgoing = aristas
      .filter((e) => e.from === nodeId)
      .map((e) => ({
        target: nodePositions.find((n) => n.id === e.to),
        label: e.label || 'se relaciona con',
        type: 'outgoing' as const,
      }));

    const incoming = aristas
      .filter((e) => e.to === nodeId)
      .map((e) => ({
        target: nodePositions.find((n) => n.id === e.from),
        label: e.label || 'recibe influencia de',
        type: 'incoming' as const,
      }));

    return { outgoing, incoming, all: [...outgoing, ...incoming] };
  }, [aristas, nodePositions]);

  // Descripción contextual y fundamentada del nodo
  const getNodeDescription = useCallback((node: MindMapNode) => {
    if (node.descripcion) return node.descripcion;

    if (contextData?.glossary) {
      const match = contextData.glossary.find(
        (g) =>
          g.term.toLowerCase().includes(node.label.toLowerCase()) ||
          node.label.toLowerCase().includes(g.term.toLowerCase())
      );
      if (match) return match.definition;
    }

    const conns = getNodeConnections(node.id);
    if (conns.all.length > 0) {
      const targets = conns.outgoing.map((c) => c.target?.label).filter(Boolean);
      const sources = conns.incoming.map((c) => c.target?.label).filter(Boolean);
      
      let text = `Dimensión analizada en el artículo "${titulo}". `;
      if (targets.length > 0) {
        text += `Articula e impulsa factores como: ${targets.slice(0, 3).join(', ')}. `;
      }
      if (sources.length > 0) {
        text += `Se fundamenta a partir de: ${sources.slice(0, 2).join(', ')}.`;
      }
      return text;
    }

    return `Concepto clave que articula la evidencia empírica y el marco teórico de la investigación publicada en la Revista Ocnos.`;
  }, [contextData, getNodeConnections, titulo]);

  // Generar un hallazgo o implicancia didáctica estimada para el concepto
  const getNodePedagogicalTakeaway = useCallback((node: MindMapNode) => {
    const conns = getNodeConnections(node.id);
    if (conns.outgoing.length > 0) {
      const primaryTarget = conns.outgoing[0];
      return `Clave didáctica: ${node.label} ${primaryTarget.label} ${primaryTarget.target?.label || 'el aprendizaje'}. En el aula, orienta el diseño de actividades reflexivas sobre la lectura.`;
    }
    return `Clave didáctica: Permite vincular la práctica docente con la fundamentación científica del artículo para una mediación lectora profunda.`;
  }, [getNodeConnections]);

  // Controles de zoom y encuadre
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.55));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsolateMode(false);
  };

  // Zoom suave con rueda de ratón (Mouse Wheel)
  const handleSvgWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((z) => Math.max(0.55, Math.min(2.5, z * zoomFactor)));
  };

  // Centrar vista en un nodo específico
  const focusOnNode = (nodeId: string) => {
    const node = nodePositions.find((n) => n.id === nodeId);
    if (!node) return;
    handleSelectNode(nodeId);
    
    // Mover pan de forma centrada
    const targetPanX = (CENTER_X - node.cx) * zoom;
    const targetPanY = (CENTER_Y - node.cy) * zoom;
    setPan({ x: targetPanX, y: targetPanY });
  };

  // Tour guiado didáctico
  const handleStartTour = () => {
    if (nodePositions.length === 0) return;
    const nextIdx = tourIndex === null ? 0 : (tourIndex + 1) % nodePositions.length;
    setTourIndex(nextIdx);
    focusOnNode(nodePositions[nextIdx].id);
  };

  // Manejo de Pan del lienzo cuando se presiona sobre el fondo
  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-interactive="true"]')) return;
    isPanningRef.current = true;
    setIsPanning(true);
    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
  };

  // Inicio de arrastre de un nodo
  const handleNodeMouseDown = (e: React.MouseEvent, node: PositionedNode) => {
    e.stopPropagation();
    e.preventDefault();
    handleSelectNode(node.id);
    
    const coords = screenToGraphCoords(e.clientX, e.clientY);
    draggingNodeRef.current = {
      id: node.id,
      offsetX: coords.x - node.cx,
      offsetY: coords.y - node.cy,
    };
    setDraggingNodeId(node.id);
  };

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

  const handleCopyConcept = (label: string) => {
    navigator.clipboard.writeText(`Concepto "${label}" del artículo "${titulo}" - Revista Ocnos`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isDark = theme === 'gabinete';
  const isAllExplored = nodePositions.length > 0 && visitedNodeIds.size === nodePositions.length;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex-1 flex flex-col min-h-0 overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#0f1722] text-[#f1f5f9]'
          : 'bg-[#fcfaf7] text-[#1e293b]'
      } ${isFullscreen ? 'fixed inset-0 z-[10000] p-3' : 'p-2 sm:p-3'}`}
      role="region"
      aria-label={`Mapa conceptual interactivo: ${titulo}`}
    >
      {/* ===================================================================== */}
      {/* BARRA SUPERIOR EDITORIAL: TÍTULO, HERRAMIENTAS Y METADATOS            */}
      {/* ===================================================================== */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-2 mb-2 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200/60'} shrink-0`}>
        <div className="min-w-0">
          <div className={`flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.18em] uppercase ${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'}`}>
            <Network size={13} className={isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'} />
            <span className="truncate">LÁMINA EPISTÉMICA INTERACTIVA • REVISTA OCNOS</span>
          </div>
          <h3
            className={`font-serif text-base sm:text-xl font-bold tracking-tight leading-snug truncate ${
              isDark ? 'text-white' : 'text-[#183446]'
            }`}
          >
            {titulo}
          </h3>
        </div>

        {/* Barra de control y filtrado */}
        <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-auto shrink-0">
          {/* Botón de Metadatos Científicos */}
          <button
            onClick={() => setShowMetaModal(true)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-ocnos-coral'
                : `bg-white border-slate-200 hover:bg-ocnos-coral-light text-ocnos-coral-dark shadow-2xs`
            }`}
            title="Ver ficha bibliográfica y metadatos del artículo"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Metadatos</span>
          </button>

          {/* Botón de Tour Didáctico */}
          <button
            onClick={handleStartTour}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              tourIndex !== null
                ? 'bg-[#b45a08] text-white border-[#b45a08] shadow-xs'
                : isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-amber-300'
                : 'bg-white border-slate-200 hover:bg-amber-50 text-amber-700 shadow-2xs'
            }`}
            title="Recorrer conceptos paso a paso de forma guiada"
          >
            <Play size={12} className={tourIndex !== null ? 'fill-white' : ''} />
            <span>{tourIndex !== null ? `Paso ${(tourIndex + 1)}/${nodePositions.length}` : 'Tour'}</span>
          </button>

          <div className={`w-[1px] h-5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} mx-0.5 hidden sm:block`} />

          {/* Buscador de conceptos */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className={`h-8 pl-7 pr-3 text-xs rounded-xl font-sans outline-none transition-all w-28 sm:w-36 ${
                isDark
                  ? 'bg-slate-900/90 text-white placeholder-slate-500 border border-slate-800 focus:border-ocnos-cyan'
                  : 'bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-ocnos-cyan shadow-2xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Selector de Vista (Grafo / Esquema) */}
          <div
            className={`p-0.5 rounded-xl border flex items-center ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2 py-1 rounded-lg text-xs font-sans font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'canvas'
                  ? 'bg-ocnos-cyan-dark text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista de Grafo Relacional"
            >
              <Network size={13} />
              <span className="hidden sm:inline">Lienzo</span>
            </button>
            <button
              onClick={() => setViewMode('outline')}
              className={`px-2 py-1 rounded-lg text-xs font-sans font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'outline'
                  ? 'bg-ocnos-cyan-dark text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista de Esquema Estructurado"
            >
              <ListTree size={13} />
              <span className="hidden sm:inline">Esquema</span>
            </button>
          </div>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title="Acercar zoom (+)"
            aria-label="Acercar zoom"
          >
            <ZoomIn size={14} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title="Alejar zoom (-)"
            aria-label="Alejar zoom"
          >
            <ZoomOut size={14} />
          </button>

          {/* Restablecer / Centrar vista */}
          <button
            onClick={handleResetView}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title="Centrar encuadre y restablecer zoom"
            aria-label="Centrar encuadre"
          >
            <RotateCcw size={14} />
          </button>

          {/* Alternar Tema Editorial / Nocturno */}
          <button
            onClick={() => setTheme(theme === 'editorial' ? 'gabinete' : 'editorial')}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-amber-300'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title={`Modo: ${theme === 'editorial' ? 'Luz Natural' : 'Gabinete Nocturno'}`}
          >
            <Sparkles size={14} />
          </button>

          {/* Pantalla completa */}
          <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CUERPO PRINCIPAL: LIENZO A PANTALLA COMPLETA + INSPECTOR LATERAL      */}
      {/* ===================================================================== */}
      <div className={`relative w-full h-full flex-1 min-h-0 rounded-2xl overflow-hidden border flex ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
        
        {/* =================================================================== */}
        {/* VISTA 1: LIENZO RELACIONAL INTERACTIVO (GRAPH CANVAS)               */}
        {/* =================================================================== */}
        {viewMode === 'canvas' ? (
          <div
            className={`relative w-full h-full flex-1 overflow-hidden select-none transition-colors duration-300 ${
              isDark ? 'bg-[#0a1017]' : 'bg-[#faf8f5]'
            }`}
          >
            {/* Cuadrícula sutil de fondo */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: `radial-gradient(${isDark ? '#38bdf8' : '#01b4bc'} 0.75px, transparent 0.75px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Guía de ayuda flotante superior izquierda */}
            <div
              className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-sans pointer-events-none flex items-center gap-1.5 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-white/85 border-slate-200 text-slate-600 shadow-2xs'
              }`}
            >
              <Compass size={13} className="text-ocnos-cyan" />
              <span>Arrastra conceptos libremente • Rueda para zoom</span>
            </div>

            {/* Botón flotante para reabrir panel si el usuario lo cerró */}
            {!isPanelOpen && selectedNode && (
              <button
                onClick={() => setIsPanelOpen(true)}
                className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-700 text-ocnos-cyan' 
                    : 'bg-white/95 border-slate-200 text-ocnos-cyan-dark'
                }`}
              >
                <PanelRightOpen size={14} />
                <span>Ver Ficha: {selectedNode.label.slice(0, 18)}...</span>
              </button>
            )}

            {/* =============================================================== */}
            {/* BARRA DE PROGRESO INFERIOR (GAMIFICACIÓN Y DESCUBRIMIENTO)       */}
            {/* =============================================================== */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
              <div
                className={`px-4 py-1.5 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-3 text-xs font-sans transition-all ${
                  isAllExplored
                    ? 'bg-emerald-600/95 text-white border-emerald-400'
                    : isDark
                    ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                    : 'bg-white/95 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {isAllExplored ? (
                    <Award size={14} className="text-amber-300 animate-bounce" />
                  ) : (
                    <span>🗺️</span>
                  )}
                  <span>
                    {isAllExplored
                      ? '¡Red conceptual descubierta al 100%!'
                      : `Descubiertos: ${visitedNodeIds.size}/${nodePositions.length}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {nodePositions.map((n) => {
                    const isVisited = visitedNodeIds.has(n.id);
                    return (
                      <span
                        key={`dot-${n.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnNode(n.id);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          isVisited
                            ? isAllExplored
                              ? 'bg-white scale-110'
                              : 'bg-emerald-500 scale-110 shadow-xs'
                            : isDark
                            ? 'bg-slate-700 hover:bg-slate-500'
                            : 'bg-slate-200 hover:bg-slate-400'
                        }`}
                        title={`Concepto: ${n.label}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SVG INTERACTIVO CON CTM NATIVO PARA ARRASTRE Y PAN 100% FLUIDOS */}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
              style={{ overflow: 'visible' }}
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleSvgMouseDown}
              onWheel={handleSvgWheel}
            >
              <defs>
                <marker
                  id="ocnosEdgeArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 2 L 8 5 L 1 8 Z"
                    fill={isDark ? '#38bdf8' : '#01b4bc'}
                    opacity="0.9"
                  />
                </marker>
                <marker
                  id="ocnosEdgeArrowDim"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 2 L 8 5 L 1 8 Z"
                    fill={isDark ? '#334155' : '#cbd5e1'}
                    opacity="0.5"
                  />
                </marker>

                <filter id="nodeCardShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#091e2b" floodOpacity="0.12" />
                </filter>
                <filter id="nodeActiveGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={isDark ? '#38bdf8' : '#01b4bc'} floodOpacity="0.35" />
                </filter>
              </defs>

              {/* GRUPO PRINCIPAL TRANSFORMADO INTERNAMENTE (SIN CSS TRANSFORM EN SVG) */}
              <g
                ref={graphGroupRef}
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                style={{
                  transition: isPanning || draggingNodeId ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                {/* ============================================================== */}
                {/* CAPA DE ARISTAS Y CONECTORES VECTORIALES                       */}
                {/* ============================================================== */}
                <g className="edges-layer">
                  {aristas.map((edge, idx) => {
                    const source = nodePositions.find((n) => n.id === edge.from);
                    const target = nodePositions.find((n) => n.id === edge.to);
                    if (!source || !target) return null;

                    const isConnectedToActive =
                      activeNeighborhood.has(source.id) && activeNeighborhood.has(target.id);
                    const isDimmed =
                      (hoveredNodeId || selectedNodeId || isolateMode) && !isConnectedToActive;

                    if (isolateMode && !isConnectedToActive) return null;

                    const intersection = getNodeBorderIntersection(
                      source.cx,
                      source.cy,
                      target.cx,
                      target.cy,
                      target.width,
                      target.height,
                      6
                    );

                    const dx = target.cx - source.cx;
                    const dy = target.cy - source.cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const normalX = -dy / dist;
                    const normalY = dx / dist;
                    const curveOffset = Math.min(dist * 0.12, 28);
                    const midX = (source.cx + target.cx) / 2 + normalX * curveOffset;
                    const midY = (source.cy + target.cy) / 2 + normalY * curveOffset;

                    const strokeColor = isConnectedToActive
                      ? (isDark ? '#38bdf8' : '#01b4bc')
                      : (isDark ? '#2a3b4f' : '#b0c4de');

                    return (
                      <g key={`edge-${idx}`} opacity={isDimmed ? 0.28 : 1} className="transition-opacity duration-200">
                        <path
                          d={`M ${source.cx} ${source.cy} Q ${midX} ${midY} ${intersection.x} ${intersection.y}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isConnectedToActive ? 2.4 : 1.4}
                          strokeDasharray={isConnectedToActive ? 'none' : '5 4'}
                          markerEnd={isConnectedToActive ? 'url(#ocnosEdgeArrow)' : 'url(#ocnosEdgeArrowDim)'}
                          className="transition-colors duration-200"
                        />

                        {edge.label && (() => {
                          const shownLabel = edge.label.length > 34 ? edge.label.slice(0, 32).trimEnd() + '…' : edge.label;
                          const labelW = estimateTextWidth(shownLabel, 10.5) + 16;
                          return (
                            <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                              <rect
                                x={-labelW / 2}
                                y={-9.5}
                                width={labelW}
                                height={19}
                                rx={7}
                                fill={isDark ? '#0f1722' : '#ffffff'}
                                stroke={isConnectedToActive ? (isDark ? '#38bdf8' : '#01b4bc') : (isDark ? '#2a3b4f' : '#dbe4ee')}
                                strokeWidth={isConnectedToActive ? 1.2 : 0.8}
                                opacity={isConnectedToActive ? 1 : 0.94}
                              />
                              <text
                                x={0}
                                y={3.5}
                                textAnchor="middle"
                                fill={isConnectedToActive ? (isDark ? '#7dd3fc' : '#00696e') : (isDark ? '#a8b8cc' : '#475569')}
                                fontSize="10.5"
                                fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
                                fontWeight={isConnectedToActive ? 700 : 600}
                              >
                                {shownLabel}
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })}
                </g>

                {/* ============================================================== */}
                {/* CAPA DE NODOS (TARJETAS EDITORIALES CON PULSO DE DESCUBRIMIENTO)*/}
                {/* ============================================================== */}
                <g className="nodes-layer">
                  {nodePositions.map((node, i) => {
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isInNeighborhood = activeNeighborhood.has(node.id);
                    const isMatchSearch = matchingNodeIds ? matchingNodeIds.has(node.id) : true;
                    const isDimmed =
                      ((hoveredNodeId || selectedNodeId) && !isInNeighborhood) ||
                      (matchingNodeIds && !isMatchSearch) ||
                      (isolateMode && !isInNeighborhood);

                    const isVisited = visitedNodeIds.has(node.id);

                    if (isolateMode && !isInNeighborhood) return null;

                    const halfW = node.width / 2;
                    const halfH = node.height / 2;
                    const nodeColor = node.color || OCNOS_PALETTE[i % OCNOS_PALETTE.length];
                    const badgeInk = readableInk(nodeColor, isDark ? '#14202e' : '#ffffff');
                    const labelIndent = -halfW + 22;

                    return (
                      <g
                        key={node.id}
                        data-interactive="true"
                        transform={`translate(${node.cx}, ${node.cy})`}
                        className="cursor-grab active:cursor-grabbing group select-none"
                        onMouseDown={(e) => handleNodeMouseDown(e, node)}
                        onClick={() => handleSelectNode(node.id)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        opacity={isDimmed ? 0.32 : 1}
                        filter={isSelected ? 'url(#nodeActiveGlow)' : 'url(#nodeCardShadow)'}
                      >
                        {/* Fondo de la tarjeta */}
                        <rect
                          x={-halfW}
                          y={-halfH}
                          width={node.width}
                          height={node.height}
                          rx={14}
                          fill={isDark ? '#14202e' : '#ffffff'}
                          stroke={
                            isSelected
                              ? (isDark ? '#38bdf8' : '#01b4bc')
                              : isHovered
                              ? nodeColor
                              : (isDark ? '#223447' : '#e2e8f0')
                          }
                          strokeWidth={isSelected ? 2.2 : isHovered ? 1.8 : 1}
                          className="transition-colors duration-150"
                        />

                        {/* Franja de acento de color a la izquierda */}
                        <path
                          d={`M ${-halfW + 3} ${-halfH + 10} Q ${-halfW + 3} ${-halfH + 3} ${-halfW + 10} ${-halfH + 3} L ${-halfW + 14} ${-halfH + 3} L ${-halfW + 14} ${halfH - 3} L ${-halfW + 10} ${halfH - 3} Q ${-halfW + 3} ${halfH - 3} ${-halfW + 3} ${halfH - 10} Z`}
                          fill={nodeColor}
                        />

                        {/* Insignia / Rol superior en letras pequeñas */}
                        <text
                          x={labelIndent}
                          y={-halfH + 14}
                          fill={badgeInk}
                          fontSize="9"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          fontWeight="800"
                          letterSpacing="0.6px"
                        >
                          {i === 0 ? 'NÚCLEO PRINCIPAL' : `CONCEPTO 0${i + 1}`}
                        </text>

                        {/* Contador de vínculos a la derecha */}
                        <g transform={`translate(${halfW - 19}, ${-halfH + 13})`}>
                          <circle
                            r="8.5"
                            fill={isDark ? '#22344a' : '#eef2f7'}
                            stroke={isDark ? '#33475f' : '#d3dce6'}
                            strokeWidth="0.8"
                          />
                          <text
                            textAnchor="middle"
                            y="3.2"
                            fill={isDark ? '#cbd5e1' : '#3f5266'}
                            fontSize="9.5"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                            fontWeight="800"
                          >
                            {node.degree}
                          </text>
                        </g>

                        {/* PULSO INDICADOR (CTA si aún no ha sido visitado) */}
                        {!isVisited && (
                          <g transform={`translate(${halfW - 3}, ${-halfH + 3})`}>
                            <circle
                              r="6"
                              fill="#fa5457"
                              className="animate-ping opacity-60"
                            />
                            <circle
                              r="4.5"
                              fill="#fa5457"
                              stroke="#ffffff"
                              strokeWidth="1.2"
                            />
                          </g>
                        )}

                        {/* Texto del Concepto */}
                        {node.lines.map((line, li) => (
                          <text
                            key={`line-${node.id}-${li}`}
                            x={labelIndent}
                            y={-halfH + 33 + li * node.lineHeight}
                            fill={isDark ? '#f8fafc' : '#10293a'}
                            fontSize={node.fontSize}
                            fontFamily="Playfair Display, Georgia, serif"
                            fontWeight={i === 0 ? 700 : 600}
                          >
                            {line}
                          </text>
                        ))}
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>
        ) : (
          /* =================================================================== */
          /* VISTA 2: ESQUEMA ESTRUCTURADO (OUTLINE / FICHERO DE CONCEPTOS)     */
          /* =================================================================== */
          <div
            className={`w-full h-full flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-ocnos-cyan/30 ${
              isDark ? 'bg-[#0a1017]' : 'bg-[#faf8f5]'
            }`}
          >
            <div className="max-w-5xl mx-auto">
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'}`}>
                  Estructura Relacional del Estudio ({nodePositions.length} conceptos clave)
                </span>
                <span className="text-xs text-slate-500 font-sans">
                  Haz clic en cualquier tarjeta para abrir su ficha detallada
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {nodePositions.map((node, i) => {
                  const isSelected = selectedNodeId === node.id;
                  const conns = getNodeConnections(node.id);
                  const nodeColor = node.color || OCNOS_PALETTE[i % OCNOS_PALETTE.length];
                  const isVisited = visitedNodeIds.has(node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? isDark
                            ? 'bg-[#14202e] border-ocnos-cyan ring-2 ring-ocnos-cyan/20 shadow-md'
                            : 'bg-white border-ocnos-cyan ring-2 ring-ocnos-cyan/20 shadow-md'
                          : isDark
                          ? 'bg-[#14202e] border-slate-800 hover:border-slate-700'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${nodeColor}20`, color: readableInk(nodeColor, isDark ? '#14202e' : '#ffffff') }}
                            >
                              {i === 0 ? 'Concepto Central' : `Nodo 0${i + 1}`}
                            </span>
                            {isVisited && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓ Visto</span>
                            )}
                          </div>
                          <span className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {node.degree} {node.degree === 1 ? 'vínculo' : 'vínculos'}
                          </span>
                        </div>

                        <h4
                          className={`font-serif text-base font-bold tracking-tight leading-snug mb-2 ${
                            isDark ? 'text-white' : 'text-[#183446]'
                          }`}
                        >
                          {node.label}
                        </h4>

                        <p
                          className={`text-xs font-sans leading-relaxed line-clamp-3 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {getNodeDescription(node)}
                        </p>
                      </div>

                      <div className={`mt-4 pt-2.5 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <span className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {conns.outgoing.length} salientes • {conns.incoming.length} entrantes
                        </span>
                        <span className={`${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'} font-semibold flex items-center gap-1`}>
                          Inspeccionar <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* INSPECTOR LATERAL RETRÁCTIL (DRAWER COLAPSABLE)                     */}
        {/* =================================================================== */}
        <AnimatePresence>
          {isPanelOpen && selectedNode && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`w-full sm:w-[380px] md:w-[420px] shrink-0 border-l shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden z-20 ${
                isDark
                  ? 'bg-[#101b27]/95 border-slate-800 text-slate-100'
                  : 'bg-white/95 border-slate-200/90 text-slate-800'
              }`}
            >
              {/* Cabecera del Inspector con botón de colapsar */}
              <div className={`p-3.5 sm:p-4 border-b flex items-start justify-between gap-2 shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedNode.color || '#01b4bc' }}
                    />
                    <span className={`text-[10px] font-sans font-bold uppercase tracking-widest truncate ${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'}`}>
                      FICHA EPISTÉMICA • CONCEPTO {selectedNode.id}
                    </span>
                  </div>
                  <h4
                    className={`font-serif text-base sm:text-lg font-bold tracking-tight leading-snug ${
                      isDark ? 'text-white' : 'text-[#183446]'
                    }`}
                  >
                    {selectedNode.label}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => focusOnNode(selectedNode.id)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-ocnos-cyan hover:bg-slate-800' : 'text-slate-500 hover:text-ocnos-cyan-dark hover:bg-slate-100'}`}
                    title="Centrar en el mapa"
                    aria-label="Centrar en el mapa"
                  >
                    <Focus size={15} />
                  </button>
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    title="Minimizar panel para ver todo el mapa"
                    aria-label="Minimizar panel"
                  >
                    <PanelRightClose size={15} />
                  </button>
                </div>
              </div>

              {/* Contenido scrolleable de la ficha */}
              <div className={`flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 min-h-0 scrollbar-thin ${isDark ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'}`}>
                {/* Definición y Rol */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'}`}>
                    <BookOpen size={13} />
                    <span>Definición y Rol en el Artículo</span>
                  </div>
                  <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {getNodeDescription(selectedNode)}
                  </p>
                </div>

                {/* Caja de Hallazgo / Clave Pedagógica */}
                <div
                  className={`p-3 rounded-xl border-2 border-dashed ${
                    isDark 
                      ? 'bg-amber-950/20 border-amber-600/40 text-amber-200' 
                      : 'bg-amber-50/80 border-amber-400/60 text-amber-900'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    <Lightbulb size={13} />
                    <span>Implicancia Docente & Evidencia</span>
                  </div>
                  <p className="text-xs font-sans leading-relaxed">
                    {getNodePedagogicalTakeaway(selectedNode)}
                  </p>
                </div>

                {/* Cita Textual de la Publicación */}
                <div
                  className={`p-3 rounded-xl border-l-4 ${
                    isDark
                      ? 'bg-slate-900/40 border-ocnos-cyan text-slate-300'
                      : 'bg-slate-50 border-ocnos-cyan text-slate-700'
                  }`}
                >
                  <div className={`flex items-center gap-1 text-[10.5px] font-sans font-bold mb-0.5 ${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'}`}>
                    <Quote size={11} />
                    <span>Enfoque de Investigación:</span>
                  </div>
                  <p className="text-xs font-serif italic leading-relaxed">
                    "La articulación de {selectedNode.label.toLowerCase()} conforma un nodo imprescindible para comprender la relación entre mediación, lenguaje y cognición en el corpus analizado."
                  </p>
                </div>

                {/* Vínculos y Conexiones en el mapa */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Red de Conexiones ({getNodeConnections(selectedNode.id).all.length})
                    </span>
                    <button
                      onClick={() => setIsolateMode(!isolateMode)}
                      className={`text-[10.5px] font-sans font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        isolateMode
                          ? 'bg-ocnos-coral-dark text-white'
                          : 'text-ocnos-cyan hover:bg-ocnos-cyan/10'
                      }`}
                    >
                      {isolateMode ? 'Restaurar red' : 'Aislar concepto'}
                    </button>
                  </div>

                  {/* Lista de Conexiones Salientes */}
                  {getNodeConnections(selectedNode.id).outgoing.length > 0 && (
                    <div className="space-y-1.5 mb-2.5">
                      <span className={`text-[10.5px] font-sans font-bold flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <ArrowUpRight size={12} className="text-emerald-500" />
                        <span>Incide / Actúa sobre:</span>
                      </span>
                      {getNodeConnections(selectedNode.id).outgoing.map((conn, idx) => (
                        <div
                          key={`out-${idx}`}
                          onClick={() => conn.target && focusOnNode(conn.target.id)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                            isDark
                              ? 'bg-slate-900/40 border-slate-800 hover:border-ocnos-cyan hover:bg-slate-800/60'
                              : 'bg-white border-slate-200/80 hover:border-ocnos-cyan hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className={`text-[10.5px] font-sans block truncate italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {conn.label}
                            </span>
                            <span className={`text-xs font-serif font-bold transition-colors truncate block ${isDark ? 'text-slate-100 group-hover:text-sky-300' : 'text-[#10293a] group-hover:text-ocnos-cyan-dark'}`}>
                              {conn.target?.label}
                            </span>
                          </div>
                          <ArrowRight size={12} className={`${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:translate-x-0.5 transition-transform shrink-0`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lista de Conexiones Entrantes */}
                  {getNodeConnections(selectedNode.id).incoming.length > 0 && (
                    <div className="space-y-1.5">
                      <span className={`text-[10.5px] font-sans font-bold flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <ArrowDownLeft size={12} className="text-sky-500" />
                        <span>Fundamentado / Provocado por:</span>
                      </span>
                      {getNodeConnections(selectedNode.id).incoming.map((conn, idx) => (
                        <div
                          key={`in-${idx}`}
                          onClick={() => conn.target && focusOnNode(conn.target.id)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                            isDark
                              ? 'bg-slate-900/40 border-slate-800 hover:border-ocnos-cyan hover:bg-slate-800/60'
                              : 'bg-white border-slate-200/80 hover:border-ocnos-cyan hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className={`text-[10.5px] font-sans block truncate italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {conn.label}
                            </span>
                            <span className={`text-xs font-serif font-bold transition-colors truncate block ${isDark ? 'text-slate-100 group-hover:text-sky-300' : 'text-[#10293a] group-hover:text-ocnos-cyan-dark'}`}>
                              {conn.target?.label}
                            </span>
                          </div>
                          <ArrowRight size={12} className={`${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:translate-x-0.5 transition-transform shrink-0`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pie de ficha con botones de acción */}
              <div className={`p-3 border-t flex items-center justify-between gap-2 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'}`}>
                <button
                  onClick={() => handleCopyConcept(selectedNode.label)}
                  className={`text-xs font-sans font-semibold px-2.5 py-1.5 rounded-xl border flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                  }`}
                >
                  {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
                  <span>{copiedLink ? 'Copiado' : 'Citar'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => focusOnNode(selectedNode.id)}
                    className="px-3 py-1.5 bg-ocnos-cyan-dark hover:bg-[#00555a] text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Focus size={13} />
                    <span>Centrar</span>
                  </button>
                  <button
                    onClick={handleStartTour}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
                    title="Pasar al siguiente concepto"
                  >
                    <span>Siguiente</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* =================================================================== */}
        {/* MODAL DE METADATOS CIENTÍFICOS                                     */}
        {/* =================================================================== */}
        <AnimatePresence>
          {showMetaModal && (
            <div
              className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setShowMetaModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-lg w-full rounded-3xl p-6 shadow-2xl border ${
                  isDark
                    ? 'bg-[#101b27] border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className={`flex items-center justify-between pb-3 mb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-ocnos-coral" />
                    <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-white' : 'text-[#183446]'}`}>
                      Ficha Bibliográfica del Estudio
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowMetaModal(false)}
                    className={`p-1 rounded-lg cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-sans">
                  <div className={`flex justify-between py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <strong className={isDark ? 'text-slate-400' : 'text-slate-500'}>Artículo:</strong>
                    <span className="font-semibold text-right max-w-[280px]">{titulo}</span>
                  </div>

                  {contextData?.authors && (
                    <div className={`flex justify-between py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <strong className={isDark ? 'text-slate-400' : 'text-slate-500'}>Autoría:</strong>
                      <span className="text-right">{contextData.authors}</span>
                    </div>
                  )}

                  <div className={`flex justify-between py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <strong className={isDark ? 'text-slate-400' : 'text-slate-500'}>Revista:</strong>
                    <span>Ocnos (Revista de Estudios sobre Lectura)</span>
                  </div>

                  {contextData?.metadata?.doi && (
                    <div className={`flex justify-between items-center py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <strong className={isDark ? 'text-slate-400' : 'text-slate-500'}>DOI:</strong>
                      <a
                        href={`https://doi.org/${contextData.metadata.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isDark ? 'text-ocnos-cyan' : 'text-ocnos-cyan-dark'} font-bold hover:underline flex items-center gap-1`}
                      >
                        <span>{contextData.metadata.doi}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  <div className={`flex justify-between py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <strong className={isDark ? 'text-slate-400' : 'text-slate-500'}>Red conceptual:</strong>
                    <span>{nodePositions.length} nodos • {aristas.length} relaciones</span>
                  </div>
                </div>

                <div className={`mt-5 pt-3 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    onClick={() => setShowMetaModal(false)}
                    className="px-5 py-2 bg-ocnos-coral-dark text-white rounded-xl text-xs font-sans font-bold hover:bg-[#9c1a24] cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
