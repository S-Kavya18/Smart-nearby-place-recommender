import React from 'react';
import { MapPin, Star, DollarSign, Navigation, Phone, Heart, Share2 } from 'lucide-react';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}&query_place_id=${place.placeId}`;
    window.open(url, '_blank');
  };

  const callPlace = () => {
    if (place.phoneNumber) {
      window.open(`tel:${place.phoneNumber}`);
    } else {
      alert('Phone number not available.');
    }
  };

  const savePlace = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
      if (!saved.find(p => p.placeId === place.placeId)) {
        saved.push({ placeId: place.placeId, name: place.name, types: place.types });
        localStorage.setItem('savedPlaces', JSON.stringify(saved));
        try { window.dispatchEvent(new CustomEvent('savedPlacesUpdated')); } catch {}
      }
      alert('Saved! We’ll prioritize similar places next time.');
    } catch {}
  };

  const sharePlace = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}&query_place_id=${place.placeId}`;
    if (navigator.share) {
      navigator.share({ title: place.name, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  return (
    <div className="place-card bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {place.photoUrl && (
        <div className="place-image-wrapper relative">
          <img
            src={place.photoUrl}
            alt={place.name}
            className="place-image w-full h-48 md:h-56 object-cover"
            loading="lazy"
          />
          {place.matchScore && (
            <div className="match-badge absolute top-3 left-3 bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
              {place.matchScore}% Match
            </div>
          )}
        </div>
      )}
      
      <div className="place-content p-4">
        <div className="place-header flex items-center justify-between gap-2">
          <h3 className="place-name text-lg font-bold text-gray-900">{place.name}</h3>
          {place.openNow !== null && (
            <span className={`open-badge ${place.openNow ? 'open' : 'closed'} inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${place.openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {place.openNow ? 'Open' : 'Closed'}
            </span>
          )}
        </div>

        <div className="place-info mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700">
          <div className="info-item inline-flex items-center gap-1">
            <MapPin size={16} />
            <span>{place.distanceText}</span>
          </div>
          
          {place.rating && (
            <div className="info-item inline-flex items-center gap-1">
              <Star size={16} />
              <span>
                {place.rating.toFixed(1)} ({place.userRatingsTotal || 0})
              </span>
            </div>
          )}
          
          {place.priceLevel && (
            <div className="info-item inline-flex items-center gap-1">
              <DollarSign size={16} />
              <span>{place.priceLevel}</span>
            </div>
          )}
        </div>

        <p className="place-address mt-2 text-gray-600">{place.address}</p>

        {place.why && (
          <p className="place-why mt-2 text-gray-700">{place.why}</p>
        )}

        {place.types && place.types.length > 0 && (
          <div className="place-tags mt-3 flex flex-wrap gap-2">
            {place.types.slice(0, 3).map((type, index) => (
              <span key={index} className="tag inline-block px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        <div className="actions-row mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <button className="action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow hover:shadow-lg transition" onClick={openGoogleMaps}>
            <Navigation size={18} />
            Navigate
          </button>
          <button className="action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow hover:shadow-lg transition" onClick={callPlace}>
            <Phone size={18} />
            Call
          </button>
          <button className="action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow hover:shadow-lg transition" onClick={savePlace}>
            <Heart size={18} />
            Save
          </button>
          <button className="action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white font-semibold shadow hover:shadow-lg transition" onClick={sharePlace}>
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
