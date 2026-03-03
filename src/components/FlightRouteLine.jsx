import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function FlightRouteLine({ fromAirport, toAirport, flight }) {
  const map = useMap();
  
  useEffect(() => {
    if (!fromAirport || !toAirport || !map) return;
    
    console.log('FlightRouteLine - Received flight data:', flight);
    console.log('Current position:', flight?.current_lat, flight?.current_lng);
    console.log('Simulation active:', flight?.simulation_active);
    
    // Calculate bearing (direction) from origin to destination
    const calculateBearing = (lat1, lng1, lat2, lng2) => {
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;
      
      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) -
                Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      const θ = Math.atan2(y, x);
      
      return (θ * 180 / Math.PI + 360) % 360;
    };
    
    // Helper function to create plane icon with specific bearing and color
    const createPlaneIcon = (bearing) => {
      // Determine plane color based on status
      let planeColor = 'text-black'; // Default black
      
      if (flight?.current_progress >= 100) {
        planeColor = 'text-green-600'; // Arrived - Green
      } else if (flight?.simulation_active) {
        planeColor = 'text-blue-600'; // In flight - Blue
      }
      
      return L.divIcon({
        html: `<div class="relative" style="transform: rotate(${bearing}deg);">
                 <svg class="w-10 h-10 ${planeColor} drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                 </svg>
                 <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-50"></div>
               </div>`,
        className: 'directional-plane',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });
    };
    
    // Create airport marker for arrival (destination)
    const destIcon = L.divIcon({
      html: `<div class="relative">
               <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                 <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                 </svg>
               </div>
             </div>`,
      className: 'destination-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    
    // Clear any existing custom markers/lines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        if (layer.options && (layer.options.className === 'route-marker' || layer.options.className === 'route-line' || layer.options.className === 'progress-line')) {
          map.removeLayer(layer);
        }
      }
    });
    
    // Check if flight has a simulated current position
    const hasValidPosition = flight?.current_lat && flight?.current_lng;
    const shouldUseSimulated = flight?.simulation_active || hasValidPosition;
    const hasArrived = flight?.current_progress >= 100; // Define hasArrived here
    
    if (shouldUseSimulated && hasValidPosition) {
      console.log('Using simulated position:', flight.current_lat, flight.current_lng);
      console.log('Has arrived:', hasArrived);
      
      // Use the simulated position for the plane
      const planePosition = [flight.current_lat, flight.current_lng];
      
      // Calculate bearing from current position to destination
      const bearingToDest = calculateBearing(
        flight.current_lat, flight.current_lng,
        toAirport.lat, toAirport.lng
      );
      
      // Create plane icon with appropriate color
      const planeIcon = createPlaneIcon(bearingToDest);
      
      // Add plane marker at simulated position
      L.marker(planePosition, { 
        icon: planeIcon,
        className: 'route-marker',
        zIndexOffset: 1000
      }).addTo(map);
      
      // Add destination marker
      L.marker([toAirport.lat, toAirport.lng], { 
        icon: destIcon,
        className: 'route-marker'
      }).addTo(map);
      
      // Draw the full route line from origin to destination
      const routeLine = L.polyline(
        [[fromAirport.lat, fromAirport.lng], [toAirport.lat, toAirport.lng]],
        { 
          color: '#fbbf24', 
          weight: 3, 
          opacity: 0.7, 
          dashArray: '6, 8',
          className: 'route-line',
          lineCap: 'round'
        }
      ).addTo(map);
      
      // Draw a progress line from origin to current position (only if not arrived)
      if (!hasArrived) {
        const progressLine = L.polyline(
          [[fromAirport.lat, fromAirport.lng], [flight.current_lat, flight.current_lng]],
          { 
            color: '#10b981',
            weight: 4, 
            opacity: 0.9, 
            className: 'progress-line',
            lineCap: 'round'
          }
        ).addTo(map);
      }
      
      console.log('Added plane at:', planePosition);
      
      // Add pulsing effect to the main route line
      let opacity = 0.7;
      const interval = setInterval(() => {
        opacity = opacity === 0.7 ? 0.3 : 0.7;
        routeLine.setStyle({ opacity });
      }, 800);
      
      // Cleanup function
      return () => {
        clearInterval(interval);
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            if (layer.options && (layer.options.className === 'route-marker' || layer.options.className === 'route-line' || layer.options.className === 'progress-line')) {
              map.removeLayer(layer);
            }
          }
        });
      };
      
    } else {
      console.log('No simulation active, using origin position');
      
      // No simulation - use origin position as before
      const bearing = calculateBearing(
        fromAirport.lat, fromAirport.lng,
        toAirport.lat, toAirport.lng
      );
      
      const planeIcon = createPlaneIcon(bearing);
      
      // Add plane icon at origin
      L.marker([fromAirport.lat, fromAirport.lng], { 
        icon: planeIcon,
        className: 'route-marker',
        zIndexOffset: 1000
      }).addTo(map);
      
      // Add destination marker
      L.marker([toAirport.lat, toAirport.lng], { 
        icon: destIcon,
        className: 'route-marker'
      }).addTo(map);
      
      // Draw the route line
      const routeLine = L.polyline(
        [[fromAirport.lat, fromAirport.lng], [toAirport.lat, toAirport.lng]],
        { 
          color: '#fbbf24', 
          weight: 3, 
          opacity: 0.7, 
          dashArray: '6, 8',
          className: 'route-line',
          lineCap: 'round'
        }
      ).addTo(map);
      
      // Add pulsing effect to the line
      let opacity = 0.7;
      const interval = setInterval(() => {
        opacity = opacity === 0.7 ? 0.3 : 0.7;
        routeLine.setStyle({ opacity });
      }, 800);
      
      // Cleanup function
      return () => {
        clearInterval(interval);
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            if (layer.options && (layer.options.className === 'route-marker' || layer.options.className === 'route-line')) {
              map.removeLayer(layer);
            }
          }
        });
      };
    }
  }, [map, fromAirport, toAirport, flight?.current_lat, flight?.current_lng, flight?.simulation_active, flight?.current_progress]);
  
  return null;
}