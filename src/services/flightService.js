import { supabase } from './supabaseClient'

// Flight Service for database operations
export const flightService = {
  // Get all flights with optional filters
  async getFlights(filters = {}) {
    let query = supabase
      .from('flights')
      .select('*')
      .order('date', { ascending: true })
      .order('departure_time', { ascending: true });

    // Apply filters if provided
    if (filters.fromCode) {
      query = query.eq('from_code', filters.fromCode);
    }
    if (filters.toCode) {
      query = query.eq('to_code', filters.toCode);
    }
    if (filters.airline) {
      query = query.ilike('airline', `%${filters.airline}%`);
    }
    if (filters.flightNumber) {
      query = query.eq('flight_number', filters.flightNumber);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.date) {
      query = query.eq('date', filters.date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get flight by ID
  async getFlightById(id) {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get flights by flight number (returns multiple flights)
  async getFlightsByNumber(flightNumber) {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('flight_number', flightNumber)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create new flight
async createFlight(flightData) {
    // Remove any display fields that might have snuck in
    const { from_display, to_display, ...cleanData } = flightData;
    
    // Check if flight with same number and date already exists
    const { data: existing } = await supabase
        .from('flights')
        .select('id')
        .eq('flight_number', cleanData.flight_number)
        .eq('date', cleanData.date)
        .maybeSingle();

    if (existing) {
        throw new Error('A flight with this number already exists on this date');
    }

    const { data, error } = await supabase
        .from('flights')
        .insert([cleanData])
        .select();

    if (error) throw error;
    return data[0];
},

// Update flight
async updateFlight(id, flightData) {
    // Remove any display fields that might have snuck in
    const { from_display, to_display, ...cleanData } = flightData;
    
    const { data, error } = await supabase
        .from('flights')
        .update(cleanData)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
},

  // Update flight progress (for simulation)
  async updateFlightProgress(id, progress, currentLat, currentLng) {

    const isActive = progress > 0;
    const { data, error } = await supabase
      .from('flights')
      .update({ 
        current_progress: progress,
        current_lat: currentLat,
        current_lng: currentLng,
        simulation_active: isActive
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete flight
  async deleteFlight(id) {
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

// Get flights by route with optional filters
// In flightService.js
async getFlightsByRoute(fromCode, toCode, date = null) {
  let query = supabase
    .from('flights')
    .select('*')
    .eq('from_code', fromCode)
    .eq('to_code', toCode);

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Return ALL flights, no sorting or filtering
  return data;
},

  // Get flights by airport (departures or arrivals)
  async getFlightsByAirport(airportCode, type = 'departures', date = null) {
    let query = supabase
      .from('flights')
      .select('*');

    if (type === 'departures') {
      query = query.eq('from_code', airportCode);
    } else {
      query = query.eq('to_code', airportCode);
    }

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get unique airlines
  async getAirlines() {
    const { data, error } = await supabase
      .from('flights')
      .select('airline, airline_code')
      .order('airline');

    if (error) throw error;
    
    // Remove duplicates
    const uniqueAirlines = Array.from(
      new Map(data.map(item => [item.airline, item])).values()
    );
    return uniqueAirlines;
  },

  // Get unique routes
  async getRoutes() {
    const { data, error } = await supabase
      .from('flights')
      .select('from_code, from_city, from_country, to_code, to_city, to_country')
      .order('from_city');

    if (error) throw error;

    // Get unique routes
    const routes = [];
    const seen = new Set();
    
    data.forEach(item => {
      const key = `${item.from_code}-${item.to_code}`;
      if (!seen.has(key)) {
        seen.add(key);
        routes.push(item);
      }
    });

    return routes;
  },

  // Search flights
  async searchFlights(searchTerm) {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .or(`flight_number.ilike.%${searchTerm}%,airline.ilike.%${searchTerm}%,from_city.ilike.%${searchTerm}%,to_city.ilike.%${searchTerm}%,from_code.ilike.%${searchTerm}%,to_code.ilike.%${searchTerm}%`)
      .limit(20);

    if (error) throw error;
    return data;
  },

  // Bulk import flights
  async bulkImportFlights(flightsArray) {
    // Insert in batches to avoid overwhelming the API
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < flightsArray.length; i += batchSize) {
      const batch = flightsArray.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('flights')
          .insert(batch)
          .select();

        if (error) {
          console.error(`Error importing batch:`, error);
          errorCount += batch.length;
        } else {
          successCount += data.length;
        }
      } catch (error) {
        console.error(`Exception importing batch:`, error);
        errorCount += batch.length;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { successCount, errorCount };
  },

  // Generate a simple route path (straight line with intermediate points)
  generateRoutePath(fromLat, fromLng, toLat, toLng, points = 20) {
    const path = [];
    for (let i = 0; i <= points; i++) {
      const fraction = i / points;
      path.push({
        lat: fromLat + (toLat - fromLat) * fraction,
        lng: fromLng + (toLng - fromLng) * fraction,
        progress: Math.round(fraction * 100)
      });
    }
    return path;
  },

  // Calculate position at progress
  calculatePosition(fromLat, fromLng, toLat, toLng, progress) {
    const fraction = progress / 100;
    return {
      lat: fromLat + (toLat - fromLat) * fraction,
      lng: fromLng + (toLng - fromLng) * fraction,
      progress: progress
    };
  },

  // Subscribe to real-time updates for a specific flight
  subscribeToFlightUpdates(flightId, callback) {
    return supabase
      .channel(`flight-${flightId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'flights',
          filter: `id=eq.${flightId}`
        },
        (payload) => {
          console.log('Flight updated in real-time:', payload);
          callback(payload.new);
        }
      )
      .subscribe();
  }
};