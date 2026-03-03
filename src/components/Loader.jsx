import { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Main Plane Container */}
        <div className="relative">
             {/* Your Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 animate-bounce-slow">
            <img
              src="/stayfly-logo.png"
              alt="StayFly"
              className="w-full h-full object-contain"
            />
          </div>


          {/* Trail Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-600 font-medium mb-2">Taking off...</p>
          
          {/* Progress Bar */}
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Decorative Clouds */}
        <div className="absolute -top-12 -right-12 w-16 h-16 bg-white rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
}

// Alternative simpler loader
export function SimpleLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Simple Plane Animation */}
        <div className="relative animate-bounce">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-45 animate-spin-slow">
            <Plane className="w-8 h-8 text-white transform -rotate-45" />
          </div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Page transition loader (shows between routes)
export function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-50 animate-slide-right"></div>
  );
}

// Add these styles to your global CSS or component
const styles = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }

  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }

  @keyframes slide-right {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .animate-slide-right {
    animation: slide-right 0.5s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}