// The place tree: plain TypeScript, no React, no map (decision #39). Load data/places.json, pass it to loadTree().
export { loadTree, type Tree } from './tree';
export { fold } from './search';
export type { Country, Crumb, NodeKind, Place, Region, TreeNode } from './types';
