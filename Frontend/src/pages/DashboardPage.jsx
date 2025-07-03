import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Chip, 
  Avatar, 
  Stack, 
  LinearProgress,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs, 
  Link,
  Alert,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';

import { 
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  CloudQueue as CloudIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Dns as DnsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpwardIcon,
  NetworkCheck as NetworkCheckIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Computer as ComputerIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon,
  VpnKey as VpnKeyIcon,
  BarChart as BarChartIcon,
  Storage as DriveIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Https as HttpsIcon,
  Delete as DeleteIcon,
  Report as ReportIcon
} from '@mui/icons-material';

// Import API functions
import { getLoggedInUser } from '../api/user-backend';
import { getVms, startVm, stopVm, deleteVm } from '../api/vm-host-backend';
import { useNavigate } from 'react-router-dom';


// StatsCard Component
const StatsCard = ({ title, value, icon, color, secondaryValue, change }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
   
        <Box>
          <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          
          {secondaryValue && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {secondaryValue}
              </Typography>
              {change && (
                <Chip 
                  size="small" 
                  icon={<ArrowUpwardIcon fontSize="small" />} 
                  label={change} 
                  color="success"
                  sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0.5 } }}
                />
              )}
            </Stack>
          )}
        </Box>
        
        <Avatar 
          sx={{ 
            bgcolor: alpha(color, 0.1), 
            color: color,
            width: 48,
            height: 48
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );
};

// VM Item Component (used within VmList)
const VmItem = ({ vm, onAction, isAdmin, actionLoading }) => {
  console.log("VMZAZ", vm);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  
  
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleMenuAction = (action) => {
    onAction(vm.id, action);
    handleCloseMenu();
  };
  
  const getStatusColor = (status) => {
    const statusColors = {
      running: theme.palette.success.main,
      paused: theme.palette.warning.main,
      stopped: theme.palette.error.main,
      provisioning: theme.palette.info.main
    };
    return statusColors[status] || theme.palette.grey[500];
  };
  
  const getStatusText = (status) => {
    const statusText = {
      running: 'Running',
      paused: 'Paused',
      stopped: 'Stopped',
      provisioning: 'Provisioning'
    };
    return statusText[status] || 'Unknown';
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: theme.palette.primary.light,
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            >
              <DnsIcon />
            </Avatar>
            <Box>
            {( actionLoading) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress />
                </Box>
              )}
              <Typography variant="subtitle1" fontWeight={600}>
                {vm.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {vm.os}
              </Typography>
              {/* {isAdmin && vm.owner && (
                <Chip 
                  size="small" 
                  label={`Owner: ${vm.owner}`} 
                  sx={{ mt: 0.5, height: 20 }}
                />
              )} */}
            </Box>
          </Stack>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Chip
            size="small"
            label={getStatusText(vm.status)}
            sx={{
              bgcolor: alpha(getStatusColor(vm.status), 0.1),
              color: getStatusColor(vm.status),
              fontWeight: 600,
              '& .MuiChip-label': { px: 1.5 }
            }}
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            IP: <Typography component="span" variant="body2" fontWeight={600}>{vm.ip_address}</Typography>
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
          <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
            {/* {vm.status === 'running' && (
              <IconButton disabled={actionLoading} size="small" color="warning" onClick={() => onAction(vm.id, 'pause')}>
                <PauseIcon fontSize="small" />
              </IconButton>
            )} */}
            
            {vm.status !== 'stopped' && (
              <IconButton disabled={actionLoading} size="small" color="error" onClick={() => onAction(vm.id, 'stop')}>
                <StopIcon fontSize="small" />
              </IconButton>
            )}
            
            {vm.status === 'stopped' && (
              <IconButton disabled={actionLoading} size="small" color="success" onClick={() => onAction(vm.id, 'start')}>
                <PlayIcon fontSize="small" />
              </IconButton>
            )}
            
            <IconButton disabled={actionLoading} size="small" onClick={handleOpenMenu}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem dense onClick={() => handleMenuAction('viewDetails')}>
                <ListItemIcon>
                  <DnsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>View Details</ListItemText>
              </MenuItem>
              
              <MenuItem dense onClick={() => handleMenuAction('console')}>
                <ListItemIcon>
                  <ComputerIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Console</ListItemText>
              </MenuItem>
              
              <MenuItem dense onClick={() => handleMenuAction('resize')}>
                <ListItemIcon>
                  <MemoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Resize</ListItemText>
              </MenuItem>
              
              <MenuItem dense onClick={() => handleMenuAction('backups')}>
                <ListItemIcon>
                  <StorageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Backups</ListItemText>
              </MenuItem>
              
              {isAdmin && (
                <MenuItem dense onClick={() => handleMenuAction('transferOwnership')}>
                  <ListItemIcon>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Transfer Ownership</ListItemText>
                </MenuItem>
              )}
              
              <Divider />
              
              <MenuItem dense onClick={() => handleMenuAction('delete')} sx={{ color: theme.palette.error.main }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

// VmList Component
const VmList = ({ vms, onVmAction, onRefresh, onCreateVm, isLoading, isAdmin, actionLoading }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {isAdmin ? 'All Virtual Machines' : 'Your Virtual Machines'}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button 
            size="small" 
            startIcon={<RefreshIcon />} 
            onClick={onRefresh}
            sx={{ minWidth: 'auto', px: 1 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={16} /> : 'Refresh'}
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AddIcon />} 
            onClick={onCreateVm}
          >
            Create VM
          </Button>
        </Stack>
      </Box>
      
      {( isLoading) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!isLoading && (
        <Box>
          {vms.length > 0 ? (
            vms.map((vm) => (
              <VmItem 
                key={vm.id} 
                vm={vm} 
                onAction={onVmAction} 
                isAdmin={isAdmin} 
                actionLoading={actionLoading}
              />
            ))
          ) : (
            <Box textAlign="center" py={3}>
              <Typography color="text.secondary">No virtual machines found</Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                sx={{ mt: 2 }} 
                onClick={onCreateVm}
              >
                Create your first VM
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

// QuickActions Component
const QuickActions = ({ actions }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={action.icon}
              onClick={action.onClick}
              size="large"
              sx={{
                py: 1.5,
                justifyContent: 'flex-start',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <Box textAlign="left">
                <Typography variant="body2" fontWeight={600}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  {action.description}
                </Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// ResourceUsage Component
const ResourceUsage = ({ data }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Resource Usage
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab label="24h" />
          <Tab label="7d" />
          <Tab label="30d" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.map((resource) => (
          <Grid item xs={12} key={resource.name}>
            <Box mb={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {resource.name}
                </Typography>
                <Typography variant="body2">
                  {resource.used} / {resource.total} {resource.unit}
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={(resource.used / resource.total) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    bgcolor: resource.name === 'CPU' 
                      ? theme.palette.primary.main 
                      : resource.name === 'Memory' 
                        ? theme.palette.info.main 
                        : theme.palette.secondary.main
                  }
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {/* Alert for high resource usage */}
      {data.some(resource => (resource.used / resource.total) > 0.8) && (
        <Box 
          sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="body2" color="warning.dark">
            Some resources are near capacity. Consider upgrading your plan.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// NetworkStatus Component
const NetworkStatus = ({ network }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Network Status
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.1)
          }}>
            <Avatar sx={{ 
              bgcolor: alpha(theme.palette.success.main, 0.2),
              color: theme.palette.success.main,
              mr: 2
            }}>
              <NetworkCheckIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                All Systems Operational
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last checked: 2 minutes ago
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Inbound Traffic
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                {network.inbound} GB
              </Typography>
              <Chip 
                size="small" 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="+12%" 
                color="success"
                sx={{ height: 24 }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Outbound Traffic
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                {network.outbound} GB
              </Typography>
              <Chip 
                size="small" 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="+8%" 
                color="success"
                sx={{ height: 24 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

// System Status Component (for admin)
const SystemStatus = ({ services }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          System Status
        </Typography>
        
        <Button 
          size="small" 
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} key={service.name}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                borderLeft: `4px solid ${
                  service.status === 'operational' ? theme.palette.success.main :
                  service.status === 'degraded' ? theme.palette.warning.main :
                  theme.palette.error.main
                }`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight={600}>
                  {service.name}
                </Typography>
                <Chip 
                  size="small" 
                  label={service.status.toUpperCase()} 
                  color={
                    service.status === 'operational' ? 'success' :
                    service.status === 'degraded' ? 'warning' :
                    'error'
                  }
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last updated: {service.lastUpdated}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// User Management Component (for admin)
const UserManagement = ({ users, onUserAction }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          User Management
        </Typography>
        
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<PersonAddIcon />}
          onClick={() => onUserAction('add')}
        >
          Add User
        </Button>
      </Box>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 30, 
                        height: 30, 
                        mr: 1,
                        bgcolor: user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main
                      }}
                    >
                      {user.role === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                    </Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={user.role.toUpperCase()} 
                    color={user.role === 'admin' ? 'error' : 'primary'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={user.status.toUpperCase()} 
                    color={user.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onUserAction('edit', user.id)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ textAlign: 'right' }}>
        <Button size="small" onClick={() => onUserAction('viewAll')}>
          View All Users
        </Button>
      </Box>
    </Paper>
  );
};

// Billing Summary Component
const BillingSummary = ({ billingData, onViewBilling }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Billing Summary
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Current Month
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ${billingData.currentMonth.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Billing period: {billingData.billingPeriod}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Last Month
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ${billingData.lastMonth.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Estimated Total
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ${billingData.estimatedTotal.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Button 
        fullWidth 
        variant="outlined" 
        sx={{ mt: 2 }}
        onClick={onViewBilling}
      >
        View Billing Details
      </Button>
    </Paper>
  );
};

// Notifications Component
const Notifications = ({ notifications, onViewAll }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Notifications
        </Typography>
        
        <Button 
          size="small" 
          onClick={onViewAll}
        >
          View All
        </Button>
      </Box>
      
      {notifications.length > 0 ? (
        <Box>
          {notifications.map((notification, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${
                  notification.type === 'info' ? theme.palette.info.main :
                  notification.type === 'warning' ? theme.palette.warning.main :
                  notification.type === 'error' ? theme.palette.error.main :
                  theme.palette.success.main
                }`
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {notification.time}
              </Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={3}>
          <Typography color="text.secondary">No new notifications</Typography>
        </Box>
      )}
    </Paper>
  );
};

// Main Dashboard Page
const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for user data
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // Default to regular user
  const [loading, setLoading] = useState(true);
  const [vmLoading, setVmLoading] = useState(true);
  const [vms, setVms] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false); // For admin to toggle between their VMs and all VMs
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedVm, setSelectedVm] = useState(null);
  
  
  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Fetch VMs when user data is available
  useEffect(() => {
    if (currentUser) {
      fetchVms();
    }
  }, [currentUser, showAllUsers]);
  
  // Fetch current user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await getLoggedInUser();
      if (userData) {
        setCurrentUser(userData);
        setUserRole(userData.role || 'user');
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch VMs
  const fetchVms = async () => {
    setVmLoading(true);
    try {
      console.log("VMS");
      const vmsData = await getVms(currentUser.id); // Updated function call
      console.log("VMS", vmsData);
      if (vmsData) {
        const filteredVms = vmsData.filter(vm => vm.user_id === currentUser.id);
        
        // Add owner information for admin view
        if (userRole === 'admin') {
          // This is mock data - in a real app, you'd fetch user details
          const userMap = {
            1: 'John Doe',
            2: 'Jane Smith',
            3: 'Admin User'
          };
          
          const vmsWithOwners = filteredVms.map(vm => ({
            ...vm,
            owner: userMap[vm.user_id] || `User #${vm.user_id}`
          }));
          
          setVms(vmsWithOwners);
        } else {
          setVms(filteredVms);
        }
      }
    } catch (err) {
      console.error('Failed to fetch VMs:', err);
    } finally {
      setVmLoading(false);
    }
  };
  
  // Mock data - replace with real API calls
  const stats = [
    { 
      title: 'Active VMs', 
      value: vms.filter(vm => vm.status === 'running').length.toString(), 
      icon: <DnsIcon />,
      color: theme.palette.primary.main, 
      secondaryValue: '75% of plan',
      change: '+1'
    },
    { 
      title: 'CPU Cores', 
      value: '8', 
      icon: <SpeedIcon />,
      color: theme.palette.error.main,
      secondaryValue: '8/16 allocated',
    },
    { 
      title: 'Memory', 
      value: '16', 
      icon: <MemoryIcon />,
      color: theme.palette.info.main,
      secondaryValue: '16/32 GB',
    },
    { 
      title: 'Storage', 
      value: '500', 
      icon: <StorageIcon />,
      color: theme.palette.success.main,
      secondaryValue: '500/1000 GB',
    },
  ];

  // Admin stats - additional metrics for administrators
  const adminStats = [
    { 
      title: 'Total Users', 
      value: '24', 
      icon: <GroupIcon />,
      color: theme.palette.warning.main, 
      secondaryValue: '+3 this month',
      change: '+14%'
    },
    { 
      title: 'System Load', 
      value: '68%', 
      icon: <BarChartIcon />,
      color: theme.palette.success.main,
      secondaryValue: 'Healthy',
    },
    { 
      title: 'Disk Usage', 
      value: '4.2', 
      icon: <DriveIcon />,
      color: theme.palette.info.main,
      secondaryValue: '4.2/10 TB',
    },
    { 
      title: 'Revenue', 
      value: '$8.4k', 
      icon: <PaymentIcon />,
      color: theme.palette.error.main,
      secondaryValue: 'This month',
      change: '+22%'
    },
  ];
  
  const resourceUsage = [
    { name: 'CPU', used: 8, total: 16, unit: 'cores' },
    { name: 'Memory', used: 16, total: 32, unit: 'GB' },
    { name: 'Storage', used: 500, total: 1000, unit: 'GB' },
    { name: 'Network', used: 350, total: 1000, unit: 'GB/mo' },
  ];
  
  const networkStatus = {
    inbound: 245.8,
    outbound: 182.3,
  };
  
  // User quick actions
  const userQuickActions = [
    { 
      title: 'Manage VMs', 
      description: 'Manage your virtual machines', 
      icon: <SettingsIcon />, 
      onClick: () => navigate("/vms")
    },
    { 
      title: 'Configure Firewalls', 
      description: 'Manage network security', 
      icon: <HttpsIcon />, 
      onClick: () => console.log('Configure Firewalls') 
    },
    { 
      title: 'Backup Settings', 
      description: 'Schedule automated backups', 
      icon: <CloudIcon />, 
      onClick: () => console.log('Backup Settings') 
    },
  ];
  
  // Admin quick actions
  const adminQuickActions = [
    { 
      title: 'Add User', 
      description: 'Create new user account', 
      icon: <PersonAddIcon />, 
      onClick: () => console.log('Add User') 
    },
    { 
      title: 'System Settings', 
      description: 'Configure global system options', 
      icon: <SettingsIcon />, 
      onClick: () => console.log('System Settings') 
    },
    { 
      title: 'Security Policy', 
      description: 'Update platform security settings', 
      icon: <SecurityIcon />, 
      onClick: () => console.log('Security Policy') 
    },
    { 
      title: 'View Logs', 
      description: 'Access system audit logs', 
      icon: <ReportIcon />, 
      onClick: () => console.log('View Logs') 
    },
  ];
  
  // System services status (for admin)
  const systemServices = [
    { name: 'VM Hosting Service', status: 'operational', lastUpdated: '1 min ago' },
    { name: 'Storage Service', status: 'operational', lastUpdated: '5 min ago' },
    { name: 'Network Service', status: 'degraded', lastUpdated: '12 min ago' },
    { name: 'Authentication Service', status: 'operational', lastUpdated: '3 min ago' },
    { name: 'Backup Service', status: 'operational', lastUpdated: '7 min ago' },
    { name: 'Monitoring Service', status: 'operational', lastUpdated: '2 min ago' },
  ];
  
  // Users data (for admin)
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: 4, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
  ];
  
  // Billing data
  const billingData = {
    currentMonth: 123.45,
    lastMonth: 98.76,
    estimatedTotal: 150.00,
    billingPeriod: 'May 1 - May 31, 2025'
  };
  
  // Notifications
  const notifications = [
    { 
      type: 'info', 
      title: 'System Maintenance', 
      message: 'Scheduled maintenance on May 20, 2025 at 02:00 UTC', 
      time: '2 hours ago' 
    },
    { 
      type: 'success', 
      title: 'VM Created', 
      message: 'VM "web-server-01" has been successfully created', 
      time: '1 day ago' 
    },
    { 
      type: 'warning', 
      title: 'Storage Usage', 
      message: 'You have used 80% of your storage allocation', 
      time: '3 days ago' 
    },
  ];
  

  // Handle start VM
  const handleStartVm = async (vm) => {
    setActionLoading(true);
    
    try {
      const response = await startVm({
        user_id: vm.user_id,
        vm_id: vm.id
      });
      
      if (response) {
        setSuccess(`VM "${vm.name}" is starting up. This might take a moment.`);
        
        // Refresh VMs after a short delay
        setTimeout(() => {
          fetchVms();
        }, 3000);
      }
    } catch (err) {
      setError(`Failed to start VM "${vm.name}". Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle stop VM
  const handleStopVm = async (vm) => {
    if (!vm) return;
    
    setActionLoading(true);
    setConfirmStopOpen(false);
    
    try {
      const response = await stopVm({
        user_id: vm.user_id,
        vm_id: vm.id
      });
      
      if (response) {
        setSuccess(`VM "${vm.name}" is stopping. This might take a moment.`);
        
        // Refresh VMs after a short delay
        setTimeout(() => {
          fetchVms();
        }, 3000);
      }
    } catch (err) {
      setError(`Failed to stop VM "${vm.name}". Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle delete VM
  const handleDeleteVm = async (vm) => {
    if (!vm) return;
    
    setActionLoading(true);
    setConfirmDeleteOpen(false);
    
    try {
      const response = await deleteVm({
        user_id: `${vm.user_id}`,
        vm_id: vm.id
      });
      
      if (response) {
        setSuccess(`VM "${vm.name}" has been deleted.`);
        
        // Refresh VMs
        fetchVms();
      }
    } catch (err) {
      setError(`Failed to delete VM "${vm.name}". Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Event handlers
  const handleVmAction = (id, action) => {
    console.log(`VM ${id} action: ${action}`);
    
    // Handle actual VM actions
    const targetVm = vms.find(vm => vm.id === id);
    console.log("TARGET VM", targetVm);
    if (!targetVm) return;
    
    switch (action) {
      case 'start':
        // Call startVm API
        console.log(`Starting VM ${targetVm.name}`);
        handleStartVm(targetVm);
        break;
      case 'stop':
        // Call stopVm API
        console.log(`Stopping VM ${targetVm.name}`);
        handleStopVm(targetVm);
        break;
      case 'delete':
        // Call deleteVm API
        console.log(`Deleting VM ${targetVm.name}`);
        handleDeleteVm(targetVm);
        break;
      default:
        console.log(`Action ${action} for VM ${targetVm.name}`);
    }
  };
  
  const handleRefresh = () => {
    console.log('Refreshing VM list');
    fetchVms();
  };
  
  const handleCreateVm = () => {
    console.log('Navigate to Create VM page');
    // Navigate to VM creation page
    window.location.href = '/vms';
  };
  
  const handleUserAction = (action, userId) => {
    console.log(`User action: ${action}${userId ? ` for user ${userId}` : ''}`);
  };
  
  const handleViewBilling = () => {
    console.log('Navigate to Billing page');
    // Navigate to billing page
    window.location.href = '/billing';
  };
  
  const handleViewAllNotifications = () => {
    console.log('Navigate to Notifications page');
    // Navigate to notifications page
    window.location.href = '/notifications';
  };
  
  // Toggle between showing all users' VMs or just admin's VMs
  const handleToggleUserFilter = (event) => {
    setShowAllUsers(event.target.checked);
  };

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      {/* Breadcrumb Navigation */}
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
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Typography>
      </Breadcrumbs>
      
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={700} 
          sx={{ mb: 1 }}
        >
          {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {loading ? 'Loading...' : `Welcome back${currentUser ? ', ' + currentUser.name : ''}! Here's an overview of your cloud resources.`}
        </Typography>
      </Box>
      
      {/* Admin Toggle (For Admins Only) */}
      {userRole === 'admin' && (
        <Box sx={{ mb: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Admin View
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showAllUsers} 
                    onChange={handleToggleUserFilter}
                    color="warning"
                  />
                }
                label={showAllUsers ? "Showing all users' VMs" : "Showing only your VMs"}
              />
            </Box>
          </Paper>
        </Box>
      )}
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {(userRole === 'admin' && showAllUsers ? adminStats : stats).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              secondaryValue={stat.secondaryValue}
              change={stat.change}
            />
          </Grid>
        ))}
        
        {/* VM List */}
        <Grid item xs={12} lg={8}>
          <VmList 
            vms={vms} 
            onVmAction={handleVmAction} 
            onRefresh={handleRefresh}
            onCreateVm={handleCreateVm}
            isLoading={vmLoading}
            isAdmin={userRole === 'admin'}
            actionLoading={actionLoading}
          />
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <QuickActions 
            actions={userRole === 'admin' && showAllUsers ? adminQuickActions : userQuickActions} 
          />
        </Grid>
        
        {/* For regular users: Resource Usage and Network Status */}
        {(!userRole === 'admin' || !showAllUsers) && (
          <>
            <Grid item xs={12} md={8}>
              <ResourceUsage data={resourceUsage} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <NetworkStatus network={networkStatus} />
            </Grid>
          </>
        )}
        
        {/* For admins: System Status and User Management */}
        {userRole === 'admin' && showAllUsers && (
          <>
            <Grid item xs={12} md={6}>
              <SystemStatus services={systemServices} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <UserManagement 
                users={users}
                onUserAction={handleUserAction}
              />
            </Grid>
          </>
        )}
        
        {/* Billing Summary (For Both) */}
        <Grid item xs={12} md={userRole === 'admin' && showAllUsers ? 6 : 4}>
          <BillingSummary 
            billingData={billingData} 
            onViewBilling={handleViewBilling}
          />
        </Grid>
        
        {/* Notifications (For Both) */}
        <Grid item xs={12} md={userRole === 'admin' && showAllUsers ? 6 : 8}>
          <Notifications 
            notifications={notifications}
            onViewAll={handleViewAllNotifications}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;