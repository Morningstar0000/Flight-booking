import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { flightService } from '../services/flightService' // Import Supabase service
import { airlineIataCodes } from '../utils/airlineIataCodes';
import AirlineLogo from '../components/AirlineLogo';

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [hotelPackage, setHotelPackage] = useState(null);

  
   const [sortBy, setSortBy] = useState('cheapest')
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    cabinClasses: [],
    priceRange: [0, 5000], // Increased max price for first class
    timeOfDay: []
  })
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState('')

  const searchParams = location.state || {}
  const from = searchParams.from || ''
  const to = searchParams.to || ''
  const fromDisplay = searchParams.fromDisplay || `${searchParams.fromCity || ''} (${from})`
  const toDisplay = searchParams.toDisplay || `${searchParams.toCity || ''} (${to})`
  const departDate = searchParams.departDate || ''
  const returnDate = searchParams.returnDate || ''
  const tripType = searchParams.tripType || 'oneWay'
  const passengers = searchParams.passengers || '1 Passenger, Economy'

  // Check for hotel package in location state
  useEffect(() => {
    if (location.state?.hotelPackage) {
      setHotelPackage(location.state.hotelPackage);
    }
  }, [location.state]);

 
  // Fetch flights from Supabase
  useEffect(() => {
    if (from && to) {
      setLoading(true)
      
      const fetchFlights = async () => {
        try {
          console.log(`🔍 Searching flights from ${from} to ${to} on date: ${departDate}`);
          
          // Fetch flights from Supabase by route
          const results = await flightService.getFlightsByRoute(from, to, departDate || null);
          
          console.log(`📊 Raw results: ${results.length} flights`);
          
          // Log each flight for debugging
          results.forEach((f, i) => {
            console.log(`  Flight ${i+1}: ${f.airline} ${f.flight_number} - ${f.cabin_class} - $${f.price}`);
          });
          
          // DO NOT remove duplicates - we want all cabin classes to show
          setFlights(results);
          
          // Update price range based on actual flights
          if (results.length > 0) {
            const prices = results.map(f => f.price);
            setFilters(prev => ({
              ...prev,
              priceRange: [Math.min(...prices), Math.max(...prices)]
            }));
          }
          
          setDebug(`Found ${results.length} flights`);
        } catch (error) {
          console.error('Error fetching flights:', error);
          setFlights([]);
          setDebug('Error loading flights');
        } finally {
          setLoading(false);
        }
      };

      fetchFlights();
    } else {
      setLoading(false);
    }
  }, [from, to, departDate]);

  // Get unique airlines from results
  const availableAirlines = useMemo(() => {
    const airlines = new Set(flights.map(f => f.airline))
    return Array.from(airlines)
  }, [flights])

  // Get unique cabin classes from results
  const availableCabinClasses = useMemo(() => {
    const cabinClasses = new Set(flights.map(f => f.cabin_class))
    return Array.from(cabinClasses)
  }, [flights])

  // Get min and max prices
  const priceRange = useMemo(() => {
    if (flights.length === 0) return [0, 5000]
    const prices = flights.map(f => f.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [flights])

  // Filter and sort flights - WITHOUT removing duplicates
  const filteredFlights = useMemo(() => {
    let result = [...flights]
    
    console.log(`🎯 Filtering ${result.length} flights`);

    // Apply stop filter
    if (filters.stops.length > 0) {
      result = result.filter(flight => {
        if (filters.stops.includes('nonstop') && flight.stops === 0) return true
        if (filters.stops.includes('oneStop') && flight.stops === 1) return true
        if (filters.stops.includes('twoPlus') && flight.stops >= 2) return true
        return false
      })
    }

    // Apply airline filter
    if (filters.airlines.length > 0) {
      result = result.filter(flight => 
        filters.airlines.includes(flight.airline)
      )
    }

    // Apply cabin class filter
    if (filters.cabinClasses.length > 0) {
      result = result.filter(flight => 
        filters.cabinClasses.includes(flight.cabin_class)
      )
    }

    // Apply price filter
    result = result.filter(flight => 
      flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
    )

    // Sort
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => {
        const durationA = parseInt(a.duration.split('h')[0])
        const durationB = parseInt(b.duration.split('h')[0])
        return durationA - durationB
      })
    } else if (sortBy === 'best') {
      result.sort((a, b) => {
        const scoreA = a.price + (parseInt(a.duration.split('h')[0]) * 30)
        const scoreB = b.price + (parseInt(b.duration.split('h')[0]) * 30)
        return scoreA - scoreB
      })
    }

    console.log(`📌 After filtering: ${result.length} flights`);
    return result
  }, [flights, filters, sortBy])

  const handleStopFilter = (stop) => {
    setFilters(prev => ({
      ...prev,
      stops: prev.stops.includes(stop)
        ? prev.stops.filter(s => s !== stop)
        : [...prev.stops, stop]
    }))
  }

  const handleAirlineFilter = (airline) => {
    setFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter(a => a !== airline)
        : [...prev.airlines, airline]
    }))
  }

  const handleCabinClassFilter = (cabinClass) => {
    setFilters(prev => ({
      ...prev,
      cabinClasses: prev.cabinClasses.includes(cabinClass)
        ? prev.cabinClasses.filter(c => c !== cabinClass)
        : [...prev.cabinClasses, cabinClass]
    }))
  }

  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }))
  }

  const handleSelectFlight = (flightId) => {
    const selectedFlight = flights.find(f => f.id === flightId);

    // Transform flight data to match expected format
    const transformedFlight = {
      id: selectedFlight.id,
      airline: selectedFlight.airline,
      flightNumber: selectedFlight.flight_number,
      from: {
        code: selectedFlight.from_code,
        airport: selectedFlight.from_airport,
        city: selectedFlight.from_city,
        terminal: selectedFlight.from_terminal
      },
      to: {
        code: selectedFlight.to_code,
        airport: selectedFlight.to_airport,
        city: selectedFlight.to_city,
        terminal: selectedFlight.to_terminal
      },
      departureTime: selectedFlight.departure_time,
      arrivalTime: selectedFlight.arrival_time,
      date: selectedFlight.date,
      duration: selectedFlight.duration,
      aircraft: selectedFlight.aircraft,
      cabinClass: selectedFlight.cabin_class,
      stops: selectedFlight.stops,
      stopInfo: selectedFlight.stop_info,
      price: selectedFlight.price,
      seats: selectedFlight.seats
    };

    // Check if we have a hotel package
    if (hotelPackage) {
      // Package booking - go to package summary
      navigate('/package-summary', {
        state: {
          flight: transformedFlight,
          hotel: hotelPackage.hotel,
          searchParams: searchParams,
          hotelPackage: hotelPackage,
          totalPrice: calculatePackagePrice(selectedFlight.price)
        }
      });
    } else {
      // Flight-only booking - go to flight summary
      navigate('/flight-summary', {
        state: {
          flight: transformedFlight,
          searchParams: searchParams
        }
      });
    }
  };

  const calculatePackagePrice = (flightPrice) => {
    if (!hotelPackage) return flightPrice;
    return flightPrice + (hotelPackage.hotelPrice || 0);
  };

  // Add a package banner at the top of results
  const renderPackageBanner = () => {
    if (!hotelPackage) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏨</span>
              <div>
                <p className="font-semibold text-gray-800">{hotelPackage.hotelName}</p>
                <p className="text-xs text-gray-600">
                  {hotelPackage.checkIn} - {hotelPackage.checkOut} • {hotelPackage.guests}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <p className="font-semibold text-gray-800">Select your flight</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Hotel price</p>
            <p className="font-bold text-blue-600">${hotelPackage.hotelPrice}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleBackToSearch = () => {
    navigate('/', {
      state: {
        from: from,
        to: to,
        fromDisplay: fromDisplay,
        toDisplay: toDisplay,
        departDate: departDate,
        returnDate: returnDate,
        tripType: tripType,
        passengers: passengers,
        hotelPackage: hotelPackage
      }
    })
  }

  const formatTime = (time) => {
    if (!time) return '--:--';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  const getStopText = (stops) => {
    if (stops === 0) return 'Non-stop'
    if (stops === 1) return '1 Stop'
    return `${stops} Stops`
  }

  const getCabinClassBadgeColor = (cabinClass) => {
    switch (cabinClass) {
      case 'Economy': return 'bg-gray-100 text-gray-700';
      case 'Premium Economy': return 'bg-blue-100 text-blue-700';
      case 'Business': return 'bg-purple-100 text-purple-700';
      case 'First': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderPackageBanner()}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Search Button */}
        <button
          onClick={handleBackToSearch}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Search</span>
        </button>

         {/* Debug info - remove after fixing */}
        {debug && (
          <div className="mb-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
            Debug: {debug} | Filtered: {filteredFlights.length} | Raw: {flights.length}
          </div>
        )}

        {/* Results Header */}
       <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripType === 'roundTrip' ? 'Round Trip' : 'One Way'} Flights
          </h1>
          <div className="flex items-center gap-2 text-lg text-gray-600 mb-2">
            <span className="font-semibold">{fromDisplay}</span>
            <span>→</span>
            <span className="font-semibold">{toDisplay}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📅 Depart: {departDate || 'Not specified'}</span>
            {returnDate && <span>↩️ Return: {returnDate}</span>}
            <span>👤 {passengers}</span>
          </div>
          <p className="text-gray-600 mt-2">
            {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              {/* Stops Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-gray-700">Stops</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.stops.includes('nonstop')}
                      onChange={() => handleStopFilter('nonstop')}
                    />
                    <span className="text-gray-700 group-hover:text-blue-600">Non-stop</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.stops.includes('oneStop')}
                      onChange={() => handleStopFilter('oneStop')}
                    />
                    <span className="text-gray-700 group-hover:text-blue-600">1 Stop</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.stops.includes('twoPlus')}
                      onChange={() => handleStopFilter('twoPlus')}
                    />
                    <span className="text-gray-700 group-hover:text-blue-600">2+ Stops</span>
                  </label>
                </div>
              </div>

              {/* Airlines Filter */}
              {availableAirlines.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-gray-700">Airlines</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableAirlines.map(airline => (
                      <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.airlines.includes(airline)}
                          onChange={() => handleAirlineFilter(airline)}
                        />
                        <span className="text-gray-700 group-hover:text-blue-600">{airline}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Cabin Class Filter */}
              {availableCabinClasses.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-gray-700">Cabin Class</h3>
                  <div className="space-y-3">
                    {availableCabinClasses.map(cabinClass => (
                      <label key={cabinClass} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.cabinClasses.includes(cabinClass)}
                          onChange={() => handleCabinClassFilter(cabinClass)}
                        />
                        <span className="text-gray-700 group-hover:text-blue-600">{cabinClass}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-gray-700">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">${filters.priceRange[0]}</span>
                    <span className="text-gray-600">${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  stops: [],
                  airlines: [],
                  cabinClasses: [],
                  priceRange: [priceRange[0], priceRange[1]],
                  timeOfDay: []
                })}
                className="w-full text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                <button
                  onClick={() => setSortBy('cheapest')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'cheapest'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Cheapest
                </button>
                <button
                  onClick={() => setSortBy('fastest')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'fastest'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Fastest
                </button>
                <button
                  onClick={() => setSortBy('best')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'best'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Best
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Searching for the best flights...</p>
              </div>
            )}

            {/* Flight Cards */}
            {!loading && (
              <div className="space-y-4">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map(flight => {
                    // Get IATA code for this airline
                    const airlineCode = airlineIataCodes[flight.airline] || flight.airline_code || flight.airline.substring(0, 2).toUpperCase();

                    return (
                      <div key={flight.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                            {/* Airline */}
                            <div className="md:col-span-1">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                                <AirlineLogo airline={flight.airline} airlineCode={airlineCode} />
                              </div>
                              <p className="font-semibold text-sm text-gray-800">{flight.airline}</p>
                              <p className="text-xs text-gray-500">{flight.flight_number}</p>
                            </div>

                            {/* Departure */}
                            <div className="md:col-span-2 text-center md:text-left">
                              <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departure_time)}</p>
                              <p className="font-semibold text-gray-700">{flight.from_code}</p>
                              <p className="text-xs text-gray-500">{flight.from_airport}</p>
                              <p className="text-xs text-gray-500">Terminal {flight.from_terminal || 'N/A'}</p>
                            </div>

                            {/* Duration & Stops */}
                            <div className="md:col-span-1 text-center">
                              <p className="text-sm font-medium text-gray-600 mb-1">{flight.duration}</p>
                              <div className="relative flex items-center justify-center">
                                <div className="w-16 h-0.5 bg-gray-300"></div>
                                <div className="absolute -top-3 whitespace-nowrap">
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {getStopText(flight.stops)}
                                  </span>
                                </div>
                              </div>
                              {flight.stop_info && (
                                <p className="text-xs text-gray-500 mt-3">{flight.stop_info}</p>
                              )}
                            </div>

                            {/* Arrival */}
                            <div className="md:col-span-2 text-center md:text-left">
                              <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrival_time)}</p>
                              <p className="font-semibold text-gray-700">{flight.to_code}</p>
                              <p className="text-xs text-gray-500">{flight.to_airport}</p>
                              <p className="text-xs text-gray-500">Terminal {flight.to_terminal || 'N/A'}</p>
                            </div>

                            {/* Price & Action */}
                            <div className="md:col-span-1 text-right">
                              <div className="mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getCabinClassBadgeColor(flight.cabin_class)}`}>
                                  {flight.cabin_class}
                                </span>
                              </div>
                              <p className="text-3xl font-bold text-blue-600 mb-2">${flight.price}</p>
                              <p className="text-xs text-gray-500 mb-3">per person</p>
                              <button
                                onClick={() => handleSelectFlight(flight.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">✈️</div>
                    <p className="text-gray-600 text-lg mb-2">No flights found matching your criteria</p>
                    <p className="text-gray-500">Try adjusting your filters or search for a different route</p>

                    {/* Back to Search Button inside empty state */}
                    <button
                      onClick={handleBackToSearch}
                      className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}