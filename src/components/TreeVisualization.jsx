import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { computeTreeLayout, generateLinkPath, generateCrossRefPath, generateTimelineTicks } from '../utils/treeLayout';
import { TYPE_COLORS, BRANCH_COLORS, NODE_ICONS } from '../data/mockData';
import NodeParticleOverlay from './NodeParticleOverlay';

/**
 * TreeVisualization — the core SVG tree rendering with D3 zoom/pan.
 * Now with breathing nodes, energy-flow links, and particle effects.
 */
export default function TreeVisualization({
  treeData,
  crossRefs,
  revealedNodeIds,
  onNodeClick,
  onNodeHover,
  selectedNodeId,
  focusNodeId,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, k: 0.45 });

  // ── Compute layout ──────────────────────────────────────────
  const layout = useMemo(() => {
    if (!treeData) return { nodes: [], links: [], yearExtent: [1940, 2026], timeScale: null, dynamicHeight: 800 };
    return computeTreeLayout(treeData, {
      width: 3200,
      height: 1800,
      padding: { top: 120, right: 180, bottom: 120, left: 180 },
    });
  }, [treeData]);

  const { nodes, links, yearExtent, timeScale, dynamicHeight } = layout;

  const timelineTicks = useMemo(() => {
    if (!timeScale) return [];
    return generateTimelineTicks(yearExtent, timeScale, 5);
  }, [yearExtent, timeScale]);

  const crossRefPaths = useMemo(() => {
    if (!crossRefs || !nodes.length) return [];
    return crossRefs.map(ref => {
      const sourceNode = nodes.find(n => n.id === ref.source);
      const targetNode = nodes.find(n => n.id === ref.target);
      if (!sourceNode || !targetNode) return null;
      return { ...ref, path: generateCrossRefPath(sourceNode, targetNode, nodes), sourceNode, targetNode };
    }).filter(Boolean);
  }, [crossRefs, nodes]);

  const nodeAnimationMap = useMemo(() => {
    const map = {};
    [...revealedNodeIds].forEach((id, idx) => { map[id] = idx; });
    return map;
  }, [revealedNodeIds]);

  const isLinkVisible = useCallback((link) => {
    return revealedNodeIds.has(link.source.id) && revealedNodeIds.has(link.target.id);
  }, [revealedNodeIds]);

  const isCrossRefVisible = useCallback((ref) => {
    return revealedNodeIds.has(ref.source) && revealedNodeIds.has(ref.target);
  }, [revealedNodeIds]);

  // ── Unique IDs per link for gradient references ─────────────
  const linkGradients = useMemo(() => {
    return links.map(link => {
      const srcColor = BRANCH_COLORS[link.source.branch] || '#4a9eff';
      const tgtColor = BRANCH_COLORS[link.target.branch] || '#4a9eff';
      return {
        id: `lg-${link.source.id}-${link.target.id}`,
        srcColor,
        tgtColor,
        x1: link.source.x,
        y1: link.source.y,
        x2: link.target.x,
        y2: link.target.y,
      };
    });
  }, [links]);

  // ── D3 Zoom/Pan ────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom()
      .scaleExtent([0.08, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const initialScale = 0.45;
    const initialX = dimensions.width * 0.05;
    const initialY = (dimensions.height - dynamicHeight * initialScale) / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));

    return () => { svg.on('.zoom', null); };
  }, [treeData, dimensions, dynamicHeight]);

  // ── Focus on node ───────────────────────────────────────────
  useEffect(() => {
    if (!focusNodeId || !svgRef.current || !zoomRef.current) return;
    const node = nodes.find(n => n.id === focusNodeId);
    if (!node) return;
    const svg = d3.select(svgRef.current);
    const scale = 1;
    svg.transition().duration(800).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(dimensions.width / 2 - node.x * scale, dimensions.height / 2 - node.y * scale).scale(scale)
    );
  }, [focusNodeId, nodes, dimensions]);

  // ── Resize observer ─────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  SVG Definitions (filters, gradients, markers)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const renderDefs = () => (
    <defs>
      {/* ── Glow filters ───────────────────────────────── */}
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="6" result="blur1" />
        <feGaussianBlur stdDeviation="12" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── Organic turbulence for link texture ─────────── */}
      <filter id="link-organic" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="3" seed="42" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="3" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="0.6" />
      </filter>

      {/* ── Electric arc filter for cross-refs (animated seed) */}
      <filter id="electric-arc" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence type="turbulence" baseFrequency="0.03 0.12" numOctaves="3" result="turb">
          <animate attributeName="seed" from="0" to="100" dur="2s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="5" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* ── Breathing halo filter ───────────────────────── */}
      <filter id="breath-halo" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="8" result="bigblur" />
        <feColorMatrix in="bigblur" type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="dimmed" />
        <feMerge>
          <feMergeNode in="dimmed" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── Per-link gradients ──────────────────────────── */}
      {linkGradients.map(lg => (
        <linearGradient
          key={lg.id}
          id={lg.id}
          gradientUnits="userSpaceOnUse"
          x1={lg.x1} y1={lg.y1} x2={lg.x2} y2={lg.y2}
        >
          <stop offset="0%" stopColor={lg.srcColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor={lg.tgtColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor={lg.tgtColor} stopOpacity="0.15" />
        </linearGradient>
      ))}
    </defs>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Timeline
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const renderTimeline = () => (
    <g className="timeline-group">
      <line
        x1={timelineTicks[0]?.x || 0} y1={-30}
        x2={timelineTicks[timelineTicks.length - 1]?.x || 0} y2={-30}
        stroke="rgba(255,255,255,0.07)" strokeWidth={1}
      />
      {timelineTicks.map(tick => (
        <g key={tick.year} transform={`translate(${tick.x}, -30)`}>
          <line y1={-8} y2={8} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text y={-16} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize={11} fontFamily="'JetBrains Mono', monospace">
            {tick.year}
          </text>
        </g>
      ))}
      <line
        x1={timelineTicks[0]?.x || 0} y1={dynamicHeight + 30}
        x2={timelineTicks[timelineTicks.length - 1]?.x || 0} y2={dynamicHeight + 30}
        stroke="rgba(255,255,255,0.07)" strokeWidth={1}
      />
      {timelineTicks.map(tick => (
        <g key={`b-${tick.year}`} transform={`translate(${tick.x}, ${dynamicHeight + 30})`}>
          <line y1={-8} y2={8} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text y={24} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize={11} fontFamily="'JetBrains Mono', monospace">
            {tick.year}
          </text>
        </g>
      ))}
    </g>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Links — organic energy-flow lines with traveling dots
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const renderLinks = () => (
    <g className="links-group">
      {links.map((link, idx) => {
        if (!isLinkVisible(link)) return null;

        const path = generateLinkPath(link.source, link.target);
        const gradientId = `lg-${link.source.id}-${link.target.id}`;
        const branchColor = BRANCH_COLORS[link.target.branch] || '#4a9eff';
        const revealOrder = nodeAnimationMap[link.target.id] ?? 0;
        const delay = revealOrder * 0.12;
        const animDur = 3 + (idx % 5);
        const pathId = `path-${link.source.id}-${link.target.id}`;

        return (
          <g key={link.id}>
            {/* Hidden path for animateMotion reference */}
            <path id={pathId} d={path} fill="none" stroke="none" />

            {/* Base organic link — slightly turbulent for texture */}
            <path
              d={path}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#link-organic)"
              className="tree-link"
              style={{ '--link-delay': `${delay}s` }}
            />

            {/* Bright core line */}
            <path
              d={path}
              fill="none"
              stroke={branchColor}
              strokeWidth={1}
              strokeOpacity={0.55}
              strokeLinecap="round"
              className="tree-link tree-link-core"
              style={{ '--link-delay': `${delay}s` }}
            />

            {/* Traveling energy dot #1 */}
            <circle r="2" fill="white" opacity="0">
              <animateMotion dur={`${animDur}s`} repeatCount="indefinite" begin={`${delay}s`}>
                <mpath xlinkHref={`#${pathId}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.9;0.8;0" dur={`${animDur}s`} repeatCount="indefinite" begin={`${delay}s`} />
              <animate attributeName="r" values="1.5;2.5;1.5" dur={`${animDur}s`} repeatCount="indefinite" begin={`${delay}s`} />
            </circle>

            {/* Traveling energy dot #2, offset timing */}
            <circle r="1.5" fill={branchColor} opacity="0">
              <animateMotion dur={`${animDur * 1.4}s`} repeatCount="indefinite" begin={`${delay + animDur * 0.5}s`}>
                <mpath xlinkHref={`#${pathId}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;0.5;0.6;0.5;0" dur={`${animDur * 1.4}s`} repeatCount="indefinite" begin={`${delay + animDur * 0.5}s`} />
            </circle>
          </g>
        );
      })}
    </g>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Cross-references — electric arcs with sparks
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const renderCrossRefs = () => (
    <g className="crossrefs-group">
      {crossRefPaths.map((ref, i) => {
        if (!isCrossRefVisible(ref)) return null;
        const animDur = 4 + (i % 3);
        const xrefId = `xref-${i}`;

        return (
          <g key={i} className="crossref-line">
            {/* Hidden path for motion */}
            <path id={xrefId} d={ref.path} fill="none" stroke="none" />

            {/* Outer glow arc — animated turbulence */}
            <path
              d={ref.path}
              fill="none"
              stroke="rgba(255, 215, 0, 0.12)"
              strokeWidth={4}
              strokeLinecap="round"
              filter="url(#electric-arc)"
              className="crossref-glow"
            />

            {/* Core arc — dashed rhythm */}
            <path
              d={ref.path}
              fill="none"
              stroke="rgba(255, 215, 0, 0.35)"
              strokeWidth={1.2}
              strokeDasharray="8 6 2 6"
              strokeLinecap="round"
              className="crossref-path"
            />

            {/* Traveling spark */}
            <circle r="2" fill="#ffd700" opacity="0">
              <animateMotion dur={`${animDur}s`} repeatCount="indefinite">
                <mpath xlinkHref={`#${xrefId}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;0.9;1;0.9;0" dur={`${animDur}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="1;2.5;1" dur={`${animDur}s`} repeatCount="indefinite" />
            </circle>

            {/* Label */}
            {ref.label && (
              <text
                x={(ref.sourceNode.x + ref.targetNode.x) / 2}
                y={(ref.sourceNode.y + ref.targetNode.y) / 2 - 12}
                textAnchor="middle"
                fill="rgba(255, 215, 0, 0.45)"
                fontSize={8}
                fontFamily="'Inter', sans-serif"
                className="crossref-label"
              >
                {ref.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Nodes — breathing rings, inner energy core, halos
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const renderNodes = () => (
    <g className="nodes-group">
      {nodes.map(node => {
        if (!revealedNodeIds.has(node.id)) return null;

        const typeColor = TYPE_COLORS[node.type] || '#fff';
        const branchColor = BRANCH_COLORS[node.branch] || '#4a9eff';
        const isSelected = selectedNodeId === node.id;
        const isRoot = node.depth === 0;
        const isBranch = node.depth === 1;
        const revealOrder = nodeAnimationMap[node.id] ?? 0;
        const delay = revealOrder * 0.12;

        const radius = isRoot ? 22 : isBranch ? 16 : 11;
        const fontSize = isRoot ? 13 : isBranch ? 11 : 9;
        const labelOffset = radius + 14;
        const breathDur = 3 + (revealOrder % 4); // desync between nodes

        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <g
              className={`tree-node tree-node-visible ${isSelected ? 'tree-node-selected' : ''}`}
              style={{ '--node-delay': `${delay}s` }}
              onClick={() => onNodeClick?.(node)}
              onMouseEnter={() => onNodeHover?.(node)}
              onMouseLeave={() => onNodeHover?.(null)}
            >
              {/* ── Breathing pulse ring (outermost) ────── */}
              <circle r={radius + 15} fill="none" stroke={branchColor} strokeWidth={0.5} opacity={0.15}>
                <animate attributeName="r" values={`${radius + 10};${radius + 22};${radius + 10}`} dur={`${breathDur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.12;0.28;0.12" dur={`${breathDur}s`} repeatCount="indefinite" />
              </circle>

              {/* ── Second pulse ring, offset phase ─────── */}
              <circle r={radius + 8} fill="none" stroke={branchColor} strokeWidth={0.3} opacity={0.08}>
                <animate attributeName="r" values={`${radius + 5};${radius + 15};${radius + 5}`} dur={`${breathDur * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.06;0.18;0.06" dur={`${breathDur * 0.7}s`} repeatCount="indefinite" />
              </circle>

              {/* ── Ambient halo ────────────────────────── */}
              <circle r={radius + 5} fill={branchColor} opacity={0.05} filter="url(#breath-halo)">
                <animate
                  attributeName="opacity"
                  values={`${isSelected ? 0.12 : 0.04};${isSelected ? 0.25 : 0.1};${isSelected ? 0.12 : 0.04}`}
                  dur={`${breathDur}s`} repeatCount="indefinite"
                />
              </circle>

              {/* ── Outer dashed orbit ring ─────────────── */}
              <circle
                r={radius + 8}
                fill="none"
                stroke={branchColor}
                strokeWidth={1}
                strokeOpacity={isSelected ? 0.5 : 0.15}
                strokeDasharray={isRoot ? 'none' : `${Math.PI * (radius + 8) * 0.25} ${Math.PI * (radius + 8) * 0.08}`}
                className="node-ring"
              >
                {!isRoot && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0" to="360 0 0"
                    dur={`${18 + revealOrder * 2}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* ── Glow background ─────────────────────── */}
              <circle r={radius + 3} fill={branchColor} opacity={isSelected ? 0.22 : 0.07} className="node-glow" />

              {/* ── Main circle ─────────────────────────── */}
              <circle
                r={radius}
                fill={`${branchColor}15`}
                stroke={branchColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter={isSelected ? 'url(#glow-strong)' : 'url(#glow)'}
                className="node-circle"
              />

              {/* ── Inner energy core ───────────────────── */}
              <circle r={radius * 0.45} fill={typeColor} opacity={0.06}>
                <animate attributeName="opacity" values="0.04;0.14;0.04" dur={`${breathDur * 0.6}s`} repeatCount="indefinite" />
                <animate attributeName="r" values={`${radius * 0.35};${radius * 0.55};${radius * 0.35}`} dur={`${breathDur * 0.6}s`} repeatCount="indefinite" />
              </circle>

              {/* ── Type icon ───────────────────────────── */}
              <text
                textAnchor="middle" dy={isRoot ? 5 : 4}
                fill={typeColor}
                fontSize={isRoot ? 14 : isBranch ? 12 : 10}
                style={{ pointerEvents: 'none' }}
              >
                {NODE_ICONS[node.type] || '◇'}
              </text>

              {/* ── Label ───────────────────────────────── */}
              <text
                y={labelOffset} textAnchor="middle"
                fill="rgba(255,255,255,0.92)"
                fontSize={fontSize}
                fontWeight={isRoot || isBranch ? 600 : 400}
                fontFamily="'Inter', sans-serif"
                style={{ pointerEvents: 'none' }}
                className="node-label"
              >
                {truncateLabel(node.label, isRoot ? 30 : 22)}
              </text>

              {/* ── Year ────────────────────────────────── */}
              <text
                y={labelOffset + fontSize + 4} textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize={8}
                fontFamily="'JetBrains Mono', monospace"
                style={{ pointerEvents: 'none' }}
              >
                {node.year}
              </text>

              <title>{`${node.label} (${node.year}) — ${node.type}`}</title>
            </g>
          </g>
        );
      })}
    </g>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (!treeData) return null;

  return (
    <div ref={containerRef} className="tree-visualization">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="tree-svg"
      >
        {renderDefs()}
        <g ref={gRef}>
          {renderTimeline()}
          {renderLinks()}
          {renderCrossRefs()}
          {renderNodes()}
        </g>
      </svg>

      {/* Canvas particle overlay — energy sparks orbiting nodes */}
      <NodeParticleOverlay
        nodes={nodes}
        revealedNodeIds={revealedNodeIds}
        zoomTransform={zoomTransform}
      />

      {/* Zoom controls */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
        }} title="Zoom in">+</button>
        <button className="zoom-btn" onClick={() => {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
        }} title="Zoom out">−</button>
        <button className="zoom-btn" onClick={() => {
          const svg = d3.select(svgRef.current);
          const s = 0.45;
          svg.transition().duration(500).call(
            zoomRef.current.transform,
            d3.zoomIdentity.translate(dimensions.width * 0.05, (dimensions.height - dynamicHeight * s) / 2).scale(s)
          );
        }} title="Fit to view">⊡</button>
      </div>
    </div>
  );
}

function truncateLabel(text, max) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
