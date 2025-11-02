import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/actions/authaction";

const Navbar = ({ notifyMsg }) => {
  const [toggle, setToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const user = useSelector((state) => state.auth?.user);
  const { accessToken } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useDispatch();

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for blur effect
      setIsScrolled(currentScrollY > 50);
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isLoggedIn && user) {
      notifyMsg(
        "success",
        `Welcome! ${user?.name}, You Logged in Successfully`
      );
    }
  }, [isLoggedIn, user, notifyMsg]);

  const handleLogin = () => {
    dispatch(login());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    notifyMsg("success", "Logged Out Successfully !");
  };

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-text">SIGNF</span>
          </Link>
        </div>

        <div id="menu-button" className="burger-white" onClick={() => setToggle(!toggle)}>
          {toggle ? (
            <RiCloseLine size={24} />
          ) : (
            <>
              <svg viewBox="0 0 40 6" fill="#ffffff">
                <polygon points="0,0 40,0 40,6 0,6"></polygon>
              </svg>
              <svg viewBox="0 0 40 6" fill="#ffffff">
                <polygon points="0,0 40,0 40,6 0,6"></polygon>
              </svg>
            </>
          )}
        </div>

        <ul className="nav-ul">
          <li><Link to="/" className="nav-link">HOME</Link></li>
          <li><Link to="/detect" className="nav-link">DETECT</Link></li>
          <li>
            {accessToken ? (
              <button 
                type="button" 
                onClick={handleLogout}
                className="nav-link auth-button"
              >
                LOGOUT
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleLogin}
                className="nav-link auth-button"
              >
                LOGIN
              </button>
            )}
          </li>
        </ul>
      </div>

      {toggle && (
        <div className="mobile-dropdown">
          <ul className="mobile-nav-ul">
            <li><Link to="/" className="mobile-nav-link" onClick={() => setToggle(false)}>HOME</Link></li>
            <li><Link to="/detect" className="mobile-nav-link" onClick={() => setToggle(false)}>DETECT</Link></li>
            <li>
              {accessToken ? (
                <button 
                  type="button" 
                  onClick={() => {
                    handleLogout();
                    setToggle(false);
                  }}
                  className="mobile-nav-link auth-button"
                >
                  LOGOUT
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => {
                    handleLogin();
                    setToggle(false);
                  }}
                  className="mobile-nav-link auth-button"
                >
                  LOGIN
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
