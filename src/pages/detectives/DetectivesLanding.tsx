import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, TrendingUp, Users, ArrowRight, ArrowLeft, Sliders, Map as MapIcon, BrainCircuit, StickyNote, MessageSquare, Trophy, RotateCw, Shuffle } from 'lucide-react';
import { GLOBAL_STATS, TOP_AUTHORS_ADULT, TOP_AUTHORS_CHILD, QUIZ_QUESTIONS, STUDY_FLASHCARDS, DOI_LINK } from './detectivesData';
import type { Flashcard } from './detectivesTypes';

export default function DetectivesLanding() {
  const [view, setView] = useState<'inicio' | 'actividades' | 'mapa' | 'flashcards' | 'quiz' | 'chat' | 'datos'>('inicio');

  // Move hooks to top level to avoid React violations
  const [cards, setCards] = useState<Flashcard[]>(() => [...STUDY_FLASHCARDS].sort(() => Math.random() - 0.5));
  const [currentCard, setCurrentCard] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const renderInicio = () => (
    <div className="space-y-8 pt-8 md:pt-16 pb-24 max-w-5xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-ocean-dark/20 text-ocean-base rounded-full text-sm font-bold">
          Datos oficiales Madrid 2024
        </motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-ocean-dark tracking-tight">
          ¿Qué leen realmente<br /><span className="text-coral">los madrileños?</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-lg text-ocean-dark/70 max-w-2xl mx-auto leading-relaxed font-bold">
          Únete al equipo de detectives de datos. Analizamos más de 2.6 millones de préstamos bibliotecarios para descubrir los misterios de la lectura pública.
        </motion.p>
        <div className="flex justify-center gap-4 pt-4">
          <button onClick={() => setView('actividades')} className="bg-coral text-white px-8 py-3 rounded-xl font-bold hover:bg-coral/90 transition-all shadow-lg shadow-coral/20">
            Empezar Investigación
          </button>
          <a href={DOI_LINK} target="_blank" rel="noopener noreferrer" className="bg-white text-ocean-dark border border-ocean-dark/20 px-8 py-3 rounded-xl font-bold hover:bg-ocean-dark/5 transition-all">
            Ver Informe
          </a>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-ocean-dark/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-ocean-dark text-white"><BookOpen size={24} /></div>
          <div>
            <p className="text-sm text-ocean-dark/50 font-bold uppercase tracking-wide">Préstamos Adultos</p>
            <h3 className="text-2xl font-bold text-ocean-dark">{(GLOBAL_STATS.adultLoans / 1000000).toFixed(2)}M</h3>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-ocean-dark/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-coral text-white"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-ocean-dark/50 font-bold uppercase tracking-wide">Concentración (Gini)</p>
            <h3 className="text-2xl font-bold text-ocean-dark">{GLOBAL_STATS.adultGini}</h3>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-ocean-dark/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-seaweed text-white"><Users size={24} /></div>
          <div>
            <p className="text-sm text-ocean-dark/50 font-bold uppercase tracking-wide">Préstamos Infantiles</p>
            <h3 className="text-2xl font-bold text-ocean-dark">{(GLOBAL_STATS.childLoans / 1000).toFixed(0)}k</h3>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {[
          { view: 'actividades', title: 'Actividades', desc: 'Simulador, mapa, flashcards y quiz', icon: <Sliders size={24} />, color: 'bg-coral' },
          { view: 'mapa', title: 'Mapa de Autores', desc: 'Visualiza la red de autores más prestados', icon: <MapIcon size={24} />, color: 'bg-seaweed' },
          { view: 'flashcards', title: 'Flashcards', desc: 'Repasa los hallazgos clave del estudio', icon: <StickyNote size={24} />, color: 'bg-purple-reef' },
          { view: 'quiz', title: 'Quiz', desc: 'Pon a prueba tu conocimiento', icon: <BrainCircuit size={24} />, color: 'bg-sand' },
        ].map((card, i) => (
          <motion.button key={card.view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => setView(card.view as any)}
            className="group text-left bg-white rounded-3xl p-6 border border-ocean-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center mb-4 shadow-md`}>{card.icon}</div>
            <h3 className="text-xl font-bold text-ocean-dark mb-2">{card.title}</h3>
            <p className="text-ocean-dark/50 text-sm leading-relaxed">{card.desc}</p>
          </motion.button>
        ))}
      </section>

      {/* Thriller Teaser */}
      <section className="bg-ocean-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-coral rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">El Fenómeno Thriller</h2>
            <p className="text-white/70 max-w-md">El {GLOBAL_STATS.thrillerPercentage}% de los libros prestados son thrillers. ¿Por qué nos gusta tanto el misterio?</p>
          </div>
          <button onClick={() => setView('actividades')} className="flex items-center bg-white text-ocean-dark px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
            Explorar <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>
    </div>
  );

  const renderMapa = () => (
    <div className="pt-8 md:pt-16 pb-24 max-w-5xl mx-auto px-4">
      <button onClick={() => setView('inicio')} className="flex items-center gap-2 text-ocean-dark/50 hover:text-ocean-dark font-bold mb-8">
        <ArrowLeft size={18} /> Volver
      </button>
      <h2 className="text-3xl font-bold text-ocean-dark flex items-center gap-2 mb-2">
        <MapIcon className="text-seaweed" /> Mapa de Autores
      </h2>
      <p className="text-ocean-dark/60 mb-8 font-bold">Top 10 autores adultos · Madrid 2024</p>
      <div className="space-y-3">
        {TOP_AUTHORS_ADULT.map((author, i) => (
          <div key={author.name}
            className="bg-white rounded-xl p-4 border border-ocean-dark/5 flex items-center justify-between group hover:shadow-md transition-all hover:border-ocean-dark/20">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-ocean-dark/10 flex items-center justify-center text-xs font-black text-ocean-dark">{i + 1}</span>
              <div>
                <p className="font-bold text-ocean-dark">{author.name}</p>
                <p className="text-xs text-ocean-dark/50"><span className={author.gender === 'F' ? 'text-coral' : 'text-ocean-base'}>{author.gender === 'F' ? 'Mujer' : 'Hombre'}</span> · {author.origin}</p>
              </div>
            </div>
            <span className="font-bold text-ocean-dark">{author.loans.toLocaleString()} <span className="text-ocean-dark/40 text-xs">préstamos</span></span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlashcards = () => {
    return (
      <div className="pt-8 md:pt-16 pb-24 max-w-3xl mx-auto px-4">
        <button onClick={() => setView('inicio')} className="flex items-center gap-2 text-ocean-dark/50 hover:text-ocean-dark font-bold mb-8">
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-ocean-dark"><StickyNote className="inline text-purple-reef" /> Flashcards</h2>
          <button onClick={() => { setCards([...STUDY_FLASHCARDS].sort(() => Math.random() - 0.5)); setCurrentCard(0); setCardFlipped(false); }}
            className="flex items-center gap-2 text-sm font-bold text-ocean-dark/60 hover:text-ocean-dark">
            <Shuffle size={16} /> Barajar
          </button>
        </div>
        <p className="text-ocean-dark/60 font-bold mb-6">Tarjeta {currentCard + 1} de {cards.length}</p>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-ocean-dark/10 min-h-[300px] cursor-pointer"
          onClick={() => setCardFlipped(!cardFlipped)}>
          {!cardFlipped ? (
            <div className="text-center">
              <p className="text-sm text-ocean-dark/40 font-bold uppercase tracking-wider mb-6">Pregunta</p>
              <h3 className="text-2xl font-bold text-ocean-dark">{cards[currentCard]?.question}</h3>
              <p className="text-ocean-dark/30 text-sm mt-8 font-bold">Toca para revelar la respuesta</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-coral font-bold uppercase tracking-wider mb-6">Respuesta</p>
              <h3 className="text-2xl font-bold text-ocean-dark mb-4">{cards[currentCard]?.answer}</h3>
              <p className="text-ocean-dark/70 font-bold">{cards[currentCard]?.detail}</p>
              <p className="text-ocean-dark/30 text-sm mt-6 italic">Fuente: {cards[currentCard]?.citation}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={() => { setCardFlipped(false); setCurrentCard(p => (p - 1 + cards.length) % cards.length); }}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-ocean-dark/10 font-bold text-ocean-dark hover:shadow-md transition-all">
            <ArrowLeft size={18} /> Anterior
          </button>
          <button onClick={() => { setCardFlipped(false); setCurrentCard(p => (p + 1) % cards.length); }}
            className="flex items-center gap-2 px-6 py-3 bg-ocean-dark text-white rounded-xl font-bold hover:bg-ocean-base transition-all">
            Siguiente <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const q = QUIZ_QUESTIONS[qIndex];
    const handleAnswer = (i: number) => {
      setQuizSelected(i);
      if (i === q.correctAnswer) setQuizScore(s => s + 1);
    };
    const next = () => {
      if (qIndex < QUIZ_QUESTIONS.length - 1) { setQIndex(i => i + 1); setQuizSelected(null); }
      else setQuizFinished(true);
    };

    return (
      <div className="pt-8 md:pt-16 pb-24 max-w-3xl mx-auto px-4">
        <button onClick={() => setView('inicio')} className="flex items-center gap-2 text-ocean-dark/50 hover:text-ocean-dark font-bold mb-8">
          <ArrowLeft size={18} /> Volver
        </button>
        {quizFinished ? (
          <div className="text-center bg-white rounded-3xl p-12 shadow-lg border border-ocean-dark/10">
            <BrainCircuit size={48} className="mx-auto text-coral mb-4" />
            <h2 className="text-3xl font-bold text-ocean-dark mb-2">¡Completaste el Quiz!</h2>
            <p className="text-5xl font-black text-coral mb-2">{quizScore}/{QUIZ_QUESTIONS.length}</p>
            <p className="text-ocean-dark/60 font-bold mb-8">{quizScore === QUIZ_QUESTIONS.length ? '¡Perfecto!' : quizScore > QUIZ_QUESTIONS.length / 2 ? '¡Buen trabajo!' : 'Sigue practicando'}</p>
            <button onClick={() => { setQIndex(0); setQuizSelected(null); setQuizScore(0); setQuizFinished(false); }}
              className="bg-ocean-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-ocean-base transition-all">
              Reintentar
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-ocean-dark"><BrainCircuit className="inline text-coral" /> Quiz</h2>
              <span className="text-ocean-dark/40 font-bold">{qIndex + 1}/{QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-ocean-dark/10">
              <h3 className="text-xl font-bold text-ocean-dark mb-8">{q?.question}</h3>
              <div className="space-y-3">
                {q?.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={quizSelected !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all ${
                      quizSelected === null ? 'border-ocean-dark/10 hover:border-ocean-dark/30 bg-white' :
                      i === q.correctAnswer ? 'border-seaweed bg-seaweed/10 text-seaweed' :
                      i === quizSelected ? 'border-coral bg-coral/10 text-coral' : 'border-ocean-dark/10 text-ocean-dark/30'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {quizSelected !== null && (
              <div className="mt-4 p-4 bg-ocean-dark/5 rounded-xl">
                <p className="font-bold text-ocean-dark">{q?.explanation}</p>
                <button onClick={next} className="mt-4 bg-coral text-white px-6 py-2 rounded-xl font-bold hover:bg-coral/90 transition-all">
                  {qIndex < QUIZ_QUESTIONS.length - 1 ? 'Siguiente' : 'Ver resultados'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const render = () => {
    switch (view) {
      case 'inicio': return renderInicio();
      case 'actividades': return renderInicio(); // The activities grid is at the bottom of Inicio
      case 'mapa': return renderMapa();
      case 'flashcards': return renderFlashcards();
      case 'quiz': return renderQuiz();
      case 'datos': return renderMapa(); // Default to mapa for now as it shows data
      default: return renderInicio();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ocean-dark/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-ocean-base" size={20} />
            <span className="font-bold text-ocean-dark">
              <span className="text-coral">#</span>LeeralosqueLeen
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { v: 'inicio' as const, label: 'Inicio' },
              { v: 'actividades' as const, label: 'Actividades' },
              { v: 'mapa' as const, label: 'Mapa' },
              { v: 'quiz' as const, label: 'Quiz' },
              { v: 'flashcards' as const, label: 'Flashcards' },
            ].map(item => (
              <button key={item.v} onClick={() => setView(item.v)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  view === item.v ? 'bg-ocean-dark text-white' : 'text-ocean-dark/50 hover:text-ocean-dark hover:bg-ocean-dark/5'
                }`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {render()}
    </div>
  );
}
