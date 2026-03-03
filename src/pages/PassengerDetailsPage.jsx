import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { airlineLogos } from '../utils/airlineLogos'
import { Plane, Hotel, Calendar, Users, ArrowLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

export default function PassengerDetailsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, hotel, isPackage, totalPrice, searchParams, hotelPackage } = location.state || {}

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: ''
  })

  const [createAccount, setCreateAccount] = useState(false)

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No booking information found.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:text-blue-800">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Navigate to payment page with all booking data
    navigate('/payment', {
      state: {
        flight,
        hotel,
        isPackage,
        totalPrice,
        passengerDetails: formData,
        searchParams,
        hotelPackage
      }
    })
  }

  const getAirlineLogo = (airlineName) => {
    // Directly return from the airlineLogos mapping
    return airlineLogos[airlineName];
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Summary</span>
        </button>

        <h1 className="text-3xl font-bold mb-8">Passenger Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="As shown on passport"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Tickets will be sent here
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="AB123456"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Create an account to save my details</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Your Booking
              </h2>
              
              {/* Flight Summary */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Flight</h3>
                </div>
                <div className="flex items-start gap-3">
                  {/* Airline Logo */}
                  <div className="flex-shrink-0">
                    {getAirlineLogo(flight.airline) ? (
                      <img 
                        src={getAirlineLogo(flight.airline)}
                        alt={flight.airline}
                        className="w-10 h-10 object-contain rounded-lg border border-gray-200 p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span class="text-white font-bold text-sm">${flight.airline?.substring(0, 2).toUpperCase()}</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {flight.airline?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Flight Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{flight.airline}</p>
                    <p className="text-xs text-gray-500 mb-1">{flight.flightNumber}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">{flight.from.code}</span>
                      <Plane className="w-3 h-3 text-gray-400 rotate-90" />
                      <span className="font-medium">{flight.to.code}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {flight.departureTime} - {flight.arrivalTime}
                    </p>
                    {flight.duration && (
                      <p className="text-xs text-gray-400 mt-1">{flight.duration}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hotel Summary (if package) */}
              {isPackage && hotel && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Hotel className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Hotel</h3>
                  </div>
                  <div className="flex gap-3">
                    {/* Hotel Image Placeholder */}
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hotel className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{hotel.hotel?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(hotelPackage?.checkIn)} - {formatDate(hotelPackage?.checkOut)}</span>
                      </div>
                      {hotelPackage?.guests && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Users className="w-3 h-3" />
                          <span>{hotelPackage.guests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Plane className="w-3 h-3 text-blue-600" />
                    Flight
                  </span>
                  <span className="font-medium">${flight.price}</span>
                </div>
                {isPackage && hotel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Hotel className="w-3 h-3 text-purple-600" />
                      Hotel
                    </span>
                    <span className="font-medium">${hotelPackage?.hotelPrice}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600 text-lg">
                      ${isPackage ? totalPrice : flight.price}
                    </span>
                  </div>
                  {isPackage && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Package savings included
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}