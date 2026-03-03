import { searchLocations as amadeusSearch } from './amadeusService';
import { searchLocalAirports } from './airports';

export const searchLocationsHybrid = async (keyword) => {
  if (!keyword || keyword.length < 2) return [];
  
  console.log('🔍 Hybrid search started for:', keyword);
  
  try {
    // Try Amadeus first
    console.log('🌐 Searching Amadeus for:', keyword);
    const amadeusResults = await amadeusSearch(keyword);
    console.log('🌐 Amadeus results:', amadeusResults.length);
    
    // Also search local database
    console.log('💾 Searching local database for:', keyword);
    const localResults = searchLocalAirports(keyword);
    console.log('💾 Local results:', localResults.length);
    
    // Format local results to match Amadeus format
    const formattedLocal = localResults.map(airport => ({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      type: 'AIRPORT',
      displayName: `${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`
    }));
    
    // Combine results, removing duplicates by IATA code
    const combined = [...amadeusResults];
    const codes = new Set(amadeusResults.map(r => r.code));
    
    formattedLocal.forEach(local => {
      if (!codes.has(local.code)) {
        combined.push(local);
        codes.add(local.code);
      }
    });
    
    console.log(`📊 Combined results: ${combined.length} total (${amadeusResults.length} from Amadeus, ${formattedLocal.length} from local)`);
    
    // Log the actual results for debugging
    combined.slice(0, 5).forEach(item => {
      console.log(`  - ${item.name} (${item.code}) [${item.type}]`);
    });
    
    return combined.slice(0, 15); // Limit to 15 results
    
  } catch (error) {
    console.error('❌ Hybrid search error, falling back to local:', error);
    // Fallback to local database
    const localResults = searchLocalAirports(keyword);
    console.log('💾 Fallback local results:', localResults.length);
    
    return localResults.map(airport => ({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      type: 'AIRPORT',
      displayName: `${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`
    }));
  }
};