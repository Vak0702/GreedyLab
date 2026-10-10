import { GraphNode, GraphEdge, AlgorithmStep } from '../../types/algorithms';

// Disjoint Set (Union-Find) with Path Compression and Union by Rank
class DisjointSet {
  parent: Record<string, string> = {};
  rank: Record<string, number> = {};

  constructor(nodeIds: string[]) {
    for (const id of nodeIds) {
      this.parent[id] = id;
      this.rank[id] = 0;
    }
  }

  find(i: string): string {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i: string, j: string): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return false;

    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }
}

export const runKruskal = (nodes: GraphNode[], edges: GraphEdge[]) => {
  if (nodes.length === 0 || edges.length === 0) {
    return { mstEdges: [], totalWeight: 0, isSpanningTree: nodes.length <= 1, steps: [], sortedEdges: [] };
  }

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(nodes.map(n => n.id));
  const mstEdges: GraphEdge[] = [];
  const rejectedEdges: GraphEdge[] = [];
  const steps: AlgorithmStep[] = [];
  let totalWeight = 0;

  steps.push({
    stepNumber: 0,
    action: 'Sort All Edges',
    explanation: `Sorted ${edges.length} edges in ascending order of weight. Initialized Union-Find disjoint sets for ${nodes.length} vertices.`,
    mstEdges: [],
    rejectedEdges: []
  });

  sortedEdges.forEach((edge, idx) => {
    const rootU = dsu.find(edge.u);
    const rootV = dsu.find(edge.v);

    if (rootU !== rootV) {
      dsu.union(edge.u, edge.v);
      mstEdges.push(edge);
      totalWeight += edge.weight;

      steps.push({
        stepNumber: idx + 1,
        action: `Accept Edge (${edge.u}—${edge.v}, w=${edge.weight})`,
        explanation: `Edge (${edge.u}—${edge.v}) connects separate components (root ${rootU} and root ${rootV}). Added to MST without creating a cycle. Total MST Weight: ${totalWeight}.`,
        currentEdge: edge,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges]
      });
    } else {
      rejectedEdges.push(edge);
      steps.push({
        stepNumber: idx + 1,
        action: `Reject Edge (${edge.u}—${edge.v}, w=${edge.weight})`,
        explanation: `Rejected edge (${edge.u}—${edge.v}): Vertices ${edge.u} and ${edge.v} already share root '${rootU}'. Adding this edge would form a cycle!`,
        currentEdge: edge,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        cycleNodes: [edge.u, edge.v]
      });
    }
  });

  return {
    mstEdges,
    totalWeight,
    acceptedCount: mstEdges.length,
    rejectedCount: rejectedEdges.length,
    isSpanningTree: mstEdges.length === Math.max(nodes.length - 1, 0),
    steps,
    sortedEdges
  };
};
