import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Custom icons for user and places
const userIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const placeIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FitBounds = ({ places, userLocation }) => {
  const map = useMap();

  React.useEffect(() => {
    const bounds = L.latLngBounds([]);
    places.forEach(p => bounds.extend([p.latitude, p.longitude]));
    if (userLocation) bounds.extend([userLocation.latitude, userLocation.longitude]);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places, userLocation, map]);

  return null;
};

const MapView = ({ places, userLocation }) => {
  const defaultCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [37.7749, -122.4194];

  return (
    <div className="map-container rounded-xl overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds places={places} userLocation={userLocation} />

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {places.map((place, idx) => (
          <Marker
            key={place.placeId || idx}
            position={[place.latitude, place.longitude]}
            icon={placeIcon}
          >
            <Popup>
              <div className="map-info-window">
                <h3>{place.name}</h3>
                {place.distanceText && <p><strong>Distance:</strong> {place.distanceText}</p>}
                {place.rating ? <p><strong>Rating:</strong> {place.rating} ⭐</p> : <p><strong>Rating:</strong> N/A</p>}
                {place.priceLevel && <p><strong>Price:</strong> {place.priceLevel}</p>}
                {place.openNow !== null && <p><strong>Status:</strong> {place.openNow ? 'Open' : 'Closed'}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
