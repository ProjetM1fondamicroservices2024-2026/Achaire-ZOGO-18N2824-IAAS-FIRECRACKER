import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  Chip,
  useTheme
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as DnsIcon,
  Search as SearchIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Speed as SpeedIcon,
  
} from '@mui/icons-material';

import InfoIcon from '@mui/icons-material/Info';
// Import your API function
import { findSuitableHost } from '../../api/cluster-service-backend';
// Import the VM offers API functions
import {
  getVmOffers,
  getActiveVmOffers,
} from '../../api/vm-offer-backend';


// Import the API functions
import {
  getSystemImages
} from '../../api/system-images-backend';


// Mock data for system images and VM types (replace with actual data from your API)
const SYSTEM_IMAGES = [
  { id: 1, name: 'Ubuntu 22.04 LTS', type: 'linux', min_cpu: 1, min_ram: 1, min_disk: 10 },
  { id: 2, name: 'CentOS 9 Stream', type: 'linux', min_cpu: 1, min_ram: 2, min_disk: 15 },
  { id: 3, name: 'Windows Server 2022', type: 'windows', min_cpu: 2, min_ram: 4, min_disk: 25 },
  { id: 4, name: 'Debian 12', type: 'linux', min_cpu: 1, min_ram: 1, min_disk: 10 }
];

const VM_OFFERS = [
  { id: 1, name: 'Micro', cpu_count: 1, memory_size_mib: 1024, disk_size_gb: 20 },
  { id: 2, name: 'Small', cpu_count: 2, memory_size_mib: 2048, disk_size_gb: 40 },
  { id: 3, name: 'Medium', cpu_count: 4, memory_size_mib: 4096, disk_size_gb: 80 },
  { id: 4, name: 'Large', cpu_count: 8, memory_size_mib: 8192, disk_size_gb: 160 },
  { id: 5, name: 'Custom', cpu_count: 0, memory_size_mib: 0, disk_size_gb: 0 }
];

const FindSuitableHost = () => {
  const theme = useTheme();

  const [systemImages, setSystemImages] = useState([]);
  const [vmOffers, setVmOffers] = useState([]);
  
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


    // Fetch VM offers on component mount
      useEffect(() => {
        fetchVmOffers();
      }, []);
      
      // Fetch all VM offers or active ones based on filter
      const fetchVmOffers = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const data =  await getActiveVmOffers();
           
          
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
  
  // State for resource requirements
  const [formData, setFormData] = useState({
    name: '',
    cpu_count: 2,
    memory_size_mib: 2048,
    disk_size_gb: 40,
    os_type: 'linux',
    system_image_id: 1,
    root_password: '',
    vm_offer_id: 2,
    user_id: 1 // This would typically come from authentication
  });
  
  // Additional state variables
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCustomOffer, setIsCustomOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(VM_OFFERS[1]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'cpu_count' || name === 'memory_size_mib' || name === 'disk_size_gb' || name === 'system_image_id' || name === 'vm_offer_id'
        ? Number(value) 
        : value
    });
  };
  
  // Handle VM offer selection
  const handleOfferChange = (event) => {
    const offerId = Number(event.target.value);
    const offer = vmOffers.find(o => o.id === offerId);
    
    setSelectedOffer(offer);
    setIsCustomOffer(offer.name === 'Custom');
    
    if (offer.name !== 'Custom') {
      setFormData({
        ...formData,
        vm_offer_id: offerId,
        cpu_count: offer.cpu_count,
        memory_size_mib: offer.memory_size_mib,
        disk_size_gb: offer.disk_size_gb
      });
    } else {
      setFormData({
        ...formData,
        vm_offer_id: offerId
      });
    }
  };
  
  // Handle system image selection
  const handleImageChange = (event) => {
    const imageId = Number(event.target.value);
    const image = systemImages.find(img => img.id === imageId);
    
    if (image) {
      setFormData({
        ...formData,
        system_image_id: imageId,
        os_type: image.type
      });
    }
  };
  
  // Submit form to find a suitable host
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log(formData);
      const response = await findSuitableHost(formData);
      
      if (response) {
        setResult(response);
        // Move to the results step
        setActiveStep(2);
      }
    } catch (err) {
      setError('Failed to find a suitable host. Please adjust your requirements or try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle stepper navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setResult(null);
    setError(null);
    // Reset form to default values
    setFormData({
      cpu_count: 2,
      memory_size_mib: 2048,
      disk_size_gb: 40,
      name: '',
      user_id: 1,
      os_type: 'linux',
      root_password: '',
      vm_offer_id: 2,
      system_image_id: 1
     
      
     
    });

    
    setIsCustomOffer(false);
    setSelectedOffer(vmOffers[1]);
  };
  
  // Check if the current step is valid for proceeding
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Resource requirements
        return (
          formData.cpu_count > 0 && 
          formData.memory_size_mib > 0 && 
          formData.disk_size_gb > 0
        );
      case 1: // VM details
        return (
          formData.name.trim() !== '' && 
          formData.system_image_id > 0
        );
      default:
        return true;
    }
  };
  
  // Steps for the suitable host finder
  console.log(vmOffers.length);
  const steps = [
    {
      label: 'Specify Resource Requirements',
      description: 'Define the CPU, memory, and storage requirements for your virtual machine.',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="vm-offer-label">VM Configuration</InputLabel>
              <Select
                labelId="vm-offer-label"
                id="vm-offer"
                name="vm_offer_id"
                value={formData.vm_offer_id}
                label="VM Configuration"
                onChange={handleOfferChange}
              >
                {vmOffers.map((offer) => (
                  <MenuItem key={offer.id} value={offer.id}>
                    {offer.name} {offer.name !== 'Custom' ? 
                      `(${offer.cpu_count} CPU, ${offer.memory_size_mib / 1024} GB RAM, ${offer.disk_size_gb} GB Storage)` : ''}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a predefined configuration or customize your own</FormHelperText>
            </FormControl>
          </Grid>
          
          {isCustomOffer && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="CPU Cores"
                  name="cpu_count"
                  type="number"
                  fullWidth
                  value={formData.cpu_count}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DnsIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 1, max: 16 }
                  }}
                  required
                  helperText="Number of CPU cores needed"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Memory (MiB)"
                  name="memory_size_mib"
                  type="number"
                  fullWidth
                  value={formData.memory_size_mib}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MemoryIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 512, step: 512 }
                  }}
                  required
                  helperText="1024 MiB = 1 GB"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Storage (GB)"
                  name="disk_size_gb"
                  type="number"
                  fullWidth
                  value={formData.disk_size_gb}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StorageIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 10 }
                  }}
                  required
                  helperText="Disk space in GB"
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mt: 2,
                borderLeft: `4px solid ${theme.palette.info.main}`,
                bgcolor: `${theme.palette.info.main}10`
              }}
            >
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                Resource Summary
              </Typography>
              <Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<DnsIcon />} 
                  label={`${formData.cpu_count} CPU Cores`} 
                  variant="outlined" 
                  color="primary"
                />
                <Chip 
                  icon={<MemoryIcon />} 
                  label={`${formData.memory_size_mib / 1024} GB RAM`} 
                  variant="outlined" 
                  color="primary"
                />
                <Chip 
                  icon={<StorageIcon />} 
                  label={`${formData.disk_size_gb} GB Storage`} 
                  variant="outlined" 
                  color="primary"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Specify VM Details',
      description: 'Provide a name for your VM and select an operating system.',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="VM Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
              helperText="Enter a descriptive name for your virtual machine"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="system-image-label">Operating System</InputLabel>
              <Select
                labelId="system-image-label"
                id="system-image"
                name="system_image_id"
                value={formData.system_image_id}
                label="Operating System"
                onChange={handleImageChange}
              >
                {SYSTEM_IMAGES.map((image) => (
                  <MenuItem key={image.id} value={image.id}>
                    {image.name} ({image.os_type})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the operating system for your virtual machine</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Root Password"
              name="root_password"
              type="password"
              fullWidth
              value={formData.root_password}
              onChange={handleInputChange}
              required
              helperText="Enter a secure password for the root/administrator account"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mt: 2,
                borderLeft: `4px solid ${theme.palette.success.main}`,
                bgcolor: `${theme.palette.success.main}10`
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Selected System Requirements
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                {(() => {
                  const selectedImage = systemImages.find(img => img.id === formData.system_image_id);
                  if (!selectedImage) return null;
                  
                  return (
                    <>
                      <li>
                        <Typography variant="body2">
                          Minimum CPU: {2} core(s)
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Minimum RAM: {2} GB
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Minimum Storage: {10} GB
                        </Typography>
                      </li>
                    </>
                  );
                })()}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Review Results',
      description: 'View the suitable host for your virtual machine.',
      content: (
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {!result ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Click "Find Suitable Host" to search for available hosts.
                </Typography>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  A suitable host has been found for your virtual machine!
                </Alert>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Selected Host: {result.cluster_name || result.nom || 'Cluster #' + result.cluster_id}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" gutterBottom>Host Information</Typography>
                        <Box component="dl">
                          <Box sx={{ display: 'flex', mb: 1 }}>
                            <Box component="dt" sx={{ width: '40%', fontWeight: 'medium' }}>Cluster ID:</Box>
                            <Box component="dd">{result.cluster_id}</Box>
                          </Box>
                          <Box sx={{ display: 'flex', mb: 1 }}>
                            <Box component="dt" sx={{ width: '40%', fontWeight: 'medium' }}>IP Address:</Box>
                            <Box component="dd">{result.ip}</Box>
                          </Box>
                          <Box sx={{ display: 'flex', mb: 1 }}>
                            <Box component="dt" sx={{ width: '40%', fontWeight: 'medium' }}>Processor:</Box>
                            <Box component="dd">{result.processeur || 'Not specified'}</Box>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" gutterBottom>Resource Availability</Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">CPU</Typography>
                            <Typography variant="body2">
                              {result.available_processor} available
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Memory</Typography>
                              <Typography variant="body2">
                                {result.available_ram} GB available
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Storage</Typography>
                              <Typography variant="body2">
                                {result.available_rom} GB available
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          VM Configuration Summary
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <DnsIcon color="primary" />
                              <Typography variant="h6">{formData.cpu_count}</Typography>
                              <Typography variant="body2" color="text.secondary">CPU Cores</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <MemoryIcon color="primary" />
                              <Typography variant="h6">{formData.memory_size_mib / 1024} GB</Typography>
                              <Typography variant="body2" color="text.secondary">Memory</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <StorageIcon color="primary" />
                              <Typography variant="h6">{formData.disk_size_gb} GB</Typography>
                              <Typography variant="body2" color="text.secondary">Storage</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" color="success" size="large">
                    Proceed to Provision VM
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      )
    }
  ];
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Find Suitable Host
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This utility will help you find an appropriate cluster for hosting your virtual machine based on your requirements.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
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
                      <>
                        {!result && (
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!isStepValid() || loading}
                            startIcon={loading && <CircularProgress size={20} />}
                          >
                            {loading ? 'Finding...' : 'Find Suitable Host'}
                          </Button>
                        )}
                        {result && (
                          <Button
                            variant="outlined"
                            onClick={handleReset}
                            sx={{ ml: 1 }}
                          >
                            Start New Search
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepValid()}
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
      </Paper>
    </Box>
  );
};

export default FindSuitableHost;