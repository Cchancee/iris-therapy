import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddTherapist from './AddTherapistForm'; 
import { toast } from 'react-toastify';
import { publicAxios } from '../axios/AxiosHeader';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';



export default function TherapistsContent() {
  const api = publicAxios();


  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [rows, setRows] = useState([]); // Dynamic rows from API
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleAddTherapistClick = () => {
    setShowAddTherapist(true);
  };

  const handleGoBack = () => {
    setShowAddTherapist(false);
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/therapists');
        if (response.status === 200) {
          // Assuming response.data is already a JSON array of user objects
          const data = response.data.map((user, index) => ({
            id: user.id || index + 1, // Ensure each user has a unique ID
            username: user.username,
            email: user.email,
            first_name: user.first_name || 'N/A',
            last_name: user.last_name || 'N/A', // Use last_name to match backend
            role: user.role || 'N/A',
            phone_number: user.phone_number || 'N/A',
            date_of_birth: user.date_of_birth || 'N/A', // Match backend field name
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

  const filteredRows = rows.filter((row) =>
    (row.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 }, // Updated to last_name
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
        <title>Therapists - Iris Therapy</title>
      </Helmet>
      {showAddTherapist ? (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={handleGoBack}
              sx={{ mr: 1, color: '#3f51b5' }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">Add Therapist</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontSize: 16, fontStyle: 'italic', px: 2 }}>
            Fill out the details below to add a new therapist to your team. Ensure all information is accurate to streamline onboarding and session management.
          </Typography>
          <AddTherapist
            onSubmit={async (data) => {
              try {
                // Sending POST request to create a new therapist
                const response = await api.post('/therapists', data);

                if (response.status === 201) {
                  toast.dismiss()
                  toast.success('Therapist added successfully!');

                  // Optionally, update the table with the new therapist
                  setRows((prevRows) => [
                    ...prevRows,
                    {
                      id: response.data.id,
                      username: response.data.username,
                      email: response.data.email,
                      first_name: response.data.firstName || 'N/A',
                      last_name: response.data.lastName || 'N/A',
                      role: response.data.role || 'N/A',
                      phone_number: response.data.phone_number || 'N/A',
                      date_of_birth: response.data.date_of_birth || 'N/A',
                      medicalHistory: response.data.medicalHistory || 'N/A',
                      specialization: response.data.specialization || 'N/A',
                    },
                  ]);
                } 
              } catch (error) {
                if (error.response?.data?.detail === "Email or phone number already in use") {
                  toast.dismiss();
                  toast.error(
                    error.response?.data?.message || 'Email already exists'
                  );
                  return;
                }
                toast.dismiss();
                toast.error(
                  error.response?.data?.message || 'Error adding therapist. Try again later!'
                );
                console.error('Error adding therapist:', error);
              } finally {
                // Close the form regardless of success/failure
                handleGoBack();
              }
            }}
          />

        </Box>
      ) : (
        <>
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
              Therapists
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Manage and Review All Available Therapists – View, Edit, and Update Details for a Better Patient Experience
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTherapistClick}
                sx={{
                  px: 3,
                  fontSize: '12px',
                  '&:hover': { bgcolor: '#3f51b5' },
                }}
              >
                Add New Therapist
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

            <Box sx={{ height: 500, width: '100%', overflow: 'auto' }}>
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
        </>
      )}

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
                <strong>phone_number:</strong> {selectedUser.phone_number}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong> {selectedUser.date_of_birth}
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
