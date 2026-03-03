import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  CreditCard,
  Wallet,
  Bitcoin,
  Landmark,
  Smartphone,
  Globe,
  ArrowUp,
  ArrowDown,
  RefreshCw,
   CheckCircle,
  AlertCircle,
  X
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

export default function AdminPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    method_type: 'card',
    display_name: '',
    icon: 'CreditCard',
    description: '',
    is_active: true,
    sort_order: 0,
    payment_details: {},
    instructions: []
  });

  const [instructionInput, setInstructionInput] = useState('');

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAllPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      showNotification('Error loading payment methods', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      method_type: 'card',
      display_name: '',
      icon: 'CreditCard',
      description: '',
      is_active: true,
      sort_order: paymentMethods.length,
      payment_details: {},
      instructions: []
    });
    setInstructionInput('');
    setShowModal(true);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      method_type: method.method_type,
      display_name: method.display_name,
      icon: method.icon,
      description: method.description || '',
      is_active: method.is_active,
      sort_order: method.sort_order,
      payment_details: method.payment_details || {},
      instructions: method.instructions || []
    });
    setInstructionInput('');
    setShowModal(true);
  };

  const handleDeleteMethod = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) return;
    
    setDeletingId(id);
    try {
      await paymentService.deletePaymentMethod(id);
      showNotification('Payment method deleted successfully');
      await loadPaymentMethods(); // Refresh the list
    } catch (error) {
      console.error('Error deleting payment method:', error);
      showNotification('Error deleting payment method', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (method) => {
    setTogglingId(method.id);
    try {
      const newStatus = !method.is_active;
      await paymentService.togglePaymentMethodStatus(method.id, newStatus);
      showNotification(`${method.display_name} ${newStatus ? 'activated' : 'deactivated'}`);
      await loadPaymentMethods(); // Refresh the list
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('Error updating status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const methods = [...paymentMethods];
    [methods[index - 1], methods[index]] = [methods[index], methods[index - 1]];
    
    // Update sort orders
    methods.forEach((method, idx) => {
      method.sort_order = idx;
    });
    
    setPaymentMethods(methods);
    
    try {
      // Update in database
      await Promise.all([
        paymentService.updatePaymentMethod(methods[index - 1].id, { sort_order: index - 1 }),
        paymentService.updatePaymentMethod(methods[index].id, { sort_order: index })
      ]);
      showNotification('Order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Error updating order', 'error');
      loadPaymentMethods(); // Reload to revert changes
    }
  };

  const handleMoveDown = async (index) => {
    if (index === paymentMethods.length - 1) return;
    
    const methods = [...paymentMethods];
    [methods[index], methods[index + 1]] = [methods[index + 1], methods[index]];
    
    // Update sort orders
    methods.forEach((method, idx) => {
      method.sort_order = idx;
    });
    
    setPaymentMethods(methods);
    
    try {
      await Promise.all([
        paymentService.updatePaymentMethod(methods[index].id, { sort_order: index }),
        paymentService.updatePaymentMethod(methods[index + 1].id, { sort_order: index + 1 })
      ]);
      showNotification('Order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Error updating order', 'error');
      loadPaymentMethods();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMethod) {
        await paymentService.updatePaymentMethod(editingMethod.id, formData);
        showNotification('Payment method updated successfully');
      } else {
        await paymentService.createPaymentMethod(formData);
        showNotification('Payment method added successfully');
      }
      setShowModal(false);
      await loadPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      showNotification('Error saving payment method', 'error');
    }
  };

  const addInstruction = () => {
    if (instructionInput.trim()) {
      setFormData({
        ...formData,
        instructions: [...(formData.instructions || []), instructionInput.trim()]
      });
      setInstructionInput('');
    }
  };

  const removeInstruction = (index) => {
    setFormData({
      ...formData,
      instructions: (formData.instructions || []).filter((_, i) => i !== index)
    });
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || <CreditCard className="w-5 h-5" />;
  };

  // Toast Component
  const Toast = () => (
    <div className={`fixed bottom-6 right-6 z-50 animate-slideUp ${
      toastType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    } border rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px]`}>
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
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600 mt-1">Manage payment options for your customers</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={loadPaymentMethods}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleAddMethod}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">Active (shown to users)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded opacity-60"></div>
              <span className="text-gray-600">Inactive (hidden from users)</span>
            </div>
            <div className="flex items-center gap-2">
              <ToggleRight className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">Toggle to show/hide</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">Permanently delete</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div
                key={method.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
                  method.is_active 
                    ? 'border-green-200 hover:shadow-lg' 
                    : 'border-gray-200 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getIconComponent(method.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.display_name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{method.method_type}</p>
                      </div>
                    </div>
                    
                    {/* Status Toggle Button */}
                    <button
                      onClick={() => handleToggleStatus(method)}
                      disabled={togglingId === method.id}
                      className={`p-2 rounded-lg transition-colors relative ${
                        method.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={method.is_active ? 'Click to hide from users' : 'Click to show to users'}
                    >
                      {togglingId === method.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      ) : method.is_active ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{method.description}</p>

                  {/* Preview based on method type */}
                  {method.method_type === 'crypto' && method.payment_details?.wallet_address && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-mono truncate">
                        {method.payment_details.wallet_address}
                      </p>
                    </div>
                  )}

                  {method.method_type === 'wire' && method.payment_details?.bank_name && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium">{method.payment_details.bank_name}</p>
                      <p className="text-xs text-gray-500 mt-1">Acct: {method.payment_details.account_number}</p>
                    </div>
                  )}

                  {method.method_type === 'cashapp' && method.payment_details?.cashtag && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium">{method.payment_details.cashtag}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMethod(method)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMethod(method.id)}
                        disabled={deletingId === method.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete permanently"
                      >
                        {deletingId === method.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === paymentMethods.length - 1}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-3 text-xs text-center">
                    <span className={`px-2 py-1 rounded-full ${
                      method.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {method.is_active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal - Keep your existing modal code here */}
        
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-3xl">
                  <h2 className="text-2xl font-bold text-white">
                    {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                  </h2>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., btc, paypal, wire"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Bitcoin (BTC)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Method Type *</label>
                      <select
                        required
                        value={formData.method_type}
                        onChange={(e) => setFormData({...formData, method_type: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="wire">Wire Transfer</option>
                        <option value="cashapp">Cash App</option>
                        <option value="venmo">Venmo</option>
                        <option value="applepay">Apple Pay</option>
                        <option value="googlepay">Google Pay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CreditCard">Credit Card</option>
                        <option value="Wallet">Wallet</option>
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="Landmark">Bank</option>
                        <option value="Smartphone">Mobile</option>
                        <option value="Globe">Globe</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of this payment method"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Payment Details - Dynamic based on type */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                    
                    {formData.method_type === 'crypto' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                          <input
                            type="text"
                            value={formData.payment_details.wallet_address || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                wallet_address: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Wallet address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                          <input
                            type="text"
                            value={formData.payment_details.network || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                network: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="e.g., ERC-20, TRC-20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min Confirmations</label>
                          <input
                            type="number"
                            value={formData.payment_details.min_confirmations || 3}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                min_confirmations: parseInt(e.target.value)
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {formData.method_type === 'wire' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                          <input
                            type="text"
                            value={formData.payment_details.bank_name || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                bank_name: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                          <input
                            type="text"
                            value={formData.payment_details.account_name || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                account_name: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                          <input
                            type="text"
                            value={formData.payment_details.account_number || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                account_number: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                          <input
                            type="text"
                            value={formData.payment_details.routing_number || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                routing_number: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {formData.method_type === 'cashapp' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cashtag</label>
                          <input
                            type="text"
                            value={formData.payment_details.cashtag || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                cashtag: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="$SkyWings"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="text"
                            value={formData.payment_details.phone || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                phone: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {formData.method_type === 'paypal' && (
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email</label>
                          <input
                            type="email"
                            value={formData.payment_details.email || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment_details: {
                                ...formData.payment_details,
                                email: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="payments@skywings.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
                    
                    <div className="space-y-4">
                      {formData.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm">
                            {instruction}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={instructionInput}
                          onChange={(e) => setInstructionInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Add an instruction step..."
                        />
                        <button
                          type="button"
                          onClick={addInstruction}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg"
                    >
                      {editingMethod ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







