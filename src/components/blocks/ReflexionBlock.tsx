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

  const handleDownloadFicha = () => {
    const questions = reflexion?.questions || [];
    let content = `# FICHA DE INVESTIGACIÓN Y LECTURA - REVISTA OCNOS\n\n`;
    content += `**Título:** ${metadata.title}\n`;
    content += `**Autores:** ${metadata.authors}\n`;
    content += `**Revista:** ${metadata.journal} (${metadata.year})\n`;
    content += `**DOI:** https://doi.org/${metadata.doi}\n\n`;
    content += `---\n\n`;
    content += `## PREGUNTAS Y REFLEXIONES DE ASIMILACIÓN\n\n`;
    questions.forEach((q: any, idx: number) => {
      content += `### ${idx + 1}. ${q.q}\n`;
      if (q.type === 'choice' && q.options) {
        const userChoice = answers[idx] !== undefined ? q.options[answers[idx]] : 'No respondida';
        const isCorrect = answers[idx] === q.correct;
        content += `- **Tu respuesta:** ${userChoice} (${isCorrect ? 'Correcta' : 'A revisar'})\n`;
        content += `- **Respuesta correcta:** ${q.options[q.correct]}\n\n`;
      } else {
        content += `*Reflexión abierta registrada en sesión de lectura.*\n\n`;
      }
    });
    content += `\n---\nGenerado en Revista Ocnos Transmedia\n`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_${narrative.id || 'ocnos'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div key="reflexion" role="region" aria-label="Consolidación del aprendizaje"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-14 flex flex-col justify-start min-h-full"
    >
      <div className="card-3d p-4 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-ocean-dark mb-8 sm:mb-12 text-center">
          Consolidación del Aprendizaje
        </h2>

        <div className="space-y-8 sm:space-y-12">
          {reflexion.questions?.map((q: any, idx: number) => (
            <div key={idx} className="p-4 sm:p-6 md:p-8 bg-white border-2 sm:border-4 border-ocean-dark/5 rounded-2xl sm:rounded-[2rem] shadow-sm" role="group" aria-label={`Pregunta ${idx + 1}`}>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="w-8 h-8 rounded-full bg-ocean-dark text-white flex items-center justify-center text-xs font-black" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="text-xs font-black uppercase text-ocean-dark/70 tracking-widest">
                  {q.type === 'choice' ? 'Opción Múltiple' : 'Respuesta Abierta'}
                </span>
              </div>

              <p className="text-base sm:text-xl font-bold text-ocean-dark mb-6 sm:mb-8 leading-relaxed drop-shadow-sm">{q.q}</p>

              {q.type === 'choice' ? (
                <div className="grid gap-3" role="radiogroup" aria-label={`Opciones para pregunta ${idx + 1}`}>
                  {q.options?.map((opt: string, i: number) => (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={answers[idx] === i}
                      onClick={() => setAnswers({...answers, [idx]: i})}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAnswers({...answers, [idx]: i}); } }}
                      className={`min-h-[44px] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left font-bold transition-all focus-visible:ring-4 focus-visible:ring-ocean-base focus-visible:outline-none cursor-pointer ${
                        answers[idx] === i
                        ? (i === q.correct ? 'bg-seaweed/10 border-seaweed text-seaweed' : 'bg-coral/10 border-coral text-coral')
                        : 'bg-ocean-dark/5 border-transparent text-ocean-dark hover:border-ocean-dark/20'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers[idx] === i && i === q.correct && <CheckCircle2 className="inline-block ml-2 text-seaweed" size={18} aria-label="Correcto" />}
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
            className="btn-3d px-8 py-4 bg-white text-ocean-dark flex items-center justify-center gap-3 cursor-pointer"
          >
            <RotateCcw size={20} /> REPETIR EXPERIENCIA
          </button>
          <button
            onClick={handleDownloadFicha}
            className="btn-3d px-8 py-4 bg-ocean-dark text-white flex items-center justify-center gap-3 cursor-pointer"
            title="Descargar resumen de la lectura y respuestas"
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
