import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
  Grid,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  LockReset as ResetPasswordIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import { 
  getUsers, 
  getUserById, 
  createAdminUser,
  // Additional API functions to implement:
  deleteUser,  // You'll need to add this to your API
  updateUser,  // You'll need to add this to your API
  resetUserPassword  // You'll need to add this to your API
} from '../api/user-backend';

const UserManagementPage = () => {
  const theme = useTheme();
  
  // State for user data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for menu and selected user
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active'
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filter menu
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUsers();
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle menu open
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userId);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  
  // Handle action selection from menu
  const handleAction = async (action) => {
    // Store the selectedUser ID before closing the menu
    const userId = selectedUser;
    
    // Close the menu
    handleMenuClose();
    
    // Check if we have a valid user ID
    if (!userId) {
      showSnackbar('No user selected.', 'error');
      return;
    }
    
    try {
      // Get selected user data
      const userData = users.find(user => user.id === userId);
      
      if (!userData) {
        showSnackbar('User not found.', 'error');
        return;
      }
      
      setSelectedUserData(userData);
      setSelectedUser(userId); // Ensure selectedUser is set
      
      switch (action) {
        case 'view':
          setViewDialogOpen(true);
          break;
        case 'edit':
          // Populate form with user data
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            password: '',
            confirmPassword: '',
            role: userData.role || 'user',
            status: userData.status || 'active'
          });
          setEditDialogOpen(true);
          break;
        case 'reset-password':
          // Reset password form
          setFormData({
            ...formData,
            password: '',
            confirmPassword: ''
          });
          setResetPasswordDialogOpen(true);
          break;
        case 'delete':
          setDeleteDialogOpen(true);
          break;
        default:
          break;
      }
    } catch (err) {
      showSnackbar('Failed to fetch user details.', 'error');
      console.error(err);
    }
  };
  
  // Handle create user dialog open
  const handleCreateDialogOpen = () => {
    // Reset form data
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user', // Default to regular user
      status: 'active'
    });
    setFormErrors({});
    setCreateDialogOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // For create user or reset password dialogs
    if ((createDialogOpen || resetPasswordDialogOpen) && !formData.password) {
      errors.password = 'Password is required';
    } else if ((createDialogOpen || resetPasswordDialogOpen) && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if ((createDialogOpen || resetPasswordDialogOpen) && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle create user submit
  const handleCreateUser = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Determine if we're creating a regular user or admin
      const isAdmin = formData.role === 'admin';
      
      const response = await createAdminUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status
      });
      
      if (response) {
        // Refresh user list
        fetchUsers();
        
        // Close dialog
        setCreateDialogOpen(false);
        
        // Show success message
        showSnackbar(`${isAdmin ? 'Administrator' : 'User'} created successfully!`, 'success');
      }
    } catch (err) {
      showSnackbar(`Failed to create ${formData.role === 'admin' ? 'administrator' : 'user'}. Please try again.`, 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit user submit
  const handleEditUser = async () => {
    if (!validateForm()) return;
    
    // Get the current selectedUser ID
    const userId = selectedUser;
    
    if (!userId) {
      showSnackbar('No user selected.', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // This API function needs to be implemented
      const response = await updateUser(userId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      });
      
      if (response) {
        // Refresh user list
        fetchUsers();
        
        // Close dialog
        setEditDialogOpen(false);
        
        // Show success message
        showSnackbar('User updated successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to update user. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reset password submit
  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    // Get the current selectedUser ID
    const userId = selectedUser;
    
    if (!userId) {
      showSnackbar('No user selected.', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // This API function needs to be implemented
      const response = await resetUserPassword(userId, {
        password: formData.password
      });
      
      if (response) {
        // Close dialog
        setResetPasswordDialogOpen(false);
        
        // Show success message
        showSnackbar('Password reset successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to reset password. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = async () => {
    // Get the current selectedUser ID
    const userId = selectedUser;
    
    if (!userId) {
      showSnackbar('No user selected.', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // This API function needs to be implemented
      const response = await deleteUser(userId);
      
      if (response) {
        // Refresh user list
        fetchUsers();
        
        // Close dialog
        setDeleteDialogOpen(false);
        
        // Show success message
        showSnackbar('User deleted successfully!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to delete user. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Handle filter menu open
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  // Handle filter menu close
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };
  
  // Apply filters to users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={handleCreateDialogOpen}
            disabled={loading}
          >
            Create User
          </Button>
        </Box>
      </Box>
      
      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilterMenuOpen}
                sx={{ mr: 1 }}
              >
                Filters
              </Button>
              {(roleFilter !== 'all' || statusFilter !== 'all') && (
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => {
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Filters menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Role</Typography>
        </MenuItem>
        <MenuItem 
          selected={roleFilter === 'all'}
          onClick={() => {
            setRoleFilter('all');
            handleFilterMenuClose();
          }}
        >
          All Roles
        </MenuItem>
        <MenuItem 
          selected={roleFilter === 'admin'}
          onClick={() => {
            setRoleFilter('admin');
            handleFilterMenuClose();
          }}
        >
          Admin
        </MenuItem>
        <MenuItem 
          selected={roleFilter === 'user'}
          onClick={() => {
            setRoleFilter('user');
            handleFilterMenuClose();
          }}
        >
          User
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <Typography variant="subtitle2">Status</Typography>
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'all'}
          onClick={() => {
            setStatusFilter('all');
            handleFilterMenuClose();
          }}
        >
          All Statuses
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'active'}
          onClick={() => {
            setStatusFilter('active');
            handleFilterMenuClose();
          }}
        >
          Active
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'inactive'}
          onClick={() => {
            setStatusFilter('inactive');
            handleFilterMenuClose();
          }}
        >
          Inactive
        </MenuItem>
      </Menu>
      
      {/* Loading indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: user.role === 'admin' ? 'primary.light' : 'grey.100',
                        color: user.role === 'admin' ? 'primary.dark' : 'text.primary'
                      }}
                    >
                      {user.role}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: user.status === 'active' ? 'success.light' : 'error.light',
                        color: user.status === 'active' ? 'success.dark' : 'error.dark'
                      }}
                    >
                      {user.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user.id)}
                      disabled={loading}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? (
                    <CircularProgress size={20} sx={{ my: 2 }} />
                  ) : (
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No users found
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('reset-password')}>
          <ListItemIcon>
            <ResetPasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Create User Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>User Type</Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    p: 1, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Button
                    fullWidth
                    variant={formData.role === 'user' ? 'contained' : 'outlined'}
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    sx={{ mr: 1 }}
                  >
                    Regular User
                  </Button>
                  <Button
                    fullWidth
                    variant={formData.role === 'admin' ? 'contained' : 'outlined'}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    color="primary"
                  >
                    Administrator
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {formData.role === 'admin' ? 
                    'Administrators have full access to manage all system resources and other users.' :
                    'Regular users have limited permissions based on their assigned resources.'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.confirmPassword)}
                helperText={formErrors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Account Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Account Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                <FormHelperText>
                  Active users can immediately login to the system
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCreateDialogOpen(false)} 
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateUser}
            startIcon={<SaveIcon />}
            disabled={loading}
            color={formData.role === 'admin' ? 'primary' : 'primary'}
          >
            {loading ? 'Creating...' : `Create ${formData.role === 'admin' ? 'Admin' : 'User'}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditUser}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog 
        open={resetPasswordDialogOpen} 
        onClose={() => setResetPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a new password for {selectedUserData?.name}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(formErrors.confirmPassword)}
                helperText={formErrors.confirmPassword}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setResetPasswordDialogOpen(false)} 
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleResetPassword}
            startIcon={<SaveIcon />}
            color="primary"
            disabled={loading}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the user <strong>{selectedUserData?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. The user will be permanently removed from the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteUser}
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View User Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUserData && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">User ID</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUserData.id}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUserData.name}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUserData.email}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Role</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box 
                  sx={{ 
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: selectedUserData.role === 'admin' ? 'primary.light' : 'grey.100',
                    color: selectedUserData.role === 'admin' ? 'primary.dark' : 'text.primary'
                  }}
                >
                  {selectedUserData.role}
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box 
                  sx={{ 
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: selectedUserData.status === 'active' ? 'success.light' : 'error.light',
                    color: selectedUserData.status === 'active' ? 'success.dark' : 'error.dark'
                  }}
                >
                  {selectedUserData.status}
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Created At</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUserData.createdAt ? new Date(selectedUserData.createdAt).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUserData.updatedAt ? new Date(selectedUserData.updatedAt).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => {
              setViewDialogOpen(false);
              handleAction('edit');
            }}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagementPage;