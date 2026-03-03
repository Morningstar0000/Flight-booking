import React from 'react';
import { airlineLogos } from '../utils/airlineLogos';

const Partners = () => {
  // Select which logos to display on the homepage
  const displayLogos = [
    'Emirates',
    'Delta Airlines',
    'British Airways',
    'Lufthansa',
    'Singapore Airlines',
    'Qatar Airways',
    'Japan Airlines',
    'Air France'
  ];

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12">
          Trusted by World-Class Airlines
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {displayLogos.map((name) => (
            airlineLogos[name] && (
              <div 
                key={name}
                className="w-full max-w-[160px] h-20 flex items-center justify-center group"
              >
                <img 
                  src={airlineLogos[name]} 
                  alt={name} 
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;