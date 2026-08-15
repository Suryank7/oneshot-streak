import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz & Streak — Play To Gain Knowledge',
  description:
    'A tiny daily guessing game. Use 3 clues to guess the mystery number. One shot per day. Build your streak.',
  keywords: ['streak', 'daily game', 'guessing game', 'quiz', 'leaderboard'],
  openGraph: {
    title: 'Quiz & Streak — One guess. One streak.',
    description: 'Play to gain your knowledge and build your streak!',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f5f2eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;800&family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
