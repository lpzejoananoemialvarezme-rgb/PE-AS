import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { LanguageProvider } from './i18n/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </LanguageProvider>
);

// Load decorative Google Fonts strictly post-mount without blocking initial load or mobile WebViews
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const loadFontsDeferred = () => {
    try {
      if (document.getElementById('penas-google-fonts')) return;
      const link = document.createElement('link');
      link.id = 'penas-google-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    } catch {
      // System fonts remain active offline or on restricted WebViews
    }
  };
  window.setTimeout(loadFontsDeferred, 120);
}

