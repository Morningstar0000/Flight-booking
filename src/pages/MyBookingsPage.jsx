import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { bookingService } from '../services/bookingService';
import { 
  Search, 
  Calendar, 
  Plane, 
  MapPin, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  CreditCard,
  X,
  DollarSign,
  Shield,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingRef, setBookingRef] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Pre-fill email if coming from confirmation page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.bookingRef) {
      setBookingRef(location.state.bookingRef);
      // Auto-search if both are provided
      if (location.state.email && location.state.bookingRef) {
        handleSearchWithParams(location.state.bookingRef, location.state.email);
      }
    }
  }, [location.state]);

  const handleSearchWithParams = async (ref, emailAddr) => {
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const result = await bookingService.getBookingByReferenceAndEmail(
        ref.toUpperCase(), 
        emailAddr
      );
      setBooking(result);
    } catch (error) {
      console.error('Error finding booking:', error);
      setError('Booking not found. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!bookingRef) {
      setError('Please enter a booking reference');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    await handleSearchWithParams(bookingRef, email);
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await bookingService.updateBooking(booking.booking_reference, {
        booking_status: 'cancelled'
      });
      setShowCancelModal(false);
      setToastMessage('Booking cancelled successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Refresh booking
      const updated = await bookingService.getBookingByReference(booking.booking_reference);
      setBooking(updated);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setToastMessage('Error cancelling booking');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const getPaymentStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Payment Completed'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Payment Pending'
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Payment Failed'
        };
      case 'refunded':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: <DollarSign className="w-4 h-4" />,
          label: 'Refunded'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          label: status || 'Unknown'
        };
    }
  };

  const getBookingStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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

  // Cancel Confirmation Modal
  const CancelModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-3xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Cancel Booking</h2>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-mono font-semibold text-blue-600">{booking.booking_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Passenger:</span>
                  <span className="font-medium">{booking.passenger_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Flight:</span>
                  <span className="font-medium">{booking.flight_details?.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Route:</span>
                  <span className="font-medium">
                    {booking.flight_details?.from?.code} → {booking.flight_details?.to?.code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(booking.flight_details?.date)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="font-bold text-blue-600">${booking.total_price}</span>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Cancellation fees may apply</li>
                    <li>Refunds will be processed within 5-7 business days</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                disabled={cancelling}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showToast && <Toast />}
      {showCancelModal && <CancelModal />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600 mb-8">Enter your booking reference and email to view your booking</p>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                maxLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for booking"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find My Booking
                </>
              )}
            </button>
          </div>
        </div>

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Status Banner - Combined Booking and Payment Status */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-white/80 text-sm">Booking Reference</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {booking.booking_reference}
                  </p>
                </div>
                <div className="flex gap-3">
                  {/* Booking Status Badge */}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getBookingStatusBadge(booking.booking_status)}`}>
                    {booking.booking_status?.toUpperCase()}
                  </span>
                  {/* Payment Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border ${
                    getPaymentStatusBadge(booking.payment_status).bg
                  } ${getPaymentStatusBadge(booking.payment_status).text} ${
                    getPaymentStatusBadge(booking.payment_status).border
                  }`}>
                    {getPaymentStatusBadge(booking.payment_status).icon}
                    {getPaymentStatusBadge(booking.payment_status).label}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Payment Status Card - Highlighted for visibility */}
              <div className={`rounded-xl p-6 border-2 ${
                booking.payment_status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : booking.payment_status === 'pending'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      booking.payment_status === 'completed' 
                        ? 'bg-green-100'
                        : booking.payment_status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      {booking.payment_status === 'completed' ? (
                        <CheckCircle className={`w-6 h-6 ${
                          booking.payment_status === 'completed' ? 'text-green-600' : ''
                        }`} />
                      ) : booking.payment_status === 'pending' ? (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className={`text-xl font-bold ${
                        booking.payment_status === 'completed' 
                          ? 'text-green-600'
                          : booking.payment_status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {booking.payment_status === 'completed' ? 'Payment Completed' :
                         booking.payment_status === 'pending' ? 'Payment Pending Verification' :
                         booking.payment_status === 'failed' ? 'Payment Failed' :
                         booking.payment_status === 'refunded' ? 'Refunded' :
                         booking.payment_status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${booking.total_price}</p>
                    <p className="text-xs text-gray-500 capitalize">via {booking.payment_method}</p>
                  </div>
                </div>
                
                {booking.payment_status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-yellow-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Your payment is being verified. This usually takes 1-2 hours. 
                        You'll receive a confirmation email once verified.
                      </span>
                    </p>
                  </div>
                )}

                {booking.payment_status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700 flex items-start gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Your payment has been confirmed and your booking is secured.
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Passenger Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Passenger Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{booking.passenger_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{booking.passenger_email}</p>
                  </div>
                  {booking.passenger_phone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{booking.passenger_phone}</p>
                    </div>
                  )}
                  {booking.passenger_dob && (
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="font-medium">{booking.passenger_dob}</p>
                    </div>
                  )}
                  {booking.passenger_passport && (
                    <div>
                      <p className="text-xs text-gray-500">Passport</p>
                      <p className="font-medium">{booking.passenger_passport}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Flight Info */}
              <div className="border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Flight Details
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Airline</p>
                      <p className="font-medium">{booking.flight_details?.airline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Flight</p>
                      <p className="font-medium">{booking.flight_details?.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="font-medium">{booking.flight_details?.cabinClass}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seat</p>
                      <p className="font-medium">{booking.seat_number || 'TBA'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-xl font-bold text-gray-900">{booking.flight_details?.from?.code}</p>
                      <p className="text-sm text-gray-600">{booking.flight_details?.from?.city}</p>
                      <p className="text-xs text-gray-500">{formatTime(booking.flight_details?.departureTime)}</p>
                    </div>
                    <div className="text-gray-400">
                      <Plane className="w-5 h-5 transform rotate-90" />
                    </div>
                    <div className="flex-1 text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-xl font-bold text-gray-900">{booking.flight_details?.to?.code}</p>
                      <p className="text-sm text-gray-600">{booking.flight_details?.to?.city}</p>
                      <p className="text-xs text-gray-500">{formatTime(booking.flight_details?.arrivalTime)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Date: {formatDate(booking.flight_details?.date)}</span>
                    <span>Duration: {booking.flight_details?.duration}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Info (if package) */}
              {booking.hotel_details && (
                <div className="border rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Hotel Details
                  </h3>
                  <p className="font-medium">{booking.hotel_details.name}</p>
                  <p className="text-sm text-gray-600">
                    {booking.hotel_details.checkIn} - {booking.hotel_details.checkOut}
                  </p>
                </div>
              )}

              {/* Actions */}
              {booking.booking_status !== 'cancelled' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
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