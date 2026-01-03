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
