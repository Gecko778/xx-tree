import { create } from 'zustand';

/**
 * XX-Tree global state store
 * Manages tree data, crawling state, UI state
 */
const useTreeStore = create((set, get) => ({
  // ── Tree Data ──────────────────────────────────────────────
  treeData: null,           // Hierarchical tree (root -> children)
  crossRefs: [],            // Cross-reference links [{source, target, label}]
  flatNodes: [],            // Flattened node list for quick lookup
  
  // ── Search & Crawl ────────────────────────────────────────
  keyword: '',
  isCrawling: false,
  crawlPhase: '',           // 'root' | 'branches' | 'details' | 'crossrefs' | 'done'
  crawlProgress: 0,         // 0-100
  revealedNodeIds: new Set(),  // IDs of nodes that have been "discovered"
  
  // ── UI State ──────────────────────────────────────────────
  selectedNode: null,
  hoveredNode: null,
  hasSearched: false,
  animationQueue: [],       // Nodes waiting to animate in

  // ── Actions ────────────────────────────────────────────────
  setKeyword: (keyword) => set({ keyword }),

  startCrawl: (keyword) => set({
    keyword,
    isCrawling: true,
    crawlPhase: 'root',
    crawlProgress: 0,
    hasSearched: true,
    treeData: null,
    crossRefs: [],
    flatNodes: [],
    revealedNodeIds: new Set(),
    selectedNode: null,
    animationQueue: [],
  }),

  setCrawlPhase: (phase, progress) => set({ crawlPhase: phase, crawlProgress: progress }),

  setTreeData: (treeData, crossRefs = []) => {
    // Flatten the tree for lookup
    const flatNodes = [];
    const flatten = (node, depth = 0) => {
      flatNodes.push({ ...node, depth, childCount: node.children?.length || 0 });
      node.children?.forEach(child => flatten(child, depth + 1));
    };
    if (treeData) flatten(treeData);
    set({ treeData, crossRefs, flatNodes });
  },

  revealNode: (nodeId) => set((state) => {
    const next = new Set(state.revealedNodeIds);
    next.add(nodeId);
    return { revealedNodeIds: next };
  }),

  revealNodes: (nodeIds) => set((state) => {
    const next = new Set(state.revealedNodeIds);
    nodeIds.forEach(id => next.add(id));
    return { revealedNodeIds: next };
  }),

  finishCrawl: () => set({ isCrawling: false, crawlPhase: 'done', crawlProgress: 100 }),

  selectNode: (node) => set({ selectedNode: node }),
  clearSelection: () => set({ selectedNode: null }),
  setHoveredNode: (node) => set({ hoveredNode: node }),

  // Find a node by ID in the flat list
  getNodeById: (id) => get().flatNodes.find(n => n.id === id),

  // Reset everything
  reset: () => set({
    treeData: null,
    crossRefs: [],
    flatNodes: [],
    keyword: '',
    isCrawling: false,
    crawlPhase: '',
    crawlProgress: 0,
    revealedNodeIds: new Set(),
    selectedNode: null,
    hoveredNode: null,
    hasSearched: false,
    animationQueue: [],
  }),
}));

export default useTreeStore;
