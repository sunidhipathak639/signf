import React from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  Paper
} from '@mui/material';
import { Close } from '@mui/icons-material';

const AnalysisReportModal = ({ open, handleClose, report }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="analysis-report-modal"
      aria-describedby="detailed-analysis-report"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: '#121212',
          border: '1px solid #333',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ color: '#ffffff' }}>
            Detailed Analysis Report
          </Typography>
          <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close sx={{ color: '#ffffff' }} />
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          {report ? (
            <Box>
              <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 2 }}>
                {report.summary}
              </Typography>
              
              {report.details && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                    Detailed Findings
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    {report.details}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              No report data available.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleClose}
            sx={{
              bgcolor: '#00bcd4',
              '&:hover': {
                bgcolor: '#00a0b4'
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AnalysisReportModal;