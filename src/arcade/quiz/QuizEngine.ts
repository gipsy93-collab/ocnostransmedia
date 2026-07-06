import { questions } from '../data/questions';
import type { Question } from '../data/questions';
import type { QuizState, QuizDifficulty, ScoreResult, GradeResult, RoundConfig } from './types';
import { DIFFICULTY_SETTINGS, isBossQuestion, isFinalBoss } from './types';

export function createInitialState(): QuizState {
  return { phase: 'MENU', currentRound: 1, currentQuestionIndex: 0, score: 0, lives: 3, maxLives: 3, combo: 0, maxCombo: 0, selectedAnswer: null, isCorrect: null, timeRemaining: 15, totalTimePlayed: 0, questionsCorrect: 0, bossesDefeated: 0, roundQuestions: [], questionHistory: [], difficulty: 'normal', roundStartTime: 0 };
}

export function selectQuestionsForRound(roundConfig: RoundConfig, usedQuestionIds: Set<number>): Question[] {
  let pool: Question[] = [];
  if (roundConfig.name === 'Maestría') {
    pool = questions.filter((q) => q.difficulty === 'hard' && !usedQuestionIds.has(q.id));
    if (pool.length < roundConfig.questionCount) pool = [...pool, ...questions.filter((q) => !usedQuestionIds.has(q.id) && q.difficulty === 'normal').slice(0, roundConfig.questionCount - pool.length)];
  } else {
    pool = questions.filter((q) => {
      if (usedQuestionIds.has(q.id)) return false;
      const catMatch = roundConfig.categoryFilter.length === 0 || roundConfig.categoryFilter.some((c) => q.category.includes(c));
      return catMatch && roundConfig.difficultyFilter.includes(q.difficulty);
    });
    if (pool.length < roundConfig.questionCount) pool = [...pool, ...questions.filter((q) => !usedQuestionIds.has(q.id) && !pool.some((p) => p.id === q.id) && roundConfig.difficultyFilter.includes(q.difficulty))].slice(0, roundConfig.questionCount);
  }
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  return shuffled.slice(0, roundConfig.questionCount);
}

export function getTimerForQuestion(round: number, questionIndex: number, difficulty: QuizDifficulty): number {
  const s = DIFFICULTY_SETTINGS[difficulty];
  if (isFinalBoss(round, questionIndex)) return s.bossTimerSeconds + 5;
  if (isBossQuestion(questionIndex)) return s.bossTimerSeconds;
  return s.timerSeconds;
}

export function calculateScore(isCorrect: boolean, combo: number, timeRemaining: number, isBoss: boolean, isFinalBoss: boolean): ScoreResult {
  if (!isCorrect) return { basePoints: -50, comboMultiplier: 1, speedBonus: 0, totalPoints: -50 };
  let base = 100;
  if (isFinalBoss) base = 300;
  else if (isBoss) base = 200;
  const cm = getComboMultiplier(combo);
  const sb = timeRemaining > 0 ? Math.floor(timeRemaining) * 5 : 0;
  return { basePoints: base, comboMultiplier: cm, speedBonus: sb, totalPoints: Math.floor((base + sb) * cm) };
}

export function getComboMultiplier(combo: number): number {
  if (combo >= 5) return 3;
  if (combo === 4) return 2.5;
  if (combo === 3) return 2;
  if (combo === 2) return 1.5;
  return 1;
}

export function getComboLabel(combo: number): string {
  if (combo >= 5) return 'x3';
  if (combo === 4) return 'x2.5';
  if (combo === 3) return 'x2';
  if (combo === 2) return 'x1.5';
  return 'x1';
}

export function calculateGrade(score: number): GradeResult {
  if (score >= 2500) return { grade: 'S', title: 'Maestro del Manga', color: '#FFE66D' };
  if (score >= 2000) return { grade: 'A', title: 'Experto', color: '#66FCF1' };
  if (score >= 1500) return { grade: 'B', title: 'Avanzado', color: '#4CAF50' };
  if (score >= 1000) return { grade: 'C', title: 'Intermedio', color: '#8A95A5' };
  if (score >= 500) return { grade: 'D', title: 'Principiante', color: '#FF2E9A' };
  return { grade: 'F', title: 'Novato', color: '#FF2E9A' };
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = { 'Metodología': '#66FCF1', 'Temas de Tomoji': '#FFE66D', 'Propuesta didáctica': '#FF2E9A', 'Debate intercultural': '#4CAF50', 'Géneros e intertextos': '#8A95A5', 'Verdadero/Falso': '#66FCF1' };
  return colors[category] || '#8A95A5';
}

export function getShortCategory(category: string): string {
  const shorts: Record<string, string> = { 'Metodología': 'MÉTODO', 'Temas de Tomoji': 'MANGA', 'Propuesta didáctica': 'DIDÁCTICA', 'Debate intercultural': 'CULTURA', 'Géneros e intertextos': 'NARRATIVA', 'Verdadero/Falso': 'V/F' };
  return shorts[category] || category.toUpperCase();
}
