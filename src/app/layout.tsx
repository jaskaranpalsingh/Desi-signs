import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getLocalBusinessSchema } from '@/lib/seo';
import { initialSettings } from '@/lib/data/initial-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: initialSettings.seoGlobalTitle,
    template: '%s | Desi Signs Edmonton',
  },
  description: initialSettings.seoGlobalDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://desisigns.ca'),
  keywords: [
    'Signs Edmonton',
    'Commercial Signage Edmonton',
    'Channel Letters Edmonton',
    'Storefront Signs Edmonton',
    '3D Letters',
    'LED Signs Alberta',
    'Pylon Signs Edmonton',
    'Custom Neon Signs Edmonton',
    'Sign Permits Edmonton Bylaw 12800',
  ],
  authors: [{ name: 'Desi Signs Ltd.' }],
  creator: 'Desi Signs Ltd.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://desisigns.ca',
    siteName: 'Desi Signs',
    title: initialSettings.seoGlobalTitle,
    description: initialSettings.seoGlobalDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = getLocalBusinessSchema();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;800;900&family=Oswald:wght@500;700&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Poppins:wght@500;700;800&family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-ink">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
