// src/components/AirlineLogo.jsx
import { useState } from 'react';
import { airlineLogos } from '../utils/airlineLogos';

const AirlineLogo = ({ airline, airlineCode }) => {
  const [imgError, setImgError] = useState(false);
  
  // Get the logo for this airline
  const logoSrc = airlineLogos[airline];
  
  // If no logo found or image failed to load, show colored circle with code
  if (!logoSrc || imgError) {
    // Generate a consistent color based on airline name
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 
      'bg-red-600', 'bg-yellow-600', 'bg-pink-600', 
      'bg-indigo-600', 'bg-teal-600'
    ];
    
    // Create a hash from airline name for consistent color
    const hash = airline.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white text-sm font-bold`}>
        {airlineCode || airline.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img 
      src={logoSrc}
      alt={airline}
      className="w-10 h-10 object-contain"
      onError={() => setImgError(true)}
    />
  );
};

export default AirlineLogo;