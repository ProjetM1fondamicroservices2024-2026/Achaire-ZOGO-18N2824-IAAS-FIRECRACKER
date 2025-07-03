import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <ResetPasswordForm />
       
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;