import React, { useEffect, useState } from 'react';

const SavedPlaces = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
      setSaved(Array.isArray(items) ? items : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const removePlace = (placeId) => {
    const next = saved.filter(p => p.placeId !== placeId);
    setSaved(next);
    localStorage.setItem('savedPlaces', JSON.stringify(next));
    try { window.dispatchEvent(new CustomEvent('savedPlacesUpdated')); } catch {}
  };

  const clearAll = () => {
    setSaved([]);
    localStorage.setItem('savedPlaces', JSON.stringify([]));
    try { window.dispatchEvent(new CustomEvent('savedPlacesUpdated')); } catch {}
  };

  if (!saved.length) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow-md border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Saved places</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-3">We use your saved places to personalize recommendations.</p>
      <ul className="space-y-2">
        {saved.map((p) => (
          <li key={p.placeId} className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{p.name}</div>
              {Array.isArray(p.types) && p.types.length > 0 && (
                <div className="text-xs text-gray-600">{p.types.slice(0,3).join(', ')}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removePlace(p.placeId)}
              className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPlaces;
