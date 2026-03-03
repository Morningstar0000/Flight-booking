import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plane,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Users,
    BarChart3,
    Bell,
    Search,
    CalendarCheck
} from 'lucide-react';
import AdminFlightsPage from './AdminFlightsPage';
import AdminPaymentMethodsPage from './AdminPaymentMethodsPage';
import AdminBookingsPage from './AdminBookingsPage';
import { adminAuthService } from '../services/adminAuthService';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('flights');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const tabs = [
        { id: 'flights', name: 'Flight Management', icon: <Plane className="w-5 h-5" /> },
        { id: 'bookings', name: 'Bookings', icon: <CalendarCheck className="w-5 h-5" /> },
        { id: 'payments', name: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ];

    const stats = [
        { label: 'Total Flights', value: '156', change: '+12%', icon: <Plane className="w-6 h-6" /> },
        { label: 'Active Payments', value: '8', change: '+2', icon: <CreditCard className="w-6 h-6" /> },
        { label: 'Bookings Today', value: '24', change: '+5', icon: <Users className="w-6 h-6" /> },
        { label: 'Revenue', value: '$12.4k', change: '+18%', icon: <BarChart3 className="w-6 h-6" /> },
    ];

    // Add logout function
    const handleLogout = () => {
        adminAuthService.logout();
        navigate('/admin/login');
    };



    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
                            </div>
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User menu */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                                    <p className="text-xs text-gray-500">admin@skywings.com</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar - Desktop (always visible) */}
                <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
                    <nav className="p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats in Sidebar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-500 mb-2">SYSTEM STATUS</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">API Status</span>
                                    <span className="text-green-600 font-medium">● Live</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Database</span>
                                    <span className="text-green-600 font-medium">● Connected</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Last Backup</span>
                                    <span className="text-gray-900 font-medium">2h ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Sidebar - Mobile (overlay) */}
                {sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <span className="font-bold text-gray-900">Menu</span>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>
                                            {tab.icon}
                                        </span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Tab Headers for Mobile (visible on small screens) */}
                        <div className="lg:hidden border-b border-gray-200">
                            <div className="flex p-2 gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {tab.icon}
                                            <span className="hidden sm:inline">{tab.name}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            {activeTab === 'flights' && <AdminFlightsPage />}
                            {activeTab === 'payments' && <AdminPaymentMethodsPage />}
                            {activeTab === 'bookings' && <AdminBookingsPage />}
                            {activeTab === 'settings' && (
                                <div className="text-center py-12">
                                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                                    <p className="text-gray-500">Coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}