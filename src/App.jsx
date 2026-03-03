import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import './index.css'
import HomePage from './pages/HomePage'
import HotelsPage from './pages/HotelsPage'
import CarsPage from './pages/CarsPage'
import DealsPage from './pages/DealsPage'
import ResultsPage from './pages/ResultsPage'
import PassengerDetailsPage from './pages/PassengerDetailsPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import MyBookingsPage from './pages/MyBookingsPage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import PackageSummaryPage from './pages/PackageSummaryPage'
import FlightSummaryPage from './pages/FlightSummaryPage'
import FlightTrackerPage from './pages/FlightTrackerPage'
import AdminFlightsPage from './Admin/AdminFlightsPage'
import PaymentProcessingPage from './pages/PaymentProcessingPage'
import AdminDashboard from './Admin/AdminDashboard'
import AdminLoginPage from './Admin/AdminLoginPage'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import GlobalLoader from './components/GlobalLoader'
import { NavigationProvider } from './context/NavigationContext'

// Simple fallback loader while components load
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
)

export default function App() {
  return (
    <Router>
      <NavigationProvider>
        <GlobalLoader />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotel-details" element={<HotelDetailsPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/flight-summary" element={<FlightSummaryPage />} />
            <Route path="/package-summary" element={<PackageSummaryPage />} />
            <Route path="/passenger-details" element={<PassengerDetailsPage />} />
            <Route path="/passenger-details/:flightId" element={<PassengerDetailsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/flight-tracker" element={<FlightTrackerPage />} />
            <Route path="/payment-processing" element={<PaymentProcessingPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </Suspense>
      </NavigationProvider>
    </Router>
  )
}