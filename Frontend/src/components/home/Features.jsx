import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
  Container
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Public as PublicIcon,
  Terminal as TerminalIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';

const Features = () => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <SpeedIcon fontSize="large" />,
      title: "High Performance",
      description: "Our NVMe SSD storage and high-frequency CPUs deliver exceptional performance for your applications."
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: "Enterprise Security",
      description: "Multiple layers of security including DDoS protection, firewalls, and isolated networks."
    },
    {
      icon: <StorageIcon fontSize="large" />,
      title: "Scalable Resources",
      description: "Easily upgrade your resources as your needs grow without any downtime."
    },
    {
      icon: <PublicIcon fontSize="large" />,
      title: "Global Data Centers",
      description: "Choose from multiple locations worldwide to reduce latency for your users."
    },
    {
      icon: <TerminalIcon fontSize="large" />,
      title: "Full Root Access",
      description: "Complete control over your virtual machines with full root/administrator access."
    },
    {
      icon: <SupportIcon fontSize="large" />,
      title: "24/7 Support",
      description: "Our expert support team is available around the clock to assist you."
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
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
          Why Choose Our Cloud Platform
        </Typography>
        
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    width: 60,
                    height: 60,
                    mb: 3
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;