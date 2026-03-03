import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Minus, ChevronDown } from 'lucide-react';

const PassengerSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [cabinClass, setCabinClass] = useState('Economy');
  const wrapperRef = useRef(null);

  // Parse initial value if provided
  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+)\s+Passenger.*?,\s*(.+)/);
      if (match) {
        const total = parseInt(match[1]);
        const cabin = match[2];
        // We'll assume adults = total for simplicity
        setPassengers({ adults: total, children: 0, infants: 0 });
        setCabinClass(cabin);
      }
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePassengers = (type, increment) => {
    setPassengers(prev => {
      const newValue = prev[type] + increment;
      if (newValue < 0) return prev;
      if (type === 'adults' && newValue === 0) return prev;
      
      const updated = { ...prev, [type]: newValue };
      
      const total = updated.adults + updated.children + updated.infants;
      const text = `${total} ${total === 1 ? 'Passenger' : 'Passengers'}, ${cabinClass}`;
      onChange(text);
      
      return updated;
    });
  };

  const selectCabinClass = (cabin) => {
    setCabinClass(cabin);
    const total = passengers.adults + passengers.children + passengers.infants;
    const text = `${total} ${total === 1 ? 'Passenger' : 'Passengers'}, ${cabin}`;
    onChange(text);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const displayText = `${totalPassengers} ${totalPassengers === 1 ? 'Passenger' : 'Passengers'}, ${cabinClass}`;

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Selector Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors bg-white"
      >
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          <span className="text-gray-800">{displayText}</span>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Modal - with higher z-index and positioned to appear above */}
      {isOpen && (
        <>
          {/* Backdrop to handle clicks outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown positioned absolutely with high z-index */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4">
            {/* Adults */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-semibold text-gray-800">Adults</div>
                <div className="text-sm text-gray-500">Age 12+</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updatePassengers('adults', -1)}
                  disabled={passengers.adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{passengers.adults}</span>
                <button
                  onClick={() => updatePassengers('adults', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-semibold text-gray-800">Children</div>
                <div className="text-sm text-gray-500">Ages 2-11</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updatePassengers('children', -1)}
                  disabled={passengers.children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{passengers.children}</span>
                <button
                  onClick={() => updatePassengers('children', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-semibold text-gray-800">Infants</div>
                <div className="text-sm text-gray-500">Under 2</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updatePassengers('infants', -1)}
                  disabled={passengers.infants <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{passengers.infants}</span>
                <button
                  onClick={() => updatePassengers('infants', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Cabin Class */}
            <div className="py-3">
              <div className="font-semibold text-gray-800 mb-2">Cabin Class</div>
              <div className="grid grid-cols-2 gap-2">
                {['Economy', 'Premium Economy', 'Business', 'First'].map((cabin) => (
                  <button
                    key={cabin}
                    onClick={() => selectCabinClass(cabin)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      cabinClass === cabin
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PassengerSelector;