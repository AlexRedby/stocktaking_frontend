import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { type ApiGraph } from '@/api/types';
import { treeApi } from '@/api/endpoints/tree';

export function useCraftingTree(targetItemId?: string, options?: Omit<UseQueryOptions<ApiGraph>, 'queryKey'>) {
  console.log(`filter = ${targetItemId}`)
  return useQuery({
    queryKey: ['crafting-tree', targetItemId],
    queryFn: () => treeApi.getCraftingTree(targetItemId),
    ...options,
  });
}