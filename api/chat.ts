import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `Eres un asistente conciso de la revista Ocnos sobre lectura y alfabetizacion.
Responde en espanol. 2 o 3 oraciones maximo. Directo, sin introducciones ni saludos.
Si el contexto incluye articulos especificos, respondes con sus datos.`;

function loadArticles() {
  const dirs = [
    path.join(process.cwd(), 'public', 'agente'),
    path.join(process.cwd(), 'agente'),
    path.join(__dirname, '..', 'public', 'agente'),
    path.join(__dirname, 'agente'),
  ];
  let agenteDir = dirs.find(d => fs.existsSync(d));
  if (!agenteDir) return [];
  const files = fs.readdirSync(agenteDir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(agenteDir, file), 'utf-8'));
    return {
      id: data.article_id,
      title: data.title,
      author: data.authors,
      year: data.year,
      doi: data.doi,
      desc: data.welcome_message?.split('\n')[0]?.slice(0, 200) || '',
      context: data.context_for_ai || '',
    };
  });
}

function matchArticles(query: string, articles: ReturnType<typeof loadArticles>) {
  const q = query.toLowerCase();
  return articles.filter(a => {
    const text = `${a.id} ${a.title} ${a.author} ${a.desc}`.toLowerCase();
    const terms = q.split(/\s+/).filter(t => t.length > 2);
    if (q.includes(a.id)) return true;
    return terms.some(t => text.includes(t));
  });
}

function detectArticleMention(message: string, articles: ReturnType<typeof loadArticles>) {
  const cmdMatch = message.match(/^\/articulo\s+(\S+)/i);
  if (cmdMatch) {
    const id = cmdMatch[1].toLowerCase();
    const article = articles.find(a => a.id === id);
    if (article) return article;
  }
  const idMatch = articles.find(a => message.toLowerCase().includes(a.id));
  if (idMatch) return idMatch;
  const matches = matchArticles(message, articles);
  if (matches.length === 1) return matches[0];
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleId, message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const articles = loadArticles();

  try {
    let contextForAI = '';
    let detectedArticle: { id: string; title: string } | null = null;

    if (articleId) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        contextForAI = article.context;
        detectedArticle = { id: article.id, title: article.title };
      }
    }

    if (!contextForAI) {
      const mentioned = detectArticleMention(message, articles);
      if (mentioned && mentioned.context) {
        contextForAI = mentioned.context;
        detectedArticle = { id: mentioned.id, title: mentioned.title };
      }
    }

    if (!contextForAI) {
      const matched = matchArticles(message, articles);
      if (matched.length > 0) {
        contextForAI = 'Articulos relevantes:\n' + matched.map(a =>
          `"${a.title}" de ${a.author} (${a.year}). ${a.desc}`
        ).join('\n\n');
      } else {
        contextForAI = articles.map(a =>
          `"${a.title}" de ${a.author} (${a.year}). ${a.desc}`
        ).join('\n');
      }
    }

    const ai = new GoogleGenAI({ apiKey });

    const historyText = conversationHistory && conversationHistory.length > 0
      ? `Historial: ${conversationHistory.slice(-3).map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join(' | ')}\n`
      : '';

    const fullPrompt = detectedArticle?.context
      ? `${historyText}Contexto del articulo "${detectedArticle.title}":\n${contextForAI}\nUsuario: ${message}`
      : `${historyText}Contexto:\n${contextForAI}\nUsuario: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    const rawReply = response.text;
    const reply = rawReply
      .replace(/^Agente OCNOS aqu[ií]\.?\s*/i, '')
      .replace(/^Hola[!,.]?\s*/i, '')
      .replace(/^Bienvenido[^.]*\.\s*/i, '')
      .trim();

    return res.status(200).json({ reply, detectedArticle });
  } catch (error) {
    console.error('Gemini API error:', error);
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ error: msg });
  }
}
