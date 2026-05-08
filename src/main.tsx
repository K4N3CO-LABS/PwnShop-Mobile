import {StrictMode, Component, ReactNode, ErrorInfo} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  public state: {hasError: boolean, error: Error | null} = { hasError: false, error: null };

  constructor(props: {children: ReactNode}) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffaaaa', color: '#aa0000', fontFamily: 'sans-serif', zIndex: 99999, position: 'relative' }}>
          <h2>React Error Boundary: Something went wrong executing App.tsx</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

console.log('Mounting PwnShop Mobile...');
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('PwnShop Mobile started successfully.');
} catch (error) {
  console.error('Failed to mount app:', error);
  const fb = document.getElementById('loader-feedback');
  if (fb) {
    fb.style.display = 'block';
    fb.innerHTML = `<b>Bootstrap Error:</b> ${error instanceof Error ? error.message : String(error)}`;
  }
}
