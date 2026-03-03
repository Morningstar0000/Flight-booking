import React from 'react';
import { ShieldCheck, Globe, Headphones, Award, TrendingUp, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Secure Booking",
      desc: "Your data and payments are protected by industry-leading encryption and security protocols.",
      stat: "256-bit SSL",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: <Globe size={32} strokeWidth={1.5} />,
      title: "Global Reach",
      desc: "Access to over 500+ airlines and 2,000+ destinations across every continent.",
      stat: "500+ Airlines",
      color: "from-emerald-600 to-emerald-700"
    },
    {
      icon: <Headphones size={32} strokeWidth={1.5} />,
      title: "24/7 Support",
      desc: "Our travel experts are always a click away to help you with changes or cancellations.",
      stat: "Instant Response",
      color: "from-amber-600 to-amber-700"
    }
  ];

  return (
    <section className="py-24  bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mt-8 mb-6 text-gray-900 tracking-tight">
            Travel with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Confidence
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Experience peace of mind with our comprehensive travel protection and dedicated support team.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`relative w-20 h-20 mb-8`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="relative w-full h-full flex items-center justify-center text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.desc}
                </p>

                {/* Stat Badge */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                  <span className="text-gray-500">{feature.stat}</span>
                </div>

                {/* Decorative Line */}
                <div className="absolute bottom-8 right-8 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${feature.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Airlines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">2,000+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Secure</div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck size={16} className="text-green-500" />
          <span>Trusted by over 2 million travelers worldwide</span>
        </div>
      </div>
    </section>
  );
};

export default Features;