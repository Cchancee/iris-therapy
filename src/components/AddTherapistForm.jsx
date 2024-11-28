import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
} from '@mui/material';

export default function TherapistForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Therapist', // Default role
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    specialization: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';

    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.phone_number) newErrors.phone_number = 'phone_number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.specialization)
      newErrors.specialization = 'Specialization is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // Pass data to parent component
      setFormData({
        email: '',
        role: 'Therapist',
        first_name: '',
        last_name: '',
        phone_number: '',
        date_of_birth: '',
        specialization: '',
      });
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Therapist
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ flexGrow: 1 }}
      >
        <Grid container spacing={2}>
          {/* Email Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
          </Grid>

          {/* Role Field (Read-only) */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              disabled
              fullWidth
            />
          </Grid>

          {/* First Name Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              fullWidth
            />
          </Grid>

          {/* Last Name Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              fullWidth
            />
          </Grid>

          {/* phone_number Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              fullWidth
            />
          </Grid>

          {/* Date of Birth Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Specialization Field */}
          <Grid item xs={12}>
            <TextField
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              error={!!errors.specialization}
              helperText={errors.specialization}
              fullWidth
              select
            >
              <MenuItem value="Psychology">Psychology</MenuItem>
              <MenuItem value="Art Therapy">Art Therapy</MenuItem>
              <MenuItem value="Cognitive Behavioral Therapy">
                Cognitive Behavioral Therapy
              </MenuItem>
            </TextField>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Therapist
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
