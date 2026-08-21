# ⚡ GREEDYLAB
### *Interactive Greedy Algorithm Laboratory & Counterexample Explorer*

> **"Don't Just Visualize the Greedy Choice. Challenge It."**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

**GREEDYLAB** is an interactive web-based algorithm laboratory designed for college **Design and Analysis of Algorithms (DAA)** courses.

Traditional visualizers animate algorithms passively:
$$\text{Input} \longrightarrow \text{Algorithm} \longrightarrow \text{Animation} \longrightarrow \text{Answer}$$

**GREEDYLAB** is built around an active, exploratory scientific learning loop:
$$\text{LEARN} \longrightarrow \text{EXPERIMENT} \longrightarrow \text{COMPARE} \longrightarrow \text{BREAK} \longrightarrow \text{PROVE}$$

Students can experiment with heuristics, inspect step-by-step decisions, benchmark greedy choices against exact/optimal Dynamic Programming solvers, calculate regret metrics, hunt for mathematical counterexamples, and examine formal exchange argument proofs.

---

## 🔬 Core Feature Suite

### 1. Classical DAA Greedy Algorithm Modules (8)
| Module | Real-World Metaphor | Greedy Choice Strategy | Exact/Optimal Solver | Time Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Activity Selection** | Meeting Room Scheduler | Earliest Finish Time First | Interval Dynamic Programming | $\mathcal{O}(n \log n)$ |
| **Coin Change** | Cashier Till / Change-Making | Largest Denomination First | $O(k \cdot T)$ Dynamic Programming | $\mathcal{O}(k \log k + T/c_{\min})$ |
| **Fractional Knapsack** | Emergency Cargo Packing | Value / Weight Ratio Density | Continuous Ratio Density | $\mathcal{O}(n \log n)$ |
| **Job Sequencing** | Production Deadline Scheduler | Highest Profit First (Latest Slot) | Exhaustive / Matroid Bounds | $\mathcal{O}(n^2) / \mathcal{O}(n \log n)$ |
| **Huffman Coding** | Lossless Data Compression | Min-Heap Merge 2 Smallest Freq | Optimal Prefix-Free Tree | $\mathcal{O}(n \log n)$ |
| **Kruskal's Algorithm** | Campus Fiber Optic Network | Edge Sorting + Disjoint Set (DSU) | Spanning Tree Cycle Rejection | $\mathcal{O}(E \log E)$ |
| **Prim's Algorithm** | Grid Infrastructure Expansion | Minimum Cut Frontier Expansion | Visited Cluster Priority Queue | $\mathcal{O}(E \log V)$ |
| **Dijkstra's Algorithm** | GPS Navigation Routing | Nearest Unvisited Vertex Relaxation | Single-Source Shortest Path | $\mathcal{O}((V + E) \log V)$ |

---

### 2. ⚡ Signature Feature: "Break The Greedy Algorithm"
Automated Counterexample Discovery Engine that challenges intuitive heuristics:
- **Exhaustive Search**: Systematically iterates over bounded small integer instances.
- **Randomized Monte Carlo Fuzzing**: Generates randomized stress test instances.
- **Divergence Report**: Calculates exact numerical regret ($\text{Greedy} - \text{Optimal}$) and provides the formal DAA theoretical rationale explaining why the greedy-choice property failed.

#### ⭐ Flagship Demonstration:
- **Input**: Coins = `[1, 3, 4]`, Target = `6`
- **Greedy Output**: $4 + 1 + 1 = \mathbf{3\text{ coins}}$
- **Optimal DP Output**: $3 + 3 = \mathbf{2\text{ coins}}$
- **Regret**: $\mathbf{1\text{ extra coin (Suboptimal)}}$

---

### 3. 🎓 Academic Rigor & Exchange Argument Proofs
- **Activity Selection Proof**: Interactive step-by-step element replacement showing $O' = [g_1, o_2, \dots, o_m]$ maintains compatibility and size optimality.
- **The Cut Property & Matroids**: Cycle exchange proof for Kruskal and Prim algorithms.
- **Dijkstra Invariant**: Subproblem optimality and non-negative monotonicity preservation.
- **0/1 Knapsack vs Fractional Knapsack**: Explaining why continuous relaxation succeeds with greedy ratios, while discrete indivisible items require Dynamic Programming.

---

### 4. ⚡ Complexity Analyzer & Live Micro-Benchmark
- Breakdown of theoretical sorting vs execution phases.
- Real-time browser micro-benchmark tool testing scaling inputs ($N = 10 \to 1000$) to evaluate empirical execution times and atomic operation counters.

---

### 5. 🌐 Dual Mode & Experiment History
- **Real-World Mode vs Technical DAA View**: Instant toggle switching all visualizers and labels between real-world metaphors and formal mathematical notations.
- **History Audit Log**: LocalStorage persistence with JSON export capability.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualizations**: Interactive Responsive SVGs & Canvas

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/GreedyLab.git
cd GreedyLab
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Architecture

```
GREEDY_LAB/
├── src/
│   ├── algorithms/
│   │   ├── greedy/             # Step-generating greedy algorithm implementations
│   │   │   ├── activitySelection.ts
│   │   │   ├── coinChange.ts
│   │   │   ├── dijkstra.ts
│   │   │   ├── fractionalKnapsack.ts
│   │   │   ├── huffman.ts
│   │   │   ├── jobSequencing.ts
│   │   │   ├── kruskal.ts
│   │   │   └── prim.ts
│   │   └── optimal/            # Exact Dynamic Programming / Branch & Bound solvers
│   │       ├── activitySelectionOptimal.ts
│   │       ├── coinChangeDP.ts
│   │       ├── fractionalKnapsackOptimal.ts
│   │       └── jobSequencingOptimal.ts
│   ├── analysis/               # Big-O complexity definitions & live micro-benchmarking
│   │   └── complexity.ts
│   ├── counterexamples/        # Exhaustive & Randomized counterexample search engine
│   │   └── searchEngine.ts
│   ├── components/
│   │   ├── counterexample/     # "Break It" counterexample search page
│   │   ├── dashboard/          # Laboratory dashboard with algorithm cards
│   │   ├── history/            # Trial history and JSON export page
│   │   ├── layout/             # Navbar and Footer components
│   │   ├── proof/              # Interactive proof walkthroughs & complexity matrix
│   │   ├── visualization/      # Responsive SVG/Canvas visualizers
│   │   │   ├── ActivityTimeline.tsx
│   │   │   ├── CoinChangeVisualizer.tsx
│   │   │   ├── GraphVisualizer.tsx
│   │   │   ├── HuffmanVisualizer.tsx
│   │   │   ├── JobSequencingVisualizer.tsx
│   │   │   └── KnapsackVisualizer.tsx
│   │   └── workspace/          # 3-column interactive lab workspace
│   ├── types/                  # Core TypeScript types & step interfaces
│   │   └── algorithms.ts
│   ├── App.tsx                 # Root application component & routing
│   ├── index.css               # Tailwind CSS directives & custom fonts
│   └── main.tsx                # React DOM entrypoint
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
