import React, { useState, useEffect } from 'react';
import { publicAxios } from '../../axios/AxiosHeader';
import { Helmet } from 'react-helmet';
import { Box, Typography, Modal, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import the pen icon

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const handleEditClick = (appointment) => {
  setSelectedAppointment(appointment); // Set the selected appointment
  setOpenModal(true); // Open the modal
};

const appointmentColumns = [
  { field: 'reason', headerName: 'Reason', width: 150 },
  { field: 'patientName', headerName: 'Patient', width: 200 },
  { field: 'time', headerName: 'Time', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  {
    field: 'edit',
    headerName: 'Edit',
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <IconButton
        onClick={() => handleEditClick(params.row)} // Open modal with row details
        color="primary"
      >
        <EditIcon />
      </IconButton>
    ),
  },
];

const AppointmentPage = () => {
  const api = publicAxios();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const therapistID = JSON.parse(localStorage.getItem('userData'))?.userID;
        if (!therapistID) {
          toast.dismiss()
          toast.error('Therapist ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const [sessionsResponse, patientsResponse] = await Promise.all([
          api.get('/session'),
          api.get('/patients'),
        ]);

        if (sessionsResponse.status === 200 && patientsResponse.status === 200) {
          const filteredAppointments = sessionsResponse.data.filter(
            (appointment) => appointment.therapistID === therapistID
          );

          const patientsMap = {};
          patientsResponse.data.forEach((patient) => {
            patientsMap[patient.userID] = `${patient.first_name} ${patient.last_name}`;
          });

          const formattedAppointments = filteredAppointments.map((appointment) => ({
            id: appointment.sessionID,
            title: `${appointment.reason} - ${patientsMap[appointment.patientID] || 'Unknown Patient'}`,
            reason: appointment.reason,
            patientName: patientsMap[appointment.patientID] || 'Unknown Patient',
            time: new Date(appointment.date).toLocaleString('en-US', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
            status: appointment.status,
            description: appointment.description,
            start: new Date(appointment.date),
            end: new Date(new Date(appointment.date).getTime() + 60 * 60 * 1000), // Add 1 hour
          }));
          

          setAppointments(formattedAppointments);
          setEvents(formattedAppointments);
          setPatients(patientsResponse.data);
        } else {
          toast.error('Failed to fetch data.');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <Helmet>
        <title>Appointments - Iris Therapy</title>
      </Helmet>
      <Box className="bg-white p-4 mb-2 rounded-md">
        <Typography variant="h4" gutterBottom sx={{ fontSize: '28px', fontWeight: 'bold' }}>
          Appointment Calendar
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3, fontSize: '16px' }}>
          Manage all your therapy sessions.
        </Typography>
      </Box>

      <Box
        sx={{
          background: '#fff',
          p: 3,
          my: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Your Appointments
        </Typography>

        {loading ? (
          <CircularProgress size={54} sx={{ display: 'block', margin: '0 auto' }} />
        ) : appointments.length === 0 ? (
          <Typography sx={{ textAlign: 'center', my: 2 }}>No appointments found.</Typography>
        ) : (
          <DataGrid
            rows={appointments}
            columns={appointmentColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={(params) => handleAppointmentClick(params.row)}
            sx={{
              cursor: 'pointer',
              '& .MuiDataGrid-row:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          bgcolor: '#fff',
          padding: 2,
          borderRadius: 2,
          height: isMobile ? 400 : 500,
          overflow: 'hidden',
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          views={['month', 'week', 'day']}
          onSelectEvent={handleAppointmentClick}
          selectable
        />
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="appointment-details-title"
        aria-describedby="appointment-details-description"
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
            <Typography id="appointment-details-title" variant="h6">
              Update Appointment Status
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Patient:</strong> {selectedAppointment.patientName}
              </Typography>
              <Typography>
                <strong>Reason:</strong> {selectedAppointment.reason}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  <strong>Status:</strong>
                </Typography>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) =>
                    setSelectedAppointment((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <button
                  onClick={async () => {
                    try {
                      console.log(selectedAppointment.id, selectedAppointment.status)
                      // Send updated status to backend
                      await api.patch(`/session/${selectedAppointment.id}`, {
                        status: selectedAppointment.status,
                      });
                      toast.success('Status updated successfully!');
                      setAppointments((prev) =>
                        prev.map((appt) =>
                          appt.id === selectedAppointment.id
                            ? { ...appt, status: selectedAppointment.status }
                            : appt
                        )
                      );
                      setOpenModal(false);
                    } catch (error) {
                      console.error('Error updating status:', error);
                      toast.error('Failed to update status.');
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

    </Box>
  );
};

export default AppointmentPage;
