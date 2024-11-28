import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';
import { FaUsers } from "react-icons/fa6";
import { FaHospitalUser } from "react-icons/fa";
import { RiPsychotherapyFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import { publicAxios } from '../axios/AxiosHeader';
import { Helmet } from 'react-helmet';


import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; // For navigation

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const chartData = [
  { name: 'Jan', y1: 44.33, y2: 15.39 },
  { name: 'Feb', y1: 11.05, y2: 21.78 },
  { name: 'Mar', y1: 17.52, y2: 28.63 },
  { name: 'Apr', y1: 19.6, y2: 32.51 },
  { name: 'May', y1: 35.18, y2: 14.46 },
  { name: 'Jun', y1: 4.33, y2: 14.65 },
  { name: 'Jul', y1: 37.63, y2: 30.97 },
  { name: 'Aug', y1: 23.13, y2: 44.07 },
  { name: 'Sep', y1: 32.18, y2: 48.42 },
  { name: 'Oct', y1: 12.02, y2: 5.50 },
  { name: 'Nov', y1: 36.62, y2: 41.85 },
  { name: 'Dec', y1: 45.14, y2: 18.13 },
];


const DashboardContent = () => {
  const api = publicAxios();


  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: null,
    therapists: null,
    patients: null,
    appointments: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, therapistsRes, patientsRes, appointmentsRes] = await Promise.all([
        api.get('/users'),
        api.get('/therapists'),
        api.get('/patients'),
        api.get('/session'),
      ]);
  
      setStats({
        totalUsers: usersRes.data.length,
        therapists: therapistsRes.data.length,
        patients: patientsRes.data.length,
        appointments: appointmentsRes.data.length,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);

  
  const StatCardContent = ({ title, value, icon }) => (
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" sx={{ fontSize: 14 }}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{ my: 1, fontSize: 22, fontWeight: 'bold', textAlign: 'left' }}
        >
          {value === null ? (
            <span>Loading...</span> // Replace with a spinner or skeleton
          ) : (
            value
          )}
        </Typography>
      </Box>
      {icon}
    </CardContent>
  );
  

  // Card click handlers
  const handleCardClick = (path) => {
    navigate(path); // Navigate to specified path
  };

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      <Helmet>
        <title>Admin - Iris Therapy</title>
      </Helmet>
      <Grid container spacing={3}>
        {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBase
              onClick={() => handleCardClick('manage-users')}
              sx={{ width: '100%', display: 'block' }}
            >
              <StatCard>
                <StatCardContent
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<FaUsers className="text-white bg-primary p-2 rounded-md text-[50px]" />}
                />
              </StatCard>
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBase
              onClick={() => handleCardClick('therapists')}
              sx={{ width: '100%', display: 'block' }}
            >
              <StatCard>
                <StatCardContent
                  title="Therapists"
                  value={stats.therapists}
                  icon={<FaHospitalUser className="text-white bg-primary p-2 rounded-md text-[50px]" />}
                />
              </StatCard>
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBase
              onClick={() => handleCardClick('patients')}
              sx={{ width: '100%', display: 'block' }}
            >
              <StatCard>
                <StatCardContent
                  title="Patients"
                  value={stats.patients}
                  icon={<RiPsychotherapyFill className="text-white bg-primary p-2 rounded-md text-[50px]" />}
                />
              </StatCard>
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBase
              onClick={() => handleCardClick('appointments')}
              sx={{ width: '100%', display: 'block' }}
            >
              <StatCard>
                <StatCardContent
                  title="Appointments"
                  value={stats.appointments}
                  icon={<FaCalendarAlt className="text-white bg-primary p-2 rounded-md text-[50px]" />}
                />
              </StatCard>
            </ButtonBase>
          </Grid>




        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Growth Chart</Typography>
              <Box sx={{ mt: 2, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="y1" fill="#8884d8" name="Patients" />
                    <Bar dataKey="y2" fill="#82ca9d" name="Therapists" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Activity</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">- User A signed up</Typography>
                <Typography variant="body1">- User B uploaded a report</Typography>
                <Typography variant="body1">- Admin updated settings</Typography>
                <Typography variant="body1">- Notification sent to User C</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;


