import { Graph } from '@/app/NodeNav';

export function dijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): { path: string[]; distance: number } {
  const distances: Map<string, number> = new Map();
  const previousNodes: Map<string, string | null> = new Map();
  const unvisitedNodes: Set<string> = new Set(graph.nodes.keys());

  // Initialize distances
  graph.nodes.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previousNodes.set(nodeId, null);
  });
  distances.set(startNodeId, 0);

  while (unvisitedNodes.size > 0) {
    // Get the node with the smallest distance
    const currentNodeId = [...unvisitedNodes].reduce((minNode, node) =>
      distances.get(node)! < distances.get(minNode)! ? node : minNode
    );

    unvisitedNodes.delete(currentNodeId);

    // If we've reached the destination, reconstruct the path
    if (currentNodeId === endNodeId) {
      let path: string[] = [];
      let step: string | null = endNodeId;

      while (step) {
        path.unshift(step);
        step = previousNodes.get(step) || null;
      }

      return { path, distance: distances.get(endNodeId)! };
    }

    // Update distances to neighbors
    for (const edge of graph.getNeighbors(currentNodeId)) {
      const newDistance = distances.get(currentNodeId)! + edge.weight;

      if (newDistance < distances.get(edge.to)!) {
        distances.set(edge.to, newDistance);
        previousNodes.set(edge.to, currentNodeId);
      }
    }
  }

  return { path: [], distance: Infinity }; // No path found
}
