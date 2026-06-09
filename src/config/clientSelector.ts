import { laPatronaConfig } from './clients/laPatronaConfig';
import { aguaDeCocoConfig } from './clients/aguaDeCocoConfig';
import { imagineConfig } from './clients/imagineConfig';

export type ClientConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function getClientConfig(clientName: string): ClientConfig {
  switch (clientName) {
    case 'la-patrona':
      return laPatronaConfig;
    case 'agua-de-coco':
      return aguaDeCocoConfig;
    case 'imagine':
    default:
      // Por defecto retorna la de imagine (para no romper la web principal)
      return imagineConfig;
  }
}
