import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.4
      }
    }
  };

  return (
    <section className="signlang__header" id="home">
      <div className="signlang__header-container">
        <motion.div 
          className="signlang__header-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            className="header-badge"
            variants={badgeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <span className="badge-icon">✨</span>
            <span className="badge-text">AI-Powered Health Solutions</span>
          </motion.div>

          <motion.h1 variants={textVariants}>
            <span className="gradient__text">
              AI Health Diagnostics Platform
            </span>
          </motion.h1>
          
          <motion.p 
            className="header-description header-description-main"
            variants={textVariants}
          >
            Advanced AI-powered health diagnostics with interactive body map and comprehensive symptom tracking.
          </motion.p>
          
          <motion.p 
            className="header-description header-description-sub"
            variants={textVariants}
          >
            Get personalized health insights and track your symptoms with cutting-edge artificial intelligence technology.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            className="header-features"
            variants={textVariants}
          >
            <motion.div 
              className="feature-pill"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pill-icon">🩺</span>
              <span>Body Map</span>
            </motion.div>
            <motion.div 
              className="feature-pill"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pill-icon">🧠</span>
              <span>AI Analysis</span>
            </motion.div>
            <motion.div 
              className="feature-pill"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pill-icon">📊</span>
              <span>Track Progress</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="header-cta"
            variants={textVariants}
          >
            <Link to="/health-diagnostics" className="cta-primary" role="button">
              <span className="cta-text">Start Health Diagnostics</span>
              <span className="cta-arrow">→</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="signlang__header-image"
          variants={imageVariants}
        >
          <div className="health-icon-container">
            <div className="health-icon-glow"></div>
            <div className="health-icon-placeholder">
              <span className="health-icon-emoji">🩺</span>
            </div>
            <div className="health-icon-particles">
              <span className="particle">💊</span>
              <span className="particle">❤️</span>
              <span className="particle">🔬</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Header