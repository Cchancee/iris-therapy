import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import AuthBg from '../assets/authBg.webp';
import { publicAxios } from '../axios/AxiosHeader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { Helmet } from 'react-helmet';


export default function ForgotPasswordPage() {
  const api = publicAxios();
  const navigate = useNavigate(); // Initialize navigate function

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);

    if (!email) {
      setEmailError(true);
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
      setEmailError(true);
      toast.dismiss();
      toast.error('Invalid email format');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      if (response.status === 200) {
        localStorage.setItem('otpSent', 'true'); 
        navigate('/reset-password');
        toast.dismiss();
        toast.success("Password reset code was sent to your email.");
      }
    } catch (error) {
      if (error.response?.data?.detail === "Invalid email format") {
        setEmailError(true);
        toast.dismiss();
        toast.error("Invalid email format");
        return;
      }

      if (error.response?.data?.detail === "User not found") {
        toast.dismiss();
        toast.error("User not found");
        return;
      }

      toast.dismiss();
      toast.error("An error occurred. Please try again later.");
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

  return (
    <div className="h-screen bg-[#dce2f3ed] flex justify-center items-center">
      <Helmet>
        <title>Forgot Password - Iris Therapy</title> {/* This changes the title dynamically */}
      </Helmet>
      <div className="bg-primary px-8 py-4 rounded-lg w-full max-w-sm relative">
        {/* Back button */}
        <IconButton
          onClick={() => navigate('/signin')} // Navigate to sign-in page
          style={{ position: 'relative', top: -10, left: -20, margin: '0px', marginBottom: '-15px' }}
          aria-label="Back to Sign In"
        >
          <ArrowBackIcon />
        </IconButton>

        <h2 className="text-2xl font-bold text-center mb-1">Forgot Password</h2>
        <p className="text-center text-gray-700 text-sm mb-1">
          Enter your email to receive a password reset code.
        </p>
        <p className="text-center text-gray-700 text-[10px] mb-6 px-6">
          You will receive an email with a six digit code, You can use this code to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              id="outlined-email"
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? "Email is required" : ""}
            />
          </div>

          <Button
            variant="outlined"
            size="medium"
            type="submit"
            sx={{ width: '100%', color: '#082066', borderColor: '#0a36b2', marginBottom: '10px' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Send Reset Code'}
          </Button>
        </form>
      </div>
    </div>
  );
}
