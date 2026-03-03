import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { bookingService } from '../services/bookingService';
import {
  Download,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Plane,
  Hotel,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // First try to get from location state
        if (location.state?.bookingRef) {
          const bookingData = await bookingService.getBookingByReference(location.state.bookingRef);
          setBooking(bookingData);
        } else {
          // Fallback to session storage
          const bookingRef = sessionStorage.getItem('bookingReference');
          const bookingData = sessionStorage.getItem('bookingData');

          if (bookingRef && bookingData) {
            setBooking({
              booking_reference: bookingRef,
              ...JSON.parse(bookingData)
            });
          }
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [location.state]);

  const handleDownloadPDF = () => {
    setToastMessage('PDF download functionality coming soon!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleViewBookings = () => {
    if (booking?.passenger_email) {
      navigate('/my-bookings', {
        state: { email: booking.passenger_email }
      });
    } else {
      navigate('/my-bookings');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Toast Component
  const Toast = () => (
    <div className="fixed bottom-6 right-6 z-50 bg-green-50 border border-green-200 rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px] animate-slideUp">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-green-800">Success!</p>
        <p className="text-sm text-green-600">{toastMessage}</p>
      </div>
      <button
        onClick={() => setShowToast(false)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your booking information.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const flightDetails = booking.flight_details;
  const hotelDetails = booking.hotel_details;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {showToast && <Toast />}
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your flight has been successfully booked.</p>
          </div>

          <div className="p-8">
            {/* Booking Reference */}
            <div className="bg-blue-50 rounded-xl p-6 text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
              <p className="text-4xl font-bold text-blue-600 font-mono">{booking.booking_reference}</p>
              <p className="text-sm text-gray-600 mt-2">
                We'll send your e-ticket to <span className="font-semibold">{booking.passenger_email}</span> once payment is approved
              </p>
            </div>

            {/* Payment Status */}
            <div className="bg-yellow-50 rounded-xl p-4 flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${booking.payment_status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {booking.payment_status === 'completed' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Payment Completed
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Payment Pending Verification
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-xl font-bold text-gray-900">${booking.total_price}</p>
              </div>
            </div>

            {booking.payment_status === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your payment is being verified. This usually takes 1-2 hours.
                    You'll receive a confirmation email once verified.
                  </span>
                </p>
              </div>
            )}

            {/* Seat Information */}
            <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Your Seat</p>
                <p className="text-2xl font-bold text-purple-600">{booking.seat_number || 'TBA'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Baggage Allowance</p>
                <p className="font-semibold text-gray-800">
                  {booking.baggage_allowance?.cabin || '1 bag'} / {booking.baggage_allowance?.checked || '1 bag'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Summary */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Summary
            </h2>
          </div>

          <div className="p-8">
            {/* Airline & Flight Info */}
            <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Airline</p>
                <p className="font-bold text-xl">{flightDetails?.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-bold text-xl">{flightDetails?.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-bold text-xl">{flightDetails?.cabinClass}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aircraft</p>
                <p className="font-bold text-xl">{flightDetails?.aircraft || 'Boeing 787'}</p>
              </div>
            </div>

            {/* Route */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500 mb-1">From</p>
                <p className="text-3xl font-bold text-gray-900">{flightDetails?.from?.code}</p>
                <p className="text-gray-600">{flightDetails?.from?.city}</p>
                <p className="text-sm text-gray-500">{flightDetails?.from?.airport}</p>
                <p className="text-xs text-gray-400">Terminal {flightDetails?.from?.terminal || 'N/A'}</p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-full h-0.5 bg-gray-300"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                    <Plane className="w-6 h-6 text-blue-600 transform rotate-90" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{flightDetails?.duration}</p>
                <p className="text-xs text-gray-400">{formatDate(flightDetails?.date)}</p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-500 mb-1">To</p>
                <p className="text-3xl font-bold text-gray-900">{flightDetails?.to?.code}</p>
                <p className="text-gray-600">{flightDetails?.to?.city}</p>
                <p className="text-sm text-gray-500">{flightDetails?.to?.airport}</p>
                <p className="text-xs text-gray-400">Terminal {flightDetails?.to?.terminal || 'N/A'}</p>
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-500">Departure</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(flightDetails?.departureTime)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Arrival</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(flightDetails?.arrivalTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Summary (if package) */}
        {hotelDetails && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Hotel Summary
              </h2>
            </div>

            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🏨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{hotelDetails.name}</h3>
                  <p className="text-gray-600 mt-1">
                    Check-in: {hotelDetails.checkIn} • Check-out: {hotelDetails.checkOut}
                  </p>
                  <p className="text-gray-600">Guests: {hotelDetails.guests}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Information */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-8 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Passenger Information
            </h2>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-bold text-lg">{booking.passenger_name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <p className="font-bold text-lg">{booking.passenger_dob || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Passport Number</p>
                <p className="font-bold text-lg">{booking.passenger_passport || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-bold text-lg">{booking.passenger_email}</p>
              </div>
              {booking.passenger_phone && (
                <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="font-bold text-lg">{booking.passenger_phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Price Summary
            </h2>
          </div>

          <div className="p-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight</span>
                <span className="font-semibold">${flightDetails?.price || booking.total_price}</span>
              </div>
              {hotelDetails && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel</span>
                  <span className="font-semibold">${hotelDetails.price || 0}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-blue-600 text-xl">${booking.total_price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Payment via {booking.payment_method}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-semibold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleViewBookings}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            View My Bookings
          </button>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 rounded-2xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
              Please arrive at the airport at least 3 hours before your flight
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
              Your baggage allowance includes {booking.baggage_allowance?.cabin || '1 bag'} cabin baggage and {booking.baggage_allowance?.checked || '1 bag'} checked baggage
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
              You can manage your booking from the "My Bookings" page using your booking reference {booking.booking_reference}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
              A confirmation email has been sent to {booking.passenger_email}
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}