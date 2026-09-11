import {createRoot} from 'react-dom/client';
import {Component, type ErrorInfo, type ReactNode} from 'react';
import Studio from '../app/studio';
import '../app/globals.css';

class AppBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Atelier:', error, info.componentStack); }
  render() {
    if (this.state.failed) return <main style={{padding: 40, maxWidth: 650, margin: 'auto'}}><h1>Vamos reabrir seu atelier.</h1><p style={{margin: '24px 0'}}>Seus atendimentos salvos continuam neste navegador.</p><button onClick={() => location.reload()}>Recarregar aplicativo</button></main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(<AppBoundary><Studio /></AppBoundary>);
