import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { publicAxios } from '../../axios/AxiosHeader';
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';


export default function TherapistsPage() {
  const api = publicAxios();


  const [therapists, setTherapists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);

      try {
        const response = await api.get('/therapists');
        setTherapists(response.data); // Update with API response
      } catch (error) {
        console.error('Error fetching therapists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleRowClick = (therapist) => {
    setSelectedTherapist(therapist);
    setOpenModal(true);
  };

  // Filter rows based on name or specialization
  const filteredRows = therapists.filter(
    (therapist) =>
      therapist.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'specialization', headerName: 'Specialization', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
  ];

  return (
    <div>
      <Helmet>
        <title>Therapists - Iris Therapy</title>
      </Helmet>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: '#fff',
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Meet Our Therapists
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Explore our highly skilled professionals and find the right therapist for you.
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Name or Specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300, mt: 2 }}
        />
      </Box>

      {/* DataGrid Section */}
      <Box
        sx={{
          background: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredRows.length === 0 ? (
          <Typography variant="body1">No therapists found</Typography>
        ) : 
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            onRowClick={(params) => handleRowClick(params.row)}
            sx={{
              cursor: 'pointer',
              '& .MuiDataGrid-row:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
            getRowId={(row) => row.userID} // Ensure rows have a unique identifier
          />
        }
      </Box>

      {/* Modal for Therapist Details */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="therapist-details-title"
        aria-describedby="therapist-details-description"
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
            <Typography id="therapist-details-title" variant="h6">
              Therapist Details
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedTherapist && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Name:</strong> {selectedTherapist.first_name} {selectedTherapist.last_name}
              </Typography>
              <Typography>
                <strong>Specialization:</strong> {selectedTherapist.specialization}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedTherapist.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
