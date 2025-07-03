import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Stack,
  Fade,
  Grow,
  Zoom,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  useScrollTrigger,
  Slide,
  alpha
} from '@mui/material';
import {
  Cloud,
  Security,
  Storage,
  Speed,
  SupportAgent,
  CheckCircle,
  Public,
  VpnLock,
  ArrowForward,
  RocketLaunch,
  BarChart,
  Savings,
  DashboardCustomize,
  Mail as MailIcon,
  PlayArrow,
  BusinessCenter,
  School,
  HealthAndSafety,
  Code,
  SportsEsports,
  Search,
  NetworkCheck,
  ExpandMore,
  Lightbulb,
  LocalOffer,
  Send,
  Check as CheckIcon,
  Engineering,
  Settings,
  CloudUpload,
  Analytics,
  Timer,
  PhoneIphone,
  PersonAdd
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import Features from '../components/home/Features';
import PricingPlans from '../components/home/PricingPlans';
import Testimonials from '../components/home/Testimonials';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const typewriterAnimation = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blinkerAnimation = keyframes`
  50% { opacity: 0 }
`;



// Status indicator component
const StatusIndicator = () => {
  const [status, setStatus] = useState('operational');
  const theme = useTheme();
  
  return (
    <Tooltip title="All systems operational" arrow>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          opacity: 0.9,
          transition: 'all 0.3s ease',
          '&:hover': {
            opacity: 1,
            transform: 'scale(1.05)'
          }
        }}
        onClick={() => window.open('/status', '_blank')}
      >
        <Box 
          sx={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            bgcolor: status === 'operational' ? theme.palette.success.main : theme.palette.warning.main,
            boxShadow: `0 0 8px ${status === 'operational' ? theme.palette.success.main : theme.palette.warning.main}`,
            mr: 1,
            animation: status === 'operational' ? `${pulseAnimation} 2s infinite` : 'none'
          }} 
        />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
          Status: {status === 'operational' ? 'All Systems Operational' : 'Maintenance in Progress'}
        </Typography>
      </Box>
    </Tooltip>
  );
};

// Company logos data for the customer showcase
const companyLogos = [
  { name: 'TechGiant', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
  { name: 'Innovate Inc', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968853.png' },
  { name: 'DataFlow', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968525.png' },
  { name: 'CloudNative', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968672.png' },
  { name: 'SecureTech', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' },
];



const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [playVideo, setPlayVideo] = useState(false);

  // Animation trigger for scroll effects
  const trigger = useScrollTrigger();

  
// How it works steps data
const howItWorksSteps = [
  {
    title: 'Sign Up', 
    description: 'Create your account in less than 60 seconds', 
    icon: <PersonAdd sx={{ fontSize: 40 }} />,
    color: '#4CAF50'
  },
  {
    title: 'Configure', 
    description: 'Choose your VM specifications and options', 
    icon: <Settings sx={{ fontSize: 40 }} />,
    color: '#FF9800'
  },
  {
    title: 'Deploy', 
    description: 'Launch your VM with a single click', 
    icon: <CloudUpload sx={{ fontSize: 40 }} />,
    color: '#2196F3'
  },
  {
    title: 'Scale', 
    description: 'Upgrade resources as your needs grow', 
    icon: <Analytics sx={{ fontSize: 40 }} />,
    color: '#9C27B0'
  }
];

// Industry solutions data
const industrySolutions = [
  {
    title: 'Enterprise', 
    description: 'Secure and scalable infrastructure for large corporations', 
    icon: <BusinessCenter />,
    color: theme.palette.primary.main
  },
  {
    title: 'Startups', 
    description: 'Cost-effective solutions to help your business grow', 
    icon: <RocketLaunch />,
    color: theme.palette.secondary.main
  },
  {
    title: 'Education', 
    description: 'Special packages for educational institutions', 
    icon: <School />,
    color: '#4CAF50'
  },
  {
    title: 'Healthcare', 
    description: 'HIPAA-compliant hosting for medical applications', 
    icon: <HealthAndSafety />,
    color: '#F44336'
  },
  {
    title: 'Developers', 
    description: 'Developer-friendly tools and APIs', 
    icon: <Code />,
    color: '#2196F3'
  },
  {
    title: 'Gaming', 
    description: 'Low-latency solutions for game servers', 
    icon: <SportsEsports />,
    color: '#9C27B0'
  }
];

// FAQ items data
const faqItems = [
  {
    question: 'How quickly can I deploy a new virtual machine?',
    answer: 'Our platform allows you to deploy a new VM in under 60 seconds. Simply select your specifications, provide payment information if necessary, and launch your VM with a single click.'
  },
  {
    question: 'What operating systems do you support?',
    answer: 'We support a wide range of operating systems including various Linux distributions (Ubuntu, CentOS, Debian, etc.), Windows Server, and custom images. You can also upload your own ISO.'
  },
  {
    question: 'Do you offer managed or unmanaged hosting?',
    answer: 'We offer both options. Our unmanaged hosting gives you full control over your virtual machine, while our managed hosting includes maintenance, updates, and technical support for your servers.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: '24/7 technical support is available to all customers via chat, email, and phone. Our enterprise plans include a dedicated account manager and priority support.'
  },
  {
    question: 'Can I scale my resources up or down?',
    answer: 'Yes, you can easily scale your resources up or down based on your needs. Changes to CPU and RAM are applied instantly, while storage modifications may take a few minutes to complete.'
  }
];
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    } else {
      setNewsletterStatus('error');
    }
  };

  // Handle tab change for industry solutions
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Trust badge items with consistent structure
  const trustBadges = [
    { text: '99.99% Uptime', icon: <BarChart color="primary" /> },
    { text: '24/7 Support', icon: <SupportAgent color="primary" /> },
    { text: 'Global Network', icon: <Public color="primary" /> },
    { text: 'Cost Efficient', icon: <Savings color="primary" /> }
  ];

  return (
    <Box sx={{ 
      overflowX: 'hidden',
      bgcolor: theme.palette.background.default,
    }}>
        
      {/* Hero Section - Modern gradient with improved visual elements */}
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 70%, ${theme.palette.primary.light} 100%)`,
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { md: '0 0 30px 30px' },
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 25%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 25%)
          `,
          pointerEvents: 'none',
        }
      }}>
        {/* Top status bar */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 20, 
          display: { xs: 'none', md: 'block' } 
        }}>
          <StatusIndicator />
        </Box>

        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1"
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  mb: 3,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  lineHeight: 1.2,
                  letterSpacing: -0.5,
                }}
              >
                Cloud Hosting{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: theme.palette.secondary.light,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -5,
                      left: 0,
                      width: '100%',
                      height: 3,
                      backgroundColor: theme.palette.secondary.light,
                      borderRadius: 2,
                    }
                  }}
                >
                  Reimagined
                </Box>
              </Typography>
              
              {/* Typewriter effect subtitle */}
              <Box sx={{ mb: 4, height: 32, display: 'flex', justifyContent: 'center' }}>
                <Typography 
                  variant={isMobile ? 'body1' : 'h6'} 
                  component="h2"
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    borderRight: '0.15em solid transparent',
                    whiteSpace: 'nowrap',
                    margin: '0 auto',
                    animation: `
                      ${typewriterAnimation} 3.5s steps(40, end),
                      ${blinkerAnimation} 0.75s step-end infinite
                    `,
                    animationDelay: '0.5s',
                    animationFillMode: 'forwards'
                  }}
                >
                  Enterprise-grade infrastructure at startup-friendly prices.
                </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                component="p"
                sx={{ 
                  mb: 4,
                  maxWidth: 700,
                  mx: 'auto',
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.6
                }}
              >
                Deploy in seconds, scale without limits. Experience the future of cloud hosting.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  href="/signup"
                  endIcon={<RocketLaunch />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    }
                  }}
                >
                  Launch Your First VM
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  href="/pricing"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Compare Plans
                </Button>
              </Stack>
            </Box>
          </Fade>

          {/* Animated server illustration / Video */}
          <Box sx={{
            position: 'relative',
            height: isMobile ? 180 : 260,
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
            animation: `${floatAnimation} 6s ease-in-out infinite`,
            cursor: 'pointer',
          }}
            onClick={() => setPlayVideo(true)}
          >
            {playVideo ? (
              <Box
                component="iframe"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              />
            ) : (
              <>
                <Box 
                  component="img" 
                  src="https://cdn-icons-png.flaticon.com/512/2906/2906274.png" 
                  alt="Cloud servers"
                  sx={{ 
                    height: '100%', 
                    width: 'auto',
                    maxWidth: '100%',
                    filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))',
                    transition: 'all 0.3s ease',
                  }}
                />
                
                {/* Play button overlay */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'translate(-50%, -50%) scale(1.05)',
                  }
                }}>
                  <PlayArrow sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                </Box>
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    position: 'absolute',
                    bottom: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  Watch Demo Video
                </Typography>
                
                {/* Decorative elements */}
                <Box sx={{
                  position: 'absolute',
                  top: '30%',
                  left: isMobile ? '20%' : '30%',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  animation: `${pulseAnimation} 3s infinite ease-in-out`,
                  zIndex: -1,
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: '20%',
                  right: isMobile ? '20%' : '35%',
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  animation: `${pulseAnimation} 4s infinite ease-in-out`,
                  animationDelay: '1s',
                  zIndex: -1,
                }} />
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Trust Badges - Redesigned for better visual impact */}
      <Box sx={{ 
        py: { xs: 4, md: 5 },
        mt: { xs: -6, md: -8 },
        mx: { xs: 2, sm: 4, md: 6, lg: 10 },
        bgcolor: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-around" spacing={4}>
            {trustBadges.map((item, index) => (
              <Grow in timeout={800 + (index * 200)} key={index}>
                <Grid item xs={6} sm={3}>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5} 
                    justifyContent="center"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main,
                      width: 44,
                      height: 44
                    }}>
                      {item.icon}
                    </Avatar>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Stack>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section - New section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Zoom in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight={700} 
                sx={{ mb: 2 }}
              >
                How It Works
              </Typography>
              <Typography 
                variant="h6" 
                component="p" 
                color="text.secondary" 
                sx={{ maxWidth: 700, mx: 'auto' }}
              >
                Get your cloud infrastructure up and running in minutes with our simple process
              </Typography>
            </Box>
          </Zoom>

          <Grid container spacing={4} justifyContent="center">
            {howItWorksSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + (index * 300)}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    {/* Step number */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -15,
                        left: { xs: 'calc(50% - 80px)', sm: 'calc(50% - 60px)' },
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: step.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        zIndex: 2,
                      }}
                    >
                      {index + 1}
                    </Box>
                    
                    {/* Connection line */}
                    {index < howItWorksSteps.length - 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 100,
                          right: { xs: 'calc(50% - 50px)', sm: -20 },
                          width: { xs: 'auto', sm: 40 },
                          height: { xs: 40, sm: 2 },
                          bgcolor: 'divider',
                          display: { xs: 'none', sm: 'block', md: 'block' },
                          zIndex: 1,
                        }}
                      />
                    )}
                    
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        width: '100%',
                        height: '100%',
                        borderRadius: 4,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                          transform: 'translateY(-5px)',
                          borderColor: step.color,
                        },
                      }}
                    >
                      <Box 
                        sx={{ 
                          mb: 2,
                          color: step.color,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Customer Logos - New section */}
      <Box sx={{ 
        py: 6, 
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            color="text.secondary" 
            gutterBottom
            fontWeight={500}
          >
            Trusted by innovative companies worldwide
          </Typography>

          <Grid 
            container 
            spacing={4} 
            justifyContent="center" 
            alignItems="center"
            sx={{ mt: 2 }}
          >
            {companyLogos.map((company, index) => (
              <Grid item xs={4} sm={2} key={index}>
                <Zoom in timeout={800 + (index * 150)}>
                  <Box 
                    component="img" 
                    src={company.logo} 
                    alt={company.name}
                    sx={{ 
                      height: 50, 
                      width: 'auto', 
                      maxWidth: '100%',
                      filter: 'grayscale(100%)',
                      opacity: 0.7,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        filter: 'grayscale(0%)',
                        opacity: 1,
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Using the existing component */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Features />
      </Box>

      {/* Industry Solutions Section - New section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: alpha(theme.palette.secondary.main, 0.04),
      }}>
        <Container maxWidth="lg">
          <Zoom in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight={700} 
                sx={{ mb: 2 }}
              >
                Solutions For Every Industry
              </Typography>
              <Typography 
                variant="h6" 
                component="p" 
                color="text.secondary" 
                sx={{ maxWidth: 700, mx: 'auto' }}
              >
                Tailored cloud hosting for your specific needs
              </Typography>
            </Box>
          </Zoom>

          {/* Tabs for industry selection */}
          <Box sx={{ mb: 5 }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  minWidth: 100,
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  opacity: 0.7,
                  '&.Mui-selected': {
                    opacity: 1,
                  },
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-3px)',
                  },
                },
              }}
            >
              {industrySolutions.map((solution, index) => (
                <Tab 
                  key={index} 
                  label={solution.title} 
                  icon={React.cloneElement(solution.icon, { style: { color: solution.color } })} 
                  iconPosition="start" 
                />
              ))}
            </Tabs>
          </Box>

          {/* Content for selected industry */}
          <Fade in timeout={500}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h3" fontWeight={700} gutterBottom sx={{ color: industrySolutions[selectedTab].color }}>
                  {industrySolutions[selectedTab].title} Solutions
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {industrySolutions[selectedTab].description}. Our platform provides the flexibility, security, and scalability needed for {industrySolutions[selectedTab].title.toLowerCase()} environments.
                </Typography>
                
                <List>
                  {/* Dynamic features based on selected industry */}
                  {selectedTab === 0 && ( // Enterprise
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Dedicated private cloud options" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Enterprise-grade security and compliance" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="24/7 priority support with dedicated account manager" />
                      </ListItem>
                    </>
                  )}
                  
                  {selectedTab === 1 && ( // Startups
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Pay-as-you-grow pricing models" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Startup-friendly credit packages" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Quick scaling for viral growth" />
                      </ListItem>
                    </>
                  )}
                  
                  {selectedTab === 2 && ( // Education
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Special educational pricing" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Virtual lab environments" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Student project hosting solutions" />
                      </ListItem>
                    </>
                  )}
                  
                  {selectedTab === 3 && ( // Healthcare
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="HIPAA compliant infrastructure" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Encrypted data storage" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="BAA available for covered entities" />
                      </ListItem>
                    </>
                  )}
                  
                  {selectedTab === 4 && ( // Developers
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Comprehensive API access" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="CI/CD integration" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Staging and production environments" />
                      </ListItem>
                    </>
                  )}
                  
                  {selectedTab === 5 && ( // Gaming
                    <>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Low-latency global network" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="DDoS protection included" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                        <ListItemText primary="Auto-scaling for player surges" />
                      </ListItem>
                    </>
                  )}
                </List>
                
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 2,
                    bgcolor: industrySolutions[selectedTab].color,
                    '&:hover': {
                      bgcolor: alpha(industrySolutions[selectedTab].color, 0.8),
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Learn More
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: 350,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Industry-specific illustration - placeholder */}
                  <Box 
                    component="img" 
                    src={`https://source.unsplash.com/random/600x400/?${industrySolutions[selectedTab].title.toLowerCase()},technology`}
                    alt={`${industrySolutions[selectedTab].title} illustration`}
                    sx={{ 
                      height: '100%',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      transition: 'all 0.5s ease',
                    }}
                  />
                  
                  {/* Background glow */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      height: '80%',
                      borderRadius: 4,
                      bgcolor: industrySolutions[selectedTab].color,
                      opacity: 0.1,
                      filter: 'blur(40px)',
                      zIndex: -1,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Pricing Plans Section - Using the existing component */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.background.default,
      }}>
        <PricingPlans />
      </Box>

      {/* FAQ Section - New section */}
      <Box sx={{ 
        py: { xs: 8, md: 10 },
        bgcolor: alpha(theme.palette.primary.main, 0.03),
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight={700} 
            align="center" 
            gutterBottom
          >
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            color="text.secondary" 
            align="center" 
            sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}
          >
            Get answers to common questions about our platform
          </Typography>

          <Box>
            {faqItems.map((item, index) => (
              <Fade in timeout={800 + (index * 200)} key={index}>
                <Accordion
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      '&.Mui-expanded': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              endIcon={<ArrowForward />}
              href="/support"
            >
              Browse Support Center
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section - Using the existing component */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.grey[50],
        borderRadius: { md: '30px 30px 0 0' },
        mt: { md: 4 },
      }}>
        <Testimonials />
      </Box>

      {/* Newsletter Section - New section */}
      <Box sx={{ 
        py: { xs: 6, md: 8 },
        bgcolor: alpha(theme.palette.secondary.main, 0.08),
      }}>
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box>
                  <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                    Stay Updated
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Subscribe to our newsletter for the latest updates, tips, and special offers.
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubscribe}>
                    <TextField
                      fullWidth
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              edge="end" 
                              color="primary" 
                              type="submit"
                              disabled={!email || newsletterStatus === 'success'}
                            >
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        newsletterStatus === 'success' ? (
                          <Typography component="span" color="success.main">
                            Thanks for subscribing!
                          </Typography>
                        ) : newsletterStatus === 'error' ? (
                          <Typography component="span" color="error">
                            Please enter a valid email address
                          </Typography>
                        ) : null
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    We respect your privacy. Unsubscribe at any time.
                  </Typography>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box 
                    component="img" 
                    src="https://cdn-icons-png.flaticon.com/512/6831/6831087.png" 
                    alt="Newsletter illustration"
                    sx={{ 
                      width: { xs: 200, md: 220 },
                      height: 'auto',
                      animation: `${floatAnimation} 6s ease-in-out infinite`,
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile App Promotion - New section */}
      <Box sx={{ 
        py: { xs: 6, md: 8 },
        bgcolor: theme.palette.background.default,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Zoom in timeout={1000}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box 
                    component="img" 
                    src="https://cdn-icons-png.flaticon.com/512/3208/3208820.png" 
                    alt="Mobile app"
                    sx={{ 
                      width: { xs: 250, md: 300 },
                      height: 'auto',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Background gradient */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
            
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Fade in timeout={800}>
                <Box>
                  <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                    Manage on the Go
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Download our mobile app to manage your cloud infrastructure from anywhere, anytime. Monitor performance, receive alerts, and scale resources on the go.
                  </Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<PhoneIphone />}
                      sx={{ borderRadius: 3 }}
                    >
                      iOS App
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<PhoneIphone />}
                      sx={{ borderRadius: 3 }}
                    >
                      Android App
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Enhanced with modern design elements */}
      <Box sx={{ 
        py: { xs: 8, md: 10 },
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background effect */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 25%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 25%)
          `,
          pointerEvents: 'none',
        }} />
        
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
          animation: `${pulseAnimation} 4s infinite ease-in-out`,
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.08)',
          animation: `${pulseAnimation} 5s infinite ease-in-out`,
          animationDelay: '1s',
        }} />
        
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                component="h2"
                sx={{ 
                  fontWeight: 800,
                  mb: 3,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                Ready to Deploy Your Project?
              </Typography>
              <Typography 
                variant={isMobile ? 'body1' : 'h6'} 
                sx={{ 
                  mb: 5,
                  opacity: 0.9,
                  fontWeight: 300,
                  maxWidth: 700,
                  mx: 'auto'
                }}
              >
                Get started in minutes with our easy-to-use platform.
                No long-term contracts, cancel anytime.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
              >
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  href="/signup"
                  endIcon={<RocketLaunch />}
                  sx={{ 
                    px: 6,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  href="/contact"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    px: 6,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Contact Sales
                </Button>
              </Stack>
            </Box>
          </Fade>
          
          {/* User count stat */}
          <Fade in timeout={1500}>
            <Box sx={{ 
              mt: 8, 
              pt: 4,
              borderTop: '1px solid rgba(255,255,255,0.2)',
              opacity: 0.9
            }}>
              <Typography variant="h6" component="p" fontWeight={300}>
                Trusted by{' '}
                <Box component="span" sx={{ fontWeight: 700, color: theme.palette.secondary.light }}>
                  10,000+
                </Box>
                {' '}developers & businesses worldwide
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
      
      {/* Footer link preview */}
      <Box sx={{ 
        py: 2,
        bgcolor: theme.palette.primary.dark,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        fontSize: '0.875rem'
      }}>
        <Container>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 4 }} 
            justifyContent="center"
          >
            <Typography variant="body2">© 2025 Cloud Hosting Inc.</Typography>
            <Typography variant="body2" component="a" href="/terms" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>Terms</Typography>
            <Typography variant="body2" component="a" href="/privacy" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>Privacy</Typography>
            <Typography variant="body2" component="a" href="/security" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>Security</Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;