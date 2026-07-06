import { motion } from 'motion/react';
import { RotateCcw, Download, BookOpen, CheckCircle2 } from 'lucide-react';

interface ReflexionBlockProps {
  narrative: any;
  answers: Record<number, number>;
  setAnswers: (answers: Record<number, number>) => void;
  reset: () => void;
}

export default function ReflexionBlock({ narrative, answers, setAnswers, reset }: ReflexionBlockProps) {
  const reflexion = narrative?.blocks?.reflexion;
  const metadata = narrative?.metadata;

  if (!reflexion || !metadata) return null;

  return (
    <motion.div key="reflexion" role="region" aria-label="Consolidación del aprendizaje"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-full"
    >
      <div className="card-3d p-8 md:p-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-ocean-dark mb-12 text-center">
          Consolidación del Aprendizaje
        </h2>

        <div className="space-y-12">
          {reflexion.questions?.map((q: any, idx: number) => (
            <div key={idx} className="p-8 bg-white border-4 border-ocean-dark/5 rounded-[2.5rem] shadow-lg" role="group" aria-label={`Pregunta ${idx + 1}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-ocean-dark text-white flex items-center justify-center text-xs font-black" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="text-xs font-black uppercase text-ocean-dark/70 tracking-widest">
                  {q.type === 'choice' ? 'Opción Múltiple' : 'Respuesta Abierta'}
                </span>
              </div>

              <p className="text-xl font-bold text-ocean-dark mb-8 leading-relaxed drop-shadow-sm">{q.q}</p>

              {q.type === 'choice' ? (
                <div className="grid gap-3" role="radiogroup" aria-label={`Opciones para pregunta ${idx + 1}`}>
                  {q.options?.map((opt: string, i: number) => (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={answers[idx] === i}
                      onClick={() => setAnswers({...answers, [idx]: i})}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAnswers({...answers, [idx]: i}); } }}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                        answers[idx] === i
                        ? (i === q.correct ? 'bg-seaweed/10 border-seaweed text-seaweed' : 'bg-coral/10 border-coral text-coral')
                        : 'bg-ocean-dark/5 border-transparent text-ocean-dark hover:border-ocean-dark/20'
                      }`}
                    >
                      {opt}
                      {answers[idx] === i && i === q.correct && <CheckCircle2 className="inline-block ml-2" size={18} aria-label="Correcto" />}
                    </button>
                  ))}
                  {answers[idx] !== undefined && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-sm font-bold p-4 bg-ocean-base/10 text-ocean-dark rounded-xl"
                      role="status"
                    >
                      {answers[idx] === q.correct ? '¡Correcto!' : 'Sigue intentándolo. Revisa la narrativa.'}
                    </motion.p>
                  )}
                </div>
              ) : (
                <textarea
                  className="w-full p-6 rounded-2xl bg-ocean-dark/5 border-2 border-transparent focus:border-ocean-base focus:bg-white outline-none transition-all font-bold min-h-[150px] text-ocean-dark"
                  placeholder="Escribe tu reflexión aquí..."
                  aria-label="Tu respuesta"
                ></textarea>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-16">
          <button
            onClick={reset}
            className="btn-3d px-8 py-4 bg-white text-ocean-dark flex items-center justify-center gap-3"
          >
            <RotateCcw size={20} /> REPETIR EXPERIENCIA
          </button>
          <button
            className="btn-3d px-8 py-4 bg-ocean-dark text-white flex items-center justify-center gap-3"
          >
            <Download size={20} /> DESCARGAR FICHA
          </button>
          <a
            href={`https://doi.org/${metadata.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d px-8 py-4 bg-coral text-white flex items-center justify-center gap-3"
          >
            <BookOpen size={20} /> VER ARTÍCULO (DOI)
          </a>
        </div>
      </div>
    </motion.div>
  );
}
