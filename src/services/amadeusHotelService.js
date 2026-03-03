import axios from 'axios';
import { getAccessToken } from './amadeusService'; // Reuse your auth function

// Search hotels by city code
export const searchHotelsByCity = async (cityCode, radius = 10) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
      {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          cityCode: cityCode,
          radius: radius,
          radiusUnit: 'KM',
          hotelSource: 'ALL'
        }
      }
    );
    
    return response.data.data.map(hotel => ({
      hotelId: hotel.hotelId,
      name: hotel.name,
      address: hotel.address,
      latitude: hotel.geoCode?.latitude,
      longitude: hotel.geoCode?.longitude,
      distance: hotel.distance,
      chainCode: hotel.chainCode
    }));
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};

// Search hotels by geolocation
export const searchHotelsByGeocode = async (latitude, longitude, radius = 5) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode',
      {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          latitude: latitude,
          longitude: longitude,
          radius: radius,
          radiusUnit: 'KM'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error searching hotels by geocode:', error);
    return [];
  }
};

// Get hotel offers (prices and availability)
export const getHotelOffers = async (hotelIds, checkInDate, checkOutDate, adults = 2) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v3/shopping/hotel-offers',
      {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          hotelIds: hotelIds.join(','),
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          adults: adults,
          bestRateOnly: true
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting hotel offers:', error);
    return [];
  }
};

// Autocomplete hotel names
export const autocompleteHotels = async (keyword) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations/hotel',
      {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          keyword: keyword,
          subType: 'HOTEL_LEISURE',
          countryCode: 'US' // Optional
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error autocompleting hotels:', error);
    return [];
  }
};