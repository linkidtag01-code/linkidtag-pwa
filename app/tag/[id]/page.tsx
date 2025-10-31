import Link from 'next/link';

export default function TagProfile({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id || '');
  const isDemo = id.toLowerCase() === 'demo';

  // Datos demo para mostrar cómo se ve una placa activada
  const demo = {
    name: 'Milo',
    species: 'Canino',
    breed: 'Mestizo',
    color: 'Blanco y café',
    owner: 'Óscar',
    phone: '+503 7000 0000',
    notes: 'Amigable. Usa collar celeste.'
  };

  // Vista cuando la placa NO está activada
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

  // Vista DEMO (placa activada)
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
