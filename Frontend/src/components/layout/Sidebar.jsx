import * as React from 'react';
import { 
  Box, 
  List, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  useTheme,
  Avatar,
  Collapse,
  IconButton,
  Paper,
  useMediaQuery,
  Drawer
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Computer as VmIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import LanIcon from '@mui/icons-material/Lan';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useSelector } from 'react-redux';

function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation();
  const [adminExpanded, setAdminExpanded] = React.useState(true);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const isTablet = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // 1200px - 1536px
  
  const isAdmin = useSelector((state) => state.isAdmin);

  const handleAdminToggle = () => {
    setAdminExpanded(!adminExpanded);
  };

  // Determine sidebar width based on screen size
  const getSidebarWidth = () => {
    if (isMobile) return 280; // Drawer width on mobile/tablet
    if (isTablet) return 240; // Medium width on tablet
    return 280; // Full width on desktop
  };


  const sidebarWidth = getSidebarWidth();
  
  
  

  const mainNavItems = [
    { name: "Home", icon: <HomeIcon />, route: '/' },
    { name: "Dashboard", icon: <DashboardIcon />, route: '/dashboard' },
    { name: "Profile", icon: <ManageAccountsIcon />, route: '/profile' },
    { name: "Cart", icon: <ShoppingCartIcon />, route: '/cart' },
    { name: "Payments", icon: <PaymentIcon />, route: '/payments' },
  ];

  const adminNavItems = [
    { name: "Users", icon: <PeopleIcon />, route: '/users' },
    { name: "Virtual Machines", icon: <VmIcon />, route: '/vms' },
    { name: "Clusters", icon: <LanIcon/>, route: '/clusters' },
    { name: "System Images", icon: <Diversity2Icon/>, route: '/system-images' },
    { name: "VM Offers", icon: <LocalOfferIcon/>, route: '/vm-offers-management' }
  ];
  
  const supportNavItems = [
    { name: "Settings", icon: <SettingsIcon />, route: '/settings' },
    { name: "Help & Support", icon: <HelpIcon />, route: '/help' },
  ];

  const renderNavItem = (item, index) => {
    const isSelected = location.pathname === item.route;
    
    return (
      <ListItem 
        key={index} 
        disablePadding 
        sx={{ 
          display: 'block',
          mb: 0.5,
        }}
      >
        <ListItemButton 
          component={Link} 
          to={item.route}
          onClick={isMobile ? toggleDrawer(false) : undefined}
          sx={{
            px: 3,
            py: 1,
            minHeight: 48,
            borderRadius: '0 24px 24px 0',
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}15`,
            },
            '&.Mui-selected': {
              backgroundColor: `${theme.palette.primary.main}25`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 2.5,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}35`,
              }
            },
            transition: 'all 0.2s'
          }}
          selected={isSelected}
        >
          <ListItemIcon sx={{ 
            minWidth: 40,
            color: isSelected ? 
              theme.palette.primary.main : 
              theme.palette.text.secondary
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.name} 
            sx={{ 
              '& .MuiTypography-root': { 
                fontWeight: isSelected ? 'bold' : 'normal',
                fontSize: isTablet ? '0.875rem' : '1rem'
              }
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {/* Sidebar Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 64
        }}
      >
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            mr: 1.5
          }}
        >
          FC
        </Avatar>
        <Box>
          <Typography 
            variant={isTablet ? "body1" : "subtitle1"} 
            sx={{ 
              fontWeight: 'bold', 
              lineHeight: 1.2,
              fontSize: isTablet ? '0.875rem' : '1rem'
            }}
          >
            IAAS-FIRECRACKER
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.8,
              fontSize: isTablet ? '0.6rem' : '0.75rem'
            }}
          >
            VM Management System
          </Typography>
        </Box>
      </Box>
      
      {/* Main Navigation */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        <List component="nav" sx={{ pt: 1 }}>
          {mainNavItems.map((item, index) => renderNavItem(item, index))}
        </List>
        
        <Divider sx={{ my: 1.5, mx: 2 }} />
        
        {/* Admin Section */}
        {isAdmin && (
          <List component="nav" sx={{ pt: 0 }}>
            <ListItem sx={{ display: 'block', px: 2, py: 0.5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  px: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      fontSize: isTablet ? '0.65rem' : '0.75rem'
                    }}
                  >
                    Admin
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdminToggle();
                  }}
                >
                  {adminExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              </Box>
            </ListItem>
            
            <Collapse in={adminExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {adminNavItems.map((item, index) => renderNavItem(item, index))}
              </List>
            </Collapse>
          </List>
        )}
        
        <Divider sx={{ my: 1.5, mx: 2 }} />
        
        {/* Support Section */}
        <List component="nav">
          {supportNavItems.map((item, index) => renderNavItem(item, index))}
        </List>
      </Box>
      
      {/* Version Info */}
      <Box 
        sx={{ 
          p: isTablet ? 1.5 : 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontSize: isTablet ? '0.6rem' : '0.75rem' }}
        >
          IAAS-Firecracker v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { xs: 0, lg: sidebarWidth }, 
        flexShrink: { lg: 0 },
      }}
    >
      {/* Mobile/Tablet Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarWidth,
              border: 'none',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)'
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        /* Desktop Fixed Sidebar */
        <Paper
          elevation={3}
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: sidebarWidth,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1200,
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }}
        >
          {sidebarContent}
        </Paper>
      )}
    </Box>
  );
}

export default Sidebar;