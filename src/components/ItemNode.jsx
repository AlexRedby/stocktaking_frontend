import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import './ItemNode.css';

export default memo(({ data }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className="node-content">
                {data.image && (
                    <div className="node-image">
                        <img src={data.image} alt={data.fullName || 'Node image'}/>
                    </div>
                )}

                <div className="node-text">
                    {data.fullName && (
                        <div className="node-full-name">
                            {data.fullName}
                        </div>
                    )}

                    {data.shortName && (
                        <div className="node-short-name">
                            {data.shortName}
                        </div>
                    )}
                </div>
            </div>
            {data.stations && (
                <div className="node-stations">
                    {data.stations.map((station, i) => (
                        <div className="node-station">
                            <img src={station.image} alt={station.name || 'Station image'}/>
                            {station.name} {station.level}
                            <Handle type="source" position={Position.Bottom} id={station.id} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
});