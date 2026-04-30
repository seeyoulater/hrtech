import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
// Side-effect import: bundles + registers every icon used in the
// app, synchronously, before React renders. No network, no flash.
import './shared/components/Icon/registerIcons';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
