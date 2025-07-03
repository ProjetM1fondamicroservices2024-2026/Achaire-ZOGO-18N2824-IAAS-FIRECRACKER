import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  Divider,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  LinearProgress,
   ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Snackbar,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as DnsIcon,
  AttachMoney as MoneyIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Import the VM offers API functions
import {
  getVmOffers,
  createVmOffer,
  getVmOfferById,
  deleteVmOffer,
  updateVmOffer,
  searchVmOffer,
  getActiveVmOffers,
  getVmOfferHealthCheck
} from '../api/vm-offer-backend';

const VMOffersPage = () => {
  const theme = useTheme();
  
  // State for VM offers
  const [vmOffers, setVmOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected offer
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cpu_count: 1,
    memory_size_mib: 1024, // 1 GB
    disk_size_gb: 10240, // 10 GB
    price_per_hour: 0.00
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  
  // State for view options
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [activeFilter, setActiveFilter] = useState(false); // Show all or only active
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOfferId, setMenuOfferId] = useState(null);
  
  // Fetch VM offers on component mount
  useEffect(() => {
    fetchVmOffers();
  }, []);
  
  // Fetch all VM offers or active ones based on filter
  const fetchVmOffers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = activeFilter 
        ? await getActiveVmOffers()
        : await getVmOffers();
      
      if (data) {
        setVmOffers(data);
      }
    } catch (err) {
      setError('Failed to fetch VM offers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchVmOffers();
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await searchVmOffer(searchTerm);
      if (data) {
        setVmOffers(data.data || data);
      }
    } catch (err) {
      showSnackbar('Search failed. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle menu open
  const handleMenuOpen = (event, offerId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOfferId(offerId);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOfferId(null);
  };
  
  // Handle action from menu
  const handleAction = async (action,id) => {
    handleMenuClose();
     console.log(id);
    if (!id) return;
    
    try {
      // Get the selected VM offer
      const offerData = vmOffers.find(offer => offer.id === id);
      
      if (!offerData) {
        showSnackbar('VM offer not found.', 'error');
        return;
      }
      
      setSelectedOffer(offerData);
      
      switch (action) {
        case 'edit':
          console.log("edit vm offer");
          // Populate form with offer data
          setFormData({
            name: offerData.name || '',
            description: offerData.description || '',
            cpu_count: offerData.cpu_count || 1,
            memory_size_mib: offerData.memory_size_mib || 1024,
            disk_size_gb: offerData.disk_size_gb || 10,
            price_per_hour: offerData.price_per_hour || 0.00
          });
          setEditDialogOpen(true);
          break;
        case 'delete':
          setDeleteDialogOpen(true);
          break;
        default:
          break;
      }
    } catch (err) {
      showSnackbar('Failed to perform action. Please try again.', 'error');
      console.error(err);
    }
  };
  
  // Open create dialog
  const handleCreateDialogOpen = () => {
    // Reset form data
    setFormData({
      name: '',
      description: '',
      cpu_count: 1,
      memory_size_mib: 1024, // 1 GB
      disk_size_gb: 10, // 10 GB
      price_per_hour: 0.00
    });
    setFormErrors({});
    setCreateDialogOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    const parsedValue = 
      name === 'cpu_count' || 
      name === 'memory_size_mib' || 
      name === 'disk_size_gb' || 
      name === 'price_per_hour' 
        ? parseFloat(value) 
        : value;
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
    
    // Clear validation error when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.cpu_count < 1) {
      errors.cpu_count = 'CPU count must be at least 1';
    }
    
    if (formData.memory_size_mib < 512) {
      errors.memory_size_mib = 'Memory must be at least 512 MiB';
    }
    
    if (formData.disk_size_gb <= 0) {
      errors.disk_size_gb = 'Disk size must be at least 1 GiB (1024 MiB)';
    }
    
    if (formData.price_per_hour < 0) {
      errors.price_per_hour = 'Price must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle create VM offer
  const handleCreateVmOffer = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await createVmOffer(formData);
      
      if (response) {
        // Refresh VM offers list
        fetchVmOffers();
        
        // Close dialog
        setCreateDialogOpen(false);
        
        // Show success message
        showSnackbar('VM offer created successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to create VM offer. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit VM offer
  const handleEditVmOffer = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await updateVmOffer(selectedOffer.id, formData);
      
      if (response) {
        // Refresh VM offers list
        fetchVmOffers();
        
        // Close dialog
        setEditDialogOpen(false);
        
        // Show success message
        showSnackbar('VM offer updated successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to update VM offer. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete VM offer
  const handleDeleteVmOffer = async () => {
    if (!selectedOffer) return;
    
    setLoading(true);
    
    try {
      const response = await deleteVmOffer(selectedOffer.id);
      
      if (response) {
        // Refresh VM offers list
        fetchVmOffers();
        
        // Close dialog
        setDeleteDialogOpen(false);
        
        // Show success message
        showSnackbar('VM offer deleted successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to delete VM offer. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Filter VM offers based on search term
  const filteredOffers = vmOffers.filter(offer => 
    offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (offer.description && offer.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Convert MiB to GiB for display
  const mibToGib = (mib) => {
    return (mib / 1024).toFixed(1);
  };
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };
  
  // Render grid view
  const renderGridView = () => {
    return (
      <Grid container spacing={3}>
        {filteredOffers.map(offer => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <CardHeader
                title={offer.name}
                action={
                  <IconButton 
                    aria-label="settings" 
                    onClick={(e) => handleMenuOpen(e, offer.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {offer.description || 'No description provided'}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DnsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {offer.cpu_count} CPU {offer.cpu_count > 1 ? 'Cores' : 'Core'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MemoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {mibToGib(offer.memory_size_mib)} GB RAM
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StorageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {offer.disk_size_gb} GB Storage
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip 
                    icon={<MoneyIcon />} 
                    label={`${formatPrice(offer.price_per_hour)}/hour`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() =>{
                    console.log(offer.id);
                    handleAction('edit', offer.id);
                  } }
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleAction('delete', offer.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render table view
  const renderTableView = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell>Price (hourly)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOffers.map(offer => (
              <TableRow key={offer.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {offer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {offer.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DnsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {offer.cpu_count} {offer.cpu_count > 1 ? 'Cores' : 'Core'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MemoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {mibToGib(offer.memory_size_mib)} GB
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StorageIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {offer.disk_size_gb} GB
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={formatPrice(offer.price_per_hour)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small"
                    onClick={(e) => handleMenuOpen(e, offer.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">VM Offers</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchVmOffers}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
            disabled={loading}
          >
            Create VM Offer
          </Button>
        </Box>
      </Box>
      
      {/* Search and View Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search VM offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={activeFilter} 
                    onChange={() => {
                      setActiveFilter(!activeFilter);
                      fetchVmOffers();
                    }} 
                  />
                }
                label="Show Active Only"
                sx={{ mr: 2 }}
              />
              
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Tooltip title="Grid View">
                  <IconButton 
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  >
                    <GridViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table View">
                  <IconButton 
                    color={viewMode === 'table' ? 'primary' : 'default'}
                    onClick={() => setViewMode('table')}
                  >
                    <ListViewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Loading Indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* VM Offers Content */}
      {!loading && filteredOffers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No VM offers found
          </Typography>
          {searchTerm && (
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                fetchVmOffers();
              }}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderTableView()
      )}
      
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      
      {/* Create VM Offer Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create VM Offer</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                placeholder="e.g., Standard, Performance, Enterprise"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Provide a description of this VM offer"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Resources
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="cpu_count"
                label="CPU Cores"
                type="number"
                value={formData.cpu_count}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DnsIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 64 }
                }}
                error={Boolean(formErrors.cpu_count)}
                helperText={formErrors.cpu_count}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="memory_size_mib"
                label="Memory (MiB)"
                type="number"
                value={formData.memory_size_mib}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MemoryIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 512, step: 512 }
                }}
                error={Boolean(formErrors.memory_size_mib)}
                helperText={formErrors.memory_size_mib || '1024 MiB = 1 GiB'}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="disk_size_gb"
                label="Disk Size (GiB)"
                type="number"
                value={formData.disk_size_gb}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StorageIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, step: 1 }
                }}
                error={Boolean(formErrors.disk_size_gb)}
                helperText={formErrors.disk_size_gb || '1 GiB = 1024 MiB'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="price_per_hour"
                label="Price per Hour ($)"
                type="number"
                value={formData.price_per_hour}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0, step: 0.01 }
                }}
                error={Boolean(formErrors.price_per_hour)}
                helperText={formErrors.price_per_hour}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Cost Estimate
                </Typography>
                <Typography variant="h5">
                  {formatPrice(formData.price_per_hour * 24 * 30)}
                </Typography>
                <Typography variant="caption">
                  Based on continuous usage for 30 days
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Summary
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip icon={<DnsIcon />} label={`${formData.cpu_count} CPU Cores`} />
                  <Chip icon={<MemoryIcon />} label={`${mibToGib(formData.memory_size_mib)} GB RAM`} />
                  <Chip icon={<StorageIcon />} label={`${formData.disk_size_gb} GB Storage`} />
                  <Chip icon={<MoneyIcon />} label={`${formatPrice(formData.price_per_hour)}/hour`} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateVmOffer}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Create Offer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit VM Offer Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit VM Offer</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Resources
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="cpu_count"
                label="CPU Cores"
                type="number"
                value={formData.cpu_count}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DnsIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 64 }
                }}
                error={Boolean(formErrors.cpu_count)}
                helperText={formErrors.cpu_count}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="memory_size_mib"
                label="Memory (MiB)"
                type="number"
                value={formData.memory_size_mib}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MemoryIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 512, step: 512 }
                }}
                error={Boolean(formErrors.memory_size_mib)}
                helperText={formErrors.memory_size_mib || '1024 MiB = 1 GiB'}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="disk_size_gb"
                label="Disk Size (GiB)"
                type="number"
                value={formData.disk_size_gb}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StorageIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, step: 1 }
                }}
                error={Boolean(formErrors.disk_size_gb)}
                helperText={formErrors.disk_size_gb || '1024 MiB = 1 GiB'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="price_per_hour"
                label="Price per Hour ($)"
                type="number"
                value={formData.price_per_hour}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0, step: 0.01 }
                }}
                error={Boolean(formErrors.price_per_hour)}
                helperText={formErrors.price_per_hour}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Cost Estimate
                </Typography>
                <Typography variant="h5">
                  {formatPrice(formData.price_per_hour * 24 * 30)}
                </Typography>
                <Typography variant="caption">
                  Based on continuous usage for 30 days
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditVmOffer}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the VM offer "{selectedOffer?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. VMs already using this offer will not be affected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteVmOffer}
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VMOffersPage;