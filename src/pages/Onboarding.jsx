import React, { useState, useEffect } from 'react';
import { Button, TextField, Stepper, Step, StepLabel, Avatar, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AuthBg from '../assets/authBg.webp';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { publicAxios } from '../axios/AxiosHeader';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const steps = ['Username', 'Full Name', 'Date of Birth', 'Phone Number', 'Profile Picture', 'Verify & Submit'];
const stepSubtitles = [
  'Choose a unique username that will serve as your identity on this platform. Ensure it reflects your personality!',
  'Enter your first and last name. This helps us personalize your experience and address you properly.',
  'Provide your date of birth. This information is crucial for tailoring services that suit your needs.',
  'Share your phone number so we can stay connected and keep you updated.',
  'Upload a profile picture to make your profile stand out. It helps others recognize you!',
  'Review all the information you provided and confirm. This is your final step before submission!',
];


const OnboardingForm = () => {
  const api = publicAxios();
  const [userId, setUserId] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    profile_picture: null,
    agreeToTerms: false, // Add this to track if the user agrees to terms
  });
  const [errors, setErrors] = useState({ phone: '' });
  const [isLoading, setIsLoading] = useState(false);



  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    const id = user?.userID;
  
    if (!id) {
      navigate('/signin'); // Redirect if userId is not found
    } else {
      setUserId(id); // Save userId to state
    }

    if (user) {
      if (user.is_verified) {
        if (user.role === 'patient') {
          navigate('/patient');
        }
        else if (user.role === 'therapist') {
          navigate('/therapist/dashboard');
        }
        else if (user.role === 'admin') {
          navigate('/admin');
        }
      }
    }
  }, [navigate]);

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone_number: phone }));

    // Manually validate phone number if needed
    if (phone && !phone.startsWith('+')) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter a valid phone number with country code' }));
    } else {
      setErrors((prev) => ({ ...prev, phone: '' })); // Clear error if valid
    }
  };

  const handleNext = () => {
    let hasError = false; // Flag to track if there's any validation error
  
    // Username validation (Step 0)
    if (activeStep === 0 && !formData.username.trim()) {
      toast.dismiss();
      toast.error('Username is required!');
      hasError = true;
    }
  
    // Full Name validation (Step 1)
    if (activeStep === 1) {
      if (!formData.first_name.trim()) {
        toast.dismiss();
        toast.error('First Name is required!');
        hasError = true;
      }
      if (!formData.last_name.trim()) {
        toast.dismiss();
        toast.error('Last Name is required!');
        hasError = true;
      }
    }
  
    // Date of Birth validation (Step 2)
    if (activeStep === 2 && !formData.date_of_birth) {
      toast.dismiss();
      toast.error('Date of Birth is required!');
      hasError = true;
    }
  
    // Phone Number validation (Step 3)
    if (activeStep === 3) {
      if (!formData.phone_number || formData.phone_number.length < 10) {
        setErrors((prev) => ({
          ...prev,
          phone: 'Enter a valid phone number!',
        }));
        hasError = true;
      } else {
        setErrors((prev) => ({ ...prev, phone: '' })); // Clear any existing phone error
      }
    }
  
    // If there's any error, prevent moving to the next step
    if (hasError) {
      return;
    }
  
    // Proceed to the next step if no errors
    if (activeStep === steps.length - 1) {
      handleFinish();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };
  

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profile_picture: e.target.files[0],
    }));
  };

  const handleFinish = async () => {
    const data = new FormData();

    data.append('username', formData.username);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('phone_number', formData.phone_number);
    data.append('date_of_birth', new Date(formData.date_of_birth).toISOString());

     // Append file (only if selected)
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }

    if (!formData.agreeToTerms) {
      alert("You must agree to the terms and conditions to proceed.");
      return;
    }

    setIsLoading(true);
    
    // Handle finishing the onboarding (save data, redirect, etc.)
    try {
      const response = await api.patch(`/users/${userId}?username=${formData.username}&first_name=${formData.first_name}&last_name=${formData.last_name}&phone_number=${formData.phone_number}&profile_picture=${formData.profile_picture}&date_of_birth=${formData.date_of_birth}`);
      if (response.status === 200) {
        toast.dismiss();

        const userData = localStorage.getItem('userData', JSON.stringify(response.data.user));
        
        const roleRedirects = {
          admin: '/admin',
          therapist: '/therapist',
          patient: '/patient',
        };
    
        const redirectUrl = roleRedirects[userData?.role] || '/signin'; // Default fallback

        navigate(redirectUrl);
        toast.dismiss();
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
    // navigate('/dashboard'); // Redirect to another page, if needed
  };

  

  useEffect(() => {
    document.body.style.backgroundImage = `url(${AuthBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#dce2f3ed]">
      <div className="w-full sm:max-w-[100%] md:max-w-[50%] px-5 text-center">
        <div className="mx-auto sm:w-full lg:w-2/3">
          <h1 className="text-xl md:text-2xl font-bold mb-3 text-textColor">Welcome to IRIS Therapy</h1>
          <p className="text-sm text-gray-600 px-12">Let’s get to know you a little better!</p>
          <p className="text-sm text-gray-600 mb-10 px-12">Complete the steps below to set up your profile.</p>
        </div>

        <div className="bg-primary w-full p-5 rounded-lg shadow-lg">
          <div>
            {/* <h1 className="text-lg text-left font-bold mb-6 text-textColor">Fill in your profile</h1> */}
          </div>
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Section: Stepper */}
            <div className="left">
              <Stepper activeStep={activeStep} orientation={isSmallScreen ? 'horizontal' : 'vertical'}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{isSmallScreen ? null : label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            {/* Right Section: Step Content */}
            <div className="right flex-1 flex flex-col md:px-12 relative">
              {/* Step Header */}
              <h2 className="text-xl font-semibold text-textColor mb-4">{steps[activeStep]}</h2>
              <p className="text-gray-600 mb-6">{stepSubtitles[activeStep]}</p>

              {/* Step Content */}
              <div className='flex-grow'>
                {activeStep === 0 && (
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                )}
                {activeStep === 1 && (
                  <>
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  </>
                )}
                {activeStep === 2 && (
                  <TextField
                    label="Date of Birth"
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                {activeStep === 3 && (
                  <div className="mb-4">
                  <PhoneInput
                    country={'rw'} // Default country (Rwanda)
                    value={formData.phone_number}
                    onChange={handlePhoneChange}
                    inputStyle={{
                      width: '100%',
                      height: '56px',
                      borderColor: errors.phone ? '#f44336' : '#ccc', // Red border for errors
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>} {/* Display error below input */}
                </div>
                )}
                {activeStep === 4 && (
                  <div className="flex flex-col items-center">
                    {formData.profile_picture ? (
                      
                      <Avatar
                        src={URL.createObjectURL(formData.profile_picture)}
                        sx={{ width: 100, height: 100 }}
                      />
                    ) : (
                      // <Avatar sx={{ width: 100, height: 100, bgcolor: 'gray' }}>?</Avatar>
                      <Avatar src="/broken-image.jpg" sx={{ width: 100, height: 100 }} />
                    )}

                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 2 }}
                    >
                      Upload files
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleProfilePicChange}
                        multiple
                      />
                    </Button>
                  </div>
                )}
              </div>
              {activeStep === 5 && (
                  <div className="bg-secondary p-4 rounded-md">
                    <h3 className="font-semibold text-lg">Terms and Conditions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      By continuing, you agree to our Terms and Conditions. You must agree to the terms to proceed with the registration process.
                    </p>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms-checkbox"
                        checked={formData.agreeToTerms}
                        onChange={() => setFormData((prev) => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                      />
                      <label htmlFor="terms-checkbox" className="ml-2 text-sm">
                        I agree to the Terms and Conditions
                      </label>
                    </div>
                    {!formData.agreeToTerms && (
                      <p className="text-red-500 text-sm mt-2">You must agree to the terms to proceed.</p>
                    )}
                  </div>
                )}

              

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === steps.length - 1 && !formData.agreeToTerms) ||
                    isLoading
                  }
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>

              {/* Footer Section */}
              <div className="mt-8 text-gray-500 text-sm text-right absolute lg:relative bottom-0 left-0">
                <p className='text-sm'>© 2024. All rights reserved.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
