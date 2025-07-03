import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
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
        
        <LoginForm />
       
      </Box>
    </Container>
  );
};

export default LoginPage;