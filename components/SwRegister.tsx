// components/SwRegister.tsx
'use client';

import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        // Opcional: escucha updates
        reg.onupdatefound = () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            if (installing.state === 'installed') {
              // Si hay nueva versión, avisa o recarga
              // console.log('SW actualizado. Recarga para obtener la nueva versión.');
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
