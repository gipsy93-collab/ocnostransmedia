import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Gamepad2, Play } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Link } from 'react-router-dom';

type GameAccent = 'coral' | 'seaweed' | 'sand';

interface GameCardProps {
  title: string;
  description: string;
  accent: GameAccent;
  gameId: 'qbert' | 'snake' | 'quiz';
  route: string;
  icon?: React.ReactNode;
}

const accentColors: Record<GameAccent, string> = { coral: 'var(--color-coral)', seaweed: 'var(--color-seaweed)', sand: 'var(--color-sand)' };
const bgColors: Record<GameAccent, string> = { coral: 'bg-coral', seaweed: 'bg-seaweed', sand: 'bg-sand' };
const textColors: Record<GameAccent, string> = { coral: 'text-coral', seaweed: 'text-seaweed', sand: 'text-sand' };

export default function GameCard({ title, description, accent, gameId, route, icon }: GameCardProps) {
  const highScores = useGameStore((s) => s.highScores);
  const highScore = highScores[gameId];
  const color = accentColors[accent];

  return (
    <div className={`card-3d p-6 bg-white group border-t-[12px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]`} style={{ borderTopColor: color }}>
      <div className="relative h-48 rounded-3xl overflow-hidden mb-6 bg-ocean-light/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/80 via-transparent to-transparent" aria-hidden="true"></div>
        {icon || <Gamepad2 size={64} className="text-white opacity-80 z-10" />}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <span className="px-3 py-1 bg-ocean-dark/90 text-white text-[10px] font-black rounded-full flex items-center gap-1 shadow-lg border border-white/20">
            HI-SCORE: {String(highScore).padStart(6, '0')}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 z-20" aria-hidden="true">
          <Link to={route} className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border-2 border-white/50 shadow-2xl hover:scale-110 transition-transform">
            <Play className="text-white ml-1" size={32} fill="currentColor" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between h-[120px]">
        <div>
          <h3 className="font-display text-2xl font-bold text-ocean-dark mb-2 line-clamp-1 leading-tight group-hover:text-ocean-base transition-colors">
            {title}
          </h3>
          <p className="text-sm font-bold text-ocean-dark/70 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-ocean-dark/5 mt-auto">
          <div className="flex items-center gap-2">
            <Trophy size={16} className={textColors[accent]} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${textColors[accent]}`}>TOP SCORE</span>
          </div>
          <Link to={route} className="btn-3d px-4 py-2 text-[10px] text-ocean-dark group-hover:bg-coral group-hover:text-white border-none shadow-sm">
            JUGAR
          </Link>
        </div>
      </div>
    </div>
  );
}
