import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function HotelDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, searchParams } = location.state || {};
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">No hotel selected. Please go back and select a hotel.</p>
          <button 
            onClick={() => navigate('/hotels')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const amenities = hotel.hotel?.amenities || [];
  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);

   const handleBookPackage = () => {
  // Navigate to flights page with hotel data in state
  navigate('/', { 
    state: { 
      hotelPackage: {
        hotel: hotel,
        checkIn: searchParams?.checkIn,
        checkOut: searchParams?.checkOut,
        guests: searchParams?.guests,
        hotelPrice: hotel.offers?.[0]?.price?.total || 0,
        hotelName: hotel.hotel?.name
      },
      bookingType: 'hotel-first' // Indicates user came from hotel selection
    }
  });
};

// Update your Book Now button:


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Search Results</span>
        </button>

        {/* Hotel Name */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {hotel.hotel?.name}
        </h1>
        
        {/* Location & Rating */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {hotel.hotel?.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(hotel.hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-700">
                {hotel.hotel.rating} ({hotel.reviews} reviews)
              </span>
            </div>
          )}
          
          {hotel.location_rating && (
            <span className="text-sm text-gray-600">
              Location rating: {hotel.location_rating}/5
            </span>
          )}
        </div>

        {/* Image Gallery */}
        {hotel.hotel?.media?.length > 0 && (
          <div className="mb-8">
            {/* Main Image */}
            <div className="h-96 bg-gray-200 rounded-xl overflow-hidden mb-4">
              <img 
                src={hotel.hotel.media[selectedImage]?.uri}
                alt={hotel.hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Hotel+Image';
                }}
              />
            </div>
            
            {/* Thumbnails */}
            {hotel.hotel.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hotel.hotel.media.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                    }`}
                  >
                    <img 
                      src={image.uri}
                      alt={`${hotel.hotel.name} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=Hotel';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            {hotel.hotel?.description && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About the Hotel</h2>
                <p className="text-gray-700 leading-relaxed">{hotel.hotel.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {displayedAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
                
                {amenities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showAllAmenities ? 'Show less' : `Show all ${amenities.length} amenities`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              
              {/* Price */}
              {hotel.offers?.[0] && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    ${hotel.offers[0].price?.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    per night • {formatDate(searchParams?.checkIn)} - {formatDate(searchParams?.checkOut)}
                  </p>
                </div>
              )}
              
              {/* Check-in/out times */}
              {(hotel.hotel?.checkIn || hotel.hotel?.checkOut) && (
                <div className="mb-4 pb-4 border-b">
                  {hotel.hotel?.checkIn && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-semibold">{hotel.hotel.checkIn}</span>
                    </div>
                  )}
                  {hotel.hotel?.checkOut && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-semibold">{hotel.hotel.checkOut}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Room type */}
              {hotel.offers?.[0]?.room && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-gray-600 mb-1">Room Type</p>
                  <p className="font-semibold">{hotel.offers[0].room.typeEstimated?.category || 'Standard Room'}</p>
                </div>
              )}
              
              {/* Guests */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-gray-600 mb-1">Guests</p>
                <p className="font-semibold">{hotel.offers?.[0]?.guests?.adults || 2} Adults</p>
              </div>
              
              {/* Book Button */}
              <button 
  onClick={handleBookPackage}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
>
  Continue to Flight Selection
</button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}