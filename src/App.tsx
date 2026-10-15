import React, { useState } from 'react';
import { HistoryEntry, ProblemId } from './types/algorithms';
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('greedylab_theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [selectedProblem, setSelectedProblem] = useState<ProblemId>('coin_change');
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

  const handleThemeChange = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    try {
      localStorage.setItem('greedylab_theme', nextTheme);
    } catch {
      // The theme still changes for this session when storage is unavailable.
    }
  };

  return (
    <div className={`app-shell min-h-screen flex flex-col justify-between bg-[#fff9f5] text-[#182033] font-sans ${theme === 'dark' ? 'dark-theme' : 'light-theme'} ${activeTab === 'dashboard' ? 'home-shell' : ''}`}>
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          realWorldMode={realWorldMode}
          setRealWorldMode={setRealWorldMode}
          theme={theme}
          setTheme={handleThemeChange}
          homeVariant={activeTab === 'dashboard'}
        />

        <main className="application-pages">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} onSelectProblem={setSelectedProblem} />}
          {activeTab === 'workspace' && (
            <Workspace key={selectedProblem} initialProblem={selectedProblem} realWorldMode={realWorldMode} onSaveHistory={handleSaveHistory} />
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
