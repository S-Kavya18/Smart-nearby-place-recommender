import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="filter-panel bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-200 mt-4 animate-slideDown">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="filter-group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
          <select
            value={filters.radius}
            onChange={(e) => handleChange('radius', parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm hover:shadow"
          >
            <option value={1000}>1 km</option>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={15000}>15 km</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm hover:shadow"
          >
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
            <option value="match">Best Match</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
          <select
            value={filters.priceRange || ''}
            onChange={(e) => handleChange('priceRange', e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm hover:shadow"
          >
            <option value="">Any Price</option>
            <option value="1">$ (Inexpensive)</option>
            <option value="2">$$ (Moderate)</option>
            <option value="3">$$$ (Expensive)</option>
            <option value="4">$$$$ (Very Expensive)</option>
          </select>
        </div>
      </div>

      <div className="filter-group checkbox-group mt-4 pt-4 border-t border-gray-200">
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.openNow}
            onChange={(e) => handleChange('openNow', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
          />
          <span className="text-gray-800 font-semibold">Only show places that are currently open</span>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
