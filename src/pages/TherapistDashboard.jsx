import { useEffect } from 'react';
import Sidebar from '../components/therapist/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TherapistContent from '../components/therapist/TherapistContent'
import History from '../components/therapist/History'
import PatientsContent from '../components/therapist/PatientsContent'
import Sessions from '../components/therapist/AppointmentsContent'
import Support from '../components/patient/Support'

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('publicToken');
    const user = localStorage.getItem('userData');

    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'therapist') {
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
          <Route path="/" element={<TherapistContent />} />
          <Route path="session-history" element={<History />} />
          <Route path="patients" element={<PatientsContent />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="support" element={<Support />} />
          </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
