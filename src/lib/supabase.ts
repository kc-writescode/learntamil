import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  WORDS: 'words',
  SENTENCES: 'sentences',
};
