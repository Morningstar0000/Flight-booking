import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import {
    Plane,
    Search,
    MapPin,
    ArrowLeft,
    Globe
} from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useNavigate } from 'react-router-dom';
import { airportDatabase, searchLocalAirports } from '../services/airports';
import { flightService } from '../services/flightService';
import FlightRouteLine from '../components/FlightRouteLine';
import FlightDetailsPanel from '../components/FlightDetailsPanel';
import FlightHistory from '../components/FlightHistory';
import { supabase } from '../services/supabaseClient';

// Create custom airport icon
const airportIcon = (() => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4 text-white" />
            </div>
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
})();

// Component to handle map fly-to on search
function FlyToLocation({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 10, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, map]);
    return null;
}

export default function FlightTrackerPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('flight'); // Default to flight search
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
    const [mapZoom, setMapZoom] = useState(4);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showAirports, setShowAirports] = useState(true);
    const [selectedFromAirport, setSelectedFromAirport] = useState(null);
    const [selectedToAirport, setSelectedToAirport] = useState(null);
    const [currentFlightNumber, setCurrentFlightNumber] = useState('');
    const [flightSubscription, setFlightSubscription] = useState(null);

    // Add this useEffect to handle real-time updates
    // Add this to your existing FlightTrackerPage component

    // Add this state
    const [lastSelectedFlightId, setLastSelectedFlightId] = useState(null);

    // Update handleFlightSelect to store the selected flight ID
    // In FlightTrackerPage.jsx, update handleFlightSelect

    const handleFlightSelect = async (flight) => {
        setLoading(true);

        try {
            // Fetch the complete flight data including simulation fields
            const completeFlight = await flightService.getFlightById(flight.id);

            console.log('Complete flight data with simulation:', completeFlight);

            // Check if this is a past flight (should use simulation data)
            const now = new Date();
            const flightDate = new Date(completeFlight.date);
            const [hours, minutes] = completeFlight.departure_time.split(':').map(Number);
            flightDate.setHours(hours, minutes, 0);

            const isPastFlight = flightDate <= now;

            // Transform the flight data
            const transformedFlight = {
                id: completeFlight.id,
                airline: completeFlight.airline,
                flightNumber: completeFlight.flight_number,
                from: {
                    code: completeFlight.from_code,
                    airport: completeFlight.from_airport,
                    city: completeFlight.from_city,
                    terminal: completeFlight.from_terminal
                },
                to: {
                    code: completeFlight.to_code,
                    airport: completeFlight.to_airport,
                    city: completeFlight.to_city,
                    terminal: completeFlight.to_terminal
                },
                departureTime: completeFlight.departure_time,
                arrivalTime: completeFlight.arrival_time,
                date: completeFlight.date,
                duration: completeFlight.duration,
                aircraft: completeFlight.aircraft,
                cabinClass: completeFlight.cabin_class,
                stops: completeFlight.stops,
                stopInfo: completeFlight.stop_info,
                current_lat: completeFlight.current_lat,
                current_lng: completeFlight.current_lng,
                current_progress: completeFlight.current_progress,
                simulation_active: isPastFlight ? true : completeFlight.simulation_active // Past flights always show simulation
            };

            console.log('Setting selected flight with simulation data:', transformedFlight);
            setSelectedFlight(transformedFlight);
            setCurrentFlightNumber(completeFlight.flight_number);
            setLastSelectedFlightId(completeFlight.id);

            // Find airport coordinates for the route
            const fromAirport = airportDatabase.find(a => a.code === completeFlight.from_code);
            const toAirport = airportDatabase.find(a => a.code === completeFlight.to_code);

            setSelectedFromAirport(fromAirport);
            setSelectedToAirport(toAirport);

            // Center map on current position if simulation is active
            if (transformedFlight.simulation_active && transformedFlight.current_lat && transformedFlight.current_lng) {
                setMapCenter([transformedFlight.current_lat, transformedFlight.current_lng]);
                setMapZoom(8);
                setSelectedPosition([transformedFlight.current_lat, transformedFlight.current_lng]);
            }
            // Otherwise center on route midpoint
            else if (fromAirport && toAirport) {
                const midLat = (fromAirport.lat + toAirport.lat) / 2;
                const midLng = (fromAirport.lng + toAirport.lng) / 2;
                setMapCenter([midLat, midLng]);

                const latDiff = Math.abs(fromAirport.lat - toAirport.lat);
                const lngDiff = Math.abs(fromAirport.lng - toAirport.lng);
                const maxDiff = Math.max(latDiff, lngDiff);

                if (maxDiff > 50) setMapZoom(4);
                else if (maxDiff > 20) setMapZoom(5);
                else if (maxDiff > 10) setMapZoom(6);
                else setMapZoom(7);
            }
        } catch (error) {
            console.error('Error loading flight details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update the real-time subscription handler
    useEffect(() => {
        if (selectedFlight?.id) {
            console.log('Setting up real-time subscription for flight:', selectedFlight.id);

            const subscription = flightService.subscribeToFlightUpdates(
                selectedFlight.id,
                (updatedFlight) => {
                    console.log('🔥 REAL-TIME UPDATE RECEIVED:', updatedFlight);

                    // Transform the updated flight data
                    const transformedFlight = {
                        id: updatedFlight.id,
                        airline: updatedFlight.airline,
                        flightNumber: updatedFlight.flight_number,
                        from: {
                            code: updatedFlight.from_code,
                            airport: updatedFlight.from_airport,
                            city: updatedFlight.from_city,
                            terminal: updatedFlight.from_terminal
                        },
                        to: {
                            code: updatedFlight.to_code,
                            airport: updatedFlight.to_airport,
                            city: updatedFlight.to_city,
                            terminal: updatedFlight.to_terminal
                        },
                        departureTime: updatedFlight.departure_time,
                        arrivalTime: updatedFlight.arrival_time,
                        date: updatedFlight.date,
                        duration: updatedFlight.duration,
                        aircraft: updatedFlight.aircraft,
                        cabinClass: updatedFlight.cabin_class,
                        stops: updatedFlight.stops,
                        stopInfo: updatedFlight.stop_info,
                        current_lat: updatedFlight.current_lat,
                        current_lng: updatedFlight.current_lng,
                        current_progress: updatedFlight.current_progress,
                        simulation_active: updatedFlight.simulation_active
                    };

                    console.log('Setting transformed flight with new position:', transformedFlight);
                    setSelectedFlight(transformedFlight);

                    // Update airport references if needed
                    const fromAirport = airportDatabase.find(a => a.code === updatedFlight.from_code);
                    const toAirport = airportDatabase.find(a => a.code === updatedFlight.to_code);

                    setSelectedFromAirport(fromAirport);
                    setSelectedToAirport(toAirport);

                    // Center map on new position if simulation is active
                    if (updatedFlight.simulation_active && updatedFlight.current_lat && updatedFlight.current_lng) {
                        setMapCenter([updatedFlight.current_lat, updatedFlight.current_lng]);
                        setMapZoom(8);
                        setSelectedPosition([updatedFlight.current_lat, updatedFlight.current_lng]);
                    }
                }
            );

            setFlightSubscription(subscription);

            return () => {
                if (subscription) {
                    console.log('Cleaning up subscription');
                    supabase.removeChannel(subscription);
                }
            };
        }
    }, [selectedFlight?.id]);

    // Add a useEffect to restore flight selection when navigating back
    useEffect(() => {
        // Check if there was a previously selected flight
        const savedFlightId = sessionStorage.getItem('lastSelectedFlightId');
        if (savedFlightId && !selectedFlight) {
            // Fetch and select the flight
            const restoreFlight = async () => {
                try {
                    const flight = await flightService.getFlightById(parseInt(savedFlightId));
                    if (flight) {
                        handleFlightSelect(flight);
                    }
                } catch (error) {
                    console.error('Error restoring flight:', error);
                }
            };
            restoreFlight();
        }
    }, []);

    // Save selected flight ID to sessionStorage when it changes
    useEffect(() => {
        if (selectedFlight?.id) {
            sessionStorage.setItem('lastSelectedFlightId', selectedFlight.id);
        } else {
            sessionStorage.removeItem('lastSelectedFlightId');
        }
    }, [selectedFlight?.id]);

    // Load airports on component mount
    useEffect(() => {
        setAirports(airportDatabase);
        setFilteredAirports(airportDatabase);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) {
            setFilteredAirports(airports);
            setFilteredFlights([]);
            setSelectedPosition(null);
            setSelectedFlight(null);
            setSelectedFromAirport(null);
            setSelectedToAirport(null);
            setMapCenter([40.7128, -74.0060]);
            setMapZoom(4);
            return;
        }

        setLoading(true);
        setSelectedFlight(null);
        setSelectedFromAirport(null);
        setSelectedToAirport(null);

        const query = searchQuery.toLowerCase();

        if (searchType === 'flight') {
            // FLIGHT SEARCH - Only search for flights
            try {
                const flightResults = await flightService.searchFlights(query);
                setFilteredFlights(flightResults);
                setFilteredAirports([]); // Clear airports when searching flights

                // If we find exactly one flight, select it automatically
                if (flightResults.length === 1) {
                    handleFlightSelect(flightResults[0]);
                }
            } catch (error) {
                console.error('Error searching flights:', error);
            }
        } else {
            // AIRPORT/CITY/COUNTRY SEARCH - Only search for locations
            const airportResults = searchLocalAirports(query);
            setFilteredAirports(airportResults);
            setFilteredFlights([]); // Clear flights when searching locations

            if (airportResults.length > 0) {
                setSelectedPosition([airportResults[0].lat, airportResults[0].lng]);
                setMapCenter([airportResults[0].lat, airportResults[0].lng]);
                setMapZoom(8);
            }
        }

        setLoading(false);
    };

    // const handleFlightSelect = async (flight) => {
    //     setLoading(true);

    //     try {
    //         // Fetch the complete flight data including simulation fields
    //         const completeFlight = await flightService.getFlightById(flight.id);

    //         console.log('Complete flight data with simulation:', completeFlight);

    //         // Transform the flight data
    //         const transformedFlight = {
    //             id: completeFlight.id,
    //             airline: completeFlight.airline,
    //             flightNumber: completeFlight.flight_number,
    //             from: {
    //                 code: completeFlight.from_code,
    //                 airport: completeFlight.from_airport,
    //                 city: completeFlight.from_city,
    //                 terminal: completeFlight.from_terminal
    //             },
    //             to: {
    //                 code: completeFlight.to_code,
    //                 airport: completeFlight.to_airport,
    //                 city: completeFlight.to_city,
    //                 terminal: completeFlight.to_terminal
    //             },
    //             departureTime: completeFlight.departure_time,
    //             arrivalTime: completeFlight.arrival_time,
    //             date: completeFlight.date,
    //             duration: completeFlight.duration,
    //             aircraft: completeFlight.aircraft,
    //             cabinClass: completeFlight.cabin_class,
    //             stops: completeFlight.stops,
    //             stopInfo: completeFlight.stop_info,
    //             current_lat: completeFlight.current_lat,
    //             current_lng: completeFlight.current_lng,
    //             current_progress: completeFlight.current_progress,
    //             simulation_active: completeFlight.simulation_active
    //         };

    //         console.log('Setting selected flight with simulation data:', transformedFlight);
    //         setSelectedFlight(transformedFlight);
    //         setCurrentFlightNumber(completeFlight.flight_number);

    //         // Find airport coordinates for the route
    //         const fromAirport = airportDatabase.find(a => a.code === completeFlight.from_code);
    //         const toAirport = airportDatabase.find(a => a.code === completeFlight.to_code);

    //         setSelectedFromAirport(fromAirport);
    //         setSelectedToAirport(toAirport);

    //         // Center map on current position if simulation is active
    //         if (completeFlight.simulation_active && completeFlight.current_lat && completeFlight.current_lng) {
    //             setMapCenter([completeFlight.current_lat, completeFlight.current_lng]);
    //             setMapZoom(8);
    //             setSelectedPosition([completeFlight.current_lat, completeFlight.current_lng]);
    //         }
    //         // Otherwise center on route midpoint
    //         else if (fromAirport && toAirport) {
    //             const midLat = (fromAirport.lat + toAirport.lat) / 2;
    //             const midLng = (fromAirport.lng + toAirport.lng) / 2;
    //             setMapCenter([midLat, midLng]);

    //             const latDiff = Math.abs(fromAirport.lat - toAirport.lat);
    //             const lngDiff = Math.abs(fromAirport.lng - toAirport.lng);
    //             const maxDiff = Math.max(latDiff, lngDiff);

    //             if (maxDiff > 50) setMapZoom(4);
    //             else if (maxDiff > 20) setMapZoom(5);
    //             else if (maxDiff > 10) setMapZoom(6);
    //             else setMapZoom(7);
    //         }
    //     } catch (error) {
    //         console.error('Error loading flight details:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSelectFlightFromHistory = async (flight) => {
        setLoading(true);

        try {
            // Fetch the complete flight data including simulation fields
            const completeFlight = await flightService.getFlightById(flight.id);

            console.log('History selection - Complete flight data:', completeFlight);

            // Transform the flight data
            const transformedFlight = {
                id: completeFlight.id,
                airline: completeFlight.airline,
                flightNumber: completeFlight.flight_number,
                from: {
                    code: completeFlight.from_code,
                    airport: completeFlight.from_airport,
                    city: completeFlight.from_city,
                    terminal: completeFlight.from_terminal
                },
                to: {
                    code: completeFlight.to_code,
                    airport: completeFlight.to_airport,
                    city: completeFlight.to_city,
                    terminal: completeFlight.to_terminal
                },
                departureTime: completeFlight.departure_time,
                arrivalTime: completeFlight.arrival_time,
                date: completeFlight.date,
                duration: completeFlight.duration,
                aircraft: completeFlight.aircraft,
                cabinClass: completeFlight.cabin_class,
                stops: completeFlight.stops,
                stopInfo: completeFlight.stop_info,
                current_lat: completeFlight.current_lat,
                current_lng: completeFlight.current_lng,
                current_progress: completeFlight.current_progress,
                simulation_active: completeFlight.simulation_active
            };

            console.log('Setting selected flight from history:', transformedFlight);
            setSelectedFlight(transformedFlight);
            setCurrentFlightNumber(completeFlight.flight_number);

            // Find airport coordinates
            const fromAirport = airportDatabase.find(a => a.code === completeFlight.from_code);
            const toAirport = airportDatabase.find(a => a.code === completeFlight.to_code);

            setSelectedFromAirport(fromAirport);
            setSelectedToAirport(toAirport);

            // Center map on current position if simulation is active
            if (completeFlight.simulation_active && completeFlight.current_lat && completeFlight.current_lng) {
                setMapCenter([completeFlight.current_lat, completeFlight.current_lng]);
                setMapZoom(8);
                setSelectedPosition([completeFlight.current_lat, completeFlight.current_lng]);
            } else if (fromAirport && toAirport) {
                const midLat = (fromAirport.lat + toAirport.lat) / 2;
                const midLng = (fromAirport.lng + toAirport.lng) / 2;
                setMapCenter([midLat, midLng]);
                setMapZoom(6);
            }
        } catch (error) {
            console.error('Error loading flight from history:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleTrackOnMap = () => {
        if (selectedFromAirport) {
            setMapCenter([selectedFromAirport.lat, selectedFromAirport.lng]);
            setMapZoom(12);
            setSelectedPosition([selectedFromAirport.lat, selectedFromAirport.lng]);
        }
    };

    const handleCloseFlightDetails = () => {
        setSelectedFlight(null);
        setSelectedFromAirport(null);
        setSelectedToAirport(null);
        setCurrentFlightNumber('');
    };

    // Count airports by country
    const getCountryCounts = () => {
        const counts = {};
        filteredAirports.forEach(airport => {
            counts[airport.country] = (counts[airport.country] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 mt-20">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Flight Tracker</h1>
                        <p className="text-gray-600">Track flights across airports worldwide</p>
                    </div>
                </div>

                {/* Search Bar - Simplified */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            {/* Search Type Toggle - Simplified to two options */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setSearchType('flight')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${searchType === 'flight'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Plane className="w-4 h-4 inline mr-1" />
                                    Flights
                                </button>
                                <button
                                    onClick={() => setSearchType('airport')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${searchType === 'airport'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Airports
                                </button>
                            </div>

                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder={searchType === 'flight'
                                        ? "Search by flight number or airline..."
                                        : "Search by city, airport code, or country..."}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAirports(!showAirports)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center ${showAirports ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            <MapPin className="w-4 h-4" />
                            {showAirports ? 'Hide' : 'Show'} Airports
                        </button>
                    </div>
                </div>

                {/* Results Bar - Only show when there are results */}
                {!selectedFlight && (
                    <>
                        {searchType === 'flight' && filteredFlights.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-6 text-sm text-blue-800">
                                Found {filteredFlights.length} flight{filteredFlights.length > 1 ? 's' : ''}
                                {filteredFlights.length > 1 && ' - Click on a flight to view details'}
                            </div>
                        )}

                        {searchType === 'airport' && filteredAirports.length > 0 && (
                            <div className="bg-green-50 rounded-lg p-3 mb-6 text-sm text-green-800">
                                Found {filteredAirports.length} airport{filteredAirports.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </>
                )}

                {/* Multiple Flight Selection (when more than one flight found) */}
                {searchType === 'flight' && filteredFlights.length > 1 && !selectedFlight && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Plane className="w-4 h-4" />
                            Select a flight to track
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredFlights.slice(0, 6).map((flight) => (
                                <button
                                    key={flight.id}
                                    onClick={() => handleFlightSelect(flight)}
                                    className="p-3 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                                >
                                    <div className="font-semibold text-blue-600">{flight.flight_number}</div>
                                    <div className="text-sm text-gray-600">{flight.airline}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {flight.from_code} → {flight.to_code}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(flight.date).toLocaleDateString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Flight Details Panel */}
                {selectedFlight && (
                    <>
                        <FlightDetailsPanel
                            flight={selectedFlight}
                            onClose={handleCloseFlightDetails}
                            onTrackOnMap={handleTrackOnMap}
                        />

                        {/* Flight History Section */}
                        <FlightHistory
                            flightNumber={currentFlightNumber}
                            onSelectFlight={handleSelectFlightFromHistory}
                        />
                    </>
                )}

                {/* Map and Airports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel - Airports (show when in airport search mode OR when no flight selected AND airports exist) */}
                    {(searchType === 'airport' || (!selectedFlight && filteredAirports.length > 0)) && (
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-4 h-[500px] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    Airports
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {filteredAirports.length} found
                                </span>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredAirports.map((airport, idx) => (
                                        <div
                                            key={`airport-${idx}`}
                                            onClick={() => {
                                                setSelectedPosition([airport.lat, airport.lng]);
                                                setMapCenter([airport.lat, airport.lng]);
                                                setMapZoom(12);
                                            }}
                                            className="p-2 border rounded-lg hover:bg-blue-50 cursor-pointer transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm truncate">{airport.code} - {airport.city}</p>
                                                    <p className="text-xs text-gray-600 truncate">{airport.name}</p>
                                                    <p className="text-xs text-gray-400">{airport.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {filteredAirports.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                            <p>No airports found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Map Container - Always takes remaining space */}
                    <div className={`
        ${(searchType === 'airport' || (!selectedFlight && filteredAirports.length > 0))
                            ? 'lg:col-span-3'
                            : 'lg:col-span-4'
                        }
    `}>
                        <div className="bg-white rounded-xl shadow-md p-4 h-[500px]">
                            <MapContainer
                                key={`map-${selectedFlight?.id || 'default'}`}
                                center={mapCenter}
                                zoom={mapZoom}
                                style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                                className="z-0"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                <FlyToLocation position={selectedPosition} />

                                {/* Airports */}
                                {showAirports && filteredAirports.map((airport, idx) => (
                                    <Marker
                                        key={`airport-marker-${idx}`}
                                        position={[airport.lat, airport.lng]}
                                        icon={airportIcon}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold">{airport.code}</h3>
                                                <p className="text-sm">{airport.name}</p>
                                                <p className="text-xs text-gray-600">{airport.city}, {airport.country}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}

                                {/* Flight Route Line */}
                                {selectedFlight && selectedFromAirport && selectedToAirport && (
                                    <FlightRouteLine
                                        fromAirport={selectedFromAirport}
                                        toAirport={selectedToAirport}
                                        flight={selectedFlight}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                </div>


            </div>

            {/* Animation styles */}
            <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}