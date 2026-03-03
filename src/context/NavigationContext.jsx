import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  const startNavigation = useCallback(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Show loader immediately
    setIsNavigating(true);
  }, []);

  const endNavigation = useCallback(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Hide loader after a tiny delay to ensure smooth transition
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  }, []);

  return (
    <NavigationContext.Provider value={{ 
      isNavigating, 
      startNavigation, 
      endNavigation 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};