import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Avatar,
  LinearProgress
} from '@mui/material';

const StatsCard = ({ title, value, icon, progress }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {progress && (
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;