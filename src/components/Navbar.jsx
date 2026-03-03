import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    Calendar,
    Menu,
    X,
    Plane,
    Hotel,
    Map,
    BookOpen,
    Settings,
} from 'lucide-react'
import { useNavigation } from '../context/NavigationContext' // Add this import

export default function Navbar() {
    const navigate = useNavigate();
    const { startNavigation } = useNavigation(); // Add this
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle navigation with loader
    const handleNavigate = (to) => {
        startNavigation();
        navigate(to);
    };

    // Handle external link click (admin)
    const handleExternalClick = () => {
        startNavigation();
        // Small delay to show loader before opening new tab
        setTimeout(() => {
            window.open('/admin', '_blank');
        }, 100);
    };

    // Add scroll effect for navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { to: '/', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
        { to: '/hotels', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
        { to: '/flight-tracker', label: 'Flight Tracker', icon: <Map className="w-4 h-4" /> },
        
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2'
            : 'bg-white/95 backdrop-blur-sm py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo with enhanced design */}
                    {/* Logo with enhanced design */}
                    <button
                        onClick={() => handleNavigate('/')}
                        className="flex items-center gap-2 md:gap-3 group relative"
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src="/stayfly-logo.png"
                                alt="StayFly"
                                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                            />
                            {/* Subtle glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[6px] md:text-[7px] lg:text-[8px] text-gray-400 tracking-[0.2em] whitespace-nowrap font-medium">
                                TRAVEL BEYOND
                            </span>
                        </div>
                    </button>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            link.external ? (
                                <button
                                    key={link.to}
                                    onClick={handleExternalClick}
                                    className={`
                    relative group px-4 py-2 rounded-xl font-medium transition-all duration-300
                    ${link.isAdmin
                                            ? 'text-purple-600 hover:bg-purple-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }
                  `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={link.isAdmin ? 'text-purple-500' : 'text-gray-500 group-hover:text-blue-500'}>
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </span>
                                    {/* Animated underline */}
                                    <span className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 
                    transition-all duration-300 group-hover:w-full
                    ${link.isAdmin ? 'bg-purple-500' : 'bg-blue-500'}
                  `}></span>
                                </button>
                            ) : (
                                <button
                                    key={link.to}
                                    onClick={() => handleNavigate(link.to)}
                                    className={`
                    relative group px-4 py-2 rounded-xl font-medium transition-all duration-300
                    ${link.isAdmin
                                            ? 'text-purple-600 hover:bg-purple-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }
                  `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={link.isAdmin ? 'text-purple-500' : 'text-gray-500 group-hover:text-blue-500'}>
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </span>
                                    {/* Animated underline */}
                                    <span className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 
                    transition-all duration-300 group-hover:w-full
                    ${link.isAdmin ? 'bg-purple-500' : 'bg-blue-500'}
                              `}></span>
                                </button>
                            )
                        ))}
                    </div>

                    {/* Right Side - My Bookings Button */}
                    <div className="hidden lg:block">
                        <button
                            onClick={() => handleNavigate('/my-bookings')}
                            className="relative group flex items-center gap-3 px-5 py-2 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Gradient Background with Animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>

                            {/* Content */}
                            <Calendar className="relative w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span className="relative text-sm">My Bookings</span>

                            {/* Badge */}
                            <span className="relative w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        </button>
                    </div>

                    {/* Mobile Menu Button - Enhanced */}
                    <div className="lg:hidden relative z-50">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity"></div>
                            {isMenuOpen ? (
                                <X className="h-5 w-5 md:h-6 md:w-6 transform rotate-90 transition-transform duration-300" />
                            ) : (
                                <Menu className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Enhanced Glass Effect */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 lg:hidden">
                    {/* Backdrop blur overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu content with enhanced glass effect */}
                    <div className="relative z-50 mx-4 mt-2 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden animate-slideDown">
                        <div className="p-4">
                            {/* Navigation Links */}
                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    link.external ? (
                                        <button
                                            key={link.to}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleExternalClick();
                                            }}
                                            className={`
                        w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
                        ${link.isAdmin
                                                    ? 'hover:bg-purple-50 text-purple-700'
                                                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                                                }
                      `}
                                        >
                                            <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${link.isAdmin
                                                    ? 'bg-purple-100 text-purple-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                }
                      `}>
                                                {link.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{link.label}</p>
                                                <p className="text-xs text-gray-400">
                                                    {link.isAdmin ? 'Administration panel' : `Manage your ${link.label.toLowerCase()}`}
                                                </p>
                                            </div>
                                            {link.isAdmin && (
                                                <span className="ml-auto text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>New Tab</span>
                                                    <span>↗</span>
                                                </span>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            key={link.to}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleNavigate(link.to);
                                            }}
                                            className={`
                        w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
                        ${link.isAdmin
                                                    ? 'hover:bg-purple-50 text-purple-700'
                                                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                                                }
                      `}
                                        >
                                            <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${link.isAdmin
                                                    ? 'bg-purple-100 text-purple-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                }
                      `}>
                                                {link.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{link.label}</p>
                                                <p className="text-xs text-gray-400">
                                                    {link.isAdmin ? 'Administration panel' : `Manage your ${link.label.toLowerCase()}`}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                ))}
                            </div>

                            {/* Divider with gradient */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-xs text-gray-400">QUICK ACTION</span>
                                </div>
                            </div>

                            {/* My Bookings Button in Mobile */}
                            <button
                                onClick={() => {
                                    handleNavigate('/my-bookings');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white group hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">My Bookings</p>
                                        <p className="text-xs text-blue-100">View your trips</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <span className="text-lg">→</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation styles */}
            <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
        </nav>
    )
}