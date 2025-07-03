import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  Paper, 
  Breadcrumbs, 
  Link, 
  useTheme, 
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Settings as SettingsIcon, 
  Code as CodeIcon,
  Home as HomeIcon,
  Computer as ComputerIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import CreateVmForm from '../components/VmManagement/CreateVmForm';
import VmActions from '../components/VmManagement/VmActions';
import VmConsole from '../components/VmManagement/VmConsole';
import {getVms} from '../api/vm-host-backend';
import {getLoggedInUser} from '../api/user-backend';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vm-tabpanel-${index}`}
      aria-labelledby={`vm-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VmManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [vms, setVms] = useState([]);
  const [filteredVms, setFilteredVms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vmSummary, setVmSummary] = useState({
    total: 0,
    running: 0,
    stopped: 0,
    error: 0
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

    // Fetch VMs on component mount
    useEffect(() => {
      fetchUserAndVms();
    }, []);

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

              // Update VM summary
              const summary = {
                total: vmsData.length,
                running: vmsData.filter(vm => vm.status === 'running').length,
                stopped: vmsData.filter(vm => vm.status === 'stopped').length,
                error: vmsData.filter(vm => vm.status === 'error').length
              };
              setVmSummary(summary);
            }
          }
        } catch (err) {
          setError('Failed to fetch your virtual machines. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Breadcrumbs Navigation */}
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
          <ComputerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          VM Management
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.primary.main,
              mb: 0.5
            }}
          >
            Virtual Machine Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, configure and manage your virtual machine instances
          </Typography>
        </Box>

        <Chip 
          label={`Total VMs: ${vmSummary.total}`} 
          color="primary" 
          variant="outlined" 
          sx={{ mt: { xs: 2, md: 0 } }}
        />
      </Box>

      {/* VM Status Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderLeft: `4px solid ${theme.palette.success.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Running VMs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                {vmSummary.running}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Currently active instances
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderLeft: `4px solid ${theme.palette.warning.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Stopped VMs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                {vmSummary.stopped}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Inactive instances
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderLeft: `4px solid ${theme.palette.error.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Error State
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                {vmSummary.error}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Instances requiring attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Content Area */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Custom Styled Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="VM management tabs"
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.background.default,
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.95rem',
              minHeight: 64,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 'bold',
              },
            }
          }}
        >
          <Tab 
            icon={<AddIcon />} 
            iconPosition="start" 
            label="Create VM" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
          <Tab 
            icon={<SettingsIcon />} 
            iconPosition="start" 
            label="Manage VMs" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
          <Tab 
            icon={<CodeIcon />} 
            iconPosition="start" 
            label="VM Console" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ backgroundColor: 'white' }}>
          <TabPanel value={tabValue} index={0}>
            <CreateVmForm />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <VmActions />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <VmConsole />
          </TabPanel>
        </Box>
      </Paper>
      
      {/* Contextual Help */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          borderRadius: '8px',
          borderLeft: `4px solid ${theme.palette.info.main}`,
          backgroundColor: `${theme.palette.info.main}10`
        }}
      >
        <Typography variant="subtitle2" sx={{ color: theme.palette.info.main, mb: 1 }}>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Learn more about managing virtual machines in our <Link href="/docs/vm-management" underline="hover">documentation</Link> or <Link href="/support" underline="hover">contact support</Link> if you encounter any issues.
        </Typography>
      </Paper>
    </Container>
  );
};

export default VmManagementPage;