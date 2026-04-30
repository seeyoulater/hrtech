import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DashboardPage } from '@/pages/DashboardPage';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { useApplications } from '@/hooks/useApplications';
import styles from './App.module.css';

function AppShell() {
  const { applications } = useApplications();
  return (
    <div className={styles.shell}>
      <Header count={applications.length} />
      <main className={styles.main}>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/new" element={<GeneratorPage />} />
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
      <AppShell />
    </BrowserRouter>
  );
}
