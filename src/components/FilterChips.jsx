import React from 'react';
import './FilterChips.css';

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`filter-chip ${active ? 'filter-chip-active' : ''}`}
  >
    {children}
  </button>
);

const FilterChips = ({ filters, onFilterChange }) => {
  const setFilter = (key, value) => onFilterChange({ ...filters, [key]: value });
  const toggleOpenNow = () => setFilter('openNow', !filters.openNow);
  const setMinRating = (value) => setFilter('minRating', value);
  const setPriceRange = (value) => setFilter('priceRange', value);
  const setType = (value) => setFilter('placeType', value);
  const setSortBy = (value) => setFilter('sortBy', value);
  const setRadius = (value) => setFilter('radius', value);

  const ratingOptions = [0, 4.0, 4.5];
  const priceOptions = ["", "1", "2", "3", "4"]; // Any, $, $$, $$$, $$$$
  const typeOptions = ["", 'restaurant', 'cafe', 'bar', 'bakery', 'park', 'library'];
  const sortOptions = ['distance', 'rating', 'match'];
  const radiusOptions = [1000, 2000, 5000, 10000];

  return (
    <div className="filter-chips-container">
      <Chip active={!!filters.openNow} onClick={toggleOpenNow}>Open now</Chip>

      {ratingOptions.map((r) => (
        <Chip key={r} active={(filters.minRating ?? 0) === r} onClick={() => setMinRating(r)}>
          {r === 0 ? 'Any rating' : `${r}+ ⭐`}
        </Chip>
      ))}

      {priceOptions.map((p) => (
        <Chip key={p} active={(filters.priceRange || "") === p} onClick={() => setPriceRange(p)}>
          {p === "" ? 'Any price' : '$'.repeat(parseInt(p))}
        </Chip>
      ))}

      {typeOptions.map((t) => (
        <Chip key={t} active={(filters.placeType || "") === t} onClick={() => setType(t)}>
          {t === "" ? 'Any type' : t.replace(/_/g, ' ')}
        </Chip>
      ))}
      {/* Sort chips */}
      {sortOptions.map((s) => (
        <Chip key={s} active={(filters.sortBy || 'match') === s} onClick={() => setSortBy(s)}>
          {s === 'distance' ? 'Closest' : s === 'rating' ? 'Top rated' : 'Best match'}
        </Chip>
      ))}

      {/* Radius chips */}
      {radiusOptions.map((r) => (
        <Chip key={r} active={(filters.radius || 3000) === r} onClick={() => setRadius(r)}>
          {Math.round(r/1000)} km
        </Chip>
      ))}
    </div>
  );
};

export default FilterChips;
