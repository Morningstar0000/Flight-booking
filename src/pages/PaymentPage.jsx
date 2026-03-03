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
  Globe
} from 'lucide-react';
import { paymentService } from '../services/paymentService';

// Map icon strings to actual components
const iconMap = {
  CreditCard: <CreditCard className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Bitcoin: <Bitcoin className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />
};

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

  // Form state for card payment
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  // Form state for other payment methods
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

  // Fetch payment methods from database
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentService.getPaymentMethods();
        setPaymentMethods(methods);
        
        // Group the methods - keep crypto currencies together
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
        
        // If there are crypto methods, add them as one grouped item
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
        
        // Set default payment method
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

  const getCryptoPrice = (currency) => {
    const prices = {
      BTC: 65000,
      ETH: 3500,
      USDT: 1,
      BNB: 450
    };
    return prices[currency] || 1;
  };

  const handleWireTransfer = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'wire',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handleCryptoPayment = (currency) => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'crypto',
        currency,
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handlePayPalPayment = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'paypal',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handleApplePayPayment = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'applepay',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handleGooglePayPayment = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'googlepay',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handleCashAppPayment = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'cashapp',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  const handleVenmoPayment = () => {
    const amount = calculateTotal();
    navigate('/payment-processing', {
      state: {
        paymentMethod: 'venmo',
        amount,
        flight,
        hotel,
        passengerDetails,
        isPackage,
        searchParams,
        hotelPackage
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('Payment page received:', { flight, hotel, isPackage, totalPrice, passengerDetails });
  }, []);

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
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

  const validateCardForm = () => {
    const newErrors = {};

    if (!cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Use MM/YY format';
    }
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    if (!cardDetails.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    return newErrors;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      const newErrors = validateCardForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      const bookingRef = 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();

      setTimeout(() => {
        navigate('/confirmation', {
          state: {
            bookingRef,
            flight,
            hotel,
            isPackage,
            totalPrice,
            passengerDetails,
            paymentMethod
          }
        });
      }, 1500);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

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

  // Get the selected payment method details
  const getSelectedMethodDetails = () => {
    return groupedMethods.find(m => m.name === paymentMethod);
  };

  const selectedMethod = getSelectedMethodDetails();

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your booking is being confirmed. Redirecting...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

                {/* Security Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800">Secure Payment</p>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>
                </div>

                {/* Payment Method Selection - Grouped */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {groupedMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.name)}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === method.name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={paymentMethod === method.name ? 'text-blue-600' : 'text-gray-600'}>
                            {iconMap[method.icon] || <CreditCard className="w-5 h-5" />}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{method.display_name}</span>
                          <span className="text-xs text-gray-500">{method.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handlePayment}>
                  {/* Credit Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({
                            ...cardDetails,
                            cardNumber: formatCardNumber(e.target.value)
                          })}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                            errors.cardNumber
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardholderName}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                            errors.cardholderName
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.cardholderName && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.cardholderName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                              errors.expiryDate
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                              errors.cvv
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address *
                        </label>
                        <textarea
                          value={cardDetails.billingAddress}
                          onChange={(e) => setCardDetails({ ...cardDetails, billingAddress: e.target.value })}
                          rows="3"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                            errors.billingAddress
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="123 Main St, New York, NY 10001"
                        />
                        {errors.billingAddress && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.billingAddress}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            PROCESSING...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Pay ${calculateTotal().toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* PayPal Form */}
                  {paymentMethod === 'paypal' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                        <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with PayPal</h3>
                        <p className="text-gray-600 mb-6">
                          You'll be redirected to our secure payment processing page where you can complete your PayPal payment.
                        </p>

                        <div className="bg-white rounded-xl p-4 mb-6 text-left">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">PayPal Email:</span> payments@skywings.com
                          </p>
                        </div>

                        <button
                          onClick={handlePayPalPayment}
                          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition font-semibold"
                        >
                          Continue to Payment Processing
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cryptocurrency Form - Grouped */}
                  {paymentMethod === 'crypto' && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                          Select your preferred cryptocurrency. You'll be shown the exact amount to send and a wallet address.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Cryptocurrency
                        </label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {paymentMethods
                            .filter(m => m.method_type === 'crypto')
                            .map((crypto) => (
                              <button
                                key={crypto.id}
                                type="button"
                                onClick={() => setCryptoDetails({ ...cryptoDetails, currency: crypto.name.toUpperCase() })}
                                className={`p-4 border-2 rounded-xl transition-all ${
                                  cryptoDetails.currency === crypto.name.toUpperCase()
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex flex-col items-center">
                                  <Bitcoin className={`w-8 h-8 mb-2 ${
                                    cryptoDetails.currency === crypto.name.toUpperCase() ? 'text-orange-500' : 'text-gray-600'
                                  }`} />
                                  <span className="text-sm font-medium">{crypto.display_name}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Estimated {cryptoDetails.currency}:</span>{' '}
                          {(calculateTotal() / getCryptoPrice(cryptoDetails.currency)).toFixed(8)} {cryptoDetails.currency}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCryptoPayment(cryptoDetails.currency)}
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
                      >
                        <Bitcoin className="w-5 h-5" />
                        Continue to Payment Processing
                      </button>
                    </div>
                  )}

                  {/* Wire Transfer Form */}
                  {paymentMethod === 'wire' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="font-semibold text-blue-900 mb-4">Wire Transfer Instructions</h4>

                        <div className="bg-white rounded-xl p-4 mb-6">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Transfer:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reference Number:</span> SW{Date.now().toString().slice(-8)}
                          </p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700">
                          <p>1. Log in to your online banking</p>
                          <p>2. Add SkyWings Inc. as a payee</p>
                          <p>3. Transfer the exact amount shown above</p>
                          <p>4. Include the reference number in the notes</p>
                        </div>

                        <button
                          onClick={handleWireTransfer}
                          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all"
                        >
                          Continue to Payment Processing
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cash App Form */}
                  {paymentMethod === 'cashapp' && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with Cash App</h3>
                        <p className="text-gray-600 mb-6">
                          Send payment via Cash App to the details below.
                        </p>

                        <div className="bg-white rounded-xl p-4 mb-6 text-left">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Cash App Tag:</span> $SkyWings
                          </p>
                        </div>

                        <button
                          onClick={handleCashAppPayment}
                          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition font-semibold"
                        >
                          Continue to Payment Processing
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Venmo Form */}
                  {paymentMethod === 'venmo' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                        <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with Venmo</h3>
                        <p className="text-gray-600 mb-6">
                          Send payment via Venmo to the details below.
                        </p>

                        <div className="bg-white rounded-xl p-4 mb-6 text-left">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Venmo Username:</span> @SkyWings
                          </p>
                        </div>

                        <button
                          onClick={handleVenmoPayment}
                          className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-600 transition font-semibold"
                        >
                          Continue to Payment Processing
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Apple Pay Form */}
                  {paymentMethod === 'applepay' && (
                    <div className="space-y-6">
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Smartphone className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Apple Pay</h3>
                        <p className="text-gray-600 mb-6">Fast, secure, and private payment with Apple Pay.</p>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                        </div>

                        <button
                          onClick={handleApplePayPayment}
                          className="w-full bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition font-semibold"
                        >
                          Continue with Apple Pay
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Google Pay Form */}
                  {paymentMethod === 'googlepay' && (
                    <div className="space-y-6">
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Google Pay</h3>
                        <p className="text-gray-600 mb-6">Fast, secure, and simple checkout with Google Pay.</p>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Amount to Pay:</span> ${calculateTotal().toFixed(2)} USD
                          </p>
                        </div>

                        <button
                          onClick={handleGooglePayPayment}
                          className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-600 transition font-semibold"
                        >
                          Continue with Google Pay
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Security Note */}
                <p className="text-xs text-gray-400 text-center mt-6">
                  <Lock className="w-3 h-3 inline mr-1" />
                  All transactions are secure and encrypted. We never store your payment details.
                </p>
              </div>
            </div>

            {/* Order Summary */}
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

                {/* Warning about secure connection */}
                <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      This is a demo. No real payments will be processed. In production, this would use a secure payment gateway.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}