import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Always log the status of environment variables
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

let supabase = null;

// Only initialize Supabase if we have the required environment variables
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}

// Export a function to get the Supabase client
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Authentication service is not configured. Environment variables missing: ' + 
      (!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : '') +
      (!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '')
    );
  }
  return supabase;
};

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabase);
}; 