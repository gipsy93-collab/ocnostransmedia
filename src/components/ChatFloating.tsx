import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2, BookOpen, Minimize2, Maximize2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
}

export default function ChatFloating() {
  const { isOpen, activeArticleId, activeArticleTitle, detectedArticleId, detectedArticleTitle, setDetected, clearDetected, toggle, open, close } = useChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      // Pequeño retardo para asegurar que el DOM haya calculado la altura final del texto multilínea
      setTimeout(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, minimized]);

  // Reset messages on new article
  useEffect(() => {
    setMessages([]);
  }, [activeArticleId]);

  const linkify = (text: string) => {
    const clean = text.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_m, label, url) => url.startsWith('http') ? url : `${label} (${url})`);
    const splitRegex = /https?:\/\/[^\s<>\[\](){}"]+/g;
    const urlRegex = /(https?:\/\/[^\s<>\[\](){}"]+)/g;
    const parts = clean.split(splitRegex);
    const matches = clean.match(urlRegex);
    if (!matches) return clean;
    let result = '';
    parts.forEach((part, i) => {
      result += part;
      if (matches[i]) {
        result += `<a href="${matches[i]}" target="_blank" rel="noopener noreferrer" class="underline text-coral hover:text-white transition-colors">${matches[i]}</a>`;
      }
    });
    return result;
  };

  const handleOpen = () => {
    setMinimized(false);
    open();
    if (messages.length === 0) {
      const articleContext = activeArticleId || detectedArticleId;
      const articleName = activeArticleTitle || detectedArticleTitle;
      setMessages([{
        role: 'agent',
        text: articleContext
          ? `Estoy en contexto de "${articleName}". Pregúntame lo que quieras sobre este artículo.`
          : 'Hola, soy el agente de OCNOS. Puedo ayudarte a explorar los artículos de la revista. Pregúntame sobre cualquier tema o pídeme que te recomiende algo.',
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, text: m.text }));
      const body: { message: string; articleId?: string; conversationHistory: typeof conversationHistory } = {
        message: userMessage,
        conversationHistory,
      };
      if (activeArticleId) {
        body.articleId = activeArticleId;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error del servidor');
      }

      const result = await response.json();
      setMessages(prev => [...prev, { role: 'agent', text: result.reply }]);
      if (result.detectedArticle) {
        setDetected(result.detectedArticle.id, result.detectedArticle.title);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: err instanceof Error ? err.message : 'No pude procesar tu pregunta.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end">
      <AnimatePresence>
        {/* Chat Panel */}
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: minimized ? 'auto' : 500,
              width: minimized ? 320 : 380,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-ocean-dark/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col mb-3 w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-ocean-dark border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="text-coral shrink-0" size={18} />
                <div className="min-w-0">
                  <span className="text-white font-bold text-sm">Agente OCNOS</span>
                  {(() => {
                    const displayId = activeArticleId || detectedArticleId;
                    const displayTitle = activeArticleTitle || detectedArticleTitle;
                    if (displayId) {
                      return (
                        <div className="flex items-center gap-1 text-coral/80 text-[10px] truncate">
                          <BookOpen size={10} />
                          <span className="truncate">{displayTitle}</span>
                          {detectedArticleId && !activeArticleId && (
                            <button onClick={() => { clearDetected(); setMessages([]); }} className="text-white/40 hover:text-white ml-1" title="Quitar contexto">×</button>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={minimized ? 'Expandir' : 'Minimizar'}
                >
                  {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={close}
                  className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages (hidden when minimized) */}
            {!minimized && (
              <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'agent' && (
                      <div className="w-7 h-7 shrink-0 bg-coral/80 rounded-full flex items-center justify-center mt-0.5">
                        <Bot className="text-white" size={14} />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${msg.role === 'user'
                      ? 'bg-coral text-white rounded-br-sm'
                      : 'bg-white/10 border border-white/15 text-white/90 rounded-bl-sm'
                    }`}>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: linkify(msg.text) }} />
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 shrink-0 bg-ocean-base rounded-full flex items-center justify-center mt-0.5">
                        <User className="text-white" size={14} />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-start">
                    <div className="w-7 h-7 shrink-0 bg-coral/80 rounded-full flex items-center justify-center mt-0.5">
                      <Bot className="text-white" size={14} />
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-2xl rounded-bl-sm px-4 py-3">
                      <Loader2 className="text-white/50 animate-spin" size={16} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Input */}
            {!minimized && (
              <div className="shrink-0 border-t border-white/10 p-3">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={activeArticleId || detectedArticleId ? 'Pregunta sobre este artículo...' : 'Escribe /articulo id, o pregúntame...'}
                    rows={1}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-coral/60 transition-colors resize-none text-xs font-medium"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="shrink-0 w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white hover:bg-coral/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Enviar mensaje"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => isOpen ? close() : handleOpen()}
        whileTap={{ scale: 0.92 }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all border-2 ${isOpen
          ? 'bg-ocean-dark border-white/20 text-white hover:bg-ocean-dark/80'
          : 'bg-coral border-white/30 text-white hover:bg-coral/90 hover:-translate-y-1'
        }`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir asistente IA'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
