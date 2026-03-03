import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { searchHotelsByLocation } from '../services/hotelDiscoveryService'
import { 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Wifi, 
  Coffee, 
  Dumbbell, 
  Waves,
  Sparkles,
  Clock,
  Shield,
  CreditCard,
  ArrowRight,
  Search,
  Leaf
} from 'lucide-react'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import HotelReviews from '../components/HotelReviews'

export default function HotelsPage() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('London, UK')
  const [checkIn, setCheckIn] = useState('2026-02-25')
  const [checkOut, setCheckOut] = useState('2026-03-02')
  const [guests, setGuests] = useState('2 Guests, 1 Room')
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const parseGuests = (guestString) => {
    const match = guestString.match(/(\d+)\s+Guest/)
    return match ? parseInt(match[1]) : 2
  }

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)

    try {
      const adults = parseGuests(guests)
      console.log('Searching hotels in:', location, 'for', adults, 'adults')

      const results = await searchHotelsByLocation(
        location.split(',')[0].trim(),
        checkIn,
        checkOut,
        adults
      )

      console.log(`Found ${results.length} hotels`)
      setHotels(results)
    } catch (error) {
      console.error('Hotel search failed:', error)
      setHotels([])
    }

    setLoading(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Popular destinations with Unsplash images
  const popularDestinations = [
    { 
      city: 'London', 
      country: 'UK', 
      hotels: 245, 
      price: 89,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      description: 'Historic landmarks & royal palaces'
    },
    { 
      city: 'Paris', 
      country: 'France', 
      hotels: 189, 
      price: 95,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'City of love & romantic getaways'
    },
    { 
      city: 'New York', 
      country: 'USA', 
      hotels: 312, 
      price: 129,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      description: 'The city that never sleeps'
    },
    { 
      city: 'Tokyo', 
      country: 'Japan', 
      hotels: 178, 
      price: 110,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      description: 'Modern meets traditional'
    },
    { 
      city: 'Dubai', 
      country: 'UAE', 
      hotels: 156, 
      price: 145,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      description: 'Luxury & futuristic architecture'
    },
    { 
      city: 'Rome', 
      country: 'Italy', 
      hotels: 134, 
      price: 92,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      description: 'Ancient history & Italian charm'
    },
    { 
      city: 'Barcelona', 
      country: 'Spain', 
      hotels: 167, 
      price: 88,
      image: 'https://images.unsplash.com/photo-1583429578889-30f6b80d6c68?w=800&q=80',
      description: 'Gaudi architecture & beaches'
    },
    { 
      city: 'Singapore', 
      country: 'Singapore', 
      hotels: 143, 
      price: 135,
      image: 'https://images.unsplash.com/photo-1525625299086-3fcd6bd1e5c0?w=800&q=80',
      description: 'Garden city & futuristic skyline'
    }
  ]

  // Features data - Updated with green theme
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Best Price Guarantee",
      description: "Find a lower price? We'll match it and give you 10% off your stay.",
      color: "from-emerald-600 to-green-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Customer Support",
      description: "Our multilingual team is always ready to help with any questions.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Flexible Booking",
      description: "Free cancellation on most rooms. Book now, pay later options available.",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Verified Reviews",
      description: "All reviews are from real guests who have stayed at the property.",
      color: "from-teal-500 to-emerald-600"
    }
  ]

  // Hotel benefits
  const benefits = [
    { icon: <Wifi />, label: "Free WiFi" },
    { icon: <Coffee />, label: "Breakfast Included" },
    { icon: <Dumbbell />, label: "Fitness Center" },
    { icon: <Waves />, label: "Swimming Pool" }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section - Updated with green overlay */}
        <section
          className="relative pt-32 pb-40 md:pt-40 md:pb-52 text-white text-center overflow-visible"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(5, 50, 30, 0.8) 0%, rgba(16, 185, 129, 0.5) 100%), url(/hotel.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative max-w-6xl mx-auto px-4 p z-20">
            {/* Badge - Updated to green */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium">10,000+ Eco-Friendly Hotels</span>
            </div>
            <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-2 text-white drop-shadow-2xl tracking-tight">
              Find Your Perfect
              <span className="block text-emerald-200">Green Stay</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover sustainable accommodations at the best prices, from eco-luxury resorts to green bed & breakfasts
            </p>
            </div>

            {/* Search Form Card */}
            <div className="relative z-30 -mb-72 translate-y-20">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Location with icon - Updated to green */}
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Destination
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="Where are you going?"
                    />
                  </div>

                  {/* Check-In with icon - Updated to green */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                  </div>

                  {/* Check-Out with icon - Updated to green */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                  </div>

                  {/* Guests with icon - Updated to green */}
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Guests & Rooms
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    >
                      <option>1 Guest, 1 Room</option>
                      <option>2 Guests, 1 Room</option>
                      <option>3 Guests, 1 Room</option>
                      <option>4 Guests, 2 Rooms</option>
                      <option>5 Guests, 2 Rooms</option>
                      <option>6 Guests, 3 Rooms</option>
                    </select>
                  </div>

                  {/* Search Button - Updated to green gradient */}
                  <div className="lg:col-span-2 flex items-end">
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          SEARCHING...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          SEARCH HOTELS
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Popular filters:</span>
                  {benefits.map((benefit, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {benefit.icon}
                      <span>{benefit.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section - Updated with green theme */}
        <section className="pt-48 pb-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header - Updated to green */}
            <div className="text-center max-w-3xl mx-auto mb-16 mt-16">
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-4 py-2 rounded-full">
                Why Book With Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-8 mb-6 text-gray-900 tracking-tight">
                Experience the{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Best Hotel Deals
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We partner with thousands of hotels to bring you the best prices and most comfortable stays.
              </p>
            </div>

            {/* Features Grid - Updated with green hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section - Enhanced Cards with green accents */}
        {searched && (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {loading ? 'Searching...' : `${hotels.length} Hotels Found`}
                  <span className="text-lg font-normal text-gray-500 ml-3">in {location}</span>
                </h2>
                
                {/* Sort dropdown - Updated focus ring to green */}
                <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: Highest First</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-emerald-500"></div>
                  <p className="mt-4 text-gray-600">Searching for the best hotels...</p>
                </div>
              ) : hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden">
                        {hotel.hotel?.media?.length > 0 ? (
                          <img
                            src={hotel.hotel.media[0].uri}
                            alt={hotel.hotel.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                            }}
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                            alt="Hotel"
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Badges - Updated to green */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {hotel.hotel?.hotelClass && (
                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              {hotel.hotel.hotelClass} ★
                            </span>
                          )}
                          {hotel.offers?.[0]?.cancellationPolicy?.cancellationType === 'FREE_CANCELLATION' && (
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Free Cancellation
                            </span>
                          )}
                        </div>

                        {/* Price Tag - Updated to green */}
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-emerald-600">${hotel.offers?.[0]?.price?.total || 199}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title & Rating */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">{hotel.hotel?.name}</h3>
                          {hotel.hotel?.rating > 0 && (
                            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 text-emerald-500 fill-current" />
                              <span className="font-semibold text-gray-900">{hotel.hotel.rating}</span>
                              <span className="text-xs text-gray-500">({hotel.reviews || 128})</span>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.hotel?.address?.lines?.[0] || 'City Center'}</span>
                        </div>

                        {/* Description */}
                        {hotel.hotel?.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {hotel.hotel.description}
                          </p>
                        )}

                        {/* Amenities */}
                        {hotel.hotel?.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Dates */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(checkIn)}</span>
                          </div>
                          <ArrowRight className="w-4 h-4" />
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(checkOut)}</span>
                          </div>
                        </div>

                        {/* Book Button - Updated to green gradient */}
                        <button
                          onClick={() => navigate(`/hotel-details`, {
                            state: {
                              hotel: hotel,
                              searchParams: {
                                checkIn: checkIn,
                                checkOut: checkOut,
                                guests: guests,
                                location: location
                              }
                            }
                          })}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Hotel className="w-4 h-4" />
                          BOOK NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                  <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No hotels found in this area</p>
                  <p className="text-gray-500">Try searching for a different location or date</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Destinations with Real Images */}
        {!searched && (
          <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Section Header - Updated to green */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-4 py-2 rounded-full">
                  Explore
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mt-8 mb-6 text-gray-900 tracking-tight">
                  Popular Hotel{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Destinations
                  </span>
                </h2>
                <p className="text-lg text-gray-600">Browse top-rated hotels around the world</p>
              </div>

              {/* Destinations Grid with Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularDestinations.map((dest, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLocation(dest.city)
                      handleSearch()
                    }}
                    className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                  >
                    {/* Background Image */}
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay - Updated to green */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      {/* City and Country */}
                      <div>
                        <h3 className="text-3xl font-bold mb-1 drop-shadow-lg">{dest.city}</h3>
                        <p className="text-white/80 text-sm mb-3">{dest.country}</p>
                        
                        {/* Description */}
                        <p className="text-white/70 text-xs mb-4 line-clamp-2">{dest.description}</p>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between border-t border-white/20 pt-4">
                          <div>
                            <p className="text-2xl font-bold">${dest.price}</p>
                            <p className="text-xs text-white/60">avg/night</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-semibold">{dest.hotels}+</p>
                            <p className="text-xs text-white/60">hotels</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect - Updated to green */}
                    <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust Badges - Updated to green */}
        <section className="py-16 px-4 bg-emerald-50 border-y border-emerald-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Secure Booking</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">2M+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">4.5/5 Rating</span>
              </div>
            </div>
          </div>
        </section>
        <HotelReviews />
         <Newsletter />
         <Footer/>
      </main>
    </>
  )
}