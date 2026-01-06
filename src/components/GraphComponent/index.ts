/**
 * GraphComponent module
 *
 * This module provides a graph visualization component using ReactFlow and ELK layout.
 *
 * File structure:
 * - index.ts: Main export (this file)
 * - GraphComponent.tsx: Main React component
 * - types.ts: TypeScript type definitions
 * - constants.ts: Configuration constants
 * - utils.ts: Type conversion utilities
 * - layout.ts: ELK layout logic
 */

export { default } from './GraphComponent';
export type { ExtendedElkNode as ElkNodeWithData, ReactFlowGraph } from './types';