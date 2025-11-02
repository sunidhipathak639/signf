import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Paper,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  TrendingDown,
  Favorite,
  Speed,
  Thermostat,
  MonitorWeight,
  BloodtypeOutlined
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const HealthMetrics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock health data
  const healthData = {
    vitals: {
      heartRate: { current: 72, normal: [60, 100], trend: 'stable' },
      bloodPressure: { current: '120/80', normal: '120/80', trend: 'good' },
      temperature: { current: 98.6, normal: [97, 99], trend: 'normal' },
      weight: { current: 150, target: 145, trend: 'increasing' },
      bmi: { current: 22.5, category: 'Normal', trend: 'stable' }
    },
    trends: {
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        heartRate: [68, 72, 70, 75, 73, 71, 72],
        bloodPressure: [118, 120, 122, 119, 121, 120, 118],
        weight: [149.8, 150.1, 149.9, 150.2, 150.0, 150.3, 150.1],
        steps: [8500, 9200, 7800, 10500, 9800, 11200, 8900]
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        heartRate: [70, 72, 71, 73],
        bloodPressure: [119, 120, 121, 120],
        weight: [149.5, 149.8, 150.1, 150.2],
        steps: [9200, 9500, 9800, 9600]
      }
    }
  };

  const getVitalStatus = (current, normal, trend) => {
    if (Array.isArray(normal)) {
      if (current >= normal[0] && current <= normal[1]) {
        return { status: 'normal', color: '#4caf50' };
      } else {
        return { status: 'abnormal', color: '#f44336' };
      }
    }
    return { status: 'normal', color: '#4caf50' };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp sx={{ color: '#ff9800' }} />;
      case 'decreasing':
        return <TrendingDown sx={{ color: '#2196f3' }} />;
      default:
        return <Timeline sx={{ color: '#4caf50' }} />;
    }
  };

  // Chart configurations
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const heartRateData = {
    labels: healthData.trends[timeRange].labels,
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: healthData.trends[timeRange].heartRate,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const weightData = {
    labels: healthData.trends[timeRange].labels,
    datasets: [
      {
        label: 'Weight (lbs)',
        data: healthData.trends[timeRange].weight,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const stepsData = {
    labels: healthData.trends[timeRange].labels,
    datasets: [
      {
        label: 'Daily Steps',
        data: healthData.trends[timeRange].steps,
        backgroundColor: [
          '#4caf50',
          '#2196f3',
          '#ff9800',
          '#9c27b0',
          '#f44336',
          '#00bcd4',
          '#795548'
        ],
        borderWidth: 1
      }
    ]
  };

  const healthScoreData = {
    labels: ['Cardiovascular', 'Metabolic', 'Mental Health', 'Physical Fitness', 'Sleep Quality'],
    datasets: [
      {
        label: 'Health Score',
        data: [85, 78, 92, 88, 75],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#2196f3',
        borderWidth: 2,
        pointBackgroundColor: '#2196f3'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  return (
    <Box>
      {/* Time Range Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup variant="outlined">
          <Button 
            variant={timeRange === '7d' ? 'contained' : 'outlined'}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'contained' : 'outlined'}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'contained' : 'outlined'}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {/* Vital Signs Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Current Vital Signs
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(healthData.vitals).map(([key, vital]) => {
              const vitalConfig = {
                heartRate: { icon: <Favorite />, label: 'Heart Rate', unit: 'BPM' },
                bloodPressure: { icon: <BloodtypeOutlined />, label: 'Blood Pressure', unit: 'mmHg' },
                temperature: { icon: <Thermostat />, label: 'Temperature', unit: '°F' },
                weight: { icon: <MonitorWeight />, label: 'Weight', unit: 'lbs' },
                bmi: { icon: <Speed />, label: 'BMI', unit: '' }
              };

              const config = vitalConfig[key];
              const status = getVitalStatus(vital.current, vital.normal, vital.trend);

              return (
                <Grid item xs={12} sm={6} md={2.4} key={key}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: status.color, mb: 1 }}>
                        {config.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {vital.current} {config.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {config.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        {getTrendIcon(vital.trend)}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {vital.trend}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Heart Rate Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Heart Rate Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={heartRateData} options={lineChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weight Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={weightData} options={lineChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Steps */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Activity
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={stepsData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Score Radar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Health Score
              </Typography>
              <Box sx={{ height: 300 }}>
                <Radar data={healthScoreData} options={radarOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Health Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Cardiovascular Health:</strong> Your heart rate and blood pressure are within normal ranges. Keep up the good work!
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Activity Level:</strong> You're averaging 9,400 steps daily. Consider aiming for 10,000 steps for optimal health.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Weight Management:</strong> Slight upward trend detected. Monitor your diet and increase physical activity.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personalized Recommendations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Favorite sx={{ color: '#f44336', fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Cardio Exercise
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      30 minutes, 3x per week
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MonitorWeight sx={{ color: '#2196f3', fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Weight Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor daily intake
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Timeline sx={{ color: '#4caf50', fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Sleep Quality
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      7-9 hours nightly
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Speed sx={{ color: '#ff9800', fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Regular Checkups
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule annually
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthMetrics;