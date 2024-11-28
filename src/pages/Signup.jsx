import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo-transp.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import AuthBg from '../assets/authBg.webp';
import { publicAxios } from '../axios/AxiosHeader';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';


export default function SignUpPage() {
  const api = publicAxios();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPasswordVisibility = () => setConfirmShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordTooShort = password.length < 8;
    const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isPasswordWeak = !passwordStrengthRegex.test(password);

    // Field Checks
    setEmailError(!email || !isEmailValid);
    setPasswordError(isPasswordTooShort || isPasswordWeak);
    setConfirmPasswordError(password !== confirmPassword);

    if (!email || !isEmailValid || isPasswordTooShort || isPasswordWeak || password !== confirmPassword) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/signup', { email, password });
      if (response.status === 200) {
        const userData = response.data.user;

        // Save token in local storage
        localStorage.setItem('publicToken', response.data.access_token);
        localStorage.setItem('userData', JSON.stringify(userData));


        toast.dismiss();
      }
    } catch (error) {
      if (error.response?.data.detail === "Email already registered") {
        toast.dismiss();
        toast.error('Email already registered');
      } else {
        toast.error('Something went wrong. Please try again later.');
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

  return (
    <div className="h-screen bg-[#dce2f3ed] flex justify-center items-center">
      <Helmet>
        <title>Sign Up - Iris Therapy</title> {/* This changes the title dynamically */}
      </Helmet>
      <div className="bg-primary px-8 py-4 rounded-lg w-full max-w-sm">
        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Sign Up</h2>
        <p className="text-center text-gray-700 text-sm mb-6">Create an account to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField 
              label="Email"
              type="email"
              sx={{ width: '100%' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? "Enter a valid email address" : ""}
            />
          </div>

          <div className="mb-4">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              sx={{ width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Password must be 8+ chars, include uppercase, number & symbol" : ""}
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

          <div className="mb-8">
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              sx={{ width: '100%' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Passwords do not match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Button
            variant="outlined"
            size="medium"
            type="submit"
            sx={{ width: '100%', mb: 2, color: '#082066', borderColor: '#0a36b2' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>
        
        {/* Sign In Link */}
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Already have an account? 
            <a href="/signin" className="text-blue-500 hover:underline"> Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
