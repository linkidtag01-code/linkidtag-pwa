'use client'; // Esto marca el archivo como un componente de cliente

import { useState } from 'react';
import Link from 'next/link';

// Ficha de Identificación
export default function TagProfile({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id || '');
  const isDemo = id.toLowerCase() === 'demo';

  // Datos demo
  const demo = {
    name: 'Milo',
    species: 'Canino',
    breed: 'Mestizo',
    color: 'Blanco y café',
    owner: 'Óscar',
    phone: '+503 7000 0000',
    notes: 'Amigable. Usa collar celeste.',
  };

  // Bitácora de escaneos
  const [scans, setScans] = useState<string[]>([]);
  const handleScan = () => {
    const timestamp = new Date().toLocaleString();
    setScans([...scans, `Escaneo registrado en: ${timestamp}`]);
  };

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
          <p className="muted">Prueba la versión de ejemplo: <Link href="/tag/demo">/tag/demo</Link></p>
        </div>
      </div>
    </main>
  );

  if (!isDemo) return <NotActivated />;

  // Modo perdido
  const [isLostMode, setIsLostMode] = useState(false);

  const handleLostMode = () => {
    setIsLostMode(!isLostMode);
  };

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

          {/* Modo Perdido */}
          <button className="btn" onClick={handleLostMode}>
            {isLostMode ? "Desactivar Modo Perdido" : "Activar Modo Perdido"}
          </button>
          {isLostMode && (
            <div className="lost-info" style={{ marginTop: 20 }}>
              <h3>¡Placa en Modo Perdido!</h3>
              <p>Contacta a: +503 7000 0000 (Óscar)</p>
              <p><strong>Nota:</strong> "¡Encontrado, por favor, contacta ahora!"</p>
            </div>
          )}

          {/* Bitácora de Escaneos */}
          <div style={{ marginTop: 30 }}>
            <h3>Bitácora de escaneos</h3>
            <button className="btn" onClick={handleScan}>Registrar escaneo</button>
            <div style={{ marginTop: '20px' }}>
              <h4>Historial de escaneos:</h4>
              <ul>
                {scans.map((scan, index) => (
                  <li key={index}>{scan}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="actions" style={{ marginTop: 12 }}>
            <Link className="btn" href="/">Inicio</Link>
          </div>
        </div>
        <div className="card">
          <h3>¿Qué es esto?</h3>
          <p>Quien escanee la placa verá esta ficha con datos del dueño para contacto inmediato.</p>
          <p className="muted">Demo usando ID: <code>{id}</code></p>
        </div>
      </div>
    </main>
  );
}
