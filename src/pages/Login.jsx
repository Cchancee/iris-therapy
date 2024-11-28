import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/logo-transp.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AuthBg from '../assets/authBg.webp';
import CircularProgress from '@mui/material/CircularProgress';
import { publicAxios } from '../axios/AxiosHeader';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom'; 
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';



export default function LoginPage() {
  const api = publicAxios();

  const navigate = useNavigate(); // Initialize navigate function


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false); // Email error state
  const [passwordError, setPasswordError] = useState(false); // Password error state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const inputs = useRef([]);

  // redirect to dashboard when user is logged in
  useEffect(() => {
    const token = localStorage.getItem('publicToken');
    const user = localStorage.getItem('userData');

    if (token) {
      const userData = JSON.parse(user);
      if (userData.role == 'patient') {
        navigate('/patient');
      }
      else if (userData.role == 'admin') {
        navigate('/admin')
      }
      else {
        navigate('/therapist')
      }
    }

  }, [navigate]);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error states
    setEmailError(false);
    setPasswordError(false);

    // Check if fields are empty and set error state if they are
    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
      setEmailError(true);
      toast.dismiss();
      toast.error('Invalid email format');
      setIsLoading(false);
      return;
    }

    // Only proceed with API call if both fields are filled
    if (!email || !password) {
      toast.dismiss();
      toast.error('Please fill in both fields.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      if (response.status === 200) {
        toast.dismiss();

        // send OTP to the email
        setIsOtpModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data.detail === "Invalid credentials") {
        toast.dismiss();
        toast.error('Username or password is incorrect');
      } else {
        console.log(error);
        toast.dismiss();
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${AuthBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  const handleOtpChange = (element, index) => {
    const value = element.value;
    const otpArray = [...otp];

    if (value.length === 1) {
      otpArray[index] = value;
      setOtp(otpArray);
      if (index < 5) {
        inputs.current[index + 1].focus();  // Move focus to next input
      }
    }
  };

  // Handle OTP paste event
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6); // Limit to 6 characters
    const otpArray = pasteData.split('');
    otpArray.forEach((digit, index) => {
      inputs.current[index].value = digit;
    });
    setOtp(otpArray);
    inputs.current[otpArray.length - 1].focus(); // Focus on the last filled box
  };

  // Handle backspace to move focus to the previous input
  const handleKeyDown = (element, index) => {
    if (element.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1].focus();  // Move focus to previous input
      }
      const newOtp = [...otp];
      newOtp[index] = '';  // Clear the current box
      setOtp(newOtp);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.dismiss();
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    
    setOtpLoading(true);

    

    try {
      const response = await api.post(`/verify-login-otp?otp_code=${otpCode}`);
      if (response.status === 200) {
        const userData = response.data.user;
        // Save token in local storage
        localStorage.setItem('publicToken', response.data.access_token);
        localStorage.setItem('userData', JSON.stringify(userData));

        const roleRedirects = {
          admin: '/admin',
          therapist: '/therapist',
          patient: '/patient',
        };
    
        const redirectUrl = roleRedirects[userData?.role] || '/signin'; // Default fallback

        navigate(redirectUrl);
        toast.dismiss();

        // clear otpArray
        setOtp(['', '', '', '', '', '']);
        setIsOtpModalOpen(false);
        
      }
    } catch (error) {
      if (error.response?.data?.detail == "Invalid OTP code") {
        toast.dismiss();  
        toast.error("The OTP code is incorrect.");
        return
      }

      if (error.response?.data?.detail == "OTP has expired") {
        toast.dismiss();
        toast.error("The OTP code has expired. Please request a new one.");
        return
      }

      if (error.response?.data?.detail == "OTP has already been used") {
        toast.dismiss();
        toast.error("The OTP code has already been used. Please request a new one.");
        return
      }

      console.log(error);
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#dce2f3ed] flex justify-center items-center">
      <Helmet>
        <title>Sign In - Iris Therapy</title>
      </Helmet>
      <div className="bg-primary px-8 py-4 rounded-lg w-full max-w-sm">
        <div className="flex justify-center">
          <img
            src={Logo} 
            alt="Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
        <p className="text-center text-gray-700 text-sm mb-6">Welcome, please sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField 
              id="outlined-required" 
              label="Email" 
              sx={{ width: '100%' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError} // Show error if emailError state is true
              helperText={emailError ? "Enter a valid email address" : ""} // Helper text when error is true
            />
          </div>

          <div className="mb-8">
            <TextField
              id="outlined-password-input"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              sx={{ width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError} // Show error if passwordError state is true
              helperText={passwordError ? "Password is required" : ""} // Helper text when error is true
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div>
            <Button 
              variant="outlined" 
              size="medium"
              type="submit"
              sx={{ width: '100%', mb: 2, color: '#082066', borderColor: '#0a36b2' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <div className="-mt-2">
              <Link to="/forgot-password">
                <span className="text-sm text-blue-500 hover:underline">Forgot Password?</span>
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Don't have an account? 
            <a href="/signup" className="text-blue-500 hover:underline"> Sign Up</a>
          </p>
        </div>

        {/* OTP Modal */}
        <Modal open={isOtpModalOpen}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              maxWidth: '400px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              outline: 'none',
              boxShadow: 24,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <h3 className="text-2xl font-bold text-center mb-4">Enter OTP</h3>
            <p className="text-center text-gray-600 mb-6">Please enter the 6-digit OTP sent to your email.</p>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`otp-input-${index}`}
                  maxLength="1"
                  value={digit}
                  // onChange={(e) => handleOtpChange(e.target.value, index)}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste} // Handle paste event
                  ref={(el) => (inputs.current[index] = el)}
                  className="otp-input text-center text-2xl font-semibold rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f9fafb',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              ))}
            </div>

            <Button
              onClick={handleOtpSubmit}
              variant="contained"
              sx={{
                width: '100%',
                color: '#ffffff',
                padding: '12px 0',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#082066' },
              }}
              disabled={otpLoading}
            >
              {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>
          </Box>
        </Modal>


      </div>
    </div>
  );
}
