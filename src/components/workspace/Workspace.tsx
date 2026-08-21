import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  KnapsackItem,
  JobItem,
  GraphNode,
  GraphEdge,
  HistoryEntry,
  AlgorithmStep,
  ProblemId
} from '../../types/algorithms';

// Greedy Algorithms
import { runActivitySelection, ActivityStrategy } from '../../algorithms/greedy/activitySelection';
import { solveActivitySelectionOptimal } from '../../algorithms/optimal/activitySelectionOptimal';
import { runCoinChangeGreedy } from '../../algorithms/greedy/coinChange';
import { solveCoinChangeDP } from '../../algorithms/optimal/coinChangeDP';
import { runFractionalKnapsack, KnapsackStrategy } from '../../algorithms/greedy/fractionalKnapsack';
import { solveFractionalKnapsackOptimal, solve01KnapsackDP } from '../../algorithms/optimal/fractionalKnapsackOptimal';
import { runJobSequencing, JobStrategy } from '../../algorithms/greedy/jobSequencing';
import { solveJobSequencingOptimal } from '../../algorithms/optimal/jobSequencingOptimal';
import { runHuffmanCoding, buildHuffmanTreeFromText, HuffmanInputItem } from '../../algorithms/greedy/huffman';
import { runKruskal } from '../../algorithms/greedy/kruskal';
import { runPrim } from '../../algorithms/greedy/prim';
import { runDijkstra } from '../../algorithms/greedy/dijkstra';

// Visualizers
import { ActivityTimeline } from '../visualization/ActivityTimeline';
import { CoinChangeVisualizer } from '../visualization/CoinChangeVisualizer';
import { KnapsackVisualizer } from '../visualization/KnapsackVisualizer';
import { JobSequencingVisualizer } from '../visualization/JobSequencingVisualizer';
import { HuffmanVisualizer } from '../visualization/HuffmanVisualizer';
import { GraphVisualizer } from '../visualization/GraphVisualizer';
import { ALGORITHM_COMPLEXITIES, runAlgorithmBenchmark, BenchmarkPoint } from '../../analysis/complexity';

interface Props {
  realWorldMode: boolean;
  onSaveHistory: (entry: HistoryEntry) => void;
}

export const Workspace: React.FC<Props> = ({ realWorldMode, onSaveHistory }) => {
  const [problem, setProblem] = useState<ProblemId>('coin_change');
  const [strategy, setStrategy] = useState<string>('earliest_finish');
  const [activeBottomTab, setActiveBottomTab] = useState<'comparison' | 'trace' | 'complexity' | 'proof'>('comparison');
  const [saveToast, setSaveToast] = useState(false);
  const [benchmarks, setBenchmarks] = useState<BenchmarkPoint[] | null>(null);

  // 1. Coin Change State
  const [coinInput, setCoinInput] = useState('1, 3, 4');
  const [targetInput, setTargetInput] = useState(6);

  // 2. Activity Selection State
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'A1', start: 1, finish: 4 },
    { id: 'A2', start: 3, finish: 5 },
    { id: 'A3', start: 0, finish: 6 },
    { id: 'A4', start: 5, finish: 7 },
    { id: 'A5', start: 8, finish: 9 },
    { id: 'A6', start: 5, finish: 9 },
  ]);

  // 3. Fractional Knapsack State
  const [knapsackItems, setKnapsackItems] = useState<KnapsackItem[]>([
    { name: 'Item A', weight: 5, value: 50 },
    { name: 'Item B', weight: 10, value: 60 },
    { name: 'Item C', weight: 3, value: 45 },
    { name: 'Item D', weight: 7, value: 70 },
  ]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(15);

  // 4. Job Sequencing State
  const [jobs, setJobs] = useState<JobItem[]>([
    { id: 'J1', deadline: 2, profit: 100 },
    { id: 'J2', deadline: 1, profit: 19 },
    { id: 'J3', deadline: 2, profit: 27 },
    { id: 'J4', deadline: 1, profit: 25 },
    { id: 'J5', deadline: 3, profit: 15 },
  ]);

  // 5. Huffman State
  const [huffmanText, setHuffmanText] = useState('ABRACADABRA');

  // 6. Graph State (for Kruskal, Prim, Dijkstra)
  const defaultGraphNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 60, y: 130 },
    { id: 'B', label: 'B', x: 180, y: 50 },
    { id: 'C', label: 'C', x: 180, y: 210 },
    { id: 'D', label: 'D', x: 340, y: 50 },
    { id: 'E', label: 'E', x: 340, y: 210 },
    { id: 'F', label: 'F', x: 460, y: 130 },
  ];

  const defaultGraphEdges: GraphEdge[] = [
    { id: 'e1', u: 'A', v: 'B', weight: 4 },
    { id: 'e2', u: 'A', v: 'C', weight: 2 },
    { id: 'e3', u: 'B', v: 'C', weight: 1 },
    { id: 'e4', u: 'B', v: 'D', weight: 5 },
    { id: 'e5', u: 'C', v: 'E', weight: 8 },
    { id: 'e6', u: 'C', v: 'D', weight: 10 },
    { id: 'e7', u: 'D', v: 'E', weight: 2 },
    { id: 'e8', u: 'D', v: 'F', weight: 6 },
    { id: 'e9', u: 'E', v: 'F', weight: 3 },
  ];

  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(defaultGraphNodes);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>(defaultGraphEdges);
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);
  const timerRef = useRef<number | null>(null);

  // Compute Active Execution & Solvers
  const execution = useMemo(() => {
    if (problem === 'activity_selection') {
      const greedy = runActivitySelection(activities, strategy as ActivityStrategy);
      const optimal = solveActivitySelectionOptimal(activities);
      const regret = optimal.count - greedy.totalSelected;
      return {
        greedy,
        optimal,
        steps: greedy.steps,
        regret: regret === 0 ? 0 : `${regret} activity`,
        isOptimal: greedy.totalSelected === optimal.count,
        greedySummary: `${greedy.totalSelected} activities`,
        optimalSummary: `${optimal.count} activities`
      };
    } else if (problem === 'coin_change') {
      const parsedCoins = coinInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
      const parsedTarget = parseInt(String(targetInput)) || 0;
      const greedy = runCoinChangeGreedy(parsedCoins, parsedTarget);
      const optimal = solveCoinChangeDP(parsedCoins, parsedTarget);
      const isOpt = greedy.feasible && optimal.feasible && greedy.count === optimal.count;
      const regretVal = greedy.feasible && optimal.feasible ? greedy.count - optimal.count : 'Infeasible';
      return {
        coins: parsedCoins,
        target: parsedTarget,
        greedy,
        optimal,
        steps: greedy.steps,
        regret: regretVal === 0 ? 0 : `${regretVal} coin(s)`,
        isOptimal: isOpt,
        greedySummary: greedy.feasible ? `${greedy.count} coins [${greedy.coinsUsed.join('+')}]` : 'Infeasible',
        optimalSummary: optimal.feasible ? `${optimal.count} coins [${optimal.coins.join('+')}]` : 'Infeasible'
      };
    } else if (problem === 'fractional_knapsack') {
      const greedy = runFractionalKnapsack(knapsackItems, knapsackCapacity, strategy as KnapsackStrategy);
      const optimal = solveFractionalKnapsackOptimal(knapsackItems, knapsackCapacity);
      const discrete01 = solve01KnapsackDP(knapsackItems, knapsackCapacity);
      const regret = (optimal.totalValue - greedy.totalValue).toFixed(2);
      return {
        greedy,
        optimal,
        discrete01,
        steps: greedy.steps,
        regret: parseFloat(regret) === 0 ? 0 : `$${regret}`,
        isOptimal: Math.abs(optimal.totalValue - greedy.totalValue) < 0.001,
        greedySummary: `$${greedy.totalValue.toFixed(1)} (${greedy.totalWeight.toFixed(1)}kg)`,
        optimalSummary: `$${optimal.totalValue.toFixed(1)}`
      };
    } else if (problem === 'job_sequencing') {
      const greedy = runJobSequencing(jobs, strategy as JobStrategy);
      const optimal = solveJobSequencingOptimal(jobs);
      const regret = optimal.totalProfit - greedy.totalProfit;
      return {
        greedy,
        optimal,
        steps: greedy.steps,
        regret: regret === 0 ? 0 : `$${regret}`,
        isOptimal: greedy.totalProfit === optimal.totalProfit,
        greedySummary: `$${greedy.totalProfit} (${greedy.scheduled.length} jobs)`,
        optimalSummary: `$${optimal.totalProfit} (${optimal.scheduled.length} jobs)`
      };
    } else if (problem === 'huffman') {
      const items: HuffmanInputItem[] = buildHuffmanTreeFromText(huffmanText);
      const greedy = runHuffmanCoding(items);
      return {
        greedy,
        items,
        steps: greedy.steps,
        regret: 0,
        isOptimal: true,
        greedySummary: `${greedy.encodedBits} bits (${greedy.compressionRatio}% saved)`,
        optimalSummary: `${greedy.encodedBits} bits (Provably Optimal Prefix Code)`
      };
    } else if (problem === 'kruskal') {
      const greedy = runKruskal(graphNodes, graphEdges);
      return {
        greedy,
        steps: greedy.steps,
        regret: 0,
        isOptimal: true,
        greedySummary: `Weight: ${greedy.totalWeight} (${greedy.acceptedCount} edges)`,
        optimalSummary: `Weight: ${greedy.totalWeight} (Provably Optimal MST)`
      };
    } else if (problem === 'prim') {
      const greedy = runPrim(graphNodes, graphEdges, startNode);
      return {
        greedy,
        steps: greedy.steps,
        regret: 0,
        isOptimal: true,
        greedySummary: `Weight: ${greedy.totalWeight} (Root: ${startNode})`,
        optimalSummary: `Weight: ${greedy.totalWeight} (Provably Optimal MST)`
      };
    } else {
      // Dijkstra
      const greedy = runDijkstra(graphNodes, graphEdges, startNode, targetNode);
      return {
        greedy,
        steps: greedy.steps,
        regret: 0,
        isOptimal: true,
        greedySummary: `Distance to ${targetNode}: ${greedy.destinationDistance}`,
        optimalSummary: `Shortest Path: ${greedy.shortestPath.join(' → ')}`
      };
    }
  }, [
    problem,
    strategy,
    activities,
    coinInput,
    targetInput,
    knapsackItems,
    knapsackCapacity,
    jobs,
    huffmanText,
    graphNodes,
    graphEdges,
    startNode,
    targetNode
  ]);

  // Reset step index on input or problem change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setBenchmarks(null);
  }, [
    problem,
    strategy,
    activities,
    coinInput,
    targetInput,
    knapsackItems,
    knapsackCapacity,
    jobs,
    huffmanText,
    graphNodes,
    graphEdges,
    startNode,
    targetNode
  ]);

  // Step Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < execution.steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, execution.steps.length]);

  const currentStepData = (execution.steps[currentStepIndex] || {}) as AlgorithmStep;

  const saveCurrentRun = () => {
    onSaveHistory({
      id: Date.now(),
      problem,
      date: new Date().toLocaleTimeString(),
      strategy,
      isOptimal: execution.isOptimal,
      regret: execution.regret,
      greedySummary: execution.greedySummary,
      optimalSummary: execution.optimalSummary
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const triggerBenchmark = () => {
    const pts = runAlgorithmBenchmark(problem);
    setBenchmarks(pts);
  };

  const complexityInfo = ALGORITHM_COMPLEXITIES[problem];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header Problem & Strategy Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-card p-4 rounded-2xl border border-brand-border space-y-1.5 shadow-sm">
          <label className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            1. Problem Laboratory Module
          </label>
          <select
            value={problem}
            onChange={(e) => {
              const p = e.target.value as ProblemId;
              setProblem(p);
              if (p === 'activity_selection') setStrategy('earliest_finish');
              if (p === 'fractional_knapsack') setStrategy('ratio');
              if (p === 'job_sequencing') setStrategy('max_profit');
            }}
            className="w-full bg-gray-950 border border-gray-700 text-xs sm:text-sm rounded-xl p-2.5 text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="coin_change">Coin Change Problem {realWorldMode && '— Cashier Register'}</option>
            <option value="activity_selection">Activity Selection {realWorldMode && '— Meeting Room Scheduler'}</option>
            <option value="fractional_knapsack">Fractional Knapsack {realWorldMode && '— Emergency Supply Cargo'}</option>
            <option value="job_sequencing">Job Sequencing with Deadlines {realWorldMode && '— Production Task Planner'}</option>
            <option value="huffman">Huffman Coding {realWorldMode && '— Lossless Data Compression'}</option>
            <option value="kruskal">Kruskal's MST {realWorldMode && '— Campus Fiber Network'}</option>
            <option value="prim">Prim's MST {realWorldMode && '— Infrastructure Grid Expansion'}</option>
            <option value="dijkstra">Dijkstra's Shortest Path {realWorldMode && '— GPS Highway Transit'}</option>
          </select>
        </div>

        <div className="bg-brand-card p-4 rounded-2xl border border-brand-border space-y-1.5 shadow-sm">
          <label className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
            2. Greedy Strategy / Heuristic
          </label>
          {problem === 'activity_selection' && (
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 text-xs sm:text-sm rounded-xl p-2.5 text-white font-medium"
            >
              <option value="earliest_finish">Earliest Finish Time (Provably Optimal)</option>
              <option value="earliest_start">Earliest Start Time (Heuristic — Can Fail)</option>
              <option value="shortest_duration">Shortest Duration (Heuristic — Can Fail)</option>
              <option value="fewest_conflicts">Fewest Conflicts First (Heuristic — Can Fail)</option>
            </select>
          )}
          {problem === 'coin_change' && (
            <div className="text-xs font-mono bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-gray-300">
              Canonical Greedy: <span className="text-cyan-300 font-bold">Largest Denomination First</span>
            </div>
          )}
          {problem === 'fractional_knapsack' && (
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 text-xs sm:text-sm rounded-xl p-2.5 text-white font-medium"
            >
              <option value="ratio">Highest Value / Weight Density (Optimal)</option>
              <option value="max_value">Maximum Absolute Value (Heuristic — Fails)</option>
              <option value="min_weight">Minimum Weight First (Heuristic — Fails)</option>
            </select>
          )}
          {problem === 'job_sequencing' && (
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 text-xs sm:text-sm rounded-xl p-2.5 text-white font-medium"
            >
              <option value="max_profit">Highest Profit First (Optimal Greedy)</option>
              <option value="earliest_deadline">Earliest Deadline First (Heuristic — Fails)</option>
              <option value="shortest_deadline">Shortest Deadline First (Heuristic)</option>
            </select>
          )}
          {problem === 'huffman' && (
            <div className="text-xs font-mono bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-gray-300">
              Optimal Strategy: <span className="text-emerald-300 font-bold">Min-Heap Merge 2 Lowest Frequencies</span>
            </div>
          )}
          {problem === 'kruskal' && (
            <div className="text-xs font-mono bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-gray-300">
              Optimal Strategy: <span className="text-cyan-300 font-bold">Cheapest Edge + Disjoint Set Union (DSU)</span>
            </div>
          )}
          {problem === 'prim' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">Root Node:</span>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-xs rounded-lg p-1.5 text-cyan-300 font-mono font-bold"
              >
                {graphNodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
              </select>
            </div>
          )}
          {problem === 'dijkstra' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">Source:</span>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-xs rounded-lg p-1.5 text-cyan-300 font-mono font-bold"
              >
                {graphNodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
              </select>
              <span className="text-xs text-gray-400 font-mono">Target:</span>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-xs rounded-lg p-1.5 text-purple-300 font-mono font-bold"
              >
                {graphNodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Comparative Status & Regret</div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${execution.isOptimal ? 'text-emerald-400' : 'text-rose-400'}`}>
              {execution.isOptimal ? 'REGRET: 0 (OPTIMAL)' : `REGRET: ${execution.regret}`}
            </div>
          </div>
          <button
            onClick={saveCurrentRun}
            className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl text-xs font-mono text-gray-200 transition shadow"
          >
            {saveToast ? '✓ Saved!' : 'Log Run'}
          </button>
        </div>
      </div>

      {/* 2. Main Workspace 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Configuration */}
        <div className="lg:col-span-4 bg-brand-card p-5 rounded-2xl border border-brand-border space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Dataset & Inputs</span>
            <span className="text-[10px] text-cyan-400 font-mono">Live Interactive</span>
          </div>

          {/* Coin Change Input */}
          {problem === 'coin_change' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Coin Denominations (comma separated)</label>
                <input
                  type="text"
                  value={coinInput}
                  onChange={(e) => setCoinInput(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-sm font-mono text-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Target Amount ($)</label>
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-sm font-mono text-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => { setCoinInput('1, 3, 4'); setTargetInput(6); }}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-semibold transition"
                >
                  ⚡ Flagship Counterexample: [1, 3, 4] @ Target 6
                </button>
                <button
                  onClick={() => { setCoinInput('1, 6, 10'); setTargetInput(12); }}
                  className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 rounded-xl text-xs font-mono transition"
                >
                  Load Counterexample: [1, 6, 10] @ Target 12
                </button>
              </div>
            </div>
          )}

          {/* Activity Selection Input */}
          {problem === 'activity_selection' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span>Activities List ({activities.length})</span>
                <button
                  onClick={() => {
                    const id = `A${activities.length + 1}`;
                    const start = Math.floor(Math.random() * 8);
                    const finish = start + Math.floor(Math.random() * 5) + 1;
                    setActivities([...activities, { id, start, finish }]);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  + Add Activity
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-2 bg-gray-950/70 p-2 rounded-xl border border-gray-800 text-xs font-mono">
                    <span className="w-8 font-bold text-cyan-400">{act.id}</span>
                    <span className="text-gray-500">Start:</span>
                    <input
                      type="number"
                      value={act.start}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setActivities(prev => prev.map(a => a.id === act.id ? { ...a, start: val } : a));
                      }}
                      className="w-14 bg-gray-900 border border-gray-700 rounded-lg p-1 text-center text-white"
                    />
                    <span className="text-gray-500">Finish:</span>
                    <input
                      type="number"
                      value={act.finish}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setActivities(prev => prev.map(a => a.id === act.id ? { ...a, finish: val } : a));
                      }}
                      className="w-14 bg-gray-900 border border-gray-700 rounded-lg p-1 text-center text-white"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setStrategy('earliest_start');
                  setActivities([
                    { id: 'A1', start: 0, finish: 10 },
                    { id: 'A2', start: 1, finish: 3 },
                    { id: 'A3', start: 4, finish: 6 },
                    { id: 'A4', start: 7, finish: 9 }
                  ]);
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-semibold transition"
              >
                ⚡ Load Earliest-Start Counterexample
              </button>
            </div>
          )}

          {/* Knapsack Input */}
          {problem === 'fractional_knapsack' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Knapsack Capacity (kg)</label>
                <input
                  type="number"
                  value={knapsackCapacity}
                  onChange={(e) => setKnapsackCapacity(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-sm font-mono text-white"
                />
              </div>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {knapsackItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-950/70 p-2.5 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{item.name}</span>
                    <div className="flex gap-2">
                      <span className="text-gray-400">{item.weight}kg</span>
                      <span className="text-emerald-400 font-semibold">${item.value}</span>
                      <span className="text-cyan-400 font-bold">(${(item.value / item.weight).toFixed(1)}/kg)</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setStrategy('max_value');
                  setKnapsackCapacity(20);
                  setKnapsackItems([
                    { name: 'Gold-Bar', weight: 18, value: 180 },
                    { name: 'Diamond-1', weight: 10, value: 120 },
                    { name: 'Diamond-2', weight: 10, value: 120 },
                  ]);
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-semibold transition"
              >
                ⚡ Load Max-Value Heuristic Failure
              </button>
            </div>
          )}

          {/* Job Sequencing Input */}
          {problem === 'job_sequencing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span>Jobs Inventory ({jobs.length})</span>
                <button
                  onClick={() => {
                    const id = `J${jobs.length + 1}`;
                    const deadline = Math.floor(Math.random() * 4) + 1;
                    const profit = Math.floor(Math.random() * 80) + 20;
                    setJobs([...jobs, { id, deadline, profit }]);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  + Add Job
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between bg-gray-950/70 p-2.5 rounded-xl border border-gray-800 text-xs font-mono">
                    <span className="font-bold text-cyan-400">{job.id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">Deadline: t={job.deadline}</span>
                      <span className="text-emerald-400 font-bold">${job.profit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setStrategy('earliest_deadline');
                  setJobs([
                    { id: 'J1', deadline: 1, profit: 10 },
                    { id: 'J2', deadline: 2, profit: 100 },
                    { id: 'J3', deadline: 2, profit: 90 },
                  ]);
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-semibold transition"
              >
                ⚡ Load Earliest-Deadline Heuristic Failure
              </button>
            </div>
          )}

          {/* Huffman Input */}
          {problem === 'huffman' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Input Text Stream to Compress</label>
                <input
                  type="text"
                  value={huffmanText}
                  onChange={(e) => setHuffmanText(e.target.value.toUpperCase() || 'A')}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-sm font-mono text-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2">
                {['ABRACADABRA', 'HUFFMAN_CODE', 'GREEDY_LAB', 'MISSISSIPPI'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setHuffmanText(preset)}
                    className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-[11px] font-mono text-gray-300"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Graph Algorithms Input */}
          {(problem === 'kruskal' || problem === 'prim' || problem === 'dijkstra') && (
            <div className="space-y-3 font-mono text-xs text-gray-300">
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1.5">
                <div className="text-gray-400 font-bold uppercase text-[10px]">Graph Topology:</div>
                <div>Vertices: <span className="text-cyan-300 font-bold">{graphNodes.length}</span> nodes ({graphNodes.map(n => n.id).join(', ')})</div>
                <div>Edges: <span className="text-cyan-300 font-bold">{graphEdges.length}</span> weighted links</div>
              </div>
              <button
                onClick={() => {
                  setGraphNodes(defaultGraphNodes);
                  setGraphEdges(defaultGraphEdges);
                }}
                className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 rounded-xl text-xs"
              >
                Reset Default Graph Topology
              </button>
            </div>
          )}
        </div>

        {/* Center Column: Active Visualization & Step Controller */}
        <div className="lg:col-span-5 bg-brand-card p-5 rounded-2xl border border-brand-border flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Laboratory Visualizer
              </span>
              <span className="text-xs font-mono text-gray-400">
                Step {currentStepIndex + 1} of {Math.max(execution.steps.length, 1)}
              </span>
            </div>

            {problem === 'activity_selection' && (
              <ActivityTimeline
                activities={activities}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
            {problem === 'coin_change' && (
              <CoinChangeVisualizer
                coins={(execution as any).coins || []}
                target={(execution as any).target || 0}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
            {problem === 'fractional_knapsack' && (
              <KnapsackVisualizer
                capacity={knapsackCapacity}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
            {problem === 'job_sequencing' && (
              <JobSequencingVisualizer
                jobs={jobs}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
            {problem === 'huffman' && (
              <HuffmanVisualizer
                tree={(execution.greedy as any).tree}
                codes={(execution.greedy as any).codes || {}}
                originalBits={(execution.greedy as any).originalBits || 0}
                encodedBits={(execution.greedy as any).encodedBits || 0}
                compressionRatio={(execution.greedy as any).compressionRatio || '0'}
                avgBits={(execution.greedy as any).avgBits || '0'}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
            {(problem === 'kruskal' || problem === 'prim' || problem === 'dijkstra') && (
              <GraphVisualizer
                nodes={graphNodes}
                edges={graphEdges}
                mode={problem as 'kruskal' | 'prim' | 'dijkstra'}
                currentStepData={currentStepData}
                realWorldMode={realWorldMode}
              />
            )}
          </div>

          {/* Bottom Execution Controls */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStepIndex(0)}
                  title="First Step"
                  className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-mono"
                >
                  ⏮
                </button>
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentStepIndex === 0}
                  title="Previous Step"
                  className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-gray-300 text-xs font-mono"
                >
                  ◀
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-xs font-mono shadow-md shadow-cyan-600/20"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.min(execution.steps.length - 1, prev + 1))}
                  disabled={currentStepIndex === execution.steps.length - 1}
                  title="Next Step"
                  className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-gray-300 text-xs font-mono"
                >
                  ▶
                </button>
                <button
                  onClick={() => setCurrentStepIndex(execution.steps.length - 1)}
                  title="Jump to Final Outcome"
                  className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-mono"
                >
                  ⏭
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-gray-400 font-mono">Speed:</span>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                  className="w-20 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Decision Inspector & Solver Comparative Report */}
        <div className="lg:col-span-3 bg-brand-card p-5 rounded-2xl border border-brand-border flex flex-col justify-between space-y-4 shadow-md">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2">
              Decision Inspector
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-300">
                ACTION: {currentStepData.action || 'Initial Algorithm State'}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {currentStepData.explanation || 'Ready to begin step-by-step greedy execution.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2.5 font-mono text-xs">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800 pb-1">
              Comparative Solver Summary
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Greedy Output:</span>
              <span className="font-bold text-amber-300">{execution.greedySummary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Optimal Solver:</span>
              <span className="font-bold text-emerald-400">{execution.optimalSummary}</span>
            </div>
            <div className="border-t border-gray-800 pt-1.5 flex justify-between font-bold">
              <span className="text-gray-300">Optimality:</span>
              <span className={execution.isOptimal ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}>
                {execution.isOptimal ? 'VERIFIED OPTIMAL' : 'COUNTEREXAMPLE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Analytical Tabs Below Workspace */}
      <div className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden shadow-lg">
        <div className="flex border-b border-gray-800 bg-gray-950/60 px-4">
          {[
            { id: 'comparison', label: '📊 Solver Comparison & Regret' },
            { id: 'trace', label: '📜 Step Decision Log' },
            { id: 'complexity', label: '⚡ Complexity & Benchmark' },
            { id: 'proof', label: '🎓 DAA Theory & Proof' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveBottomTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-mono font-semibold transition border-b-2 ${
                activeBottomTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab 1: Comparison & Regret */}
          {activeBottomTab === 'comparison' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Greedy vs Exact Optimal Solver Contrast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-gray-400 uppercase text-[10px] font-bold">Greedy Approach</span>
                  <div className="text-amber-300 text-base font-bold">{execution.greedySummary}</div>
                  <p className="text-gray-500 text-[11px] font-sans">
                    Makes irrevocable local decisions without backtracking.
                  </p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-gray-400 uppercase text-[10px] font-bold">Exact Solver (DP / Exhaustive)</span>
                  <div className="text-emerald-400 text-base font-bold">{execution.optimalSummary}</div>
                  <p className="text-gray-500 text-[11px] font-sans">
                    Explores state space / optimal substructure to guarantee maximum globally.
                  </p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-gray-400 uppercase text-[10px] font-bold">Penalty / Regret</span>
                  <div className={`text-base font-bold ${execution.isOptimal ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {execution.regret === 0 ? '0 (Zero Divergence)' : execution.regret}
                  </div>
                  <p className="text-gray-500 text-[11px] font-sans">
                    {execution.isOptimal ? 'Greedy choice property holds.' : 'Greedy choice trapped in suboptimal local minima.'}
                  </p>
                </div>
              </div>

              {problem === 'fractional_knapsack' && (execution as any).discrete01 && (
                <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-500/30 text-xs space-y-1 font-sans">
                  <div className="font-bold text-purple-300 font-mono">DAA Core Insight: Fractional vs 0/1 Knapsack</div>
                  <p className="text-gray-300 leading-relaxed">
                    Notice that continuous Fractional Knapsack is solved optimally by the Greedy Value/Weight ratio.
                    However, for <strong>0/1 Discrete Knapsack</strong> (where items cannot be split), the same ratio heuristic can fail, requiring $O(n \cdot W)$ Dynamic Programming (Optimal 0/1 Value for this dataset = <strong>${(execution as any).discrete01.maxValue}</strong>).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Step Decision Log */}
          {activeBottomTab === 'trace' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Full Execution Trace Log ({execution.steps.length} Steps)
              </h3>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-gray-950 text-gray-400 border-b border-gray-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Algorithmic Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300 bg-gray-900/40">
                    {execution.steps.map((step, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-gray-800/40 transition ${currentStepIndex === idx ? 'bg-cyan-950/40 text-cyan-200 font-semibold' : ''}`}
                      >
                        <td className="py-2.5 px-4 text-gray-500">{step.stepNumber}</td>
                        <td className="py-2.5 px-4 text-amber-300">{step.action}</td>
                        <td className="py-2.5 px-4 font-sans text-xs">{step.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Complexity & Benchmark */}
          {activeBottomTab === 'complexity' && (
            <div className="space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="text-gray-500 uppercase text-[10px]">Time Complexity (Worst)</div>
                  <div className="text-cyan-300 text-sm font-bold mt-1">{complexityInfo.timeWorst}</div>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="text-gray-500 uppercase text-[10px]">Auxiliary Space</div>
                  <div className="text-purple-300 text-sm font-bold mt-1">{complexityInfo.spaceAux}</div>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="text-gray-500 uppercase text-[10px]">Sorting Breakdown</div>
                  <div className="text-amber-300 text-sm font-bold mt-1">{complexityInfo.sortingTime || 'N/A'}</div>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="text-gray-500 uppercase text-[10px]">Optimal Guarantee</div>
                  <div className="text-emerald-300 text-sm font-bold mt-1">{complexityInfo.optimalGuarantee}</div>
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-bold uppercase text-[11px]">
                    Live Micro-Benchmark & Operation Counter
                  </span>
                  <button
                    onClick={triggerBenchmark}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs shadow"
                  >
                    Run Micro-Benchmark (N=10 → 1000)
                  </button>
                </div>

                {benchmarks ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800">
                          <th className="py-2 px-3">Input Size (N)</th>
                          <th className="py-2 px-3">Atomic Operations Count</th>
                          <th className="py-2 px-3">Browser Measured Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 text-gray-300">
                        {benchmarks.map(pt => (
                          <tr key={pt.n}>
                            <td className="py-2 px-3 text-cyan-300 font-bold">N = {pt.n}</td>
                            <td className="py-2 px-3">{pt.opCount.toLocaleString()} ops</td>
                            <td className="py-2 px-3 text-emerald-400">{pt.measuredMs} ms</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs font-sans">
                    Click "Run Micro-Benchmark" to measure empirical execution time and atomic operation counters across scaling input sizes.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: DAA Theory & Proof Notes */}
          {activeBottomTab === 'proof' && (
            <div className="space-y-4 text-xs text-gray-300 font-sans leading-relaxed">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Greedy Correctness & Mathematical Foundation
              </h3>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="text-cyan-300 font-mono font-bold">1. Greedy Choice Property</div>
                <p>
                  A globally optimal solution can always be arrived at by making locally optimal (greedy) choices without revising previous decisions.
                </p>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="text-purple-300 font-mono font-bold">2. Optimal Substructure</div>
                <p>
                  An optimal solution to the overall problem contains within it optimal solutions to subproblems (e.g. after choosing the first meeting in Activity Selection, the remaining timeline is an independent subproblem).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};