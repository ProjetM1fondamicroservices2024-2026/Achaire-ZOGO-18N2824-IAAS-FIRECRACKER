import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import { sendResetCode, verifyResetCode, resetUserPassword } from '../../api/user-backend';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email', 'code', or 'password'
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setCode('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await sendResetCode({ email });
      if(result.status === 200)
        setStep('code');
      else setError(`Failed to send reset code : ${result.response.data.error}`);
    } catch (err) {
      console.log("ERROR", err);
      setError(`Failed to send reset code. Please try again `);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Code is required');
      return;
    }

    setLoading(true);
    try {
      await verifyResetCode({ email, code });
      setStep('password');
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim()) {
      setError('New password is required');
      return;
    }

    if(confirmNewPassword.trim() !== newPassword.trim()) {
      setError("password doesn't match with her confirmation");
      return;
    }

    setLoading(true);
    try {
      await resetUserPassword({ email, code, newPassword });
      //alert('Password reset successfully!');
      // Redirect to login or another appropriate page
      navigate('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {step === 'email' ? 'Reset Your Password' : step === 'code' ? 'Enter Verification Code' : 'Set New Password'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {step === 'email' 
            ? 'Enter your email to receive a reset code.' 
            : step === 'code' 
            ? 'Check your email for the reset code and enter it below.'
            : 'Enter your new password to complete the reset.'}
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

      {step === 'email' ? (
        <Box component="form" onSubmit={handleSendEmail} noValidate>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
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
              "Send Reset Code"
            )}
          </Button>
        </Box>
      ) : step === 'code' ? (
        <Box component="form" onSubmit={handleVerifyCode} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Verification Code"
            name="code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={!!error && error.includes('code')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
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
              "Verify Code"
            )}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link 
              href="#" 
              onClick={() => { setError(''); setStep('email'); }} 
              underline="hover"
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 500
              }}
            >
              Resend Code
            </Link>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleResetPassword} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            name="newPassword"
            type="password"
            autoFocus
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!error && error.includes('password')}
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
            id="confirmNewPassword"
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            error={!!error && error.includes('password')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
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
              "Reset Password"
            )}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ResetPasswordForm;