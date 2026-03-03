import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import { flightRoutes, getPopularDestinations } from '../services/flightResultsData'
import { ChevronLeft, ChevronRight, Plane } from 'lucide-react'
import { flightService } from '../services/flightService'

// New Modular Components
import Features from '../components/Features'
import Partners from '../components/Partners'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation();
  const carouselRef = useRef(null);

  const [hotelPackage, setHotelPackage] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load popular destinations from flight data
  // Load popular destinations from Supabase
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        // Get all flights
        const flights = await flightService.getFlights();

        // Create a map of unique routes
        const routeMap = new Map();

        flights.forEach(flight => {
          const routeKey = `${flight.from_code}-${flight.to_code}`;
          if (!routeMap.has(routeKey)) {
            routeMap.set(routeKey, {
              fromCode: flight.from_code,
              fromCity: flight.from_city,
              fromCountry: flight.from_country,
              toCode: flight.to_code,
              toCity: flight.to_city,
              toCountry: flight.to_country,
              price: flight.price,
              airline: flight.airline,
              // Count how many flights on this route
              count: 1
            });
          } else {
            const existing = routeMap.get(routeKey);
            existing.count += 1;
            // Keep the lowest price
            if (flight.price < existing.price) {
              existing.price = flight.price;
            }
          }
        });

        // Convert map to array and sort by popularity (count)
        const routes = Array.from(routeMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 8); // Take top 8 routes

        setPopularDestinations(routes);
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
        // Fallback to default destinations if Supabase fails
        setPopularDestinations([
          {
            fromCode: 'JFK',
            fromCity: 'New York',
            fromCountry: 'USA',
            toCode: 'LAX',
            toCity: 'Los Angeles',
            toCountry: 'USA',
            price: 299
          },
          {
            fromCode: 'LHR',
            fromCity: 'London',
            fromCountry: 'UK',
            toCode: 'DXB',
            toCity: 'Dubai',
            toCountry: 'UAE',
            price: 589
          },
          // Add more fallbacks as needed
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  useEffect(() => {
    if (location.state?.hotelPackage) {
      setHotelPackage(location.state.hotelPackage);
      console.log('Hotel package selected:', location.state.hotelPackage);
    }
  }, [location.state]);

  const handleSearch = (searchData) => {
    if (hotelPackage) {
      navigate('/results', {
        state: {
          ...searchData,
          hotelPackage: hotelPackage
        }
      });
    } else {
      navigate('/results', {
        state: searchData
      });
    }
  };

  // Show hotel package banner if exists
  const renderHotelBanner = () => {
    if (!hotelPackage) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏨</span>
          <div>
            <p className="font-semibold text-green-800">Hotel Selected</p>
            <p className="text-sm text-green-600">
              {hotelPackage.hotelName} • {hotelPackage.checkIn} to {hotelPackage.checkOut} • ${hotelPackage.hotelPrice} total
            </p>
          </div>
        </div>
        <button
          onClick={() => setHotelPackage(null)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    );
  };

  // Get all flights for a specific route
  const getFlightsForRoute = (fromCode, toCode) => {
    return flightRoutes.filter(flight =>
      flight.from.code === fromCode && flight.to.code === toCode
    );
  };

  const handleDestinationClick = (dest) => {
    // Navigate to results page with the route - NO DATE FILTER!
    navigate('/results', {
      state: {
        from: dest.fromCode,
        fromCity: dest.fromCity,
        fromDisplay: `${dest.fromCity} (${dest.fromCode})`,
        to: dest.toCode,
        toCity: dest.toCity,
        toDisplay: `${dest.toCity} (${dest.toCode})`,
        // Remove the date filter - let the results page show all dates
        // departDate: new Date().toISOString().split('T')[0], // REMOVED THIS LINE
        returnDate: null,
        tripType: 'oneWay',
        passengers: '1 Passenger, Economy',
        hotelPackage: hotelPackage
      }
    });
  };

  // Carousel navigation functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setCurrentIndex(Math.min(popularDestinations.length - 4, currentIndex + 1));
    }
  };

  const getDestinationImage = (city) => {
    const images = {
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      'Los Angeles': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'San Francisco': 'https://images.unsplash.com/photo-1501594907352-9c5b39c4e12b?w=800&q=80',
      'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50ebb7a30bbd?w=800&q=80',
      'Singapore': 'https://images.unsplash.com/photo-1525625299086-3fcd6bd1e5c0?w=800&q=80',
      'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      'Barcelona': 'https://images.unsplash.com/photo-1583429578889-30f6b80d6c68?w=800&q=80',
      'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
      'Hong Kong': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
      'Seoul': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80'
    };
    return images[city] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* 1. Hero Section (Unchanged Style) */}
        <section
          className="relative pt-40 pb-52 md:pt-48 md:pb-64 text-white text-center overflow-visible"
          style={{
            backgroundImage: 'url(/Herosky.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative max-w-6xl mx-auto px-4 z-20">
            {/* Title with more spacing from navbar */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl tracking-tight">
                {hotelPackage ? 'Complete Your Package' : 'Travel Without Limits'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                {hotelPackage
                  ? 'Select a flight to go with your hotel'
                  : 'Search and compare flights from hundreds of airlines'}
              </p>
            </div>

            {renderHotelBanner()}

            {/* Search Bar Wrapper - Adjusted position */}
            <div className="relative z-30 -mb-48 translate-y-16">
              <SearchBar
                onSearch={handleSearch}
                initialDestination={hotelPackage?.hotel?.hotel?.city || ''}
              />
            </div>
          </div>
        </section>

        {/* 2. Features Section (Newly Added) */}
        <Features />

        {/* 3. Popular Destinations Carousel - Now with Real Data */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-gray-900">Popular Destinations</h2>
                <p className="text-gray-600 text-lg">Discover the best deals on flights worldwide</p>
              </div>

              {popularDestinations.length > 4 && (
                <div className="flex gap-2">
                  <button
                    onClick={scrollLeft}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-30"
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-30"
                    disabled={currentIndex >= popularDestinations.length - 4}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularDestinations.map((dest, idx) => {
                  const fromCountry = dest.fromCountry || 'International';
                  const toCountry = dest.toCountry || 'International';

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDestinationClick(dest)}
                      className="group relative min-w-[300px] sm:min-w-[350px] lg:min-w-[400px] h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 snap-start flex-shrink-0"
                    >
                      <img
                        src={getDestinationImage(dest.toCity)}
                        alt={`${dest.fromCity} to ${dest.toCity}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:from-black/100 transition-colors" />

                      <div className="absolute bottom-0 p-8 w-full text-white">
                        <div className="mb-3 flex gap-2">
                          <span className="inline-block bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            {fromCountry}
                          </span>
                          <span className="inline-block bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            → {toCountry}
                          </span>
                        </div>
                        <h3 className="text-3xl text-white font-bold mb-2 drop-shadow-lg">{dest.toCity}</h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
                          <span className="font-semibold">{dest.fromCity}</span>
                          <Plane className="w-4 h-4 transform rotate-90" />
                          <span className="font-semibold">{dest.toCity}</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/30 mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-white/70">Starting from</p>
                            <p className="text-2xl font-bold">${dest.price}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full group-hover:bg-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-white/50 mt-2">{dest.count || 1} flights available</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Dots */}
            {popularDestinations.length > 4 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(popularDestinations.length / 4) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (carouselRef.current) {
                        carouselRef.current.scrollTo({ left: idx * 1600, behavior: 'smooth' });
                        setCurrentIndex(idx * 4);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${Math.floor(currentIndex / 4) === idx ? 'w-8 bg-blue-600' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Partners Section (Newly Added) */}
        <Partners />

        <ContactForm />

        {/* 5. FAQ Section (Newly Added) */}
        <FAQ />
        <Footer />

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
    </>
  )
}