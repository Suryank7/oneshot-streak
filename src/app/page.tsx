import { Game } from '@/components/Game';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f2eb' }}>
      <Game />
    </main>
  );
}
