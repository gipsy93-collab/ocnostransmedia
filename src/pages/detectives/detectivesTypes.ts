
export interface AuthorStat {
  name: string;
  loans: number;
  gender: 'M' | 'F' | 'N/A';
  origin: string;
  category: 'adulto' | 'infantil';
}

export interface SimulationResult {
  totalLoans: number;
  topGenres: string[];
  topAuthors: string[];
  analysis: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  prediction: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  citation: string;
  detail: string;
}
