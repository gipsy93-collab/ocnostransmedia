import { create } from 'zustand';

export type GameType = 'qbert' | 'snake' | 'quiz' | null;
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  highScores: { qbert: number; snake: number; quiz: number };
  currentGame: GameType;
  currentScore: number;
  currentLevel: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: Difficulty;
  questionsAnswered: number;
  correctAnswers: number;
  totalPlayTime: number;

  setHighScore: (game: 'qbert' | 'snake' | 'quiz', score: number) => void;
  startGame: (game: 'qbert' | 'snake' | 'quiz') => void;
  endGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  incrementScore: (points: number) => void;
  loseLife: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  incrementQuestionsAnswered: (wasCorrect: boolean) => void;
  addPlayTime: (seconds: number) => void;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  highScores: { qbert: 0, snake: 0, quiz: 0 },
  currentGame: null,
  currentScore: 0,
  currentLevel: 1,
  lives: 3,
  isPaused: false,
  isGameOver: false,
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'normal',
  questionsAnswered: 0,
  correctAnswers: 0,
  totalPlayTime: 0,

  setHighScore: (game, score) =>
    set((state) => ({
      highScores: { ...state.highScores, [game]: Math.max(state.highScores[game], score) },
    })),

  startGame: (game) =>
    set({
      currentGame: game, currentScore: 0, currentLevel: 1, lives: 3,
      isPaused: false, isGameOver: false, questionsAnswered: 0, correctAnswers: 0,
    }),

  endGame: () =>
    set((state) => {
      const game = state.currentGame;
      const newHighScores = { ...state.highScores };
      if (game) newHighScores[game] = Math.max(newHighScores[game], state.currentScore);
      return { isGameOver: true, currentGame: null, highScores: newHighScores };
    }),

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

  incrementScore: (points) =>
    set((state) => ({ currentScore: state.currentScore + points })),

  loseLife: () =>
    set((state) => {
      const newLives = state.lives - 1;
      if (newLives <= 0) return { lives: 0, isGameOver: true, currentGame: null };
      return { lives: newLives };
    }),

  setDifficulty: (difficulty) => set({ difficulty }),

  incrementQuestionsAnswered: (wasCorrect) =>
    set((state) => ({
      questionsAnswered: state.questionsAnswered + 1,
      correctAnswers: wasCorrect ? state.correctAnswers + 1 : state.correctAnswers,
    })),

  addPlayTime: (seconds) =>
    set((state) => ({ totalPlayTime: state.totalPlayTime + seconds })),

  resetSession: () =>
    set({
      currentGame: null, currentScore: 0, currentLevel: 1, lives: 3,
      isPaused: false, isGameOver: false, questionsAnswered: 0, correctAnswers: 0,
    }),
}));
