import { useEffect } from 'react';
import Sidebar from '../components/patient/Sidebar';
import PatientDashboard from '../components/patient/PatientContent';
import AppointmentsContent from '../components/patient/AppointmentsContent';
import TherapistsContent from '../components/patient/TherapistsContent';
import ResourceContent from '../components/patient/ResourceContent'
import History from '../components/patient/History'
import Support from '../components/patient/Support'
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('publicToken');
    const user = localStorage.getItem('userData');

    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'patient') {
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
          <Route path="/" element={<PatientDashboard />} />
          <Route path="appointments" element={<AppointmentsContent />} /> 
          <Route path="therapists" element={<TherapistsContent />} /> 
          <Route path="resources" element={<ResourceContent />} />
          <Route path="session-history" element={<History />} />
          <Route path="support" element={<Support />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
