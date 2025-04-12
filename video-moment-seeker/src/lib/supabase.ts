import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Query = {
  id: string;
  user_id: string;
  query: string;
  video_id: string;
  confidence: number;
  start_time: number;
  end_time: number;
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
};

export type PdfReport = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
}; 