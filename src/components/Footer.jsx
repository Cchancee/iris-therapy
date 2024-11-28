import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#333',
        color: '#fff',
        py: 4,
        mt: 5,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Home
              </Link>
              <Link href="/resources" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Resources
              </Link>
              <Link href="/support" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Support
              </Link>
              <Link href="/contact" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Info
            </Typography>
            <Box>
              <Typography variant="body2">Email: support@iristherapy.com</Typography>
              <Typography variant="body2">Phone: +250 000 000 000</Typography>
              <Typography variant="body2">Address: Kigali, Rwanda</Typography>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Follow Us
            </Typography>
            <Box>
              <Link href="https://facebook.com" color="inherit" sx={{ mr: 2 }}>
                Facebook
              </Link>
              <Link href="https://twitter.com" color="inherit" sx={{ mr: 2 }}>
                Twitter
              </Link>
              <Link href="https://instagram.com" color="inherit" sx={{ mr: 2 }}>
                Instagram
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Legal
            </Typography>
            <Box>
              <Link href="/privacy-policy" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ mt: 4, borderTop: '1px solid #444', pt: 2 }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} IRIS Therapy. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
