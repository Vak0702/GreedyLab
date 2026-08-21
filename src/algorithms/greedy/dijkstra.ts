import { GraphNode, GraphEdge, AlgorithmStep } from '../../types/algorithms';

export const runDijkstra = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId?: string,
  targetId?: string
) => {
  if (nodes.length === 0) {
    return { distances: {}, predecessors: {}, shortestPath: [], steps: [], hasNegativeEdge: false };
  }

  // Check for negative edge weights (Constraint: Dijkstra requires non-negative weights)
  const hasNegativeEdge = edges.some(e => e.weight < 0);
  if (hasNegativeEdge) {
    return {
      distances: {},
      predecessors: {},
      shortestPath: [],
      steps: [
        {
          stepNumber: 0,
          action: 'Error: Negative Weight Detected',
          explanation: 'Dijkstra algorithm cannot guarantee optimality with negative edge weights (greedy choice invariant fails). Use Bellman-Ford instead.'
        }
      ],
      hasNegativeEdge: true
    };
  }

  const src = sourceId || nodes[0].id;
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];

  nodes.forEach(n => {
    distances[n.id] = n.id === src ? 0 : Infinity;
    predecessors[n.id] = null;
  });

  // Build adjacency list (directed / undirected support: we treat as undirected or bidirectional by default)
  const adj = new Map<string, { neighbor: string; weight: number; edge: GraphEdge }[]>();
  nodes.forEach(n => adj.set(n.id, []));
  edges.forEach(e => {
    adj.get(e.u)?.push({ neighbor: e.v, weight: e.weight, edge: e });
    adj.get(e.v)?.push({ neighbor: e.u, weight: e.weight, edge: e });
  });

  steps.push({
    stepNumber: 0,
    action: `Initialize Distances from Source '${src}'`,
    explanation: `Source distance d[${src}] = 0. All other ${nodes.length - 1} vertices initialized to $\\infty$. Visited set is empty.`,
    currentNode: src,
    distances: { ...distances },
    predecessors: { ...predecessors },
    visitedNodes: []
  });

  let stepNum = 1;

  while (visited.size < nodes.length) {
    // Find unvisited node with smallest distance
    let minNode: string | null = null;
    let minVal = Infinity;

    nodes.forEach(n => {
      if (!visited.has(n.id) && distances[n.id] < minVal) {
        minVal = distances[n.id];
        minNode = n.id;
      }
    });

    if (!minNode || minVal === Infinity) {
      // Remaining nodes are unreachable from source
      break;
    }

    visited.add(minNode);

    steps.push({
      stepNumber: stepNum++,
      action: `Select Nearest Vertex '${minNode}' (d=${minVal})`,
      explanation: `Greedily extracted unvisited vertex '${minNode}' with minimum known distance (${minVal}). Marked as finalized.`,
      currentNode: minNode,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitedNodes: Array.from(visited)
    });

    // Relax all outgoing edges from minNode
    const neighbors = adj.get(minNode) || [];
    for (const { neighbor: v, weight, edge } of neighbors) {
      if (!visited.has(v)) {
        const alt = distances[minNode] + weight;
        if (alt < distances[v]) {
          const oldDist = distances[v] === Infinity ? '∞' : distances[v];
          distances[v] = alt;
          predecessors[v] = minNode;

          steps.push({
            stepNumber: stepNum++,
            action: `Relax Edge (${minNode}—${v}, w=${weight})`,
            explanation: `Relaxation: d[${v}] updated from ${oldDist} to ${alt} via path through '${minNode}' (${minVal} + ${weight}).`,
            currentNode: minNode,
            relaxedEdge: edge,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitedNodes: Array.from(visited)
          });
        }
      }
    }
  }

  // Reconstruct path to target if specified
  const shortestPath: string[] = [];
  const dest = targetId || nodes[nodes.length - 1].id;
  if (distances[dest] !== Infinity) {
    let curr: string | null = dest;
    while (curr !== null) {
      shortestPath.push(curr);
      curr = predecessors[curr];
    }
    shortestPath.reverse();
  }

  return {
    distances,
    predecessors,
    shortestPath,
    destination: dest,
    destinationDistance: distances[dest],
    visitedNodes: Array.from(visited),
    steps,
    hasNegativeEdge: false
  };
};
