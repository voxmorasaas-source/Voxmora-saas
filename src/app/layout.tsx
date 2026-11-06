import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Qallivra | AI Voice Receptionist SaaS',
  description: 'AI voice agents for clinics, salons, and wellness centers to handle calls and book appointments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans min-h-screen bg-white text-[#17213B]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
