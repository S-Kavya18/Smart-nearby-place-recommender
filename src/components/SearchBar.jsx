import React from 'react';
import './SearchBar.css';

const PLACE_TYPES = [
  { label: 'Any', value: '' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Cafe', value: 'cafe' },
  { label: 'Bar', value: 'bar' },
  { label: 'Bakery', value: 'bakery' },
  { label: 'Park', value: 'park' },
  { label: 'Library', value: 'library' },
];

const SearchBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-grid">
        <div className="search-input-wrapper">
          <label className="search-label">
            <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </label>
          <input
            type="text"
            value={filters.keyword || ''}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="Find places (e.g., pizza, cozy cafe)"
            className="search-input"
          />
        </div>

        <div className="filter-field-wrapper">
          <label className="search-label">Type</label>
          <select
            value={filters.placeType || ''}
            onChange={(e) => handleChange('placeType', e.target.value)}
            className="filter-select"
          >
            {PLACE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-wrapper">
          <label className="search-label">Min Rating</label>
          <div className="rating-slider-wrapper">
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating ?? 0}
              onChange={(e) => handleChange('minRating', parseFloat(e.target.value))}
              className="rating-slider"
            />
            <span className="rating-value">{filters.minRating ?? 0}</span>
          </div>
        </div>

        <div className="filter-field-wrapper">
          <label className="search-label">Open Now</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={!!filters.openNow}
              onChange={(e) => handleChange('openNow', e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-text">Only open</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
