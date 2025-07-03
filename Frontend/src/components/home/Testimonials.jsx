import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Paper,
  Rating
} from '@mui/material';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO at TechStart",
    quote: "We've reduced our infrastructure costs by 60% while improving performance significantly. The support team is exceptional.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "DevOps Engineer",
    quote: "The API and control panel make automation a breeze. We've deployed dozens of instances with zero issues.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emma Rodriguez",
    role: "Founder of AppVenture",
    quote: "As a startup, the affordable pricing with enterprise-grade features was exactly what we needed to scale.",
    rating: 4,
    avatar: "ER"
  }
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            mb: 8
          }}
        >
          What Our Customers Say
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Rating 
                  value={testimonial.rating} 
                  readOnly 
                  sx={{ mb: 2 }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: 'italic', 
                    mb: 3,
                    position: 'relative',
                    '&:before, &:after': {
                      content: '"\\""',
                      fontSize: 24,
                      color: 'text.disabled',
                      lineHeight: 0
                    },
                    '&:before': {
                      mr: 1
                    },
                    '&:after': {
                      ml: 1
                    }
                  }}
                >
                  {testimonial.quote}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;