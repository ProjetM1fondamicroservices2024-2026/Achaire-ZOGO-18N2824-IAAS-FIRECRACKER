import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Tab,
  Tabs,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Code as CodeIcon,
  TerminalOutlined as TerminalIcon,
  ArrowForward as ArrowForwardIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  ClearAll as ClearIcon
} from '@mui/icons-material';

// Import API functions
import { getVms, statusVm } from '../../api/vm-host-backend';
import { getLoggedInUser } from '../../api/user-backend';

// Simulated console messages - replace with actual console data
const simulatedConsoleOutput = [
  { timestamp: '2025-05-16T10:00:00Z', message: 'Starting VM initialization...' },
  { timestamp: '2025-05-16T10:00:01Z', message: 'Loading kernel modules...' },
  { timestamp: '2025-05-16T10:00:03Z', message: 'Mounting virtual file systems...' },
  { timestamp: '2025-05-16T10:00:05Z', message: 'Starting system services...' },
  { timestamp: '2025-05-16T10:00:08Z', message: 'Network interfaces configured.' },
  { timestamp: '2025-05-16T10:00:10Z', message: 'System initialization complete.' },
  { timestamp: '2025-05-16T10:00:12Z', message: 'Welcome to your virtual machine!' },
];

const VmConsole = () => {
  const theme = useTheme();
  const consoleEndRef = useRef(null);
  
  // State for VMs and selected VM
  const [vms, setVms] = useState([]);
  const [selectedVm, setSelectedVm] = useState('');
  const [selectedVmData, setSelectedVmData] = useState(null);
  
  // State for user
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for console
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleActive, setConsoleActive] = useState(false);
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [loadingConsole, setLoadingConsole] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch VMs on component mount
  useEffect(() => {
    fetchUserAndVms();
  }, []);
  
  // Scroll to bottom of console output when it changes
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleOutput]);
  
  // Fetch user and VMs
  const fetchUserAndVms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current user
      const userData = await getLoggedInUser();
      if (userData) {
        setCurrentUser(userData);
        
        // Fetch VMs
        const vmsData = await getVms(userData.id);
        if (vmsData) {
          // Filter VMs for current user
          const userVms = vmsData.filter(vm => vm.user_id === userData.id);
          
          // Filter only running VMs
          const runningVms = userVms.filter(vm => vm.status === 'running');
          
          setVms(runningVms);
          
          // Auto-select first VM if available
          if (runningVms.length > 0) {
            setSelectedVm(runningVms[0].name);
            setSelectedVmData(runningVms[0]);
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch your virtual machines. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle VM selection change
  const handleVmChange = (event) => {
    const vmName = event.target.value;
    setSelectedVm(vmName);
    
    // Find the selected VM data
    const vmData = vms.find(vm => vm.name === vmName);
    setSelectedVmData(vmData);
    
    // Reset console when switching VMs
    setConsoleOutput([]);
    setConsoleActive(false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Connect to VM console
  const handleConnectConsole = async () => {
    if (!selectedVm) return;
    
    setLoadingConsole(true);
    setError(null);
    
    try {
      // Fetch VM status to confirm it's running
      const statusResponse = await statusVm({
        vm_id: selectedVmData.id,
        user_id: currentUser.id
      });
      console.log(statusResponse);
      
      if (statusResponse && statusResponse.status.status === 'running') {
        // In a real implementation, this would establish a connection to the VM console
        // For now, we'll simulate console output
        
        // Simulate a connection delay
        setTimeout(() => {
          setConsoleOutput(simulatedConsoleOutput);
          setConsoleActive(true);
          setLoadingConsole(false);
        }, 1500);
      } else {
        setError('Unable to connect to VM console. The VM may not be running.');
        setLoadingConsole(false);
      }
    } catch (err) {
      setError('Failed to connect to VM console. Please try again.');
      console.error(err);
      setLoadingConsole(false);
    }
  };
  
  // Disconnect from VM console
  const handleDisconnectConsole = () => {
    setConsoleActive(false);
  };
  
  // Send console command
  const handleSendCommand = () => {
    if (!consoleInput.trim() || !consoleActive) return;
    
    // Add command to console output
    const newOutput = [
      ...consoleOutput,
      { 
        timestamp: new Date().toISOString(), 
        message: `$ ${consoleInput}`,
        isCommand: true
      }
    ];
    
    setConsoleOutput(newOutput);
    
    // In a real implementation, this would send the command to the VM
    // For now, simulate a response
    setTimeout(() => {
      let response;
      
      // Simulate some basic command responses
      switch (consoleInput.trim().toLowerCase()) {
        case 'help':
          response = 'Available commands: help, date, hostname, uptime, ls, clear';
          break;
        case 'date':
          response = `Current date: ${new Date().toString()}`;
          break;
        case 'hostname':
          response = `Hostname: ${selectedVm}`;
          break;
        case 'uptime':
          response = 'System uptime: 3 hours, 27 minutes';
          break;
        case 'ls':
          response = 'Documents  Downloads  Pictures  Videos  README.txt';
          break;
        case 'clear':
          // Clear console
          setConsoleOutput([]);
          setConsoleInput('');
          return;
        default:
          response = `Command not found: ${consoleInput}`;
      }
      
      setConsoleOutput([
        ...newOutput,
        { timestamp: new Date().toISOString(), message: response }
      ]);
    }, 500);
    
    // Clear input
    setConsoleInput('');
  };
  
  // Handle console input change
  const handleConsoleInputChange = (e) => {
    setConsoleInput(e.target.value);
  };
  
  // Handle console input key press
  const handleConsoleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    }
  };
  
  // Clear console
  const handleClearConsole = () => {
    setConsoleOutput([]);
  };
  
  // Copy console output to clipboard
  const handleCopyConsole = () => {
    const text = consoleOutput.map(entry => {
      const date = new Date(entry.timestamp).toLocaleTimeString();
      return `[${date}] ${entry.message}`;
    }).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => {
        // In a real app, you might want to show a temporary success message
        console.log('Console output copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy console output:', err);
      });
  };
  
  // Download console output
  const handleDownloadConsole = () => {
    const text = consoleOutput.map(entry => {
      const date = new Date(entry.timestamp).toLocaleTimeString();
      return `[${date}] ${entry.message}`;
    }).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${selectedVm}-console-${new Date().toISOString().substr(0, 10)}.log`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format console timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  return (
    <Box>
      {/* VM Selector */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <InputLabel id="vm-select-label">Select Virtual Machine</InputLabel>
            <Select
              labelId="vm-select-label"
              id="vm-select"
              value={selectedVm}
              label="Select Virtual Machine"
              onChange={handleVmChange}
              disabled={loading || vms.length === 0}
            >
              {vms.map((vm) => (
                <MenuItem key={vm.name} value={vm.name}>
                  {vm.name} ({vm.ip_address}) ({vm.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchUserAndVms}
            disabled={loading}
            fullWidth
            sx={{ height: '100%' }}
          >
            Refresh VM List
          </Button>
        </Grid>
      </Grid>
      
      {/* Loading Indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* No Running VMs Message */}
      {!loading && vms.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1">
            No running virtual machines found. Start a VM in the "Manage VMs" tab to access the console.
          </Typography>
        </Alert>
      )}
      
      {/* VM Console Tabs */}
      {selectedVmData && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="VM console tabs"
            >
              <Tab 
                icon={<TerminalIcon />} 
                iconPosition="start" 
                label="Console" 
              />
              <Tab 
                icon={<CodeIcon />} 
                iconPosition="start" 
                label="Information" 
              />
            </Tabs>
          </Box>
          
          {/* Console Tab */}
          <Box role="tabpanel" hidden={tabValue !== 0} id="console-tab">
            {tabValue === 0 && (
              <Box>
                {/* Console Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                  <Box>
                    {!consoleActive ? (
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<TerminalIcon />}
                        onClick={handleConnectConsole}
                        disabled={loadingConsole}
                      >
                        {loadingConsole ? 'Connecting...' : 'Connect to Console'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleDisconnectConsole}
                      >
                        Disconnect
                      </Button>
                    )}
                  </Box>
                  
                  <Box>
                    <Tooltip title="Clear Console">
                      <IconButton 
                        onClick={handleClearConsole}
                        disabled={!consoleActive || consoleOutput.length === 0}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Copy Output">
                      <IconButton 
                        onClick={handleCopyConsole}
                        disabled={!consoleActive || consoleOutput.length === 0}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Download Log">
                      <IconButton 
                        onClick={handleDownloadConsole}
                        disabled={!consoleActive || consoleOutput.length === 0}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                {/* Console Output */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#1e1e1e', 
                    color: '#f0f0f0',
                    height: 400,
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    mb: 2
                  }}
                >
                  {loadingConsole ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                      <Typography color="inherit">
                        Connecting to VM console...
                      </Typography>
                    </Box>
                  ) : consoleActive && consoleOutput.length > 0 ? (
                    <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      {consoleOutput.map((entry, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            mb: 0.5,
                            color: entry.isCommand ? theme.palette.success.light : 'inherit'
                          }}
                        >
                          <Box component="span" sx={{ opacity: 0.7, mr: 1 }}>
                            [{formatTimestamp(entry.timestamp)}]
                          </Box>
                          {entry.message}
                        </Box>
                      ))}
                      <div ref={consoleEndRef} />
                    </Box>
                  ) : consoleActive ? (
                    <Typography color="inherit">
                      Console connected. Type commands below to interact with your VM.
                    </Typography>
                  ) : (
                    <Typography color="inherit" sx={{ opacity: 0.7 }}>
                      Console not connected. Click "Connect to Console" to begin.
                    </Typography>
                  )}
                </Paper>
                
                {/* Console Input */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={consoleActive ? "Type commands here..." : "Console not connected"}
                    value={consoleInput}
                    onChange={handleConsoleInputChange}
                    onKeyPress={handleConsoleInputKeyPress}
                    disabled={!consoleActive}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.success.main }}>
                          $
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace'
                      }
                    }}
                  />
                  
                  <IconButton 
                    color="primary" 
                    onClick={handleSendCommand}
                    disabled={!consoleActive || !consoleInput.trim()}
                    sx={{ ml: 1 }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
                
                {/* Console Help Text */}
                {consoleActive && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Tip: Type "help" to see available commands. Press Enter to execute commands.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
          
          {/* Information Tab */}
          <Box role="tabpanel" hidden={tabValue !== 1} id="information-tab">
            {tabValue === 1 && selectedVmData && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* VM Information Card */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        VM Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Name:</Typography>
                          <Typography variant="body2">{selectedVmData.name}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Operating System:</Typography>
                          <Typography variant="body2">{selectedVmData.os_type}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Status:</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: selectedVmData.status === 'running' ? 
                                theme.palette.success.main : 
                                theme.palette.error.main 
                            }}
                          >
                            {selectedVmData.status}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">CPU Cores:</Typography>
                          <Typography variant="body2">{selectedVmData.cpu_count}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Memory:</Typography>
                          <Typography variant="body2">
                            {(selectedVmData.memory_size_mib / 1024).toFixed(1)} GB
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Storage:</Typography>
                          <Typography variant="body2">{selectedVmData.disk_size_gb} GB</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Connection Information Card */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Connection Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">IP Address:</Typography>
                          <Typography variant="body2">{selectedVmData.vm_ip || 'Not assigned'}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">MAC Address:</Typography>
                          <Typography variant="body2">{selectedVmData.vm_mac || 'Not assigned'}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Username:</Typography>
                          <Typography variant="body2">
                            {selectedVmData.os_type === 'linux' ? 'root' : 'Administrator'}
                          </Typography>
                        </Box>
                        
                        <Alert severity="info" sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            You can connect to this VM using SSH or other remote access tools using the information above.
                          </Typography>
                        </Alert>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Console Usage Help Card */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Console Usage Help
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body2" paragraph>
                        The VM console allows you to interact with your virtual machine through a command-line interface.
                        Here are some common commands you can use in the console:
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Basic Commands
                          </Typography>
                          <Box component="ul" sx={{ pl: 2 }}>
                            <li>
                              <Typography variant="body2">
                                <strong>help</strong> - Display available commands
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>date</strong> - Show current date and time
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>hostname</strong> - Display VM hostname
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>uptime</strong> - Show system uptime
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>ls</strong> - List files in current directory
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>clear</strong> - Clear console output
                              </Typography>
                            </li>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Console Controls
                          </Typography>
                          <Box component="ul" sx={{ pl: 2 }}>
                            <li>
                              <Typography variant="body2">
                                <strong>Connect/Disconnect</strong> - Start or end a console session
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>Clear Console</strong> - Erase all console output
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>Copy Output</strong> - Copy all console text to clipboard
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body2">
                                <strong>Download Log</strong> - Save console output as a text file
                              </Typography>
                            </li>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Note: This is a simulated console for demonstration purposes. In a production environment, 
                          this would connect to a real VM console session via WebSocket or similar technology.
                        </Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VmConsole;