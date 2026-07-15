import React from 'react';
import ReactDOM from 'react-dom/client';
import { KronosProvider } from './context/KronosContext';
import { AppContent } from './App';
import '../styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KronosProvider>
      <AppContent />
    </KronosProvider>
  </React.StrictMode>
);
