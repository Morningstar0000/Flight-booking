import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Play, 
  Pause, 
  RotateCcw,
  MapPin,
  Navigation,
  Settings,
  X
} from 'lucide-react';
import { flightService } from '../services/flightService';
import { airportDatabase } from '../services/airports';

const FlightSimulator = ({ flight, onClose, onUpdate }) => {
  const [progress, setProgress] = useState(flight.current_progress || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get airport coordinates from database
  useEffect(() => {
    const loadRoute = async () => {
      const fromAirport = airportDatabase.find(a => a.code === flight.from_code);
      const toAirport = airportDatabase.find(a => a.code === flight.to_code);
      
      if (fromAirport && toAirport) {
        const path = flightService.generateRoutePath(
          fromAirport.lat, fromAirport.lng,
          toAirport.lat, toAirport.lng
        );
        setRoutePath(path);
      }
      setLoading(false);
    };
    
    loadRoute();
  }, [flight]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + speed, 100);
          if (newProgress >= 100) {
            setIsPlaying(false);
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!loading) {
      updatePosition(progress);
    }
  }, [progress, loading]);

  const updatePosition = async (newProgress) => {
    const fromAirport = airportDatabase.find(a => a.code === flight.from_code);
    const toAirport = airportDatabase.find(a => a.code === flight.to_code);
    
    if (!fromAirport || !toAirport) return;
    
    const pos = flightService.calculatePosition(
      fromAirport.lat, fromAirport.lng,
      toAirport.lat, toAirport.lng,
      newProgress
    );
    setCurrentPosition(pos);
    
    try {
      const updatedFlight = await flightService.updateFlightProgress(
        flight.id, 
        newProgress, 
        pos.lat, 
        pos.lng
      );
      
      onUpdate?.(updatedFlight);
    } catch (error) {
      console.error('Error updating flight progress:', error);
    }
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setProgress(val);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading route data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Flight Simulator</h2>
                  <p className="text-purple-100 text-sm">
                    {flight.airline} {flight.flight_number}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{flight.from_code}</div>
                <div className="text-sm text-gray-500">{flight.from_airport}</div>
              </div>
              
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="h-0.5 bg-gray-200 w-full"></div>
                  <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-purple-600" />
                </div>
                <div className="text-center text-sm text-gray-500 mt-1">
                  {flight.duration}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{flight.to_code}</div>
                <div className="text-sm text-gray-500">{flight.to_airport}</div>
              </div>
            </div>
          </div>

          {/* Progress Control */}
          <div className="p-6 space-y-6">
            {/* Progress Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Flight Progress: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              
              {/* Progress Markers */}
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Departure</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>Arrival</span>
              </div>
            </div>

            {/* Current Position */}
            {currentPosition && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Current Position
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Latitude:</span>
                    <span className="ml-2 font-mono">{currentPosition.lat.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitude:</span>
                    <span className="ml-2 font-mono">{currentPosition.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition ${
                  isPlaying 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>

              <div className="flex gap-2">
                {[1, 2, 5, 10].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      speed === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Route Path Preview */}
            {routePath.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Route Path ({routePath.length} points)
                </h3>
                <div className="h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end">
                    {routePath.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full flex items-end"
                      >
                        <div 
                          className="w-full bg-purple-500 transition-all duration-300"
                          style={{ 
                            height: `${(point.progress <= progress ? 100 : 20)}%`,
                            opacity: point.progress <= progress ? 1 : 0.3
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Status */}
            <p className="text-xs text-gray-400 text-center">
              Real-time updates enabled - changes appear instantly on the map
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSimulator;