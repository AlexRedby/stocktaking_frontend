import type { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import type { Node, Edge } from '@xyflow/react';
import type { ApiGraphEdge, ApiGraphNode } from '@/api/types';
import type { ExtendedElkNode } from './types';
import { Position } from '@xyflow/react';
import { NODE_WIDTH, NODE_HEIGHT } from './constants';

/**
 * Converts API edges to ELK format for layout calculation
 * 
 * @param edges - Array of edges from the API
 * @returns Array of ELK-compatible edges
 */
export const convertToElkEdges = (edges: ApiGraphEdge[]): ElkExtendedEdge[] => {
  return edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));
};

/**
 * Converts API nodes to ELK format for layout calculation
 * 
 * @param nodes - Array of nodes from the API
 * @returns Array of ELK-compatible nodes with data
 */
export const convertToElkNodes = (nodes: ApiGraphNode[]): ExtendedElkNode[] => {
  return nodes.map((node) => ({
    id: node.id,
    data: node.data,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }));
};

/**
 * Converts ELK layouted nodes back to ReactFlow format
 * 
 * @param elkNodes - Array of nodes after ELK layout
 * @param isHorizontal - Whether the layout is horizontal (affects handle positions)
 * @returns Array of ReactFlow-compatible nodes
 */
export const convertToReactFlowNodes = (
  elkNodes: ElkNode[] | undefined,
  isHorizontal: boolean
): Node[] => {
  if (!elkNodes) return [];

  return elkNodes.map((node) => {
    const elkNode = node as ExtendedElkNode;
    
    return {
      id: node.id,
      type: 'itemNode',
      data: elkNode.data ?? {},
      position: { 
        x: node.x ?? 0, 
        y: node.y ?? 0 
      },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    };
  });
};

/**
 * Converts API edges to ReactFlow format
 * 
 * @param edges - Array of edges from the API
 * @returns Array of ReactFlow-compatible edges
 */
export const convertToReactFlowEdges = (edges: ApiGraphEdge[]): Edge[] => {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
  }));
};