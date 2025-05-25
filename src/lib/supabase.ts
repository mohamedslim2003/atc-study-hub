
import { createClient } from '@supabase/supabase-js';

// For Lovable projects with Supabase integration, these will be automatically provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client - this will work with Lovable's native integration
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
