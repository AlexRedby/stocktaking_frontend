# TODO

This document summarizes the findings from a code review of the stocktaking frontend project. Each item is marked as a TODO for tracking fixes.

## Issues Identified

- [ ] **Mixed JavaScript and TypeScript Usage**: Convert `.jsx` files (`GraphComponent.jsx`, `ItemNode.jsx`) to `.tsx` and add proper type annotations. Update `ReactFlowNodeData` in `types.ts` to include all used fields (e.g., `fullName?: string; shortName?: string; image?: string; stations?: Station[];` where `Station` is a new interface).

- [ ] **Type Inconsistencies and Incomplete Types**: Expand `ReactFlowNodeData` to match actual usage in components. Define interfaces for nested objects like `Station` with fields `id`, `name`, `level`, `image`.

- [ ] **Mutation of Immutable Data**: In `GraphComponent.jsx` (around lines 95-100), change `graph.nodes.map((x) => { x.type = 'itemNode'; x.position = { x: 0, y: 0 }; return x; })` to use immutable updates: `graph.nodes.map((x) => ({ ...x, type: 'itemNode', position: { x: 0, y: 0 } }))`.

- [ ] **Unused Import**: Remove `import { use } from 'react';` from `GraphComponent.jsx` as it's not used.

- [ ] **Query Key Collisions**: Change the `queryKey` in `useCraftingTree.ts` from `['craftable-items', targetItemId]` to `['crafting-tree', targetItemId]` to avoid conflicts with `useCraftableItems`.

- [ ] **Hardcoded Layout Dimensions**: Make node `width` (450) and `height` (126) in `getElkLayoutedElements` dynamic or configurable instead of hardcoded.

- [ ] **Lack of Error Handling**: Add error handling for `useCraftingTree` in `GraphComponent.jsx`, e.g., display error messages in the UI or log them using React Query's `error` state.

- [ ] **Potential Key Issues in Lists**: Add `key={station.id}` to the mapped `<div>` in `ItemNode.jsx` (lines ~25-30). Ensure `station.id` is globally unique, possibly by prefixing with the node ID.

- [ ] **Autocomplete Filtering Logic**: Review and document the `filterOptions={(x) => x}` in `GraphComponent.jsx` to ensure server-side filtering is sufficient, or implement client-side filtering for better UX.

- [ ] **No Tests Executed or Expanded**: Add unit tests for key components like `GraphComponent`, hooks, and API calls. Run tests regularly using `npm test`.

- [ ] **General Best Practices**:
  - [ ] Improve performance: Consider debouncing `fitView` calls if `targetItem` changes rapidly.
  - [ ] Code Organization: Move ELK layout logic to a utility file. Use consistent naming (e.g., standardize `targetItem` vs. `selectedTargetItem`).
  - [ ] Dependencies: Run `npm audit` to check for vulnerabilities.
  - [ ] Accessibility: Add ARIA labels to custom elements like nodes if needed.
  - [ ] Styling: Consider using CSS-in-JS (e.g., with `@emotion/styled`) for better scoping.

## Notes
- The app uses modern tools (React Flow, Material-UI, React Query) and is well-structured overall.
- Prioritize fixing TypeScript-related issues for better type safety and maintainability.
- Test fixes with edge cases like empty trees or API errors.