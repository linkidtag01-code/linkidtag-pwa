// components/SwRegister.tsx
'use client';

import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        // Nueva URL (distinta a la anterior) para forzar registro
        const reg = await navigator.serviceWorker.register('/sw.js?v=3', { scope: '/' });

        // Intentar update inmediato
        try { await reg.update(); } catch {}

        // Cuando haya update, tomar control
        reg.onupdatefound = () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            if (installing.state === 'installed') {
              // Opcional: recargar automáticamente
              // window.location.reload();
              // O muestra un aviso al usuario para recargar
              // console.log('Nueva versión disponible. Recarga la app.');
            }
          };
        };
      } catch (e) {
        console.error('SW register failed', e);
      }
    };

    register();
  }, []);

  return null;
}
