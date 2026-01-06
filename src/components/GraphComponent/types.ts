import type { ElkNode } from 'elkjs/lib/elk.bundled.js';
import type { Node, Edge } from '@xyflow/react';
import type { ApiNodeData } from '@/api/types';

/**
 * Extended ELK node that includes our custom data
 */
export interface ExtendedElkNode extends ElkNode {
  children?: ExtendedElkNode[];
  data?: ApiNodeData;
}

/**
 * ReactFlow graph structure containing nodes and edges
 */
export interface ReactFlowGraph {
  nodes: Node[];
  edges: Edge[];
}