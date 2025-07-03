import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs, 
  Link, 
  useTheme
} from '@mui/material';
import { 
  Home as HomeIcon,
  Computer as ComputerIcon,
  ImageSearch as ImageSearchIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import Diversity2Icon from '@mui/icons-material/Diversity2';

// Import System Images Manager component
import SystemImagesManager from '../components/system-images/SystemImagesManager';

const SystemImagesPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          href="/" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography 
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Diversity2Icon sx={{ mr: 0.5 }} fontSize="inherit" />
          System Images
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            mb: 0.5
          }}
        >
          System Images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage operating system images for virtual machines
        </Typography>
      </Box>
      
      {/* Main Content Area */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 4,
          p: 3
        }}
      >
        <SystemImagesManager />
      </Paper>
      
      {/* Contextual Help */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          borderRadius: '8px',
          borderLeft: `4px solid ${theme.palette.info.main}`,
          backgroundColor: `${theme.palette.info.main}10`
        }}
      >
        <Typography variant="subtitle2" sx={{ color: theme.palette.info.main, mb: 1 }}>
          About System Images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          System Images are pre-configured operating system templates used for creating virtual machines.
          You can upload your own custom images or use the default ones provided by the platform.
          Learn more in our <Link href="/docs/system-images" underline="hover">documentation</Link>.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SystemImagesPage;