import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [showNavbar, setShowNavbar] = useState(true); // Tracks visibility

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(true); // Scrolling down
      } else if (window.scrollY < lastScrollY) {
        setShowNavbar(true); // Scrolling up
      }
      lastScrollY = window.scrollY; // Update last scroll position
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar visibility toggle */}
      <div className={showNavbar ? "block" : "hidden"}>
        <Navbar />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
