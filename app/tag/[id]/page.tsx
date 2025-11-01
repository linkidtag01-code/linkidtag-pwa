'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type ScanItem = {
  ts: string;
  lat?: number;
  lng?: number;
  address?: string;
  note?: string;
};

export default function TagProfile({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id || '');
  const isDemo = id.toLowerCase() === 'demo';

  // --------- Modo dueño y coords por query ---------
  const [isOwner, setIsOwner] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      setIsOwner(q.get('owner') === '1');

      // Si vienen coords en la URL, precárgalas (para dueño)
      const qLat = q.get('lat');
      const qLng = q.get('lng');
      if (qLat && qLng && !isNaN(Number(qLat)) && !isNaN(Number(qLng))) {
        setLat(Number(qLat));
        setLng(Number(qLng));
      }
    } catch {
      setIsOwner(false);
    }
  }, []);
  // --------------------------------------------------

  const storageKey = useMemo(() => `scans-${id}`, [id]);

  const demo = {
    name: 'Milo',
    species: 'Canino',
    breed: 'Mestizo',
    color: 'Blanco y café',
    owner: 'Óscar',
    phone: '+503 7000 0000',
    notes: 'Amigable. Usa collar celeste.',
  };

  const [scans, setScans] = useState<ScanItem[]>([]);
  const [address, setAddress] = useState<string>('');
  const [isLostMode, setIsLostMode] = useState(false);

  // Cargar historial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setScans(JSON.parse(raw) as ScanItem[]);
    } catch {}
  }, [storageKey]);

  // Guardar historial
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(scans));
    } catch {}
  }, [scans, storageKey]);

  // Geocodificación inversa (dirección)
  useEffect(() => {
    const run = async () => {
      if (lat == null || lng == null) return;
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        const data = await res.json();
        const display = data?.display_name as string | undefined;
        if (display) {
          setAddress(display);
          setScans(prev => {
            if (!prev.length) return prev;
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last.lat === lat && last.lng === lng) last.address = display;
            return copy;
          });
        }
      } catch {}
    };
    run();
  }, [lat, lng]);

  const handleLostMode = () => setIsLostMode(s => !s);

  // Registrar escaneo (hecho por el encontrador)
  const handleScan = () => {
    const ts = new Date().toLocaleString();
    if (!navigator.geolocation) {
      setScans(prev => [...prev, { ts, note: 'Ubicación no disponible' }]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setAddress('');
        setScans(prev => [...prev, { ts, lat: latitude, lng: longitude }]);
      },
      err => {
        const msg = err.code === err.PERMISSION_DENIED ? 'Permiso de ubicación denegado' : 'Ubicación desconocida';
        setScans(prev => [...prev, { ts, note: msg }]);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  // Enlaces útiles con coords
  const gmapsLink = lat != null && lng != null ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const wazeLink  = lat != null && lng != null ? `https://waze.com/ul?ll=${lat}%2C${lng}&navigate=yes` : '';

  // Mensaje WhatsApp (texto)
  const waText = encodeURIComponent(
    [
      `Hola, acabo de escanear la placa ${id} (mascota: ${demo.name}).`,
      lat!=null&&lng!=null ? `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}` : `Ubicación no disponible por el navegador.`,
      address ? `Dirección aprox.: ${address}` : '',
      gmapsLink ? `Google Maps: ${gmapsLink}` : '',
    ].filter(Boolean).join('\n')
  );

  // Enlace directo para el dueño con mapa automático
  const ownerLink = lat != null && lng != null
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/tag/${encodeURIComponent(id)}?owner=1&lat=${lat}&lng=${lng}`
    : '';

  // ======= MAPA (solo dueño) =======
  const mapBox = (() => {
    if (!isOwner) return null;
    if (lat == null || lng == null) return null;

    const padLng = 0.01, padLat = 0.006;
    const bbox = [
      (lng - padLng).toFixed(6),
      (lat - padLat).toFixed(6),
      (lng + padLng).toFixed(6),
      (lat + padLat).toFixed(6),
    ].join('%2C');
    const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
      <div style={{ marginTop: 20 }}>
        <h4>Ubicación del último escaneo (solo dueño)</h4>
        {address && <p className="muted" style={{ marginTop: 6 }}>{address}</p>}
        <div style={{ width:'100%', height:400, borderRadius:12, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,.08)' }}>
          <iframe title="mapa-escaneo" src={osmEmbed} width="100%" height="100%" style={{ border:0 }} loading="lazy" />
        </div>
        <div style={{ marginTop: 8, display:'flex', gap:12, flexWrap:'wrap' }}>
          {gmapsLink && <a className="btn" href={gmapsLink} target="_blank" rel="noreferrer">Abrir en Google Maps</a>}
          {wazeLink  && <a className="btn" href={wazeLink}  target="_blank" rel="noreferrer">Abrir en Waze</a>}
        </div>
      </div>
    );
  })();
  // ================================

  const NotActivated = () => (
    <main>
      <div className="grid">
        <div className="card">
          <h2>Placa no activada</h2>
          <p className="muted">ID escaneado: <code>{id}</code></p>
          <p>Esta placa aún no está asociada a una mascota.</p>
          <div className="actions" style={{ marginTop: 12 }}>
            <Link className="btn" href="/">Inicio</Link>
          </div>
        </div>
        <div className="card">
          <h3>¿Eres el dueño?</h3>
          <p>Conecta esta placa a tu perfil para mostrar datos de contacto al escanear.</p>
          <p className="muted">Prueba la demo: <Link href="/tag/demo">/tag/demo</Link></p>
        </div>
      </div>
    </main>
  );

  if (!isDemo) return <NotActivated />;

  return (
    <main>
      <div className="grid">
        <div className="card">
          <h2>Ficha de Identificación</h2>
          <p><strong>Nombre:</strong> {demo.name}</p>
          <p><strong>Especie:</strong> {demo.species}</p>
          <p><strong>Raza:</strong> {demo.breed}</p>
          <p><strong>Color:</strong> {demo.color}</p>
          <p><strong>Contacto:</strong> {demo.owner} — {demo.phone}</p>
          <p><strong>Notas:</strong> {demo.notes}</p>

          <button className="btn" onClick={handleLostMode}>
            {isLostMode ? 'Desactivar Modo Perdido' : 'Activar Modo Perdido'}
          </button>

          {isLostMode && (
            <div className="lost-info" style={{ marginTop: 20 }}>
              <h3>¡Placa en Modo Perdido!</h3>
              <p>Contacta a: {demo.phone} ({demo.owner})</p>
              <p><strong>Nota:</strong> “¡Encontrado, por favor contacta ahora!”</p>
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <h3>Bitácora de escaneos</h3>
            <button className="btn" onClick={handleScan}>Registrar escaneo</button>

            <div style={{ marginTop: 16 }}>
              {!isOwner && (
                <p className="muted">
                  Por privacidad, el mapa solo lo ve el dueño. Envía la ubicación con los botones de abajo.
                </p>
              )}
              <h4>Historial de escaneos:</h4>
              <ul>
                {scans.map((s, i) => (
                  <li key={i}>
                    {s.ts}
                    {s.lat != null && s.lng != null ? ` — Lat: ${s.lat.toFixed(6)}, Long: ${s.lng.toFixed(6)}` : ''}
                    {isOwner && s.address ? ` — ${s.address}` : ''}
                    {s.note ? ` — ${s.note}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Acciones de envío (público y dueño) */}
          <div style={{ marginTop: 10, display:'flex', gap:12, flexWrap:'wrap' }}>
            <a className="btn" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer">
              Compartir ubicación por WhatsApp
            </a>

            {lat != null && lng != null && (
              <>
                <button
                  className="btn"
                  onClick={async () => {
                    if (!ownerLink) return;
                    try {
                      await navigator.clipboard.writeText(ownerLink);
                      alert('Enlace para el dueño copiado.');
                    } catch {
                      prompt('Copia este enlace y envíalo al dueño:', ownerLink);
                    }
                  }}
                >
                  Copiar enlace para el dueño
                </button>

                {'share' in navigator && (
                  <button
                    className="btn"
                    onClick={() =>
                      (navigator as any).share({
                        title: 'Ubicación de escaneo',
                        text: 'Enlace para el dueño con mapa automático',
                        url: ownerLink,
                      })
                    }
                  >
                    Compartir enlace
                  </button>
                )}
              </>
            )}
          </div>

          {mapBox}

          <div className="actions" style={{ marginTop: 12 }}>
            <Link className="btn" href="/">Inicio</Link>
          </div>
        </div>

        <div className="card">
          <h3>¿Qué es esto?</h3>
          <p>Quien escanee la placa verá esta ficha y podrá contactarte.</p>
          <p className="muted">Demo usando ID: <code>{id}</code></p>
          {isOwner && <p className="muted">Vista de dueño: mapa y dirección visibles.</p>}
        </div>
      </div>
    </main>
  );
}
