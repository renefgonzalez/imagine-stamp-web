// config.js — credenciales de Supabase (NO se commitea al repo)
// Si abres este proyecto en otra máquina, copia config.example.js a config.js
// y pega tus credenciales reales aquí.

const SUPABASE_URL = 'https://aohqycweaazbjitiuuzp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaHF5Y3dlYWF6YmppdGl1dXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDA2MTcsImV4cCI6MjA5NTE3NjYxN30.Wwt_kb-shpiq1bIpq0_bURmd4FvRcCXW6qH8qbCcuRY';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
