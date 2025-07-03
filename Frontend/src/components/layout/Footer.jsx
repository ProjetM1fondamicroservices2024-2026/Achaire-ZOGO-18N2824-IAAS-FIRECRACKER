import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Link, 
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  RssFeed as BlogIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: 6,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand/Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {/* <Box 
                component="img"
                src="/logo.png" // Replace with your logo path
                alt="IAAS-FIRECRACKER Logo"
                sx={{ 
                  height: 40,
                  width: 'auto',
                  mr: 2
                }}
              /> */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}
              >
                IAAS-FIRECRACKER
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enterprise-grade cloud infrastructure with firecracker virtualization technology.
            </Typography>
            
            {/* Newsletter Subscription */}
            <Box component="form" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Subscribe to our newsletter
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Your email"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{
                    borderRadius: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>

            {/* Social Links */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  aria-label="GitHub" 
                  href="https://github.com/your-repo"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton 
                  aria-label="Twitter" 
                  href="https://twitter.com/your-handle"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: '#1DA1F2'
                    }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  aria-label="LinkedIn" 
                  href="https://linkedin.com/company/your-company"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: '#0077B5'
                    }
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  aria-label="Blog" 
                  href="/blog"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.secondary.main
                    }
                  }}
                >
                  <BlogIcon />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Products
            </Typography>
            <Stack spacing={1}>
              <Link href="/vms" underline="hover" color="inherit">Virtual Machines</Link>
              <Link href="#" underline="hover" color="inherit">Kubernetes</Link>
              <Link href="#" underline="hover" color="inherit">Storage</Link>
              <Link href="#" underline="hover" color="inherit">Load Balancers</Link>
              <Link href="#" underline="hover" color="inherit">Backups</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">Documentation</Link>
              <Link href="#" underline="hover" color="inherit">API Reference</Link>
              <Link href="#" underline="hover" color="inherit">Tutorials</Link>
              <Link href="#" underline="hover" color="inherit">Community</Link>
              <Link href="#" underline="hover" color="inherit">Status</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">About Us</Link>
              <Link href="#" underline="hover" color="inherit">Careers</Link>
              <Link href="#" underline="hover" color="inherit">Contact</Link>
              <Link href="#" underline="hover" color="inherit">Blog</Link>
              <Link href="#" underline="hover" color="inherit">Press</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">Terms of Service</Link>
              <Link href="#" underline="hover" color="inherit">Privacy Policy</Link>
              <Link href="#" underline="hover" color="inherit">Security</Link>
              <Link href="#" underline="hover" color="inherit">Compliance</Link>
              <Link href="#" underline="hover" color="inherit">GDPR</Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} IAAS-FIRECRACKER. All rights reserved.
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            <Link href="#" variant="body2" underline="hover" color="inherit">
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" underline="hover" color="inherit">
              Terms of Service
            </Link>
            <Link href="#" variant="body2" underline="hover" color="inherit">
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;