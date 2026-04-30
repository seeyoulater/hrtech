import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { GoalCelebration } from '@/components/GoalCelebration';
import { EmojiExplosionProvider } from '@/components/effects/EmojiExplosion';
import { DashboardPage } from '@/pages/DashboardPage';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { useApplications } from '@/hooks/useApplications';
import styles from './App.module.css';

/**
 * Wrap GeneratorPage with `key={id}` so navigating between
 * /new ↔ /applications/:id ↔ /applications/:other forces a fresh
 * mount — no stale form state, no stale letter from the previous
 * record.
 */
function GeneratorRoute() {
  const { id } = useParams();
  return <GeneratorPage key={id ?? 'new'} initialId={id} />;
}

function AppShell() {
  const { applications } = useApplications();
  return (
    <div className={styles.shell}>
      <Header count={applications.length} />
      <main className={styles.main}>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/new" element={<GeneratorRoute />} />
            <Route path="/applications/:id" element={<GeneratorRoute />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <EmojiExplosionProvider>
        <AppShell />
        <GoalCelebration />
      </EmojiExplosionProvider>
    </BrowserRouter>
  );
}
