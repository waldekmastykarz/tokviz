import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Overview } from './components/Overview';
import { Models } from './components/Models';
import { Requests } from './components/Requests';
import { EmptyState } from './components/EmptyState';

type Tab = 'overview' | 'models' | 'requests';

export function App() {
  const { spans, connected } = useWebSocket();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="app">
      <div className="header">
        <h1>
          <img className="logo" src="/favicon.svg" alt="" />
          tokviz
        </h1>
        <div className="connection-status">
          <div className={`status-dot ${connected ? 'connected' : ''}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {spans.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveTab('models')}
            >
              Models
            </button>
            <button
              className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </div>

          {activeTab === 'overview' && <Overview spans={spans} />}
          {activeTab === 'models' && <Models spans={spans} />}
          {activeTab === 'requests' && <Requests spans={spans} />}
        </>
      )}
    </div>
  );
}
