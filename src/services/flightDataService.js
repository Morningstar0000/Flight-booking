// src/services/flightDataService.js
import axios from 'axios';

// Your Aviationstack API key
const AVIATIONSTACK_KEY = '4dd465c84eaadb74cbfa10cffbe2283d';

/**
 * Get real-time flights (FREE PLAN feature)
 * This works on the free plan - returns flights currently in the air or from today
 */
export const getRealTimeFlights = async (flightNumber) => {
  console.log(`Fetching real-time flights for: ${flightNumber}`);
  
  try {
    // DO NOT include flight_date parameter - that's a paid feature!
    const response = await axios.get(
      'https://api.aviationstack.com/v1/flights',
      { 
        params: { 
          access_key: AVIATIONSTACK_KEY,
          flight_iata: flightNumber,
          limit: 10
        } 
      }
    );
    
    console.log('Real-time flights response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getRealTimeFlights:', error.response?.data || error.message);
    return { data: [], error: error.response?.data };
  }
};

/**
 * Get flights by airport (FREE PLAN feature)
 */
export const getFlightsByAirport = async (airportCode, type = 'departure') => {
  console.log(`Fetching flights for airport: ${airportCode}, type: ${type}`);
  
  try {
    const params = {
      access_key: AVIATIONSTACK_KEY,
      limit: 10
    };
    
    if (type === 'departure') {
      params.dep_iata = airportCode;
    } else {
      params.arr_iata = airportCode;
    }
    
    const response = await axios.get(
      'https://api.aviationstack.com/v1/flights',
      { params }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error in getFlightsByAirport:', error.response?.data || error.message);
    return { data: [], error: error.response?.data };
  }
};

/**
 * Get flights by airline (FREE PLAN feature)
 */
export const getFlightsByAirline = async (airlineIata) => {
  console.log(`Fetching flights for airline: ${airlineIata}`);
  
  try {
    const response = await axios.get(
      'https://api.aviationstack.com/v1/flights',
      { 
        params: { 
          access_key: AVIATIONSTACK_KEY,
          airline_iata: airlineIata,
          limit: 10
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error in getFlightsByAirline:', error.response?.data || error.message);
    return { data: [], error: error.response?.data };
  }
};

/**
 * Search for airports (FREE PLAN feature)
 */
export const searchAirports = async (query) => {
  console.log(`Searching airports for: ${query}`);
  
  try {
    const response = await axios.get(
      'https://api.aviationstack.com/v1/airports',
      { 
        params: { 
          access_key: AVIATIONSTACK_KEY,
          search: query,
          limit: 10
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error in searchAirports:', error.response?.data || error.message);
    return { data: [], error: error.response?.data };
  }
};

/**
 * Search for airlines (FREE PLAN feature)
 */
export const searchAirlines = async (query) => {
  console.log(`Searching airlines for: ${query}`);
  
  try {
    const response = await axios.get(
      'https://api.aviationstack.com/v1/airlines',
      { 
        params: { 
          access_key: AVIATIONSTACK_KEY,
          search: query,
          limit: 10
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error in searchAirlines:', error.response?.data || error.message);
    return { data: [], error: error.response?.data };
  }
};

// Test function to verify API key is working
export const testApiKey = async () => {
  try {
    // Use a simple request WITHOUT date parameter
    const response = await axios.get(
      'https://api.aviationstack.com/v1/flights',
      { 
        params: { 
          access_key: AVIATIONSTACK_KEY,
          limit: 1 
        } 
      }
    );
    console.log('API Key test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Key test failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data };
  }
};

