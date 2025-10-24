import React, { useState } from "react";
import { motion } from 'framer-motion';
import './WhatComp.css';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authaction';

const WhatComp = () => {
  const [showLoginHover, setShowLoginHover] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Redux state
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Handle login
  const handleLogin = () => {
    dispatch(login());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleMouseEnter = (e) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
    setShowLoginHover(true);
  };

  const handleMouseLeave = () => {
    setShowLoginHover(false);
  };

  const handleMouseMove = (e) => {
    if (showLoginHover) {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <section className="signlang__whatsignlang" id="whatsignlang">
      <div className="whatsignlang-content">
        <motion.div 
          className="signlang__whatsignlang-header"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 className="feature__title gradient-text" variants={cardVariants}>
            What is Sign Language?
          </motion.h2>
          <motion.p className="feature__text" variants={cardVariants}>
            A visual language using hand gestures and expressions to communicate.
          </motion.p>
        </motion.div>

        {/* Hover Login Feature */}
        <motion.div 
          className="hover-login-trigger premium-trigger"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="hover-text premium-text">✨ Premium Login Experience</span>
        </motion.div>

        {/* Login Hover Card */}
        {showLoginHover && (
          <motion.div
            className="login-hover-card premium-card"
            style={{
              position: 'fixed',
              left: hoverPosition.x + 10,
              top: hoverPosition.y - 50,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="login-card-content premium-content">
              {accessToken && user ? (
                // Show user info when logged in
                <div className="user-info-section">
                  <div className="user-avatar premium-avatar">
                    <img src={user.photoURL || require('../../assests/dummy-user.png')} alt="User" />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="login-message premium-message">
                    <h4 className="gradient-text premium-greeting">Hello, {user.name}!</h4>
                    <p className="premium-subtitle">Welcome back to SignFlow</p>
                  </div>
                </div>
              ) : (
                // Show login prompt when not logged in
                <div className="login-prompt premium-prompt">
                  <div className="login-icon premium-icon">🚀</div>
                  <h4 className="gradient-text premium-title">Sign In</h4>
                  <p className="premium-description">Unlock premium features</p>
                  <button 
                    className="login-button premium-button"
                    onClick={handleLogin}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <span className="button-icon">✨</span>
                    Continue with Google
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="whatsignlang-features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { 
              icon: "👋", 
              title: "Hand Gestures", 
              description: "Precise movements that form the foundation of communication." 
            },
            { 
              icon: "😊", 
              title: "Expressions", 
              description: "Facial cues that convey emotions and context." 
            },
            { 
              icon: "🌍", 
              title: "Universal", 
              description: "Connects people across cultures and communities." 
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="whatsignlang-feature-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="whatsignlang-feature-icon">{feature.icon}</span>
              <h3 className="whatsignlang-feature-title gradient-text">{feature.title}</h3>
              <p className="whatsignlang-feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatComp;
