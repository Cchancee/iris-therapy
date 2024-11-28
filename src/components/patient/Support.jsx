import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';

const supportResources = [
  {
    id: 1,
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about therapy and mental health services.',
    link: '/faq', // Link to a FAQ page or section
  },
  {
    id: 2,
    title: 'Contact Us',
    description: 'Reach out to our support team for personalized assistance.',
    link: '/contact', // Link to the contact page or form
  },
  {
    id: 3,
    title: 'Help Center',
    description: 'Access articles and resources for guidance on various mental health topics.',
    link: '/help-center', // Link to help center
  },
];

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, like sending an email or saving the message
    alert('Support message submitted!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: '#fff',
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Support Page
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We're here to assist you. Please use the resources below or reach out if you need help.
        </Typography>
      </Box>

      {/* Support Resources Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {supportResources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {resource.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href={resource.link}
                  sx={{ mt: 2 }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Support Contact Form Section */}
      <Box sx={{ background: '#fff', p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Need Direct Support? Reach Out to Us!
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Message"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Message
          </Button>
        </form>
      </Box>
    </div>
  );
}
