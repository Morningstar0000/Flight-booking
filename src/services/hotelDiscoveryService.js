import axios from 'axios';

// Your RapidAPI credentials
const RAPIDAPI_KEY = 'e0542cf8cemsha7b0a89f93ad6a6p1ef8f0jsn28edfaea1e70'; // Use your key
const RAPIDAPI_HOST = 'hoteldiscoveryapi.p.rapidapi.com';

// Search hotels by destination
export const searchHotelsByLocation = async (location, checkIn, checkOut, adults = 2) => {
  try {
    // Extract city name without country
    const destination = location.split(',')[0].trim();
    
    const options = {
      method: 'GET',
      url: 'https://hoteldiscoveryapi.p.rapidapi.com/api/hotels/destination/search',
      params: {
        destination: destination,
        q: `${destination} Hotels`,
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults: adults.toString(),
        children: '0',
        currency: 'USD',
        gl: 'us',
        hl: 'en'
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    console.log('Searching hotels in:', destination);
    
    const response = await axios.request(options);
    
    // Transform the response to match your existing hotel structure
    if (response.data && response.data.properties) {
      return response.data.properties.map(hotel => {
        // Extract price from rate_per_night object
        let price = 0;
        if (hotel.rate_per_night) {
          // Try to get extracted_lowest first, then parse the string
          price = hotel.rate_per_night.extracted_lowest || 
                  parseFloat(hotel.rate_per_night.lowest?.replace('$', '')) || 
                  0;
        }
        
        // Extract images from the images array
        const images = hotel.images?.map(img => img.original_image || img.thumbnail) || [];
        
        return {
          hotel: {
            name: hotel.name,
            hotelId: hotel.place_id || hotel.name,
            rating: hotel.overall_rating || 0,
            description: hotel.description || '',
            latitude: hotel.gps_coordinates?.latitude,
            longitude: hotel.gps_coordinates?.longitude,
            address: {
              lines: hotel.address ? [hotel.address] : []
            },
            media: images.map(img => ({ uri: img })),
            amenities: hotel.amenities || [],
            checkIn: hotel.check_in_time,
            checkOut: hotel.check_out_time,
            hotelClass: hotel.extracted_hotel_class || hotel.hotel_class
          },
          offers: [{
            price: {
              total: price,
              currency: 'USD'
            },
            room: {
              typeEstimated: {
                category: 'Standard Room'
              }
            },
            guests: {
              adults: adults
            }
          }],
          reviews: hotel.reviews || 0,
          location_rating: hotel.location_rating
        };
      });
    }
    
    return [];
    
  } catch (error) {
    console.error('Error searching hotels:', error.response?.data || error.message);
    return [];
  }
};

// Get more details for a specific hotel
export const getHotelDetails = async (placeId) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://hoteldiscoveryapi.p.rapidapi.com/api/hotels/details',
      params: {
        place_id: placeId,
        language: 'en'
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error getting hotel details:', error);
    return null;
  }
};