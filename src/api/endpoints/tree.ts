import { fetchJson } from '../index';
import { ReactFlowGraph } from '../types';

export const treeApi = {
    getCraftingTree: (targetItemId?: string) => fetchJson<ReactFlowGraph>('/crafting-tree', {
        params: {
            target_item_id: targetItemId,
        },
    }),
};