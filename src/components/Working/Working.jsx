import React from 'react';
import { motion } from 'framer-motion';
import WorkingImg from "../../assests/Working.png";
import './Working.css';

const Working = () => {
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const steps = [
    {
      number: "01",
      title: "Position Your Hand",
      description: "Place your hand in front of the camera",
      icon: "👋"
    },
    {
      number: "02", 
      title: "Make the Sign",
      description: "Form the sign language gesture clearly",
      icon: "🤟"
    },
    {
      number: "03",
      title: "Get Recognition",
      description: "Our AI instantly recognizes your sign",
      icon: "🧠"
    },
    {
      number: "04",
      title: "See Results",
      description: "View the translated text",
      icon: "💬"
    }
  ];

  return (
    <section className="working-section" id="working">
      <div className="working-container">
        <motion.div 
          className="working-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="working-title">How It Works</h2>
          <div className="working-divider" />
          <p className="working-description">
            Experience seamless sign language recognition with our AI technology
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="working-content">
          {/* Image Section */}
          <motion.div
            className="working-image-container"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="working-image-wrapper">
              <img 
                src={WorkingImg} 
                alt="Sign Language Recognition Process" 
                className="working-image"
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="working-text-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="working-subtitle">Simple & Intuitive Process</h3>
            <p className="working-text">
              Our AI technology makes sign language recognition effortless and accurate. 
              Follow these simple steps to start communicating.
            </p>

            <div className="working-buttons">
              <motion.button
                className="working-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Recognition
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Steps Section */}
        <motion.div 
          className="working-steps"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="working-step-card"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="working-step-number">
                <span>{step.number}</span>
              </div>
              <div className="working-step-icon">{step.icon}</div>
              <h4 className="working-step-title">{step.title}</h4>
              <p className="working-step-description">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Working;