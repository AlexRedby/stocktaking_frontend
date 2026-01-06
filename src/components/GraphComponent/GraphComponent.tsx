import './GraphComponent.css';
import React, { useState, useEffect } from 'react';
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
} from '@xyflow/react';
import {
  Stack,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

import ItemNode from '../nodes/ItemNode';
import { useCraftableItems } from '@/hooks/queries/useCraftableItems';
import { useCraftingTree } from '@/hooks/queries/useCraftingTree';
import type { CraftableItem } from '@/api/types';
import { getElkLayoutedElements, createDownwardLayoutOptions } from './layout';

/**
 * Main layout component that handles the graph visualization
 */
const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  
  // Graph state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [targetItem, setSelectedTargetItem] = useState<CraftableItem | null>(null);

  // Autocomplete state
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data fetching
  const craftingTreeInfo = useCraftingTree(targetItem?.id, { enabled: false });
  const { data: craftableItems } = useCraftableItems(inputValue);

  const graph = craftingTreeInfo.data;
  const autocompleteOptions = craftableItems || [];

  // Layout the graph when data changes
  useEffect(() => {
    if (!graph) return;
    
    console.log('Requesting tree for item', targetItem);

    const layoutOptions = createDownwardLayoutOptions();

    getElkLayoutedElements(graph, layoutOptions)
      .then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        window.requestAnimationFrame(() => fitView());
      })
      .catch(console.error);
  }, [graph, fitView, setNodes, setEdges, targetItem]);

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