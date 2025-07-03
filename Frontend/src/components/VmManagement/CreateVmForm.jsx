import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
  FormHelperText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as DnsIcon,
  Key as KeyIcon,
  LockOutlined as LockIcon,
  CheckCircleOutline as CheckCircleIcon,
  Help as HelpIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

// Import API functions
import { createVm,getVms } from '../../api/vm-host-backend';
import { getVmOffers, getActiveVmOffers } from '../../api/vm-offer-backend';
import { getSystemImages } from '../../api/system-images-backend';
import { getClusters, getAvailableClusters } from '../../api/cluster-service-backend';

// Import current user
import { getLoggedInUser } from '../../api/user-backend';

const CreateVmForm = () => {
  const theme = useTheme();

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    user_id: '',
    service_cluster_id: '',
    cpu_count: 2,
    memory_size_mib: 2048, // 2 GB
    disk_size_gb: 20,
    os_type: 'linux',
    ssh_public_key: '',
    root_password: '',
    confirm_password: '',
    tap_device: '',
    tap_ip: '',
    vm_ip: '',
    vm_mac: '',
    vm_offer_id: '',
    system_image_id: ''
  });

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // State for current user
  const [currentUser, setCurrentUser] = useState(null);

  // State for lists of data
  const [vmOffers, setVmOffers] = useState([]);
  const [vms, setVms] = useState([]);

  const [systemImages, setSystemImages] = useState([]);
  const [clusters, setClusters] = useState([]);

  // State for selected offer and image
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // State for stepper
  const [activeStep, setActiveStep] = useState(0);

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch all required data
  const fetchInitialData = async () => {
    setFetchingData(true);
    setError(null);

    try {
      // Fetch current user
      const userData = await getLoggedInUser();
      if (userData) {
        console.log(userData);
        setCurrentUser(userData);
        setFormData(prev => ({ ...prev, user_id: userData.id }));
      }

      // Fetch active VM offers
      const offersData = await getActiveVmOffers();
      console.log(offersData);
      if (offersData) {
        setVmOffers(offersData);
      }

      // Fetch system images
      const imagesData = await getSystemImages();
      if (imagesData) {
        setSystemImages(imagesData);
      }

      // Fetch available clusters
      const clustersData = await getAvailableClusters();
      console.log(clustersData);
      if (clustersData) {
        setClusters(clustersData);
      }
    } catch (err) {
      setError('Failed to fetch initial data. Please refresh and try again.');
      console.error(err);
    } finally {
      setFetchingData(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle VM offer selection
  const handleVmOfferChange = (e) => {
    const offerId = e.target.value;
    const offer = vmOffers.find(o => o.id === offerId);

    if (offer) {
      setSelectedOffer(offer);
      setFormData({
        ...formData,
        vm_offer_id: offerId,
        cpu_count: offer.cpu_count,
        memory_size_mib: offer.memory_size_mib,
        disk_size_gb: Math.floor(offer.disk_size_gb) // Convert MiB to GB
      });
    }
  };

  // Handle system image selection
  const handleSystemImageChange = (e) => {
    const imageId = e.target.value;
    const image = systemImages.find(img => img.id === imageId);

    if (image) {
      setSelectedImage(image);
      setFormData({
        ...formData,
        system_image_id: imageId,
        os_type: image.os_type
      });
    }
  };

  // Handle cluster selection
  const handleClusterChange = (e) => {
    const clusterId = e.target.value;
    
    setFormData({
      ...formData,
      service_cluster_id: clusterId
    });
  };

  // Handle stepper navigation
  const handleNext = () => {
    // Validate current step
    if (!validateStep(activeStep)) return;
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      user_id: currentUser?.id || '',
      service_cluster_id: '',
      cpu_count: 2,
      memory_size_mib: 2048,
      disk_size_gb: 20,
      os_type: 'linux',
      ssh_public_key: '',
      root_password: '',
      confirm_password: '',
      tap_device: '',
      tap_ip: '',
      vm_ip: '',
      vm_mac: '',
      vm_offer_id: '',
      system_image_id: ''
    });
    setSelectedOffer(null);
    setSelectedImage(null);
    setFormErrors({});
    setError(null);
    setSuccess(null);
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) {
          errors.name = 'VM name is required';
        } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
          errors.name = 'VM name can only contain letters, numbers, hyphens and underscores';
        }

        if (!formData.vm_offer_id) {
          errors.vm_offer_id = 'Please select a VM offer';
        }

        if (!formData.system_image_id) {
          errors.system_image_id = 'Please select a system image';
        }
        break;

      case 1: // Cluster Selection
        if (!formData.service_cluster_id) {
          errors.service_cluster_id = 'Please select a cluster';
        }
        break;

      case 2: // Authentication
        if (!formData.root_password) {
          errors.root_password = 'Root password is required';
        } else if (formData.root_password.length < 8) {
          errors.root_password = 'Password must be at least 8 characters long';
        }

        if (formData.root_password !== formData.confirm_password) {
          errors.confirm_password = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate entire form before submission
  const validateForm = () => {
    const errors = {};

    // Basic information
    if (!formData.name.trim()) {
      errors.name = 'VM name is required';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
      errors.name = 'VM name can only contain letters, numbers, hyphens and underscores';
    }

    if (!formData.vm_offer_id) {
      errors.vm_offer_id = 'Please select a VM offer';
    }

    if (!formData.system_image_id) {
      errors.system_image_id = 'Please select a system image';
    }

    // Cluster selection
    if (!formData.service_cluster_id) {
      errors.service_cluster_id = 'Please select a cluster';
    }

    // Authentication
    if (!formData.root_password) {
      errors.root_password = 'Root password is required';
    } else if (formData.root_password.length < 8) {
      errors.root_password = 'Password must be at least 8 characters long';
    }

    if (formData.root_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for submission
      const vmData = {
        name: formData.name,
        user_id: formData.user_id,
        service_cluster_id: formData.service_cluster_id,
        cpu_count: formData.cpu_count,
        memory_size_mib: formData.memory_size_mib,
        disk_size_gb: formData.disk_size_gb,
        os_type: formData.os_type,
        ssh_public_key: formData.ssh_public_key,
        root_password: formData.root_password,
        vm_offer_id: formData.vm_offer_id,
        system_image_id: formData.system_image_id,
        // These might be auto-generated by the backend
        tap_device: formData.tap_device,
        tap_ip: formData.tap_ip,
        vm_ip: formData.vm_ip,
        vm_mac: formData.vm_mac
      };

      const response = await createVm(vmData);

      if (response) {
        setSuccess('Virtual machine created successfully!');
        // Reset form after a short delay
        setTimeout(() => {
          handleReset();
        }, 3000);
      }
    } catch (err) {
      setError('Failed to create virtual machine. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to convert MiB to GiB for display
  const mibToGib = (mib) => {
    return (mib / 1024).toFixed(1);
  };

  // Define the steps for the VM creation process
  const steps = [
    {
      label: 'VM Configuration',
      description: 'Choose a name, VM offer, and operating system',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="VM Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={Boolean(formErrors.name)}
              helperText={formErrors.name || "A unique identifier for your virtual machine"}
              placeholder="e.g., web-server-01"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required error={Boolean(formErrors.vm_offer_id)}>
              <InputLabel id="vm-offer-label">VM Offer</InputLabel>
              <Select
                labelId="vm-offer-label"
                id="vm_offer_id"
                name="vm_offer_id"
                value={formData.vm_offer_id}
                label="VM Offer"
                onChange={handleVmOfferChange}
                disabled={vmOffers.length === 0}
              >
                {vmOffers.map((offer) => (
                  <MenuItem key={offer.id} value={offer.id}>
                    {offer.name} ({offer.cpu_count} CPU, {mibToGib(offer.memory_size_mib)} GB RAM, {offer.disk_size_gb} GB Storage)
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formErrors.vm_offer_id || 
                 (vmOffers.length === 0 ? "Loading VM offers..." : "Select a pre-configured resource allocation")}
              </FormHelperText>
            </FormControl>
          </Grid>

          {selectedOffer && (
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Selected Configuration
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip 
                    icon={<DnsIcon />} 
                    label={`${formData.cpu_count} CPU Cores`} 
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<MemoryIcon />} 
                    label={`${mibToGib(formData.memory_size_mib)} GB RAM`} 
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<StorageIcon />} 
                    label={`${formData.disk_size_gb} GB Storage`} 
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {selectedOffer.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {selectedOffer.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl fullWidth required error={Boolean(formErrors.system_image_id)}>
              <InputLabel id="system-image-label">Operating System</InputLabel>
              <Select
                labelId="system-image-label"
                id="system_image_id"
                name="system_image_id"
                value={formData.system_image_id}
                label="Operating System"
                onChange={handleSystemImageChange}
                disabled={systemImages.length === 0}
              >
                {systemImages.map((image) => (
                  <MenuItem key={image.id} value={image.id}>
                    {image.name} ({image.os_type})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formErrors.system_image_id || 
                 (systemImages.length === 0 ? "Loading system images..." : "Select the operating system for your VM")}
              </FormHelperText>
            </FormControl>
          </Grid>

          {selectedImage && (
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    Selected Operating System: {selectedImage.name}
                  </Typography>
                  <Chip 
                    label={selectedImage.os_type.toUpperCase()} 
                    size="small" 
                    color="primary"
                    sx={{ ml: 2 }}
                  />
                </Box>

                {selectedImage.description && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedImage.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      )
    },
    {
      label: 'Cluster Selection',
      description: 'Choose a cluster for your VM',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth required error={Boolean(formErrors.service_cluster_id)}>
              <InputLabel id="cluster-label">Host Cluster</InputLabel>
              <Select
                labelId="cluster-label"
                id="service_cluster_id"
                name="service_cluster_id"
                value={formData.service_cluster_id}
                label="Host Cluster"
                onChange={handleClusterChange}
                disabled={clusters.length === 0}
              >
                {clusters.map((cluster) => (
                  <MenuItem key={cluster.id} value={cluster.id}>
                    {cluster.nom} ({cluster.ip})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formErrors.service_cluster_id || 
                 (clusters.length === 0 ? "Loading available clusters..." : "Select the cluster to host your VM")}
              </FormHelperText>
            </FormControl>
          </Grid>

          {clusters.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<HelpIcon />}>
                <Typography variant="body2">
                  A cluster is a physical server that will host your virtual machine. 
                  The system will automatically distribute VMs across clusters for optimal performance.
                </Typography>
              </Alert>
            </Grid>
          )}

          {formData.service_cluster_id && (
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Selected Cluster Information
                </Typography>
                
                {(() => {
                  const selectedCluster = clusters.find(c => c.id === formData.service_cluster_id);
                  if (!selectedCluster) return null;

                  return (
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body1">{selectedCluster.nom}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">IP Address</Typography>
                        <Typography variant="body1">{selectedCluster.ip}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Available CPU</Typography>
                        <Typography variant="body1">{selectedCluster.available_processor} cores</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Available RAM</Typography>
                        <Typography variant="body1">{selectedCluster.available_ram} GB</Typography>
                      </Grid>
                    </Grid>
                  );
                })()}
              </Paper>
            </Grid>
          )}
        </Grid>
      )
    },
    {
      label: 'Authentication',
      description: 'Set access credentials for your VM',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Root Password"
              name="root_password"
              type={showPassword ? "text" : "password"}
              value={formData.root_password}
              onChange={handleInputChange}
              fullWidth
              required
              error={Boolean(formErrors.root_password)}
              helperText={formErrors.root_password || "At least 8 characters"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={handleInputChange}
              fullWidth
              required
              error={Boolean(formErrors.confirm_password)}
              helperText={formErrors.confirm_password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Optional: SSH Public Key
            </Typography>
            <TextField
              label="SSH Public Key"
              name="ssh_public_key"
              value={formData.ssh_public_key}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="For SSH key-based authentication (recommended)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="body2">
                Your VM will be accessible via SSH or console once it's created. You'll need these credentials to log in.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Review & Create',
      description: 'Review your VM configuration and create',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Alert 
              icon={<CheckCircleIcon />} 
              severity="success"
              sx={{ mb: 3 }}
            >
              <Typography variant="body1">
                Your VM is ready to be created with the following configuration:
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Typography variant="body2" color="text.secondary">VM Name</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{formData.name}</Typography>
                </Grid>
                
                <Grid item xs={5}>
                  <Typography variant="body2" color="text.secondary">VM Offer</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedOffer?.name || 'Not selected'}
                  </Typography>
                </Grid>
                
                <Grid item xs={5}>
                  <Typography variant="body2" color="text.secondary">Operating System</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedImage?.name || 'Not selected'}
                  </Typography>
                </Grid>
                
                <Grid item xs={5}>
                  <Typography variant="body2" color="text.secondary">Host Cluster</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {clusters.find(c => c.id === formData.service_cluster_id)?.nom || 'Not selected'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Resources
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DnsIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">CPU Cores</Typography>
                      <Typography variant="h6">{formData.cpu_count}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MemoryIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Memory</Typography>
                      <Typography variant="h6">{mibToGib(formData.memory_size_mib)} GB</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StorageIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Storage</Typography>
                      <Typography variant="h6">{formData.disk_size_gb} GB</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <KeyIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">SSH Key</Typography>
                      <Typography variant="h6">
                        {formData.ssh_public_key ? 'Provided' : 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: theme.palette.background.default,
                border: `1px dashed ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                This VM will be created immediately upon submission. You will be able to 
                access it once it's provisioned, which typically takes a few minutes.
                You can monitor its status in the "Manage VMs" tab.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <Box>
      {/* Loading Indicator */}
      {fetchingData && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {!fetchingData && (
        <>
          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  
                  {step.content}
                  
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                          ) : null}
                          Create VM
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {/* Reset button if all steps completed */}
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - your VM is being created.</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Create Another VM
              </Button>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default CreateVmForm;