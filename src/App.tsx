import React, { useState } from 'react';
import { HistoryEntry } from './types/algorithms';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { Workspace } from './components/workspace/Workspace';
import { BreakItPage } from './components/counterexample/BreakItPage';
import { ProofsPage } from './components/proof/ProofsPage';
import { HistoryPage } from './components/history/HistoryPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realWorldMode, setRealWorldMode] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('greedylab_history') || '[]');
    } catch {
      return [];
    }
  });

  const handleSaveHistory = (entry: HistoryEntry) => {
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('greedylab_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('greedylab_history');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-dark text-gray-100 font-sans">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          realWorldMode={realWorldMode}
          setRealWorldMode={setRealWorldMode}
        />

        <main>
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'workspace' && (
            <Workspace realWorldMode={realWorldMode} onSaveHistory={handleSaveHistory} />
          )}
          {activeTab === 'breakit' && <BreakItPage />}
          {activeTab === 'proofs' && <ProofsPage />}
          {activeTab === 'history' && (
            <HistoryPage history={history} onClear={handleClearHistory} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;