import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../core/Services/auth_service";
import "./NavBar.css";

import videoCallIcon from "../../assets/video-call-icon.svg";
import calendarIcon from "../../assets/calendar-icon.svg";
import profileCircleIcon from "../../assets/profile-circle-icon.svg";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Get user info and logout function from auth context
  const { user, logout } = useAuth(); 

  // Detects scroll of the page and add shadow to the navbar and resets when is at the top
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change (Profile or Settings)
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);


  // Close dropdown on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__container">

        {/* Icon */}
        <Link to="/" className="navbar__logo">
          <img src={videoCallIcon} alt="Meetra Icon" className="navbar__logo-icon" />
          <span className="navbar__logo-text">Meetra</span>
        </Link>

        {/* Spacer */}
        <div className="navbar__spacer" />

        {/* Schedule / Calendar button */}
        <Link to="/calendar" className="navbar__schedule" aria-label="Go to calendar">
          <img src={calendarIcon} alt="" className="navbar__schedule-icon" />
          <span>My Calendar</span>
        </Link>

        {/* Avatar + Dropdown */}
        <div className="navbar__profile-wrapper" ref={dropdownRef}>
          <button
            className="navbar__avatar"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <img src={profileCircleIcon} alt="Profile" className="navbar__avatar-icon" />
          </button>

          <div
            className={`navbar__dropdown${dropdownOpen ? " navbar__dropdown--open" : ""}`}
            role="menu"
          >
            <div className="navbar__dropdown-header">
              <div className="navbar__dropdown-name">{user?.name || "User"}</div>
              <div className="navbar__dropdown-email">{user?.email || "user@example.com"}</div>
            </div>

            <ul className="navbar__dropdown-list">
              <li>
                <Link
                  to="/profile"
                  className="navbar__dropdown-item"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="navbar__dropdown-item"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
              </li>
              <li>
                <div className="navbar__dropdown-divider" />
              </li>
              <li>
                <button
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    // TODO: Logout logic here
                    logout();
                  }}
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;