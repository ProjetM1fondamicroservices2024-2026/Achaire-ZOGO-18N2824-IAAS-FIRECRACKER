import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as DnsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Computer as ComputerIcon,
  RestartAlt as RestartAltIcon
} from '@mui/icons-material';

// Import API functions
import { 
  getVms, 
  startVm, 
  stopVm, 
  deleteVm, 
  statusVm,
  getVmMetrics
} from '../../api/vm-host-backend';

// Import current user
import { getLoggedInUser } from '../../api/user-backend';

const VmActions = () => {
  const theme = useTheme();
  
  // State for VMs
  const [vms, setVms] = useState([]);
  const [filteredVms, setFilteredVms] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);
  
  // State for user
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for dialogs
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // State for VM metrics
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  
  // State for action menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  // Fetch VMs on component mount
  useEffect(() => {
    fetchUserAndVms();
  }, []);
  
  // Filter VMs when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVms(vms);
    } else {
      const filtered = vms.filter(vm => 
        vm.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVms(filtered);
    }
  }, [searchTerm, vms]);
  
  useEffect(() => {
    console.log("FILT", filteredVms);
  }, [filteredVms]);
  // Fetch user and VMs
  const fetchUserAndVms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current user
      const userData = await getLoggedInUser();
      if (userData) {
        setCurrentUser(userData);
        
        // Fetch VMs
        const vmsData = await getVms(userData.id);

        console.log("VMS", vmsData);
        if (vmsData) {
          // Filter VMs for current user
          setVms(vmsData);
          setFilteredVms(vmsData);
        }
      }
    } catch (err) {
      setError('Failed to fetch your virtual machines. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Open action menu
  const handleMenuOpen = (event, vm) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedVm(vm);
  };
  
  // Close action menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle view details
  const handleViewDetails = async (vm) => {
    handleMenuClose();
    setSelectedVm(vm);
    setViewDetailsOpen(true);
    
    // Fetch VM metrics
    fetchVmMetrics(vm);
  };
  
  // Fetch VM metrics
  const fetchVmMetrics = async (vm) => {
    setLoadingMetrics(true);
    
    try {
      const metricsData = await getVmMetrics(vm.user_id, vm.name);
      if (metricsData) {
        setMetrics(metricsData.data || metricsData);
      }
    } catch (err) {
      console.error('Failed to fetch VM metrics:', err);
      // Don't show an error message, just log it
    } finally {
      setLoadingMetrics(false);
    }
  };
  
  // Handle VM action selection
  const handleAction = (action, vm = selectedVm) => {
    handleMenuClose();
    
    if (!vm) return;
    
    setSelectedVm(vm);
    
    switch (action) {
      case 'start':
        handleStartVm(vm);
        break;
      case 'stop':
        setConfirmStopOpen(true);
        handleStopVm();
        break;
      case 'delete':
        setConfirmDeleteOpen(true);
        break;
      default:
        break;
    }
  };
  
  // Handle start VM
  const handleStartVm = async (vm) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await startVm({
        user_id: vm.user_id,
        vm_id: vm.id
      });
      
      if (response) {
        setSuccess(`VM "${vm.name}" is starting up. This might take a moment.`);
        
        // Refresh VMs after a short delay
        setTimeout(() => {
          fetchUserAndVms();
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
  const handleStopVm = async () => {
    if (!selectedVm) return;
    
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    setConfirmStopOpen(false);
    
    try {
      const response = await stopVm({
        user_id: selectedVm.user_id,
        vm_id: selectedVm.id
      });
      
      if (response) {
        setSuccess(`VM "${selectedVm.name}" is stopping. This might take a moment.`);
        
        // Refresh VMs after a short delay
        setTimeout(() => {
          fetchUserAndVms();
        }, 3000);
      }
    } catch (err) {
      setError(`Failed to stop VM "${selectedVm.name}". Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle delete VM
  const handleDeleteVm = async () => {
    if (!selectedVm) return;
    
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    setConfirmDeleteOpen(false);
    
    try {
      const response = await deleteVm({
        user_id: `${selectedVm.user_id}`,
        vm_id: selectedVm.id
      });
      
      if (response) {
        setSuccess(`VM "${selectedVm.name}" has been deleted.`);
        
        // Refresh VMs
        fetchUserAndVms();
      }
    } catch (err) {
      setError(`Failed to delete VM "${selectedVm.name}". Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Render status chip
  const renderStatusChip = (status) => {
    let color;
    let icon;
    
    switch (status) {
      case 'running':
        color = 'success';
        icon = <CheckCircleIcon />;
        break;
      case 'stopped':
        color = 'warning';
        icon = <WarningIcon />;
        break;
      case 'error':
        color = 'error';
        icon = <ErrorIcon />;
        break;
      default:
        color = 'default';
        icon = <InfoIcon />;
    }
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={color} 
        size="small"
        icon={icon}
      />
    );
  };
  
  // Function to convert MiB to GiB for display
  const mibToGib = (mib) => {
    return (mib / 1024).toFixed(1);
  };
  
  return (
    <Box>
      {/* Top Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search VMs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchUserAndVms}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Loading Indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* VM Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>OS Type</TableCell> */}
              <TableCell>Mac Address</TableCell>
              <TableCell>Resources</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : filteredVms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No virtual machines found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchTerm ? 'Try a different search term or ' : ''} 
                      Create a new VM in the "Create VM" tab.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredVms.map((vm) => (
                <TableRow key={vm.id || vm.name}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ComputerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" fontWeight="medium">
                        {vm.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{renderStatusChip(vm.status)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={vm.mac_address} 
                      variant="outlined" 
                      size="small" 
                      color={vm.os_type === 'linux' ? 'success' : 'primary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="CPU Cores">
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <DnsIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                          <Typography variant="body2">{vm.vcpu_count}</Typography>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title="Memory (RAM)">
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <MemoryIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                          <Typography variant="body2">{mibToGib(vm.memory_size_mib)} GB</Typography>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title="Storage">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorageIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                          <Typography variant="body2">{vm.disk_size_gb} GB</Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {vm.ip_address || 'Not assigned'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <ButtonGroup variant="outlined" size="small">
                      {vm.status === 'stopped' || vm.status === 'created' && (
                        <>
                          <Tooltip title="Start VM">
                            <Button 
                              color="success" 
                              onClick={() => handleAction('start', vm)}
                              disabled={actionLoading}
                            >
                              <StartIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Stop VM">
                            <Button 
                              color="warning" 
                              onClick={() => handleAction('stop', vm)}
                              disabled={actionLoading}
                              sx={{ borderRadius: "0", }}
                            >
                              <StopIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </>
                      )}

                      {vm.status === 'running' && (
                        <Tooltip title="Stop VM">
                          <Button 
                            color="warning" 
                            onClick={() => handleAction('stop', vm)}
                            disabled={actionLoading}
                          >
                            <StopIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="More Actions">
                        <Button 
                          onClick={(e) => handleMenuOpen(e, vm)}
                          disabled={actionLoading}
                        >
                          <MoreVertIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedVm)}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        {selectedVm && selectedVm.status === 'stopped' && (
          <MenuItem onClick={() => handleAction('start')}>
            <ListItemIcon>
              <StartIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Start VM</ListItemText>
          </MenuItem>
        )}
        
        {selectedVm && selectedVm.status === 'running' && (
          <MenuItem onClick={() => handleAction('stop')}>
            <ListItemIcon>
              <StopIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Stop VM</ListItemText>
          </MenuItem>
        )}
        
        {selectedVm && selectedVm.status === 'running' && (
          <MenuItem onClick={() => handleAction('restart')}>
            <ListItemIcon>
              <RestartAltIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Restart VM</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete VM</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* View Details Dialog */}
      <Dialog
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          VM Details: {selectedVm ? selectedVm.name : ''}
        </DialogTitle>
        <DialogContent dividers>
          {selectedVm && (
            <Grid container spacing={3}>
              {/* General Information */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    General Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{selectedVm.name}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      {renderStatusChip(selectedVm.status)}
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">OS Type</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip 
                        label={selectedVm.os_type} 
                        variant="outlined" 
                        size="small" 
                        color={selectedVm.os_type === 'linux' ? 'success' : 'primary'}
                      />
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Host Cluster</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {selectedVm.service_cluster_id ? `ID: ${selectedVm.service_cluster_id}` : 'Not available'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Created</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {selectedVm.created_at ? new Date(selectedVm.created_at).toLocaleString() : 'Not available'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Resources */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resources
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <DnsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">CPU Cores</Typography>
                            <Typography variant="h5">{selectedVm.cpu_count}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <MemoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Memory</Typography>
                            <Typography variant="h5">{mibToGib(selectedVm.memory_size_mib)} GB</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorageIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Storage</Typography>
                            <Typography variant="h5">{selectedVm.disk_size_gb} GB</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">VM Offer</Typography>
                            <Typography variant="h5">
                              {selectedVm.vm_offer_id ? `ID: ${selectedVm.vm_offer_id}` : 'Custom'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Network Information */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Network Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">IP Address</Typography>
                      <Typography variant="body1">{selectedVm.vm_ip || 'Not assigned'}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">MAC Address</Typography>
                      <Typography variant="body1">{selectedVm.vm_mac || 'Not assigned'}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">TAP Device</Typography>
                      <Typography variant="body1">{selectedVm.tap_device || 'Not assigned'}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">TAP IP</Typography>
                      <Typography variant="body1">{selectedVm.tap_ip || 'Not assigned'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Metrics */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Performance Metrics
                    </Typography>
                    
                    <Button 
                      size="small" 
                      startIcon={<RefreshIcon />}
                      onClick={() => fetchVmMetrics(selectedVm)}
                      disabled={loadingMetrics}
                    >
                      Refresh
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {loadingMetrics ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : metrics ? (
                    <Grid container spacing={2}>
                      {/* This would display actual metrics data */}
                      <Grid item xs={12}>
                        <Alert severity="info">
                          <Typography variant="body2">
                            Metrics data is available for this VM. Implement visualization based on your specific metrics format.
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  ) : (
                    <Box sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No metrics data available. Metrics may not be available for stopped VMs.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDetailsOpen(false)}>
            Close
          </Button>
          
          {selectedVm && selectedVm.status === 'stopped' && (
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<StartIcon />}
              onClick={() => {
                setViewDetailsOpen(false);
                handleAction('start');
              }}
            >
              Start VM
            </Button>
          )}
          
          {selectedVm && selectedVm.status === 'running' && (
            <Button 
              variant="contained" 
              color="warning" 
              startIcon={<StopIcon />}
              onClick={() => {
                setViewDetailsOpen(false);
                handleAction('stop');
              }}
            >
              Stop VM
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Confirm Stop Dialog */}
      <Dialog
        open={confirmStopOpen}
        onClose={() => setConfirmStopOpen(false)}
      >
        <DialogTitle>Confirm Stop VM</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to stop the VM "{selectedVm?.name}"? Any running applications and unsaved data may be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmStopOpen(false)} 
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStopVm} 
            color="warning" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            Stop VM
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete VM</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the VM "{selectedVm?.name}"? This action cannot be undone, and all data associated with this VM will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDeleteOpen(false)} 
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteVm} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            Delete VM
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VmActions;