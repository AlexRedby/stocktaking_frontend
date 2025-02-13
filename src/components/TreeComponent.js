'use client';

import dynamic from "next/dynamic";
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

const data = await fetch('http://localhost:8080/barter-tree')
const orgChart = await data.json()

export default function TreeComponent() {
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
        />
    </div>
    );
}