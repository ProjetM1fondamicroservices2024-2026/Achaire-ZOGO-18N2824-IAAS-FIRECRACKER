import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  PlayCircleOutline as StartIcon,
  PauseCircleOutline as PauseIcon,
  StopCircleOutlined as StopIcon,
  DeleteOutline as DeleteIcon,
  TerminalOutlined as ConsoleIcon,
} from '@mui/icons-material';
import { getVmHostHealthCheck } from '../../api/vm-host-backend'; // Import the function

const statusColors = {
  running: 'success',
  paused: 'warning',
  stopped: 'error',
  creating: 'info',
};

const VmList = () => {
  const [vms, setVms] = useState([]);

  useEffect(() => {
    const fetchVms = async () => {
      const data = await getVmHostHealthCheck(); // Fetch VM data
      console.log("DATAS", data);
      setVms(data.vms || []); // Update state with fetched VMs
    };
    fetchVms();
  }, []);

  const handleAction = (action, vmId) => {
    console.log(`Action: ${action} on VM ${vmId}`);
    // Implement API calls for VM actions
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Virtual Machines table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vms.length > 0 ? (
            vms.map((vm) => (
              <TableRow key={vm.id}>
                <TableCell>
                  <Typography fontWeight="medium">{vm.name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vm.status}
                    color={statusColors[vm.status.toLowerCase()] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{vm.os}</TableCell>
                <TableCell>{vm.ip}</TableCell>
                <TableCell>
                  <Tooltip title="Start">
                    <IconButton onClick={() => handleAction('start', vm.id)}>
                      <StartIcon color="success" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Pause">
                    <IconButton onClick={() => handleAction('pause', vm.id)}>
                      <PauseIcon color="warning" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Stop">
                    <IconButton onClick={() => handleAction('stop', vm.id)}>
                      <StopIcon color="error" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Console">
                    <IconButton onClick={() => handleAction('console', vm.id)}>
                      <ConsoleIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleAction('delete', vm.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No virtual machines found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VmList;