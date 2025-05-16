export interface CraftableItem {
    id: string;
    fullName: string;
    shortName: string;
}

export type RequestParams = Record<string, string | number | boolean | undefined | null>;
