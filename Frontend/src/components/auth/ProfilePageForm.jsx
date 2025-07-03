import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { updateProfile, changeUserPassword } from '../../api/user-backend';
import { Edit, Face, Security } from '@mui/icons-material';

const ProfilePage = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john.doe@example.com' });
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setError('');
  };

  useEffect(() => {
    const name = localStorage.getItem("iaas-username");
    const email = localStorage.getItem("iaas-email");

    setUser({ name, email });
    setEditData({ name, email });
  }, []);

  const handleClosePopup = () => {
    setPopupMessage('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!editData.name.trim() || !editData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = await updateProfile(editData);
      console.log("UPDATED PROFILE", updatedProfile);

      const editedName = updatedProfile.data.username;
      const editedEmail = updatedProfile.data.email;
      setUser({ name: editedName, email: editedEmail });

      localStorage.setItem('iaas-email', editedEmail);
      localStorage.setItem('iaas-username', editedName);

      setPopupMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordData.currentPassword.trim() || !passwordData.newPassword.trim()) {
      setError('Both current and new passwords are required');
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword({
        password: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPopupMessage('Password changed successfully!');
      setTabIndex(0);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = () => {
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProfile = async () => {
    setDeleteConfirmationOpen(false);
    setLoading(true);
    try {
      // Call delete profile API here
      console.log('Profile deleted successfully');
      setPopupMessage('Profile deleted successfully!');
    } catch (err) {
      setError('Failed to delete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: 'auto', mt: 6 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Profile" />
          <Tab label="Edit Profile" />
          <Tab label="Change Password" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {tabIndex === 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ my: 4, display: "flex" }}>
              <Face sx={{ fontSize: 60, color: theme.palette.primary.main, margin: "auto", opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Name: {user.name}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>

            <Button
              type="button"
              variant="contained"
              disabled={loading}
              onClick={handleDeleteProfile}
              sx={{ mt: 4, width: "50%" }}
              color='error'
            >
              {loading ? <CircularProgress size={24} /> : 'Delete Profile'}
            </Button>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box component="form" onSubmit={handleProfileUpdate} sx={{ mt: 3 }}>
            <Box sx={{ my: 4, display: "flex" }}>
              <Edit sx={{ fontSize: 60, color: theme.palette.primary.main, margin: "auto", opacity: 0.5 }} />
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box component="form" onSubmit={handleChangePassword} sx={{ mt: 3 }}>
            <Box sx={{ my: 4, display: "flex" }}>
              <Security sx={{ fontSize: 60, color: theme.palette.primary.main, margin: "auto", opacity: 0.5 }} />
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={!!popupMessage} onClose={handleClosePopup}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <Typography>{popupMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your profile? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={confirmDeleteProfile} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePage;