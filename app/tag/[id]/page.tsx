'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TagProfile({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id || '');
  const isDemo = id.toLowerCase() === 'demo';

  const demo = {
    name: 'Milo',
    species: 'Canino',
    breed: 'Mestizo',
    color: 'Blanco y café',
    owner: 'Óscar',
    phone: '+503 7000 0000',
    notes: 'Amigable. Usa collar celeste.',
  };

  const [scans, setScans] = useState<string[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isLostMode, setIsLostMode] = useState(false);

  const handleLostMode = () => setIsLostMode((s) => !s);

  const handleScan = () => {
    const timestamp = new Date().toLocaleString();

    if (!navigator.geolocation) {
      setScans((prev) => [...prev, `Escaneo: ${timestamp} — Ubicación no disponible`]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        setScans((prev) => [
          ...prev,
          `Escaneo: ${timestamp} — Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`,
        ]);
      },
      () => {
        setScans((prev) => [...prev, `Escaneo: ${timestamp} — Ubicación desconocida`]);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  // ======= MAPAS (OSM embed confiable + links externos) =======
  const mapBox = (() => {
    if (lat == null || lng == null) return null;

    const padLng = 0.01;   // ancho aprox. de la caja
    const padLat = 0.006;  // alto aprox. de la caja
    const bbox = [
      (lng - padLng).toFixed(6),
      (lat - padLat).toFixed(6),
      (lng + padLng).toFixed(6),
      (lat + padLat).toFixed(6),
    ].join('%2C');

    const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
    const gmapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const wazeLink  = `https://waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`;

    return (
      <div style={{ marginTop: 20 }}>
        <h4>Ubicación del último escaneo</h4>
        <div
          style={{
            width: '100%',
            height: 400,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,.08)',
          }}
        >
          <iframe
            title="mapa-escaneo"
            src={osmEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn" href={gmapsLink} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          <a className="btn" href={wazeLink}  target="_blank" rel="noreferrer">Abrir en Waze</a>
        </div>
      </div>
    );
  })();
  // ============================================================

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
              <p>Contacta a: +503 7000 0000 (Óscar)</p>
              <p><strong>Nota:</strong> "¡Encontrado, por favor contacta ahora!"</p>
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <h3>Bitácora de escaneos</h3>
            <button className="btn" onClick={handleScan}>Registrar escaneo</button>
            <div style={{ marginTop: 20 }}>
              <h4>Historial de escaneos:</h4>
              <ul>{scans.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
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
        </div>
      </div>
    </main>
  );
}
