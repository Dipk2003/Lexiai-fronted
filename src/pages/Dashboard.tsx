import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Gavel as GavelIcon,
  Schedule as ScheduleIcon,
  BookmarkBorder as BookmarkIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

// Mock data for demonstration
const activityData = [
  { date: '2024-01-01', searches: 12, cases: 8 },
  { date: '2024-01-02', searches: 15, cases: 10 },
  { date: '2024-01-03', searches: 8, cases: 6 },
  { date: '2024-01-04', searches: 20, cases: 14 },
  { date: '2024-01-05', searches: 18, cases: 12 },
  { date: '2024-01-06', searches: 25, cases: 18 },
  { date: '2024-01-07', searches: 22, cases: 16 },
];

const categoryData = [
  { name: 'Contract Law', value: 35, color: '#1976d2' },
  { name: 'Corporate Law', value: 25, color: '#42a5f5' },
  { name: 'Criminal Law', value: 20, color: '#90caf9' },
  { name: 'Family Law', value: 12, color: '#bbdefb' },
  { name: 'Others', value: 8, color: '#e3f2fd' },
];

const recentCases = [
  {
    id: '1',
    title: 'Smith v. Johnson Contract Dispute',
    court: 'Superior Court of CA',
    date: '2024-01-07',
    relevance: 95,
    category: 'Contract Law',
  },
  {
    id: '2',
    title: 'Tech Corp Merger Analysis',
    court: 'Delaware Court',
    date: '2024-01-06',
    relevance: 88,
    category: 'Corporate Law',
  },
  {
    id: '3',
    title: 'Employment Rights Case',
    court: 'Federal District Court',
    date: '2024-01-05',
    relevance: 92,
    category: 'Employment Law',
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const currentTime = new Date();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {getGreeting()}, {user?.firstName}!
          </Typography>
          <Typography variant="h6" opacity={0.9} gutterBottom>
            Welcome back to LexiAI Legal Research Platform
          </Typography>
          <Typography variant="body1" opacity={0.8} mb={3}>
            {format(currentTime, 'EEEE, MMMM do, yyyy')} • {user?.firm}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
              backdropFilter: 'blur(10px)',
            }}
          >
            Start New Research
          </Button>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            right: -50,
            top: -50,
            opacity: 0.1,
            transform: 'rotate(15deg)',
          }}
        >
          <GavelIcon sx={{ fontSize: 200 }} />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Searches
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    342
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SearchIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Cases Reviewed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    156
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +8% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <GavelIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Saved Cases
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    89
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +15% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BookmarkIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Research Sessions
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    24
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +5% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <AssessmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Research Activity (Last 7 Days)
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="searches" 
                      stroke="#1976d2" 
                      strokeWidth={3}
                      name="Searches"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cases" 
                      stroke="#42a5f5" 
                      strokeWidth={3}
                      name="Cases Viewed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Research by Category
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Cases */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Case Research
                </Typography>
                <Button color="primary">
                  View All
                </Button>
              </Box>
              <List>
                {recentCases.map((case_, index) => (
                  <ListItem key={case_.id} divider={index < recentCases.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <GavelIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {case_.title}
                          </Typography>
                          <Chip 
                            label={case_.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {case_.court} • {format(new Date(case_.date), 'MMM dd, yyyy')}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              Relevance:
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={case_.relevance}
                              sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" fontWeight="medium">
                              {case_.relevance}%
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SearchIcon />}
                    sx={{ py: 2 }}
                  >
                    New Search
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BookmarkIcon />}
                    sx={{ py: 2 }}
                  >
                    Saved Cases
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    sx={{ py: 2 }}
                  >
                    Recent Sessions
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUpIcon />}
                    sx={{ py: 2 }}
                  >
                    Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
