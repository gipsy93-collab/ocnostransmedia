import PiramidePage from '../arcade/piramide/PiramidePage';

interface PiramideGameEmbeddedProps {
  embedded?: boolean;
  onComplete?: () => void;
}

export default function PiramideGameEmbedded({ embedded, onComplete }: PiramideGameEmbeddedProps) {
  return (
    <div className="relative">
      <PiramidePage />
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
