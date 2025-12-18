import React, { useState, useEffect, useRef } from 'react';
import MoodSelector from './components/MoodSelector';
import PlaceCard from './components/PlaceCard';
import PlaceCardSkeleton from './components/PlaceCardSkeleton';
import FilterPanel from './components/FilterPanel';
import MapView from './components/MapView';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import { getPlaceRecommendations } from './services/api';
import { MapPin, Layers, List } from 'lucide-react';
import './App.css';
import FilterChips from './components/FilterChips';
import SavedPlaces from './components/SavedPlaces';
import Toast from './components/Toast';

function App() {
  const [selectedMood, setSelectedMood] = useState('work');
  const [scrolled, setScrolled] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const defaultFilters = {
    radius: 3000,
    sortBy: 'distance',
    priceRange: null,
    openNow: true,
    keyword: '',
    minRating: 0,
    placeType: '',
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [savedCount, setSavedCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          let errorMsg = 'Please enable location access to see recommendations.';
          if (error.code === 1) {
            errorMsg = 'Location permission denied. Please allow location access and refresh the page.';
          } else if (error.code === 2) {
            errorMsg = 'Location unavailable. Please check your device settings.';
          } else if (error.code === 3) {
            errorMsg = 'Location request timed out. Please try again.';
          }
          setError(errorMsg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const readSaved = () => {
      try {
        const items = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        setSavedCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setSavedCount(0);
      }
    };
    readSaved();
    const handler = () => readSaved();
    window.addEventListener('savedPlacesUpdated', handler);
    return () => window.removeEventListener('savedPlacesUpdated', handler);
  }, []);

  const fetchPlaces = async () => {
    if (!userLocation || !selectedMood) return;

    setLoading(true);
    setError(null);

    try {
      const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces') || '[]');

      const requestData = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        mood: selectedMood,
        ...filters,
        savedPlaces,
      };

      console.log('Requesting recommendations with:', requestData);
      const response = await getPlaceRecommendations(requestData);
      console.log('Got response:', response);
      setPlaces(response.places || []);
      
      if (response.message && (response.message.includes('sample data') || response.message.includes('Fallback'))) {
        setFallbackMessage(response.message);
        setError(null);
      } else {
        setFallbackMessage(null);
      }
    } catch (err) {
      console.error('Full error:', err);
      let errorMsg = 'Unable to fetch recommendations at the moment.';
      
      if (err.response) {
        if (err.response.status === 500) {
          if (err.response.data?.places && err.response.data.places.length > 0) {
            setPlaces(err.response.data.places);
            setFallbackMessage('Using sample data - external services unavailable');
            setError(null);
          } else {
            errorMsg = 'Server error. Please try again later.';
          }
        } else if (err.response.status === 400) {
          errorMsg = err.response.data?.message || 'Invalid request. Please check your filters.';
        } else {
          errorMsg = err.response.data?.message || 'Unable to fetch recommendations.';
        }
      } else if (err.request) {
        errorMsg = 'Cannot connect to server. Make sure the server is running on port 5000.';
      } else {
        errorMsg = err.message || 'An unexpected error occurred.';
      }
      
      if (!err.response?.data?.places || err.response.data.places.length === 0) {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLocation || !selectedMood) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPlaces();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, selectedMood, filters]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setError(null);
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let msg = 'Unable to get your location.';
        if (error.code === 1) {
          msg = 'Location permission denied. Please allow location access in your browser settings and try again.';
        } else if (error.code === 2) {
          msg = 'Position unavailable. Please check your device location settings.';
        } else if (error.code === 3) {
          msg = 'Location request timed out. Please try again.';
        }
        setError(msg);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const showToast = (msg) => {
    setToast({ message: msg });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="app">
      <Toast message={toast?.message} visible={!!toast} />
      {loading && <div className="loading-bar"></div>}
      
      {/* Compact Header */}
      <header className={`app-header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-title">
            <MapPin className="header-icon" size={28} />
            <div>
              <h1>Smart Place Recommender</h1>
              <p className="header-subtitle">Discover the perfect place for your mood</p>
            </div>
          </div>
          {savedCount > 0 && (
            <div className="header-badge">
              <span>{savedCount} saved</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          {/* Left Sidebar - Filters */}
          <aside className="sidebar">
            {!userLocation && (
              <div className="location-card">
                <MapPin size={24} />
                <div>
                  <h3>Location Required</h3>
                  <p>Allow location access to find places near you</p>
                  {error && (
                    <button 
                      onClick={requestLocation}
                      className="location-btn"
                    >
                      Request Location
                    </button>
                  )}
                </div>
              </div>
            )}

            {userLocation && (
              <>
                <div className="sidebar-section">
                  <h2 className="sidebar-title">What's your vibe?</h2>
                  <MoodSelector
                    selectedMood={selectedMood}
                    onMoodSelect={handleMoodSelect}
                    disabled={false}
                  />
                </div>

                <div className="sidebar-section">
                  <div className="section-header">
                    <h2 className="sidebar-title">Search & Filters</h2>
                    <button
                      className="toggle-filters-btn"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Layers size={18} />
                      {showFilters ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <SearchBar filters={filters} onFilterChange={handleFilterChange} />
                  
                  {showFilters && (
                    <FilterPanel
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  )}
                  
                  <div className="filter-chips-wrapper">
                    <FilterChips filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </div>

                <div className="sidebar-section">
                  <div className="view-controls">
                    <button
                      className={`view-control-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={18} />
                      List View
                    </button>
                    <button
                      className={`view-control-btn ${viewMode === 'map' ? 'active' : ''}`}
                      onClick={() => setViewMode('map')}
                    >
                      <MapPin size={18} />
                      Map View
                    </button>
                  </div>
                </div>

                {fallbackMessage && (
                  <div className="info-banner">
                    <p>{fallbackMessage}</p>
                  </div>
                )}
              </>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="content-area">
            {userLocation && selectedMood && (
              <>
                {/* Results Header */}
                <div className="results-header-bar">
                  <div className="results-info">
                    {!loading && (
                      <span className="results-count">
                        <svg className="results-count-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {places.length} {places.length === 1 ? 'place' : 'places'} found
                      </span>
                    )}
                    {loading && <div className="loading-indicator">Loading places...</div>}
                  </div>
                  <div className="results-actions">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="action-button-secondary"
                    >
                      <svg className="action-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          const items = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
                          const freq = {};
                          items.forEach(p => (p.types || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
                          const topType = Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || '';
                          setFilters({ ...filters, placeType: topType, sortBy: 'match' });
                          showToast(topType ? `Showing similar to: ${topType.replace(/_/g, ' ')}` : 'No saved types found');
                        } catch {}
                      }}
                      className="action-button-primary"
                    >
                      <svg className="action-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Suggest Similar
                    </button>
                  </div>
                </div>

                {/* Saved Places */}
                <div className="saved-places-section">
                  <SavedPlaces />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <div className="error-content">
                      <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        {!userLocation && (
                          <button 
                            onClick={requestLocation}
                            className="retry-button"
                          >
                            Enable Location & Retry
                          </button>
                        )}
                        {userLocation && (
                          <button 
                            onClick={fetchPlaces}
                            className="retry-button"
                          >
                            Try Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="results-section">
                    <div className="places-grid">
                      {[...Array(6)].map((_, i) => (
                        <PlaceCardSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Results */}
                {!loading && places.length > 0 && (
                  <div className="results-section">
                    {viewMode === 'list' ? (
                      <div key={viewMode} className="places-grid view-switch">
                        {places.map((place) => (
                          <PlaceCard key={place.placeId} place={place} />
                        ))}
                      </div>
                    ) : (
                      <div key={viewMode} className="map-container view-switch">
                        <MapView places={places} userLocation={userLocation} />
                      </div>
                    )}
                  </div>
                )}

                {/* No Results */}
                {!loading && selectedMood && places.length === 0 && !error && (
                  <div className="no-results">
                    <svg className="no-results-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3>No places found</h3>
                    <p>We couldn't find any places matching your current filters. Try:</p>
                    <ul className="no-results-suggestions">
                      <li>Expanding your search radius</li>
                      <li>Removing some filters</li>
                      <li>Checking a different mood</li>
                    </ul>
                    <button 
                      onClick={resetFilters}
                      className="reset-filters-btn"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
