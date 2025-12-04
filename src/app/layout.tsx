import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext';


export const metadata: Metadata = {
  title: 'Avşarlı Otomotiv | Denizli Honaz İkinci El Araba Galerisi',
  description: 'Avşarlı Otomotiv, Denizli Honaz galericiler sitesinde güvenilir ve kaliteli ikinci el araba alım satım hizmetleri sunmaktadır. Geniş araç portföyümüzü keşfedin.',
  keywords: 'Denizli ikinci el araba, Honaz galericiler sitesi, Avşarlı Otomotiv, Denizli oto galeri, güvenilir ikinci el araç, satılık arabalar Denizli'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e3a8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 17h2c.6 0 1-.4 1-1v-3c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v3c0 .6.4 1 1 1h2'/><path d='M19 17H5v-4.3c0-.8.7-1.7 1.5-1.7h11c.8 0 1.5.9 1.5 1.7V17Z'/><path d='M5 17L3 12'/><path d='M19 17l2-5'/><circle cx='7' cy='17' r='2'/><circle cx='17' cy='17' r='2'/></svg>" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
