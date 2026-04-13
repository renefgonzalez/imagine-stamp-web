import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gekbdjdwyimrotjpsqrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2JkamR3eWltcm90anBzcXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjc0NTgsImV4cCI6MjA5MTYwMzQ1OH0.gRYCz1VnGMXHTjhrsbh2jURSyD-GAPYZkftMdH8jiVg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
