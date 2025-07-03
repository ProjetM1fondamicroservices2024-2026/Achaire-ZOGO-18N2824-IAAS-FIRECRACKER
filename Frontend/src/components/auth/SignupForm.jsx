import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
  CircularProgress,
  Divider,
  IconButton,
  Fade,
  useTheme,
  Alert,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import {register} from '../../api/user-backend'

const SignupForm = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  useEffect(() => {
    // Validate password match whenever either password changes
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords don't match"
        }));
      } else {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
    
    // Calculate password strength
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [formData.password, formData.confirmPassword]);

  const calculatePasswordStrength = (password) => {
    // Simple password strength calculation
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Medium';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }

    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value
    }));

    // Clear related errors when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

   const onResponseReceived = (data)=>{
      console.log(data);
      setIsSubmitted(true);
   
  
    }

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 3) {
      errors.password = "Password is too weak";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      errors.agreeTerms = "You must agree to the Terms of Service";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
        setLoading(true);

        try {
            // Simulate API call
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            })
            .then(onResponseReceived)
            .catch((error) => {
                console.error('Signup error:', error);
                setFormErrors(prev => ({
                    ...prev,
                    submit: "An error occurred. Please try again."
                }));
            });
        } finally {
            setLoading(false);
        }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  // Render password strength indicator
  const renderPasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    const getColor = () => {
      switch (passwordStrength.score) {
        case 0:
        case 1:
          return theme.palette.error.main;
        case 2:
          return theme.palette.warning.main;
        case 3:
          return theme.palette.info.main;
        case 4:
        case 5:
          return theme.palette.success.main;
        default:
          return theme.palette.grey[500];
      }
    };
    
    return (
      <Box sx={{ mt: 0.5, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              width: '100%',
              backgroundColor: theme.palette.grey[200],
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${(passwordStrength.score / 5) * 100}%`,
                backgroundColor: getColor(),
                transition: 'width 0.3s ease, background-color 0.3s ease'
              }}
            />
          </Box>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: getColor(),
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {passwordStrength.score >= 3 ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <InfoIcon fontSize="small" />
          )}
          Password strength: {passwordStrength.feedback}
        </Typography>
      </Box>
    );
  };

  // If form is successfully submitted, show success message
  if (isSubmitted) {
    return (
      <Fade in={isSubmitted}>
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
            Sign Up Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your account has been created successfully. Please check your email to verify your account.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            href="/login"
            sx={{ borderRadius: 28, px: 4 }}
          >
            Go to Login
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
        maxWidth: 500,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Create Your Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill out the form below to get started
        </Typography>
      </Box>

      {formErrors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formErrors.submit}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          error={!!formErrors.name}
          helperText={formErrors.name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color={formErrors.name ? "error" : "action"} />
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
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color={formErrors.email ? "error" : "action"} />
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color={formErrors.password ? "error" : "action"} />
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
        {renderPasswordStrengthIndicator()}
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color={formErrors.confirmPassword ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleConfirmPasswordVisibility}
                  edge="end"
                  size="small"
                  aria-label="toggle confirm password visibility"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              color="primary"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the <Link href="#" underline="hover">Terms of Service</Link> and <Link href="#" underline="hover">Privacy Policy</Link>
            </Typography>
          }
          sx={{ mt: 2 }}
        />
        {formErrors.agreeTerms && (
          <Typography variant="caption" color="error" sx={{ ml: 2 }}>
            {formErrors.agreeTerms}
          </Typography>
        )}
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
            position: 'relative'
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
            "Create Account"
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
            Already have an account? <Link href="/login" underline="hover">Sign in</Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignupForm;