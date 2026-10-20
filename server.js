import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `Eres Ocnos, un asistente amable y cercano de la revista Ocnos sobre lectura y alfabetizacion.
Responde en espanol con 2 o 3 oraciones. Se cordial, usa algun emoji sutil si viene al caso.
Si no hay contexto de articulo, presentate: "Hola, soy Ocnos, puedo ayudarte a explorar los articulos sobre lectura y alfabetizacion. ¿Que tema buscas?"
Cuando recomiendes un articulo, incluye SIEMPRE al final el DOI como URL simple en una linea aparte, ej: "https://doi.org/10.18239/ocnos_2023.22.2.342". No uses formato markdown.
Si el contexto incluye articulos especificos, responde con sus datos concretos.`;

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_FALLBACK]
  .map(k => (k || '').trim())
  .filter(Boolean);

function describeGeminiError(error) {
  const raw = String(error?.message || error || '');
  const code = Number(error?.status) || undefined;

  if (code === 403 || /API key was reported as leaked|reported as leaked/i.test(raw)) {
    return {
      status: 503,
      message: 'El asistente esta temporalmente fuera de servicio por una credencial de API. Intenta de nuevo mas tarde.',
      detail: 'API key reported as leaked (revocada por Google). Reemplazar la clave.',
    };
  }
  if (code === 401 || /API key not valid|API_KEY_INVALID|UNAUTHENTICATED/i.test(raw)) {
    return {
      status: 503,
      message: 'El asistente esta temporalmente fuera de servicio por una credencial de API. Intenta de nuevo mas tarde.',
      detail: 'API key invalida o no autenticada.',
    };
  }
  if (code === 429 || /RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    return {
      status: 429,
      message: 'Se alcanzo el limite de consultas del asistente por ahora. Espera un momento e intentalo de nuevo.',
      detail: 'Cuota agotada (429).',
    };
  }
  return {
    status: 500,
    message: 'No pude procesar tu pregunta. Intenta de nuevo.',
    detail: raw,
  };
}

async function generateWithFallback(request) {
  if (API_KEYS.length === 0) {
    const err = new Error('GEMINI_API_KEY not configured');
    err.status = 500;
    throw err;
  }

  let lastError;
  for (const apiKey of API_KEYS) {
    const ai = new GoogleGenAI({ apiKey });
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      lastError = error;
      const code = Number(error?.status);
      const recoverable = code === 403 || code === 401 || code === 429 || code >= 500;
      if (!recoverable || apiKey === API_KEYS[API_KEYS.length - 1]) throw error;
      console.warn(`Gemini fallo (${code || 'sin codigo'}), probando clave de respaldo...`);
    }
  }
  throw lastError;
}

let ARTICLES = [];

function loadArticles() {
  const narrativasDir = path.join(__dirname, 'src', 'data', 'narrativas');
  const agenteDir = path.join(__dirname, 'public', 'agente');
  const map = new Map();

  // 1. Cargar las 322 investigaciones científicas completas desde src/data/narrativas
  if (fs.existsSync(narrativasDir)) {
    const files = fs.readdirSync(narrativasDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(narrativasDir, file), 'utf-8'));
        const meta = data.metadata || {};
        const b = data.blocks || {};
        const apertura = b.apertura || {};
        const conflicto = b.conflicto || {};
        const viaje = b.viaje || {};
        const revelacion = b.revelacion || {};
        const nucleo = b.nucleo || {};

        const contextParts = [
          `Título: ${meta.title || ''}`,
          `Autores: ${meta.authors || ''} (${meta.year || ''})`,
          `Revista: ${meta.journal || 'Revista Ocnos'}`,
          meta.doi ? `DOI: https://doi.org/${meta.doi}` : '',
          meta.gancho ? `Premisa: ${meta.gancho}` : '',
          apertura.contexto ? `Contexto y antecedentes: ${apertura.contexto}` : '',
          conflicto.problema ? `Problema IMRyD: ${conflicto.problema}` : '',
          conflicto.porQueImporta ? `Relevancia científica: ${conflicto.porQueImporta}` : '',
          viaje.narrativa ? `Metodología: ${viaje.narrativa}` : '',
          revelacion.narrativa ? `Resultados y hallazgos: ${revelacion.narrativa}` : '',
          Array.isArray(revelacion.hallazgos) && revelacion.hallazgos.length ? `Puntos clave: ${revelacion.hallazgos.join('; ')}` : '',
          nucleo.conclusion ? `Conclusión central: ${nucleo.conclusion}` : '',
        ].filter(Boolean).join('\n\n');

        const authorsStr = Array.isArray(meta.authors) 
          ? meta.authors.join(', ') 
          : String(meta.authors || '');

        map.set(data.id, {
          id: String(data.id),
          title: String(meta.title || data.id),
          author: authorsStr,
          year: String(meta.year || ''),
          doi: String(meta.doi || ''),
          desc: String(meta.gancho || apertura.gancho || (apertura.contexto ? apertura.contexto.slice(0, 200) : '')),
          context: contextParts,
        });
      } catch (e) {
        console.error(`Error cargando narrativa ${file}:`, e);
      }
    }
  }

  // 2. Complementar con public/agente si contiene notas adicionales
  if (fs.existsSync(agenteDir)) {
    const files = fs.readdirSync(agenteDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(agenteDir, file), 'utf-8'));
        if (!map.has(data.article_id)) {
          const auth = Array.isArray(data.authors) ? data.authors.join(', ') : String(data.authors || '');
          map.set(data.article_id, {
            id: String(data.article_id),
            title: String(data.title || data.article_id),
            author: auth,
            year: String(data.year || ''),
            doi: String(data.doi || ''),
            desc: String(data.welcome_message?.split('\n')[0]?.slice(0, 200) || ''),
            context: String(data.context_for_ai || ''),
          });
        }
      } catch (e) {
        console.error(`Error cargando agente ${file}:`, e);
      }
    }
  }

  ARTICLES = Array.from(map.values());
  console.log(`Artículos cargados en el Asistente Ocnos: ${ARTICLES.length}`);
}

function matchArticles(query, limit = 5) {
  const q = String(query || '').toLowerCase().trim();
  const stopwords = ['para', 'sobre', 'este', 'esta', 'estos', 'estas', 'como', 'cuál', 'quién', 'donde', 'hacer', 'artículo', 'artículos', 'revista', 'estudio', 'investigación'];
  const terms = q.split(/\s+/).filter(t => t.length > 2 && !stopwords.includes(t));
  
  const scored = [];
  for (const a of ARTICLES) {
    if (q.includes(a.id.toLowerCase())) {
      scored.push({ article: a, score: 100 });
      continue;
    }
    let score = 0;
    const titleLower = String(a.title || '').toLowerCase();
    const authorLower = String(a.author || '').toLowerCase();
    const descLower = String(a.desc || '').toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 5;
      if (authorLower.includes(term)) score += 4;
      if (descLower.includes(term)) score += 2;
    }
    if (score > 0) {
      scored.push({ article: a, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.article);
}

function detectArticleMention(message) {
  // 1. Comando explícito /articulo id
  const cmdMatch = message.match(/^\/articulo\s+(\S+)/i);
  if (cmdMatch) {
    const id = cmdMatch[1].toLowerCase();
    const article = ARTICLES.find(a => a.id.toLowerCase() === id);
    if (article) return article;
  }
  // 2. Coincidencia por ID de artículo
  const idMatch = ARTICLES.find(a => message.toLowerCase().includes(a.id.toLowerCase()));
  if (idMatch) return idMatch;

  // 3. Coincidencia por título si se menciona claramente
  const msgLower = message.toLowerCase();
  const directTitleMatch = ARTICLES.find(a => a.title.length > 12 && msgLower.includes(a.title.toLowerCase()));
  if (directTitleMatch) return directTitleMatch;

  // 4. Búsqueda de alta confianza si solo hay un resultado claro
  const matches = matchArticles(message, 1);
  if (matches.length === 1) return matches[0];
  return null;
}

loadArticles();

app.post('/api/chat', async (req, res) => {
  const { articleId, message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (API_KEYS.length === 0) {
    return res.status(500).json({ error: 'El asistente no esta disponible en este momento.' });
  }

  try {
    let contextForAI = '';
    let detectedArticle = null;
    let hasArticleContext = false;

    // Priority 1: Article actively being read (from MulticaminoEngine)
    if (articleId) {
      const article = ARTICLES.find(a => a.id === articleId);
      if (article) {
        contextForAI = article.context;
        hasArticleContext = true;
        detectedArticle = { id: article.id, title: article.title };
      }
    }

    // Priority 2: User mentioned an article in chat
    if (!contextForAI) {
      const mentioned = detectArticleMention(message);
      if (mentioned && mentioned.context) {
        contextForAI = mentioned.context;
        hasArticleContext = true;
        detectedArticle = { id: mentioned.id, title: mentioned.title };
      }
    }

    // Priority 3: Keyword matching
    if (!contextForAI) {
      const matched = matchArticles(message);
      if (matched.length > 0) {
        contextForAI = 'Articulos relevantes:\n' + matched.map(a =>
          `"${a.title}" de ${a.author} (${a.year}). DOI: ${a.doi}. Descripcion: ${a.desc}`
        ).join('\n\n');
      } else {
        const sample = ARTICLES.slice(0, 6);
        contextForAI = 'Muestra representativa de investigaciones del catálogo:\n' + sample.map(a =>
          `"${a.title}" de ${a.author} (${a.year}). DOI: ${a.doi}. Resumen: ${a.desc}`
        ).join('\n\n');
      }
    }

    const historyText = conversationHistory && conversationHistory.length > 0
      ? `Historial: ${conversationHistory.slice(-3).map(m => `${m.role}: ${m.text}`).join(' | ')}\n`
      : '';

    const fullPrompt = hasArticleContext && detectedArticle
      ? `${historyText}Contexto del articulo "${detectedArticle.title}":\n${contextForAI}\nUsuario: ${message}`
      : `${historyText}Contexto:\n${contextForAI}\nUsuario: ${message}`;

    const response = await generateWithFallback({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });

    const reply = response.text.trim();

    res.setHeader('X-Article-Detected', detectedArticle ? JSON.stringify(detectedArticle) : '');
    return res.status(200).json({ reply, detectedArticle });
  } catch (error) {
    const { status, message, detail } = describeGeminiError(error);
    console.error(`Gemini API error (${status}): ${detail}`);
    if (error?.stack) console.error(error.stack);
    return res.status(status).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, keysConfigured: API_KEYS.length });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Agente OCNOS API en http://localhost:${PORT}`);
  console.log(`GEMINI_API_KEY: ${API_KEYS.length ? `configurada (${API_KEYS.length} clave(s))` : 'NO configurada'}`);
});
