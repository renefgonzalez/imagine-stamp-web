import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/useCartStore';

export function useAutoUpdate(intervalMs = 180000) {
  const [hasUpdate, setHasUpdate] = useState(false);
  const initialVersion = useRef<number | null>(null);
  const cart = useCartStore((s) => s.cart);
  const isReloading = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function checkVersion() {
      // Si ya está recargando, evitar llamadas redundantes
      if (isReloading.current) return;

      try {
        const res = await fetch(`./version.json?t=${Date.now()}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data?.version) return;

        // Si es la primera lectura, guardar la versión inicial
        if (!initialVersion.current) {
          initialVersion.current = data.version;
          return;
        }

        // Si la versión del servidor es mayor a la que tiene cargada el navegador
        if (data.version > initialVersion.current) {
          // Si el cliente NO tiene productos en su carrito, recargar automáticamente
          if (!cart || cart.length === 0) {
            isReloading.current = true;
            window.location.reload();
          } else {
            // Si el cliente está en medio de armar su pedido, no borrar su carrito; mostrar aviso sutil
            setHasUpdate(true);
          }
        }
      } catch (err) {
        // Silencioso ante desconexiones momentáneas de red móvil
      }
    }

    // 1. Chequeo inicial
    checkVersion();

    // 2. Chequeo periódico (cada 3 minutos)
    const timer = setInterval(checkVersion, intervalMs);

    // 3. Chequeo inmediato cuando el usuario regresa a la pestaña o desbloquea su celular
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [cart, intervalMs]);

  const applyUpdate = () => {
    isReloading.current = true;
    window.location.reload();
  };

  return { hasUpdate, applyUpdate };
}
