import React, { useState, useEffect, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { publicAxios } from '../axios/AxiosHeader';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';



export default function ManageUsersContent({ navigateToPatients, navigateToTherapists }) {
  const api = publicAxios();


  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const tableRef = useRef(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users');
        if (response.status === 200) {
          // Assuming response.data is already a JSON array of user objects
          const data = response.data.map((user, index) => ({
            id: user.id || index + 1, // Ensure each user has a unique ID
            username: user.username,
            email: user.email,
            firstName: user.firstName || user.first_name || 'N/A',
            lastName: user.lastName || user.last_name || 'N/A',
            role: user.role || 'N/A',
            phone_number: user.phone_number || 'N/A',
            dob: user.dob || 'N/A',
            medicalHistory: user.medicalHistory || 'N/A',
            specialization: user.specialization || 'N/A',
          }));
    
          setRows(data); // Update the table rows with processed data
        }
      } catch (error) {
        toast.dismiss()
        toast.error('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };    

    fetchData();
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const filteredRows = rows.filter((row) =>
    (row.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'update',
      headerName: '',
      width: 80,
      renderCell: () => (
        <IconButton size="small" color="primary">
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Users - Iris Therapy</title>
      </Helmet>
      <Box
        sx={{
          bgcolor: '#fff',
          p: 2,
          mb: 2,
          borderRadius: 1,
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          All Users
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Manage all users, including patients and therapists roles. Click on a user for detailed information.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToTherapists}
            sx={{
              px: 3,
              fontSize: '12px',
              '&:hover': { bgcolor: '#3f51b5' },
            }}
          >
            View Therapists
          </Button>
          <Button
            variant="contained"
            onClick={navigateToPatients}
            sx={{
              bgcolor: '#5C6BC0',
              px: 3,
              fontSize: '12px',
              '&:hover': { bgcolor: '#3f51b5' },
            }}
          >
            View Patients
          </Button>
        </Box>
      </Box>

      <Box sx={{ background: '#fff', p: 2, borderRadius: 1, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
        <Box
          sx={{ height: 500, width: '100%', overflow: 'auto' }}
          ref={tableRef}
        >
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <CircularProgress size={54} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            ) : (
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                onRowClick={(params) => handleRowClick(params.row)}
                sx={{ cursor: 'pointer', border: 0, background: '#fff' }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Modal for Detailed View */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="user-details-title"
        aria-describedby="user-details-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="user-details-title" variant="h6" component="h2">
              User Details
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>ID:</strong> {selectedUser.id}
              </Typography>
              <Typography>
                <strong>Username:</strong> {selectedUser.username}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography>
                <strong>First Name:</strong> {selectedUser.firstName}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {selectedUser.lastName}
              </Typography>
              <Typography>
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedUser.phone_number}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong> {selectedUser.dob}
              </Typography>
              <Typography>
                <strong>Medical History:</strong> {selectedUser.medicalHistory}
              </Typography>
              <Typography>
                <strong>Specialization:</strong> {selectedUser.specialization}
              </Typography>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => alert('Delete user functionality coming soon!')}
                >
                  Delete User
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
