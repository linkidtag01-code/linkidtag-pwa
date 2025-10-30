import './globals.css';
import SwRegister from '../components/SwRegister';

export const metadata = {
  title: 'Linkidtag',
  description: 'PWA de Linkidtag',
  manifest: '/manifest.webmanifest',
  themeColor: '#111827',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
