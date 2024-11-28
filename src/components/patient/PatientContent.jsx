import React, {useState, useEffect} from 'react';
import { Box, Grid, Card, CardContent, Typography, ButtonBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { FaCalendarAlt } from 'react-icons/fa';
import { RiPsychotherapyFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; // For navigation
import { toast } from 'react-toastify'; // Import Toastify
import { publicAxios } from '../../axios/AxiosHeader';
import { CircularProgress } from '@mui/material';



const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const DashboardContent = () => {
  const api = publicAxios();


  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([])

  // Inside your component
  const [isLoading, setIsLoading] = useState(true);

  // Card click handlers
  const handleCardClick = (path) => {
    navigate(path); // Navigate to specified path
  };

  // Retrieve user information from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));


  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);

      try {
        const response = await api.get('/session');
        if (response.status === 200) {
          const userID = userData?.userID; // Get the logged-in user's ID
  
          // Map and filter sessions to include only those for the logged-in user
          const fetchedAppointments = response.data
            .filter((appointment) => appointment.patientID === userID) // Only include the user's sessions
            .map((appointment) => {
              // Format date and time for display
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }).format(new Date(appointment.date));
  
              const formattedTime = appointment.time.slice(0, 5); // Extract HH:MM from time
  
              return {
                sessionID: appointment.sessionID,
                reason: appointment.reason,
                date: formattedDate,
                time: formattedTime,
              };
            });
  
          setAppointments(fetchedAppointments);
        } else {
          console.error('Failed to fetch appointments');
          toast.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('An error occurred while fetching appointments');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAppointments();
  }, []);
  


  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6}>
          <ButtonBase
            onClick={() => handleCardClick('appointments')} // Navigate to appointments page
            sx={{ width: '100%', display: 'block' }}
          >
            <StatCard sx={{ mx: 1 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <FaCalendarAlt className="text-white bg-primary p-2 rounded-md text-[50px]" />
                <Typography variant="h6" sx={{ fontSize: 18, mt: 2 }}>
                  Book Appointment
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                    Easily manage and book appointments with our therapists.
                    </Typography>
              </CardContent>
            </StatCard>
          </ButtonBase>
        </Grid>

        <Grid item xs={12} sm={6}>
          <ButtonBase
            onClick={() => handleCardClick('therapists')} // Navigate to patients page
            sx={{ width: '100%', display: 'block' }}
          >
            <StatCard>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <RiPsychotherapyFill className="text-white bg-primary p-2 rounded-md text-[50px]" />
                <Typography variant="h6" sx={{ fontSize: 18, mt: 2 }}>
                  View Therapists
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                    Browse and manage our team of professional therapists.
                  </Typography>
              </CardContent>
            </StatCard>
          </ButtonBase>
        </Grid>

        {/* Tables for Appointments and Therapists in the next row */}
        <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6">Upcoming Appointments</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reason</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <TableRow key={appointment.sessionID}>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No appointments available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <ButtonBase
                onClick={() => handleCardClick('appointments')}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  px: 3,
                  py: 0.8,
                  borderRadius: 1,
                  textAlign: 'center',
                  fontSize: '13px',
                }}
              >
                View All Appointments
              </ButtonBase>
            </Box>
          </CardContent>
        </Card>

        </Grid>

        <Grid item xs={12} md={4}>
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Useful Resources
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ButtonBase
          onClick={() => window.open('https://www.psychologytoday.com/us/therapists', '_blank')}
          sx={{
            display: 'block',
            textAlign: 'left',
            p: 1,
            borderRadius: 1,
            // bgcolor: '#8FA5FF',  // Custom secondary color
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#8FA5FF',  // Maintain the same color on hover
              color: '#fff',
            },
          }}
        >
          <Typography variant="body1">Find a Therapist</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => window.open('https://www.nami.org/Home', '_blank')}
          sx={{
            display: 'block',
            textAlign: 'left',
            p: 1,
            borderRadius: 1,
            // bgcolor: '#8FA5FF',  // Custom secondary color
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#8FA5FF',  // Maintain the same color on hover
              color: '#fff',
            },
          }}
        >
          <Typography variant="body1">National Alliance on Mental Illness (NAMI)</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => window.open('https://www.cdc.gov/mentalhealth/', '_blank')}
          sx={{
            display: 'block',
            textAlign: 'left',
            p: 1,
            borderRadius: 1,
            // bgcolor: '#8FA5FF',  // Custom secondary color
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#8FA5FF',  // Maintain the same color on hover
              color: '#fff',
            },
          }}
        >
          <Typography variant="body1">Mental Health Resources by CDC</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => window.open('https://www.mentalhealth.gov/', '_blank')}
          sx={{
            display: 'block',
            textAlign: 'left',
            p: 1,
            borderRadius: 1,
            // bgcolor: '#8FA5FF',  // Custom secondary color
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#8FA5FF',  // Maintain the same color on hover
              color: '#fff',
            },
          }}
        >
          <Typography variant="body1">MentalHealth.gov</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => window.open('https://www.samhsa.gov/find-help/national-helpline', '_blank')}
          sx={{
            display: 'block',
            textAlign: 'left',
            p: 1,
            borderRadius: 1,
            // bgcolor: '#8FA5FF',  // Custom secondary color
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#8FA5FF',  // Maintain the same color on hover
              color: '#fff',
            },
          }}
        >
          <Typography variant="body1">SAMHSA National Helpline</Typography>
        </ButtonBase>
      </Box>
    </CardContent>
  </Card>
</Grid>

      </Grid>
    </Box>
  );
};

export default DashboardContent;
