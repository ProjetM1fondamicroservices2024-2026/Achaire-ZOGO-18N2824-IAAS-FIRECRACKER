import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as DnsIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

// Import your API functions
import { 
  getHealthCheck, 
  getInfo, 
  getClusters, 
  getClusterById, 
  getAvailableClusters 
} from '../../api/cluster-service-backend';

const ClusterUtilities = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [availableClusters, setAvailableClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch all utility data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all cluster utility data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch health check data
      const health = await getHealthCheck();
      if (health) {
        setHealthData(health);
      }
      
      // Fetch info data
      const info = await getInfo();
      if (info) {
        setInfoData(info);
      }
      
      // Fetch available clusters
      const available = await getAvailableClusters();
      if (available) {
        setAvailableClusters(available);
      }
      
      // Update last refresh timestamp
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to fetch cluster utility data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed info for a specific cluster
  const fetchClusterDetails = async (clusterId) => {
    setLoading(true);
    
    try {
      const clusterData = await getClusterById(clusterId);
      if (clusterData) {
        setSelectedCluster(clusterData);
        setOpenDialog(true);
      }
    } catch (err) {
      setError(`Failed to fetch details for cluster ID ${clusterId}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Close cluster details dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCluster(null);
  };

  // Determine health status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy':
      case 'ok':
      case 'good':
      case 'active':
        return theme.palette.success.main;
      case 'warning':
      case 'degraded':
        return theme.palette.warning.main;
      case 'error':
      case 'critical':
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Calculate resource usage percentage
  const calculateUsagePercentage = (total, available) => {
    if (!total || total === 0) return 0;
    return Math.round(((total - available) / total) * 100);
  };

  // Render the health status section
  const renderHealthStatus = () => {
    if (!healthData) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Health check data not available
          </Typography>
        </Paper>
      );
    }

    // Mock healthData structure for visualization
    // Replace with actual data structure from your API
    const health = {
      status: healthData.status || 'unknown',
      services: healthData.services || [
        { name: 'API', status: 'healthy', message: 'API is responding normally' },
        { name: 'Database', status: 'healthy', message: 'Database connections are stable' },
        { name: 'Storage', status: 'healthy', message: 'Storage systems are accessible' },
        { name: 'Scheduler', status: 'healthy', message: 'Scheduler is processing jobs' }
      ]
    };

    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>System Health</Typography>
          <Chip 
            label={health.status.toUpperCase()}
            color={health.status === 'healthy' ? 'success' : 
                  health.status === 'warning' ? 'warning' : 
                  health.status === 'error' ? 'error' : 'default'}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {health.services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell><strong>{service.name}</strong></TableCell>
                  <TableCell>
                    <Chip 
                      size="small"
                      label={service.status.toUpperCase()}
                      color={service.status === 'healthy' ? 'success' : 
                            service.status === 'warning' ? 'warning' : 
                            service.status === 'error' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{service.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  // Render system information section
  const renderSystemInfo = () => {
    if (!infoData) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            System information not available
          </Typography>
        </Paper>
      );
    }

    // Mock infoData structure for visualization
    // Replace with actual data structure from your API
    //console.log(availableClusters);
    const info = {
      version: infoData.version || 'v1.0.0',
      uptime: infoData.uptime || '10 days, 5 hours',
      totalClusters: infoData.total_clusters || availableClusters.length || 0,
      activeClusters: infoData.active_clusters || availableClusters?.filter(c => c.status === 'active').length || 0,
      totalVMs: infoData.total_vms || 24,
      runningVMs: infoData.running_vms || 18,
      totalStorage: infoData.total_storage || 2048, // GB
      availableStorage: infoData.available_storage || 1280, // GB
      totalMemory: infoData.total_memory || 512, // GB
      availableMemory: infoData.available_memory || 256, // GB
      totalCPU: infoData.total_cpu || 64, // cores
      availableCPU: infoData.available_cpu || 30 // cores
    };

    const storageUsage = calculateUsagePercentage(info.totalStorage, info.availableStorage);
    const memoryUsage = calculateUsagePercentage(info.totalMemory, info.availableMemory);
    const cpuUsage = calculateUsagePercentage(info.totalCPU, info.availableCPU);

    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>System Information</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Version</Typography>
              <Typography variant="body1">{info.version}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">System Uptime</Typography>
              <Typography variant="body1">{info.uptime}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Clusters</Typography>
              <Typography variant="body1">
                {info.activeClusters} active / {info.totalClusters} total
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Virtual Machines</Typography>
              <Typography variant="body1">
                {info.runningVMs} running / {info.totalVMs} total
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StorageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Storage Usage</Typography>
                </Box>
                <Typography variant="body2">{storageUsage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={storageUsage} 
                color={storageUsage > 90 ? "error" : storageUsage > 70 ? "warning" : "primary"}
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {info.totalStorage - info.availableStorage} GB used of {info.totalStorage} GB
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MemoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Memory Usage</Typography>
                </Box>
                <Typography variant="body2">{memoryUsage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={memoryUsage} 
                color={memoryUsage > 90 ? "error" : memoryUsage > 70 ? "warning" : "primary"}
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {info.totalMemory - info.availableMemory} GB used of {info.totalMemory} GB
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DnsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">CPU Usage</Typography>
                </Box>
                <Typography variant="body2">{cpuUsage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={cpuUsage} 
                color={cpuUsage > 90 ? "error" : cpuUsage > 70 ? "warning" : "primary"}
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {info.totalCPU - info.availableCPU} cores used of {info.totalCPU} cores
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Render available clusters section
  const renderAvailableClusters = () => {
    if (!availableClusters || availableClusters.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No available clusters found
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Available Clusters</Typography>
          <Typography variant="body2" color="text.secondary">
            {availableClusters.length} clusters available
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cluster Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Processor</TableCell>
                <TableCell>CPU Available</TableCell>
                <TableCell>RAM Available</TableCell>
                <TableCell>Storage Available</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableClusters.map((cluster) => {
                // Calculate usage percentages
                const cpuUsage = calculateUsagePercentage(
                  cluster.number_of_core, 
                  cluster.available_processor
                );
                const ramUsage = calculateUsagePercentage(
                  cluster.ram, 
                  cluster.available_ram
                );
                const storageUsage = calculateUsagePercentage(
                  cluster.rom, 
                  cluster.available_rom
                );

                const processor = cluster.processeur;
                
                return (
                  <TableRow key={cluster.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {cluster.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>{cluster.ip}</TableCell>
                     <TableCell>{processor}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={cpuUsage} 
                            color={cpuUsage > 90 ? "error" : cpuUsage > 70 ? "warning" : "primary"}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {cluster.available_processor}/{cluster.number_of_core}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={ramUsage} 
                            color={ramUsage > 90 ? "error" : ramUsage > 70 ? "warning" : "primary"}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {cluster.available_ram}/{cluster.ram} GB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={storageUsage} 
                            color={storageUsage > 90 ? "error" : storageUsage > 70 ? "warning" : "primary"}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {cluster.available_rom}/{cluster.rom} GB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => fetchClusterDetails(cluster.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  // Render cluster details dialog
  const renderClusterDetailsDialog = () => {
    if (!selectedCluster) return null;
    
    return (
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Cluster Details: {selectedCluster.nom}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>General Information</Typography>
              <Box component="dl" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box component="dt" sx={{ flexBasis: '40%', fontWeight: 'medium' }}>Cluster ID:</Box>
                  <Box component="dd" sx={{ flexGrow: 1 }}>{selectedCluster.id}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box component="dt" sx={{ flexBasis: '40%', fontWeight: 'medium' }}>Name:</Box>
                  <Box component="dd" sx={{ flexGrow: 1 }}>{selectedCluster.nom}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box component="dt" sx={{ flexBasis: '40%', fontWeight: 'medium' }}>IP Address:</Box>
                  <Box component="dd" sx={{ flexGrow: 1 }}>{selectedCluster.ip}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box component="dt" sx={{ flexBasis: '40%', fontWeight: 'medium' }}>MAC Address:</Box>
                  <Box component="dd" sx={{ flexGrow: 1 }}>{selectedCluster.adresse_mac}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box component="dt" sx={{ flexBasis: '40%', fontWeight: 'medium' }}>Processor:</Box>
                  <Box component="dd" sx={{ flexGrow: 1 }}>{selectedCluster.processeur}</Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Resource Allocation</Typography>
              
              <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU Cores</Typography>
                  <Typography variant="body2">
                    {selectedCluster.available_processor} available / {selectedCluster.number_of_core} total
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateUsagePercentage(
                    selectedCluster.number_of_core,
                    selectedCluster.available_processor
                  )} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Memory (RAM)</Typography>
                  <Typography variant="body2">
                    {selectedCluster.available_ram} GB available / {selectedCluster.ram} GB total
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateUsagePercentage(
                    selectedCluster.ram,
                    selectedCluster.available_ram
                  )} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2">
                    {selectedCluster.available_rom} GB available / {selectedCluster.rom} GB total
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateUsagePercentage(
                    selectedCluster.rom,
                    selectedCluster.available_rom
                  )} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Cluster Management Dashboard</Typography>
        <Box>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={fetchAllData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
      </Box>
      
      {loading && <LinearProgress sx={{ mb: 3 }} />}
      
      {lastRefresh && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {lastRefresh.toLocaleString()}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderHealthStatus()}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderSystemInfo()}
        </Grid>
        
        <Grid item xs={12}>
          {renderAvailableClusters()}
        </Grid>
      </Grid>
      
      {renderClusterDetailsDialog()}
    </Box>
  );
};

export default ClusterUtilities;