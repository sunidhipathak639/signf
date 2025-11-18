import React from 'react';
import { motion } from 'framer-motion';
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
      title: "Select Body Area",
      description: "Choose the area on the interactive body map where you're experiencing symptoms",
      icon: "🩺"
    },
    {
      number: "02", 
      title: "Track Symptoms",
      description: "Log your symptoms with detailed descriptions and severity levels",
      icon: "📝"
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "Our AI analyzes your symptoms and provides personalized insights",
      icon: "🧠"
    },
    {
      number: "04",
      title: "View Insights",
      description: "Get comprehensive health recommendations and track your progress",
      icon: "📊"
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
            Experience seamless AI-powered health diagnostics with our advanced technology
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
              <div className="ai-health-visual">
                <div className="health-visual-glow"></div>
                <div className="health-visual-main">
                  <div className="health-visual-icon">🩺</div>
                  <div className="health-visual-particles">
                    <span className="particle particle-1">💊</span>
                    <span className="particle particle-2">❤️</span>
                    <span className="particle particle-3">🔬</span>
                    <span className="particle particle-4">📊</span>
                  </div>
                  <div className="health-visual-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>
                <div className="health-visual-label">
                  <span className="label-text">AI-Powered</span>
                  <span className="label-subtext">Health Diagnostics</span>
                </div>
              </div>
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
              Our AI technology makes health diagnostics effortless and accurate. 
              Follow these simple steps to start tracking your health and getting personalized insights.
            </p>

            <div className="working-buttons">
              <motion.button
                className="working-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Health Diagnostics
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