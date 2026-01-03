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
