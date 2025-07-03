import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  Dashboard,
  Storage,
  Person
} from '@mui/icons-material';

import { authActions } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Changed to lg to match sidebar

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  
  // User menu state
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);
  const userMenuOpen = Boolean(userAnchorEl);
  
  // Notifications menu state  
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const notificationMenuOpen = Boolean(notificationAnchorEl);

  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };
  
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    localStorage.clear();
    dispatch(authActions.logout());
    navigate('/login');
  };

  const handleUserProfile = () => {
    navigate('/profile');
  };

  const username = localStorage.getItem('iaas-username') || 'Anonymous';
  const email = localStorage.getItem('iaas-email') || false;

  // Calculate sidebar width for header positioning
  const getSidebarWidth = () => {
    if (isMobile) return 0; // No sidebar width on mobile (drawer)
    const isTablet = window.innerWidth < 1536; // xl breakpoint
    return isTablet ? 240 : 280;
  };

  const sidebarWidth = getSidebarWidth();

  return (
    <AppBar 
      position="fixed" 
      elevation={1} 
      sx={{
        bgcolor: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: { xs: '100%', lg: `calc(100% - ${sidebarWidth}px)` },
        left: { xs: 0, lg: `${sidebarWidth}px` },
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section: Menu Icon & Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn && isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ 
                mr: 2,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            IAAS-FIRECRACKER
          </Typography>
        </Box>
        
        {/* Middle Section: Navigation */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)' 
          }}>
            <Button 
              color="inherit" 
              href="/"
              sx={{ 
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              Home
            </Button>
            {isLoggedIn && (
              <>
                <Button 
                  color="inherit" 
                  href="/dashboard"
                  startIcon={<Dashboard />}
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  href="/vms"
                  startIcon={<Storage />}
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  VMs
                </Button>
              </>
            )}
          </Box>
        )}
        
        {/* Right Section: Actions & User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isLoggedIn && (
            <Button 
              color="inherit" 
              href="/login"
              sx={{ 
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                backgroundColor: theme.palette.primary.main,
              }}
            >
              Signin/Signup
            </Button>
          )}
          
          {isLoggedIn && (
            <>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* User Profile */}
              <Tooltip title="Account">
                <IconButton
                  onClick={handleUserMenuClick}
                  size="small"
                  sx={{ 
                    ml: 1,
                    border: `2px solid ${theme.palette.primary.contrastText}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                  aria-controls={userMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? 'true' : undefined}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}>
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
      
      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        open={notificationMenuOpen}
        onClose={handleNotificationClose}
        onClick={handleNotificationClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        TransitionComponent={Fade}
      >
        <Typography sx={{ p: 2, fontWeight: 'bold' }}>Notifications</Typography>
        <Divider />
        <MenuItem>
          <ListItemText 
            primary="VM instance 'server-01' reached 85% CPU usage" 
            secondary="2 minutes ago"
          />
        </MenuItem>
        <MenuItem>
          <ListItemText 
            primary="System update available" 
            secondary="10 minutes ago"
          />
        </MenuItem>
        <MenuItem>
          <ListItemText 
            primary="Storage usage warning for 'data-volume'" 
            secondary="1 hour ago"
          />
        </MenuItem>
        <Divider />
        <MenuItem sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">View all notifications</Typography>
        </MenuItem>
      </Menu>
      
      {/* User Menu */}
      <Menu
        anchorEl={userAnchorEl}
        id="account-menu"
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            width: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        TransitionComponent={Fade}
      >
        <Box sx={{ p: 2, display: 'flex' , alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{username.charAt(0).toUpperCase()}</Avatar>
          <Box>
            <Typography variant="subtitle2">{username}</Typography>
          </Box>
        </Box>
        <Divider />
        {isLoggedIn && (
          <MenuItem onClick={handleUserProfile} sx={{ gap: 1.5 }}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
        )}
        <Divider />
        {isLoggedIn && (
          <MenuItem sx={{ gap: 1.5 }}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        {isLoggedIn && (
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;