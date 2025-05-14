import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CSV to JSON Extractor',
  description: 'Transform CSV files with JSON data into individual JSON files named by their slugs',
  icons: {
    icon: '/csv-to-json-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/csv-to-json-logo.svg" type="image/svg+xml" />
      </head>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        <main className="w-full h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
