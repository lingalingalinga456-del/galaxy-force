import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { NavProgress } from '@/components/nav-progress';
import { AIAssistant } from '@/components/ai/ai-assistant';
import './styles.css';

export const metadata: Metadata = {
  title: 'Galaxy Workforce - AI-Powered Human Workforce Marketplace',
  description: 'Connect with talented freelancers and skilled workers for your projects. AI-assisted matching, contracts, and secure collaboration.',
  keywords: 'freelance, workers, marketplace, Bangladesh, AI, contracts',
  metadataBase: new URL('https://galaxyworkforce.app'),
  openGraph: {
    title: 'Galaxy Workforce',
    description: 'AI-Powered Human Workforce Marketplace',
    images: ['/og-image.png'],
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-warm-cream text-warm-ink antialiased font-body">
        <NavProgress />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
        <AIAssistant />
      </body>
    </html>
  );
}
