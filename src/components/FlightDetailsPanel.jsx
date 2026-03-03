import React from 'react';
import { Plane, MapPin, Clock, X, Target, Download } from 'lucide-react';
import { airportDatabase } from '../services/airports';
import { airlineLogos } from '../utils/airlineLogos';

export default function FlightDetailsPanel({ flight, onClose, onTrackOnMap }) {
  if (!flight) return null;

  // Find airport details
  const fromAirport = airportDatabase.find(a => a.code === flight.from.code) || flight.from;
  const toAirport = airportDatabase.find(a => a.code === flight.to.code) || flight.to;

  // Get airline logo
  const getAirlineLogo = (airlineName) => {
    return airlineLogos[airlineName];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  // Format time for display
  const formatTimeForDisplay = (timeString) => {
    // Handle time in HH:MM format
    if (timeString && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return timeString;
  };

  // Determine flight status based on date comparison
  const getFlightStatus = () => {
    const today = new Date();
    const flightDate = new Date(flight.date);
    
    // Set time to midnight for date comparison only
    today.setHours(0, 0, 0, 0);
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
      // Today's flight - check time
      const now = new Date();
      const [hours, minutes] = flight.departureTime.split(':').map(Number);
      const departureDateTime = new Date(flight.date);
      departureDateTime.setHours(hours, minutes, 0);
      
      if (now > departureDateTime) {
        return {
          text: 'DEPARTED',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      } else {
        const timeDiff = departureDateTime - now;
        const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          text: `DEPARTS IN ${hoursUntil}h ${minutesUntil}m`,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      }
    }
  };

  // Get time until departure for banner - FIXED VERSION
  const getTimeUntilDeparture = () => {
    const today = new Date();
    const flightDate = new Date(flight.date);
    const [depHours, depMinutes] = flight.departureTime.split(':').map(Number);
    const departureDateTime = new Date(flight.date);
    departureDateTime.setHours(depHours, depMinutes, 0);
    
    const timeDiff = departureDateTime - today;
    
    if (timeDiff < 0) {
      // Flight has already departed or landed
      const flightEndDateTime = new Date(flight.date);
      const [arrHours, arrMinutes] = flight.arrivalTime.split(':').map(Number);
      flightEndDateTime.setHours(arrHours, arrMinutes, 0);
      
      if (today > flightEndDateTime) {
        return 'Flight has landed';
      } else {
        return 'Flight is in the air';
      }
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `Departs in ${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `Departs in ${hours}h ${minutes}m`;
    } else {
      return `Departs in ${minutes}m`;
    }
  };

  const status = getFlightStatus();

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mb-6 animate-slideDown">
      {/* Header with Airline Logo */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Airline Logo */}
          <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
            {getAirlineLogo(flight.airline) ? (
              <img 
                src={getAirlineLogo(flight.airline)}
                alt={flight.airline}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">${flight.airline?.substring(0, 2).toUpperCase()}</span>
                  </div>`;
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {flight.airline?.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5" />
                {flight.airline} {flight.flightNumber}
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                {status.text}
              </span>
            </div>
            <p className="text-blue-100 text-sm">{flight.aircraft || 'Boeing 787-9'}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-800 rounded-lg p-1 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Status Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-800">
              {getTimeUntilDeparture()}
            </p>
            <button className="text-sm text-blue-600 underline">
              Track inbound aircraft
            </button>
          </div>
        </div>
      </div>

      {/* Flight Details Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departure Column */}
          <div className="border-r border-gray-200 pr-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600 transform rotate-45" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{flight.from.code}</h3>
                <p className="text-sm text-gray-600">{fromAirport?.name || flight.from.airport}</p>
                <p className="text-xs text-gray-500">{fromAirport?.city}, {fromAirport?.country}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Departure</span>
                <span className="font-semibold">{formatTimeForDisplay(flight.departureTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold">{formatDate(flight.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terminal</span>
                <span className="font-semibold">{flight.from.terminal || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Arrival Column */}
          <div className="pl-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{flight.to.code}</h3>
                <p className="text-sm text-gray-600">{toAirport?.name || flight.to.airport}</p>
                <p className="text-xs text-gray-500">{toAirport?.city}, {toAirport?.country}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Arrival</span>
                <span className="font-semibold">{formatTimeForDisplay(flight.arrivalTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold">{formatDate(flight.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terminal</span>
                <span className="font-semibold">{flight.to.terminal || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Info Row */}
        <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold">{flight.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Aircraft</p>
            <p className="font-semibold">{flight.aircraft || 'B787-9'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cabin</p>
            <p className="font-semibold">{flight.cabinClass || 'Economy'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className={`font-semibold ${status.color}`}>{status.text}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button 
            onClick={onTrackOnMap}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Track on Map
          </button>
          <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm font-medium flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Share Flight
          </button>
        </div>
      </div>
    </div>
  );
}