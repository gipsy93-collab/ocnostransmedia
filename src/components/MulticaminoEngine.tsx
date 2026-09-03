import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Award, 
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Download,
  Search,
  ChevronDown,
  Brain,
  Copy,
  Check,
  FileText,
  Lightbulb,
  PanelRightClose,
  PanelRightOpen,
  GraduationCap,
  Microscope,
  HelpCircle,
  Layers
} from 'lucide-react';
import { Narrative, BlockId, IMRyD_INDEX } from '../types/narrative';
import DetectivesLanding from '../pages/detectives/DetectivesLanding';
import { useChatStore } from '../store/chatStore';

// Bloques interactivos especializados
import JuegoBlock from './blocks/JuegoBlock';
import MapaBlock from './blocks/MapaBlock';
import DeepDives from './blocks/DeepDives';

interface Props {
  narrative: Narrative;
  onBack: () => void;
  initialBlock?: BlockId;
}

export default function MulticaminoEngine({ narrative, onBack, initialBlock }: Props) {
  const [currentBlock, setCurrentBlock] = useState<BlockId>(initialBlock || 'apertura');
  const [history, setHistory] = useState<BlockId[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [openDeepDives, setOpenDeepDives] = useState<string[]>([]);
  const [completedBlocks, setCompletedBlocks] = useState<string[]>(['apertura']);
  const [selectedGame, setSelectedGame] = useState<'snake' | 'quiz' | 'piramide' | null>(null);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [openGlossary, setOpenGlossary] = useState<number | null>(0);
  const [openDetail, setOpenDetail] = useState<number | null>(0);
  const [openMarcoDetail, setOpenMarcoDetail] = useState<number | null>(0);
  const [openHallazgo, setOpenHallazgo] = useState<number | null>(0);
  const [openCognitiva, setOpenCognitiva] = useState<number | null>(0);
  const [openEscritura, setOpenEscritura] = useState<number | null>(0);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [userSidebarToggle, setUserSidebarToggle] = useState<boolean | null>(null);
  const [isMobileTutorOpen, setIsMobileTutorOpen] = useState<boolean>(false);
  const [openEvidences, setOpenEvidences] = useState<number[]>([0]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const { setArticle, clearArticle, open: openChat } = useChatStore();

  useEffect(() => {
    setArticle(narrative.id, narrative.metadata.title);
    return () => clearArticle();
  }, [narrative.id, narrative.metadata.title, setArticle, clearArticle]);

  useEffect(() => {
    if (initialBlock) {
      setCurrentBlock(initialBlock);
    }
  }, [initialBlock]);

  // Construir la secuencia visible exacta de fases IMRyD para este artículo
  const visibleBlocks = useMemo<BlockId[]>(() => {
    const blocks: BlockId[] = ['apertura', 'conflicto', 'viaje', 'revelacion', 'marco', 'nucleo'];
    if (narrative?.blocks?.implicancias) {
      blocks.push('implicancias');
    }
    if (narrative?.blocks?.juegos && narrative.blocks.juegos.length > 0) {
      blocks.push('juego');
    }
    if (narrative?.mapa || narrative?.blocks?.mapa) {
      blocks.push('mapa');
    }
    blocks.push('reflexion');
    return blocks;
  }, [narrative]);

  const currentIndex = visibleBlocks.indexOf(currentBlock);
  const currentBlockInfo = IMRyD_INDEX.find(i => i.id === currentBlock) || {
    id: currentBlock,
    label: currentBlock === 'reflexion' ? 'Reflexión' : currentBlock === 'implicancias' ? 'Implicancias' : 'Fase',
    icon: currentBlock === 'reflexion' ? '✨' : currentBlock === 'implicancias' ? '🏛️' : '📖'
  };
  const progressPercent = Math.round(((currentIndex + 1) / visibleBlocks.length) * 100);

  // Espacio completo: ocultar sidebar automáticamente en juego o mapa para no encajonar
  const isImmersiveBlock = currentBlock === 'juego' || currentBlock === 'mapa';
  const showSidebar = userSidebarToggle !== null ? userSidebarToggle : !isImmersiveBlock;

  // Navegación hacia adelante
  const navigateTo = useCallback((block: BlockId) => {
    setHistory(prev => [...prev, currentBlock]);
    setCurrentBlock(block);
    setActiveBranch(null);
    if (!completedBlocks.includes(block)) {
      setCompletedBlocks(prev => [...prev, block]);
    }
  }, [currentBlock, completedBlocks]);

  // Navegación hacia atrás limpia (sin bucles en el historial)
  const navigateBackward = useCallback(() => {
    if (currentIndex > 0) {
      const prev = visibleBlocks[currentIndex - 1];
      setCurrentBlock(prev);
      setActiveBranch(null);
    } else {
      if (history.length > 0) {
        const prev = history[history.length - 1];
        setHistory(h => h.slice(0, -1));
        setCurrentBlock(prev);
      } else {
        onBack();
      }
    }
  }, [currentIndex, visibleBlocks, history, onBack]);

  const navigateForward = useCallback(() => {
    const next = currentIndex + 1;
    if (next < visibleBlocks.length) {
      navigateTo(visibleBlocks[next]);
    }
  }, [currentIndex, visibleBlocks, navigateTo]);

  // Atajos de teclado del motor narrativo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === 'INPUT' || 
        activeEl?.tagName === 'TEXTAREA' || 
        (activeEl as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        navigateForward();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        navigateBackward();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      } else if (e.key === 'g' || e.key === 'G') {
        if (visibleBlocks.includes('mapa')) {
          e.preventDefault();
          navigateTo('mapa');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateForward, navigateBackward, onBack, navigateTo, visibleBlocks]);

  // Scroll to top en cambio de fase
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentBlock]);

  // Auto-scroll del botón activo en la barra superior IMRyD
  useEffect(() => {
    if (navContainerRef.current) {
      const activeBtn = navContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentBlock]);

  const toggleDeepDive = (id: string) => {
    setOpenDeepDives(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const copyCitation = () => {
    const citation = narrative.blocks?.nucleo?.formalRef || 
      `${narrative.metadata.authors} (${narrative.metadata.year}). ${narrative.metadata.title}. ${narrative.metadata.journal}. https://doi.org/${narrative.metadata.doi}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    });
  };

  // Descarga de ficha completa de estudio y reflexiones en Markdown
  const handleDownloadFicha = () => {
    const questions = narrative.blocks?.reflexion?.questions || [];
    let content = `# FICHA DE INVESTIGACIÓN Y LECTURA - REVISTA OCNOS\n\n`;
    content += `**Título:** ${narrative.metadata.title}\n`;
    content += `**Autores:** ${narrative.metadata.authors}\n`;
    content += `**Revista:** ${narrative.metadata.journal} (${narrative.metadata.year})\n`;
    content += `**DOI Oficial:** https://doi.org/${narrative.metadata.doi}\n`;
    content += `**Metodología:** ${narrative.metadata.depth || 'Estudio Empírico'}\n\n`;
    content += `---\n\n`;
    content += `## 1. SÍNTESIS Y CONCLUSIÓN CIENTÍFICA\n\n`;
    if (narrative.blocks?.nucleo?.pregunta) {
      content += `**Pregunta de investigación:** ${narrative.blocks.nucleo.pregunta}\n\n`;
    }
    if (narrative.blocks?.nucleo?.conclusion) {
      content += `**Veredicto concluyente:** ${narrative.blocks.nucleo.conclusion}\n\n`;
    }
    content += `---\n\n`;
    content += `## 2. EVALUACIÓN Y REFLEXIONES DE ASIMILACIÓN\n\n`;
    questions.forEach((q: any, idx: number) => {
      content += `### Pregunta ${idx + 1}: ${q.q}\n`;
      if (q.type === 'choice' && q.options) {
        const userChoice = answers[idx] !== undefined ? q.options[answers[idx]] : 'No respondida';
        const isCorrect = answers[idx] === q.correct;
        content += `- **Tu respuesta:** ${userChoice} (${isCorrect ? 'Correcta' : 'A revisar'})\n`;
        content += `- **Opción correcta:** ${q.options[q.correct]}\n\n`;
      } else {
        content += `*Respuesta abierta completada en la sesión interactiva.*\n\n`;
      }
    });
    content += `---\n`;
    content += `Referencia formal: ${narrative.blocks?.nucleo?.formalRef || narrative.metadata.title}\n`;
    content += `Revista Ocnos Transmedia (https://ocnos.uclm.es)\n`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_ocnos_${narrative.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Texto contextual del tutor investigador para la fase activa
  const tutorText = narrative?.tutorTexts && narrative.tutorTexts[currentBlock]?.text 
    ? narrative.tutorTexts[currentBlock]?.text 
    : (narrative.metadata.gancho || "¡Observa las tensiones teóricas y los hallazgos empíricos clave de este estudio!");

  // Lista dinámica y 100% auténtica de evidencias extraídas del propio artículo
  const dynamicEvidenceList = useMemo(() => {
    const list = [
      {
        category: "Marco 01 · Contexto",
        badge: narrative.metadata.journal || "Ocnos",
        color: "bg-ocnos-green/15 text-ocnos-green",
        content: narrative.blocks?.apertura?.contexto || narrative.metadata.title,
      },
      {
        category: "Muestra 02 · Informantes y Corpus",
        badge: narrative.blocks?.viaje?.detalles?.[0]?.label || "Muestra",
        color: "bg-ocnos-cyan/15 text-ocnos-cyan",
        content: narrative.blocks?.viaje?.detalles?.[0]?.value || `Estudio empírico liderado por ${narrative.metadata.authors}.`,
      },
      {
        category: "Técnica 03 · Metodología",
        badge: narrative.blocks?.viaje?.detalles?.[1]?.label || narrative.metadata.depth || "Enfoque Mixto",
        color: "bg-ocnos-orange/15 text-ocnos-orange",
        content: narrative.blocks?.viaje?.detalles?.[1]?.value || narrative.blocks?.viaje?.narrativa || "Metodología rigurosa del estudio.",
      },
      {
        category: "Tensión 04 · Problema Central",
        badge: "Relevancia Social",
        color: "bg-ocnos-coral/15 text-ocnos-coral",
        content: narrative.blocks?.conflicto?.porQueImporta || narrative.blocks?.conflicto?.problema || "Tensión central y preguntas clave.",
      }
    ];

    // Hallazgos empíricos reales desglosados como flashcards
    if (narrative.blocks?.revelacion?.hallazgos && narrative.blocks.revelacion.hallazgos.length > 0) {
      narrative.blocks.revelacion.hallazgos.forEach((h: any, idx: number) => {
        list.push({
          category: `Hallazgo 0${5 + idx} · Evidencia`,
          badge: h.label.length > 22 ? h.label.slice(0, 22) + '...' : h.label,
          color: "bg-ocnos-yellow/30 text-[#826a00]",
          content: h.value,
        });
      });
    } else if (narrative.blocks?.nucleo?.conclusion) {
      list.push({
        category: "Conclusión 05 · Núcleo",
        badge: "Veredicto",
        color: "bg-ocnos-yellow/30 text-[#826a00]",
        content: narrative.blocks.nucleo.conclusion,
      });
    }

    return list;
  }, [narrative]);

  const toggleEvidence = (index: number) => {
    setOpenEvidences(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleAllEvidences = () => {
    if (openEvidences.length === dynamicEvidenceList.length) {
      setOpenEvidences([]);
    } else {
      setOpenEvidences(dynamicEvidenceList.map((_, i) => i));
    }
  };

  // Contenido y Bifurcaciones específicas por Fase
  const stageData = useMemo(() => {
    switch (currentBlock) {
      case 'apertura':
        return {
          icon: "📖",
          stageLabel: "Introducción",
          title: `Introducción: ${narrative.metadata.title}`,
          prose: narrative.blocks?.apertura?.contexto || narrative.metadata.gancho,
          secondaryProse: narrative.blocks?.apertura?.personaje 
            ? `Guía de la investigación: ${narrative.blocks.apertura.personaje}.`
            : undefined,
          tension: narrative.metadata.gancho || narrative.blocks?.apertura?.gancho,
          branches: [
            {
              id: 'a1',
              label: 'Senda A · Contextualización',
              color: 'cyan',
              title: 'Marco Institucional & Social',
              desc: 'Comprender el contexto institucional y sociocultural donde se sitúa la problemática.',
              focalNote: 'Enfoque seleccionado: Analizando las condiciones contextuales que dieron origen a este estudio.'
            },
            {
              id: 'a2',
              label: 'Senda B · Objetivos',
              color: 'orange',
              title: 'Preguntas & Retos Formativos',
              desc: 'Analizar cómo se formularon las hipótesis de partida y los propósitos epistémicos.',
              focalNote: 'Enfoque seleccionado: Examinando las metas científicas y las preguntas de investigación.'
            }
          ],
          deepDives: narrative.blocks?.apertura?.deepDives || []
        };

      case 'conflicto':
        return {
          icon: "❓",
          stageLabel: "El Problema",
          title: `El Problema: ${narrative.blocks?.conflicto?.problema ? narrative.blocks.conflicto.problema.split('.')[0] : 'La tensión central del estudio'}`,
          prose: narrative.blocks?.conflicto?.problema,
          tension: narrative.blocks?.conflicto?.porQueImporta,
          dataPoints: narrative.blocks?.conflicto?.dataPoints || [],
          glossary: narrative.blocks?.conflicto?.glossary || [],
          branches: [
            {
              id: 'c1',
              label: 'Senda A · Relevancia Crítica',
              color: 'cyan',
              title: 'Impacto en la Sociedad Lectora',
              desc: 'Indagar en las consecuencias educativas y culturales si esta tensión no se resuelve.',
              focalNote: 'Enfoque seleccionado: Priorizando las razones sociopolíticas y pedagógicas de la problemática.'
            },
            {
              id: 'c2',
              label: 'Senda B · Términos & Datos',
              color: 'orange',
              title: 'Conceptos Clave & Evidencia Previa',
              desc: 'Explorar las definiciones conceptuales y los datos cuantitativos del problema.',
              focalNote: 'Enfoque seleccionado: Focalizando en el glosario de términos y los puntos empíricos.'
            }
          ],
          deepDives: narrative.blocks?.conflicto?.deepDives || []
        };

      case 'viaje':
        return {
          icon: "🧭",
          stageLabel: "Método",
          title: `Método: ${narrative.blocks?.viaje?.titulo || 'Diseño de Investigación y Trabajo de Campo'}`,
          prose: narrative.blocks?.viaje?.narrativa,
          detalles: narrative.blocks?.viaje?.detalles || [],
          limitaciones: narrative.blocks?.viaje?.limitaciones || [],
          reflexion: narrative.blocks?.viaje?.reflexion,
          branches: [
            {
              id: 'v1',
              label: 'Senda A · Corpus & Muestra',
              color: 'cyan',
              title: 'Participantes y Criterios de Selección',
              desc: 'Examinar los criterios de inclusión/exclusión y la representatividad muestral.',
              focalNote: 'Enfoque seleccionado: Analizando las características demográficas, el corpus y los informantes.'
            },
            {
              id: 'v2',
              label: 'Senda B · Instrumentos & Rigor',
              color: 'orange',
              title: 'Técnicas de Análisis y Límites',
              desc: 'Comprobar los protocolos de codificación, software y límites metodológicos.',
              focalNote: 'Enfoque seleccionado: Examinando el rigor analítico, software empleado y limitaciones.'
            }
          ],
          deepDives: narrative.blocks?.viaje?.deepDives || []
        };

      case 'revelacion':
        return {
          icon: "💡",
          stageLabel: "Resultados",
          title: `Resultados: ${narrative.blocks?.revelacion?.titulo || 'Hallazgos Empíricos Clave'}`,
          prose: narrative.blocks?.revelacion?.narrativa,
          hallazgos: narrative.blocks?.revelacion?.hallazgos || [],
          dataPoints: narrative.blocks?.revelacion?.dataPoints || [],
          reflexion: narrative.blocks?.revelacion?.reflexion,
          branches: [
            {
              id: 'r1',
              label: 'Senda A · Hallazgos Nucleares',
              color: 'cyan',
              title: 'Patrones Principales Confirmados',
              desc: 'Descubrir las regularidades estadísticas y cualitativas de mayor consistencia.',
              focalNote: 'Enfoque seleccionado: Focalizando en los descubrimientos que corroboran la tesis central.'
            },
            {
              id: 'r2',
              label: 'Senda B · Puntos de Tensión',
              color: 'orange',
              title: 'Factores Emergentes & Excepciones',
              desc: 'Explorar divergencias, singularidades o elementos no previstos en la hipótesis.',
              focalNote: 'Enfoque seleccionado: Analizando los matices y excepciones en los datos empíricos.'
            }
          ],
          deepDives: narrative.blocks?.revelacion?.deepDives || []
        };

      case 'marco':
        return {
          icon: "📚",
          stageLabel: "Discusión",
          title: `Discusión: ${narrative.blocks?.marco?.titulo || 'Debate Teórico y Evidencia'}`,
          prose: narrative.blocks?.marco?.narrativa,
          detalles: narrative.blocks?.marco?.detalles || [],
          reflexion: narrative.blocks?.marco?.reflexion,
          branches: [
            {
              id: 'm1',
              label: 'Senda A · Diálogo Teórico',
              color: 'cyan',
              title: 'Convergencias con la Literatura',
              desc: 'Contraste riguroso con los modelos teóricos de los autores de referencia.',
              focalNote: 'Enfoque seleccionado: Profundizando en el diálogo con las corrientes teóricas predominantes.'
            },
            {
              id: 'm2',
              label: 'Senda B · Nuevos Constructos',
              color: 'orange',
              title: 'Reconfiguración Conceptual',
              desc: 'Identificar nuevas categorías teóricas que emergen de la investigación.',
              focalNote: 'Enfoque seleccionado: Evaluando las aportaciones novedosas al marco conceptual.'
            }
          ],
          deepDives: narrative.blocks?.marco?.deepDives || []
        };

      case 'nucleo':
        return {
          icon: "🎯",
          stageLabel: "Conclusión",
          title: "Conclusión Científica: Respuesta a la Pregunta Central",
          pregunta: narrative.blocks?.nucleo?.pregunta,
          conclusion: narrative.blocks?.nucleo?.conclusion,
          formalRef: narrative.blocks?.nucleo?.formalRef,
          branches: [
            {
              id: 'n1',
              label: 'Senda A · Veredicto Epistémico',
              color: 'cyan',
              title: 'Respuesta Concluyente a la Pregunta',
              desc: 'Resumen directo y sustentado sobre la hipótesis original.',
              focalNote: 'Enfoque seleccionado: Examinando el veredicto científico del estudio.'
            },
            {
              id: 'n2',
              label: 'Senda B · Transferencia y Citación',
              color: 'orange',
              title: 'Aplicabilidad y Referencia Formal',
              desc: 'Impacto práctico en la comunidad educativa y citación bibliográfica.',
              focalNote: 'Enfoque seleccionado: Analizando las vías de transferencia y la referencia formal.'
            }
          ]
        };

      case 'implicancias':
        return {
          icon: "🏛️",
          stageLabel: "Implicancias",
          title: narrative.blocks?.implicancias?.title || "Implicancias Educativas, Sociales y Políticas",
          tareasCognitivas: narrative.blocks?.implicancias?.tareasCognitivas || [],
          tareasEscritura: narrative.blocks?.implicancias?.tareasEscritura || [],
          ref: narrative.blocks?.implicancias?.ref,
          branches: [
            {
              id: 'i1',
              label: 'Senda A · Procesos Cognitivos',
              color: 'cyan',
              title: 'Desarrollo del Pensamiento Crítico',
              desc: 'Estrategias formativas para activar habilidades metacognitivas.',
              focalNote: 'Enfoque seleccionado: Focalizando en los procesos cognitivos y de comprensión.'
            },
            {
              id: 'i2',
              label: 'Senda B · Prácticas de Escritura',
              color: 'orange',
              title: 'Propuestas de Mediación & Creación',
              desc: 'Modelos de intervención para aulas, bibliotecas y hogares.',
              focalNote: 'Enfoque seleccionado: Focalizando en las tareas de producción y mediación lectora.'
            }
          ]
        };

      case 'reflexion':
        return {
          icon: "✨",
          stageLabel: "Reflexión",
          title: "Consolidación del Aprendizaje y Evaluación Crítica",
          prose: "Pon a prueba tu asimilación de los hallazgos empíricos y reflexiona sobre el impacto de esta investigación.",
          questions: narrative.blocks?.reflexion?.questions || [],
          branches: [
            {
              id: 'ref1',
              label: 'Senda A · Cuestionario Asimilativo',
              color: 'cyan',
              title: 'Evaluación de Comprensión',
              desc: 'Valida tus conocimientos con retroalimentación inmediata.',
              focalNote: 'Enfoque seleccionado: Respondiendo las preguntas clave del estudio.'
            },
            {
              id: 'ref2',
              label: 'Senda B · Grafo Epistémico',
              color: 'orange',
              title: 'Navegar Conexiones del Mapa',
              desc: 'Explorar la red relacional de conceptos de esta investigación.',
              focalNote: 'Enfoque seleccionado: Puedes saltar al mapa conceptual en cualquier momento.'
            }
          ]
        };

      default:
        return null;
    }
  }, [currentBlock, narrative]);

  const activeBranchObj = stageData?.branches?.find(b => b.id === activeBranch);

  const content = (
    <div 
      data-in-narrative="true" 
      className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-[#f8fcfa] text-[#2c3e50] font-sans antialiased flex flex-col overflow-hidden select-none z-[9999]"
    >
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE FASES IMRyD (RESPONSIVA, CON SCROLL NO INTRUSIVO)    */}
      {/* ========================================================================= */}
      <header className="bg-[#244b63] text-white shrink-0 border-b border-[#1c3c4f] shadow-md z-30" data-purpose="imryd-stage-bar">
        {/* Barra superior de progreso continuo */}
        <div className="w-full h-1.5 bg-[#1a384b]">
          <div 
            className="h-full bg-gradient-to-r from-ocnos-yellow via-ocnos-coral to-ocnos-cyan transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Revista Ocnos */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2.5 sm:pr-3 sm:border-r border-[#3a617a]">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-ocnos-green text-white font-black text-xs tracking-wider shadow-inner">
                OC
              </span>
              <div className="leading-tight hidden sm:block">
                <span className="text-xs font-bold tracking-widest text-slate-200 block uppercase">Revista Ocnos</span>
                <span className="text-[10px] text-slate-300 font-medium truncate max-w-[130px] block">{narrative.metadata.journal || 'Ocnos Transmedia'}</span>
              </div>
            </div>
          </div>

          {/* Pasos Centrales Navegables: Scroll horizontal suave para no hacinarse */}
          <nav 
            ref={navContainerRef}
            aria-label="Fases del Estudio" 
            className="hidden md:flex items-center justify-start lg:justify-center gap-1.5 overflow-x-auto scrollbar-none flex-1 max-w-4xl px-2 py-0.5"
          >
            {visibleBlocks.map((blockId) => {
              const indexItem = IMRyD_INDEX.find(i => i.id === blockId);
              const label = indexItem ? indexItem.label : blockId;
              const icon = indexItem ? indexItem.icon : '📖';
              const isCurrent = currentBlock === blockId;
              const isCompleted = completedBlocks.includes(blockId);
              const isGrafo = blockId === 'mapa';
              const isJuego = blockId === 'juego';

              return (
                <button
                  key={blockId}
                  data-active={isCurrent}
                  onClick={() => navigateTo(blockId)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'font-bold bg-white text-ocnos-navy shadow-md ring-2 ring-ocnos-yellow/90 scale-105'
                      : isGrafo
                      ? 'font-bold bg-[#1a384b] hover:bg-[#152e3d] text-ocnos-yellow border border-ocnos-yellow/50 shadow-sm'
                      : isJuego
                      ? 'font-bold bg-[#1a384b] hover:bg-[#152e3d] text-ocnos-green border border-ocnos-green/50 shadow-sm'
                      : isCompleted
                      ? 'font-semibold bg-[#2e5973] hover:bg-[#386b8b] text-slate-200 border border-[#3e6f8f]'
                      : 'font-semibold bg-[#2e5973]/70 hover:bg-[#2e5973] text-slate-300 border border-[#396582]'
                  }`}
                >
                  <span className="text-[13px]">{icon}</span>
                  <span>{label}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-ocnos-coral animate-pulse" />
                  )}
                  {isCompleted && !isCurrent && (
                    <span className="text-ocnos-green text-[10px] font-black">✓</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Indicador Móvil Compacto con flechas de avance/retroceso */}
          <div className="flex md:hidden items-center justify-between flex-1 px-1 min-w-0">
            <button 
              onClick={navigateBackward}
              disabled={currentIndex === 0}
              className="p-1 rounded bg-[#1d3d52] text-slate-200 disabled:opacity-30 cursor-pointer"
              aria-label="Fase anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-center truncate px-1">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1 truncate">
                <span>{currentBlockInfo.icon}</span>
                <span className="text-ocnos-yellow truncate">{currentBlockInfo.label}</span>
              </span>
            </div>
            <button 
              onClick={navigateForward}
              disabled={currentIndex >= visibleBlocks.length - 1}
              className="p-1 rounded bg-[#1d3d52] text-slate-200 disabled:opacity-30 cursor-pointer"
              aria-label="Fase siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Controles de Navegación & Salir */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Toggle para panel de evidencias en desktop */}
            <button
              onClick={() => setUserSidebarToggle(showSidebar ? false : true)}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#1d3d52] hover:bg-[#244b63] text-slate-200 text-xs font-semibold border border-[#2f5a77] cursor-pointer transition-colors"
              title={showSidebar ? "Ocultar panel lateral para ampliar lectura" : "Mostrar panel de evidencias"}
            >
              {showSidebar ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              <span className="hidden xl:inline">{showSidebar ? "Expandir" : "Evidencias"}</span>
            </button>

            {/* Contador de nodo */}
            <div className="flex items-center bg-[#1d3d52] px-2.5 py-1 rounded-md text-xs font-bold text-slate-200 border border-[#2f5a77]">
              <span>{currentIndex + 1}/{visibleBlocks.length}</span>
            </div>

            <button 
              onClick={onBack}
              className="flex items-center space-x-1 px-3 py-1 rounded-md bg-ocnos-coral/90 hover:bg-ocnos-coral text-white text-xs font-semibold shadow transition-colors cursor-pointer" 
              title="Volver al catálogo general"
            >
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ÁREA DE TRABAJO PRINCIPAL (SIN HACINAMIENTO)                            */}
      {/* ========================================================================= */}
      <main className="flex-1 flex overflow-hidden relative" data-purpose="interactive-narrative-engine">
        
        {/* Detectives Mode Override si aplica */}
        {narrative?.id === 'detectives' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <DetectivesLanding />
          </div>
        ) : (
          <>
            {/* COLUMNA PRINCIPAL: Flujo de lectura inmersivo */}
            <section 
              ref={scrollContainerRef}
              className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 lg:py-10 custom-scrollbar" 
              data-purpose="narrative-stream"
            >
              <div className={isImmersiveBlock ? "w-full mx-auto" : "max-w-4xl mx-auto"}>
                
                {/* Bloques Interactivos Especializados */}
                {currentBlock === 'mapa' ? (
                  <MapaBlock 
                    narrative={narrative} 
                    navigateTo={navigateTo} 
                    navigateBackward={navigateBackward} 
                  />
                ) : currentBlock === 'juego' ? (
                  <JuegoBlock 
                    narrative={narrative} 
                    selectedGame={selectedGame}
                    setSelectedGame={setSelectedGame}
                    navigateTo={navigateTo} 
                    navigateBackward={navigateBackward}
                  />
                ) : stageData && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentBlock}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Metadatos y Badges de Publicación */}
                      <div className="flex items-center space-x-2.5 mb-3 flex-wrap gap-y-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-ocnos-green/15 text-ocnos-green text-[11px] font-bold tracking-wide uppercase">
                          {narrative.metadata.journal || 'OCNOS'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-ocnos-cyan/15 text-ocnos-cyan text-[11px] font-bold tracking-wide uppercase">
                          {narrative.metadata.depth || 'Estudio Empírico'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-mono">
                          {narrative.metadata.year}
                        </span>
                      </div>

                      {/* Título de Fase */}
                      <div className="flex items-start space-x-3.5 mb-6">
                        <div className="p-2.5 bg-ocnos-cyan/10 text-ocnos-cyan rounded-xl mt-1 shrink-0">
                          <span className="text-2xl" aria-hidden="true">{stageData.icon}</span>
                        </div>
                        <div>
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a384b] tracking-tight leading-tight">
                            {stageData.title}
                          </h1>
                          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                            {narrative.metadata.authors}
                          </p>
                        </div>
                      </div>

                      {/* Tesis Narrativa Central / Prosa */}
                      {stageData.prose && (
                        <article className="prose max-w-none text-slate-700 leading-relaxed space-y-4 mb-6">
                          <p className="text-base lg:text-lg leading-relaxed text-[#234255] font-normal">
                            {stageData.prose}
                          </p>
                          {stageData.secondaryProse && (
                            <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                              {stageData.secondaryProse}
                            </p>
                          )}
                        </article>
                      )}

                      {/* LLAMADA DESTACADA: ¿Por qué importa esto a la sociedad lectora? */}
                      {stageData.tension && (
                        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/70 to-orange-50/40 border-l-4 border-ocnos-coral shadow-xs" data-purpose="tension-callout">
                          <div className="flex items-center space-x-2 text-ocnos-coral font-bold text-xs tracking-wider uppercase mb-2">
                            <Lightbulb size={16} aria-hidden="true" />
                            <span>¿Por qué importa esto a la sociedad lectora?</span>
                          </div>
                          <p className="text-slate-800 text-[14.5px] leading-relaxed font-medium">
                            {stageData.tension}
                          </p>
                        </div>
                      )}

                      {/* BIFURCACIONES MULTICAMINO (SENDAS FUNCIONALES) */}
                      {stageData.branches && stageData.branches.length > 0 && (
                        <div className="mb-8" data-purpose="decision-branching">
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a384b] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-ocnos-cyan" />
                              <span>Bifurcación Narrativa: Elige tu perspectiva analítica</span>
                            </h2>
                            <span className="text-[11px] font-semibold text-ocnos-cyan bg-ocnos-cyan/10 px-2 py-0.5 rounded-full">
                              {activeBranch ? '1 senda activa' : `${stageData.branches.length} sendas`}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {stageData.branches.map((b) => {
                              const isSelected = activeBranch === b.id;
                              return (
                                <div 
                                  key={b.id}
                                  onClick={() => setActiveBranch(isSelected ? null : b.id)}
                                  className={`p-4 sm:p-5 rounded-xl bg-white border cursor-pointer transition-all duration-200 group relative ${
                                    isSelected 
                                      ? 'border-ocnos-cyan ring-2 ring-ocnos-cyan/40 shadow-md bg-cyan-50/20' 
                                      : 'border-slate-200 hover:border-ocnos-cyan/60 hover:shadow-xs'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                      b.color === 'cyan' ? 'bg-ocnos-cyan/10 text-ocnos-cyan' : 'bg-ocnos-orange/15 text-ocnos-orange'
                                    }`}>
                                      {b.label}
                                    </span>
                                    <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-ocnos-cyan' : 'text-slate-300 group-hover:text-ocnos-cyan'}`}>
                                      {isSelected ? '✓ Activa' : '→'}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-ocnos-cyan transition-colors">
                                    {b.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 leading-normal">
                                    {b.desc}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Nota focal de la senda seleccionada */}
                          {activeBranchObj && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-3.5 rounded-xl bg-cyan-50/60 border border-ocnos-cyan/30 text-xs text-[#00656c] font-medium flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <Sparkles size={15} className="text-ocnos-cyan shrink-0" />
                                <span>{activeBranchObj.focalNote}</span>
                              </div>
                              <button 
                                onClick={() => setActiveBranch(null)}
                                className="text-[11px] text-slate-500 hover:text-slate-700 underline shrink-0 ml-2 cursor-pointer"
                              >
                                Ver perspectiva general
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* ============================================================ */}
                      {/* CONTENIDOS RICOS ESPECÍFICOS SEGÚN FASE                      */}
                      {/* ============================================================ */}

                      {/* 1. MICRO-GLOSARIO EN FASE CONFLICTO */}
                      {currentBlock === 'conflicto' && stageData.glossary && stageData.glossary.length > 0 && (
                        <div className="mb-8 bg-[#f5faf8] border border-ocnos-green/20 p-5 sm:p-7 rounded-2xl" role="region" aria-label="Micro-glosario">
                          <h3 className="text-xs font-black uppercase tracking-widest text-ocnos-green mb-4 flex items-center gap-2">
                            <Search size={15} /> Micro-Glosario Conceptual del Estudio
                          </h3>
                          <div className="grid gap-2.5">
                            {stageData.glossary.map((item: any, i: number) => {
                              const isOpen = openGlossary === i;
                              return (
                                <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                                  <button 
                                    onClick={() => setOpenGlossary(isOpen ? null : i)}
                                    className="flex items-center justify-between p-3.5 sm:p-4 w-full text-left hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                                    aria-expanded={isOpen}
                                  >
                                    <span className="font-bold text-slate-800 text-sm">{item.term}</span>
                                    <ChevronDown size={17} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-ocnos-green' : ''}`} />
                                  </button>
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                          {item.definition}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. PUNTOS DE DATOS CUANTITATIVOS / TENSIONES */}
                      {stageData.dataPoints && stageData.dataPoints.length > 0 && (
                        <div className="mb-8" data-purpose="data-points-grid">
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-2">
                            <span>📊</span> Datos Clave de Partida
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {stageData.dataPoints.map((point: string, i: number) => (
                              <div key={i} className="p-3.5 bg-white border border-slate-200/90 rounded-xl flex items-start space-x-3 shadow-2xs">
                                <span className="w-5 h-5 rounded-full bg-ocnos-coral/15 text-ocnos-coral flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <p className="text-xs font-medium text-slate-700 leading-snug">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. DETALLES METODOLÓGICOS Y LÍMITES EN FASE VIAJE */}
                      {currentBlock === 'viaje' && (
                        <div className="space-y-6 mb-8">
                          {stageData.detalles && stageData.detalles.length > 0 && (
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-widest text-[#1a384b] mb-3 flex items-center gap-2">
                                <Microscope size={15} className="text-ocnos-cyan" />
                                <span>Dimensiones del Diseño y Muestra</span>
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stageData.detalles.map((d: any, i: number) => {
                                  const isOpen = openDetail === i;
                                  return (
                                    <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-ocnos-cyan/50">
                                      <button
                                        onClick={() => setOpenDetail(isOpen ? null : i)}
                                        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/80 transition-colors focus:outline-none"
                                        aria-expanded={isOpen}
                                      >
                                        <span className="text-[10px] font-black uppercase tracking-wider text-ocnos-cyan block">
                                          {d.label}
                                        </span>
                                        <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ocnos-cyan' : ''}`} />
                                      </button>
                                      <div className={`px-3.5 pb-3.5 text-xs font-medium text-slate-800 leading-relaxed transition-all ${isOpen ? '' : 'line-clamp-2 text-slate-500'}`}>
                                        {d.value}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {stageData.limitaciones && stageData.limitaciones.length > 0 && (
                            <div className="p-5 rounded-2xl bg-[#faf6f2] border border-amber-200/80">
                              <h4 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-2">
                                <span>⚠️</span> Consideraciones y Límites del Diseño
                              </h4>
                              <ul className="space-y-2">
                                {stageData.limitaciones.map((lim: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                                    <span className="text-amber-600 font-bold shrink-0">•</span>
                                    <span>{lim}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {stageData.reflexion && (
                            <div className="p-4 rounded-xl bg-cyan-50/50 border border-ocnos-cyan/30 text-xs text-slate-700 italic">
                              <span className="font-bold text-ocnos-cyan not-italic block mb-1">Reflexión Metodológica:</span>
                              "{stageData.reflexion}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. HALLAZGOS ESTRUCTURADOS EN FASE REVELACIÓN */}
                      {currentBlock === 'revelacion' && stageData.hallazgos && stageData.hallazgos.length > 0 && (
                        <div className="mb-8 space-y-3">
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#1a384b] mb-2 flex items-center gap-2">
                            <Award size={15} className="text-ocnos-green" />
                            <span>Hallazgos Empíricos Desglosados</span>
                          </h3>
                          <div className="space-y-3">
                            {stageData.hallazgos.map((h: any, i: number) => {
                              const isOpen = openHallazgo === i;
                              return (
                                <div key={i} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:border-ocnos-green/50 transition-colors">
                                  <button
                                    onClick={() => setOpenHallazgo(isOpen ? null : i)}
                                    className="flex items-center justify-between p-4 sm:p-5 w-full text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    aria-expanded={isOpen}
                                  >
                                    <div className="flex items-center gap-3 pr-2">
                                      <span className="px-2.5 py-0.5 rounded-full bg-ocnos-green/15 text-ocnos-green text-[10px] font-black uppercase tracking-wider shrink-0">
                                        Hallazgo {i + 1}
                                      </span>
                                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                                        {h.label}
                                      </h4>
                                    </div>
                                    <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ocnos-green' : ''}`} />
                                  </button>
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                                          {h.value}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>

                          {stageData.reflexion && (
                            <div className="mt-4 p-4 rounded-xl bg-green-50/50 border border-ocnos-green/30 text-xs text-slate-700 italic">
                              <span className="font-bold text-ocnos-green not-italic block mb-1">Reflexión sobre los Resultados:</span>
                              "{stageData.reflexion}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. DETALLES Y DEBATE EN FASE MARCO */}
                      {currentBlock === 'marco' && (
                        <div className="space-y-6 mb-8">
                          {stageData.detalles && stageData.detalles.length > 0 && (
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-widest text-[#1a384b] mb-3 flex items-center gap-2">
                                <Brain size={15} className="text-ocnos-coral" />
                                <span>Dimensiones Teóricas del Debate</span>
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stageData.detalles.map((d: any, i: number) => {
                                  const isOpen = openMarcoDetail === i;
                                  return (
                                    <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-ocnos-coral/50">
                                      <button
                                        onClick={() => setOpenMarcoDetail(isOpen ? null : i)}
                                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/80 transition-colors focus:outline-none"
                                        aria-expanded={isOpen}
                                      >
                                        <span className="text-[10px] font-black uppercase tracking-wider text-ocnos-coral block">
                                          {d.label}
                                        </span>
                                        <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ocnos-coral' : ''}`} />
                                      </button>
                                      <div className={`px-4 pb-4 text-xs font-medium text-slate-800 leading-relaxed transition-all ${isOpen ? '' : 'line-clamp-2 text-slate-500'}`}>
                                        {d.value}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {stageData.reflexion && (
                            <div className="p-4 rounded-xl bg-orange-50/50 border border-ocnos-orange/30 text-xs text-slate-700 italic">
                              <span className="font-bold text-ocnos-orange not-italic block mb-1">Reflexión Epistémica:</span>
                              "{stageData.reflexion}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. NODO NÚCLEO INDEPENDIENTE (CLÍMAX CIENTÍFICO) */}
                      {currentBlock === 'nucleo' && (
                        <div className="space-y-6 mb-8" data-purpose="nucleo-climax-block">
                          {/* Tarjeta de la Pregunta Nuclear */}
                          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d3d52] to-[#122836] text-white shadow-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-ocnos-yellow text-xs font-black uppercase tracking-widest mb-4">
                              <Sparkles size={14} className="animate-pulse" />
                              <span>Pregunta Nuclear de Investigación</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold leading-snug mb-5 text-white">
                              {stageData.pregunta || "¿Cuáles son los efectos y transformaciones demostradas por este estudio?"}
                            </h3>
                            <div className="border-t border-white/20 pt-4">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-2 font-bold">
                                Veredicto Científico y Conclusión:
                              </span>
                              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                                {stageData.conclusion}
                              </p>
                            </div>
                          </div>

                          {/* Ficha de Referencia Formal con Botón de Copia */}
                          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Cita Bibliográfica Oficial
                              </span>
                              <p className="text-xs text-slate-800 font-mono leading-relaxed truncate">
                                {stageData.formalRef || narrative.metadata.title}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                              <button
                                onClick={copyCitation}
                                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Copiar referencia formal"
                              >
                                {copiedCitation ? <Check size={14} className="text-ocnos-green" /> : <Copy size={14} />}
                                <span>{copiedCitation ? "¡Copiada!" : "Copiar Cita"}</span>
                              </button>
                              {narrative.metadata.doi && (
                                <a
                                  href={`https://doi.org/${narrative.metadata.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-2 rounded-xl bg-ocnos-coral text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer hover:bg-ocnos-coral/90"
                                >
                                  <span>DOI</span>
                                  <ExternalLink size={13} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 7. FASE IMPLICANCIAS (SI EXISTE) */}
                      {currentBlock === 'implicancias' && (
                        <div className="space-y-6 mb-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Tareas Cognitivas */}
                            <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-200/80">
                              <h3 className="font-bold text-sm text-ocnos-orange uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Brain size={18} /> Tareas Cognitivas
                              </h3>
                              <div className="space-y-2.5">
                                {stageData.tareasCognitivas?.map((t: any, i: number) => {
                                  const isOpen = openCognitiva === i;
                                  return (
                                    <div key={i} className="bg-white rounded-xl border border-orange-200/60 p-3 shadow-2xs">
                                      <button 
                                        onClick={() => setOpenCognitiva(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-800 cursor-pointer"
                                      >
                                        <span>{t.nombre}</span>
                                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                      </button>
                                      {isOpen && (
                                        <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                                          {t.objetivo}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Tareas de Escritura */}
                            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80">
                              <h3 className="font-bold text-sm text-ocnos-green uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText size={18} /> Tareas de Escritura y Mediación
                              </h3>
                              <div className="space-y-2.5">
                                {stageData.tareasEscritura?.map((t: any, i: number) => {
                                  const isOpen = openEscritura === i;
                                  return (
                                    <div key={i} className="bg-white rounded-xl border border-emerald-200/60 p-3 shadow-2xs">
                                      <button 
                                        onClick={() => setOpenEscritura(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-800 cursor-pointer"
                                      >
                                        <span>{t.nombre}</span>
                                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                      </button>
                                      {isOpen && (
                                        <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                                          {t.objetivo}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {stageData.ref && (
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center font-mono">
                              {stageData.ref}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 8. FASE REFLEXIÓN: CUESTIONARIO INTERACTIVO COMPLETO */}
                      {currentBlock === 'reflexion' && (
                        <div className="space-y-8 mb-10" data-purpose="interactive-quiz-questionnaire">
                          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-2">
                              <div>
                                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1a384b]">
                                  Cuestionario de Asimilación Crítica
                                </h3>
                                <p className="text-xs text-slate-400">
                                  {stageData.questions.length} desafíos de asimilación empírica
                                </p>
                              </div>
                              <button
                                onClick={handleDownloadFicha}
                                className="px-3.5 py-2 rounded-xl bg-ocnos-green/15 hover:bg-ocnos-green/25 text-ocnos-green text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Descargar resumen con respuestas"
                              >
                                <Download size={14} />
                                <span>Descargar Ficha</span>
                              </button>
                            </div>

                            {/* Preguntas renderizadas interactivamente */}
                            <div className="space-y-8">
                              {stageData.questions.map((q: any, idx: number) => {
                                const selectedOpt = answers[idx];
                                const isAnswered = selectedOpt !== undefined;
                                const isCorrect = selectedOpt === q.correct;

                                return (
                                  <div key={idx} className="p-4 sm:p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="w-6 h-6 rounded-full bg-[#1a384b] text-white flex items-center justify-center text-xs font-black shrink-0">
                                        {idx + 1}
                                      </span>
                                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                        {q.type === 'choice' ? 'Opción Múltiple' : 'Reflexión Abierta'}
                                      </span>
                                    </div>

                                    <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-4 leading-relaxed">
                                      {q.q}
                                    </h4>

                                    {q.type === 'choice' && q.options ? (
                                      <div className="grid gap-2.5">
                                        {q.options.map((opt: string, optIdx: number) => {
                                          const isThisChosen = selectedOpt === optIdx;
                                          return (
                                            <button
                                              key={optIdx}
                                              onClick={() => setAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                                                isThisChosen
                                                  ? optIdx === q.correct
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                                                    : 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                              }`}
                                            >
                                              <span>{opt}</span>
                                              {isThisChosen && optIdx === q.correct && (
                                                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 ml-2" />
                                              )}
                                            </button>
                                          );
                                        })}

                                        {isAnswered && (
                                          <motion.div 
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mt-2 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                              isCorrect 
                                                ? 'bg-emerald-100/70 text-emerald-800' 
                                                : 'bg-amber-100/70 text-amber-800'
                                            }`}
                                          >
                                            <span>{isCorrect ? "✨ ¡Correcto! Has asimilado la evidencia del estudio." : "💡 Sigue explorando: revisa los resultados y la discusión para afianzar este punto."}</span>
                                          </motion.div>
                                        )}
                                      </div>
                                    ) : (
                                      <textarea
                                        rows={3}
                                        placeholder="Escribe tu reflexión crítica sobre la transferencia de este estudio..."
                                        className="w-full p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-ocnos-cyan outline-none resize-none transition-colors"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Deep Dives si están presentes */}
                      {stageData.deepDives && stageData.deepDives.length > 0 && (
                        <div className="mb-8">
                          <DeepDives 
                            deepDives={stageData.deepDives} 
                            openDeepDives={openDeepDives} 
                            onToggle={toggleDeepDive} 
                          />
                        </div>
                      )}

                      {/* Botones de Navegación de Flujo Principal */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 pb-8 border-t border-slate-200" data-purpose="stage-navigation-buttons">
                        <button 
                          onClick={navigateBackward}
                          disabled={currentIndex === 0}
                          className={`px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-600 font-semibold text-xs tracking-wide transition-all shadow-xs flex items-center space-x-2 ${
                            currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <span>←</span>
                          <span>Fase Anterior</span>
                        </button>

                        {currentIndex < visibleBlocks.length - 1 ? (
                          <button 
                            onClick={navigateForward}
                            className="px-6 py-2.5 rounded-xl bg-ocnos-cyan hover:bg-[#009ca4] text-white font-bold text-xs tracking-wide transition-all shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
                          >
                            <span>Continuar Ruta Metodológica</span>
                            <span>→</span>
                          </button>
                        ) : (
                          <button 
                            onClick={onBack}
                            className="px-6 py-2.5 rounded-xl bg-ocnos-green hover:bg-ocnos-green/90 text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                          >
                            <span>Finalizar Estudio</span>
                            <Award size={15} />
                          </button>
                        )}

                        {narrative.metadata.doi && (
                          <a 
                            href={`https://doi.org/${narrative.metadata.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-ocnos-yellow/20 hover:bg-ocnos-yellow/30 text-[#856c00] font-bold text-xs tracking-wide transition-all sm:ml-auto flex items-center space-x-1.5"
                          >
                            <span>★</span>
                            <span>Ver DOI Oficial</span>
                            <ExternalLink size={13} className="ml-1" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </section>

            {/* COLUMNA DERECHA: PANEL DE EVIDENCIAS Y TUTOR INVESTIGADOR DOCKED (NO SE PISA) */}
            {showSidebar && (
              <aside 
                className="w-96 xl:w-[420px] bg-[#f2f7f5] border-l border-slate-200/80 overflow-y-auto px-6 py-8 hidden lg:flex flex-col shrink-0 custom-scrollbar" 
                data-purpose="evidence-feed"
              >
                {/* 1. TUTOR INVESTIGADOR DOCKED DENTRO DE LA BARRA (Cero Solapamiento) */}
                <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs" data-purpose="docked-researcher-guide">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative w-11 h-12 rounded-xl overflow-hidden bg-[#eef5f2] border border-ocnos-cyan/40 shrink-0 flex items-center justify-center">
                      <img 
                        src={narrative.metadata.tutor?.image || `/assets/cromos/cromo-1.png`}
                        alt="" 
                        className="w-full h-full object-contain p-0.5" 
                      />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center space-x-1">
                        <span className="font-extrabold text-slate-800 text-xs tracking-tight truncate">
                          {narrative.metadata.tutor?.name || narrative.metadata.authors.split(',')[0]}
                        </span>
                        <span className="text-ocnos-cyan text-[10px]" title="Investigadora Principal">●</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block truncate">
                        {narrative.metadata.tutor?.role || 'Didáctica e Investigación'}
                      </span>
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-ocnos-green bg-ocnos-green/10 px-1.5 py-0.2 rounded">
                        Guía de la Narrativa
                      </span>
                    </div>
                  </div>

                  {/* Consejo dinámico contextual para la fase actual */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-serif italic text-slate-700 leading-relaxed mb-2.5">
                    “{tutorText}”
                  </div>

                  <button
                    onClick={() => openChat()}
                    className="w-full py-2 px-3 rounded-xl bg-ocnos-coral hover:bg-ocnos-coral/90 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageSquare size={13} />
                    <span>Conversar con el Investigador</span>
                  </button>
                </div>

                {/* 2. HEADER DE EVIDENCIAS AUTÉNTICAS CON CONTROLES DESPLEGABLES */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base" aria-hidden="true">📋</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Evidencias Empíricas del Caso</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleAllEvidences}
                      className="text-[10px] font-bold text-ocnos-cyan hover:text-[#00828a] transition-colors px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs cursor-pointer"
                      title={openEvidences.length === dynamicEvidenceList.length ? "Plegar todas las flashcards" : "Desplegar todas las flashcards"}
                    >
                      {openEvidences.length === dynamicEvidenceList.length ? "Plegar" : "Desplegar"}
                    </button>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {narrative.metadata.year}
                    </span>
                  </div>
                </div>

                {/* 3. LISTA DE MICRO-TARJETAS DE EVIDENCIA DESPLEGABLES (FLASHCARDS) */}
                <div className="space-y-2.5" data-purpose="evidence-cards-list">
                  {dynamicEvidenceList.map((ev, i) => {
                    const isExpanded = openEvidences.includes(i);
                    return (
                      <div 
                        key={i} 
                        className={`rounded-xl bg-white border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-xs ${
                          isExpanded ? 'border-slate-300 ring-1 ring-black/5' : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleEvidence(i)}
                          className="w-full p-3.5 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-slate-50/70 transition-colors focus:outline-none"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${ev.color}`}>
                              {ev.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate">{ev.badge}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0 text-slate-400">
                            <span className="text-[10px] font-bold hidden sm:inline text-slate-400">
                              {isExpanded ? 'Plegar' : 'Ver'}
                            </span>
                            <ChevronDown 
                              size={15} 
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-ocnos-cyan' : 'text-slate-400'}`} 
                            />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-3.5 pb-3.5 pt-1 text-xs font-medium text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                                {ev.content}
                              </div>
                            </motion.div>
                          ) : (
                            <div 
                              onClick={() => toggleEvidence(i)}
                              className="px-3.5 pb-2.5 -mt-1 text-[11.5px] text-slate-500 line-clamp-2 cursor-pointer hover:text-slate-700 transition-colors"
                            >
                              {ev.content}
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Testimonio / Gancho Textual vivo */}
                {narrative.blocks?.apertura?.gancho && (
                  <div className="mt-5 p-4 rounded-xl bg-[#e5efe9] border border-ocnos-green/30">
                    <span className="text-[10px] font-black uppercase tracking-wider text-ocnos-green block mb-1">Voz del Estudio</span>
                    <blockquote className="italic text-xs text-slate-700 leading-relaxed font-serif">
                      “{narrative.blocks.apertura.gancho}”
                    </blockquote>
                  </div>
                )}
              </aside>
            )}

            {/* BOTÓN MÓVIL DISCRETO DEL TUTOR (EN PANTALLAS PEQUEÑAS, SIN SOLAPAR) */}
            <div className="lg:hidden fixed bottom-14 right-4 z-40">
              <button
                onClick={() => setIsMobileTutorOpen(!isMobileTutorOpen)}
                className="w-11 h-11 rounded-full bg-ocnos-cyan text-white shadow-lg flex items-center justify-center text-sm font-bold border-2 border-white cursor-pointer"
                title="Consejo del Investigador"
                aria-label="Abrir consejo del investigador"
              >
                ✨
              </button>

              {/* Popover móvil expandible */}
              <AnimatePresence>
                {isMobileTutorOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-14 right-0 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-ocnos-coral tracking-wider">
                        Consejo del Investigador
                      </span>
                      <button onClick={() => setIsMobileTutorOpen(false)} className="text-slate-400 text-xs">✕</button>
                    </div>
                    <p className="text-xs font-serif italic text-slate-700 mb-3">
                      “{tutorText}”
                    </p>
                    <button
                      onClick={() => { setIsMobileTutorOpen(false); openChat(); }}
                      className="w-full py-1.5 rounded-lg bg-ocnos-coral text-white text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <MessageSquare size={12} />
                      <span>Preguntar con IA</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. BARRA DE ESTADO INFERIOR (FOOTER RESPONSIVO Y LIMPIO)                  */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none" data-purpose="footer-status-bar">
        {/* Atajos de teclado en desktop */}
        <div className="hidden sm:flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-600 font-semibold shadow-2xs">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-600 font-semibold shadow-2xs">→</kbd>
            <span className="text-[11px] font-medium text-slate-500">Navegar</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-600 font-semibold shadow-2xs">ESC</kbd>
            <span className="text-[11px] font-medium text-slate-500">Salir</span>
          </div>
          {visibleBlocks.includes('mapa') && (
            <div className="hidden lg:flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-600 font-semibold shadow-2xs">G</kbd>
              <span className="text-[11px] font-medium text-slate-500">Grafo</span>
            </div>
          )}
        </div>

        {/* Título y DOI del artículo científico */}
        <div className="flex items-center space-x-2 truncate max-w-sm sm:max-w-md lg:max-w-lg">
          <span className="w-2 h-2 rounded-full bg-ocnos-green shrink-0" />
          <span className="font-bold text-slate-700 truncate text-xs">
            {narrative.metadata.title}
          </span>
          {narrative.metadata.doi && (
            <span className="text-slate-400 hidden xl:inline text-[11px]">· DOI: {narrative.metadata.doi}</span>
          )}
        </div>

        {/* Nivel de progresión */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Progreso</span>
          <div className="w-14 sm:w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-ocnos-green h-full rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-600">{progressPercent}%</span>
        </div>
      </footer>
    </div>
  );

  return createPortal(content, document.body);
}
