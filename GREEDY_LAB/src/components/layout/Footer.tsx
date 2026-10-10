import React from 'react';

export const Footer: React.FC = () => (
  <footer className="border-t border-brand-border bg-brand-card/70 py-6 mt-16 text-gray-500 font-mono text-xs">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-bold">GREEDYLAB</span>
        <span>— Interactive Greedy Algorithm Laboratory & Counterexample Explorer</span>
      </div>
      <div className="text-gray-500 text-[11px]">
        Design & Analysis of Algorithms (DAA) Laboratory
      </div>
    </div>
  </footer>
);