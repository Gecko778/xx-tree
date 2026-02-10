import { useState, useRef, useEffect } from 'react';

/**
 * SearchBar — centered input for entering a topic keyword.
 * Animates from center (landing) to top (active tree view).
 */
export default function SearchBar({ onSearch, hasSearched, isCrawling, keyword }) {
  const [value, setValue] = useState(keyword || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!hasSearched && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasSearched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !isCrawling) {
      onSearch(trimmed);
    }
  };

  const suggestions = [
    'Artificial Intelligence',
    'Blockchain',
    'Quantum Computing',
    'Space Exploration',
    'Renewable Energy',
  ];

  return (
    <div className={`search-bar-container ${hasSearched ? 'search-bar-top' : 'search-bar-center'}`}>
      {!hasSearched && (
        <div className="search-hero">
          <div className="search-logo">🌳</div>
          <h1 className="search-title">XX-Tree</h1>
          <p className="search-subtitle">
            Watch knowledge grow. Enter any topic to visualize its history as a living constellation.
          </p>
        </div>
      )}

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <span className="search-icon">⌕</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Enter a topic to explore its history..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isCrawling}
          />
          <button
            type="submit"
            className="search-button"
            disabled={!value.trim() || isCrawling}
          >
            {isCrawling ? (
              <span className="search-spinner">⟳</span>
            ) : (
              'Explore'
            )}
          </button>
        </div>
      </form>

      {!hasSearched && (
        <div className="search-suggestions">
          <span className="suggestions-label">Try:</span>
          {suggestions.map(s => (
            <button
              key={s}
              className="suggestion-chip"
              onClick={() => { setValue(s); onSearch(s); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
