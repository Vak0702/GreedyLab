import React, { useState } from 'react';
import { HistoryEntry } from '../../types/algorithms';

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryPage: React.FC<Props> = ({ history, onClear }) => {
  const [filter, setFilter] = useState<'all' | 'optimal' | 'suboptimal'>('all');

  const filteredHistory = history.filter(item => {
    if (filter === 'optimal') return item.isOptimal;
    if (filter === 'suboptimal') return !item.isOptimal;
    return true;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `greedylab_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <span>📜</span> Experiment History
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Recorded Algorithmic Trials</h1>
          <p className="text-sm text-gray-400 mt-1">
            Audit log of executed greedy simulations, benchmark results, and counterexample discoveries.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportToJson}
              className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-cyan-300 rounded-xl text-xs font-mono transition"
            >
              Export JSON ↓
            </button>
            <button
              onClick={onClear}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-mono transition"
            >
              Clear Logs ✕
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {history.length > 0 && (
        <div className="flex gap-2">
          {[
            { id: 'all', label: `All Trials (${history.length})` },
            { id: 'optimal', label: `Optimal Verified (${history.filter(h => h.isOptimal).length})` },
            { id: 'suboptimal', label: `Counterexamples (${history.filter(h => !h.isOptimal).length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                filter === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-brand-card p-12 rounded-3xl border border-brand-border text-center space-y-3 shadow-lg">
          <div className="text-3xl">🧪</div>
          <h3 className="text-lg font-bold text-white">No experiments recorded yet</h3>
          <p className="text-gray-400 font-sans text-xs max-w-md mx-auto">
            Launch a simulation in the Lab Workspace and click "Log Run" to preserve execution steps and regret metrics here.
          </p>
        </div>
      ) : (
        <div className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-gray-950 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4">Problem Module</th>
                  <th className="py-3.5 px-4">Greedy Strategy</th>
                  <th className="py-3.5 px-4">Greedy Result</th>
                  <th className="py-3.5 px-4">Optimal Solver</th>
                  <th className="py-3.5 px-4">Regret</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300 bg-gray-900/40">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition">
                    <td className="py-3.5 px-4 text-gray-500">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-white uppercase">{item.problem.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 text-cyan-300">{item.strategy}</td>
                    <td className="py-3.5 px-4 text-amber-300">{item.greedySummary || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-emerald-400">{item.optimalSummary || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-bold">{item.regret}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.isOptimal
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.isOptimal ? 'OPTIMAL' : 'COUNTEREXAMPLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};