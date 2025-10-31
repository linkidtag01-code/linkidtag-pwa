import { useState, useEffect } from 'react';

export default function ScanLog({ serial }: { serial: string }) {
  const [scans, setScans] = useState<string[]>([]);

  const handleScan = () => {
    const timestamp = new Date().toLocaleString();
    setScans([...scans, `Escaneo registrado en: ${timestamp}`]);
  };

  return (
    <div>
      <h3>Bitácora de escaneos</h3>
      <p><strong>ID de placa:</strong> {serial}</p>
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
  );
}
