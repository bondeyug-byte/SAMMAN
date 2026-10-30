import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Inside the SAMMAN app, Learn runs in a frame named "samman-embed" and drops its own header.
export const embedded = window.name === 'samman-embed';
if (embedded) document.documentElement.dataset.embed = '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
