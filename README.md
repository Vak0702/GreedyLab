# GREEDYLAB

GREEDYLAB is an interactive browser-based laboratory for exploring greedy algorithms. Step through algorithm decisions, edit inputs, compare results with optimal solutions where available, search for counterexamples, and review proof and complexity notes.

## Features

- Eight algorithm visualizers: Activity Selection, Coin Change, Fractional Knapsack, Job Sequencing, Huffman Coding, Kruskal's MST, Prim's MST, and Dijkstra's shortest path.
- Editable datasets, algorithm strategies, and step-by-step execution in the Lab Workspace.
- Greedy-versus-optimal comparisons for supported problems, with regret and result summaries.
- A counterexample search page with exhaustive and randomized modes for Activity Selection, Coin Change, Fractional Knapsack, and Job Sequencing.
- Proof and intuition notes, plus complexity information and browser-side benchmarks in the workspace.
- A graph editor for Prim, Kruskal, and Dijkstra. Add, move, connect, edit, or remove vertices and edges; graph edits are saved in browser storage.
- Light and dark themes, a real-world/formal DAA terminology toggle, and a history page with JSON export.
- Responsive layouts for desktop and mobile. The app runs entirely in the browser and does not require a backend.

## Getting started

### Requirements

- Node.js 18 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### Build and preview

```bash
npm run build
npm run preview
```

The build runs the TypeScript compiler before creating the production bundle in `dist/`.

## Using the app

1. Choose an algorithm from the homepage or open **Lab Workspace**.
2. Select a problem and strategy, edit its data, and use the step controls to inspect decisions.
3. Review the comparison, trace, proof, and complexity panels where available.
4. Use **Break Strategy** to search supported problems for instances where a greedy heuristic differs from its optimal solver.
5. Open **History** to review logged runs or export them as JSON.

The navigation's **Formal DAA View** toggle changes the terminology used by visualizers. The theme and recent run history are saved in browser `localStorage`; custom graph data is saved there as well. Clearing browser storage removes these saved preferences and data.

## Project structure

```text
src/
|-- algorithms/
|   |-- greedy/          # Greedy algorithm implementations
|   `-- optimal/         # Optimal comparison solvers
|-- analysis/            # Complexity data and benchmark routines
|-- counterexamples/     # Counterexample search engine
|-- components/
|   |-- counterexample/  # Break Strategy page
|   |-- dashboard/       # Homepage
|   |-- history/         # Run history and JSON export
|   |-- layout/          # Navigation and footer
|   |-- proof/           # Proof and rigor page
|   |-- visualization/   # Algorithm visualizers
|   `-- workspace/       # Lab Workspace
|-- types/               # Shared algorithm and data types
|-- App.tsx              # App state and page selection
|-- index.css            # Application styles and responsive layouts
`-- main.tsx             # React entry point
```

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- SVG and canvas-based visualizations

The Vite configuration uses `base: './'` so generated asset paths remain relative for static hosting, including GitHub Pages deployments.
