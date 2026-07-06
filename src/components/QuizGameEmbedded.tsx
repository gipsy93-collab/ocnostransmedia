import QuizGame from '../arcade/quiz/QuizGame';

interface QuizGameEmbeddedProps {
  embedded?: boolean;
  onComplete?: () => void;
}

export default function QuizGameEmbedded({ embedded, onComplete }: QuizGameEmbeddedProps) {
  return (
    <div className="relative">
      <QuizGame />
      {embedded && (
        <div className="flex justify-center pt-4 pb-2">
          <button
            onClick={onComplete}
            className="text-xs font-bold text-[#8A95A5] hover:text-[#66FCF1] underline transition-colors"
          >
            VOLVER AL ARTÍCULO
          </button>
        </div>
      )}
    </div>
  );
}
