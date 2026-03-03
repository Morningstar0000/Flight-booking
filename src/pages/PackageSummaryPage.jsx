import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Plane, Hotel, Calendar, Users, Clock, MapPin, Briefcase, Wifi, Coffee, Film, Dumbbell, Sun, Wind, Award, ChevronRight } from 'lucide-react';
import { airlineLogos } from '../utils/airlineLogos';

export default function PackageSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, hotel, hotelPackage, totalPrice, searchParams } = location.state || {};

  if (!flight || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">No package selected. Please start over.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      // Handle different date formats
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid
      }
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Return original string on error
    }
  };

  // Get the flight date from various possible sources
  const getFlightDate = () => {
    // Try to get date from flight object
    if (flight.departureDate) {
      return formatDate(flight.departureDate);
    }
    // Try to get from searchParams
    if (searchParams?.departDate) {
      return formatDate(searchParams.departDate);
    }
    // Fallback
    return 'Date not specified';
  };

  const formatTime = (time) => {
    return time; // Assuming time is already in HH:MM format
  };

  // Get airline logo from your existing mapping
  const getAirlineLogo = (airlineName) => {
    return airlineLogos[airlineName];
  };

  // Flight amenities/features
  const flightAmenities = [
    { icon: <Wifi size={16} />, label: 'Wi-Fi available' },
    { icon: <Coffee size={16} />, label: 'Meal included' },
    { icon: <Film size={16} />, label: 'Entertainment' },
    { icon: <Briefcase size={16} />, label: '2 bags included' }
  ];

  const handleContinue = () => {
    navigate('/passenger-details', {
      state: {
        flight: flight,
        hotel: hotel,
        isPackage: true,
        totalPrice: totalPrice,
        searchParams: searchParams,
        hotelPackage: hotelPackage
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Flight Selection</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Flight + Hotel Summary</h1>
            <p className="text-gray-600">Review your flight and hotel details before booking</p>
          </div>
        </div>

        {/* Flight Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Plane className="w-6 h-6" />
              <h2 className="text-xl font-bold">Flight Details</h2>
            </div>
          </div>
          
          {/* Card Body */}
          <div className="p-6">
            {/* Airline Info */}
            <div className="flex items-center gap-4 mb-6">
              {/* Airline Logo */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                {getAirlineLogo(flight.airline) ? (
                  <img 
                    src={getAirlineLogo(flight.airline)}
                    alt={flight.airline}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-lg">${flight.airline?.substring(0, 2).toUpperCase()}</span>
                      </div>`;
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {flight.airline?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                <p className="text-gray-500 flex items-center gap-2">
                  <span>{flight.flightNumber}</span>
                  <span>•</span>
                  <span>{flight.aircraft || 'Boeing 787-9'}</span>
                </p>
              </div>
            </div>

            {/* Flight Route */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-6">
              {/* Departure */}
              <div className="md:col-span-2">
                <p className="text-3xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                <p className="text-lg font-semibold text-gray-700">{flight.from.code}</p>
                <p className="text-sm text-gray-500">{flight.from.airport}</p>
                <p className="text-xs text-gray-400">Terminal {flight.from.terminal || 'N/A'}</p>
              </div>

              {/* Duration & Stops */}
              <div className="md:col-span-3 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">{flight.duration}</p>
                <div className="relative flex items-center justify-center">
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="absolute">
                    <Plane className="w-5 h-5 text-blue-600 transform rotate-90" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                </p>
                {flight.stopInfo && (
                  <p className="text-xs text-gray-500 mt-1">{flight.stopInfo}</p>
                )}
              </div>

              {/* Arrival */}
              <div className="md:col-span-2 text-right">
                <p className="text-3xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
                <p className="text-lg font-semibold text-gray-700">{flight.to.code}</p>
                <p className="text-sm text-gray-500">{flight.to.airport}</p>
                <p className="text-xs text-gray-400">Terminal {flight.to.terminal || 'N/A'}</p>
              </div>
            </div>

            {/* Additional Flight Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              {/* Seat Info */}
              {flight.seat && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">💺</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seat</p>
                    <p className="font-medium">{flight.seat}</p>
                  </div>
                </div>
              )}
              
              {/* Baggage */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Baggage</p>
                  <p className="font-medium">1 carry-on + 1 checked</p>
                </div>
              </div>
              
              {/* Cabin Class */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cabin</p>
                  <p className="font-medium">{flight.cabinClass || 'Economy'}</p>
                </div>
              </div>
              
              {/* Date - FIXED */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{getFlightDate()}</p>
                </div>
              </div>
            </div>

            {/* Flight Amenities */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Amenities on board:</p>
              <div className="flex flex-wrap gap-3">
                {flightAmenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Hotel className="w-6 h-6" />
              <h2 className="text-xl font-bold">Hotel Details</h2>
            </div>
          </div>
          
          {/* Card Body */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Hotel Image */}
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {hotel.hotel?.media?.length > 0 ? (
                  <img 
                    src={hotel.hotel.media[0].uri}
                    alt={hotel.hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Hotel';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                    <Hotel className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.hotel?.name}</h3>
                
                {/* Rating */}
                {hotel.hotel?.rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(hotel.hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{hotel.hotel.rating} ({hotel.reviews} reviews)</span>
                  </div>
                )}
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.hotel?.description}</p>
                
                {/* Stay Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Check-in: {formatDate(hotelPackage?.checkIn)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Check-out: {formatDate(hotelPackage?.checkOut)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{hotelPackage?.guests}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Price Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Flight
              </span>
              <span className="font-semibold">${flight.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Hotel ({formatDate(hotelPackage?.checkIn)} - {formatDate(hotelPackage?.checkOut)})
              </span>
              <span className="font-semibold">${hotelPackage?.hotelPrice}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Package Price</span>
                <span className="text-blue-600">${totalPrice}</span>
              </div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Award className="w-4 h-4" />
                You save ${Math.round(totalPrice * 0.1)} by booking together
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Book Now
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}