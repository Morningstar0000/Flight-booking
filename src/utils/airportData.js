// src/utils/airportData.js
import { flightRoutes } from '../services/flightResultsData';

// Extract unique airports from flight data
export const getAllAirports = () => {
  const airportMap = new Map();
  
  flightRoutes.forEach(flight => {
    // Add departure airport
    if (!airportMap.has(flight.from.code)) {
      airportMap.set(flight.from.code, {
        code: flight.from.code,
        name: flight.from.airport,
        city: flight.from.city,
        country: flight.from.country,
        countryCode: flight.from.countryCode,
        // Approximate coordinates (you can replace with real coordinates)
        lat: getApproximateLat(flight.from.country, flight.from.city),
        lng: getApproximateLng(flight.from.country, flight.from.city)
      });
    }
    
    // Add arrival airport
    if (!airportMap.has(flight.to.code)) {
      airportMap.set(flight.to.code, {
        code: flight.to.code,
        name: flight.to.airport,
        city: flight.to.city,
        country: flight.to.country,
        countryCode: flight.to.countryCode,
        lat: getApproximateLat(flight.to.country, flight.to.city),
        lng: getApproximateLng(flight.to.country, flight.to.city)
      });
    }
  });
  
  return Array.from(airportMap.values());
};

// Helper function to get approximate coordinates (you can replace with real data)
const getApproximateLat = (country, city) => {
  const coords = {
    'USA': { 'New York': 40.7128, 'Los Angeles': 34.0522, 'Chicago': 41.8781, 'San Francisco': 37.7749, 'Seattle': 47.6062, 'Honolulu': 21.3069, 'Anchorage': 61.2181, 'Las Vegas': 36.1699, 'Miami': 25.7617, 'Boston': 42.3601, 'Atlanta': 33.7490, 'Dallas': 32.7767, 'Houston': 29.7604, 'Philadelphia': 39.9526, 'Phoenix': 33.4484, 'Denver': 39.7392, 'Detroit': 42.3314, 'Minneapolis': 44.9778, 'Fort Lauderdale': 26.1224, 'Charlotte': 35.2271, 'Newark': 40.7357 },
    'UK': { 'London': 51.5074, 'Manchester': 53.4808, 'Birmingham': 52.4862, 'Glasgow': 55.8642, 'Edinburgh': 55.9533 },
    'France': { 'Paris': 48.8566, 'Nice': 43.7102 },
    'Germany': { 'Frankfurt': 50.1109, 'Munich': 48.1351, 'Berlin': 52.5200 },
    'Japan': { 'Tokyo': 35.6762, 'Osaka': 34.6937, 'Sapporo': 43.0618, 'Fukuoka': 33.5904 },
    'South Korea': { 'Seoul': 37.5665, 'Jeju': 33.4996 },
    'China': { 'Beijing': 39.9042, 'Shanghai': 31.2304, 'Hong Kong': 22.3193 },
    'India': { 'New Delhi': 28.6139, 'Mumbai': 19.0760 },
    'Australia': { 'Sydney': -33.8688, 'Melbourne': -37.8136, 'Brisbane': -27.4698, 'Perth': -31.9505 },
    'UAE': { 'Dubai': 25.2048, 'Abu Dhabi': 24.4539 },
    'Qatar': { 'Doha': 25.2854 },
    'Egypt': { 'Cairo': 30.0444 },
    'Saudi Arabia': { 'Jeddah': 21.2854, 'Riyadh': 24.7136 },
    'Kenya': { 'Nairobi': -1.2921 },
    'South Africa': { 'Johannesburg': -26.2041, 'Cape Town': -33.9249 },
    'Thailand': { 'Bangkok': 13.7563, 'Phuket': 7.8804 },
    'Vietnam': { 'Ho Chi Minh City': 10.8231, 'Hanoi': 21.0285 },
    'Singapore': { 'Singapore': 1.3521 },
    'Ireland': { 'Dublin': 53.3498 },
    'Netherlands': { 'Amsterdam': 52.3676 },
    'Spain': { 'Barcelona': 41.3851, 'Madrid': 40.4168, 'Palma': 39.5696 },
    'Italy': { 'Rome': 41.9028, 'Milan': 45.4642 },
    'Canada': { 'Toronto': 43.6532, 'Vancouver': 49.2827, 'Montreal': 45.5017, 'Calgary': 51.0447 },
    'Brazil': { 'Sao Paulo': -23.5505, 'Rio de Janeiro': -22.9068 },
    'Mexico': { 'Mexico City': 19.4326, 'Cancun': 21.1619 }
  };
  
  return coords[country]?.[city] || coords[country]?.[Object.keys(coords[country] || {})[0]] || 0;
};

const getApproximateLng = (country, city) => {
  const coords = {
    'USA': { 'New York': -74.0060, 'Los Angeles': -118.2437, 'Chicago': -87.6298, 'San Francisco': -122.4194, 'Seattle': -122.3321, 'Honolulu': -157.8583, 'Anchorage': -149.9003, 'Las Vegas': -115.1398, 'Miami': -80.1918, 'Boston': -71.0589, 'Atlanta': -84.3880, 'Dallas': -96.7970, 'Houston': -95.3698, 'Philadelphia': -75.1652, 'Phoenix': -112.0740, 'Denver': -104.9903, 'Detroit': -83.0458, 'Minneapolis': -93.2650, 'Fort Lauderdale': -80.1373, 'Charlotte': -80.8431, 'Newark': -74.1724 },
    'UK': { 'London': -0.1278, 'Manchester': -2.2426, 'Birmingham': -1.8904, 'Glasgow': -4.2518, 'Edinburgh': -3.1883 },
    'France': { 'Paris': 2.3522, 'Nice': 7.2619 },
    'Germany': { 'Frankfurt': 8.6821, 'Munich': 11.5820, 'Berlin': 13.4050 },
    'Japan': { 'Tokyo': 139.6503, 'Osaka': 135.5023, 'Sapporo': 141.3545, 'Fukuoka': 130.4017 },
    'South Korea': { 'Seoul': 126.9780, 'Jeju': 126.5312 },
    'China': { 'Beijing': 116.4074, 'Shanghai': 121.4737, 'Hong Kong': 114.1694 },
    'India': { 'New Delhi': 77.2090, 'Mumbai': 72.8777 },
    'Australia': { 'Sydney': 151.2093, 'Melbourne': 144.9631, 'Brisbane': 153.0251, 'Perth': 115.8605 },
    'UAE': { 'Dubai': 55.2708, 'Abu Dhabi': 54.3773 },
    'Qatar': { 'Doha': 51.5310 },
    'Egypt': { 'Cairo': 31.2357 },
    'Saudi Arabia': { 'Jeddah': 39.1925, 'Riyadh': 46.6753 },
    'Kenya': { 'Nairobi': 36.8172 },
    'South Africa': { 'Johannesburg': 28.0473, 'Cape Town': 18.4241 },
    'Thailand': { 'Bangkok': 100.5018, 'Phuket': 98.3923 },
    'Vietnam': { 'Ho Chi Minh City': 106.6297, 'Hanoi': 105.8342 },
    'Singapore': { 'Singapore': 103.8198 },
    'Ireland': { 'Dublin': -6.2603 },
    'Netherlands': { 'Amsterdam': 4.9041 },
    'Spain': { 'Barcelona': 2.1734, 'Madrid': -3.7038, 'Palma': 2.6502 },
    'Italy': { 'Rome': 12.4964, 'Milan': 9.1900 },
    'Canada': { 'Toronto': -79.3832, 'Vancouver': -123.1207, 'Montreal': -73.5673, 'Calgary': -114.0719 },
    'Brazil': { 'Sao Paulo': -46.6333, 'Rio de Janeiro': -43.1729 },
    'Mexico': { 'Mexico City': -99.1332, 'Cancun': -86.8515 }
  };
  
  return coords[country]?.[city] || coords[country]?.[Object.keys(coords[country] || {})[0]] || 0;
};

// Get all unique airports
export const allAirports = getAllAirports();

// Get flights with approximate positions (midpoint of route for demo)
export const getFlightsWithPositions = () => {
  return flightRoutes.map(flight => {
    // Find airport coordinates
    const fromAirport = allAirports.find(a => a.code === flight.from.code);
    const toAirport = allAirports.find(a => a.code === flight.to.code);
    
    if (!fromAirport || !toAirport) return null;
    
    // Calculate midpoint for flight position (simulated)
    const midLat = (fromAirport.lat + toAirport.lat) / 2;
    const midLng = (fromAirport.lng + toAirport.lng) / 2;
    
    return {
      ...flight,
      lat: midLat,
      lng: midLng,
      altitude: Math.floor(Math.random() * 10000) + 30000, // Simulated altitude
      speed: Math.floor(Math.random() * 100) + 450, // Simulated speed
      heading: Math.floor(Math.random() * 360), // Simulated heading
      status: ['en-route', 'cruising', 'approaching'][Math.floor(Math.random() * 3)]
    };
  }).filter(Boolean);
};