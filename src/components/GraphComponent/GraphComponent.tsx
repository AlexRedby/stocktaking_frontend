import './GraphComponent.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MiniMap,
  type Node,
  type Edge,
  Position,
} from '@xyflow/react';
import {
  Stack,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

import ItemNode from '../nodes/ItemNode';
import { useCraftableItems } from '@/hooks/queries/useCraftableItems';
import { useCraftingTree } from '@/hooks/queries/useCraftingTree';
import type { CraftableItem } from '@/api/types';
import { getElkLayoutedElements } from './layout';
import { ELK_OPTIONS } from './constants';

/**
 * Main layout component that handles the graph visualization
 */
const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  
  // Graph state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [targetItem, setSelectedTargetItem] = useState<CraftableItem | null>(null);
  const [direction, setDirection] = useState<Position>(Position.Bottom);

  // Autocomplete state
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data fetching
  const craftingTreeInfo = useCraftingTree(targetItem?.id, { enabled: false });
  const { data: craftableItems } = useCraftableItems(inputValue);

  const graph = craftingTreeInfo.data;
  const autocompleteOptions = craftableItems || [];
  const dataUpdatedAt = craftingTreeInfo.dataUpdatedAt;

  // Debounced fitView to prevent excessive calls
  const fitViewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedFitView = useCallback(() => {
    if (fitViewTimeoutRef.current) {
      clearTimeout(fitViewTimeoutRef.current);
    }
    
    fitViewTimeoutRef.current = setTimeout(() => {
      window.requestAnimationFrame(() => fitView());
    }, 100);
  }, [fitView]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fitViewTimeoutRef.current) {
        clearTimeout(fitViewTimeoutRef.current);
      }
    };
  }, []);

  // Layout the graph when data changes or direction changes
  useEffect(() => {
    if (!graph) return;
    
    console.log('Requesting tree for item', targetItem, 'with direction', direction);

    // Convert Position enum to ELK direction
    const elkDirection =
      direction === Position.Top ? 'UP' :
      direction === Position.Bottom ? 'DOWN' :
      direction === Position.Left ? 'LEFT' :
      'RIGHT';

    const layoutOptions = {
      'elk.direction': elkDirection,
      ...ELK_OPTIONS,
    };

    getElkLayoutedElements(graph, layoutOptions)
      .then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        debouncedFitView();
      })
      .catch(console.error);
  }, [graph, direction, debouncedFitView, setNodes, setEdges, targetItem, dataUpdatedAt]);

  const handleDirectionChange = (_: React.MouseEvent<HTMLElement>, newDirection: Position | null) => {
    if (newDirection !== null) {
      setDirection(newDirection);
    }
  };

  const handleRefresh = () => {
    craftingTreeInfo.refetch();
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{ itemNode: ItemNode }}
      colorMode="dark"
      fitView
    >
      <Background />
      <MiniMap />

      <Panel position="top-right" className="panel-with-background">
        <Stack spacing={1}>
          <Autocomplete
            sx={{ width: 300 }}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.fullName}
            options={autocompleteOptions}
            loading={loading}
            filterOptions={(x) => x}
            onChange={(_, newValue) => setSelectedTargetItem(newValue)}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Target item"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
            )}
          />

          <ToggleButtonGroup
            value={direction}
            exclusive
            onChange={handleDirectionChange}
            aria-label="graph direction"
            size="small"
            fullWidth
          >
            <ToggleButton value={Position.Top} aria-label="up">
              ↑ Up
            </ToggleButton>
            <ToggleButton value={Position.Bottom} aria-label="down">
              ↓ Down
            </ToggleButton>
            <ToggleButton value={Position.Left} aria-label="left">
              ← Left
            </ToggleButton>
            <ToggleButton value={Position.Right} aria-label="right">
              → Right
            </ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </Stack>
      </Panel>
    </ReactFlow>
  );
};

/**
 * Root component that provides ReactFlow context
 */
export default function GraphComponent() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}