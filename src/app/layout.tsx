import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { AuthStateGate } from '@/components/auth/AuthStateGate';
import { LanguageProvider } from '@/context/language-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Bhumy',
  description: 'An app for a sustainable future.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <LanguageProvider>
          <FirebaseClientProvider>
            <AuthStateGate>{children}</AuthStateGate>
          </FirebaseClientProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
