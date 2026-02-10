import { TYPE_COLORS, NODE_ICONS } from '../data/mockData';

/**
 * NodeDetailPanel — slides in from the right when a node is clicked.
 * Shows full details, links, and connected nodes.
 */
export default function NodeDetailPanel({ node, flatNodes, crossRefs, onClose, onNavigate }) {
  if (!node) return null;

  const typeColor = TYPE_COLORS[node.type] || '#fff';

  // Find parent
  const parent = node.parentId ? flatNodes.find(n => n.id === node.parentId) : null;

  // Find children
  const children = flatNodes.filter(n => n.parentId === node.id);

  // Find cross-references involving this node
  const refs = crossRefs.filter(r => r.source === node.id || r.target === node.id);
  const crossNodes = refs.map(r => {
    const otherId = r.source === node.id ? r.target : r.source;
    const other = flatNodes.find(n => n.id === otherId);
    return { ...r, other };
  }).filter(r => r.other);

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <button className="detail-close" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="detail-content">
        {/* Type badge */}
        <div className="detail-type" style={{ color: typeColor, borderColor: typeColor }}>
          <span className="detail-type-icon">{NODE_ICONS[node.type] || '◇'}</span>
          {node.type}
        </div>

        {/* Title */}
        <h2 className="detail-title">{node.label}</h2>

        {/* Year */}
        <div className="detail-year">{node.year}</div>

        {/* Description */}
        <p className="detail-description">{node.description}</p>

        {/* Official link */}
        {node.url && node.url !== '#' && (
          <a
            className="detail-link"
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 Official Link →
          </a>
        )}

        {/* Branch */}
        <div className="detail-meta">
          <span className="detail-meta-label">Branch:</span>
          <span className="detail-meta-value">{node.branch}</span>
        </div>

        {/* Connected nodes */}
        {parent && (
          <div className="detail-section">
            <h3 className="detail-section-title">↑ Parent</h3>
            <button className="detail-nav-button" onClick={() => onNavigate(parent)}>
              <span className="nav-icon">{NODE_ICONS[parent.type] || '◇'}</span>
              {parent.label}
              <span className="nav-year">{parent.year}</span>
            </button>
          </div>
        )}

        {children.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-title">↓ Children ({children.length})</h3>
            {children.map(child => (
              <button
                key={child.id}
                className="detail-nav-button"
                onClick={() => onNavigate(child)}
              >
                <span className="nav-icon">{NODE_ICONS[child.type] || '◇'}</span>
                {child.label}
                <span className="nav-year">{child.year}</span>
              </button>
            ))}
          </div>
        )}

        {crossNodes.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-title">⤭ Cross-references</h3>
            {crossNodes.map((cr, i) => (
              <button
                key={i}
                className="detail-nav-button detail-nav-crossref"
                onClick={() => onNavigate(cr.other)}
              >
                <span className="nav-icon">{NODE_ICONS[cr.other.type] || '◇'}</span>
                {cr.other.label}
                <span className="nav-label-badge">{cr.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
