import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'monochrome' | 'light';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', height = 48 }) => {
  const isLight = variant === 'light';

  const emblemColor = isLight ? '#FFFFFF' : '#0B5D3B';
  const textColor = isLight ? '#FFFFFF' : '#0F172A';
  const accentColor = isLight ? '#C99A32' : '#C99A32';

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Tree/Sprout Emblem */}
        <g fill={emblemColor}>
          {/* Base leaves */}
          <path d="M50 78 C30 78 15 65 10 52 C28 50 42 60 50 78 Z" />
          <path d="M50 78 C70 78 85 65 90 52 C72 50 58 60 50 78 Z" />
          
          {/* Middle leaves */}
          <path d="M50 62 C32 60 20 48 18 36 C34 36 46 48 50 62 Z" />
          <path d="M50 62 C68 60 80 48 82 36 C66 36 54 48 50 62 Z" />

          {/* Center trunk and branches */}
          <rect x="47" y="30" width="6" height="42" rx="3" />
          <path d="M47 45 L32 32 C30 30 30 26 34 26 C36 26 38 28 47 38 Z" />
          <path d="M53 45 L68 32 C70 30 70 26 66 26 C64 26 62 28 53 38 Z" />
          
          {/* Vertical branch shoots */}
          <rect x="30" y="16" width="5" height="18" rx="2.5" />
          <rect x="41" y="10" width="5" height="22" rx="2.5" />
          <rect x="54" y="10" width="5" height="22" rx="2.5" />
          <rect x="65" y="16" width="5" height="18" rx="2.5" />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem SVG */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <g fill={emblemColor}>
          {/* Outer leaf base */}
          <path d="M50 82 C28 82 12 68 8 52 C26 50 42 62 50 82 Z" />
          <path d="M50 82 C72 82 88 68 92 52 C74 50 58 62 50 82 Z" />
          
          {/* Inner foliage */}
          <path d="M50 64 C30 62 18 48 16 34 C34 34 46 48 50 64 Z" />
          <path d="M50 64 C70 62 82 48 84 34 C66 34 54 48 50 64 Z" />

          {/* Main trunk */}
          <rect x="47" y="28" width="6" height="44" rx="3" />

          {/* Sprout branch structure */}
          <path d="M47 48 L30 34 C28 32 28 28 32 28 C34 28 36 30 47 40 Z" />
          <path d="M53 48 L70 34 C72 32 72 28 68 28 C66 28 64 30 53 40 Z" />

          {/* Top shoots */}
          <rect x="28" y="14" width="5" height="20" rx="2.5" />
          <rect x="40" y="8" width="5" height="24" rx="2.5" />
          <rect x="55" y="8" width="5" height="24" rx="2.5" />
          <rect x="67" y="14" width="5" height="20" rx="2.5" />
        </g>
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline font-serif font-extrabold tracking-tight text-2xl sm:text-3xl leading-none" style={{ color: textColor }}>
          <span>Raita</span>
          <span className="relative">
            Mitra
            <span className="absolute -top-1 right-[2.2rem] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[1px] w-5 sm:w-8" style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : '#64748B' }}></div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase font-bold" style={{ color: isLight ? '#E2E8F0' : '#334155' }}>
            Social Trust
          </span>
          <div className="h-[1px] w-5 sm:w-8" style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : '#64748B' }}></div>
        </div>
      </div>
    </div>
  );
};
