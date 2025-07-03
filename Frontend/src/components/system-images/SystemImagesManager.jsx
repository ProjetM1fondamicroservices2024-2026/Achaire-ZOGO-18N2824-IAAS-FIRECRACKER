import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  FormHelperText,
  LinearProgress,
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

// Import the API functions
import {
  getSystemImages,
  getSystemImageByid,
  createSystemImages,
  updateSystemImages,
  deleteSystemImages,
  searchSystemImages,
  getSystemImageByOsType,
  getHealthCheck
} from '../../api/system-images-backend';

// OS Type options
const OS_TYPES = [
  { value: 'linux', label: 'Linux' },
  { value: 'windows', label: 'Windows' },
  { value: 'macos', label: 'MacOS' },
  { value: 'unix', label: 'Unix' },
  { value: 'other', label: 'Other' }
];

// Default image when no image is available
const DEFAULT_IMAGE = 'https://th.bing.com/th?q=Ubuntu+Modern+Logo&w=40&h=40&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=CM&setlang=en&adlt=moderate&t=1&mw=247';

const SystemImagesManager = () => {
  const theme = useTheme();
  
  // State variables
  const [systemImages, setSystemImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [osTypeFilter, setOsTypeFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', or 'view'
  const [selectedImage, setSelectedImage] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    os_type: 'linux',
    version: '',
    description: '',
    image: null
  });
  
  // File upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Fetch system images on component mount
  useEffect(() => {
    fetchSystemImages();
  }, []);
  
  // Fetch all system images
  const fetchSystemImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSystemImages();
      if (data) {
        setSystemImages(data);
      }
    } catch (err) {
      setError('Failed to fetch system images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchSystemImages();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchSystemImages(searchQuery);
      if (data) {
        setSystemImages(data);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter by OS type
  const handleOsTypeFilter = async (osType) => {
    if (osType === 'all') {
      fetchSystemImages();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSystemImageByOsType(osType);
      console.log(data);
      if (data) {
        setSystemImages(data);
      }
    } catch (err) {
      setError('Filtering failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Reset filters
    setSearchQuery('');
    
    // Set OS type filter based on selected tab
    if (newValue === 0) {
      setOsTypeFilter('all');
      fetchSystemImages();
    } else if (newValue === 1) {
      setOsTypeFilter('linux');
      handleOsTypeFilter('linux');
    } else if (newValue === 2) {
      setOsTypeFilter('windows');
      handleOsTypeFilter('windows');
    } else if (newValue === 3) {
      setOsTypeFilter('other');
      handleOsTypeFilter('other');
    }
  };
  
  // Handle dialog open for create
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      os_type: 'linux',
      version: '',
      description: '',
      image: ''
    });
    setImagePreview('');
    setUploadedImage(null);
    setDialogMode('create');
    setOpenDialog(true);
  };
  
  // Handle dialog open for edit
  const handleOpenEditDialog = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(id);
      const data = await getSystemImageByid(id);
      if (data) {
        setSelectedImage(data);
        setFormData({
          name: data.name || '',
          os_type: data.os_type || 'linux',
          version: data.version || '',
          description: data.description || '',
          image: data.image || ''
        });
        setImagePreview(data.image || '');
        setDialogMode('edit');
        setOpenDialog(true);
      }
    } catch (err) {
      setError('Failed to fetch system image details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog open for view
  const handleOpenViewDialog = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSystemImageByid(id);
      console.log(data);
      if (data) {
        setSelectedImage(data);
        setDialogMode('view');
        setOpenDialog(true);
      }
    } catch (err) {
      setError('Failed to fetch system image details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
    setImagePreview('');
    setUploadedImage(null);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload this to your server
      // and get back a URL to use in the form
      setFormData({
        ...formData,
        image: file // This would be replaced with the actual URL from your server
      });
    }
  };
  
  // Handle form submission (create or update)
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.os_type || !formData.version) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (dialogMode === 'create') {
        // Create new system image
        await createSystemImages(formData);
        setSuccess('System image created successfully.');
      } else if (dialogMode === 'edit' && selectedImage) {
        // Update existing system image
        await updateSystemImages(formData, selectedImage.id);
        setSuccess('System image updated successfully.');
      }
      
      // Refresh system images list
      fetchSystemImages();
      
      // Close dialog after successful operation
      setTimeout(() => {
        handleCloseDialog();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(`Failed to ${dialogMode === 'create' ? 'create' : 'update'} system image. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete system image
  const handleDeleteSystemImage = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the system image "${name}"?`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await deleteSystemImages(id);
      setSuccess('System image deleted successfully.');
      
      // Refresh system images list
      fetchSystemImages();
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete system image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render OS type chip
  const renderOsTypeChip = (osType) => {
    let color;
    let label = osType;
    console.log(osType);
    switch (osType.toLowerCase()) {
      case 'linux':
        color = 'success';
        break;
      case 'windows':
        color = 'primary';
        break;
      case 'macos':
        color = 'secondary';
        break;
      case 'unix':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    return <Chip size="small" color={color} label={label.toUpperCase()} />;
  };
  
  // Filter images based on search and OS type
  const filteredImages = systemImages.filter(image => {
    const matchesSearch = !searchQuery || 
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.version.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOsType = osTypeFilter === 'all' || image.os_type === osTypeFilter;
    
    return matchesSearch && matchesOsType;
  });
  
  return (
    <Box>
      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          System Images
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchSystemImages}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreateDialog}
          >
            Add Image
          </Button>
        </Box>
      </Box>
      
      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search system images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
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
              <Button 
                variant="outlined" 
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ mr: 1 }}
              >
                Search
              </Button>
              {searchQuery && (
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    fetchSystemImages();
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for OS Type filtering */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="OS type tabs"
        >
          <Tab label="All Images" />
          <Tab label="Linux" />
          <Tab label="Windows" />
          <Tab label="Other OS" />
        </Tabs>
      </Box>
      
      {/* Loading indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* System Images Grid */}
      {filteredImages.length > 0 ? (
        <Grid container spacing={3}>
          {filteredImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image.image || DEFAULT_IMAGE}
                  alt={image.name}
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '70%' }}>
                      {image.name}
                    </Typography>
                    {renderOsTypeChip(image.os_type)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Version: {image.version}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                      height: '40px'
                    }}
                  >
                    {image.description || 'No description available'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenViewDialog(image.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() =>{ console.log(image.id);
                          handleOpenEditDialog(image.id)}}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteSystemImage(image.id, image.name)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {loading ? 'Loading system images...' : 'No system images found'}
          </Typography>
          {!loading && (
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={fetchSystemImages}
              sx={{ mt: 2 }}
            >
              Refresh
            </Button>
          )}
        </Paper>
      )}
      
      {/* Create/Edit/View Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New System Image' : 
           dialogMode === 'edit' ? 'Edit System Image' : 'System Image Details'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Left side - Form/Details */}
            <Grid item xs={12} md={7}>
              {dialogMode === 'view' && selectedImage ? (
                // View mode
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedImage.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">OS Type</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {renderOsTypeChip(selectedImage.os_type)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Version</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{selectedImage.version}</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Description</Typography>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                        <Typography variant="body1">
                          {selectedImage.description || 'No description available'}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Created</Typography>
                      <Typography variant="body1">
                        {selectedImage.created_at ? new Date(selectedImage.created_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                      <Typography variant="body1">
                        {selectedImage.updated_at ? new Date(selectedImage.updated_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                // Create/Edit mode
                <Box component="form" noValidate>
                  <TextField
                    name="name"
                    label="Image Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    autoFocus={dialogMode === 'create'}
                  />
                  
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="os-type-label">OS Type</InputLabel>
                    <Select
                      labelId="os-type-label"
                      id="os_type"
                      name="os_type"
                      value={formData.os_type}
                      onChange={handleInputChange}
                      label="OS Type"
                    >
                      {OS_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    name="version"
                    label="Version"
                    value={formData.version}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    placeholder="e.g., 22.04 LTS"
                  />
                  
                  <TextField
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    placeholder="Provide a detailed description of the system image"
                  />
                </Box>
              )}
            </Grid>
            
            {/* Right side - Image */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  System Image Preview
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 200, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  {imagePreview || (selectedImage && selectedImage.image) ? (
                    <img 
                      src={imagePreview || selectedImage.image || DEFAULT_IMAGE} 
                      alt="System Image Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      <ImageIcon sx={{ fontSize: 60, opacity: 0.3 }} />
                      <Typography variant="body2">No image available</Typography>
                    </Box>
                  )}
                </Paper>
                
                {dialogMode !== 'view' && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          
          {dialogMode !== 'view' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                dialogMode === 'create' ? 'Create' : 'Update'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemImagesManager;