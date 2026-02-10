import { TYPE_COLORS, BRANCH_COLORS, NODE_ICONS } from '../data/mockData';

/**
 * Legend — shows node type and branch color mappings.
 */
export default function Legend({ branches = [] }) {
  const typeEntries = Object.entries(TYPE_COLORS);

  return (
    <div className="legend">
      <div className="legend-section">
        <h4 className="legend-title">Node Types</h4>
        <div className="legend-items">
          {typeEntries.map(([type, color]) => (
            <div key={type} className="legend-item">
              <span className="legend-icon" style={{ color }}>{NODE_ICONS[type] || '◇'}</span>
              <span className="legend-label">{type}</span>
            </div>
          ))}
        </div>
      </div>
      {branches.length > 0 && (
        <div className="legend-section">
          <h4 className="legend-title">Branches</h4>
          <div className="legend-items">
            {branches.map(b => (
              <div key={b} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: BRANCH_COLORS[b] || '#888' }}
                />
                <span className="legend-label">{b.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
