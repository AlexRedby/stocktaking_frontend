export interface ApiGraph {
    nodes: ApiGraphNode[];
    edges: ApiGraphEdge[];
}

export interface ApiGraphNode {
    id: string;
    data: ApiNodeData;
}

export interface ApiNodeData extends Record<string, unknown> {
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

export interface ApiGraphEdge {
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
