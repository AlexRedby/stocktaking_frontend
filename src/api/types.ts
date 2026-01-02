export interface ReactFlowGraph {
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
}

export interface ReactFlowNode {
    id: string;
    data: ReactFlowNodeData;
}

export interface ReactFlowNodeData {
    label: string;
    fullName: string;
    shortName: string;
    image: string;
    stations: Array<{
        id: string;
        name: string;
        level: number;
        image: string;
    }>;
}

export interface ReactFlowEdge {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
}

export interface CraftableItem {
    id: string;
    fullName: string;
    shortName: string;
}

export type RequestParams = Record<string, string | number | boolean | undefined | null>;
