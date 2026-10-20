interface OcnosLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export default function OcnosLogo({
  className = '',
  variant = 'auto',
  showSubtitle = true,
}: OcnosLogoProps) {
  const textColor = variant === 'dark' ? '#ffffff' : variant === 'light' ? '#183446' : 'currentColor';
  const subtextColor = variant === 'dark' ? '#fa8925' : variant === 'light' ? '#e0533c' : '#fa8925';
  const tagColor = variant === 'dark' ? '#94a3b8' : variant === 'light' ? '#627b87' : '#94a3b8';

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 select-none ${className}`}>
      {/* Isotipo Circular Coral con 3 Olas Marinas */}
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Isotipo Revista Ocnos"
      >
        <defs>
          <linearGradient id="ocnosCoralGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fa8925" />
            <stop offset="100%" stopColor="#e24a4a" />
          </linearGradient>
        </defs>

        {/* Círculo Principal con Gradiente Coral */}
        <circle cx="24" cy="24" r="22" fill="url(#ocnosCoralGrad)" />
        <circle cx="24" cy="24" r="21" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.2" />

        {/* Tres Olas Marinas Caligráficas en Blanco */}
        <path
          d="M 12 18.5 Q 18 15 24 18.5 T 36 18.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 12 24 Q 18 20.5 24 24 T 36 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 12 29.5 Q 18 26 24 29.5 T 36 29.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>

      {/* Tipografía Editorial Serifa */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span
          className="text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase transition-colors"
          style={{ color: subtextColor }}
        >
          REVISTA
        </span>
        <span
          className="text-lg sm:text-xl font-bold tracking-[0.14em] font-serif transition-colors"
          style={{ color: textColor, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          OCNOS
        </span>
        {showSubtitle && (
          <span
            className="text-[8px] font-medium tracking-[0.12em] uppercase mt-0.5 hidden xl:block transition-colors"
            style={{ color: tagColor }}
          >
            Investigaciones sobre lectura
          </span>
        )}
      </div>
    </div>
  );
}
