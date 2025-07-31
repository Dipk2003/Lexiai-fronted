import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { apiService } from '../services/api';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: false,
      research: true,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      defaultSortBy: 'relevance',
    },
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleNotificationChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: event.target.checked,
      },
    }));
  };

  const handlePreferenceChange = (key: string) => (event: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: event.target.value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const response = await apiService.updateSettings(settings);
      if (response) {
        setSuccessMessage('Settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Manage how you receive notifications
              </Typography>

              <Box mt={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Receive updates about your research and account via email
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.desktop}
                      onChange={handleNotificationChange('desktop')}
                    />
                  }
                  label="Desktop Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Show browser notifications for important updates
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.research}
                      onChange={handleNotificationChange('research')}
                    />
                  }
                  label="Research Alerts"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Get notified when new relevant cases are available
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Customize your LexiAI experience
              </Typography>

              <Box mt={3}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.preferences.theme}
                    onChange={handlePreferenceChange('theme')}
                    label="Theme"
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.preferences.language}
                    onChange={handlePreferenceChange('language')}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Default Search Sort</InputLabel>
                  <Select
                    value={settings.preferences.defaultSortBy}
                    onChange={handlePreferenceChange('defaultSortBy')}
                    label="Default Search Sort"
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="date">Date (Newest)</MenuItem>
                    <MenuItem value="court">Court</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Manage your account security settings
              </Typography>

              <Box mt={3}>
                <Button variant="outlined" sx={{ mr: 2 }}>
                  Change Password
                </Button>
                <Button variant="outlined" sx={{ mr: 2 }}>
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outlined" color="error">
                  Download Account Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
