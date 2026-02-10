/**
 * Crawler Service — simulates fetching and discovering nodes over time.
 * In production, replace with real API calls to:
 *   - Semantic Scholar API (papers)
 *   - HackerNews / ProductHunt (software)
 *   - NewsAPI (events)
 *   - Wikipedia API (general knowledge)
 */

import { generateAIHistory, generateGenericTree } from '../data/mockData';

/**
 * Simulate crawling for a keyword.
 * Returns nodes progressively via callbacks.
 *
 * @param {string} keyword - The search term
 * @param {object} callbacks
 *   - onPhase(phase, progress)  — crawl phase updates
 *   - onRootFound(rootNode)     — root node discovered
 *   - onTreeReady(tree, crossRefs) — full tree is ready
 *   - onNodeRevealed(nodeId)    — individual node revealed
 *   - onComplete()              — crawling finished
 * @returns {() => void} cancel function
 */
export function startCrawl(keyword, callbacks) {
  const { onPhase, onRootFound, onTreeReady, onNodeRevealed, onComplete } = callbacks;
  let cancelled = false;
  const timers = [];

  const schedule = (fn, delay) => {
    const id = setTimeout(() => {
      if (!cancelled) fn();
    }, delay);
    timers.push(id);
  };

  // Determine which dataset to use
  const isAI = /^(ai|artificial intelligence|machine learning|deep learning|ml|dl)$/i.test(keyword.trim());
  const { tree, crossRefs } = isAI ? generateAIHistory() : generateGenericTree(keyword);

  // If not AI, set the root label to the keyword
  if (!isAI) {
    tree.label = keyword;
  }

  // Collect all node IDs in BFS order
  const allNodeIds = [];
  const queue = [tree];
  while (queue.length > 0) {
    const node = queue.shift();
    allNodeIds.push(node.id);
    if (node.children) {
      queue.push(...node.children);
    }
  }

  // ── Phase 1: Discovering root (0-15%) ──────────────────────
  schedule(() => {
    onPhase?.('root', 5);
  }, 300);

  schedule(() => {
    onPhase?.('root', 15);
    onRootFound?.(tree);
    onTreeReady?.(tree, crossRefs);
    onNodeRevealed?.(tree.id);
  }, 800);

  // ── Phase 2: Exploring branches (15-70%) ───────────────────
  schedule(() => {
    onPhase?.('branches', 20);
  }, 1200);

  // Reveal nodes progressively
  const branchNodes = allNodeIds.slice(1); // skip root (already revealed)
  const totalBranchNodes = branchNodes.length;

  branchNodes.forEach((nodeId, index) => {
    const delay = 1500 + (index * 180); // stagger each node by 180ms
    const progress = 20 + Math.floor((index / totalBranchNodes) * 50);
    schedule(() => {
      onPhase?.('branches', Math.min(progress, 70));
      onNodeRevealed?.(nodeId);
    }, delay);
  });

  // ── Phase 3: Discovering connections (70-90%) ──────────────
  const connectionsDelay = 1500 + (totalBranchNodes * 180) + 500;
  schedule(() => {
    onPhase?.('crossrefs', 75);
  }, connectionsDelay);

  schedule(() => {
    onPhase?.('crossrefs', 90);
  }, connectionsDelay + 800);

  // ── Phase 4: Complete (100%) ────────────────────────────────
  schedule(() => {
    onPhase?.('done', 100);
    onComplete?.();
  }, connectionsDelay + 1500);

  // Return cancel function
  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
}

/**
 * Classify which branch a new node belongs to.
 * In production, this would use an LLM or embedding similarity.
 */
export function classifyNodeBranch(nodeContent, existingBranches) {
  // Placeholder — in production, use AI classification
  return existingBranches[0] || 'general';
}

/**
 * Determine the parent node for a new node.
 * In production, this would use semantic similarity + temporal ordering.
 */
export function findParentNode(newNode, existingNodes) {
  // Placeholder — find the closest earlier node in the same branch
  const sameBranch = existingNodes
    .filter(n => n.branch === newNode.branch && n.year <= newNode.year)
    .sort((a, b) => b.year - a.year);
  return sameBranch[0] || existingNodes[0];
}
