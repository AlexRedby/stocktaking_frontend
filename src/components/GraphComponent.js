'use client';

import React, { useCallback, useState, useEffect } from 'react';
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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

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

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('/api/crafting-tree');
            const data = await response.json();
            const nodes = data.nodes.map((x) => {
              x.position = { x: 0, y: 0 }
              return x
            })
            setNodes(nodes);
            setEdges(data.edges);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getD3LayoutedElements(nodes, edges);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

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

      <Panel position="top-right">
        <button onClick={onLayout}>layout</button>
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