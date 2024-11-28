
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext';


// pages or components
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Onboarding from './pages/Onboarding'
import AdminDashboard from './pages/AdminDashboard'
import PatientDashboard from './pages/PatientDashboard'
import TherapistDashboard from './pages/TherapistDashboard'


function App() {

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={20000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
      />

      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Onboarding />} />
              {/* Admin pages  */}
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* Patient pages  */}
              <Route path="/patient/*" element={<PatientDashboard />} />

              {/* Therapist pages  */}
              <Route path="/therapist/*" element={<TherapistDashboard />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
