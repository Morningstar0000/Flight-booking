import React, { useState, useEffect } from 'react';
import {
    Plane,
    Calendar,
    Clock,
    MapPin,
    ChevronDown,
    ChevronUp,
    History,
    ArrowRight
} from 'lucide-react';
import { flightService } from '../services/flightService';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

const FlightHistory = ({ flightNumber, onSelectFlight }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPast, setShowPast] = useState(true);
    const [showUpcoming, setShowUpcoming] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (flightNumber && expanded) {
            loadFlightHistory();
        }
    }, [flightNumber, expanded]);

    const loadFlightHistory = async () => {
        setLoading(true);
        try {
            // Use the new getFlightsByNumber method
            const allFlights = await flightService.getFlightsByNumber(flightNumber);

            // Sort by date
            const sorted = allFlights.sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

            setFlights(sorted);
        } catch (error) {
            console.error('Error loading flight history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlightFromHistory = (flight) => {
        // Transform the flight data
        const transformedFlight = {
            id: flight.id,
            airline: flight.airline,
            flightNumber: flight.flight_number,
            from: {
                code: flight.from_code,
                airport: flight.from_airport,
                city: flight.from_city,
                terminal: flight.from_terminal
            },
            to: {
                code: flight.to_code,
                airport: flight.to_airport,
                city: flight.to_city,
                terminal: flight.to_terminal
            },
            departureTime: flight.departure_time,
            arrivalTime: flight.arrival_time,
            date: flight.date,
            duration: flight.duration,
            aircraft: flight.aircraft,
            cabinClass: flight.cabin_class,
            stops: flight.stops,
            stopInfo: flight.stop_info
        };

        setSelectedFlight(transformedFlight);
        setCurrentFlightNumber(flight.flight_number);

        // Find airport coordinates
        const fromAirport = airportDatabase.find(a => a.code === flight.from_code);
        const toAirport = airportDatabase.find(a => a.code === flight.to_code);

        setSelectedFromAirport(fromAirport);
        setSelectedToAirport(toAirport);

        if (fromAirport && toAirport) {
            const midLat = (fromAirport.lat + toAirport.lat) / 2;
            const midLng = (fromAirport.lng + toAirport.lng) / 2;
            setMapCenter([midLat, midLng]);
            setMapZoom(6);
        }
    };

    // Separate flights into upcoming and past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current date and time for accurate comparison
const now = new Date();

// Separate flights into upcoming and past based on actual departure time
const upcomingFlights = flights
  .filter(flight => {
    const flightDate = new Date(flight.date);
    const [hours, minutes] = flight.departure_time.split(':').map(Number);
    flightDate.setHours(hours, minutes, 0);
    
    // Flight is upcoming if departure time is in the future
    return flightDate > now;
  })
  .sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

const pastFlights = flights
  .filter(flight => {
    const flightDate = new Date(flight.date);
    const [hours, minutes] = flight.departure_time.split(':').map(Number);
    flightDate.setHours(hours, minutes, 0);
    
    // Flight is past if departure time is in the past
    return flightDate <= now;
  })
  .sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Most recent first
  });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: format(date, 'EEEE'),
            date: format(date, 'dd-MMM-yyyy').toUpperCase(),
            full: format(date, 'EEEE, MMM dd, yyyy')
        };
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return format(date, 'hh:mm a');
    };

    const getStatusBadge = (flight) => {
        const flightDate = new Date(flight.date);
        flightDate.setHours(0, 0, 0, 0);

        if (flightDate < today) {
            return {
                text: 'LANDED',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
            };
        } else if (flightDate > today) {
            return {
                text: 'SCHEDULED',
                color: 'text-amber-600',
                bgColor: 'bg-amber-100'
            };
        } else {
            // Today's flight
            const now = new Date();
            const [hours, minutes] = flight.departure_time.split(':').map(Number);
            const departureTime = new Date(flight.date);
            departureTime.setHours(hours, minutes, 0);

            if (now > departureTime) {
                return {
                    text: 'DEPARTED',
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100'
                };
            } else {
                return {
                    text: 'TODAY',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100'
                };
            }
        }
    };

    const FlightRow = ({ flight }) => {
        const date = formatDate(flight.date);
        const status = getStatusBadge(flight);

        return (
            <tr
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectFlight(flight)}
            >
                <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{date.day}</div>
                    <div className="text-sm text-gray-500">{date.date}</div>
                </td>
                <td className="px-4 py-3">
                    <div className="font-medium">{formatTime(flight.departure_time)}</div>
                    <div className="text-sm text-gray-500">
                        {flight.from_airport} - {flight.from_code}
                    </div>
                </td>
                <td className="px-4 py-3">
                    <div className="font-medium">{formatTime(flight.arrival_time)}</div>
                    <div className="text-sm text-gray-500">
                        {flight.to_airport} - {flight.to_code}
                    </div>
                </td>
                <td className="px-4 py-3">
                    <div className="font-medium">{flight.aircraft || '--'}</div>
                </td>
                <td className="px-4 py-3">
                    <div className="font-medium">{flight.duration}</div>
                </td>
                <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                        {status.text}
                    </span>
                </td>
            </tr>
        );
    };

    if (!expanded) {
        return (
            <button
                onClick={() => setExpanded(true)}
                className="w-full mt-4 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2 transition-colors"
            >
                <History className="w-4 h-4" />
                Show flight history for {flightNumber}
                <ChevronDown className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">
                            Flight History: {flightNumber}
                        </h3>
                    </div>
                    <button
                        onClick={() => setExpanded(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <ChevronUp className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="p-6 space-y-6">
                    {/* Upcoming Flights */}
                    {upcomingFlights.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowUpcoming(!showUpcoming)}
                                className="flex items-center gap-2 text-gray-700 font-semibold mb-3 hover:text-blue-600 transition-colors"
                            >
                                {showUpcoming ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                Upcoming Flights ({upcomingFlights.length})
                            </button>

                            {showUpcoming && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-y border-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Arrival</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {upcomingFlights.map((flight) => (
                                                <FlightRow key={flight.id} flight={flight} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Past Flights */}
                    {pastFlights.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowPast(!showPast)}
                                className="flex items-center gap-2 text-gray-700 font-semibold mb-3 hover:text-blue-600 transition-colors"
                            >
                                {showPast ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                Past Flights ({pastFlights.length})
                            </button>

                            {showPast && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-y border-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Arrival</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pastFlights.map((flight) => (
                                                <FlightRow key={flight.id} flight={flight} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {flights.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No flight history found for {flightNumber}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
                        <p className="text-gray-500">
                            Showing {flights.length} flights for {flightNumber}
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View full history
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightHistory;