import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { 
      q: "How do I find the cheapest flights?", 
      a: "The best way is to book at least 3 weeks in advance and try to be flexible with your travel dates. Our search engine automatically sorts by the best value to help you save." 
    },
    { 
      q: "Can I change my flight after booking?", 
      a: "Most airlines allow changes, though fees vary. You can manage your booking through your dashboard or contact our 24/7 support team for immediate assistance." 
    },
    { 
      q: "What documents do I need for international travel?", 
      a: "You'll need a valid passport (usually with 6 months validity remaining) and potentially a visa depending on your destination. Always check the latest entry requirements." 
    },
    { 
      q: "Is baggage included in the ticket price?", 
      a: "Baggage allowance depends on the airline and the fare class selected. During checkout, we'll clearly display the baggage rules for your specific flight." 
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Common Questions</h2>
          <p className="text-gray-500 text-lg font-medium">Everything you need to know before you take off.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border rounded-[2rem] transition-all duration-300 ${
                activeIndex === i ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
              >
                <span className="font-bold text-xl text-gray-900">{faq.q}</span>
                <ChevronDown 
                  className={`text-blue-600 transition-transform duration-300 ${
                    activeIndex === i ? 'rotate-180' : ''
                  }`} 
                  size={24} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-8 text-gray-600 text-lg leading-relaxed border-t border-blue-100/50 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;