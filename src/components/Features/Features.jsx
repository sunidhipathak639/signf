import React from 'react';
import { motion } from 'framer-motion';
import { featuresData } from '../../data/FeaturesData';
import './Features.css';

const Features = () => {
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

  const featureIcons = ['🚀', '🎯', '🧠', '⚡'];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="features-title">Key Features</h2>
          <p className="features-description">
            Discover powerful tools designed for seamless sign language recognition
          </p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresData.slice(0, 4).map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="feature-card"
            >
              <div className="feature-icon">
                <span>{featureIcons[index]}</span>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
