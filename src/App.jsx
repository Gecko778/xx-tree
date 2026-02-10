import { useCallback, useEffect, useRef, useState } from 'react';
import useTreeStore from './store/useTreeStore';
import { startCrawl } from './services/crawlerService';
import ParticleBackground from './components/ParticleBackground';
import SearchBar from './components/SearchBar';
import TreeVisualization from './components/TreeVisualization';
import NodeDetailPanel from './components/NodeDetailPanel';
import CrawlStatus from './components/CrawlStatus';
import Legend from './components/Legend';

export default function App() {
  const store = useTreeStore();
  const cancelRef = useRef(null);
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  // ── Search / Crawl handler ──────────────────────────────────
  const handleSearch = useCallback((keyword) => {
    // Cancel any running crawl
    if (cancelRef.current) cancelRef.current();

    store.startCrawl(keyword);

    const cancel = startCrawl(keyword, {
      onPhase: (phase, progress) => {
        store.setCrawlPhase(phase, progress);
      },
      onRootFound: (root) => {
        // Root discovered
      },
      onTreeReady: (tree, crossRefs) => {
        store.setTreeData(tree, crossRefs);
      },
      onNodeRevealed: (nodeId) => {
        store.revealNode(nodeId);
      },
      onComplete: () => {
        store.finishCrawl();
      },
    });

    cancelRef.current = cancel;
  }, [store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelRef.current) cancelRef.current();
    };
  }, []);

  // ── Node interaction handlers ───────────────────────────────
  const handleNodeClick = useCallback((node) => {
    store.selectNode(node);
    setFocusNodeId(node.id);
  }, [store]);

  const handleNodeHover = useCallback((node) => {
    store.setHoveredNode(node);
  }, [store]);

  const handleNavigate = useCallback((node) => {
    store.selectNode(node);
    setFocusNodeId(node.id);
  }, [store]);

  const handleCloseDetail = useCallback(() => {
    store.clearSelection();
  }, [store]);

  // ── Collect branches for legend ─────────────────────────────
  const branches = [...new Set(store.flatNodes.map(n => n.branch).filter(Boolean))];

  return (
    <div className="app">
      <ParticleBackground />

      <SearchBar
        onSearch={handleSearch}
        hasSearched={store.hasSearched}
        isCrawling={store.isCrawling}
        keyword={store.keyword}
      />

      {store.treeData && (
        <TreeVisualization
          treeData={store.treeData}
          crossRefs={store.crossRefs}
          revealedNodeIds={store.revealedNodeIds}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          selectedNodeId={store.selectedNode?.id}
          focusNodeId={focusNodeId}
        />
      )}

      {store.selectedNode && (
        <NodeDetailPanel
          node={store.selectedNode}
          flatNodes={store.flatNodes}
          crossRefs={store.crossRefs}
          onClose={handleCloseDetail}
          onNavigate={handleNavigate}
        />
      )}

      <CrawlStatus
        isCrawling={store.isCrawling}
        phase={store.crawlPhase}
        progress={store.crawlProgress}
        keyword={store.keyword}
      />

      {/* Legend toggle */}
      {store.hasSearched && (
        <button
          className="legend-toggle"
          onClick={() => setShowLegend(!showLegend)}
          title="Toggle legend"
        >
          {showLegend ? '✕' : '☰'}
        </button>
      )}

      {showLegend && <Legend branches={branches} />}

      {/* Stats */}
      {store.hasSearched && store.flatNodes.length > 0 && (
        <div className="stats-bar">
          <span>{store.revealedNodeIds.size} / {store.flatNodes.length} nodes</span>
          <span>•</span>
          <span>{store.crossRefs.length} connections</span>
        </div>
      )}
    </div>
  );
}
