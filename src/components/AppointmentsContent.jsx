import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import { publicAxios } from '../axios/AxiosHeader';
import { Helmet } from 'react-helmet';


const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const AppointmentPage = () => {
  const api = publicAxios();


  const [events, setEvents] = useState([]);  // State for holding the fetched events
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [doctors, setDoctors] = useState([]); // Store all therapists
  const [specializations, setSpecializations] = useState([]); // Store all unique specializations
  const [newAppointment, setNewAppointment] = useState({
    reason: '',
    start: '',
    specialization: '',
    doctor: '',
  });

  // Retrieve user information from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Replace this URL with your actual backend endpoint
        const response = await api.get('/session');
    
        if (response.status === 200) {
          // Map the data to the correct format for the calendar
          const fetchedAppointments = response.data.map((appointment) => {
            const date = new Date(appointment.date);
            const timeParts = appointment.time.split(':');
            const start = new Date(date.setHours(timeParts[0], timeParts[1], timeParts[2]));
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Assume 1-hour session
    
            return {
              title: `Session for ${userData.first_name} ${userData.last_name}`,
              start,
              end,
              status: appointment.status,
              sessionID: appointment.sessionID,
              patientID: appointment.patientID,
              therapistID: appointment.therapistID,
            };
          });
    
          setEvents(fetchedAppointments);
        } else {
          console.error('Failed to fetch appointments');
          toast.dismiss();
          toast.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('An error occurred while fetching appointments');
      }
    };
    

    fetchAppointments();
  }, []);  


  // Fetch therapists when the modal opens
useEffect(() => {
  if (newAppointmentOpen) {
    const fetchTherapists = async () => {
      try {
        const response = await api.get('/therapists'); // Adjust endpoint as needed
        if (response.status === 200) {
          const therapists = response.data;

          // Extract unique specializations
          const uniqueSpecializations = [
            ...new Set(therapists.map((therapist) => therapist.specialization)),
          ];

          setDoctors(therapists); // Store fetched therapists
          setSpecializations(uniqueSpecializations); // Store specializations

        } else {
          toast.error('Failed to fetch therapists.');
        }
      } catch (error) {
        console.error('Error fetching therapists:', error);
        toast.error('An error occurred while fetching therapists.');
      }
    };

    fetchTherapists();
  }
}, [newAppointmentOpen]);


  const handleNewAppointmentOpen = () => setNewAppointmentOpen(true);

  const handleNewAppointmentClose = () => {
    setNewAppointmentOpen(false);
    setNewAppointment({
      reason: '',
      start: '',
      specialization: '',
      doctor: '',
    });
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the clicked event details
    setDetailsOpen(true); // Open the details modal
  };

  const handleNewAppointmentSubmit = async () => {
    const start = new Date(newAppointment.start);
  
    // Validate form fields
    if (!newAppointment.reason || !newAppointment.specialization || !newAppointment.doctor) {
      toast.dismiss();
      toast.error('Please fill all fields!');
      return;
    }
  
    if (isNaN(start.getTime())) {
      toast.dismiss();
      toast.error('Invalid start date and time!');
      return;
    }
  
    
    if (!userData) {
      toast.dismiss();
      toast.error('User information not found. Please log in again.');
      return;
    }
  
    const patientID = userData.userID;
    const therapistID = newAppointment.doctor;
  
    // Prepare data for the backend
    const appointmentData = {
      reason: newAppointment.reason,
      time: start.toISOString(),
      patientID,
      therapistID,
    };
    
    try {
      // API call to save the appointment
      const response = await api.post('/sessions', appointmentData);
  
      if (response.status === 200) {
        // Appointment successfully created
        const savedAppointment = response.data;
  
        // Map response to calendar format
        const newEvent = {
          title: `Session for ${userData.first_name}`,
          start: new Date(appointmentData.time),
          end: new Date(new Date(appointmentData.time).getTime() + 60 * 60 * 1000), // 1-hour session
        };
  
        // Update calendar events
        setEvents((prevEvents) => [...prevEvents, newEvent]);
  
        toast.success('Appointment created successfully!');
        handleNewAppointmentClose(); // Close the modal
      } else {
        toast.dismiss();
        toast.error('Failed to create the appointment.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.dismiss();
      toast.error('An error occurred while creating the appointment.');
    }
  };
  
  

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <Helmet>
        <title>Appointments - Iris Therapy</title>
      </Helmet>

      <div className="bg-white p-4 mb-2 rounded-md">
        <Typography variant="h4" gutterBottom sx={{ fontSize: '28px', fontWeight: 'bold' }}>
          Appointment Calendar
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3, fontSize: '16px' }}>
          Schedule and manage all therapy sessions.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNewAppointmentOpen}
          sx={{
            marginBottom: 1,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AddIcon sx={{ marginRight: 1, fontSize: 20 }} />
          New Appointment
        </Button>
      </div>

      <Box
        sx={{
          bgcolor: '#fff',
          padding: 2,
          borderRadius: 2,
          height: isMobile ? 400 : 500,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          views={['month', 'week', 'day']}
          onSelectEvent={handleEventClick} // Handle clicking on an event
          selectable
        />
      </Box>

      {/* Modal for Session Details */}
      <Dialog open={detailsOpen} onClose={handleDetailsClose}>
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="body2">
                Start: {format(selectedEvent.start, 'yyyy-MM-dd HH:mm')}
              </Typography>
              <Typography variant="body2">
                End: {format(selectedEvent.end, 'yyyy-MM-dd HH:mm')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for New Appointment */}
      <Dialog open={newAppointmentOpen} onClose={handleNewAppointmentClose}>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Reason for Appointment"
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={newAppointment.start}
              onChange={(e) => setNewAppointment({ ...newAppointment, start: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Specialization</InputLabel>
              <Select
                value={newAppointment.specialization}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    specialization: e.target.value,
                    doctor: '', // Reset doctor if specialization changes
                  })
                }
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!newAppointment.specialization}>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={newAppointment.doctor}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, doctor: e.target.value })
                }
              >
                {newAppointment.specialization &&
                  doctors
                    .filter((doc) => doc.specialization === newAppointment.specialization)
                    .map((doc) => (
                      <MenuItem key={doc.id} value={doc.userID}>
                        {`${doc.first_name} ${doc.last_name}`}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewAppointmentClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleNewAppointmentSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AppointmentPage;
