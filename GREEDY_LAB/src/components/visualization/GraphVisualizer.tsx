import React, { useRef, useState } from 'react';
import { GraphNode, GraphEdge, AlgorithmStep } from '../../types/algorithms';

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  mode: 'kruskal' | 'prim' | 'dijkstra';
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
  editable?: boolean;
  onNodesChange?: (nodes: GraphNode[]) => void;
  onEdgesChange?: (edges: GraphEdge[]) => void;
}

export const GraphVisualizer: React.FC<Props> = ({
  nodes,
  edges,
  mode,
  currentStepData,
  realWorldMode,
  editable = false,
  onNodesChange,
  onEdgesChange
}) => {
  const currentEdge = currentStepData?.currentEdge;
  const mstEdges = currentStepData?.mstEdges || [];
  const rejectedEdges = currentStepData?.rejectedEdges || [];
  const visitedNodes = currentStepData?.visitedNodes || [];
  const frontierEdges = currentStepData?.frontierEdges || [];
  const currentNode = currentStepData?.currentNode;
  const distances = currentStepData?.distances || {};
  const relaxedEdge = currentStepData?.relaxedEdge;
  const [editorMode, setEditorMode] = useState<'select' | 'add-node' | 'connect' | 'delete'>('select');
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [newEdgeWeight, setNewEdgeWeight] = useState('1');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getCanvasPoint = (event: React.MouseEvent<SVGSVGElement> | React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(22, Math.min(498, ((event.clientX - rect.left) / rect.width) * 520)),
      y: Math.max(22, Math.min(238, ((event.clientY - rect.top) / rect.height) * 260))
    };
  };

  const nextNodeId = () => {
    for (let i = 0; i < 26; i++) {
      const id = String.fromCharCode(65 + i);
      if (!nodes.some(node => node.id === id)) return id;
    }
    let index = 1;
    while (nodes.some(node => node.id === `N${index}`)) index++;
    return `N${index}`;
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!editable || editorMode !== 'add-node') return;
    const point = getCanvasPoint(event);
    const id = nextNodeId();
    onNodesChange?.([...nodes, { id, label: id, ...point }]);
    setEditorMode('select');
  };

  const handleNodeClick = (event: React.MouseEvent<SVGGElement>, node: GraphNode) => {
    if (!editable) return;
    event.stopPropagation();
    if (editorMode === 'delete') {
      onNodesChange?.(nodes.filter(item => item.id !== node.id));
      onEdgesChange?.(edges.filter(edge => edge.u !== node.id && edge.v !== node.id));
      setSelectedNodeIds([]);
      return;
    }
    if (editorMode === 'connect') {
      setSelectedNodeIds(previous => {
        if (previous.includes(node.id)) return previous.filter(id => id !== node.id);
        return previous.length >= 2 ? [node.id] : [...previous, node.id];
      });
      return;
    }
    setSelectedNodeIds([node.id]);
  };

  const connectSelectedNodes = () => {
    if (selectedNodeIds.length !== 2) return;
    const [u, v] = selectedNodeIds;
    if (u === v || edges.some(edge => (edge.u === u && edge.v === v) || (edge.u === v && edge.v === u))) return;
    const weight = Number(newEdgeWeight);
    if (!Number.isFinite(weight) || (mode === 'dijkstra' && weight < 0)) return;
    onEdgesChange?.([...edges, { id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, u, v, weight }]);
    setSelectedNodeIds([]);
    setEditorMode('select');
  };

  const handleEdgeClick = (event: React.MouseEvent<SVGGElement>, edge: GraphEdge) => {
    if (!editable) return;
    event.stopPropagation();
    if (editorMode === 'add-node' || editorMode === 'connect') return;
    if (editorMode === 'delete') {
      onEdgesChange?.(edges.filter(item => item.id !== edge.id));
      setSelectedEdgeId(null);
      return;
    }
    setSelectedEdgeId(edge.id);
    const nextWeight = window.prompt(`New weight for ${edge.u} — ${edge.v}:`, String(edge.weight));
    if (nextWeight === null) return;
    const weight = Number(nextWeight);
    if (!Number.isFinite(weight) || (mode === 'dijkstra' && weight < 0)) {
      window.alert(mode === 'dijkstra' ? 'Dijkstra requires non-negative edge weights.' : 'Enter a valid numeric weight.');
      return;
    }
    onEdgesChange?.(edges.map(item => item.id === edge.id ? { ...item, weight } : item));
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!editable || !draggingNodeId || editorMode !== 'select') return;
    const point = getCanvasPoint(event);
    onNodesChange?.(nodes.map(node => node.id === draggingNodeId ? { ...node, ...point } : node));
  };

  // Helper to test if edge is in a list
  const isEdgeInList = (list: GraphEdge[], e: GraphEdge) => {
    return list.some(item => (item.u === e.u && item.v === e.v) || (item.u === e.v && item.v === e.u));
  };

  return (
    <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-4 shadow-inner">
      {editable && (
        <div className="rounded-xl border border-cyan-900/70 bg-gray-900/80 p-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-white">Custom Graph Builder</div>
              <div className="text-[11px] text-gray-400 mt-1">Add nodes, drag them around, connect nodes, or select an edge to edit its weight.</div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">{nodes.length} VERTICES · {edges.length} EDGES</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['select', 'Move / Edit'], ['add-node', '+ Add Vertex'], ['connect', 'Connect Vertices'], ['delete', 'Delete']
            ] as const).map(([value, label]) => (
              <button key={value} onClick={() => { setEditorMode(value); setSelectedNodeIds([]); }}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${editorMode === value ? 'border-cyan-500 bg-cyan-950 text-cyan-200' : 'border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500'}`}>
                {label}
              </button>
            ))}
            {selectedNodeIds.length === 2 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-300">{selectedNodeIds.join(' — ')}</span>
                <input aria-label="New edge weight" type="number" min={mode === 'dijkstra' ? 0 : undefined} value={newEdgeWeight} onChange={e => setNewEdgeWeight(e.target.value)} className="w-20 rounded-lg border border-gray-700 bg-gray-950 px-2 py-2 text-xs text-white" />
                <button onClick={connectSelectedNodes} className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500">Create Edge</button>
              </div>
            )}
            {selectedNodeIds.length === 1 && editorMode === 'connect' && <span className="self-center text-xs text-cyan-300">Select one more vertex.</span>}
          </div>
          <div className="text-[11px] text-gray-500">
            {editorMode === 'add-node' ? 'Click an empty spot on the canvas to add a vertex.' : editorMode === 'connect' ? 'Select two vertices, enter a weight, then create the edge.' : editorMode === 'delete' ? 'Click a vertex or edge to delete it.' : 'Drag a vertex to reposition it. Click an edge to edit its weight.'}
          </div>
        </div>
      )}
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-gray-800 pb-3 font-mono">
        <span className="text-cyan-400 font-bold">
          {mode === 'kruskal' && (realWorldMode ? 'Campus Fiber Network MST (Kruskal)' : 'Kruskal Minimum Spanning Tree')}
          {mode === 'prim' && (realWorldMode ? 'Infrastructure Expansion MST (Prim)' : "Prim's Growing Cut Tree")}
          {mode === 'dijkstra' && (realWorldMode ? 'Fastest Highway Transit (Dijkstra)' : "Dijkstra's Single-Source Shortest Paths")}
        </span>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          {mode === 'kruskal' && (
            <>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> MST Edge</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded"></span> Cycle Rejected</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded"></span> Candidate</span>
            </>
          )}
          {mode === 'prim' && (
            <>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Visited Cluster</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-400 rounded"></span> Cut Frontier</span>
            </>
          )}
          {mode === 'dijkstra' && (
            <>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Finalized Node</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded"></span> Active Relaxation</span>
            </>
          )}
        </div>
      </div>

      {/* Graph SVG Canvas */}
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-2 flex justify-center items-center overflow-hidden">
        <svg ref={svgRef} viewBox="0 0 520 260" preserveAspectRatio="none" onClick={handleCanvasClick} onPointerMove={handleCanvasPointerMove} onPointerUp={() => setDraggingNodeId(null)} onPointerLeave={() => setDraggingNodeId(null)} className={`w-full max-w-xl h-64 select-none ${editable && editorMode === 'add-node' ? 'cursor-crosshair' : ''}`}>
          {nodes.length === 0 && <text x="260" y="130" textAnchor="middle" fill="#64748b" fontSize="13">Add a vertex to start building your graph</text>}
          {/* Defs for glow filters & markers */}
          <defs>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Draw Graph Edges */}
          {edges.map((e) => {
            const nodeU = nodes.find(n => n.id === e.u);
            const nodeV = nodes.find(n => n.id === e.v);
            if (!nodeU || !nodeV) return null;

            const isMst = isEdgeInList(mstEdges, e);
            const isRejected = isEdgeInList(rejectedEdges, e);
            const isCurrent = currentEdge?.id === e.id || currentEdge?.u === e.u && currentEdge?.v === e.v;
            const isFrontier = isEdgeInList(frontierEdges, e);
            const isRelaxed = relaxedEdge?.id === e.id || (relaxedEdge?.u === e.u && relaxedEdge?.v === e.v);

            let strokeColor = '#334155'; // default slate-700
            let strokeWidth = 2;
            let strokeDash: string | undefined = undefined;

            if (editable && selectedEdgeId === e.id) {
              strokeColor = '#a78bfa';
              strokeWidth = 4;
            } else if (isMst) {
              strokeColor = '#10b981'; // emerald-500
              strokeWidth = 4;
            } else if (isRejected) {
              strokeColor = '#f43f5e'; // rose-500
              strokeWidth = 2;
              strokeDash = '4 4';
            } else if (isRelaxed || isCurrent) {
              strokeColor = '#f59e0b'; // amber-500
              strokeWidth = 3.5;
            } else if (isFrontier) {
              strokeColor = '#38bdf8'; // sky-400
              strokeWidth = 2.5;
              strokeDash = '3 3';
            }

            const midX = (nodeU.x + nodeV.x) / 2;
            const midY = (nodeU.y + nodeV.y) / 2;

            return (
              <g key={e.id} onClick={(event) => handleEdgeClick(event, e)} className={editable ? 'cursor-pointer' : ''}>
                <line
                  x1={nodeU.x}
                  y1={nodeU.y}
                  x2={nodeV.x}
                  y2={nodeV.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  className="transition-all duration-300"
                />
                {/* Weight badge pill */}
                <rect
                  x={midX - 12}
                  y={midY - 10}
                  width="24"
                  height="20"
                  rx="6"
                  fill="#0f172a"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* 2. Draw Graph Vertices */}
          {nodes.map((n) => {
            const isVisited = visitedNodes.includes(n.id);
            const isCurrent = currentNode === n.id;
            const dist = distances[n.id];

            let fillColor = '#1e293b';
            let strokeColor = '#64748b';
            let strokeWidth = 2;

            if (editable && selectedNodeIds.includes(n.id)) {
              fillColor = '#164e63';
              strokeColor = '#22d3ee';
              strokeWidth = 4;
            } else if (isCurrent) {
              fillColor = '#78350f';
              strokeColor = '#fbbf24';
              strokeWidth = 3.5;
            } else if (isVisited) {
              fillColor = '#064e3b';
              strokeColor = '#34d399';
              strokeWidth = 3;
            }

            return (
              <g key={n.id} onClick={(event) => handleNodeClick(event, n)} onPointerDown={(event) => {
                if (!editable || editorMode !== 'select') return;
                event.stopPropagation();
                setDraggingNodeId(n.id);
                (event.currentTarget as SVGGElement).setPointerCapture?.(event.pointerId);
              }} className={`transition-all duration-300 ${editable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="cursor-pointer"
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {n.label}
                </text>

                {/* Distance tag for Dijkstra */}
                {mode === 'dijkstra' && dist !== undefined && (
                  <g>
                    <rect
                      x={n.x - 16}
                      y={n.y - 32}
                      width="32"
                      height="16"
                      rx="4"
                      fill="#030712"
                      stroke={dist === Infinity ? '#4b5563' : '#38bdf8'}
                      strokeWidth="1"
                    />
                    <text
                      x={n.x}
                      y={n.y - 20}
                      textAnchor="middle"
                      fill={dist === Infinity ? '#9ca3af' : '#38bdf8'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {dist === Infinity ? '∞' : dist}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Summary Pill */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
        <div>
          {mode === 'kruskal' && (
            <span>MST Edges: <strong className="text-emerald-400">{mstEdges.length}</strong> / {nodes.length - 1} | Rejected (Cycles): <strong className="text-rose-400">{rejectedEdges.length}</strong></span>
          )}
          {mode === 'prim' && (
            <span>Visited Cluster: <strong className="text-emerald-400">{visitedNodes.length}</strong> / {nodes.length} Vertices</span>
          )}
          {mode === 'dijkstra' && (
            <span>Finalized Nodes: <strong className="text-emerald-400">{visitedNodes.length}</strong> / {nodes.length}</span>
          )}
        </div>
        <div className="text-right">
          {mode !== 'dijkstra' ? (
            <span>Total Weight: <strong className="text-cyan-400 font-bold">{mstEdges.reduce((s, e) => s + e.weight, 0)}</strong></span>
          ) : (
            <span>Target Distance: <strong className="text-emerald-400 font-bold">{distances[nodes[nodes.length - 1]?.id] ?? 'N/A'}</strong></span>
          )}
        </div>
      </div>
    </div>
  );
};
