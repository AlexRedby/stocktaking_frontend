import type { LayoutOptions } from 'elkjs/lib/elk.bundled.js';

/**
 * Node dimensions for ELK layout calculations
 */
export const NODE_WIDTH = 450;
export const NODE_HEIGHT = 126;

/**
 * ELK layout algorithm configuration
 * 
 * References:
 * - https://www.eclipse.org/elk/reference/algorithms.html
 * - https://www.eclipse.org/elk/reference/options.html
 */
export const ELK_OPTIONS: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.wrapping.cutting.msd.freedom': '0',
  'elk.overlapRemoval.maxIterations': '1000',
  'elk.overlapRemoval.runScanline': 'true',
  'elk.layered.thoroughness': '100',
};