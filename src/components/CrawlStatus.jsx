/**
 * CrawlStatus — bottom status bar showing crawling progress.
 */
export default function CrawlStatus({ isCrawling, phase, progress, keyword }) {
  if (!isCrawling && phase !== 'done') return null;

  const phaseLabels = {
    root: '🔍 Discovering root node...',
    branches: '🌿 Exploring branches...',
    details: '📝 Fetching details...',
    crossrefs: '🔗 Discovering connections...',
    done: '✨ Tree complete!',
  };

  const phaseLabel = phaseLabels[phase] || 'Initializing...';

  return (
    <div className={`crawl-status ${phase === 'done' ? 'crawl-status-done' : ''}`}>
      <div className="crawl-status-inner">
        <div className="crawl-status-text">
          <span className="crawl-keyword">{keyword}</span>
          <span className="crawl-phase">{phaseLabel}</span>
        </div>
        <div className="crawl-progress-bar">
          <div
            className="crawl-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="crawl-percent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
