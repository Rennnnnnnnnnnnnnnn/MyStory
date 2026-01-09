// components/ScrollRestorationWrapper.jsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const scrollPositions = {};

export default function ScrollRestorationWrapper() {
  const location = useLocation();

  // Restore scroll position on navigation
  useEffect(() => {
    const pos = scrollPositions[location.pathname] || 0;
    window.scrollTo(0, pos);

    return () => {
      // Save scroll position when leaving
      scrollPositions[location.pathname] = window.scrollY;
    };
  }, [location.pathname]);



  
  return null; // No UI
}
