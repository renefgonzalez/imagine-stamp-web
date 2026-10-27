import { useEffect, useRef, useState, useCallback } from 'react';
import { useCartStore } from '../store/useCartStore';

export function useAutoUpdate(intervalMs = 120000) {
  const [hasUpdate, setHasUpdate] = useState(false);
  const initialVersion = useRef<number | null>(null);
  const cart = useCartStore((s) => s.cart);
  const isReloading = useRef(false);

  const checkVersion = useCallback(async () => {
    // Si ya está recargando, evitar llamadas redundantes
    if (isReloading.current) return;

    try {
      // Usar ruta absoluta basada en BASE_URL para no fallar en sub-rutas (#/candymar, etc.)
      const baseUrl = import.meta.env.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const versionUrl = `${cleanBase}version.json?t=${Date.now()}`;

      const res = await fetch(versionUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) return;
      const data = await res.json();
      if (!data?.version) return;

      // Si es la primera lectura, guardar la versión inicial
      if (initialVersion.current === null) {
        initialVersion.current = data.version;
        return;
      }

      // Si la versión del servidor es más reciente que la cargada
      if (data.version > initialVersion.current) {
        // Si el cliente NO tiene productos en su carrito, recargar automáticamente
        if (!cart || cart.length === 0) {
          isReloading.current = true;
          window.location.reload();
        } else {
          // Si el cliente está armando su carrito, mostrar aviso sin borrar su selección
          setHasUpdate(true);
        }
      }
    } catch {
      // Silencioso ante desconexiones momentáneas de red móvil
    }
  }, [cart]);

  useEffect(() => {
    let isMounted = true;

    // 1. Chequeo inicial
    checkVersion();

    // 2. Chequeo periódico
    const timer = setInterval(() => {
      if (isMounted) checkVersion();
    }, intervalMs);

    // 3. Chequeo inmediato cuando el usuario regresa a la pestaña o desbloquea el móvil
    const handleReactivation = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };

    document.addEventListener('visibilitychange', handleReactivation);
    window.addEventListener('focus', handleReactivation);

    return () => {
      isMounted = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleReactivation);
      window.removeEventListener('focus', handleReactivation);
    };
  }, [checkVersion, intervalMs]);

  const applyUpdate = useCallback(() => {
    isReloading.current = true;
    window.location.reload();
  }, []);

  return { hasUpdate, applyUpdate, checkNow: checkVersion };
}

