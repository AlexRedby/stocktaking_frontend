import './GraphComponent.css'
import ItemNode from './ItemNode';
import React, { useCallback, useState, useEffect, use } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MiniMap,
  Controls,
} from '@xyflow/react';

import {
  Stack,
  TextField,
  Button,
  Autocomplete,
  CircularProgress
} from '@mui/material';

import { useCraftableItems } from 'hooks/queries/useCraftableItems';
import { useCraftingTree } from 'hooks/queries/useCraftingTree';

const elk = new ELK();
// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.wrapping.cutting.msd.freedom': 0,

  'elk.overlapRemoval.maxIterations': 1000,
  'elk.overlapRemoval.runScanline': true,

  'elk.layered.thoroughness': 100,
};
const getElkLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 300, // 64 + 10 + 10 + 10 + text width 
      height: 84, // 64 + 10 + 10
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [targetItem, setSelectedTargetItem] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //       try {
  //           console.log("Requesting tree for item", targetItem);
  //           const response = await fetch('/api/crafting-tree?' + new URLSearchParams({
  //             target_item_id: targetItem?.id,
  //           }).toString());
  //           const data = await response.json();
  //           const nodes = data.nodes.map((x) => {
  //             x.position = { x: 0, y: 0 }
  //             return x
  //           })
  //           setNodes(nodes);
  //           setEdges(data.edges);
  //       } catch (error) {
  //           console.error('Error fetching data:', error);
  //       }
  //   };

  //   fetchData();
  // }, [targetItem]);

  const craftingTreeInfo = useCraftingTree(targetItem?.id, {enabled: false});
  const graph = craftingTreeInfo.data;

  useEffect(() => {
    if (!graph) {
      return;
    }
    
    console.log("Requesting tree for item", targetItem);

    const nodes = graph.nodes.map((x) => {
      x.type = 'itemNode'
      x.position = { x: 0, y: 0 }
      return x
    });

    getElkLayoutedElements(nodes, graph.edges, { 'elk.direction': 'DOWN', ...elkOptions }).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      },
    );
  }, [graph]);

  const onClick = () => {
    craftingTreeInfo.refetch()
  }

  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { data, isLoading, error } = useCraftableItems(inputValue);

  const options = data || [];

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
            options={options}
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

          <Button variant="outlined" onClick={onClick}>Refresh</Button>
        </Stack>
      </Panel>
    </ReactFlow>
  );
};

export default function GraphComponent() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}