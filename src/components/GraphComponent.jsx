'use client';

import './GraphComponent.css'
import { debounce } from "lodash";
import React, { useCallback, useState, useEffect } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import { stratify, tree } from 'd3-hierarchy';
import dagre from '@dagrejs/dagre';
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

import '@xyflow/react/dist/style.css';

import { 
  Stack,
  TextField, 
  Button, 
  Autocomplete, 
  CircularProgress
} from '@mui/material';

const initialNodes = [
  { id: '1', position: { x: 200, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 200, y: 100 }, data: { label: '3' } },
  { id: '4', position: { x: 400, y: 200 }, data: { label: '4' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e1-4', source: '1', target: '4' },
];

const g = tree();
const getD3LayoutedElements = (nodes, edges, options) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document
    .querySelector(`[data-id="${nodes[0].id}"]`)
    .getBoundingClientRect();
  const hierarchy = stratify()
    .id((node) => node.id)
    .parentId((node) => edges.find((edge) => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const layout = g.nodeSize([width * 2, height * 2])(root);

  return {
    nodes: layout
      .descendants()
      .map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges,
  };
};

const nodeWidth = 172;
const nodeHeight = 36;
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getDagreLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });
 
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
 
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
 
  dagre.layout(dagreGraph);
 
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
 
    return newNode;
  });
 
  return { nodes: newNodes, edges };
};

const elk = new ELK();
// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '200',
  'elk.spacing.nodeNode': '80',
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
      width: 150,
      height: 50,
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

  const onClick = () => {
    const fetchData = async () => {
      try {
          console.log("Requesting tree for item", targetItem);
          const response = await fetch('/api/crafting-tree?' + new URLSearchParams({
            target_item_id: targetItem?.id,
          }).toString());
          const data = await response.json();
          const nodes = data.nodes.map((x) => {
            x.position = { x: 0, y: 0 }
            return x
          });

          getElkLayoutedElements(nodes, data.edges, { 'elk.direction' : 'DOWN', ...elkOptions}).then(
            ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
              setNodes(layoutedNodes);
              setEdges(layoutedEdges);
      
              window.requestAnimationFrame(() => fitView());
            },
          );

          // setNodes(nodes);
          // setEdges(data.edges);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // const { nodes: layoutedNodes, edges: layoutedEdges } = getDagreLayoutedElements(nodes, edges);

    // setNodes([...layoutedNodes]);
    // setEdges([...layoutedEdges]);

    // window.requestAnimationFrame(() => {
    //   fitView();
    // });
  }

  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const debounceMs = 1000;

  // Debounced function to fetch data
  const debouncedFetchData = React.useMemo(
    () => 
      debounce(async (query) => {
        setLoading(true);
        
        try {
          const response = await fetch('/api/craftable-items?' + new URLSearchParams({
            filter: query,
          }).toString());
          const data = await response.json();

          setOptions(data);
        } catch (error) {
          console.error('Error fetching autocomplete options:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, debounceMs),
    [debounceMs]
  );

  // Fetch initial options when dropdown is opened
  useEffect(() => {
    if (!open) {
      return;
    }

    // Only fetch if no options loaded yet
    if (options.length === 0 && !loading) {
      debouncedFetchData(inputValue);
    }
  }, [open, options.length, loading, debouncedFetchData, inputValue]);

  // Fetch options when input changes
  useEffect(() => {
    if (open) {
      debouncedFetchData(inputValue);
    }
  }, [inputValue, open, debouncedFetchData]);

  // Cleanup debounced function when component unmounts
  useEffect(() => {
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
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