import React, { useState } from 'react';
import { Atom, Crown, Menu, Moon, Sun, X } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  realWorldMode: boolean;
  setRealWorldMode: (mode: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  homeVariant?: boolean;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, realWorldMode, setRealWorldMode, theme, setTheme, homeVariant = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'Home' }, { id: 'algorithms', label: 'Algorithms' },
    { id: 'workspace', label: 'Lab Workspace' }, { id: 'breakit', label: 'Break Strategy' },
    { id: 'proofs', label: 'Proofs & Rigor' }, { id: 'history', label: 'History' }
  ];
  const navigate = (id: string) => {
    setMenuOpen(false);
    if (id === 'algorithms') {
      setActiveTab('dashboard');
      window.setTimeout(() => document.getElementById('algorithms')?.scrollIntoView({ behavior: 'smooth' }), 0);
    } else {
      setActiveTab(id);
      if (id === 'dashboard') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return <header className="site-header">
    <div className="nav-inner">
      <button className="brand-lockup" onClick={() => navigate('dashboard')} aria-label="GREEDYLAB home">
        <span className="brand-mark">{homeVariant ? <Crown size={24} strokeWidth={2.1} /> : <Atom size={21} strokeWidth={2.1} />}</span>
        <span className="brand-word">GREEDY<span>LAB</span></span>
      </button>
      <button className="mobile-menu-button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navItems.map(item => <button key={item.id} onClick={() => navigate(item.id)} className={`nav-link ${activeTab === item.id ? 'nav-active' : ''}`}>{homeVariant && item.id === 'breakit' ? 'Break It' : item.label}</button>)}
        <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'} mode</span>
        </button>
        <button className={`formal-toggle ${!realWorldMode ? 'formal-active' : ''}`} onClick={() => setRealWorldMode(!realWorldMode)} aria-pressed={!realWorldMode} title="Toggle formal DAA notation and real-world context">
          <span className="toggle-dot" />{realWorldMode ? 'Real-world view' : 'Formal DAA view'}
        </button>
      </nav>
    </div>
  </header>;
};
