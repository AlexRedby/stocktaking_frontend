import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactFlowGraph } from '@/api/types';
import { treeApi } from '@/api/endpoints/tree';

export function useCraftingTree(targetItemId?: string, options?: UseQueryOptions<ReactFlowGraph>) {
  console.log(`filter = ${targetItemId}`)
  return useQuery({
    queryKey: ['craftable-items', targetItemId],
    queryFn: () => treeApi.getCraftingTree(targetItemId),
    ...options,
  });
}