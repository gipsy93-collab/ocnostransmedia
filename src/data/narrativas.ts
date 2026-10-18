import type { Narrative } from '../types/narrative';
import rawCatalogo from './catalogo_metadatos.json';

// Carga diferida dinámica (code-splitting) de las 322 investigaciones mediante glob de Vite
const narrativeModules = import.meta.glob('./narrativas/*.json');

function normalizeNarrative(raw: any, index: number): Narrative {
  const meta = raw?.metadata || {};
  const authors = Array.isArray(meta.authors) 
    ? meta.authors.join(', ') 
    : (meta.authors || 'Equipo Ocnos');
  
  let journal = meta.journal;
  if (!journal && (meta.volume || meta.issue)) {
    journal = `Ocnos ${meta.volume || ''}(${meta.issue || ''})`.trim();
  } else if (!journal) {
    journal = 'Revista Ocnos';
  }

  const normalizedMeta = {
    title: meta.title || 'Investigación Ocnos',
    authors: String(authors),
    year: String(meta.year || '2024'),
    journal: String(journal),
    doi: String(meta.doi || ''),
    gancho: String(meta.gancho || meta.abstract || ''),
    duration: String(meta.duration || '12-15 min'),
    depth: String(meta.depth || 'Profundización'),
    color: String(meta.color || '#2a5a75'),
    colorAlt: String(meta.colorAlt || '#5b9eaa'),
    bg: String(meta.bg || 'from-ocean-base/20 to-ocean-dark/20'),
    image: String(meta.image || '/assets/portadas/naturaleza_albumes.jpg'),
    ...(meta.tutor ? { tutor: meta.tutor } : {})
  };

  return {
    id: raw.id,
    metadata: normalizedMeta,
    tutorTexts: raw.tutorTexts || {},
    blocks: raw.blocks || {
      apertura: { personaje: '', gancho: '', contexto: '' },
      conflicto: { problema: '', porQueImporta: '', dataPoints: [], glossary: [] },
      viaje: { titulo: '', narrativa: '', detalles: [], limitaciones: [], reflexion: '' },
      revelacion: { titulo: '', narrativa: '', hallazgos: [], dataPoints: [], reflexion: '' },
      marco: { titulo: '', narrativa: '', detalles: [], reflexion: '' },
      nucleo: { pregunta: '', conclusion: '', formalRef: '' },
      reflexion: { questions: [] }
    },
    ...(raw.implicancias ? { implicancias: raw.implicancias } : {}),
    ...(raw.juegos ? { juegos: raw.juegos } : {}),
    ...(raw.mapa ? { mapa: raw.mapa } : {})
  } as Narrative;
}

// Catálogo de Metadatos Liviano (para renderizado instantáneo del Roster y filtros)
export const NARRATIVAS_CATALOGO: Narrative[] = (rawCatalogo as any[]).map((item, idx) => 
  normalizeNarrative(item, idx)
);

// Mantiene compatibilidad total con EditorialRoster, Transmedia, etc.
export const NARRATIVAS: Narrative[] = NARRATIVAS_CATALOGO;

/**
 * Carga asíncrona bajo demanda de la investigación completa (con todos sus bloques, interactivos y datos)
 */
export async function getNarrativeById(id: string): Promise<Narrative | null> {
  if (!id) return null;
  
  const cleanId = id.trim().toLowerCase();
  const directPath = `./narrativas/${cleanId}.json`;
  
  // Búsqueda directa
  if (narrativeModules[directPath]) {
    const mod: any = await narrativeModules[directPath]();
    const data = mod.default || mod;
    return normalizeNarrative(data, 0);
  }

  // Búsqueda insensible a mayúsculas o por slug
  const allKeys = Object.keys(narrativeModules);
  const matchedKey = allKeys.find(k => {
    const base = k.replace('./narrativas/', '').replace('.json', '').toLowerCase();
    return base === cleanId || base.endsWith(`_${cleanId}`) || cleanId.endsWith(`_${base}`);
  });

  if (matchedKey) {
    const mod: any = await narrativeModules[matchedKey]();
    const data = mod.default || mod;
    return normalizeNarrative(data, 0);
  }

  // Fallback al catálogo si existiera
  const inCatalog = NARRATIVAS_CATALOGO.find(n => n.id.toLowerCase() === cleanId);
  return inCatalog || null;
}
