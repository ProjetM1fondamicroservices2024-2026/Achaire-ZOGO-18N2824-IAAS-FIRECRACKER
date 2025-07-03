import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  Stack,
  Checkbox,
  FormControlLabel,
  Fade
} from '@mui/material';
import { 
  Email as EmailIcon,
  Lock as LockIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import {login} from '../../api/user-backend';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store';
import axios from 'axios';

const LoginForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onResponseReceived = (data)=> {
    if(data)
    {
      localStorage.setItem('iaas-userId',data.data.user.id);
      localStorage.setItem('iaas-token',data.data.access);
      localStorage.setItem('iaas-email',data.data.user.email);
      localStorage.setItem('iaas-username', data.data.user.username);
  
      localStorage.setItem('iaas-admin', data.data.user.role === 'ADMIN');
      
      setIsAuthenticated(true);
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.data.access}`
      dispatch(authActions.login());
      console.log(data.user);
      if(data.user.role === 'ADMIN'){
        console.log("Setting Admin");
        dispatch(authActions.setAdmin());
      }
    } else console.log("NO DATAS");

    
    //navigate('/dashboard');


  }

  const validateForm = () => {
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        const response = await login({ email, password });
        console.log("RESPONSE", response);
        onResponseReceived(response);
      } catch (err) {
        //console.error('Login error:', err);
        if (err.response && err.response.status === 401) {
          setError('Incorrect password. Please try again.');
        } else {
          setError('An error occurred during login. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  // If authentication is successful
  if (isAuthenticated) {
    return (
      <Fade in={isAuthenticated}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.success.main,
              mb: 2
            }}
          />
          <Typography variant="h5" component="h2" gutterBottom>
            Login Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You have been successfully logged in to your account.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            href="/dashboard"
            sx={{ borderRadius: 28, px: 4 }}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Fade>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        borderRadius: 2,
        maxWidth: 450,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please sign in to your account to continue
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error && error.includes('email')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color={error && error.includes('email') ? "error" : "action"} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error && error.includes('password')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color={error && error.includes('password') ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  size="small"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                name="rememberMe"
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Remember me
              </Typography>
            }
          />
          <Link 
            href="/forgot-password" 
            variant="body2"
            underline="hover"
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          >
            Forgot password?
          </Link>
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.5, 
            borderRadius: 28,
            position: 'relative',
            fontWeight: 600
          }}
        >
          {loading ? (
            <CircularProgress 
              size={24} 
              sx={{ 
                color: theme.palette.primary.light
              }} 
            />
          ) : (
            "Sign In"
          )}
        </Button>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR CONTINUE WITH
          </Typography>
        </Divider>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSocialLogin('Google')}
            startIcon={<GoogleIcon />}
            sx={{ 
              py: 1.2, 
              borderRadius: 2,
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSocialLogin('GitHub')}
            startIcon={<GitHubIcon />}
            sx={{ 
              py: 1.2, 
              borderRadius: 2,
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            GitHub
          </Button>
        </Stack>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              underline="hover"
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 500
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;