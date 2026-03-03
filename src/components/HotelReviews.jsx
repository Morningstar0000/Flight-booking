import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  User, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Globe,
  Clock,
  MessageSquare,
  Filter,
  CheckCircle,
  Leaf,
  Send,
  X,
  Camera,
  MapPin,
  Heart,
  Check
} from 'lucide-react';

const HotelReviews = () => {
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const reviewsPerPage = 5;

  // Form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    country: '',
    stayDate: '',
    roomType: '',
    rating: 5,
    title: '',
    comment: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Sample review data
  const reviews = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      country: 'United States',
      rating: 5,
      date: '2026-02-15',
      stayDate: 'February 2026',
      roomType: 'Deluxe Ocean View',
      title: 'Absolutely perfect stay!',
      comment: 'The hotel exceeded all our expectations. The staff was incredibly friendly and helpful, the room was spotless with an amazing view, and the breakfast buffet was outstanding. Location is perfect - walking distance to all major attractions. Will definitely come back!',
      helpful: 24,
      notHelpful: 2,
      reply: {
        author: 'Hotel Management',
        date: '2026-02-16',
        comment: 'Dear Sarah, thank you so much for your wonderful review! We\'re thrilled to hear that you enjoyed your stay with us. It was our pleasure to have you, and we look forward to welcoming you back soon!'
      },
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&q=80'
      ]
    },
    {
      id: 2,
      author: 'Michael Chen',
      avatar: 'MC',
      country: 'Canada',
      rating: 4,
      date: '2026-02-10',
      stayDate: 'January 2026',
      roomType: 'Executive Suite',
      title: 'Great hotel with minor issues',
      comment: 'Overall a very pleasant stay. The room was spacious and comfortable, and the facilities were excellent. The only downside was the slow service at breakfast during peak hours. Other than that, everything was perfect.',
      helpful: 15,
      notHelpful: 1,
      photos: []
    },
    {
      id: 3,
      author: 'Emma Williams',
      avatar: 'EW',
      country: 'United Kingdom',
      rating: 5,
      date: '2026-02-05',
      stayDate: 'January 2026',
      roomType: 'Standard Room',
      title: 'Exceptional value for money',
      comment: 'This hotel offers amazing value. The rooms are modern and clean, the pool area is beautiful, and the location is very convenient. The staff went above and beyond to make our stay special. Highly recommended!',
      helpful: 31,
      notHelpful: 3,
      reply: {
        author: 'Hotel Management',
        date: '2026-02-06',
        comment: 'Dear Emma, thank you for your kind words! We\'re delighted that you enjoyed your stay and appreciated our service. We hope to see you again soon!'
      },
      photos: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=200&q=80'
      ]
    },
    {
      id: 4,
      author: 'David Rodriguez',
      avatar: 'DR',
      country: 'Spain',
      rating: 3,
      date: '2026-01-28',
      stayDate: 'January 2026',
      roomType: 'Family Room',
      title: 'Decent but not great',
      comment: 'The hotel is okay but nothing special. The room was a bit dated and the air conditioning was noisy. The location is good but the surrounding area felt a bit unsafe at night. Probably wouldn\'t stay here again.',
      helpful: 8,
      notHelpful: 12,
      photos: []
    },
    {
      id: 5,
      author: 'Lisa Thompson',
      avatar: 'LT',
      country: 'Australia',
      rating: 5,
      date: '2026-01-20',
      stayDate: 'December 2025',
      roomType: 'Premium Suite',
      title: 'Luxury at its finest!',
      comment: 'From the moment we arrived, we were treated like royalty. The suite was absolutely stunning with breathtaking views. The spa treatments were heavenly and the restaurants were world-class. Worth every penny!',
      helpful: 42,
      notHelpful: 0,
      reply: {
        author: 'Hotel Management',
        date: '2026-01-21',
        comment: 'Dear Lisa, thank you for choosing our hotel and for this amazing review! We\'re so glad you enjoyed the luxury experience. We can\'t wait to welcome you back!'
      },
      photos: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=80'
      ]
    }
  ];

  // Toast notification component
  const Toast = ({ message, onClose }) => (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 flex items-center gap-4 min-w-[320px]">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Review Submitted!</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => 
    reviews.filter(r => r.rating === stars).length
  );

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => 
    filterRating === 'all' || review.rating === parseInt(filterRating)
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const getRatingPercent = (rating) => {
    return ((ratingCounts[5 - rating] / totalReviews) * 100).toFixed(0);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!reviewForm.name.trim()) errors.name = 'Name is required';
    if (!reviewForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.email)) {
      errors.email = 'Invalid email format';
    }
    if (!reviewForm.country) errors.country = 'Country is required';
    if (!reviewForm.stayDate) errors.stayDate = 'Stay date is required';
    if (!reviewForm.roomType) errors.roomType = 'Room type is required';
    if (!reviewForm.title.trim()) errors.title = 'Review title is required';
    if (!reviewForm.comment.trim()) {
      errors.comment = 'Review comment is required';
    } else if (reviewForm.comment.length < 20) {
      errors.comment = 'Comment must be at least 20 characters';
    }
    if (!reviewForm.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms';
    }

    return errors;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Here you would typically send the review to your backend
    console.log('Review submitted:', reviewForm);
    console.log('Photos:', selectedPhotos);

    // Close modal and reset form
    setIsModalOpen(false);
    setReviewForm({
      name: '',
      email: '',
      country: '',
      stayDate: '',
      roomType: '',
      rating: 5,
      title: '',
      comment: '',
      agreeToTerms: false
    });
    setSelectedPhotos([]);
    setFormErrors({});

    // Show toast notification
    setToastMessage('Thank you for your review! It will be published after moderation.');
    setShowToast(true);

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-emerald-50/30">
      {/* Toast Notification */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}

      <div className="max-w-7xl mx-auto">
        {/* Section Header - Green Theme */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Guest Experiences
            </span>
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            What Our{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Guests Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Real stories from travelers who've experienced our eco-friendly hospitality
          </p>
        </div>

        {/* Rating Summary Cards - Green Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Overall Rating */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-emerald-200/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Overall Rating</span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-emerald-700">{averageRating}</span>
              <div className="mb-1">
                <div className="flex gap-0.5">
                  {renderStars(Math.round(parseFloat(averageRating)))}
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-emerald-200/20 hover:shadow-lg transition-all duration-300 md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{rating} ★</span>
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                      style={{ width: `${getRatingPercent(rating)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12">{ratingCounts[5 - rating]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-emerald-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
              <div className="flex gap-2 flex-wrap">
                {['all', 5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating.toString())}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterRating === rating.toString()
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {rating === 'all' ? 'All' : `${rating} ★`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-emerald-200/20 hover:shadow-lg transition-all duration-300">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar with green gradient */}
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-200">
                    {review.avatar}
                  </div>
                  
                  {/* Author Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Globe className="w-3 h-3 text-emerald-500" />
                      <span>{review.country}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 text-emerald-500" />
                      <span>Stayed {review.stayDate}</span>
                    </div>
                  </div>
                </div>

                {/* Rating - Yellow stars */}
                <div className="text-right">
                  <div className="flex gap-0.5 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-gray-400">{review.roomType}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="ml-16">
                <h5 className="font-semibold text-lg text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>

                {/* Review Photos */}
                {review.photos.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.photos.map((photo, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-emerald-100">
                        <img src={photo} alt="Review" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span>({review.notHelpful})</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Hotel Reply */}
                {review.reply && (
                  <div className="mt-4 pl-4 border-l-4 border-emerald-300 bg-emerald-50/50 rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">{review.reply.author}</span>
                      <span className="text-xs text-gray-500">{review.reply.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.reply.comment}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-emerald-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'border border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-emerald-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Write Review CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Have you stayed at this hotel? Share your experience!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Write a Review</h2>
                      <p className="text-emerald-100 text-sm">Share your experience with others</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        type="text"
                        name="name"
                        value={reviewForm.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          formErrors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        type="email"
                        name="email"
                        value={reviewForm.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          formErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <select
                        name="country"
                        value={reviewForm.country}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none bg-white ${
                          formErrors.country
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                      >
                        <option value="">Select your country</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {formErrors.country && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stay Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        type="month"
                        name="stayDate"
                        value={reviewForm.stayDate}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          formErrors.stayDate
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                      />
                    </div>
                    {formErrors.stayDate && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.stayDate}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        type="text"
                        name="roomType"
                        value={reviewForm.roomType}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          formErrors.roomType
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                        placeholder="e.g., Deluxe Ocean View, Standard Room"
                      />
                    </div>
                    {formErrors.roomType && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.roomType}</p>
                    )}
                  </div>
                </div>

                {/* Rating - Yellow stars */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                        className="group focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            rating <= reviewForm.rating
                              ? 'text-yellow-400 fill-current scale-110'
                              : 'text-gray-300 group-hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={reviewForm.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      formErrors.title
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="Summarize your experience"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    name="comment"
                    rows="5"
                    value={reviewForm.comment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all resize-none ${
                      formErrors.comment
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="Tell us about your stay... (minimum 20 characters)"
                  />
                  {formErrors.comment && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {reviewForm.comment.length}/20 characters minimum
                  </p>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-emerald-500 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload photos</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</span>
                    </label>
                  </div>

                  {/* Photo Preview */}
                  {selectedPhotos.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {selectedPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={reviewForm.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label className="text-sm text-gray-600">
                    I confirm that this review is based on my own experience and I agree to the{' '}
                    <a href="#" className="text-emerald-600 hover:underline">Review Guidelines</a>
                    {' '}and{' '}
                    <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
                  </label>
                </div>
                {formErrors.agreeToTerms && (
                  <p className="text-red-500 text-xs -mt-2">{formErrors.agreeToTerms}</p>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
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
    </section>
  );
};

export default HotelReviews;