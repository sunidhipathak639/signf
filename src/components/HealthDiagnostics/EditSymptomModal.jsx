import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Select, MenuItem, Slider, Button } from '@mui/material';

const EditSymptomModal = ({ open, onClose, onSave, symptomCategories, initialCategory = 'pain', initialIntensity = 5 }) => {
  const [category, setCategory] = useState(initialCategory);
  const [intensity, setIntensity] = useState(initialIntensity);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setIntensity(initialIntensity);
  }, [initialIntensity]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { bgcolor: '#0d1117', color: '#ffffff', border: '1px solid #30363d', maxHeight: '92vh' } }}>
      <DialogTitle sx={{ bgcolor: '#161b22', color: '#ffffff', borderBottom: '1px solid #30363d' }}>Edit Symptom</DialogTitle>
      <DialogContent sx={{ bgcolor: '#0d1117', color: '#ffffff', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>Category</Typography>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} fullWidth sx={{ bgcolor: '#161b22', color: '#ffffff', border: '1px solid #30363d' }}>
              {Object.entries(symptomCategories).map(([key, info]) => (
                <MenuItem key={key} value={key}>{info.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>Intensity</Typography>
            <Slider value={intensity} min={1} max={10} onChange={(_, v) => setIntensity(v)} sx={{ color: '#00bcd4' }} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#0d1117', borderTop: '1px solid #30363d' }}>
        <Button onClick={onClose} sx={{ bgcolor: '#161b22', color: '#ffffff', border: '1px solid #30363d' }}>Cancel</Button>
        <Button onClick={() => onSave({ category, intensity })} sx={{ bgcolor: '#00bcd4', color: '#000', '&:hover': { bgcolor: '#00a0b0' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSymptomModal;