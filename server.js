import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getMockPlaces, filterAndSortPlaces, calculateDistance } from './services/placeService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to format distance
function formatDistance(distance) {
  if (distance < 1) {
    return Math.round(distance * 1000) + ' m';
  } else {
    return distance.toFixed(1) + ' km';
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/places/recommendations', async (req, res) => {
  try {
    const { latitude, longitude, mood, radius = 5000, sortBy = 'distance', priceRange, openNow = true, savedPlaces = [], keyword = '', minRating = null, placeType = '' } = req.body || {};

    // Validate input
    if (!latitude || !longitude || !mood) {
      return res.status(400).json({
        places: [],
        totalResults: 0,
        message: 'Latitude, longitude, and mood are required'
      });
    }

    // Always use mock data for now (reliable and always works)
    // In production, you can add real API calls here
    let places = getMockPlaces();

    // Adjust mock places to be near user's location (within radius)
    // Shift mock places to be relative to user location
    const adjustedPlaces = places.map((place, index) => {
      // Create places at different distances from user location
      const angle = (index * 30) * Math.PI / 180; // Spread in a circle
      const distanceKm = (radius / 1000) * (0.3 + (index % 5) * 0.15); // Vary distance
      const latOffset = distanceKm * Math.cos(angle) / 111; // ~111 km per degree
      const lonOffset = distanceKm * Math.sin(angle) / (111 * Math.cos(latitude * Math.PI / 180));
      
      return {
        ...place,
        latitude: latitude + latOffset,
        longitude: longitude + lonOffset
      };
    });

    // Calculate distances for all places
    places = adjustedPlaces.map(place => {
      try {
        const distance = calculateDistance(latitude, longitude, place.latitude, place.longitude);
        return {
          ...place,
          distance: distance,
          distanceText: formatDistance(distance)
        };
      } catch (err) {
        return {
          ...place,
          distance: 999,
          distanceText: 'Unknown'
        };
      }
    });

    // Filter by radius - only show places within the specified radius
    places = places.filter(place => {
      const distanceInMeters = place.distance * 1000;
      return distanceInMeters <= radius;
    });
    
    // Sort by distance (closest first)
    places.sort((a, b) => (a.distance || 999) - (b.distance || 999));

    // Calculate match scores
    places = places.map(place => {
      let score = 0;
      if (place.rating) score += place.rating * 8;
      if (place.distance) score += Math.max(0, 30 - place.distance * 3);
      if (place.openNow) score += 15;
      
      return {
        ...place,
        mood,
        matchScore: Math.min(100, Math.round(score)),
        why: `Recommended because it is rated ${place.rating?.toFixed(1) || 'N/A'} ⭐, ${place.distanceText} away${place.openNow ? ', currently open' : ''}.`,
        personalizationBoost: 0,
        crowdPenalty: 0
      };
    });

    // Apply filters and sorting
    try {
      places = filterAndSortPlaces(places, { 
        sortBy, 
        priceRange, 
        openNow, 
        enablePersonalization: savedPlaces && savedPlaces.length > 0, 
        keyword, 
        minRating, 
        placeType 
      });
    } catch (err) {
      console.error('Error filtering places:', err);
      // If filtering fails, just sort by distance
      places = places.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // Limit results
    places = places.slice(0, 20);

    // Ensure we always have at least some places
    if (places.length === 0) {
      places = getMockPlaces().slice(0, 10).map(place => ({
        ...place,
        distance: calculateDistance(latitude, longitude, place.latitude, place.longitude),
        distanceText: formatDistance(calculateDistance(latitude, longitude, place.latitude, place.longitude)),
        mood,
        matchScore: 50,
        why: 'Sample place recommendation',
        personalizationBoost: 0,
        crowdPenalty: 0
      }));
    }

    res.json({
      places,
      totalResults: places.length,
      mood,
      message: 'Recommendations fetched successfully'
    });
  } catch (error) {
    console.error('Error:', error.message || error);
    console.error('Error stack:', error.stack);
    
    // Always return mock data on error
    try {
      const { latitude, longitude, mood, radius = 5000 } = req.body || {};
      
      if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
          isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          places: [],
          totalResults: 0,
          message: 'Invalid location coordinates'
        });
      }
      
      let places = getMockPlaces().slice(0, 10);
      
      places = places.map(place => {
        try {
          const distance = calculateDistance(latitude, longitude, place.latitude, place.longitude);
          return {
            ...place,
            distance: distance,
            distanceText: formatDistance(distance),
            mood: mood || 'work',
            matchScore: 50,
            why: 'Sample place recommendation',
            personalizationBoost: 0,
            crowdPenalty: 0
          };
        } catch (err) {
          return {
            ...place,
            distance: 999,
            distanceText: 'Unknown',
            mood: mood || 'work',
            matchScore: 50,
            why: 'Sample place recommendation',
            personalizationBoost: 0,
            crowdPenalty: 0
          };
        }
      });
      
      return res.status(200).json({
        places,
        totalResults: places.length,
        mood: mood || 'work',
        message: 'Using sample data'
      });
    } catch (fallbackErr) {
      console.error('Fallback error:', fallbackErr);
      return res.status(500).json({
        places: [],
        totalResults: 0,
        message: 'Unable to fetch recommendations. Please try again later.'
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
