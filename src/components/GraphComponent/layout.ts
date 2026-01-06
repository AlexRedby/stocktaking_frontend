import ELK, { type LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import type { ApiGraph } from '@/api/types';
import type { ReactFlowGraph, ExtendedElkNode } from './types';
import { ELK_OPTIONS } from './constants';
import {
  convertToElkEdges,
  convertToElkNodes,
  convertToReactFlowNodes,
  convertToReactFlowEdges,
} from './utils';

const elk = new ELK();

/**
 * Performs ELK layout on the graph and returns ReactFlow-compatible nodes and edges
 * 
 * This function:
 * 1. Converts API graph data to ELK format
 * 2. Runs the ELK layout algorithm
 * 3. Converts the layouted graph back to ReactFlow format
 * 
 * @param graph - The graph data from the API
 * @param options - Additional ELK layout options (merged with defaults)
 * @returns Promise resolving to ReactFlow-compatible graph structure
 */
export const getElkLayoutedElements = (
  graph: ApiGraph, 
  options: LayoutOptions = {}
): Promise<ReactFlowGraph> => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';

  const elkGraph: ExtendedElkNode = {
    id: 'root',
    layoutOptions: options,
    children: convertToElkNodes(graph.nodes),
    edges: convertToElkEdges(graph.edges),
  };

  return elk
    .layout(elkGraph)
    .then((layoutedGraph) => ({
      nodes: convertToReactFlowNodes(layoutedGraph.children, isHorizontal),
      edges: convertToReactFlowEdges(graph.edges),
    }));
};

/**
 * Creates layout options for downward (vertical) graph layout
 * 
 * @returns Layout options configured for vertical layout
 */
export const createDownwardLayoutOptions = (): LayoutOptions => ({
  'elk.direction': 'DOWN',
  ...ELK_OPTIONS,
});