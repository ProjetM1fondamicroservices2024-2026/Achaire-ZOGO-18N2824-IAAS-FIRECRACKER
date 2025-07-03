import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  LinearProgress,
  Grid
} from '@mui/material';

const ResourceUsage = () => {
  const resources = [
    { name: 'CPU', value: 65, color: 'primary' },
    { name: 'Memory', value: 45, color: 'secondary' },
    { name: 'Storage', value: 78, color: 'success' },
    { name: 'Network', value: 30, color: 'info' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resource Usage
        </Typography>
        <Grid container spacing={2}>
          {resources.map((resource, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  {resource.name}
                </Typography>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={resource.value} 
                    color={resource.color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {resource.value}%
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResourceUsage;