import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Mounting PwnShop Mobile...');
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('PwnShop Mobile started successfully.');
} catch (error) {
  console.error('Failed to mount app:', error);
  // Fail-safe to hide splash screen on error
  if (typeof window !== 'undefined' && (window as any).hideSplash) {
    (window as any).hideSplash();
  }
}
