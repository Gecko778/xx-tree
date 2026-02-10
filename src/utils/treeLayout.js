/**
 * Tree layout utilities — computes node positions for visualization.
 * Uses D3 hierarchy + tree layout, but overrides x-coords with timeline.
 */

import * as d3 from 'd3';

/**
 * Compute the visual layout for a tree.
 *
 * @param {object} treeData - Hierarchical tree (root with children)
 * @param {object} options
 *   - width: available width
 *   - height: available height
 *   - padding: { top, right, bottom, left }
 *   - nodeSpacingY: vertical spacing between sibling nodes
 * @returns {{ nodes: Array, links: Array, yearExtent: [min, max] }}
 */
export function computeTreeLayout(treeData, options = {}) {
  if (!treeData) return { nodes: [], links: [], yearExtent: [1940, 2026] };

  const {
    width = 3000,
    height = 1600,
    padding = { top: 100, right: 150, bottom: 100, left: 150 },
    nodeSpacingY = 55,
  } = options;

  // Build D3 hierarchy
  const root = d3.hierarchy(treeData);

  // Count total leaves to determine height needs
  const leafCount = root.leaves().length;
  const dynamicHeight = Math.max(height, leafCount * nodeSpacingY + padding.top + padding.bottom);

  // Use D3 tree layout for structural positioning
  const treeLayout = d3.tree()
    .size([dynamicHeight - padding.top - padding.bottom, width - padding.left - padding.right])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.4));

  treeLayout(root);

  // Collect all years for the time scale
  const allYears = [];
  root.each(node => {
    if (node.data.year) allYears.push(node.data.year);
  });

  const yearExtent = d3.extent(allYears);
  if (!yearExtent[0]) yearExtent[0] = 1940;
  if (!yearExtent[1]) yearExtent[1] = 2026;

  // Extend a bit for padding
  yearExtent[0] -= 5;
  yearExtent[1] += 2;

  // Time scale: maps year -> x position
  const timeScale = d3.scaleLinear()
    .domain(yearExtent)
    .range([padding.left, width - padding.right]);

  // Process nodes: override x with year-based position, swap x/y for horizontal layout
  const nodes = [];
  root.each(node => {
    const yearX = timeScale(node.data.year || yearExtent[0]);
    nodes.push({
      id: node.data.id,
      label: node.data.label,
      type: node.data.type,
      year: node.data.year,
      description: node.data.description,
      url: node.data.url,
      branch: node.data.branch,
      depth: node.depth,
      // Horizontal tree: D3's y becomes our x (but we override with year), D3's x becomes our y
      x: yearX,
      y: node.x + padding.top, // D3 tree x = vertical position
      structuralX: node.y + padding.left, // Keep original for fallback
      parentId: node.parent?.data.id || null,
    });
  });

  // Process links
  const links = [];
  root.links().forEach(link => {
    const sourceNode = nodes.find(n => n.id === link.source.data.id);
    const targetNode = nodes.find(n => n.id === link.target.data.id);
    if (sourceNode && targetNode) {
      links.push({
        id: `${sourceNode.id}->${targetNode.id}`,
        source: sourceNode,
        target: targetNode,
      });
    }
  });

  return { nodes, links, yearExtent, timeScale, dynamicHeight };
}

/**
 * Generate a smooth Bézier path between two nodes (horizontal tree).
 */
export function generateLinkPath(source, target) {
  const midX = (source.x + target.x) / 2;
  return `M ${source.x},${source.y} C ${midX},${source.y} ${midX},${target.y} ${target.x},${target.y}`;
}

/**
 * Generate a curved arc path for cross-references.
 */
export function generateCrossRefPath(sourceNode, targetNode, allNodes) {
  if (!sourceNode || !targetNode) return '';
  const midX = (sourceNode.x + targetNode.x) / 2;
  const midY = (sourceNode.y + targetNode.y) / 2;
  // Curve above or below based on relative position
  const curveOffset = (sourceNode.y > targetNode.y ? -1 : 1) * 60;
  const controlY = midY + curveOffset;
  return `M ${sourceNode.x},${sourceNode.y} Q ${midX},${controlY} ${targetNode.x},${targetNode.y}`;
}

/**
 * Generate timeline ticks for the year axis.
 */
export function generateTimelineTicks(yearExtent, timeScale, step = 5) {
  const ticks = [];
  const start = Math.ceil(yearExtent[0] / step) * step;
  const end = Math.floor(yearExtent[1] / step) * step;
  for (let year = start; year <= end; year += step) {
    ticks.push({
      year,
      x: timeScale(year),
    });
  }
  return ticks;
}
