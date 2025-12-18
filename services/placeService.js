// Mock places data - always available as fallback
const mockPlaces = [
  {
    placeId: '1',
    name: 'Chrome Brew Co',
    address: '123 Tech Street, Downtown',
    latitude: 37.7749,
    longitude: -122.4194,
    rating: 4.7,
    userRatingsTotal: 320,
    openNow: true,
    priceLevel: '$$',
    types: ['cafe', 'coffee'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Chrome+Brew+Co'
  },
  {
    placeId: '2',
    name: 'Silicon Valley Coffee Lab',
    address: '456 Innovation Ave, Tech Hub',
    latitude: 37.7758,
    longitude: -122.4128,
    rating: 4.5,
    userRatingsTotal: 450,
    openNow: true,
    priceLevel: '$$',
    types: ['cafe', 'restaurant'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Silicon+Valley+Coffee'
  },
  {
    placeId: '3',
    name: 'Cloud Nine Co-working',
    address: '789 Business Blvd, Corporate Park',
    latitude: 37.7699,
    longitude: -122.4162,
    rating: 4.8,
    userRatingsTotal: 280,
    openNow: true,
    priceLevel: '$$$',
    types: ['library', 'cafe'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Cloud+Nine'
  },
  {
    placeId: '4',
    name: 'Romantic Italian Trattoria',
    address: '321 Love Lane, Historic District',
    latitude: 37.7749,
    longitude: -122.4150,
    rating: 4.9,
    userRatingsTotal: 600,
    openNow: true,
    priceLevel: '$$$',
    types: ['restaurant', 'italian'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Italian+Restaurant'
  },
  {
    placeId: '5',
    name: 'Moonlight Bar & Lounge',
    address: '654 Sunset Blvd, Entertainment District',
    latitude: 37.7840,
    longitude: -122.4180,
    rating: 4.6,
    userRatingsTotal: 520,
    openNow: true,
    priceLevel: '$$$',
    types: ['bar', 'restaurant'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Moonlight+Lounge'
  },
  {
    placeId: '6',
    name: 'Art Gallery Cafe',
    address: '987 Culture Street, Arts District',
    latitude: 37.7730,
    longitude: -122.4200,
    rating: 4.4,
    userRatingsTotal: 380,
    openNow: true,
    priceLevel: '$$',
    types: ['cafe', 'art_gallery'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Art+Gallery'
  },
  {
    placeId: '7',
    name: 'Quick Bite Burgers',
    address: '111 Fast Food Court, Main Street',
    latitude: 37.7769,
    longitude: -122.4140,
    rating: 4.3,
    userRatingsTotal: 890,
    openNow: true,
    priceLevel: '$',
    types: ['fast_food', 'burger'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Quick+Bite'
  },
  {
    placeId: '8',
    name: 'Speedy Tacos',
    address: '222 Quick Eats Lane, Downtown',
    latitude: 37.7750,
    longitude: -122.4120,
    rating: 4.5,
    userRatingsTotal: 720,
    openNow: true,
    priceLevel: '$',
    types: ['fast_food', 'mexican'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Speedy+Tacos'
  },
  {
    placeId: '9',
    name: 'Fresh Pita House',
    address: '333 Sandwiches St, Market District',
    latitude: 37.7760,
    longitude: -122.4110,
    rating: 4.6,
    userRatingsTotal: 650,
    openNow: true,
    priceLevel: '$',
    types: ['fast_food', 'sandwich'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Fresh+Pita'
  },
  {
    placeId: '10',
    name: 'Budget Bowl Restaurant',
    address: '444 Cheap Eats Ave, Downtown',
    latitude: 37.7748,
    longitude: -122.4135,
    rating: 4.2,
    userRatingsTotal: 580,
    openNow: true,
    priceLevel: '$',
    types: ['restaurant', 'budget'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Budget+Bowl'
  },
  {
    placeId: '11',
    name: 'Street Food Court',
    address: '555 Affordable Lane, East Bay',
    latitude: 37.7755,
    longitude: -122.4125,
    rating: 4.4,
    userRatingsTotal: 420,
    openNow: true,
    priceLevel: '$',
    types: ['food_court', 'budget'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Street+Food'
  },
  {
    placeId: '12',
    name: 'Value Bakery Cafe',
    address: '666 Savings Street, Midtown',
    latitude: 37.7740,
    longitude: -122.4145,
    rating: 4.3,
    userRatingsTotal: 340,
    openNow: true,
    priceLevel: '$',
    types: ['bakery', 'cafe'],
    photoUrl: 'https://via.placeholder.com/400x300?text=Value+Bakery'
  }
];

export function getMockPlaces() {
  return JSON.parse(JSON.stringify(mockPlaces));
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS = 6371; // Radius in kilometers
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS * c;
}

function priceScore(place) {
  const len = place.priceLevel ? place.priceLevel.length : 0;
  if (len === 0) return 0.5;
  return Math.max(0, 1.2 - 0.3 * len);
}

function distanceScore(km) {
  if (km == null) return 0.5;
  const capped = Math.min(km, 10);
  return Math.max(0, 1 - capped / 10);
}

export function filterAndSortPlaces(places, filters) {
  let filtered = [...places];

  // Keyword search
  if (filters.keyword && typeof filters.keyword === 'string') {
    const q = filters.keyword.trim().toLowerCase();
    if (q.length > 0) {
      filtered = filtered.filter(place => {
        const name = (place.name || '').toLowerCase();
        const address = (place.address || '').toLowerCase();
        return name.includes(q) || address.includes(q);
      });
    }
  }

  // Filter by minimum rating
  if (filters.minRating != null) {
    const minR = Number(filters.minRating) || 0;
    filtered = filtered.filter(place => (place.rating || 0) >= minR);
  }

  // Filter by place type
  if (filters.placeType && typeof filters.placeType === 'string') {
    const pt = filters.placeType.trim().toLowerCase();
    if (pt.length > 0) {
      filtered = filtered.filter(place => {
        const types = Array.isArray(place.types) ? place.types : [];
        return types.some(t => (t || '').toLowerCase().includes(pt));
      });
    }
  }

  // Filter by price range
  if (filters.priceRange) {
    const maxPrice = parseInt(filters.priceRange);
    filtered = filtered.filter(place => {
      const priceLen = place.priceLevel ? place.priceLevel.length : 0;
      return priceLen <= maxPrice;
    });
  }

  // Filter by open now
  if (filters.openNow) {
    filtered = filtered.filter(place => place.openNow !== false);
  }

  // Calculate scores
  filtered = filtered.map(p => {
    const ratingComponent = (p.rating || 0) / 5;
    const distComponent = distanceScore(p.distance);
    const openComponent = p.openNow ? 1 : 0;
    const priceComponent = priceScore(p);

    let score = (ratingComponent * 0.4) + (distComponent * 0.3) + (openComponent * 0.2) + (priceComponent * 0.1);
    score = score * 100;

    if (filters.enablePersonalization && p.personalizationBoost) {
      score += p.personalizationBoost;
    }

    if (p.crowdPenalty) {
      score += p.crowdPenalty;
    }

    return { ...p, score: Math.max(0, Math.round(score)) };
  });

  // Sort
  switch (filters.sortBy) {
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'match':
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
      break;
    case 'distance':
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    default:
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
      break;
  }

  return filtered;
}
