import { ComplexityInfo, ProblemId } from '../types/algorithms';

export const ALGORITHM_COMPLEXITIES: Record<ProblemId, ComplexityInfo> = {
  activity_selection: {
    timeWorst: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeBest: 'O(n log n)',
    spaceAux: 'O(n) or O(1)',
    sortingTime: 'O(n log n) for sorting activities by finish time',
    executionTime: 'O(n) linear scan for greedy compatibility check',
    dataStructure: 'Array / Dynamic List',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  coin_change: {
    timeWorst: 'O(k log k + T / c_min)',
    timeAverage: 'O(k log k + T / c_avg)',
    timeBest: 'O(k log k + 1)',
    spaceAux: 'O(1)',
    sortingTime: 'O(k log k) for k coin denominations',
    executionTime: 'O(T / c_min) worst-case subtraction steps (or O(k) with division)',
    dataStructure: 'Array / List of Denominations',
    optimalGuarantee: 'Conditional / Canonical Only',
    paradigm: 'Greedy'
  },
  fractional_knapsack: {
    timeWorst: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeBest: 'O(n log n)',
    spaceAux: 'O(1) auxiliary',
    sortingTime: 'O(n log n) sorting by value/weight ratio',
    executionTime: 'O(n) linear pass filling capacity',
    dataStructure: 'Array / Priority Queue',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  job_sequencing: {
    timeWorst: 'O(n^2) or O(n log n) with DSU',
    timeAverage: 'O(n log n + n · min(n, d_max))',
    timeBest: 'O(n log n)',
    spaceAux: 'O(d_max) for time slot array',
    sortingTime: 'O(n log n) for sorting jobs descending by profit',
    executionTime: 'O(n · d_max) linear backward slot search (or near-linear with Disjoint Set Union)',
    dataStructure: 'Time Slot Array / Disjoint Set Union',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  huffman: {
    timeWorst: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeBest: 'O(n log n)',
    spaceAux: 'O(n) for binary tree nodes',
    sortingTime: 'O(n) or O(n log n) initial priority queue setup',
    executionTime: 'O(n log n) for (n - 1) min-heap extract and insert operations',
    dataStructure: 'Min-Heap (Binary Heap Priority Queue)',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  kruskal: {
    timeWorst: 'O(E log E) or O(E log V)',
    timeAverage: 'O(E log E)',
    timeBest: 'O(E log E)',
    spaceAux: 'O(V) for Union-Find parent & rank arrays',
    sortingTime: 'O(E log E) to sort all graph edges by weight',
    executionTime: 'O(E · α(V)) for Union-Find cycle check with path compression',
    dataStructure: 'Disjoint Set Union (DSU) with Path Compression and Union by Rank',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  prim: {
    timeWorst: 'O(E log V) with Binary Heap (or O(V^2) with Adjacency Matrix)',
    timeAverage: 'O(E log V)',
    timeBest: 'O(E log V)',
    spaceAux: 'O(V + E) for priority queue and visited set',
    sortingTime: 'N/A (Dynamic extraction)',
    executionTime: 'O(V log V + E log V) for vertex extractions and edge relaxations',
    dataStructure: 'Min-Heap Priority Queue / Adjacency List',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  },
  dijkstra: {
    timeWorst: 'O((V + E) log V) with Binary Heap (or O(E + V log V) with Fibonacci Heap)',
    timeAverage: 'O((V + E) log V)',
    timeBest: 'O(V log V)',
    spaceAux: 'O(V) for distance table and priority queue',
    sortingTime: 'N/A',
    executionTime: 'O(V · extractMin + E · decreaseKey)',
    dataStructure: 'Min-Heap Priority Queue / Adjacency List',
    optimalGuarantee: 'Always Optimal',
    paradigm: 'Greedy'
  }
};

export interface BenchmarkPoint {
  n: number;
  measuredMs: number;
  opCount: number;
}

/**
 * Runs a micro-benchmark simulation across varying problem sizes
 */
export const runAlgorithmBenchmark = (problem: ProblemId): BenchmarkPoint[] => {
  const sizes = [10, 50, 100, 250, 500, 1000];
  const results: BenchmarkPoint[] = [];

  for (const n of sizes) {
    let opCount = 0;
    const start = performance.now();

    if (problem === 'activity_selection') {
      const acts = Array.from({ length: n }, (_, i) => {
        const s = Math.floor(Math.random() * (n * 2));
        return { id: `A${i}`, start: s, finish: s + Math.floor(Math.random() * 20) + 1 };
      });
      // Sorting: n log n comparisons
      acts.sort((a, b) => {
        opCount++;
        return a.finish - b.finish;
      });
      let lastEnd = -1;
      for (const a of acts) {
        opCount++;
        if (a.start >= lastEnd) {
          lastEnd = a.finish;
        }
      }
    } else if (problem === 'coin_change') {
      const coins = [1, 2, 5, 10, 20, 50, 100];
      const target = n * 5;
      let rem = target;
      for (const c of coins.sort((a, b) => b - a)) {
        opCount++;
        while (rem >= c) {
          opCount++;
          rem -= c;
        }
      }
    } else if (problem === 'fractional_knapsack') {
      const items = Array.from({ length: n }, (_, i) => ({
        name: `Item ${i}`,
        weight: Math.floor(Math.random() * 50) + 1,
        value: Math.floor(Math.random() * 200) + 1,
      }));
      items.sort((a, b) => {
        opCount++;
        return (b.value / b.weight) - (a.value / a.weight);
      });
      let cap = n * 15;
      for (const it of items) {
        opCount++;
        if (cap <= 0) break;
        cap -= Math.min(cap, it.weight);
      }
    } else if (problem === 'job_sequencing') {
      const jobs = Array.from({ length: Math.min(n, 300) }, (_, i) => ({
        id: `J${i}`,
        deadline: Math.floor(Math.random() * 50) + 1,
        profit: Math.floor(Math.random() * 500) + 10
      }));
      jobs.sort((a, b) => { opCount++; return b.profit - a.profit; });
      const slots = Array(60).fill(false);
      for (const j of jobs) {
        for (let s = Math.min(j.deadline, 59); s >= 1; s--) {
          opCount++;
          if (!slots[s]) {
            slots[s] = true;
            break;
          }
        }
      }
    } else {
      // Graph / Huffman synthetic op simulation
      for (let i = 0; i < n; i++) {
        opCount += Math.floor(Math.log2(Math.max(i, 2)));
      }
    }

    const end = performance.now();
    results.push({
      n,
      measuredMs: Math.max(parseFloat((end - start).toFixed(3)), 0.001),
      opCount
    });
  }

  return results;
};
