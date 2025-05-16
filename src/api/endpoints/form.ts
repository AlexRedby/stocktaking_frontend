import { fetchJson } from '../index';
import { CraftableItem } from '../types';

export const formApi = {
    getCraftableItems: (filter?: string) => fetchJson<CraftableItem[]>('/craftable-items', {
        params: {
            filter: filter,
        },
    }),
};