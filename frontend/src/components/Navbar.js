import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo_main from '../images/blog.png';

function Navbar() {
  // State to track user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // React Router hook to get the current location
  const location = useLocation();

  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Effect to check if user is logged in when component mounts or accessToken changes
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(accessToken ? true : false);
  }, [localStorage.getItem("accessToken")]); // Dependency: accessToken

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Send logout request to server
      await axios.post("http://localhost:8000/auth/logout", {});

      // Remove accessToken from localStorage and update login status
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Determine whether to render the navbar based on user login status and current location
  const shouldRenderNavbar =
    isLoggedIn &&
    (location.pathname === "/" ||
      location.pathname === "/posts/create" ||
      location.pathname.startsWith("/posts/") ||
      (location.pathname.startsWith("/posts/") && location.pathname.endsWith("/update")));

  return (
    <>
      {/* Render navbar only if shouldRenderNavbar is true */}
      {shouldRenderNavbar && (
        <div className="navbar">
          {/* Logo */}
          <img src={logo_main} alt="" className="logo" />

          {/* Navigation links */}
          <ul>
            {/* Conditional rendering for Create link */}
            {location.pathname === "/" && (
              <li className="nav-item">
                <Link className="nav-link" to="/posts/create">
                  Create
                </Link>
              </li>
            )}

            {/* Conditional rendering for Home link */}
            {location.pathname !== "/" && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            )}

            {/* Conditional rendering for Create link in update mode */}
            {location.pathname.startsWith("/posts/") && location.pathname.endsWith("/update") && (
              <li className="nav-item">
                <Link className="nav-link" to="/posts/create">
                  Create
                </Link>
              </li>
            )}

            {/* Logout link */}
            <li className="nav-item">
              <Link className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
