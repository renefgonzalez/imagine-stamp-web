import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getClientConfig } from '../config/clientSelector';

// Cache para no instanciar múltiples veces el cliente si no es necesario
const clientsCache: Record<string, SupabaseClient> = {};

export function getSupabaseClient(clientName: string): SupabaseClient {
  if (clientsCache[clientName]) {
    return clientsCache[clientName];
  }

  const config = getClientConfig(clientName);
  const client = createClient(config.supabaseUrl, config.supabaseAnonKey);
  
  clientsCache[clientName] = client;
  return client;
}
