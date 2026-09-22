import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Wallet,
  Bitcoin,
  Banknote,
  Landmark,
  Smartphone,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Clock,
  Calendar,
  Plane,
  Info,
  XCircle
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { bookingService } from '../services/bookingService';

// Map icon strings to actual components
const iconMap = {
  CreditCard: <CreditCard className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Bitcoin: <Bitcoin className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />
};

// ============================================================
// CONFIGURATION
// ============================================================
const AGENCY_CONTACT_EMAIL = 'stayfly.agency@gmail.com';
const AGENCY_NAME = 'StayFly Travel Agency';

// Time constraints (in minutes)
const BOOKING_WINDOW_MINUTES = 5 * 60;      // 5 hours to complete payment
const MIN_BOOKING_BEFORE_DEPARTURE = 30;    // 30 minutes before departure

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, hotel, isPackage, totalPrice, passengerDetails, searchParams, hotelPackage } = location.state || {};

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [groupedMethods, setGroupedMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Booking window state
  const [bookingDeadline, setBookingDeadline] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [canBook, setCanBook] = useState(true);
  const [bookingError, setBookingError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  // Form state for card payment
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  const [cryptoDetails, setCryptoDetails] = useState({
    walletAddress: '',
    currency: 'BTC'
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });

  // ============================================================
  // INITIALIZE: Set booking deadline and check if can book
  // ============================================================
  useEffect(() => {
    if (!flight) return;

    const now = new Date();

    // Check 1: Can't book within 30 minutes of departure
    const departureDateTime = getFlightDepartureDateTime(flight);
    const minutesUntilDeparture = (departureDateTime - now) / (1000 * 60);

    if (minutesUntilDeparture < MIN_BOOKING_BEFORE_DEPARTURE) {
      setCanBook(false);
      if (minutesUntilDeparture < 0) {
        setBookingError('This flight has already departed. You cannot book this flight.');
      } else {
        setBookingError(
          `Booking is closed for this flight. You cannot book within ${MIN_BOOKING_BEFORE_DEPARTURE} minutes of departure.`
        );
      }
      return;
    }

    // Check 2: Set 5-hour booking window
    const deadline = new Date(now.getTime() + BOOKING_WINDOW_MINUTES * 60 * 1000);
    
    // But if departure is sooner than 5 hours, use departure time as deadline (minus 30 min buffer)
    const departureDeadline = new Date(departureDateTime.getTime() - MIN_BOOKING_BEFORE_DEPARTURE * 60 * 1000);
    const finalDeadline = deadline < departureDeadline ? deadline : departureDeadline;
    
    setBookingDeadline(finalDeadline);

    // Start the countdown timer
    const interval = setInterval(() => {
      const timeLeft = finalDeadline - new Date();
      if (timeLeft <= 0) {
        setTimeRemaining(null);
        setCanBook(false);
        setBookingError('Your booking window has expired. Please search for flights again.');
        clearInterval(interval);
      } else {
        setTimeRemaining(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flight]);

  // Helper: Get flight departure as a Date object
  const getFlightDepartureDateTime = (flight) => {
    // flight.date is "2026-09-23" and flight.departureTime is "14:45"
    const dateStr = flight.date;
    const timeStr = flight.departureTime || '00:00';
    
    // Handle both "HH:MM" and "HH:MM:SS" formats
    const timeParts = timeStr.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    
    const departure = new Date(`${dateStr}T00:00:00`);
    departure.setHours(hours, minutes, 0, 0);
    
    return departure;
  };

  // Format remaining time as "Xh Ym Zs"
  const formatTimeRemaining = (ms) => {
    if (!ms || ms <= 0) return 'Expired';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Format deadline as readable date
  const formatDeadline = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============================================================
  // HANDLE BOOKING: Create booking and go to confirmation page
  // ============================================================
  const handleBook = async () => {
  if (!canBook) {
    setBookingError('Booking is not available at this time.');
    return;
  }

  setProcessing(true);
  setBookingError('');

  try {
    // Generate booking reference
    const bookingRef = bookingService.generateBookingReference();
    
    // Generate seat number
    const seatNumber = bookingService.generateSeatNumber();

    // Prepare flight details
    const flightDetails = {
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flight.from,
      to: flight.to,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      date: flight.date,
      duration: flight.duration,
      aircraft: flight.aircraft,
      cabinClass: flight.cabinClass,
      price: flight.price,
      stops: flight.stops,
      stopInfo: flight.stopInfo
    };

    // Prepare hotel details if package
    let hotelDetails = null;
    if (hotel) {
      hotelDetails = {
        name: hotel.hotel?.name,
        checkIn: hotelPackage?.checkIn,
        checkOut: hotelPackage?.checkOut,
        guests: hotelPackage?.guests,
        price: hotelPackage?.hotelPrice
      };
    }

    // Prepare baggage allowance
    const baggageAllowance = {
      cabin: '1 piece (7kg)',
      checked: flight.cabinClass === 'First' || flight.cabinClass === 'Business'
        ? '2 pieces (32kg each)'
        : '1 piece (23kg)'
    };

    // Create booking object (local)
    const bookingData = {
      booking_reference: bookingRef,
      passenger_email: passengerDetails.email,
      passenger_name: passengerDetails.fullName,
      passenger_dob: passengerDetails.dob || null,
      passenger_phone: passengerDetails.phone,
      passenger_passport: passengerDetails.passportNumber || passengerDetails.passport || null,
      flight_id: flight.id,
      flight_details: flightDetails,
      hotel_id: hotel?.id || null,
      hotel_details: hotelDetails,
      total_price: calculateTotal(),
      payment_method: 'contact_agent',
      payment_status: 'pending',
      booking_status: 'pending',
      seat_number: seatNumber,
      baggage_allowance: baggageAllowance,
      created_at: new Date().toISOString()
    };

    // Try to save to Supabase (but don't crash if it fails)
    let savedBooking = bookingData;
    try {
      const result = await bookingService.createBooking(bookingData);
      if (result) {
        savedBooking = result;
        console.log('✅ Booking saved to Supabase:', result);
      }
    } catch (dbError) {
      console.warn('⚠️ Could not save to Supabase, using local data:', dbError.message);
      // Continue anyway - we'll use sessionStorage
    }

    setCreatedBooking(savedBooking);

    // Save to sessionStorage for the confirmation page
    sessionStorage.setItem('bookingReference', bookingRef);
    sessionStorage.setItem('bookingData', JSON.stringify(savedBooking));

    // Brief success animation
    setProcessing(false);
    setSuccess(true);

    // Redirect to confirmation page
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          bookingRef,
          flight,
          hotel,
          isPackage,
          totalPrice: calculateTotal(),
          passengerDetails,
          paymentMethod: 'contact_agent',
          bookingData: savedBooking
        }
      });
    }, 1500);

  } catch (error) {
    console.error('Error creating booking:', error);
    setProcessing(false);
    setBookingError(
      'Failed to create booking. Please try again or contact support.'
    );
  }
};

  // ============================================================
  // ORBITED (KEPT FOR FUTURE USE): Payment methods fetching
  // ============================================================
  /*
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentService.getPaymentMethods();
        setPaymentMethods(methods);
        
        const grouped = [];
        const cryptoMethods = [];
        const otherMethods = [];
        
        methods.forEach(method => {
          if (method.method_type === 'crypto') {
            cryptoMethods.push(method);
          } else {
            otherMethods.push(method);
          }
        });
        
        if (cryptoMethods.length > 0) {
          grouped.push({
            id: 'crypto-group',
            name: 'crypto',
            display_name: 'Cryptocurrency',
            description: 'Pay with Bitcoin, Ethereum, USDT or BNB',
            icon: 'Bitcoin',
            method_type: 'crypto',
            is_group: true,
            children: cryptoMethods
          });
        }
        
        setGroupedMethods([...otherMethods, ...grouped]);
        
        if (otherMethods.length > 0) {
          setPaymentMethod(otherMethods[0].name);
        } else if (cryptoMethods.length > 0) {
          setPaymentMethod('crypto');
        }
        
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);
  */

  useEffect(() => {
    setLoadingMethods(false);
  }, []);

  // ============================================================
  // ORBITED: Payment handlers
  // ============================================================
  /*
  const getCryptoPrice = (currency) => {
    const prices = { BTC: 65000, ETH: 3500, USDT: 1, BNB: 450 };
    return prices[currency] || 1;
  };

  const handleWireTransfer = () => { ... };
  const handleCryptoPayment = (currency) => { ... };
  const handlePayPalPayment = () => { ... };
  const handleApplePayPayment = () => { ... };
  const handleGooglePayPayment = () => { ... };
  const handleCashAppPayment = () => { ... };
  const handleVenmoPayment = () => { ... };
  */

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('Payment page received:', { flight, hotel, isPackage, totalPrice, passengerDetails });
  }, []);

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 pt-28 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Booking Information</h2>
          <p className="text-gray-600 mb-6">Please start your booking from the beginning.</p>
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

  const calculateSubtotal = () => {
    if (!flight) return 0;
    let subtotal = flight.price || 0;
    if (isPackage && hotel) {
      subtotal += hotelPackage?.hotelPrice || 0;
    }
    return subtotal;
  };

  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.1 * 100) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  // ============================================================
  // Handle "Contact Agent" button click
  // ============================================================
  const handleContactAgent = () => {
    const total = calculateTotal();
    const bookingRef = createdBooking?.booking_reference || 'TEMP-' + Date.now().toString().slice(-6);
    
    const subject = `Payment Inquiry - Booking ${bookingRef}`;
    const body = `
Dear ${AGENCY_NAME},

I would like to complete payment for my booking.

BOOKING DETAILS
--------------
Booking Reference: ${bookingRef}
Passenger Name: ${passengerDetails?.fullName || 'N/A'}
Email: ${passengerDetails?.email || 'N/A'}
Phone: ${passengerDetails?.phone || 'N/A'}

Flight: ${flight.airline} ${flight.flightNumber}
Route: ${flight.from?.code} → ${flight.to?.code}
Date: ${flight.date}
Time: ${flight.departureTime} - ${flight.arrivalTime}

Total Amount: $${total.toFixed(2)} USD

Please provide me with payment instructions so I can complete this booking.

Thank you,
${passengerDetails?.fullName || 'Customer'}
    `.trim();

    const mailtoLink = `mailto:${AGENCY_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  if (loadingMethods) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-8">
        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Created!</h2>
            <p className="text-gray-600 mb-6">Taking you to confirmation page...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ============================================================ */}
            {/* LEFT PANEL - Booking Section */}
            {/* ============================================================ */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Complete Your Booking</h1>
                      <p className="text-blue-100">Confirm your booking and pay via our agent</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                  {/* ============================================ */}
                  {/* BOOKING WINDOW TIMER / CANNOT BOOK ALERT */}
                  {/* ============================================ */}
                  {!canBook ? (
                    // Case 1: Cannot book (too late or expired)
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-red-900 mb-2">
                            Booking Not Available
                          </h3>
                          <p className="text-red-800 text-sm leading-relaxed mb-4">
                            {bookingError}
                          </p>
                          <button
                            onClick={() => navigate('/')}
                            className="text-sm font-semibold text-red-700 hover:text-red-900 underline"
                          >
                            ← Search for other flights
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Case 2: Booking available - show timer
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-amber-900 mb-1">
                            ⏰ Complete Your Payment Within 5 Hours
                          </h3>
                          <p className="text-amber-800 text-sm mb-3">
                            Your seat is being held. Complete the booking and payment before:
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-white rounded-lg px-4 py-2 border border-amber-200">
                              <p className="text-xs text-gray-500">Deadline</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formatDeadline(bookingDeadline)}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg px-4 py-2 border border-amber-200">
                              <p className="text-xs text-gray-500">Time Remaining</p>
                              <p className="text-sm font-bold text-amber-600 font-mono">
                                {formatTimeRemaining(timeRemaining)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Rules Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Booking Rules</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• You have 5 hours to complete payment after booking</li>
                          <li>• Bookings cannot be made within 30 minutes of departure</li>
                          <li>• Unpaid bookings will be automatically cancelled</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Flight Departure Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">Flight Departure</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{flight.from?.code}</span> →{' '}
                      <span className="font-semibold">{flight.to?.code}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4 inline mb-0.5" />{' '}
                      {flight.date}
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 inline mb-0.5" />{' '}
                      {flight.departureTime}
                    </p>
                  </div>

                  {/* ============================================ */}
                  {/* BOOK NOW BUTTON */}
                  {/* ============================================ */}
                  <button
                    onClick={handleBook}
                    disabled={!canBook || processing}
                    className={`w-full font-bold py-5 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                      !canBook
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Book Now
                      </>
                    )}
                  </button>

                  {/* Trust Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Your information is safe and will only be used for this booking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT PANEL - Order Summary */}
            {/* ============================================================ */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Passenger Info */}
                {passengerDetails && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Traveller</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {passengerDetails.fullName || 'N/A'}</p>
                      <p><span className="text-gray-500">Email:</span> {passengerDetails.email || 'N/A'}</p>
                      <p><span className="text-gray-500">Phone:</span> {passengerDetails.phone || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {/* Flight Details */}
                {flight && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Flight</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Airline:</span> {flight.airline}</p>
                      <p><span className="text-gray-500">Flight:</span> {flight.flightNumber}</p>
                      <p><span className="text-gray-500">Route:</span> {flight.from?.code} → {flight.to?.code}</p>
                      <p><span className="text-gray-500">Date:</span> {flight.date}</p>
                      <p><span className="text-gray-500">Time:</span> {flight.departureTime} - {flight.arrivalTime}</p>
                    </div>
                  </div>
                )}

                {/* Hotel Details (if package) */}
                {isPackage && hotel && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Hotel</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {hotel.hotel?.name}</p>
                      <p><span className="text-gray-500">Check-in:</span> {hotelPackage?.checkIn}</p>
                      <p><span className="text-gray-500">Check-out:</span> {hotelPackage?.checkOut}</p>
                      <p><span className="text-gray-500">Guests:</span> {hotelPackage?.guests}</p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base Fare</span>
                    <span className="font-medium">${calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes & Fees</span>
                    <span className="font-medium">${calculateTaxes()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600 text-xl">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Window Warning */}
                {canBook && timeRemaining && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800 mb-1">
                          Booking Window Active
                        </p>
                        <p className="text-xs text-amber-700">
                          Time remaining: <span className="font-bold font-mono">{formatTimeRemaining(timeRemaining)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!canBook && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">
                        Booking is not available. Please search for another flight.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}