import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';

const PricingPlans = () => {
  const theme = useTheme();

  const plans = [
    {
      name: "Starter",
      price: "$4.99",
      period: "/month",
      specs: [
        "1 vCPU Core",
        "4GB RAM",
        "50GB NVMe SSD",
        "1TB Bandwidth",
        "1 IPv4 Address"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "$9.99",
      period: "/month",
      specs: [
        "4 vCPU Cores",
        "8GB RAM",
        "100GB NVMe SSD",
        "2TB Bandwidth",
        "1 IPv4 Address"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$19.99",
      period: "/month",
      specs: [
        "8 vCPU Cores",
        "16GB RAM",
        "200GB NVMe SSD",
        "4TB Bandwidth",
        "2 IPv4 Addresses"
      ],
      popular: false
    },
  ];

  return (
    <Box sx={{ py: theme.spacing(10) }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          mb: theme.spacing(2),
          color: theme.palette.text.primary
        }}
      >
        Simple, Transparent Pricing
      </Typography>
      <Typography 
        variant="h6" 
        align="center" 
        color="text.secondary" 
        sx={{ 
          mb: theme.spacing(8),
          maxWidth: 720,
          mx: 'auto',
          px: theme.spacing(2)
        }}
      >
        No hidden fees. No surprises. Pay only for what you use.
      </Typography>
      
      <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 2, md: 4 } }}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={plan.popular ? 6 : 2} 
              sx={{ 
                borderRadius: theme.shape.borderRadius * 1,
                overflow: 'hidden',
                border: plan.popular ? `2px solid ${theme.palette.secondary.main}` : 'none',
                transition: theme.transitions.create(['transform', 'box-shadow']),
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[plan.popular ? 8 : 4],
                }
              }}
            >
              {plan.popular && (
                <Chip 
                  icon={<Star fontSize="small" />}
                  label="MOST POPULAR"
                  color="secondary"
                  sx={{ 
                    position: 'absolute', 
                    top: theme.spacing(2), 
                    right: theme.spacing(2),
                    fontWeight: 600,
                    px: 1
                  }}
                />
              )}
              <Box sx={{ 
                p: theme.spacing(4),
                background: plan.popular ? 
                  `linear-gradient(45deg, ${theme.palette.secondary.light}10, ${theme.palette.background.paper})` : 
                  'transparent'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: theme.spacing(1),
                    color: plan.popular ? theme.palette.secondary.main : theme.palette.text.primary
                  }}
                >
                  {plan.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: theme.spacing(3) }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      lineHeight: 1,
                      color: plan.popular ? theme.palette.secondary.dark : theme.palette.text.primary
                    }}
                  >
                    {plan.price}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      ml: theme.spacing(1),
                      mb: theme.spacing(0.5)
                    }}
                  >
                    {plan.period}
                  </Typography>
                </Box>
                
                <List disablePadding sx={{ mb: theme.spacing(3) }}>
                  {plan.specs.map((spec, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.75 }}>
                      <ListItemIcon sx={{ minWidth: theme.spacing(4) }}>
                        <CheckCircle 
                          color={plan.popular ? "secondary" : "primary"} 
                          fontSize="small" 
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={spec} 
                        primaryTypographyProps={{
                          fontSize: theme.typography.body2.fontSize,
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              <Box sx={{ p: theme.spacing(4), pt: 0, mt: 'auto' }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  color={plan.popular ? 'secondary' : 'primary'}
                  size="large"
                  sx={{
                    py: theme.spacing(1.5),
                    borderRadius: theme.shape.borderRadius,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PricingPlans;