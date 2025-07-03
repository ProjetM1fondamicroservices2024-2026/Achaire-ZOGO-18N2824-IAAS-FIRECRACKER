import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageLayout = ({ children, fullWidth = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  
   // Pages where sidebar should NOT be shown
     const isLoggedIn = useSelector(state => state.isLoggedIn);
  const publicPages = ['/', '/login', '/signup', '/forgot-password'];
  const shouldShowSidebar = isLoggedIn && !publicPages.includes(location.pathname);

  // Calculate sidebar width
  const getSidebarWidth = () => {
    if (isMobile || !shouldShowSidebar) return 0; // No sidebar width on mobile or public pages
    const isTablet = window.innerWidth < 1536; // xl breakpoint
    return isTablet ? 240 : 280;
  };
 

  const sidebarWidth = getSidebarWidth();
  console.log(sidebarWidth);
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Subtract header height
        backgroundColor: theme.palette.background.default,
        pt: { xs: 11, lg: 11 }, // Top padding to account for fixed header
        pb: 3, // Bottom padding
        px: fullWidth ? 0 : { xs: 2, sm: 3, md: 4 }, // Horizontal padding unless fullWidth
        ml: { xs: 0, lg: `${sidebarWidth}px` }, // Left margin for fixed sidebar on desktop
        width: { xs: '100%', lg: `calc(100% - ${sidebarWidth}px)` },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Prevent horizontal scroll
      }}
    >
      {children}
    </Box>
  );
};

export default PageLayout;