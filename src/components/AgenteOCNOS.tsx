import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, Brain, CheckCircle2, XCircle, RotateCcw, Sparkles, BookOpen, ChevronRight, Send, Loader2, Bot, User } from 'lucide-react';

interface AgentNode {
  id: string;
  title: string;
  text: string;
  options: Array<{ label: string; target_node: string }>;
}

interface AgentQuiz {
  question: string;
  options: string[];
  correct_answer_index: number;
  feedback_correct: string;
  feedback_incorrect: string;
}

interface AgentData {
  article_id: string;
  title: string;
  authors: string;
  year: string;
  doi: string;
  welcome_message: string;
  nodes: AgentNode[];
  quizzes: AgentQuiz[];
  context_for_ai: string;
}

type ViewMode = 'welcome' | 'node' | 'quiz' | 'quiz-result';
type TabMode = 'guided' | 'chat';

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export default function AgenteOCNOS() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabMode>('guided');
  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizHistory, setQuizHistory] = useState<boolean[]>([]);
  const guidedRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/agente/${articleId}.json`);
        if (!response.ok) throw new Error(`Artículo no encontrado: ${articleId}`);
        const json = await response.json();
        setData(json);
        setLoading(false);
        // Welcome message for chat tab
        setChatMessages([{
          role: 'agent',
          text: json.welcome_message,
          timestamp: Date.now(),
        }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };
    fetchAgent();
  }, [articleId]);

  useEffect(() => {
    if (guidedRef.current) guidedRef.current.scrollTop = guidedRef.current.scrollHeight;
  }, [currentView, currentNodeId, selectedAnswer]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages, chatLoading]);

  const currentNode = data?.nodes.find(n => n.id === currentNodeId);
  const currentQuiz = data?.quizzes[currentQuizIndex];

  const handleNodeClick = (nodeId: string) => {
    setCurrentNodeId(nodeId);
    setCurrentView('node');
  };

  const handleQuizStart = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizHistory([]);
    setCurrentView('quiz');
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuiz?.correct_answer_index;
    setQuizHistory(prev => [...prev, isCorrect]);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < (data?.quizzes.length || 0) - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setCurrentView('quiz-result');
    }
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setCurrentNodeId(null);
    setSelectedAnswer(null);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading || !articleId) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: Date.now() }]);
    setChatLoading(true);

    try {
      const conversationHistory = chatMessages.map(m => ({ role: m.role, text: m.text }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, message: userMessage, conversationHistory }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error del servidor');
      }

      const result = await response.json();
      setChatMessages(prev => [...prev, { role: 'agent', text: result.reply, timestamp: Date.now() }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'agent',
        text: err instanceof Error ? err.message : 'No pude procesar tu pregunta. Intenta de nuevo.',
        timestamp: Date.now(),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-base to-ocean-dark flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <MessageCircle className="text-white" size={32} />
          </div>
          <p className="text-white font-bold text-lg">Cargando agente...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-base to-ocean-dark flex items-center justify-center px-6">
        <div className="text-center">
          <XCircle className="text-coral mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">No se encontró el artículo</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button onClick={() => navigate('/interactivos')} className="btn-3d px-8 py-3 bg-white text-ocean-dark">Volver a narrativas</button>
        </div>
      </div>
    );
  }

  const correctCount = quizHistory.filter(Boolean).length;
  const totalQuizzes = quizHistory.length;
  const scorePercent = totalQuizzes > 0 ? Math.round((correctCount / totalQuizzes) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-base to-ocean-dark flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-ocean-dark/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/interactivos')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-sm px-3 py-2 rounded-xl hover:bg-white/10">
            <ArrowLeft size={18} /> Salir
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle className="text-coral" size={20} />
            <span className="font-bold text-white text-sm truncate max-w-[180px]">{data.title}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setTab('guided')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab === 'guided' ? 'bg-coral text-white shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              Guiado
            </button>
            <button
              onClick={() => setTab('chat')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab === 'chat' ? 'bg-coral text-white shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              Chat libre
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {/* GUIDED MODE */}
          {tab === 'guided' && (
            <motion.div key="guided" ref={guidedRef} className="flex-1 overflow-y-auto px-4 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence mode="wait">
                  {currentView === 'welcome' && (
                    <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center shadow-lg">
                            <MessageCircle className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">Agente OCNOS</h3>
                            <p className="text-white/60 text-xs">{data.authors} · {data.year}</p>
                          </div>
                        </div>
                        <p className="text-white/90 text-lg leading-relaxed whitespace-pre-line">{data.welcome_message}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                          <button onClick={() => handleNodeClick('intro')} className="btn-3d px-6 py-3 bg-coral text-white flex items-center gap-2">Comenzar a leer <ChevronRight size={18} /></button>
                          <button onClick={handleQuizStart} className="btn-3d px-6 py-3 bg-white/10 text-white border border-white/20 flex items-center gap-2"><Brain size={18} /> Ir a quizzes</button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'node' && currentNode && (
                    <motion.div key={`node-${currentNodeId}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <BookOpen className="text-white" size={18} />
                          </div>
                          <h3 className="text-white font-bold text-xl">{currentNode.title}</h3>
                        </div>
                        <p className="text-white/90 text-base leading-relaxed whitespace-pre-line">{currentNode.text}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                          {currentNode.options.map((opt, i) => (
                            <button key={i} onClick={() => opt.target_node === 'quiz' ? handleQuizStart() : handleNodeClick(opt.target_node)} className="btn-3d px-5 py-3 bg-white/10 text-white border border-white/20 hover:bg-white/20 flex items-center gap-2 text-sm font-bold">
                              {opt.label} <ChevronRight size={16} />
                            </button>
                          ))}
                          <button onClick={handleBackToWelcome} className="btn-3d px-5 py-3 bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 flex items-center gap-2 text-sm">
                            <RotateCcw size={16} /> Inicio
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'quiz' && currentQuiz && (
                    <motion.div key={`quiz-${currentQuizIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-sand rounded-full flex items-center justify-center"><Brain className="text-ocean-dark" size={18} /></div>
                          <span className="text-white/60 text-sm font-bold">Pregunta {currentQuizIndex + 1} de {data.quizzes.length}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                          <div className="bg-sand h-2 rounded-full transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / data.quizzes.length) * 100}%` }} />
                        </div>
                        <p className="text-white text-lg font-bold mb-6">{currentQuiz.question}</p>
                        <div className="space-y-3" role="radiogroup">
                          {currentQuiz.options.map((opt, i) => {
                            const isSelected = selectedAnswer === i;
                            const isCorrect = i === currentQuiz.correct_answer_index;
                            const showResult = selectedAnswer !== null;
                            let bgClass = 'bg-white/5 border-white/10 hover:border-white/30';
                            if (showResult) {
                              if (isCorrect) bgClass = 'bg-seaweed/20 border-seaweed';
                              else if (isSelected) bgClass = 'bg-coral/20 border-coral';
                            }
                            return (
                              <button key={i} onClick={() => handleAnswerSelect(i)} disabled={selectedAnswer !== null} role="radio" aria-checked={isSelected} className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all ${bgClass} text-white`}>
                                <span className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {showResult && isCorrect && <CheckCircle2 className="text-seaweed ml-2" size={20} />}
                                  {showResult && isSelected && !isCorrect && <XCircle className="text-coral ml-2" size={20} />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedAnswer !== null && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-xl ${selectedAnswer === currentQuiz.correct_answer_index ? 'bg-seaweed/20 border border-seaweed/30' : 'bg-coral/20 border border-coral/30'}`}>
                            <p className="text-white font-bold">
                              {selectedAnswer === currentQuiz.correct_answer_index ? '¡Correcto! ' : 'No es correcto. '}
                              {selectedAnswer === currentQuiz.correct_answer_index ? currentQuiz.feedback_correct : currentQuiz.feedback_incorrect}
                            </p>
                          </motion.div>
                        )}
                        {selectedAnswer !== null && (
                          <div className="mt-6 flex gap-3">
                            <button onClick={handleNextQuiz} className="btn-3d px-6 py-3 bg-sand text-ocean-dark flex items-center gap-2">
                              {currentQuizIndex < data.quizzes.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'} <ChevronRight size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'quiz-result' && (
                    <motion.div key="quiz-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                          {scorePercent >= 75 ? <CheckCircle2 className="text-seaweed" size={40} /> : scorePercent >= 50 ? <Brain className="text-sand" size={40} /> : <XCircle className="text-coral" size={40} />}
                        </div>
                        <h3 className="text-white text-3xl font-bold mb-2">{scorePercent >= 75 ? '¡Excelente!' : scorePercent >= 50 ? 'Buen trabajo' : 'Sigue explorando'}</h3>
                        <p className="text-white/70 text-lg mb-6">{correctCount} de {totalQuizzes} correctas ({scorePercent}%)</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button onClick={handleQuizStart} className="btn-3d px-6 py-3 bg-white/10 text-white border border-white/20 flex items-center gap-2"><RotateCcw size={18} /> Repetir quizzes</button>
                          <button onClick={handleBackToWelcome} className="btn-3d px-6 py-3 bg-coral text-white flex items-center gap-2">Volver al inicio</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* CHAT MODE */}
          {tab === 'chat' && (
            <motion.div key="chat" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-4">
                  {chatMessages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'agent' && (
                        <div className="w-8 h-8 shrink-0 bg-coral rounded-full flex items-center justify-center mt-1">
                          <Bot className="text-white" size={16} />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-coral text-white rounded-br-md' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white/90 rounded-bl-md'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 shrink-0 bg-ocean-dark rounded-full flex items-center justify-center mt-1">
                          <User className="text-white" size={16} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                      <div className="w-8 h-8 shrink-0 bg-coral rounded-full flex items-center justify-center mt-1">
                        <Bot className="text-white" size={16} />
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl rounded-bl-md px-5 py-3">
                        <Loader2 className="text-white/60 animate-spin" size={20} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="shrink-0 bg-ocean-dark/80 backdrop-blur-md border-t border-white/10 px-4 py-4">
                <div className="max-w-3xl mx-auto flex gap-3">
                  <textarea
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Pregúntale al agente sobre este artículo..."
                    rows={1}
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder-white/40 outline-none focus:border-coral transition-colors resize-none text-sm font-bold"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="shrink-0 w-12 h-12 bg-coral rounded-2xl flex items-center justify-center text-white hover:bg-coral/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                  >
                    {chatLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="shrink-0 bg-ocean-dark/80 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-white/50">
          <span>DOI: {data.doi}</span>
          <a href={`https://doi.org/${data.doi}`} target="_blank" rel="noopener noreferrer" className="text-coral hover:text-coral/80 transition-colors font-bold">Ver artículo original →</a>
        </div>
      </footer>
    </div>
  );
}
