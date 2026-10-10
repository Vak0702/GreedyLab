import { GraphNode, GraphEdge, AlgorithmStep } from '../../types/algorithms';

export const runPrim = (nodes: GraphNode[], edges: GraphEdge[], startNodeId?: string) => {
  if (nodes.length === 0 || edges.length === 0) {
    return { mstEdges: [], totalWeight: 0, visitedNodes: [], steps: [] };
  }

  const startId = startNodeId || nodes[0].id;
  const visited = new Set<string>([startId]);
  const mstEdges: GraphEdge[] = [];
  const steps: AlgorithmStep[] = [];
  let totalWeight = 0;

  // Build adjacency list
  const adj = new Map<string, { neighbor: string; edge: GraphEdge }[]>();
  nodes.forEach(n => adj.set(n.id, []));
  edges.forEach(e => {
    adj.get(e.u)?.push({ neighbor: e.v, edge: e });
    adj.get(e.v)?.push({ neighbor: e.u, edge: e });
  });

  const getFrontier = () => {
    const frontier: GraphEdge[] = [];
    visited.forEach(u => {
      const neighbors = adj.get(u) || [];
      neighbors.forEach(({ neighbor: v, edge }) => {
        if (!visited.has(v)) {
          frontier.push(edge);
        }
      });
    });
    return frontier;
  };

  steps.push({
    stepNumber: 0,
    action: `Initialize Tree from Root '${startId}'`,
    explanation: `Started Prim's algorithm at root vertex '${startId}'. Initialized visited set: {${startId}}. Cut frontier established.`,
    visitedNodes: Array.from(visited),
    mstEdges: [],
    frontierEdges: getFrontier()
  });

  let stepNum = 1;

  while (visited.size < nodes.length) {
    const frontier = getFrontier();
    if (frontier.length === 0) {
      // Disconnected graph
      break;
    }

    // Pick minimum weight cut edge
    frontier.sort((a, b) => a.weight - b.weight);
    const bestEdge = frontier[0];

    // Determine the newly added vertex
    const newVertex = visited.has(bestEdge.u) ? bestEdge.v : bestEdge.u;
    visited.add(newVertex);
    mstEdges.push(bestEdge);
    totalWeight += bestEdge.weight;

    const remainingFrontier = getFrontier();

    steps.push({
      stepNumber: stepNum++,
      action: `Expand Cut: Add (${bestEdge.u}—${bestEdge.v}, w=${bestEdge.weight})`,
      explanation: `Selected minimum weight cut edge (${bestEdge.u}—${bestEdge.v}, w=${bestEdge.weight}) crossing the cut between visited and unvisited vertices. Added vertex '${newVertex}' to MST. Current MST Weight: ${totalWeight}.`,
      currentEdge: bestEdge,
      visitedNodes: Array.from(visited),
      mstEdges: [...mstEdges],
      frontierEdges: remainingFrontier
    });
  }

  return {
    mstEdges,
    totalWeight,
    visitedNodes: Array.from(visited),
    isSpanningTree: visited.size === nodes.length,
    steps
  };
};
