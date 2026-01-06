import { fetchJson } from '../index';
import { type ApiGraph } from '../types';

export const treeApi = {
    getCraftingTree: (targetItemId?: string) => fetchJson<ApiGraph>('/crafting-tree', {
        params: {
            target_item_id: targetItemId,
        },
    }),
};