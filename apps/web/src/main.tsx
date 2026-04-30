import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
// Side-effect import: warms the Iconify cache at boot. First load
// fetches from api.iconify.design and persists to localStorage;
// subsequent loads hit the cache synchronously (no flash).
import './shared/components/Icon/preloadIcons';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
