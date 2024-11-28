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


export default function SessionHistoryPage() {
  const api = publicAxios();


  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(null)
  const [appointments, setAppointments] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
    
      try {
        // Get the logged-in user's ID
        const loggedInPatient = localStorage.getItem('userData');
        const loggedInPatientData = JSON.parse(loggedInPatient)
        const loggedInPatientID = loggedInPatientData.userID
  
        // Fetch sessions
        const sessionsResponse = await api.get('/session');
        const sessionsData = sessionsResponse.data;
  
        // Filter sessions for the logged-in patient
        const userSessions = sessionsData.filter(
          (session) => session.patientID === loggedInPatientID
        );
  
        // Fetch therapists
        const therapistsResponse = await api.get('/therapists');
        const therapistsData = therapistsResponse.data;
  
        // Map therapist details to sessions
        const enrichedSessions = userSessions.map((session) => {
          const therapist = therapistsData.find(
            (t) => t.userID === session.therapistID
          );
        
          // Format the date (YYYY-MM-DD)
          const formattedDate = new Date(session.date).toISOString().split('T')[0];
        
          // Format the time (HH:mm AM/PM)
          const formattedTime = new Date(session.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        
          // Create a dynamic title
        
          return {
            ...session,
            date: formattedDate,
            time: formattedTime,
            therapistName: therapist
              ? `${therapist.first_name} ${therapist.last_name}`
              : 'Unknown Therapist',
            specialization: therapist ? therapist.specialization : 'Unknown',
          };
        });
        
        
  
        setAppointments(enrichedSessions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleRowClick = (session) => {
    setSelectedSession(session);
    setOpenModal(true);
  };

  // Filter rows based on date, therapist name, or status
  const filteredRows = appointments.filter(
    (session) =>
      session.date.includes(searchQuery) ||
      session.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'time', headerName: 'Time', width: 200 },
    { field: 'therapistName', headerName: 'Therapist Name', width: 200 },
    { field: 'specialization', headerName: 'Specialization', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
  ];

  return (
    <div>
      <Helmet>
        <title>Appointments - Iris Therapy</title>
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
          Session History
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Track your past and upcoming therapy sessions.
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Date, Therapist, or Status..."
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
          <Typography variant="body1" sx={{ textAlign: 'center' }}>The History is empty</Typography>
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
          getRowId={(row) => row.sessionID}
        />
      }
      </Box>

      {/* Modal for Session Details */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="session-details-title"
        aria-describedby="session-details-description"
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
            <Typography id="session-details-title" variant="h6">
              Session Details
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedSession && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Date:</strong> {selectedSession.date}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedSession.time}
              </Typography>
              <Typography>
                <strong>Therapist:</strong> {selectedSession.therapistName}
              </Typography>
              <Typography>
                <strong>Specialization:</strong> {selectedSession.specialization}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedSession.status}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Notes:</strong> {selectedSession.notes}
              </Typography>
            </Box>
          )}

        </Box>
      </Modal>
    </div>
  );
}
