import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { formApi } from '@/api/endpoints/form';
import { CraftableItem } from '@/api/types';

export function useCraftableItems(filter?: string, options?: UseQueryOptions<CraftableItem[]>) {
  console.log(`filter = ${filter}`)
  return useQuery({
    queryKey: ['craftable-items', filter],
    queryFn: () => formApi.getCraftableItems(filter),
    ...options,
  });
}