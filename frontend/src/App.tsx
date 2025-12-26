import { ErrorBoundary } from './components/ErrorBoundary';
import { Dashboard } from './components/Dashboard';

export function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header>
          <h1>Traffic Sentinel</h1>
        </header>
        <main>
          <Dashboard />
        </main>
      </div>
    </ErrorBoundary>
  );
}

