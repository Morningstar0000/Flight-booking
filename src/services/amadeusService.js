import axios from 'axios';

// Replace with your actual credentials from Amadeus Dashboard
const CLIENT_ID = 'Mq3d6LGYHhx4PDHAnTGtA2pXZwVXCybE';
const CLIENT_SECRET = 'AXYbHG0sr8Gwh57r';

let accessToken = null;
let tokenExpiry = null;

// Add 'export' here to make it available to other files
export const getAccessToken = async () => {
  if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
    console.log('Using cached token');
    return accessToken;
  }

  try {
    console.log('Requesting new access token...');
    
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('Token received successfully');
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    
    return accessToken;
  } catch (error) {
    console.error('Token Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// Search locations with detailed logging
export const searchLocations = async (keyword) => {
  if (!keyword || keyword.length < 2) {
    console.log('Keyword too short:', keyword);
    return [];
  }
  
  try {
    console.log('Searching for:', keyword);
    const token = await getAccessToken();
    
    console.log('Making API request with token:', token.substring(0, 20) + '...');
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          keyword: keyword,
          subType: 'AIRPORT,CITY',
          'page[limit]': 10,
          'view': 'LIGHT'
        }
      }
    );
    
    console.log('API Response:', response.data);
    
    if (!response.data || !response.data.data) {
      console.log('No data in response');
      return [];
    }
    
    const results = response.data.data.map(location => ({
      code: location.iataCode || location.id,
      name: location.name,
      city: location.address?.cityName || location.name,
      country: location.address?.countryName || '',
      type: location.subType,
      displayName: `${location.name} (${location.iataCode || location.id})${location.address?.cityName ? ` - ${location.address.cityName}` : ''}`
    }));
    
    console.log('Processed results:', results.length);
    return results;
    
  } catch (error) {
    console.error('Search Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        params: error.config?.params,
        method: error.config?.method
      }
    });
    
    // Return empty array on error so UI doesn't break
    return [];
  }
};