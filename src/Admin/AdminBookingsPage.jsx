import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Plane,
  User,
  CreditCard,
  X
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { supabase } from '../services/supabaseClient';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [editForm, setEditForm] = useState({
    booking_status: '',
    payment_status: '',
    seat_number: '',
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
    passenger_passport: ''
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, bookings]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, flights(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
      setFilteredBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      showNotification('Error loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.booking_reference.toLowerCase().includes(term) ||
        booking.passenger_name?.toLowerCase().includes(term) ||
        booking.passenger_email?.toLowerCase().includes(term) ||
        booking.flight_details?.flightNumber?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      booking_status: booking.booking_status || 'confirmed',
      payment_status: booking.payment_status || 'completed',
      seat_number: booking.seat_number || '',
      passenger_name: booking.passenger_name || '',
      passenger_email: booking.passenger_email || '',
      passenger_phone: booking.passenger_phone || '',
      passenger_passport: booking.passenger_passport || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    try {
      await bookingService.updateBooking(selectedBooking.booking_reference, editForm);
      showNotification('Booking updated successfully');
      setShowEditModal(false);
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      showNotification('Error updating booking', 'error');
    }
  };

  const handleDeleteBooking = async (bookingRef) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

    try {
      await bookingService.deleteBooking(bookingRef);
      showNotification('Booking deleted successfully');
      loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      showNotification('Error deleting booking', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-700 border-green-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Toast Component
  const Toast = () => (
    <div className={`fixed bottom-6 right-6 z-50 ${
      toastType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    } border rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px] animate-slideUp`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        toastType === 'success' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {toastType === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${toastType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
          {toastType === 'success' ? 'Success!' : 'Error!'}
        </p>
        <p className={`text-sm ${toastType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {toastMessage}
        </p>
      </div>
      <button
        onClick={() => setShowToast(false)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showToast && <Toast />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600 mt-1">View, edit, and manage all customer bookings</p>
          </div>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <p className="text-sm text-gray-500 mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.booking_status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {bookings.filter(b => b.booking_status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <p className="text-sm text-gray-500 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-600">
              {bookings.filter(b => b.booking_status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by reference, name, email, or flight..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Passenger</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Flight</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-blue-600">
                          {booking.booking_reference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.passenger_name}</div>
                        <div className="text-xs text-gray-500">{booking.passenger_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.flight_details?.flightNumber}</div>
                        <div className="text-xs text-gray-500">
                          {booking.flight_details?.from?.code} → {booking.flight_details?.to?.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(booking.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">${booking.total_price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.booking_status)}`}>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditBooking(booking)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.booking_reference)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Booking Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                    <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Booking details content - similar to view in MyBookings */}
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedBooking, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Edit Booking</h2>
                    <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateBooking(); }} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                      <select
                        value={editForm.booking_status}
                        onChange={(e) => setEditForm({...editForm, booking_status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                      <select
                        value={editForm.payment_status}
                        onChange={(e) => setEditForm({...editForm, payment_status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seat Number</label>
                      <input
                        type="text"
                        value={editForm.seat_number}
                        onChange={(e) => setEditForm({...editForm, seat_number: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 24A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Name</label>
                      <input
                        type="text"
                        value={editForm.passenger_name}
                        onChange={(e) => setEditForm({...editForm, passenger_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.passenger_email}
                        onChange={(e) => setEditForm({...editForm, passenger_email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={editForm.passenger_phone}
                        onChange={(e) => setEditForm({...editForm, passenger_phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                      <input
                        type="text"
                        value={editForm.passenger_passport}
                        onChange={(e) => setEditForm({...editForm, passenger_passport: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg"
                    >
                      Update Booking
                    </button>
                  </div>
                </form>
              </div>
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