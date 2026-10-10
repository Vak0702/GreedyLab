import React from 'react';
import { ProblemId } from '../../types/algorithms';

interface Props {
  setActiveTab: (tab: string) => void;
  onSelectProblem?: (problem: ProblemId) => void;
}

export const Dashboard: React.FC<Props> = ({ setActiveTab }) => {
  const algorithms = [
    {
      id: 'coin_change',
      name: 'Coin Change Problem',
      real: 'Cashier Change-Making',
      diff: 'Fundamental',
      desc: 'Largest denomination greedy choice. Provably fails for non-canonical denomination systems like [1, 3, 4] at target 6.',
      time: 'O(k log k + T/c_min)',
      optimal: 'DP O(k · T)',
      badge: 'Flagship Counterexample'
    },
    {
      id: 'activity_selection',
      name: 'Activity Selection',
      real: 'Meeting Room Scheduler',
      diff: 'Core DAA',
      desc: 'Earliest finish time greedy strategy. Provably optimal via mathematical exchange argument.',
      time: 'O(n log n)',
      optimal: 'Earliest Finish Time',
      badge: 'Exchange Argument'
    },
    {
      id: 'fractional_knapsack',
      name: 'Fractional Knapsack',
      real: 'Emergency Cargo Supply',
      diff: 'Intermediate',
      desc: 'Value-to-weight ratio greedy choice. Contrasted with NP-Hard 0/1 Knapsack where greedy fails.',
      time: 'O(n log n)',
      optimal: 'Ratio Sorting',
      badge: 'Continuous vs 0/1'
    },
    {
      id: 'job_sequencing',
      name: 'Job Sequencing with Deadlines',
      real: 'Production Task Planner',
      diff: 'Intermediate',
      desc: 'Highest profit job prioritized into the latest available free time slot before deadline.',
      time: 'O(n^2) / O(n log n)',
      optimal: 'Greedy / Matroid Theory',
      badge: 'Slot Allocation'
    },
    {
      id: 'huffman',
      name: 'Huffman Coding',
      real: 'Lossless Data Compression',
      diff: 'Advanced',
      desc: 'Bottom-up priority queue merging of two least frequent trees to build optimal prefix-free codes.',
      time: 'O(n log n)',
      optimal: 'Min-Heap Priority Queue',
      badge: 'Prefix-Free Tree'
    },
    {
      id: 'kruskal',
      name: "Kruskal's MST Algorithm",
      real: 'Campus Fiber Network',
      diff: 'Core DAA',
      desc: 'Sorts all edges ascending and selects cheapest non-cycle edges using Disjoint Set Union (DSU).',
      time: 'O(E log E)',
      optimal: 'Union-Find / DSU',
      badge: 'Cut Property'
    },
    {
      id: 'prim',
      name: "Prim's MST Algorithm",
      real: 'Infrastructure Grid Expansion',
      diff: 'Core DAA',
      desc: 'Grows a single minimum spanning tree from a source vertex by repeatedly crossing the cut frontier.',
      time: 'O(E log V)',
      optimal: 'Priority Queue Cut',
      badge: 'Growing Tree'
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Shortest Path",
      real: 'GPS Navigation Routing',
      diff: 'Core DAA',
      desc: 'Single-source shortest path on non-negative weighted graphs via iterative edge relaxation.',
      time: 'O((V + E) log V)',
      optimal: 'Min-Heap Priority Queue',
      badge: 'Relaxation Invariant'
    }
  ];

  const learningStages = [
    { title: '1. LEARN', desc: 'Understand the problem & greedy choice property' },
    { title: '2. EXPERIMENT', desc: 'Modify inputs, change heuristics, test edge cases' },
    { title: '3. COMPARE', desc: 'Benchmark greedy against exact/optimal DP solvers' },
    { title: '4. BREAK', desc: 'Hunt counterexamples where greedy heuristics fail' },
    { title: '5. PROVE', desc: 'Study exchange arguments and matroid optimality' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-card via-gray-900 to-brand-card border border-brand-border p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span>⚡</span> Interactive Greedy Algorithm Laboratory & Counterexample Explorer
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Don't Just Visualize the Greedy Choice. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              Challenge It.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            An academically rigorous, interactive laboratory for Design and Analysis of Algorithms (DAA).
            Watch step-by-step decisions, compare against exact Dynamic Programming solvers, calculate regret, and hunt counterexamples that break intuitive heuristics.
          </p>

          {/* 5-Step Workflow Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {learningStages.map((stage, idx) => (
              <div key={idx} className="bg-gray-950/70 p-2.5 rounded-xl border border-gray-800 text-left">
                <div className="text-cyan-400 font-mono font-black text-xs">{stage.title}</div>
                <div className="text-[10px] text-gray-400 font-sans leading-tight mt-0.5">{stage.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => setActiveTab('workspace')}
              className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 font-mono"
            >
              Launch Lab Workspace →
            </button>
            <button
              onClick={() => setActiveTab('breakit')}
              className="px-6 py-3.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-bold rounded-xl text-sm transition font-mono"
            >
              ⚡ Break a Greedy Strategy
            </button>
            <button
              onClick={() => setActiveTab('proofs')}
              className="px-6 py-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl text-sm transition font-mono"
            >
              🎓 Proofs & Asymptotics
            </button>
          </div>
        </div>
      </div>

      {/* Flagship Demonstration Spotlight Card */}
      <div className="bg-gradient-to-r from-amber-950/30 via-brand-card to-brand-card p-6 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <span>⭐</span> Flagship DAA Demonstration: Coin Change Failure
          </div>
          <h3 className="text-xl font-bold text-white">
            Systematic Counterexample: Coins = [1, 3, 4], Target = 6
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Greedy picks locally largest denomination <strong>4</strong>, leaving a remainder of 2 which requires two 1s (<strong>4 + 1 + 1 = 3 coins</strong>).
            The exact Dynamic Programming solver finds <strong>3 + 3 = 2 coins</strong>. Regret = 1 extra coin!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('workspace')}
          className="whitespace-nowrap px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold font-mono text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
        >
          Inspect in Laboratory →
        </button>
      </div>

      {/* Algorithm Suite Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-cyan-400">❖</span> Classical DAA Greedy Laboratory Modules (8)
          </h2>
          <span className="text-xs font-mono text-gray-500">Click any module to experiment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {algorithms.map((algo) => (
            <div
              key={algo.id}
              className="bg-brand-card p-5 rounded-2xl border border-brand-border flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition group"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-400 font-bold truncate max-w-[140px]">{algo.real}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                    {algo.diff}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {algo.name}
                </h3>

                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  {algo.badge}
                </span>

                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {algo.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between font-mono text-xs">
                <span className="text-[11px] text-gray-500">{algo.time}</span>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold group-hover:translate-x-0.5 transition"
                >
                  Experiment →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};