export type ProblemId =
  | 'activity_selection'
  | 'coin_change'
  | 'fractional_knapsack'
  | 'job_sequencing'
  | 'huffman'
  | 'kruskal'
  | 'prim'
  | 'dijkstra';

export interface Activity {
  id: string;
  start: number;
  finish: number;
}

export interface KnapsackItem {
  name: string;
  weight: number;
  value: number;
  ratio?: number;
  fraction?: number;
  takenWeight?: number;
  takenValue?: number;
}

export interface JobItem {
  id: string;
  deadline: number;
  profit: number;
  slotAssigned?: number; // 1-indexed slot
}

export interface HuffmanNode {
  id: string;
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  u: string;
  v: string;
  weight: number;
}

export interface AlgorithmStep {
  stepNumber: number;
  action: string;
  explanation: string;
  // Activity Selection
  currentId?: string | null;
  selectedIds?: string[];
  rejectedIds?: string[];
  lastFinish?: number;
  // Coin Change
  currentCoin?: number;
  remaining?: number;
  chosen?: number[];
  // Knapsack
  currentItem?: KnapsackItem;
  currentWeight?: number;
  totalValue?: number;
  packed?: KnapsackItem[];
  // Job Sequencing
  currentJob?: JobItem;
  scheduleSlots?: (JobItem | null)[];
  currentProfit?: number;
  // Huffman
  queueState?: HuffmanNode[];
  mergedNode?: HuffmanNode;
  activeTree?: HuffmanNode;
  codes?: Record<string, string>;
  // Graph (Kruskal, Prim, Dijkstra)
  currentEdge?: GraphEdge;
  mstEdges?: GraphEdge[];
  rejectedEdges?: GraphEdge[];
  visitedNodes?: string[];
  frontierEdges?: GraphEdge[];
  currentNode?: string;
  distances?: Record<string, number>;
  predecessors?: Record<string, string | null>;
  relaxedEdge?: GraphEdge;
  cycleNodes?: string[];
}

export interface CounterexampleResult {
  found: boolean;
  testsRun: number;
  input?: Record<string, unknown>;
  greedy?: Record<string, unknown>;
  optimal?: Record<string, unknown>;
  regret?: number | string;
  reason?: string;
  message?: string;
  problemId?: ProblemId;
}

export interface HistoryEntry {
  id: number;
  problem: ProblemId | string;
  date: string;
  strategy: string;
  isOptimal: boolean;
  regret: string | number;
  inputSummary?: string;
  greedySummary?: string;
  optimalSummary?: string;
}

export interface ComplexityInfo {
  timeWorst: string;
  timeAverage: string;
  timeBest: string;
  spaceAux: string;
  sortingTime?: string;
  executionTime?: string;
  dataStructure: string;
  optimalGuarantee: 'Always Optimal' | 'Conditional / Canonical Only' | 'Heuristic Only (Can Fail)';
  paradigm: 'Greedy' | 'Dynamic Programming' | 'Exact / Branch & Bound';
}