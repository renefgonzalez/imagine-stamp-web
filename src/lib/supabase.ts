import { createClient } from '@supabase/supabase-js';

// URL y Key hardcodeados a petición para asegurar que solo afecte a este módulo/entorno
const supabaseUrl = 'https://gekbdjdwyimrotjpsqrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2JkamR3eWltcm90anBzcXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjc0NTgsImV4cCI6MjA5MTYwMzQ1OH0.gRYCz1VnGMXHTjhrsbh2jURSyD-GAPYZkftMdH8jiVg';

// El 'publish key' (sb_publishable_nvp5gZc1AYtxmmVHRREDSA_LCCqUU2i) no se usa directamente en la inicialización de Supabase, 
// pero se guarda aquí como referencia si lo necesitas para pagos/Stripe o configuraciones futuras.
// export const publishKey = 'sb_publishable_nvp5gZc1AYtxmmVHRREDSA_LCCqUU2i';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
