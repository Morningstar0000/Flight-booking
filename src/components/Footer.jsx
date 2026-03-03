import React from 'react';
import {
    Plane,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Heart,
    ChevronRight,
    Shield,
    Award,
    Clock,
    CreditCard,
    Globe,
    Settings // Add this import for the admin icon (optional)
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const companyLinks = [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Partners', href: '#' }
    ];

    const supportLinks = [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'FAQs', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
    ];

    const flightLinks = [
        { name: 'Book a Flight', href: '#' },
        { name: 'Flight Status', href: '#' },
        { name: 'Flight Tracker', href: '/flight-tracker' },
        { name: 'Popular Routes', href: '#' },
        { name: 'Airline Partners', href: '#' }
    ];

    const hotelLinks = [
        { name: 'Find Hotels', href: '/hotels' },
        { name: 'Hotel Deals', href: '#' },
        { name: 'Popular Destinations', href: '#' },
        { name: 'Hotel Partners', href: '#' },
        { name: 'Travel Guides', href: '#' }
    ];

    const socialLinks = [
        { icon: <Facebook size={20} />, name: 'Facebook', href: '#' },
        { icon: <Twitter size={20} />, name: 'Twitter', href: '#' },
        { icon: <Instagram size={20} />, name: 'Instagram', href: '#' },
        { icon: <Linkedin size={20} />, name: 'LinkedIn', href: '#' },
        { icon: <Youtube size={20} />, name: 'YouTube', href: '#' }
    ];

    const paymentMethods = [
        'Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay'
    ];

    const awards = [
        { name: 'Customer Choice Award', icon: <Shield size={16} /> },
        { name: 'Global Travel Excellence', icon: <Globe size={16} /> }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top Section with Logo and Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-gray-800">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                             <img
                                src="/stayfly-logo.png"
                                alt="StayFly"
                                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                            />
                        </div>
                        <p className="text-gray-400 max-w-md leading-relaxed">
                            Your trusted partner for seamless travel experiences. Discover the world with confidence, comfort, and unbeatable deals.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4">
                            {awards.map((award, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg">
                                    <span className="text-yellow-500">{award.icon}</span>
                                    <span>{award.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="lg:pl-12">
                        <h3 className="text-lg font-semibold text-white mb-4">Subscribe to our newsletter</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Get exclusive deals, travel tips, and updates straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                                />
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-blue-600/20">
                                Subscribe
                                <ChevronRight size={18} />
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                        </p>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Company</h3>
                        <ul className="space-y-4">
                            {companyLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Support</h3>
                        <ul className="space-y-4">
                            {supportLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Flights */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Flights</h3>
                        <ul className="space-y-4">
                            {flightLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hotels */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Hotels</h3>
                        <ul className="space-y-4">
                            {hotelLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact & Social */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 pb-16 border-b border-gray-800">
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Contact Us</h3>
                        <div className="space-y-4">
                           
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Email Us</p>
                                    <a href="mailto:support@skywings.com" className="text-gray-400 hover:text-white transition-colors">
                                        stayfly@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Head Office</p>
                                    <p className="text-gray-400">
                                        123 Aviation Boulevard<br />
                                        New York, NY 10001<br />
                                        United States
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social & App Links */}
                    <div className="lg:pl-12">
                        
                      

                        {/* Payment Methods */}
                        <div>
                            <h4 className="text-white font-medium mb-4">We Accept</h4>
                            <div className="flex flex-wrap gap-3">
                                {paymentMethods.map((method, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 font-medium"
                                    >
                                        {method}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} StayFly. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Cookie Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Accessibility
                        </a>
                        {/* Hidden Admin Link */}
                        <a 
                            href="/admin" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-400 transition-colors text-xs opacity-50 hover:opacity-100"
                            title="Administrator Access"
                        >
                            ⚙️
                        </a>
                    </div>

                    {/* Made with love */}
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-current animate-pulse" /> for travelers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;