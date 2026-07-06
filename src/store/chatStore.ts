import { create } from 'zustand';

interface ChatState {
  isOpen: boolean;
  activeArticleId: string | null;
  activeArticleTitle: string | null;
  detectedArticleId: string | null;
  detectedArticleTitle: string | null;
  setArticle: (id: string, title: string) => void;
  clearArticle: () => void;
  setDetected: (id: string, title: string) => void;
  clearDetected: () => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeArticleId: null,
  activeArticleTitle: null,
  detectedArticleId: null,
  detectedArticleTitle: null,
  setArticle: (id, title) => set({ activeArticleId: id, activeArticleTitle: title }),
  clearArticle: () => set({ activeArticleId: null, activeArticleTitle: null }),
  setDetected: (id, title) => set({ detectedArticleId: id, detectedArticleTitle: title }),
  clearDetected: () => set({ detectedArticleId: null, detectedArticleTitle: null }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

