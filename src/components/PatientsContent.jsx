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
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { publicAxios } from '../axios/AxiosHeader';

export default function PatientsContent() {
  const api = publicAxios();


  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);  // State for loading
  const [rows, setRows] = useState([]); // Dynamic rows from API
  const tableRef = useRef(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/patients');
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
  
    const rows = filteredRows;
    const columns = [
      { field: 'id', headerName: 'ID' },
      { field: 'username', headerName: 'Username' },
      { field: 'firstName', headerName: 'First Name' },
      { field: 'lastName', headerName: 'Last Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'role', headerName: 'Role' },
    ];
  
    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            ${columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">${col.headerName}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${columns.map(col => `
                <td style="border: 1px solid #ddd; padding: 8px; background-color: #fafafa; text-align: left;">${row[col.field]}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            td { background-color: #fafafa; }
          </style>
        </head>
        <body>
          <h1>Patient Table</h1>
          ${tableHTML}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
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
        <title>Patients - Iris Therapy</title>
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
          Patients
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Manage and Monitor Patient Information – Access, Edit, and Track Health Records for Optimal Care
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            sx={{
              px: 3,
              fontSize: '12px',
              '&:hover': { bgcolor: '#3f51b5' },
            }}
          >
            Export Patient Data
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

        <Box sx={{ height: 500, width: '100%', overflow: 'auto' }} ref={tableRef}>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (  // Show loader while fetching data
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
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
