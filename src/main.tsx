import React from 'react';
import ReactDOM from 'react-dom/client';
import { KronosProvider } from './context/KronosContext';
import { AppContent } from './App';
import '../styles.css';

// Register Service Worker for PWA (offline + desktop install)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[Kronos] SW registered:', reg.scope))
      .catch(err => console.warn('[Kronos] SW registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KronosProvider>
      <AppContent />
    </KronosProvider>
  </React.StrictMode>
);