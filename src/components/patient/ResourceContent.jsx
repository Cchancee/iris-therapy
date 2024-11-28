import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';

const resources = [
  {
    id: 1,
    title: 'Mental Health Tips',
    description: 'Explore daily tips for maintaining mental health and well-being.',
    image: 'https://tghrconsulting.com/wp-content/uploads/2020/09/self-care.jpg', 
    link: 'https://www.mentalhealth.gov/',
  },
  {
    id: 2,
    title: 'Support Groups',
    description: 'Find support groups near you for shared experiences and growth.',
    image: 'https://i0.wp.com/spokesman-recorder.com/wp-content/uploads/2021/12/Bulletin-pics.png?resize=632%2C355&ssl=1', 
    link: 'https://www.nami.org/',
  },
  {
    id: 3,
    title: 'Therapy In Hand',
    description: 'Learn more about the different types of therapy and their benefits.',
    image: 'https://media.npr.org/assets/img/2023/07/02/gettyimages-1383880527-170667a1_wide-5a923c89b466b78b15df4d5747c35518ba0d681c.jpg?s=1400&c=100&f=jpeg', 
    link: 'https://www.psychologytoday.com/us/therapists',
  },
  {
    id: 4,
    title: 'Art Therapy Guide',
    description: 'Discover how art therapy can support your mental health journey.',
    image: 'https://coachfoundation.com/wp-content/uploads/2022/10/Graphics-08-1.jpg.webp', 
    link: 'https://www.arttherapy.org/',
  },
];

const ResourcesPage = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#fff', minHeight: '100vh', borderRadius: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        External Resources
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mb: 4, textAlign: 'center', color: 'text.secondary', maxWidth: 800, mx: 'auto', mb: 6 }}
      >
        Explore a curated list of resources to support your mental health journey. Click on any card to learn more and 
        access helpful tools, guides, and support networks tailored just for you.
      </Typography>
      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
              <CardActionArea component="a" href={resource.link} target="_blank" rel="noopener noreferrer">
                <Box
                  sx={{
                    width: '100%',
                    height: 140, // Ensures all images have the same height
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f0f0f0', // Placeholder background in case images fail to load
                  }}
                >
                  <CardMedia
                    component="img"
                    image={resource.image}
                    alt={resource.title}
                    sx={{
                      height: '100%',
                      width: 'auto', // Ensures the image maintains aspect ratio
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {resource.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourcesPage;
