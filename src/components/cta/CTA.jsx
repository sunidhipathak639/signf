import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="cta-section" id="cta">
      <div className="cta-container">
        <motion.div 
          className="cta-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Gradient Background Blur */}
          <div className="cta-blur-bg"></div>
          
          {/* Main CTA Content */}
          <div className="cta-main-card">
            <h2 className="cta-title gradient-title">Try Sign Language AI</h2>
            <Link to="/detect" className="cta-button">
              Start Now
            </Link>
          </div>

          {/* Contributors Section */}
          <motion.div
            className="contributors-section"
            variants={cardVariants}
          >
            <h3 className="contributors-title gradient-text">Built with ❤️ by</h3>
            <div className="contributors-grid">
              <div className="contributor-card">
                <div className="contributor-avatar">
                  <img 
                    src="https://i.pinimg.com/736x/92/e6/74/92e674f6195b6fbcda64f47d6aa274cc.jpg" 
                    alt="Sunidhi" 
                    className="contributor-image"
                  />
                </div>
                <div className="contributor-name">Sunidhi</div>
                <div className="contributor-role">Frontend Developer</div>
              </div>
              <div className="contributor-card">
                <div className="contributor-avatar">
                  <img 
                    src="https://i.pinimg.com/736x/db/05/c4/db05c4f8da241265156696d2d97549b8.jpg" 
                    alt="Raiyan" 
                    className="contributor-image"
                  />
                </div>
                <div className="contributor-name">Raiyan</div>
                <div className="contributor-role">AI/ML Engineer</div>
              </div>
              <div className="contributor-card">
                <div className="contributor-avatar">
                  <img 
                    src="https://i.pinimg.com/736x/d8/45/8c/d8458c0f919a0a21cc6c582d394af3ad.jpg" 
                    alt="Shivam" 
                    className="contributor-image"
                  />
                </div>
                <div className="contributor-name">Shivam</div>
                <div className="contributor-role">Backend Developer</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
