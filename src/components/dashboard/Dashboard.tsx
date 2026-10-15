import React, { useMemo } from 'react';
import { ArrowDownRight, ArrowRight, Binary, BookOpen, BookOpenCheck, Boxes, BriefcaseBusiness, Check, CircleDollarSign, Clock3, GitBranch, Network, Play, Route, Target, Zap } from 'lucide-react';
import { ProblemId, GraphNode, GraphEdge } from '../../types/algorithms';
import { runKruskal } from '../../algorithms/greedy/kruskal';

interface Props {
  setActiveTab: (tab: string) => void;
  onSelectProblem?: (problem: ProblemId) => void;
}

const graphNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 54, y: 92 }, { id: 'B', label: 'B', x: 164, y: 35 },
  { id: 'C', label: 'C', x: 164, y: 150 }, { id: 'D', label: 'D', x: 300, y: 35 },
  { id: 'E', label: 'E', x: 300, y: 150 }, { id: 'F', label: 'F', x: 412, y: 92 }
];
const graphEdges: GraphEdge[] = [
  { id: 'e1', u: 'A', v: 'B', weight: 4 }, { id: 'e2', u: 'A', v: 'C', weight: 2 },
  { id: 'e3', u: 'B', v: 'C', weight: 1 }, { id: 'e4', u: 'B', v: 'D', weight: 5 },
  { id: 'e5', u: 'C', v: 'E', weight: 8 }, { id: 'e6', u: 'C', v: 'D', weight: 10 },
  { id: 'e7', u: 'D', v: 'E', weight: 2 }, { id: 'e8', u: 'D', v: 'F', weight: 6 },
  { id: 'e9', u: 'E', v: 'F', weight: 3 }
];

const algorithms: { id: ProblemId; name: string; icon: typeof Clock3; color: string }[] = [
  { id: 'activity_selection', name: 'Activity Selection', icon: Clock3, color: 'peach' },
  { id: 'coin_change', name: 'Coin Change', icon: CircleDollarSign, color: 'yellow' },
  { id: 'fractional_knapsack', name: 'Fractional Knapsack', icon: Boxes, color: 'sage' },
  { id: 'job_sequencing', name: 'Job Sequencing', icon: BriefcaseBusiness, color: 'lavender' },
  { id: 'huffman', name: 'Huffman Coding', icon: Binary, color: 'cyan' },
  { id: 'kruskal', name: "Kruskal's MST", icon: GitBranch, color: 'peach' },
  { id: 'prim', name: "Prim's MST", icon: Network, color: 'sage' },
  { id: 'dijkstra', name: "Dijkstra's Shortest Path", icon: Route, color: 'yellow' }
];

export const Dashboard: React.FC<Props> = ({ setActiveTab, onSelectProblem }) => {
  const kruskal = useMemo(() => runKruskal(graphNodes, graphEdges), []);
  const previewStep = kruskal.steps[3];
  const selectAlgorithm = (problem: ProblemId) => {
    onSelectProblem?.(problem);
    setActiveTab('workspace');
  };

  const features = [
    { icon: Play, title: 'Step-by-step visualization', detail: 'See each greedy decision.', tab: 'workspace' },
    { icon: Target, title: 'Compare with optimal', detail: 'Measure performance gaps.', tab: 'workspace' },
    { icon: Zap, title: 'Find counterexamples', detail: 'See where greedy fails.', tab: 'breakit' },
    { icon: BookOpenCheck, title: 'Proofs & intuition', detail: 'Explore why it works.', tab: 'proofs' }
  ];

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> INTERACTIVE DAA LAB</div>
          <h1 id="home-title">Greedy Ideas.<br /><span>Real</span> Insights.</h1>
          <p>Visualize greedy algorithms, experiment with inputs, compare with optimal solutions, and discover when greedy works — and when it doesn't.</p>
          <div className="hero-actions">
            <button className="button-primary" onClick={() => setActiveTab('workspace')}><Play size={15} fill="currentColor" />Launch Lab Workspace <ArrowRight size={17} /></button>
            <button className="button-secondary" onClick={() => document.getElementById('algorithms')?.scrollIntoView({ behavior: 'smooth' })}><BookOpen size={19} />Explore Algorithms</button>
          </div>
        </div>

        <div className="hero-device" aria-label="Kruskal minimum spanning tree preview">
          <div className="preview-card">
          <div className="preview-head">
            <div><div className="preview-kicker">ALGORITHM PREVIEW</div><h2>Kruskal's Minimum Spanning Tree</h2></div>
            <span className="step-pill">Edge {previewStep.stepNumber} of {kruskal.sortedEdges.length}</span>
          </div>
          <div className="graph-stage">
            <svg viewBox="0 0 466 185" role="img" aria-label="Six vertex weighted graph showing the current Kruskal minimum spanning tree">
              {graphEdges.map(edge => {
                const a = graphNodes.find(node => node.id === edge.u)!;
                const b = graphNodes.find(node => node.id === edge.v)!;
                const chosen = previewStep.mstEdges?.some(item => item.id === edge.id) ?? false;
                const candidate = previewStep.currentEdge?.id === edge.id && !chosen;
                const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
                return <g key={edge.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`graph-edge ${chosen ? 'is-chosen' : ''} ${candidate ? 'is-candidate' : ''}`} />
                  <rect x={mx - 11} y={my - 9} width="22" height="18" rx="7" className="weight-chip" />
                  <text x={mx} y={my + 4} textAnchor="middle" className="weight-label">{edge.weight}</text>
                </g>;
              })}
              {graphNodes.map(node => <g key={node.id}><circle cx={node.x} cy={node.y} r="16" className="graph-node" /><text x={node.x} y={node.y + 4} textAnchor="middle" className="node-label">{node.label}</text></g>)}
            </svg>
          </div>
          <div className="preview-bottom">
            <div className="action-list">
              {kruskal.steps.slice(1, 4).map(step => <div className="action-row" key={step.stepNumber}><span className="action-check"><Check size={12} /></span><span>{step.action.replace('Accept Edge ', 'Accept ')}</span></div>)}
            </div>
            <div className="result-box"><span>Current tree weight</span><strong>{previewStep.mstEdges?.reduce((sum, edge) => sum + edge.weight, 0) ?? 0}</strong><small>{previewStep.mstEdges?.length ?? 0} edges selected</small></div>
          </div>
          <div className="preview-caption"><span className="legend-dot" /> Accepted edge <span className="legend-line" /> Remaining edges</div>
          </div>
        </div>
      </section>

      <section id="algorithms" className="algorithm-section" aria-labelledby="algorithms-title">
        <div className="section-heading"><h2 id="algorithms-title">Explore Algorithms</h2><ArrowDownRight size={17} aria-hidden="true" /></div>
        <div className="algorithm-grid">
          {algorithms.map(({ id, name, icon: Icon, color }) => <button key={id} className={`algorithm-card accent-${color}`} onClick={() => selectAlgorithm(id)} aria-label={`Open ${name} in the lab workspace`}>
            <span className="algorithm-icon"><Icon size={31} strokeWidth={1.8} /></span><span className="algorithm-name">{name}</span><ArrowRight className="algorithm-arrow" size={16} />
          </button>)}
        </div>
      </section>

      <section className="feature-strip" aria-label="What you can do in GREEDYLAB">
        {features.map(({ icon: Icon, title, detail, tab }) => <button className="feature-item" key={title} onClick={() => setActiveTab(tab)}>
          <span className="feature-icon"><Icon size={20} /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight className="feature-arrow" size={14} />
        </button>)}
      </section>
    </div>
  );
};
