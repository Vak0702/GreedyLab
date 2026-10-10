import React from 'react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  realWorldMode: boolean;
  setRealWorldMode: (mode: boolean) => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, realWorldMode, setRealWorldMode }) => (
  <header className="bg-brand-card/90 backdrop-blur-md border-b border-brand-border sticky top-0 z-50 shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setActiveTab('dashboard')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-rose-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform">
          G
        </div>
        <div>
          <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">
            GREEDYLAB
          </div>
          <div className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
            Interactive DAA Laboratory
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex items-center space-x-1 sm:space-x-1.5">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'workspace', label: 'Lab Workspace' },
          { id: 'breakit', label: 'Break Strategy ⚡' },
          { id: 'proofs', label: 'Proofs & Rigor 🎓' },
          { id: 'history', label: 'History 📜' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Real-World Mode Toggle */}
      <button
        onClick={() => setRealWorldMode(!realWorldMode)}
        className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all flex items-center gap-2 shadow-sm ${
          realWorldMode
            ? 'bg-purple-950/70 border-purple-500/60 text-purple-300 ring-2 ring-purple-500/30'
            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
        title="Toggle Real-World Context Metaphors vs Formal DAA Notation"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            realWorldMode ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'
          }`}
        ></span>
        <span className="hidden sm:inline">
          {realWorldMode ? 'Real-World Mode' : 'Formal DAA View'}
        </span>
      </button>
    </div>
  </header>
);