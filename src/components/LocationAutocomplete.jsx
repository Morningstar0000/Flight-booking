import React, { useState, useEffect, useRef } from 'react';
import { searchLocationsHybrid as searchLocations } from '../services/hybridLocationService';

const LocationAutocomplete = ({ 
  value, 
  onSelect, 
  placeholder, 
  label,
  excludeCode = null,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        const results = await searchLocations(searchTerm);
        const filtered = excludeCode 
          ? results.filter(r => r.code !== excludeCode)
          : results;
        setSuggestions(filtered);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, excludeCode]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const cleanSearchTerm = newValue.split(' ')[0].replace(/[()-,]/g, '');
    setSearchTerm(cleanSearchTerm);
    if (newValue === '') onSelect(null);
  };

  const handleSelect = (suggestion) => {
    const displayString = `${suggestion.city} (${suggestion.code})`;
    setInputValue(displayString);
    onSelect({
      code: suggestion.code,
      name: suggestion.name,
      city: suggestion.city,
      country: suggestion.country,
      displayName: displayString
    });
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
        />
        
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500/20 border-t-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown suggestions - Wider Width Applied */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] w-full md:w-[150%] lg:w-[180%] max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-sm font-medium text-gray-400">
              Searching locations...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.code}-${index}`}
                  onClick={() => handleSelect(suggestion)}
                  className="px-5 py-4 cursor-pointer border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-4">
                    {/* MapPin Icon */}
                    <div className="mt-1 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>

                    {/* Full Name Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-gray-900 text-base">
                          {suggestion.city}, {suggestion.country}
                        </span>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {suggestion.code}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-normal leading-tight">
                        {suggestion.name}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                        {suggestion.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-gray-400 text-sm font-medium">
              No matching locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;