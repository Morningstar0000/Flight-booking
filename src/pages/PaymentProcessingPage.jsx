import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
  Clock,
  Wallet,
  Bitcoin,
  Landmark,
  Globe
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { bookingService } from '../services/bookingService';

export default function PaymentProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentMethod, amount, currency, flight, hotel, passengerDetails } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentMethod || !amount) {
      navigate('/payment');
    }
  }, [paymentMethod, amount, navigate]);

  // Fetch payment method details from database
  useEffect(() => {
    const fetchPaymentMethodDetails = async () => {
      try {
        setLoading(true);
        // Get all payment methods
        const methods = await paymentService.getAllPaymentMethods();
        
        // Find the matching method based on paymentMethod and currency
        let method;
        if (paymentMethod === 'crypto' && currency) {
          // For crypto, find by name (BTC, ETH, etc.)
          method = methods.find(m => 
            m.method_type === 'crypto' && m.name.toUpperCase() === currency.toUpperCase()
          );
        } else {
          // For other methods, find by method_type and name
          method = methods.find(m => 
            m.method_type === paymentMethod && m.is_active === true
          );
        }
        
        if (!method) {
          // Fallback to default if method not found
          setError('Payment method not found');
        } else {
          setPaymentDetails(method);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    if (paymentMethod) {
      fetchPaymentMethodDetails();
    }
  }, [paymentMethod, currency]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

 // Update handlePaymentConfirmed function
const handlePaymentConfirmed = async () => {
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
      cabinClass: flight.cabinClass
    };
    
    // Prepare hotel details if package
    let hotelDetails = null;
    if (hotel) {
      hotelDetails = {
        name: hotel.hotel?.name,
        checkIn: hotel.hotelPackage?.checkIn,
        checkOut: hotel.hotelPackage?.checkOut,
        guests: hotel.hotelPackage?.guests,
        price: hotel.hotelPackage?.hotelPrice
      };
    }
    
    // Prepare baggage allowance
    const baggageAllowance = {
      cabin: '1 piece (7kg)',
      checked: flight.cabinClass === 'First' || flight.cabinClass === 'Business' ? '2 pieces (32kg each)' : '1 piece (23kg)'
    };
    
    // Create booking object
    const bookingData = {
      booking_reference: bookingRef,
      passenger_email: passengerDetails.email,
      passenger_name: passengerDetails.fullName,
      passenger_dob: passengerDetails.dob,
      passenger_phone: passengerDetails.phone,
      passenger_passport: passengerDetails.passportNumber,
      flight_id: flight.id,
      flight_details: flightDetails,
      hotel_id: hotel?.id,
      hotel_details: hotelDetails,
      total_price: amount,
      payment_method: paymentMethod,
      payment_status: 'pending',
      booking_status: 'confirmed',
      seat_number: seatNumber,
      baggage_allowance: baggageAllowance
    };
    
    // Save to database
    await bookingService.createBooking(bookingData);
    
    // Store in session for confirmation page
    sessionStorage.setItem('bookingReference', bookingRef);
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    sessionStorage.setItem('seatNumber', seatNumber);
    
    setPaymentConfirmed(true);
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          bookingRef,
          flight,
          hotel,
          passengerDetails,
          paymentMethod,
          amount,
          seatNumber
        }
      });
    }, 2000);
    
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('There was an error creating your booking. Please contact support.');
  }
};

  const getCryptoNetwork = (currency) => {
    const networks = {
      BTC: 'Bitcoin (BTC)',
      ETH: 'Ethereum (ERC-20)',
      USDT: 'Tron (TRC-20)',
      BNB: 'Binance Smart Chain (BEP-20)'
    };
    return networks[currency] || 'Unknown';
  };

  const getCryptoPrice = (currency) => {
    const prices = {
      BTC: 65000,
      ETH: 3500,
      USDT: 1,
      BNB: 450
    };
    return prices[currency] || 1;
  };

  const renderPaymentDetails = () => {
    if (!paymentDetails) return null;

    const { payment_details, instructions } = paymentDetails;

    switch (paymentMethod) {
      case 'wire':
        return {
          title: 'Wire Transfer Instructions',
          icon: <Landmark className="w-8 h-8" />,
          details: [
            { label: 'Bank Name', value: payment_details?.bank_name || 'Chase Bank' },
            { label: 'Account Name', value: payment_details?.account_name || 'SkyWings Inc.' },
            { label: 'Account Number', value: payment_details?.account_number || '1234567890' },
            { label: 'Routing Number', value: payment_details?.routing_number || '021000021' },
            { label: 'SWIFT Code', value: payment_details?.swift_code || 'CHASUS33' },
            { label: 'Amount to Pay', value: `$${amount?.toFixed(2) || '0.00'} USD` },
            { label: 'Reference', value: `SW${Date.now().toString().slice(-8)}` }
          ],
          instructions: instructions || [
            'Log in to your online banking',
            'Add SkyWings Inc. as a payee',
            'Transfer the exact amount shown above',
            'Use the reference number for identification',
            'Upload your payment receipt below'
          ]
        };
      
      case 'crypto':
        const cryptoAmount = (amount / getCryptoPrice(currency)).toFixed(8);
        
        return {
          title: paymentDetails.display_name || 'Cryptocurrency Payment',
          icon: <Bitcoin className="w-8 h-8" />,
          details: [
            { label: 'Network', value: payment_details?.payment_details?.network || getCryptoNetwork(currency) },
            { label: 'Currency', value: currency },
            { label: 'Amount to Pay', value: `${cryptoAmount} ${currency}` },
            { label: 'Equivalent', value: `$${amount?.toFixed(2) || '0.00'} USD` },
            { label: 'Wallet Address', value: payment_details?.payment_details?.wallet_address || 'Address not configured' }
          ],
          instructions: instructions || [
            `Send exactly ${cryptoAmount} ${currency} to the address below`,
            'Use the correct network (shown above)',
            'Transaction must be confirmed on the blockchain',
            'Upload your transaction receipt/proof below'
          ]
        };
      
      case 'paypal':
        return {
          title: 'PayPal Payment',
          icon: <Wallet className="w-8 h-8" />,
          details: [
            { label: 'PayPal Email', value: payment_details?.payment_details?.email || 'payments@skywings.com' },
            { label: 'Amount to Pay', value: `$${amount?.toFixed(2) || '0.00'} USD` },
            { label: 'Reference', value: `PP${Date.now().toString().slice(-8)}` }
          ],
          instructions: instructions || [
            'Log in to your PayPal account',
            'Send payment to payments@skywings.com',
            'Include the reference number in notes',
            'Upload your payment confirmation below'
          ]
        };
      
      case 'cashapp':
        return {
          title: 'Cash App Payment',
          icon: <Wallet className="w-8 h-8" />,
          details: [
            { label: 'Cash App Tag', value: payment_details?.payment_details?.cashtag || '$SkyWings' },
            { label: 'Amount to Pay', value: `$${amount?.toFixed(2) || '0.00'} USD` },
            { label: 'Reference', value: `CA${Date.now().toString().slice(-8)}` }
          ],
          instructions: instructions || [
            'Open Cash App',
            'Send payment to $SkyWings',
            'Include the reference number',
            'Upload your payment receipt below'
          ]
        };
      
      case 'venmo':
        return {
          title: 'Venmo Payment',
          icon: <Wallet className="w-8 h-8" />,
          details: [
            { label: 'Venmo Username', value: payment_details?.payment_details?.username || '@SkyWings' },
            { label: 'Amount to Pay', value: `$${amount?.toFixed(2) || '0.00'} USD` },
            { label: 'Reference', value: `VE${Date.now().toString().slice(-8)}` }
          ],
          instructions: instructions || [
            'Open Venmo',
            'Send payment to @SkyWings',
            'Include the reference number',
            'Upload your payment receipt below'
          ]
        };
      
      default:
        return null;
    }
  };

  const displayDetails = renderPaymentDetails();

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

  if (error || !displayDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Payment</span>
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The selected payment method is not available.'}</p>
            <button
              onClick={() => navigate('/payment')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Payment</span>
        </button>

        {paymentConfirmed ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your payment. We'll verify your transaction and confirm your booking shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  {displayDetails.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{displayDetails.title}</h1>
                  <p className="text-blue-100">Complete your payment using the instructions below</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Timer / Urgency */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">Payment Pending</p>
                  <p className="text-sm text-yellow-700">
                    Please complete your payment within 30 minutes. Your booking will be held for you.
                  </p>
                </div>
              </div>

              {/* Payment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayDetails.details.map((detail, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-semibold text-gray-900 break-all">{detail.value}</p>
                      {(detail.label.includes('Address') || detail.label.includes('Number') || detail.label.includes('Email')) ? (
                        <button
                          onClick={() => handleCopy(detail.value)}
                          className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Copy Success Message */}
              {copied && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-sm text-green-700">✓ Copied to clipboard!</p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
                <ul className="space-y-2">
                  {displayDetails.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* QR Code for Crypto (simulated) */}
              {paymentMethod === 'crypto' && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="w-48 h-48 bg-gray-100 mx-auto rounded-xl flex items-center justify-center mb-4">
                    <span className="text-gray-400">QR Code</span>
                  </div>
                  <p className="text-sm text-gray-500">Scan with your wallet app</p>
                </div>
              )}

              {/* Receipt Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Payment Proof
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Upload a screenshot or receipt of your payment
                  </p>
                  
                  <input
                    type="file"
                    id="receipt"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
                  >
                    Choose File
                  </label>

                  {uploadedFile && (
                    <div className="mt-4 text-left">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {uploadedFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePaymentConfirmed}
                disabled={!uploadedFile || uploadProgress < 100}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                I Have Made the Payment
              </button>

              <p className="text-xs text-gray-400 text-center">
                Your payment will be verified within 1-2 hours. You'll receive a confirmation email once verified.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}