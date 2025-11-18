import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Fade,
  Slide,
  Zoom,
  Alert
} from '@mui/material';
import {
  LocalHospital,
  HealthAndSafety,
  AutoAwesome,
  Security,
  Speed
} from '@mui/icons-material';
import SymptomChecker from './SymptomChecker';
import BodyMap from './BodyMap';
import './HealthDiagnostics.css';
import { login } from '../../redux/actions/authaction';

const HealthDiagnostics = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('symptom-checker');
  
  // Shared state for symptoms between BodyMap and SymptomChecker
  const [sharedSymptoms, setSharedSymptoms] = useState([]);

  const sections = [
    {
      id: 'symptom-checker',
      title: 'Symptom Checker & Analysis',
      icon: <LocalHospital />,
      description: 'Interactive symptom analysis with built-in AI-powered insights and reports'
    },
    {
      id: 'body-map',
      title: '3D Body Map',
      icon: <HealthAndSafety />,
      description: 'Interactive body mapping for symptom location'
    }
  ];

  // Function to add symptoms from BodyMap to shared state
  const addSymptomFromBodyMap = (symptom) => {
    setSharedSymptoms(prev => {
      const byId = prev.findIndex(s => s.id === symptom.id);
      if (byId !== -1) {
        const updated = [...prev];
        updated[byId] = symptom;
        return updated;
      }
      const byKey = prev.findIndex(s => s.bodyPart === symptom.bodyPart && s.category === symptom.category);
      if (byKey !== -1) {
        const updated = [...prev];
        updated[byKey] = symptom;
        return updated;
      }
      return [...prev, symptom];
    });
  };

  // Function to remove symptoms
  const removeSymptomFromShared = (symptomId) => {
    setSharedSymptoms(prev => prev.filter(s => s.id !== symptomId));
  };

  // Function to convert BodyMap symptoms to SymptomChecker format
  const getSymptomNamesForChecker = () => {
    return sharedSymptoms.map(symptom => {
      // Map category to symptom name for SymptomChecker
      const categoryToSymptomMap = {
        'pain': `${symptom.bodyPartLabel} Pain`,
        'inflammation': `${symptom.bodyPartLabel} Inflammation`,
        'numbness': `${symptom.bodyPartLabel} Numbness`,
        'swelling': `${symptom.bodyPartLabel} Swelling`,
        'stiffness': `${symptom.bodyPartLabel} Stiffness`,
        'weakness': `${symptom.bodyPartLabel} Weakness`,
        'burning': `${symptom.bodyPartLabel} Burning`,
        'tingling': `${symptom.bodyPartLabel} Tingling`
      };
      
      return categoryToSymptomMap[symptom.category] || `${symptom.bodyPartLabel} ${symptom.category}`;
    });
  };

  // Function to handle symptom selection from SymptomChecker
  const handleSymptomCheckerSelection = (symptoms) => {
    // Convert SymptomChecker symptoms back to BodyMap format if needed
    // For now, we'll keep them separate but synchronized
    console.log('SymptomChecker symptoms updated:', symptoms);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'symptom-checker':
        return (
          <SymptomChecker 
            externalSymptoms={getSymptomNamesForChecker()}
            onSymptomsChange={handleSymptomCheckerSelection}
          />
        );
      case 'body-map':
        return (
          <BodyMap 
            selectedSymptoms={sharedSymptoms}
            onAddSymptom={addSymptomFromBodyMap}
            onRemoveSymptom={removeSymptomFromShared}
          />
        );
      default:
        return (
          <SymptomChecker 
            externalSymptoms={getSymptomNamesForChecker()}
            onSymptomsChange={handleSymptomCheckerSelection}
          />
        );
    }
  };

  return (
    <div className="health-diagnostics">
      {!accessToken && (
        <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8, md: 10 }, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <Fade in={true} timeout={800}>
            <Box 
              textAlign="center" 
              sx={{ 
                color: '#fff',
                width: '100%',
                position: 'relative'
              }}
            >
              {/* Decorative Background Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(0, 188, 212, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'pulse 3s ease-in-out infinite',
                  zIndex: 0
                }}
              />
              
              {/* Main Icon */}
              <Zoom in={true} timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    mb: 3,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: '100px', sm: '120px' },
                    height: { xs: '100px', sm: '120px' },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.2) 0%, rgba(76, 175, 80, 0.2) 100%)',
                    border: '3px solid rgba(0, 188, 212, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 188, 212, 0.2)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <Security sx={{ fontSize: { xs: '50px', sm: '60px' }, color: '#00bcd4' }} />
                </Box>
              </Zoom>

              {/* Title */}
              <Slide direction="down" in={true} timeout={800}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #00bcd4 50%, #4caf50 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Authentication Required
                </Typography>
              </Slide>

              {/* Subtitle */}
              <Slide direction="up" in={true} timeout={1000}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#b0b0b0', 
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    px: 2,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Please login to access AI Health Diagnostics and unlock personalized health insights powered by advanced AI technology.
                </Typography>
              </Slide>

              {/* Feature Chips */}
              <Zoom in={true} timeout={1200}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    mb: 4,
                    flexWrap: 'wrap',
                    px: 2,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Chip 
                    label="Secure Access" 
                    icon={<Security sx={{ color: '#00bcd4 !important' }} />} 
                    sx={{ 
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      color: '#00bcd4',
                      border: '1px solid rgba(0, 188, 212, 0.3)',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '36px', sm: '40px' },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 188, 212, 0.2)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 188, 212, 0.2)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                  <Chip 
                    label="Personalized Insights" 
                    icon={<HealthAndSafety sx={{ color: '#4caf50 !important' }} />}
                    sx={{ 
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      color: '#4caf50',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '36px', sm: '40px' },
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                  <Chip 
                    label="AI-Powered" 
                    icon={<AutoAwesome sx={{ color: '#ff9800 !important' }} />}
                    sx={{ 
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      color: '#ff9800',
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '36px', sm: '40px' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                </Box>
              </Zoom>

              {/* Login Button */}
              <Zoom in={true} timeout={1400}>
                <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
                  <Box
                    component="button"
                    onClick={() => dispatch(login())}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      fontWeight: 600,
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      minWidth: { xs: '200px', sm: '240px' },
                      minHeight: { xs: '48px', sm: '52px' },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s'
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(0, 122, 255, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3)',
                        background: 'linear-gradient(135deg, #0088ff 0%, #6b5ce6 100%)',
                        '&::before': {
                          left: '100%'
                        }
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)'
                      },
                      '&:focus': {
                        outline: '2px solid rgba(0, 122, 255, 0.8)',
                        outlineOffset: '3px'
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      sx={{
                        width: { xs: '20px', sm: '24px' },
                        height: { xs: '20px', sm: '24px' }
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                      Continue with Google
                    </Box>
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'relative', 
                        zIndex: 1,
                        fontSize: { xs: '18px', sm: '20px' },
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      →
                    </Box>
                  </Box>
                </Box>
              </Zoom>

              {/* Additional Info */}
              <Fade in={true} timeout={1600}>
                <Box sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Security sx={{ fontSize: '14px' }} />
                      Secure & Encrypted
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>•</Box>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HealthAndSafety sx={{ fontSize: '14px' }} />
                      HIPAA Compliant
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>•</Box>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AutoAwesome sx={{ fontSize: '14px' }} />
                      AI-Powered Analysis
                    </Box>
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Fade>
        </Container>
      )}
      {accessToken && (
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
        {/* Enhanced Header Section */}
        <Fade in={true} timeout={1000}>
          <Box 
            textAlign="center" 
            mb={{ xs: 4, sm: 5, md: 6 }}
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '150px', sm: '200px', md: '250px' },
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00bcd4, #4caf50, #00bcd4, transparent)',
                borderRadius: '2px',
                animation: 'shimmer 3s ease-in-out infinite'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(0, 188, 212, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 4s ease-in-out infinite',
                zIndex: 0
              }
            }}
          >
            <Slide direction="down" in={true} timeout={800}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ffffff 0%, #00bcd4 30%, #4caf50 60%, #00bcd4 100%)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 5s ease-in-out infinite',
                  fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  mb: 2,
                  letterSpacing: '-0.03em',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 2px 10px rgba(0, 188, 212, 0.2))'
                }}
              >
                AI Health Diagnostics
              </Typography>
            </Slide>
            
            <Slide direction="up" in={true} timeout={1000}>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 2.5, sm: 3 }, 
                  maxWidth: '900px', 
                  mx: 'auto',
                  px: { xs: 2, sm: 3 },
                  color: '#b0b0b0',
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
                  lineHeight: 1.7,
                  fontWeight: 300,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Advanced healthcare intelligence powered by AI technology for accurate 
                symptom analysis and comprehensive diagnostic insights
              </Typography>
            </Slide>

            {/* Feature Highlights */}
            <Zoom in={true} timeout={1200}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 3, sm: 4 },
                  flexWrap: 'wrap',
                  px: 2,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Chip
                  icon={<AutoAwesome sx={{ color: '#00bcd4 !important', fontSize: { xs: '18px', sm: '20px' } }} />}
                  label="AI-Powered"
                  sx={{
                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                    color: '#00bcd4',
                    border: '1px solid rgba(0, 188, 212, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: '36px', sm: '40px' },
                    px: { xs: 1.5, sm: 2 },
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.2)',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 6px 20px rgba(0, 188, 212, 0.25)',
                      borderColor: 'rgba(0, 188, 212, 0.5)'
                    }
                  }}
                />
                <Chip
                  icon={<Security sx={{ color: '#4caf50 !important', fontSize: { xs: '18px', sm: '20px' } }} />}
                  label="Secure & Private"
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: '36px', sm: '40px' },
                    px: { xs: 1.5, sm: 2 },
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.25)',
                      borderColor: 'rgba(76, 175, 80, 0.5)'
                    }
                  }}
                />
                <Chip
                  icon={<Speed sx={{ color: '#ff9800 !important', fontSize: { xs: '18px', sm: '20px' } }} />}
                  label="Instant Results"
                  sx={{
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    color: '#ff9800',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: '36px', sm: '40px' },
                    px: { xs: 1.5, sm: 2 },
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.2)',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.25)',
                      borderColor: 'rgba(255, 152, 0, 0.5)'
                    }
                  }}
                />
              </Box>
            </Zoom>
          </Box>
        </Fade>

        {/* Enhanced Navigation Tabs */}
        <Fade in={true} timeout={1400}>
          <Box mb={{ xs: 3, sm: 4 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                
                return (
                  <Grid item xs={12} sm={6} key={section.id}>
                    <Zoom in={true} timeout={1000 + (index * 200)}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          backgroundColor: isActive ? 'rgba(26, 26, 26, 0.8)' : 'rgba(10, 10, 10, 0.6)',
                          border: isActive ? '2px solid #00bcd4' : '1px solid rgba(255, 255, 255, 0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: { xs: '160px', sm: '180px' },
                          backdropFilter: 'blur(20px)',
                          '&::before': isActive ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #00bcd4, #4caf50, #00bcd4)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s ease-in-out infinite'
                          } : {},
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isActive ? '200px' : '0px',
                            height: isActive ? '200px' : '0px',
                            background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transition: 'all 0.5s ease',
                            zIndex: 0,
                            pointerEvents: 'none'
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            borderColor: isActive ? '#00bcd4' : 'rgba(0, 188, 212, 0.5)',
                            transform: 'translateY(-6px) scale(1.02)',
                            boxShadow: isActive 
                              ? '0 12px 40px rgba(0, 188, 212, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3)'
                              : '0 8px 30px rgba(0, 188, 212, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)'
                          },
                          '&:active': {
                            transform: 'translateY(-2px) scale(0.98)'
                          },
                          '&:focus-within': {
                            outline: '3px solid rgba(0, 188, 212, 0.5)',
                            outlineOffset: '3px'
                          }
                        }}
                        onClick={() => setActiveSection(section.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveSection(section.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`${section.title} - ${section.description}`}
                        aria-pressed={isActive}
                      >
                        <CardContent sx={{ 
                          textAlign: 'center', 
                          p: { xs: 2.5, sm: 3, md: 3.5 },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <Box 
                            sx={{ 
                              color: isActive ? '#00bcd4' : '#666',
                              mb: 2,
                              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              transform: isActive ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
                              filter: isActive 
                                ? 'drop-shadow(0 0 12px rgba(0, 188, 212, 0.6))' 
                                : 'drop-shadow(0 0 4px rgba(0, 188, 212, 0.2))',
                              animation: isActive ? 'float 3s ease-in-out infinite' : 'none',
                              '&:hover': {
                                transform: isActive ? 'scale(1.2) rotate(5deg)' : 'scale(1.1)',
                              }
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography 
                            variant="h6" 
                            component="h3"
                            sx={{ 
                              color: isActive ? '#ffffff' : '#b0b0b0',
                              fontWeight: isActive ? 800 : 600,
                              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
                              mb: 1,
                              transition: 'all 0.3s ease',
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {section.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isActive ? '#b0b0b0' : '#777',
                              fontSize: { xs: '0.85rem', sm: '0.95rem' },
                              lineHeight: 1.5,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {section.description}
                          </Typography>
                          {isActive && (
                            <>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 12,
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: '40px',
                                  height: '4px',
                                  background: 'linear-gradient(90deg, #00bcd4, #4caf50)',
                                  borderRadius: '2px',
                                  animation: 'pulse 2s ease-in-out infinite',
                                  boxShadow: '0 0 8px rgba(0, 188, 212, 0.5)'
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#4caf50',
                                  animation: 'pulse 1.5s ease-in-out infinite',
                                  boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)'
                                }}
                              />
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Fade>

        {/* Active Section Content */}
        <Fade in={true} timeout={600}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {renderActiveSection()}
          </Box>
        </Fade>

        {/* Enhanced Footer Info */}
        <Fade in={true} timeout={1600}>
          <Box mt={{ xs: 6, sm: 8 }} textAlign="center">
            <Alert 
              severity="info" 
              sx={{ 
                maxWidth: '900px', 
                mx: 'auto',
                backgroundColor: 'rgba(0, 188, 212, 0.08)',
                border: '2px solid rgba(0, 188, 212, 0.25)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 188, 212, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 188, 212, 0.12)',
                  borderColor: 'rgba(0, 188, 212, 0.4)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 188, 212, 0.15)'
                },
                '& .MuiAlert-icon': {
                  color: '#00bcd4',
                  fontSize: { xs: '1.5rem', sm: '1.75rem' }
                },
                '& .MuiAlert-message': {
                  color: '#ffffff',
                  width: '100%'
                }
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500, 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                <Box component="strong" sx={{ color: '#00bcd4', fontWeight: 700 }}>
                  Medical Disclaimer:
                </Box>{' '}
                This AI Health Diagnostics tool is for informational purposes only 
                and should not replace professional medical advice. Always consult with qualified healthcare 
                providers for accurate diagnosis and treatment.
              </Typography>
            </Alert>
            
            <Box 
              sx={{ 
                mt: { xs: 3, sm: 4 }, 
                display: 'flex', 
                justifyContent: 'center', 
                gap: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                px: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(76, 175, 80, 0.05)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Security sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#4caf50' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#b0b0b0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}
                >
                  HIPAA Compliant
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 188, 212, 0.05)',
                  border: '1px solid rgba(0, 188, 212, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <AutoAwesome sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#00bcd4' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#b0b0b0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}
                >
                  AI-Powered Analysis
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 152, 0, 0.05)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Speed sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#ff9800' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#b0b0b0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}
                >
                  Real-time Processing
                </Typography>
              </Box>
            </Box>
            
            {/* SIGNF Footer Credit */}
            <Box 
              sx={{ 
                mt: { xs: 3, sm: 4 }, 
                pt: { xs: 2, sm: 3 }, 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                px: 2
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#888',
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 400
                }}
              >
                © 2024 AI Health Diagnostics - Advanced Healthcare Technology Solutions
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
      )}
    </div>
  );
};

export default HealthDiagnostics;