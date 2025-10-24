import React from 'react'
import "./Footer.css"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand-link">
            <svg className="footer-brand-text" viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="28" className="footer-brand-svg-text">SIGNF</text>
            </svg>
          </Link>
        </div>

        {/* Minimal Links */}
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/detect" className="footer-link">Recognition</Link>
          <a href="#features" className="footer-link">Features</a>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <span>© 2025 SIGNF</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer