import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import ManageUsersContent from '../components/ManageUsersContent';
import TherapistsContent from '../components/TherapistsContent';
import PatientsContent from '../components/PatientsContent';
import AppointmentsContent from '../components/AppointmentsContent';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('publicToken');
    const user = localStorage.getItem('userData');

    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        navigate('/signin');
      }
    }

    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <div
      className="w-screen h-screen flex bg-[#dce2f3ed] pt-12">
      <Sidebar />
      <div
        className="flex-1 p-4 overflow-x-hidden"
        style={{
          maxWidth: '100vw', // Prevent content from going beyond viewport
          boxSizing: 'border-box',
        }}
      >
        {/* Render content based on the route */}
        <Routes>
          <Route path="/" element={<DashboardContent />} /> {/* Dashboard */}
          <Route
            path="manage-users"
            element={
              <ManageUsersContent
                navigateToTherapists={() => navigate('/admin/therapists')}
                navigateToPatients={() => navigate('/admin/patients')}
              />
            }
          />
          <Route path="therapists" element={<TherapistsContent />} />
          <Route path="patients" element={<PatientsContent />} />
          <Route path="appointments" element={<AppointmentsContent />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
