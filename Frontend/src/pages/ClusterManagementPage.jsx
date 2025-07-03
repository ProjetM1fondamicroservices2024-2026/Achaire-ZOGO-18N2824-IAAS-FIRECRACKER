     import React, { useState } from 'react';
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
  Dashboard as DashboardIcon,
  Storage as StorageIcon, 
  Search as SearchIcon,
  Code as CodeIcon,
  Home as HomeIcon,
  Computer as ComputerIcon,
  NavigateNext as NavigateNextIcon,
  ImageSearch as ImageSearchIcon
} from '@mui/icons-material';
import LanIcon from '@mui/icons-material/Lan';

// Import our custom components
import ClusterUtilities from '../components/cluster/ClusterUtilities';
import FindSuitableHost from '../components/cluster/FindSuitableHost';
import ClustersList from '../components/cluster/ClusterList';
import SystemImagesManager from '../components/system-images/SystemImagesManager';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cluster-tabpanel-${index}`}
      aria-labelledby={`cluster-tab-${index}`}
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

const ClusterManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Cluster Status Summary Data
  const clusterSummary = {
    total: 4,
    active: 3,
    warning: 0,
    error: 1
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
          <LanIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Clusters
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
            Cluster Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, configure and manage your cluster instances
          </Typography>
        </Box>

        <Chip 
          label={`Total Clusters: ${clusterSummary.total}`} 
          color="primary" 
          variant="outlined" 
          sx={{ mt: { xs: 2, md: 0 } }}
        />
      </Box>

      {/* Cluster Status Summary Cards */}
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
                Active Clusters
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                {clusterSummary.active}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Healthy and operational clusters
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
                Warning State
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                {clusterSummary.warning}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Clusters with warnings
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
                {clusterSummary.error}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Clusters requiring attention
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
          aria-label="Cluster management tabs"
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
            icon={<DashboardIcon />} 
            iconPosition="start" 
            label="Dashboard" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
          <Tab 
            icon={<StorageIcon />} 
            iconPosition="start" 
            label="Manage Clusters" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
          <Tab 
            icon={<SearchIcon />} 
            iconPosition="start" 
            label="Find Host" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
          <Tab 
            icon={<ImageSearchIcon />} 
            iconPosition="start" 
            label="System Images" 
            sx={{ px: { xs: 1, md: 3 } }}
          />
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ backgroundColor: 'white' }}>
          <TabPanel value={tabValue} index={0}>
            <ClusterUtilities />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ClustersList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <FindSuitableHost />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <SystemImagesManager />
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
          Learn more about managing clusters in our <Link href="/docs/cluster-management" underline="hover">documentation</Link> or <Link href="/support" underline="hover">contact support</Link> if you encounter any issues.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ClusterManagementPage;