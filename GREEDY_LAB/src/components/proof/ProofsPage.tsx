import React, { useState } from 'react';

export const ProofsPage: React.FC = () => {
  const [selectedProof, setSelectedProof] = useState<'activity' | 'mst' | 'dijkstra' | 'huffman' | 'knapsack'>('activity');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <span>🎓</span> DAA Academic Rigor
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Correctness Proofs & Complexity Matrix</h1>
        <p className="text-sm text-gray-400 mt-1">
          Formal mathematical proofs verifying why canonical greedy choices succeed, and when heuristic assumptions fail.
        </p>
      </div>

      {/* Proof Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {[
          { id: 'activity', label: '1. Activity Selection (Exchange Argument)' },
          { id: 'mst', label: '2. Kruskal & Prim (Cut Property / Matroids)' },
          { id: 'dijkstra', label: '3. Dijkstra (Optimal Substructure)' },
          { id: 'huffman', label: '4. Huffman (Prefix-Free Tree)' },
          { id: 'knapsack', label: '5. Fractional vs 0/1 Knapsack' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedProof(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition ${
              selectedProof === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Proof Card */}
      <div className="bg-brand-card p-6 sm:p-8 rounded-2xl border border-brand-border space-y-6 shadow-xl">
        {selectedProof === 'activity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-cyan-400 font-mono">Activity Selection: Exchange Argument Proof</h2>
              <span className="text-xs font-mono bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/20">
                Theorem & Induction
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                <strong className="text-white font-mono">Theorem:</strong> Greedy choice of always selecting the activity with the earliest finish time produces a maximum-cardinality set of mutually compatible activities.
              </p>

              <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3 font-mono">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Exchange Argument Step-by-Step:</div>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 font-sans text-xs">
                  <li>
                    Let <span className="font-mono text-cyan-300">G = [g_1, g_2, ..., g_k]</span> be the greedy solution ordered by finish time.
                  </li>
                  <li>
                    Let <span className="font-mono text-emerald-300">O = [o_1, o_2, ..., o_m]</span> be an optimal solution ordered by finish time with maximum size <span className="font-mono text-emerald-300">m ≥ k</span>.
                  </li>
                  <li>
                    If <span className="font-mono text-white">g_1 = o_1</span>, then optimal already contains the greedy choice.
                  </li>
                  <li>
                    If <span className="font-mono text-white">g_1 ≠ o_1</span>, by greedy definition, <span className="font-mono text-cyan-300">finish(g_1) ≤ finish(o_1)</span> since g_1 is the earliest-finishing activity overall.
                  </li>
                  <li>
                    Form a new schedule <span className="font-mono text-purple-300">O' = [g_1, o_2, ..., o_m]</span> by replacing <span className="font-mono text-emerald-300">o_1</span> with <span className="font-mono text-cyan-300">g_1</span>.
                  </li>
                  <li>
                    Since <span className="font-mono text-cyan-300">finish(g_1) ≤ finish(o_1) ≤ start(o_2)</span>, all activities in <span className="font-mono text-purple-300">O'</span> remain mutually compatible without overlapping.
                  </li>
                  <li>
                    Since <span className="font-mono text-white">|O'| = |O| = m</span>, the new set <span className="font-mono text-purple-300">O'</span> is also optimal and contains the greedy choice. By mathematical induction, <span className="font-mono text-cyan-300">k = m</span>. Q.E.D.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {selectedProof === 'mst' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-emerald-400 font-mono">MST Optimality: The Cut Property</h2>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/20">
                Matroid & Cut Invariant
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                <strong className="text-white font-mono">Cut Property Theorem:</strong> For any cut <span className="font-mono text-cyan-300">(S, V \ S)</span> in a connected graph, the minimum-weight edge <span className="font-mono text-emerald-300">e*</span> crossing the cut belongs to every Minimum Spanning Tree (MST).
              </p>

              <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3 font-mono">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Proof of Cut Property:</div>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 font-sans text-xs">
                  <li>
                    Suppose an MST <span className="font-mono text-purple-300">T</span> does not contain the minimum cut edge <span className="font-mono text-emerald-300">e* = (u, v)</span>.
                  </li>
                  <li>
                    Adding <span className="font-mono text-emerald-300">e*</span> to <span className="font-mono text-purple-300">T</span> creates a unique simple cycle <span className="font-mono text-white">C</span>.
                  </li>
                  <li>
                    Since <span className="font-mono text-white">u ∈ S</span> and <span className="font-mono text-white">v ∈ V \ S</span>, cycle <span className="font-mono text-white">C</span> must cross the cut at another edge <span className="font-mono text-rose-300">e' ≠ e*</span>.
                  </li>
                  <li>
                    Replace <span className="font-mono text-rose-300">e'</span> with <span className="font-mono text-emerald-300">e*</span> to form tree <span className="font-mono text-cyan-300">T' = (T ∪ (e*)) \ (e')</span>.
                  </li>
                  <li>
                    Weight<span className="font-mono text-cyan-300">(T')</span> = Weight<span className="font-mono text-purple-300">(T)</span> - w<span className="font-mono text-rose-300">(e')</span> + w<span className="font-mono text-emerald-300">(e*)</span>.
                  </li>
                  <li>
                    Since <span className="font-mono text-emerald-300">w(e*) ≤ w(e')</span>, Weight<span className="font-mono text-cyan-300">(T')</span> ≤ Weight<span className="font-mono text-purple-300">(T)</span>. Thus, <span className="font-mono text-cyan-300">T'</span> is an MST containing <span className="font-mono text-emerald-300">e*</span>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {selectedProof === 'dijkstra' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-purple-400 font-mono">Dijkstra Shortest Path: Invariant & Non-Negative Weights</h2>
              <span className="text-xs font-mono bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded border border-purple-500/20">
                Non-Negative Invariant
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                <strong className="text-white font-mono">Correctness Invariant:</strong> When a vertex <span className="font-mono text-cyan-300">u</span> is extracted from the priority queue and added to the finalized set <span className="font-mono text-purple-300">S</span>, its distance label <span className="font-mono text-emerald-300">d[u]</span> is the true shortest path distance from source <span className="font-mono text-white">s</span>.
              </p>

              <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3 font-mono">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Why Dijkstra Fails on Negative Edges:</div>
                <p className="text-gray-300 font-sans text-xs">
                  Dijkstra relies on the monotonic property: extending any path by an edge <span className="font-mono text-white">w(u, v) ≥ 0</span> cannot decrease the total distance. If negative edges exist, a longer path with 3 hops could later subtract cost, invalidating finalized distances.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedProof === 'huffman' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-amber-400 font-mono">Huffman Coding: Optimal Prefix-Free Tree</h2>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded border border-amber-500/20">
                Sibling Exchange Argument
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                <strong className="text-white font-mono">Lemma:</strong> Let <span className="font-mono text-cyan-300">x</span> and <span className="font-mono text-cyan-300">y</span> be the two characters with the smallest frequencies. There exists an optimal prefix code tree in which <span className="font-mono text-cyan-300">x</span> and <span className="font-mono text-cyan-300">y</span> are sibling leaves at maximum depth.
              </p>
            </div>
          </div>
        )}

        {selectedProof === 'knapsack' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-cyan-400 font-mono">Fractional vs 0/1 Knapsack: The DAA Distinction</h2>
              <span className="text-xs font-mono bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/20">
                Continuous Relaxation vs NP-Hard
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                In <strong>Fractional Knapsack</strong>, the greedy choice of taking maximum value-per-weight density is guaranteed optimal because leftover capacity can be exactly filled with a continuous fraction.
                In <strong>0/1 Knapsack</strong>, indivisible items leave discrete gaps (empty capacity), making greedy suboptimal and requiring $O(n \cdot W)$ Dynamic Programming.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Asymptotic Complexity Comparison Matrix */}
      <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <span className="text-purple-400">❖</span> Comprehensive DAA Asymptotic Complexity Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                <th className="py-3 px-3.5">Algorithm</th>
                <th className="py-3 px-3.5">Greedy Choice Strategy</th>
                <th className="py-3 px-3.5">Time Complexity</th>
                <th className="py-3 px-3.5">Space</th>
                <th className="py-3 px-3.5">Optimal Guarantee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300 bg-gray-900/30">
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Activity Selection</td>
                <td className="py-3 px-3.5 text-gray-400">Earliest Finish Time First</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(n log n)</td>
                <td className="py-3 px-3.5">O(n)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Coin Change</td>
                <td className="py-3 px-3.5 text-gray-400">Largest Denomination First</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(k log k + T/c_min)</td>
                <td className="py-3 px-3.5">O(1)</td>
                <td className="py-3 px-3.5 text-rose-400 font-semibold">Canonical Only (Can Fail)</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Fractional Knapsack</td>
                <td className="py-3 px-3.5 text-gray-400">Value / Weight Ratio Density</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(n log n)</td>
                <td className="py-3 px-3.5">O(1)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Job Sequencing</td>
                <td className="py-3 px-3.5 text-gray-400">Highest Profit First (Latest Slot)</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(n^2) or O(n log n)</td>
                <td className="py-3 px-3.5">O(d_max)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Huffman Coding</td>
                <td className="py-3 px-3.5 text-gray-400">Min-Heap Merge 2 Smallest Freq</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(n log n)</td>
                <td className="py-3 px-3.5">O(n)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Kruskal's MST</td>
                <td className="py-3 px-3.5 text-gray-400">Cheapest Edge + Union-Find</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(E log E)</td>
                <td className="py-3 px-3.5">O(V)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Prim's MST</td>
                <td className="py-3 px-3.5 text-gray-400">Cheapest Cut Frontier Edge</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O(E log V)</td>
                <td className="py-3 px-3.5">O(V + E)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-3.5 font-bold text-white">Dijkstra Shortest Path</td>
                <td className="py-3 px-3.5 text-gray-400">Nearest Unvisited Vertex Relaxation</td>
                <td className="py-3 px-3.5 text-cyan-300 font-bold">O((V + E) log V)</td>
                <td className="py-3 px-3.5">O(V)</td>
                <td className="py-3 px-3.5 text-emerald-400 font-semibold">Always Optimal (w ≥ 0)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};