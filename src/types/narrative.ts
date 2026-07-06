export interface DeepDiveBox {
  id: string;
  triggerLabel: string;
  content: string;
  type: 'method' | 'data' | 'theory' | 'limitation';
}

export interface TutorData {
  image: string;
  name: string;
  role: string;
}

export type BlockId = 'apertura' | 'conflicto' | 'viaje' | 'revelacion' | 'marco' | 'nucleo' | 'implicancias' | 'reflexion' | 'juego' | 'mapa';

export interface IMRyDIndexItem {
  id: BlockId;
  label: string;
  icon: string;
}

export interface Implicancias {
  title: string;
  tareasEscritura: Array<{ nombre: string; objetivo: string }>;
  tareasCognitivas: Array<{ nombre: string; objetivo: string }>;
  ref: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  color?: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface JuegoBlock {
  juegoId: 'snake' | 'quiz' | 'piramide';
  titulo: string;
  descripcion: string;
  instrucciones: string;
  nivelRequerido?: number;
}

export interface MapaBlock {
  titulo: string;
  descripcion: string;
  nodos: MindMapNode[];
  aristas: MindMapEdge[];
}

export interface Narrative {
  id: string;
  metadata: {
    title: string;
    authors: string;
    year: string;
    journal: string;
    doi: string;
    gancho: string;
    duration: string;
    depth: string;
    color: string;
    colorAlt: string;
    bg: string;
    image: string;
    tutor?: TutorData;
  };
  tutorTexts?: Partial<Record<BlockId, { text: string; position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' }>>;
  blocks: {
    apertura: {
      personaje: string;
      gancho: string;
      contexto: string;
      deepDives?: DeepDiveBox[];
    };
    conflicto: {
      problema: string;
      porQueImporta: string;
      dataPoints: string[];
      glossary: Array<{ term: string; definition: string }>;
      deepDives?: DeepDiveBox[];
    };
    viaje: {
      titulo: string;
      narrativa: string;
      detalles: Array<{ label: string; value: string }>;
      limitaciones: string[];
      reflexion: string;
      deepDives?: DeepDiveBox[];
    };
    revelacion: {
      titulo: string;
      narrativa: string;
      hallazgos: Array<{ label: string; value: string }>;
      dataPoints?: string[];
      reflexion?: string;
      deepDives?: DeepDiveBox[];
    };
    marco: {
      titulo: string;
      narrativa: string;
      detalles: Array<{ label: string; value: string }>;
      reflexion: string;
      deepDives?: DeepDiveBox[];
    };
    nucleo: {
      pregunta: string;
      conclusion: string;
      formalRef: string;
    };
    implicancias?: Implicancias;
    juegos?: JuegoBlock[];
    mapa?: MapaBlock;
    reflexion: {
      questions: Array<{
        type: 'choice' | 'open';
        q: string;
        options?: string[];
        correct?: number;
      }>;
    };
  };
}

export const IMRyD_INDEX: IMRyDIndexItem[] = [
  { id: 'apertura', label: 'Intro', icon: '📖' },
  { id: 'conflicto', label: 'Problema', icon: '❓' },
  { id: 'viaje', label: 'Método', icon: '🧭' },
  { id: 'revelacion', label: 'Resultados', icon: '💡' },
  { id: 'marco', label: 'Discusión', icon: '📚' },
  { id: 'nucleo', label: 'Conclusión', icon: '🎯' },
  { id: 'juego', label: 'Juego', icon: '🎮' },
  { id: 'mapa', label: 'Mapa', icon: '🗺️' },
];
