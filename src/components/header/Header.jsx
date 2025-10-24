import React from 'react';
import { motion } from 'framer-motion';
import SignHand from "../../assests/SignHand.png";
import './Header.css';

const Header = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
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
    <section className="signlang__header" id="home">
      <div className="signlang__header-container">
        <motion.div 
          className="signlang__header-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={textVariants}>
            <span className="gradient__text">
              AI Sign Language
            </span>
            <br />Recognition
          </motion.h1>
          
          <motion.p 
            className="header-description"
            variants={textVariants}
          >
            Learn and practice sign language with real-time AI recognition.
          </motion.p>

          <motion.div 
            className="header-cta"
            variants={textVariants}
          >
            <motion.button 
              className="cta-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="signlang__header-image"
          variants={imageVariants}
        >
          <img 
            src={SignHand} 
            alt="Sign Language"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Header