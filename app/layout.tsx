// app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import SwRegister from '../components/SwRegister';

export const metadata: Metadata = {
  title: { default: 'Linkidtag', template: '%s • Linkidtag' },
  description: 'PWA de Linkidtag',
  applicationName: 'Linkidtag',
  manifest: '/manifest.webmanifest',
  themeColor: '#111827',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#111827',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">Linkidtag</Link>
            <nav className="nav">
              <Link href="/" className="nav-link">Inicio</Link>
              <Link href="/tag/demo" className="nav-link">Demo</Link>
            </nav>
          </div>
        </header>

        {children}

        {/* Registro del Service Worker para la PWA */}
        <SwRegister />
      </body>
    </html>
  );
}
