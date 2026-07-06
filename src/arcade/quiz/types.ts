import type { Question } from '../data/questions';

export type GamePhase = 'MENU' | 'COUNTDOWN' | 'PLAYING' | 'ANSWER_REVEALED' | 'ROUND_TRANSITION' | 'BOSS_INTRO' | 'GAME_OVER' | 'FINAL_SCORE';
export type QuizDifficulty = 'easy' | 'normal' | 'hard';

export interface RoundConfig {
  name: string; theme: string; accentColor: string;
  categoryFilter: string[]; difficultyFilter: string[]; questionCount: number;
}

export interface QuizState {
  phase: GamePhase; currentRound: number; currentQuestionIndex: number;
  score: number; lives: number; maxLives: number; combo: number; maxCombo: number;
  selectedAnswer: number | null; isCorrect: boolean | null; timeRemaining: number;
  totalTimePlayed: number; questionsCorrect: number; bossesDefeated: number;
  roundQuestions: Question[]; questionHistory: QuestionHistory[];
  difficulty: QuizDifficulty; roundStartTime: number;
}

export interface QuestionHistory {
  question: Question; selectedAnswer: number | null; isCorrect: boolean;
  pointsEarned: number; timeSpent: number;
}

export interface ScoreResult {
  basePoints: number; comboMultiplier: number; speedBonus: number; totalPoints: number;
}

export interface GradeResult { grade: string; title: string; color: string; }

export const ROUND_CONFIGS: RoundConfig[] = [
  { name: 'Fundamentos', theme: 'Primer Contacto', accentColor: '#4CAF50', categoryFilter: ['Metodología'], difficultyFilter: ['easy'], questionCount: 5 },
  { name: 'Tomoji', theme: 'Mundo de Tomoji', accentColor: '#66FCF1', categoryFilter: ['Temas de Tomoji'], difficultyFilter: ['easy', 'normal'], questionCount: 5 },
  { name: 'Didáctica', theme: 'Análisis Profundo', accentColor: '#FFE66D', categoryFilter: ['Propuesta didáctica'], difficultyFilter: ['normal'], questionCount: 5 },
  { name: 'Interculturalidad', theme: 'Filosofía e Intertextos', accentColor: '#FF2E9A', categoryFilter: ['Debate intercultural', 'Géneros e intertextos'], difficultyFilter: ['normal', 'hard'], questionCount: 5 },
  { name: 'Maestría', theme: 'Maestría Total', accentColor: '#F5F5F5', categoryFilter: [], difficultyFilter: ['hard'], questionCount: 5 },
];

export const DIFFICULTY_SETTINGS: Record<QuizDifficulty, { timerSeconds: number; bossTimerSeconds: number; livesPerRound: number; roundBufferSeconds: number }> = {
  easy: { timerSeconds: 20, bossTimerSeconds: 25, livesPerRound: 5, roundBufferSeconds: 60 },
  normal: { timerSeconds: 15, bossTimerSeconds: 20, livesPerRound: 3, roundBufferSeconds: 30 },
  hard: { timerSeconds: 10, bossTimerSeconds: 15, livesPerRound: 2, roundBufferSeconds: 15 },
};

export const LETTER_LABELS = ['A', 'B', 'C', 'D'];
export const isBossQuestion = (qi: number) => qi === 4;
export const isFinalBoss = (round: number, qi: number) => round === 5 && qi === 4;
