import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Plane,
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    Users,
    AlertCircle,
    CheckCircle,
    X,
    PlayCircle
} from 'lucide-react'
import { flightService } from '../services/flightService'
import { flightRoutes } from '../services/flightResultsData'
import FlightSimulator from '../components/FlightSimulator';
import LocationAutocomplete from '../components/LocationAutocomplete'

export default function AdminFlightsPage() {
    const navigate = useNavigate()
    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingFlight, setEditingFlight] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('success')
    const [simulatorFlight, setSimulatorFlight] = useState(null);
    const [filter, setFilter] = useState({
        airline: '',
        from: '',
        to: ''
    })

    // Form state for adding/editing flights
    const [flightForm, setFlightForm] = useState({
        airline: '',
        airline_code: '',
        flight_number: '',
        from_code: '',
        from_city: '',
        from_airport: '',
        from_country: '',
        from_country_code: '',
        from_terminal: '',
        to_code: '',
        to_city: '',
        to_airport: '',
        to_country: '',
        to_country_code: '',
        to_terminal: '',
        departure_time: '',
        arrival_time: '',
        duration: '',
        stops: 0,
        stop_info: '',
        price: '',
        cabin_class: 'Economy',
        seats: '',
        aircraft: '',
        date: '',
         from_display: '',
    to_display: '',
    })

    // Load flights on component mount
    useEffect(() => {
        loadFlights()
    }, [])

    const loadFlights = async () => {
        setLoading(true)
        try {
            const data = await flightService.getFlights()
            setFlights(data)
        } catch (error) {
            console.error('Error loading flights:', error)
            showNotification('Error loading flights', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showNotification = (message, type = 'success') => {
        setToastMessage(message)
        setToastType(type)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const handleSearch = async () => {
        if (!searchTerm) {
            loadFlights()
            return
        }

        setLoading(true)
        try {
            const results = await flightService.searchFlights(searchTerm)
            setFlights(results)
        } catch (error) {
            console.error('Error searching flights:', error)
            showNotification('Error searching flights', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAddFlight = () => {
        setEditingFlight(null)
        setFlightForm({
            airline: '',
            airline_code: '',
            flight_number: '',
            from_code: '',
            from_city: '',
            from_airport: '',
            from_country: '',
            from_country_code: '',
            from_terminal: '',
            to_code: '',
            to_city: '',
            to_airport: '',
            to_country: '',
            to_country_code: '',
            to_terminal: '',
            departure_time: '',
            arrival_time: '',
            duration: '',
            stops: 0,
            stop_info: '',
            price: '',
            cabin_class: 'Economy',
            seats: '',
            aircraft: '',
            date: '',
            
        })
        setShowModal(true)
    }

    const handleEditFlight = (flight) => {
        console.log('🔍 EDIT FLIGHT - Raw data:', flight);
        console.log('🔍 EDIT FLIGHT - Fields:', Object.keys(flight));
        console.log('Editing flight:', flight); // Debug log
        setEditingFlight(flight)
        setFlightForm({
            airline: flight.airline || '',
            airline_code: flight.airline_code || '',
            flight_number: flight.flight_number || '',
            from_code: flight.from_code || '',
            from_city: flight.from_city || '',
            from_airport: flight.from_airport || '',
            from_country: flight.from_country || '',
            from_country_code: flight.from_country_code || '',
            from_terminal: flight.from_terminal || '',
            to_code: flight.to_code || '',
            to_city: flight.to_city || '',
            to_airport: flight.to_airport || '',
            to_country: flight.to_country || '',
            to_country_code: flight.to_country_code || '',
            to_terminal: flight.to_terminal || '',
            departure_time: flight.departure_time || '',
            arrival_time: flight.arrival_time || '',
            duration: flight.duration || '',
            stops: flight.stops || 0,
            stop_info: flight.stop_info || '',
            price: flight.price || '',
            cabin_class: flight.cabin_class || 'Economy',
            seats: flight.seats || '',
            aircraft: flight.aircraft || '',
            date: flight.date || '',
             from_display: `${flight.from_city} (${flight.from_code})`,
        to_display: `${flight.to_city} (${flight.to_code})`,
        })
        setShowModal(true)
    }

    const handleDeleteFlight = async (id) => {
        if (!window.confirm('Are you sure you want to delete this flight?')) return

        try {
            await flightService.deleteFlight(id)
            showNotification('Flight deleted successfully')
            loadFlights()
        } catch (error) {
            console.error('Error deleting flight:', error)
            showNotification('Error deleting flight', 'error')
        }
    }

   const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        // Create a copy of flightForm without the display fields
        const { from_display, to_display, ...flightData } = flightForm;
        
        if (editingFlight) {
            await flightService.updateFlight(editingFlight.id, flightData)
            showNotification('Flight updated successfully')
        } else {
            await flightService.createFlight(flightData)
            showNotification('Flight added successfully')
        }
        setShowModal(false)
        loadFlights()
    } catch (error) {
        console.error('Error saving flight:', error)
        showNotification('Error saving flight', 'error')
    }
}

    const handleBulkImport = async () => {
        if (!window.confirm('This will import all flights from flightResultsData.js. Continue?')) return

        setLoading(true)
        try {
            // Transform flightRoutes to match database schema
            const flightsToImport = flightRoutes.map(flight => ({
                airline: flight.airline,
                airline_code: flight.airlineCode,
                flight_number: flight.flightNumber,
                from_code: flight.from.code,
                from_city: flight.from.city,
                from_airport: flight.from.airport,
                from_country: flight.from.country,
                from_country_code: flight.from.countryCode,
                from_terminal: flight.from.terminal,
                to_code: flight.to.code,
                to_city: flight.to.city,
                to_airport: flight.to.airport,
                to_country: flight.to.country,
                to_country_code: flight.to.countryCode,
                to_terminal: flight.to.terminal,
                departure_time: flight.departureTime,
                arrival_time: flight.arrivalTime,
                duration: flight.duration,
                stops: flight.stops,
                stop_info: flight.stopInfo,
                price: flight.price,
                cabin_class: flight.cabinClass,
                seats: flight.seats,
                aircraft: flight.aircraft,
                date: flight.date
            }))

            await flightService.bulkImportFlights(flightsToImport)
            showNotification(`Successfully imported ${flightsToImport.length} flights`)
            loadFlights()
        } catch (error) {
            console.error('Error importing flights:', error)
            showNotification('Error importing flights', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Add function to open simulator
    const handleOpenSimulator = (flight) => {
        setSimulatorFlight(flight);
    };

    // Toast Component
    const Toast = () => (
        <div className={`fixed bottom-6 right-6 z-50 animate-slideUp ${toastType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px]`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {toastType === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                )}
            </div>
            <div className="flex-1">
                <p className={`font-semibold ${toastType === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {toastType === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className={`text-sm ${toastType === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>{toastMessage}</p>
            </div>
            <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Notification */}
            {showToast && <Toast />}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Flight Management</h1>
                        <p className="text-gray-600 mt-1">Add, edit, or remove flights from the database</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleBulkImport}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Bulk Import
                        </button>
                        <button
                            onClick={handleAddFlight}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Flight
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by flight number, airline, or city..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Flights Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Flight</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Route</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
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
                                ) : flights.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No flights found
                                        </td>
                                    </tr>
                                ) : (
                                    flights.map((flight) => (
                                        <tr key={flight.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{flight.flight_number}</div>
                                                <div className="text-sm text-gray-500">{flight.airline}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{flight.from_code} → {flight.to_code}</div>
                                                <div className="text-xs text-gray-500">{flight.from_city} to {flight.to_city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{flight.departure_time}</div>
                                                <div className="text-xs text-gray-500">{flight.arrival_time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {flight.duration}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-green-600">${flight.price}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{flight.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditFlight(flight)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit flight"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFlight(flight.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete flight"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenSimulator(flight)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Flight Simulator"
                                                    >
                                                        <PlayCircle className="w-4 h-4" />
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

                {/* Add/Edit Flight Modal */}
                {/* Add/Edit Flight Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />

                        <div className="relative min-h-screen flex items-center justify-center p-4">
                            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                                {/* Modal Header */}
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                                <Plane className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                                                </h2>
                                                <p className="text-blue-100 text-sm">
                                                    {editingFlight ? 'Update flight information' : 'Enter new flight details'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                                    {/* Airline Information Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Plane className="w-5 h-5 text-blue-600" />
                                            Airline Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Airline Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={flightForm.airline}
                                                    onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., British Airways"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Airline Code *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={flightForm.airline_code}
                                                    onChange={(e) => setFlightForm({ ...flightForm, airline_code: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., BA"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={flightForm.flight_number}
                                                    onChange={(e) => setFlightForm({ ...flightForm, flight_number: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., BA456"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
                                                <input
                                                    type="text"
                                                    value={flightForm.aircraft}
                                                    onChange={(e) => setFlightForm({ ...flightForm, aircraft: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., Airbus A320"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Departure Information Section */}
                                    {/* Departure Information Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Departure Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* From Airport Autocomplete */}
                                            <div className="md:col-span-2">
                                                <LocationAutocomplete
                                                    label="From Airport"
                                                    value={flightForm.from_display || ''}
                                                    onSelect={(location) => {
                                                        setFlightForm({
                                                            ...flightForm,
                                                            from_code: location.code,
                                                            from_city: location.city,
                                                            from_airport: location.name,
                                                            from_country: location.country,
                                                            from_display: location.displayName
                                                        });
                                                    }}
                                                    placeholder="Search for departure airport..."
                                                />
                                            </div>

                                            {/* Manual fields (populated automatically from autocomplete) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Airport Code</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.from_code}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From City</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.from_city}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Airport Name</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.from_airport}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Country</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.from_country}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Terminal</label>
                                                <input
                                                    type="text"
                                                    value={flightForm.from_terminal}
                                                    onChange={(e) => setFlightForm({ ...flightForm, from_terminal: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., 5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrival Information Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Arrival Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* To Airport Autocomplete */}
                                            <div className="md:col-span-2">
                                                <LocationAutocomplete
                                                    label="To Airport"
                                                    value={flightForm.to_display || ''}
                                                    onSelect={(location) => {
                                                        setFlightForm({
                                                            ...flightForm,
                                                            to_code: location.code,
                                                            to_city: location.city,
                                                            to_airport: location.name,
                                                            to_country: location.country,
                                                            to_display: location.displayName
                                                        });
                                                    }}
                                                    placeholder="Search for arrival airport..."
                                                    excludeCode={flightForm.from_code} // Prevent selecting same airport
                                                />
                                            </div>

                                            {/* Manual fields (populated automatically from autocomplete) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To Airport Code</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.to_code}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To City</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.to_city}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To Airport Name</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.to_airport}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To Country</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={flightForm.to_country}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                                                    placeholder="Auto-filled"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To Terminal</label>
                                                <input
                                                    type="text"
                                                    value={flightForm.to_terminal}
                                                    onChange={(e) => setFlightForm({ ...flightForm, to_terminal: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., 2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule Information */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            Schedule Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time *</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={flightForm.departure_time}
                                                    onChange={(e) => setFlightForm({ ...flightForm, departure_time: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time *</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={flightForm.arrival_time}
                                                    onChange={(e) => setFlightForm({ ...flightForm, arrival_time: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={flightForm.duration}
                                                    onChange={(e) => setFlightForm({ ...flightForm, duration: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., 1h 20m"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={flightForm.date}
                                                    onChange={(e) => setFlightForm({ ...flightForm, date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stops Information */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            Stops Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stops</label>
                                                <input
                                                    type="number"
                                                    value={flightForm.stops}
                                                    onChange={(e) => setFlightForm({ ...flightForm, stops: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Stop Information</label>
                                                <input
                                                    type="text"
                                                    value={flightForm.stop_info}
                                                    onChange={(e) => setFlightForm({ ...flightForm, stop_info: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., 1 stop in AMS"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Information */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                            Pricing Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={flightForm.price}
                                                    onChange={(e) => setFlightForm({ ...flightForm, price: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="299"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Class</label>
                                                <select
                                                    value={flightForm.cabin_class}
                                                    onChange={(e) => setFlightForm({ ...flightForm, cabin_class: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Economy">Economy</option>
                                                    <option value="Premium Economy">Premium Economy</option>
                                                    <option value="Business">Business</option>
                                                    <option value="First">First</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Available Seats</label>
                                                <input
                                                    type="number"
                                                    value={flightForm.seats}
                                                    onChange={(e) => setFlightForm({ ...flightForm, seats: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="52"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                                        >
                                            {editingFlight ? 'Update Flight' : 'Add Flight'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Flight Simulator Modal - THIS IS THE FIX - Place it outside the main container but inside the return */}
            {simulatorFlight && (
                <FlightSimulator
                    flight={simulatorFlight}
                    onClose={() => setSimulatorFlight(null)}
                    onUpdate={(updatedFlight) => {
                        // Update the flight in the list
                        setFlights(prev => prev.map(f =>
                            f.id === updatedFlight.id ? updatedFlight : f
                        ));
                    }}
                />
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
        </div>
    )
}