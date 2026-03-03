import React, { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import PassengerSelector from './PassengerSelector';

const SearchBar = ({ onSearch }) => {
  const [tripType, setTripType] = useState('roundTrip');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerText, setPassengerText] = useState('1 Passenger, Economy');

  const handleSearch = () => {
    if (fromLocation && toLocation && departDate) {
      const searchData = {
        from: fromLocation.code,
        fromCity: fromLocation.city,
        fromDisplay: fromLocation.displayName,
        to: toLocation.code,
        toCity: toLocation.city,
        toDisplay: toLocation.displayName,
        departDate,
        tripType,
        passengers: passengerText
      };
      if (tripType === 'roundTrip') searchData.returnDate = returnDate;
      onSearch(searchData);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-6 md:p-10 relative">
      
      {/* 1. Trip Type Toggle */}
      <div className="flex gap-1 mb-8 bg-gray-100/80 p-1.5 rounded-2xl w-fit border border-gray-200/50">
        {['oneWay', 'roundTrip', 'multiCity'].map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              tripType === type
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {type.replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {/* 2. Main Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <LocationAutocomplete
          label="Origin"
          value={fromLocation?.displayName || ''}
          onSelect={setFromLocation}
          placeholder="Where from?"
        />
        <LocationAutocomplete
          label="Destination"
          value={toLocation?.displayName || ''}
          onSelect={setToLocation}
          placeholder="Where to?"
        />
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Departure</label>
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-800 [color-scheme:light]"
          />
        </div>
        {tripType === 'roundTrip' ? (
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Return</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-800 [color-scheme:light]"
            />
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Passengers</label>
            <PassengerSelector value={passengerText} onChange={setPassengerText} />
          </div>
        )}
      </div>

      {/* 3. Bottom Actions - The Button on the "Line" */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {tripType === 'roundTrip' && (
          <div className="w-full lg:w-1/3">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Passengers</label>
            <PassengerSelector value={passengerText} onChange={setPassengerText} />
          </div>
        )}
        
        <button
          onClick={handleSearch}
          disabled={!fromLocation || !toLocation || !departDate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm tracking-[0.2em] shadow-xl shadow-blue-500/40 active:scale-95 disabled:opacity-50 uppercase"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default SearchBar;