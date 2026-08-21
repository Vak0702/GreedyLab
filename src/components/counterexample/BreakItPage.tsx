import React, { useState } from 'react';
import { CounterexampleResult, ProblemId } from '../../types/algorithms';
import { searchCounterexample } from '../../counterexamples/searchEngine';

interface Props {
  onLoadIntoWorkspace?: (problem: ProblemId, inputData: any) => void;
}

export const BreakItPage: React.FC<Props> = ({ onLoadIntoWorkspace }) => {
  const [problem, setProblem] = useState<ProblemId>('coin_change');
  const [method, setMethod] = useState<'exhaustive' | 'randomized'>('exhaustive');
  const [maxIterations, setMaxIterations] = useState(300);
  const [searchResult, setSearchResult] = useState<CounterexampleResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const triggerSearch = () => {
    setIsSearching(true);
    setSearchResult(null);
    setTimeout(() => {
      const res = searchCounterexample(problem, method, maxIterations);
      setSearchResult(res);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <span>⚡</span> Counterexample Search Engine
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          Break The Greedy Algorithm
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Deliberately challenge and break intuitive greedy heuristics by generating automated edge cases where local optimization fails.
        </p>
      </div>

      {/* Control Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-card p-5 rounded-2xl border border-brand-border shadow-lg">
        <div>
          <label className="text-xs font-mono text-gray-400 block mb-1.5 font-bold uppercase">Target Problem & Heuristic</label>
          <select
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value as ProblemId);
              setSearchResult(null);
            }}
            className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-xs sm:text-sm text-white font-medium focus:ring-1 focus:ring-rose-500"
          >
            <option value="coin_change">Coin Change (Largest-Coin Greedy)</option>
            <option value="activity_selection">Activity Selection (Earliest-Start Heuristic)</option>
            <option value="fractional_knapsack">Knapsack (Max-Value Heuristic)</option>
            <option value="job_sequencing">Job Sequencing (Earliest-Deadline Heuristic)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-gray-400 block mb-1.5 font-bold uppercase">Search Methodology</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'exhaustive' | 'randomized')}
            className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-xs sm:text-sm text-white font-medium focus:ring-1 focus:ring-rose-500"
          >
            <option value="exhaustive">Systematic Exhaustive Search (Small Bounds)</option>
            <option value="randomized">Randomized Monte Carlo Fuzzing</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-gray-400 block mb-1.5 font-bold uppercase">Search Iteration Bound</label>
          <select
            value={maxIterations}
            onChange={(e) => setMaxIterations(parseInt(e.target.value))}
            className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-xs sm:text-sm text-white font-medium focus:ring-1 focus:ring-rose-500"
          >
            <option value={100}>100 Candidate Instances</option>
            <option value={300}>300 Candidate Instances</option>
            <option value={600}>600 Candidate Instances</option>
            <option value={1200}>1200 Candidate Instances</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={triggerSearch}
            disabled={isSearching}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-rose-600/20"
          >
            {isSearching ? '🔍 Searching Space...' : 'Hunt Counterexample ⚡'}
          </button>
        </div>
      </div>

      {/* Discovered Counterexample Result */}
      {searchResult && (
        <div
          className={`p-6 rounded-2xl border transition-all shadow-xl ${
            searchResult.found
              ? 'bg-rose-950/20 border-rose-500/40'
              : 'bg-gray-900/60 border-gray-800'
          } space-y-5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                searchResult.found
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {searchResult.found ? '⚡ COUNTEREXAMPLE DISCOVERED' : 'SEARCH COMPLETED'}
            </span>
            <span className="text-xs font-mono text-gray-400">
              Evaluated <strong>{searchResult.testsRun}</strong> candidate configurations
            </span>
          </div>

          {searchResult.found ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Candidate Instance */}
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    Failing Input Instance:
                  </div>
                  <pre className="text-cyan-300 p-2 rounded-lg bg-gray-900 overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(searchResult.input, null, 2)}
                  </pre>
                </div>

                {/* Outcome Divergence */}
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    Outcome Divergence & Regret:
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-amber-300">
                      <span className="text-gray-400">Greedy Heuristic:</span>
                      <span className="font-bold">{JSON.stringify(searchResult.greedy)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span className="text-gray-400">Exact Optimal Solver:</span>
                      <span className="font-bold">{JSON.stringify(searchResult.optimal)}</span>
                    </div>
                    <div className="flex justify-between text-rose-400 font-bold border-t border-gray-800 pt-2 text-sm">
                      <span>Calculated Regret:</span>
                      <span>{searchResult.regret}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DAA Theoretical Rationale */}
              <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-500/30 text-xs text-rose-200 leading-relaxed font-sans space-y-1">
                <strong className="font-mono text-rose-300 block text-xs font-bold uppercase tracking-wider">
                  DAA Theoretical Proof Rationale for Failure:
                </strong>
                <p>{searchResult.reason}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 font-mono py-2">
              {searchResult.message}
            </div>
          )}
        </div>
      )}

      {/* Preset Reference Counterexamples */}
      <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          📚 Canonical Counterexample Catalog
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-1">
            <span className="text-amber-400 font-bold">1. Non-Canonical Coin Systems</span>
            <p className="text-gray-400 text-[11px] font-sans">
              Coins [1, 3, 4] for Target 6 produces 3 coins (4+1+1) vs optimal 2 coins (3+3).
            </p>
          </div>
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-1">
            <span className="text-amber-400 font-bold">2. Earliest Start Activity Selection</span>
            <p className="text-gray-400 text-[11px] font-sans">
              Activity [0, 10] blocks compatible activities [1, 4] and [5, 9].
            </p>
          </div>
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-1">
            <span className="text-amber-400 font-bold">3. Discrete 0/1 Knapsack Ratio Failure</span>
            <p className="text-gray-400 text-[11px] font-sans">
              Item 1 ($60, 10kg, ratio 6) + Item 2 ($100, 20kg, ratio 5) vs Capacity 30.
            </p>
          </div>
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-1">
            <span className="text-amber-400 font-bold">4. Negative Edge Weights in Dijkstra</span>
            <p className="text-gray-400 text-[11px] font-sans">
              Greedy finalized distances cannot be updated if a subsequent negative edge exists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};