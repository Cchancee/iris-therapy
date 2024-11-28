import React from 'react';
import { Box, Grid, Card, CardContent, Typography, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';
import { FaCalendarAlt } from 'react-icons/fa';
import { RiPsychotherapyFill } from 'react-icons/ri';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; // For navigation

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const sessionData = [
  { name: 'Jan', sessions: 40 },
  { name: 'Feb', sessions: 50 },
  { name: 'Mar', sessions: 60 },
  { name: 'Apr', sessions: 70 },
  { name: 'May', sessions: 80 },
  { name: 'Jun', sessions: 90 },
  { name: 'Jul', sessions: 100 },
  { name: 'Aug', sessions: 110 },
  { name: 'Sep', sessions: 120 },
  { name: 'Oct', sessions: 130 },
  { name: 'Nov', sessions: 140 },
  { name: 'Dec', sessions: 150 },
];

const DashboardContent = () => {
  const navigate = useNavigate();

  // Card click handlers
  const handleCardClick = (path) => {
    navigate(path); // Navigate to specified path
  };

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
                  Manage Sessions
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Manage your upcoming sessions and appointments with patients.
                </Typography>
              </CardContent>
            </StatCard>
          </ButtonBase>
        </Grid>

        <Grid item xs={12} sm={6}>
          <ButtonBase
            onClick={() => handleCardClick('patients')} // Navigate to patients page
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
                  View Patients
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  View and manage your patients' details and progress.
                </Typography>
              </CardContent>
            </StatCard>
          </ButtonBase>
        </Grid>

        {/* Area Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Session Trends Over Time</Typography>
              <Box sx={{ mt: 2, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sessionData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sessions" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
  <Card>
    <CardContent>
      <Typography variant="h6">Summary</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Upcoming Appointments:</strong> 5 sessions scheduled this week.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Average Rating:</strong> 4.5/5 from last 10 sessions.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>New Patient Feedback:</strong> 3 positive reviews, 1 neutral.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Session Completion Rate:</strong> 92% (7 out of 8 completed).
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Grid>

      </Grid>
    </Box>
  );
};

export default DashboardContent;
