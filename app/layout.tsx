// app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import SwRegister from '../components/SwRegister';

export const metadata: Metadata = {
  title: { default: 'Linkidtag', template: '%s • Linkidtag' },
  description: 'PWA de Linkidtag',
  applicationName: 'Linkidtag',
  manifest: '/manifest.webmanifest',
  themeColor: '#111827',
  icons: {
    icon: '/favicon.ico',                         // en /public/favicon.ico
    apple: '/icons/apple-touch-icon.png',        // en /public/icons/apple-touch-icon.png
  },
};

export const viewport: Viewport = {
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Registro del Service Worker para la PWA */}
        <SwRegister />
      </body>
    </html>
  );
}
