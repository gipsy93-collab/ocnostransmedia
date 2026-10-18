interface OcnosLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export default function OcnosLogo({
  className = '',
  width = 220,
  height = 52,
  variant = 'auto',
  showSubtitle = true,
}: OcnosLogoProps) {
  const textColor = variant === 'dark' ? '#ffffff' : variant === 'light' ? '#151d1d' : 'currentColor';
  const subtextColor = variant === 'dark' ? '#88c9d4' : variant === 'light' ? '#6c7a7a' : 'currentColor';

  return (
    <svg
      viewBox="0 0 240 60"
      width={width}
      height={height}
      className={`shrink-0 transition-opacity ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Revista OCNOS Logo"
    >
      <g transform="translate(6, 10)">
        <path
          d="M12 28 C 12 16, 22 8, 30 14 C 38 8, 48 16, 48 28 C 48 38, 30 42, 30 42 C 30 42, 12 38, 12 28 Z"
          fill="url(#gradLogoOcnos)"
          opacity="0.95"
        />
        <circle cx="23" cy="22" fill="#ffffff" r="4.5" stroke="#fa8925" strokeWidth="1.8" />
        <circle cx="37" cy="22" fill="#ffffff" r="4.5" stroke="#fa8925" strokeWidth="1.8" />
        <circle cx="23" cy="22" fill="#fa8925" r="1.8" />
        <circle cx="37" cy="22" fill="#fa8925" r="1.8" />
        <path d="M30 24 L 28.5 29 L 31.5 29 Z" fill="#fa8925" />
        <path d="M18 34 Q 30 38 42 34" fill="none" opacity="0.85" stroke="#f6d51f" strokeLinecap="round" strokeWidth="1.6" />
        <path d="M14 18 C 8 24, 8 32, 16 38" fill="none" stroke="#01b4bc" strokeLinecap="round" strokeWidth="2.2" />
        <path d="M46 18 C 52 24, 52 32, 44 38" fill="none" stroke="#01b4bc" strokeLinecap="round" strokeWidth="2.2" />
      </g>
      <text
        fill={textColor}
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="4"
        x="68"
        y="32"
      >
        OCNOS
      </text>
      {showSubtitle && (
        <text
          fill={subtextColor}
          opacity={variant === 'auto' ? 0.75 : 1}
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="2"
          style={{ textTransform: 'uppercase' }}
          x="69"
          y="44"
        >
          Revista de Literatura Infantil y Lectura
        </text>
      )}
      <defs>
        <linearGradient id="gradLogoOcnos" x1="12" y1="8" x2="48" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fa8925" />
          <stop offset="60%" stopColor="#fa5457" />
          <stop offset="100%" stopColor="#01b4bc" />
        </linearGradient>
      </defs>
    </svg>
  );
}
