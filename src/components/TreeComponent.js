'use client';

import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';

// import { Tree } from 'react-d3-tree';
const Tree = dynamic(
    () => import('react-d3-tree'),
    { ssr: false }
);

// const orgChart = {
//   name: 'CEO',
//   children: [
//     {
//       name: 'Manager',
//       attributes: {
//         department: 'Production',
//       },
//       children: [
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Fabrication',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Assembly',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <rect width="20" height="20" x="-10" onClick={toggleNode} />
      <text fill="black" x="20">
        {nodeDatum.name + " (" + nodeDatum.attributes?.count + ")"}
      </text>
    </g>
  );

export default function TreeComponent() {
    const [orgChart, setOrgChart] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/barter-tree');
                const data = await response.json();
                setOrgChart(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);

    return (
    <div style={{ position: 'fixed', display: 'flex', width: '100%', height: '100%' }}>
        <Tree 
            data={orgChart}
            orientation='vertical'
            zoomable={false}
            draggable={true}
            centeringTransitionDuration={800}
            translate={{ x: 700, y: 300 }}
            separation={{ siblings: 2, nonSiblings: 2 }}
            zoom={1}
            scaleExtent={{ min: 0.1, max: 1 }}
            initialDepth={1}
            depthFactor={0}
            hasInteractiveNodes={true}
            renderCustomNodeElement={renderRectSvgNode}
        />
    </div>
    );
}