import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { publicAxios } from '../axios/AxiosHeader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthBg from '../assets/authBg.webp';
import { Helmet } from 'react-helmet';




export default function ResetPasswordPage() {
  const api = publicAxios();
  const navigate = useNavigate(); // Initialize navigate function

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const inputs = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPasswordVisibility = () => setConfirmShowPassword((prev) => !prev);

  
  // Handle OTP change (typing in each input box)
  const handleChange = (element, index) => {
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

  // Handle new password and confirm password changes
  const handlePasswordChange = (e, type) => {
    const value = e.target.value;
    if (type === "new") {
      setNewPassword(value);
    } else if (type === "confirm") {
      setConfirmPassword(value);
    }
    setPasswordError(false);
  };

  // Submit the OTP and new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.dismiss();
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    if (!newPassword) {
      setPasswordError(true);
      toast.dismiss();
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      toast.dismiss();
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/reset-password?otp_code=${otpCode}&new_password=${newPassword}`);
      if (response.status === 200) {
        localStorage.removeItem('otpSent'); // Clear flag when leaving page
        toast.dismiss();
        toast.success("Password reset successful! You can now log in.");
        navigate('/signin');
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

      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const otpSent = localStorage.getItem('otpSent');
    if (!otpSent) {
      navigate('/forgot-password'); // Redirect if otpSent is missing
    }
  }, [navigate]);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${AuthBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);


  return (
    <div className="h-screen bg-[#dce2f3ed] flex justify-center items-center">
      <Helmet>
        <title>Reset Password - Iris Therapy</title> {/* This changes the title dynamically */}
      </Helmet>
      <div className="bg-primary px-8 py-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>

        <form onSubmit={handleSubmit} className="">
          {/* OTP Input */}
          <p className="text-center text-xs text-gray-600 mb-6">Paste or type the 6-digit OTP in the fields below. The focus will move automatically as you type.</p>

          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste} // Handle paste event
                ref={(el) => (inputs.current[index] = el)}
                className="w-12 h-10 bg-transparent text-center text-lg border border-gray-500 rounded-md outline-gray-900 mx-1 focus:border-gray-900 focus:outline-none"
              />
            ))}
          </div>

          {/* New Password Input */}
          <p className="text-sm text-gray-600 mb-4">Enter your new password.</p>

          <TextField
            label="New Password"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => handlePasswordChange(e, "new")}
            error={passwordError}
            helperText={passwordError && "Password is required"}
            sx={{ marginBottom: '12px' }}
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

          {/* Confirm Password Input */}
          <TextField
            label="Confirm Password"
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handlePasswordChange(e, "confirm")}
            error={passwordError}
            helperText={passwordError && "Passwords must match"}
            sx={{ marginBottom: '12px' }}
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

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{ marginTop: '16px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
