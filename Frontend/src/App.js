import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VmManagementPage from './pages/VmManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import ClusterManagementPage from './pages/ClusterManagementPage';
import SystemImagesPage from './pages/SystemImagesPage';
import VMOffersPage from './pages/VmOffersPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import PageLayout from './components/layout/PageLayout';
import { authActions } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProfilePage from './components/auth/ProfilePageForm';
import ResetPasswordPage from './pages/ResetPasswordPage';

//import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isAdmin = useSelector(state => state.isAdmin);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  console.log(localStorage.getItem('iaas-admin'));

  // Update state based on changes in Redux store
  useEffect(() => {
    if(localStorage.getItem('iaas-token')) {
      dispatch(authActions.login());
    }
    if(localStorage.getItem('iaas-admin') == true){
     console.log("set admin");
     dispatch(authActions.setAdmin());
    }
  }, [dispatch]); // Fixed dependency array

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const toggleDrawer = (open) => () => {
    setSidebarOpen(open);
  };

  return (
  
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflow: 'hidden' // Prevent horizontal scroll
        }}>
          {/* Fixed Sidebar */}
          {isLoggedIn  && (
            <Sidebar 
              open={sidebarOpen} 
              toggleDrawer={toggleDrawer} 
            />
          )}
          
          {/* Header */}
          <Header onMenuClick={handleMenuClick} />
          
          {/* Main Content */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <Routes>
              <Route 
                path="/" 
                element={
                  <PageLayout>
                    <HomePage />
                  </PageLayout>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PageLayout>
                    <LoginPage />
                  </PageLayout>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <PageLayout>
                    <ResetPasswordPage />
                  </PageLayout>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PageLayout>
                    <SignupPage />
                  </PageLayout>
                } 
              />
              
              {isLoggedIn && (
                <>
                  <Route
                    path="/dashboard"
                    element={
                      <PageLayout>
                        <DashboardPage />
                      </PageLayout>
                    }
                  />
                  <Route
                    path="/vms"
                    element={
                      <PageLayout>
                        <VmManagementPage />
                      </PageLayout>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PageLayout>
                        <ProfilePage />
                      </PageLayout>
                    }
                  />
                </>
              )}

              {isAdmin && (
                <>
                  <Route
                    path="/users"
                    element={
                      <PageLayout>
                        <UserManagementPage />
                      </PageLayout>
                    }
                  />
                  <Route
                    path="/clusters"
                    element={
                      <PageLayout>
                        <ClusterManagementPage />
                      </PageLayout>
                    }
                  />
                  <Route
                    path="/system-images"
                    element={
                      <PageLayout>
                        <SystemImagesPage />
                      </PageLayout>
                    }
                  />
                  <Route
                    path="/vm-offers-management"
                    element={
                      <PageLayout>
                        <VMOffersPage />
                      </PageLayout>
                    }
                  />
                </>
              )}
            </Routes>
          </Box>
          
          {/* Footer */}
          <PageLayout><Footer /></PageLayout>
        </Box>
      </ThemeProvider>
    
  );
}

export default App;