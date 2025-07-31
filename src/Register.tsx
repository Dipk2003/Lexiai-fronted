import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Person as PersonIcon,
  Apartment as FirmIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './components/common';
import { apiService } from './services/apiService';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const steps = ['Personal Information', 'Firm Details'];

const Register: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    firmName: '',
    firmEmail: '',
    firmPhone: '',
    firmAddress: '',
    firmCity: '',
    firmState: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all personal information fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeStep === 1) {
      if (!formData.firmName || !formData.firmEmail || !formData.firmCity || !formData.firmState) {
        setError('Please fill in all required firm details.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      await apiService.register(formData);
      alert('Registration successful! You can now log in.');
      onBackToLogin();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="firmName"
                label="Firm Name"
                value={formData.firmName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firmEmail"
                label="Firm Email"
                type="email"
                value={formData.firmEmail}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firmPhone"
                label="Firm Phone"
                value={formData.firmPhone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="firmAddress"
                label="Firm Address"
                value={formData.firmAddress}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firmCity"
                label="City"
                value={formData.firmCity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firmState"
                label="State / Province"
                value={formData.firmState}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create Your LexiAI Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ my: 3, width: '80%' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box sx={{ width: '100%', mt: 2 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 4 }}>
          {activeStep !== 0 && (
            <Button
              variant="text"
              onClick={handleBack}
              startIcon={<BackIcon />}
            >
              Back
            </Button>
          )}
          <Box flex={1} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleRegister}
              loading={loading}
              size="large"
            >
              Create Account
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              endIcon={<ForwardIcon />}
              size="large"
            >
              Next: Firm Details
            </Button>
          )}
        </Box>

        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid item>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" variant="body2">
                Sign In
              </MuiLink>
            </Typography>
          </Grid>
        </Grid>
      </FormContainer>
    </PageContainer>
  );
};

export default Register;
