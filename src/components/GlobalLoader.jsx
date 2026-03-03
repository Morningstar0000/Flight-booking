import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import Loader from './Loader';

export default function GlobalLoader() {
  const location = useLocation();
  const { isNavigating, startNavigation, endNavigation } = useNavigation();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    // Check if this is a real navigation (not the initial load)
    if (prevLocationRef.current.pathname !== location.pathname) {
      // Start navigation immediately
      startNavigation();
      
      // End navigation after a short delay (simulating page load)
      const timer = setTimeout(() => {
        endNavigation();
      }, 600);

      return () => {
        clearTimeout(timer);
        endNavigation();
      };
    }
    
    // Update ref
    prevLocationRef.current = location;
  }, [location, startNavigation, endNavigation]);

  // Don't show loader on initial page load
  if (!isNavigating) return null;

  return <Loader />;
}