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
}

export interface ReactFlowEdge {
    id: string;
    source: string;
    target: string;
}

export interface CraftableItem {
    id: string;
    fullName: string;
    shortName: string;
}

export type RequestParams = Record<string, string | number | boolean | undefined | null>;
