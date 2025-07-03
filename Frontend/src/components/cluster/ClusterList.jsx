import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Import your API functions
import { 
  getClusters, 
  getClusterById, 
  createCluster, 
  updateCluster, 
  deleteCluster, 
  getAvailableClusters 
} from '../../api/cluster-service-backend';

const ClustersList = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCluster, setCurrentCluster] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    adresse_mac: '',
    ip: '',
    rom: 0,
    available_rom: 0,
    ram: 0,
    available_ram: 0,
    processeur: '',
    available_processor: 0,
    number_of_core: 0
  });

  // Fetch clusters on component mount
  useEffect(() => {
    fetchClusters();
  }, []);

  // Fetch all clusters
  const fetchClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClusters();
      if (data) {
        setClusters(data);
      }
    } catch (err) {
      setError('Failed to fetch clusters. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('rom') || name.includes('ram') || name.includes('processor') || name.includes('core') 
        ? Number(value) 
        : value
    });
  };

  // Open create cluster dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      nom: '',
      adresse_mac: '',
      ip: '',
      rom: 0,
      available_rom: 0,
      ram: 0,
      available_ram: 0,
      processeur: '',
      available_processor: 0,
      number_of_core: 0
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open edit cluster dialog
  const handleOpenEditDialog = async (clusterId) => {
    setLoading(true);
    try {
      const clusterData = await getClusterById(clusterId);
      if (clusterData) {
        setCurrentCluster(clusterData);
        setFormData({
          nom: clusterData.nom || '',
          adresse_mac: clusterData.adresse_mac || '',
          ip: clusterData.ip || '',
          rom: clusterData.rom || 0,
          available_rom: clusterData.available_rom || 0,
          ram: clusterData.ram || 0,
          available_ram: clusterData.available_ram || 0,
          processeur: clusterData.processeur || '',
          available_processor: clusterData.available_processor || 0,
          number_of_core: clusterData.number_of_core || 0
        });
        setIsEditing(true);
        setOpenDialog(true);
      }
    } catch (err) {
      setError('Failed to fetch cluster details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCluster(null);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEditing && currentCluster) {
        // Update existing cluster
        await updateCluster(formData, currentCluster.id);
      } else {
        // Create new cluster
        await createCluster(formData);
      }
      // Refresh clusters list
      fetchClusters();
      handleCloseDialog();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} cluster. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete cluster
  const handleDeleteCluster = async (clusterId) => {
    if (window.confirm("Are you sure you want to delete this cluster?")) {
      setLoading(true);
      try {
        await deleteCluster(clusterId);
        // Refresh clusters list
        fetchClusters();
      } catch (err) {
        setError('Failed to delete cluster. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate resource usage percentage
  const calculateUsage = (total, available) => {
    if (!total) return 0;
    const used = total - available;
    return Math.round((used / total) * 100);
  };

  // Status determination based on resource availability
  const getClusterStatus = (cluster) => {
    const romUsage = calculateUsage(cluster.rom, cluster.available_rom);
    const ramUsage = calculateUsage(cluster.ram, cluster.available_ram);
    const cpuUsage = calculateUsage(cluster.number_of_core, cluster.available_processor);
    
    if (romUsage > 90 || ramUsage > 90 || cpuUsage > 90) {
      return "critical";
    } else if (romUsage > 70 || ramUsage > 70 || cpuUsage > 70) {
      return "warning";
    } else {
      return "healthy";
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Cluster Management
        </Typography>
        <Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchClusters}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            disabled={loading}
          >
            Add Cluster
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>MAC Address</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.length > 0 ? (
              clusters.map((cluster) => {
                const status = getClusterStatus(cluster);
                const romUsage = calculateUsage(cluster.rom, cluster.available_rom);
                const ramUsage = calculateUsage(cluster.ram, cluster.available_ram);
                const cpuUsage = calculateUsage(cluster.number_of_core, cluster.available_processor);

                return (
                  <TableRow key={cluster.id}>
                    <TableCell>
                      <Chip
                        icon={
                          status === 'healthy' ? <CheckIcon /> : 
                          status === 'warning' ? <InfoIcon /> : 
                          <ErrorIcon />
                        }
                        label={status.charAt(0).toUpperCase() + status.slice(1)}
                        color={
                          status === 'healthy' ? 'success' : 
                          status === 'warning' ? 'warning' : 
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{cluster.nom}</TableCell>
                    <TableCell>{cluster.ip}</TableCell>
                    <TableCell>{cluster.adresse_mac}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={romUsage} 
                            color={romUsage > 90 ? "error" : romUsage > 70 ? "warning" : "primary"}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {romUsage}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {(cluster.rom - cluster.available_rom).toFixed(1)} / {cluster.rom.toFixed(1)} GB
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={ramUsage} 
                            color={ramUsage > 90 ? "error" : ramUsage > 70 ? "warning" : "primary"}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {ramUsage}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {(cluster.ram - cluster.available_ram).toFixed(1)} / {cluster.ram.toFixed(1)} GB
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={cpuUsage} 
                            color={cpuUsage > 90 ? "error" : cpuUsage > 70 ? "warning" : "primary"}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {cpuUsage}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {cluster.number_of_core - cluster.available_processor} / {cluster.number_of_core} Cores
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEditDialog(cluster.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteCluster(cluster.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {loading ? (
                    <CircularProgress size={24} sx={{ m: 2 }} />
                  ) : (
                    <Typography color="text.secondary">
                      No clusters found. Click "Add Cluster" to create one.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Cluster' : 'Add New Cluster'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                label="Cluster Name"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ip"
                label="IP Address"
                fullWidth
                value={formData.ip}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="adresse_mac"
                label="MAC Address"
                fullWidth
                value={formData.adresse_mac}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="processeur"
                label="Processor"
                fullWidth
                value={formData.processeur}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="rom"
                label="Total Storage (GB)"
                type="number"
                fullWidth
                value={formData.rom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="available_rom"
                label="Available Storage (GB)"
                type="number"
                fullWidth
                value={formData.available_rom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="ram"
                label="Total RAM (GB)"
                type="number"
                fullWidth
                value={formData.ram}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="available_ram"
                label="Available RAM (GB)"
                type="number"
                fullWidth
                value={formData.available_ram}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="number_of_core"
                label="CPU Cores"
                type="number"
                fullWidth
                value={formData.number_of_core}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="available_processor"
                label="Available CPU Cores"
                type="number"
                fullWidth
                value={formData.available_processor}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClustersList;