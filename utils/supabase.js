import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variable status (only during build/development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase URL status:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Anon Key status:', supabaseAnonKey ? 'Set' : 'Missing');
}

let supabase = null;

// Only initialize Supabase if we have the required environment variables
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export a function to get the Supabase client
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check your environment variables.');
  }
  return supabase;
};

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
}; 