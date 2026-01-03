export interface WordPair {
  id: string;
  english: string;
  tamil: string;
  topic: string;
  created_at?: string;
  updated_at?: string;
}

export interface SentencePair {
  id: string;
  english: string;
  tamil: string;
  topic: string;
  created_at?: string;
  updated_at?: string;
}

export interface Topic {
  id: string;
  name: string;
  count: number;
  pendingCount: number;
  isComplete: boolean;
  type: 'words' | 'sentences';
}

export interface StreakData {
  id?: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  total_words_learned: number;
  total_sentences_learned: number;
  created_at?: string;
  updated_at?: string;
}

// Time window in milliseconds for allowing deletion of translated items (3 minutes)
export const DELETE_WINDOW_MS = 3 * 60 * 1000;

// Check if an item with a Tamil translation can be deleted (within 3-minute window)
export function canDeleteTranslatedItem(updatedAt: string | undefined): boolean {
  if (!updatedAt) return true; // No timestamp means it can be deleted

  const translationTime = new Date(updatedAt).getTime();
  const now = Date.now();
  const elapsed = now - translationTime;

  return elapsed <= DELETE_WINDOW_MS;
}

// Get remaining time in seconds before delete is locked
export function getDeleteTimeRemaining(updatedAt: string | undefined): number {
  if (!updatedAt) return 0;

  const translationTime = new Date(updatedAt).getTime();
  const now = Date.now();
  const elapsed = now - translationTime;
  const remaining = DELETE_WINDOW_MS - elapsed;

  return Math.max(0, Math.ceil(remaining / 1000));
}
