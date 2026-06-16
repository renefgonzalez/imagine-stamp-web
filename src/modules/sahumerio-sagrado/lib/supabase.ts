import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qumrctjpzobjhgltflhd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bXJjdGpwem9iamhnbHRmbGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDAzNjksImV4cCI6MjA5NzExNjM2OX0.Qd3D-Iac9Xk4PCcVuby24sT_8TVWKigXfg_V8VF-s7Q';

export const supabaseSahumerio = createClient(supabaseUrl, supabaseAnonKey);
