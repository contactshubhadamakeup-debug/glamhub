// layout.tsx (root layout with PWA meta tags)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GlamHub - CRM & Marketplace for Glam Professionals',
  description: 'Subscription CRM plus public marketplace for makeup artists, hair stylists, nail artists, models, influencers, and photographers.',
  manifest: '/manifest.json',
  themeColor: '#0B2545',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GlamHub',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GlamHub" />
        <meta name="theme-color" content="#0B2545" />
      </head>
      <body>{children}</body>
    </html>
  );
}