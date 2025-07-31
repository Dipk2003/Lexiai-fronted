import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Gavel as CasesIcon,
  Schedule as HearingsIcon,
  Assignment as TasksIcon,
  AttachMoney as RevenueIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Import our custom components
import StatsCard from '../../components/common/StatsCard/StatsCard';
import { Button } from '../../components/common';
import { Case, Task, Calendar, DashboardStats, Priority, CaseStatus } from '../../types/enhanced';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const QuickActionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  border: `2px dashed ${theme.palette.divider}`,
  
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '10',
    transform: 'translateY(-2px)',
  },
}));

const TaskListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Mock data - replace with API calls
const mockStats: DashboardStats = {
  totalCases: 127,
  activeCases: 89,
  completedCases: 38,
  upcomingHearings: 12,
  pendingTasks: 24,
  monthlyRevenue: 125000,
  billableHours: 186,
  clientSatisfaction: 94,
};

const mockRecentCases: Case[] = [
  {
    id: '1',
    caseNumber: 'CASE-2024-001',
    title: 'Smith vs. Johnson Manufacturing',
    description: 'Product liability case',
    clientName: 'John Smith',
    caseType: 'Civil' as any,
    status: CaseStatus.ACTIVE,
    priority: Priority.HIGH,
    court: 'Superior Court of California',
    dateCreated: '2024-01-15',
    dateUpdated: '2024-01-20',
    tags: ['Product Liability', 'Manufacturing'],
    documents: [],
    notes: [],
    timeline: [],
    assignedLawyers: [],
  },
  // Add more mock cases...
];

const mockUpcomingEvents: Calendar[] = [
  {
    id: '1',
    title: 'Hearing - Smith vs Johnson',
    description: 'Final hearing for product liability case',
    start: '2024-01-25T10:00:00',
    end: '2024-01-25T12:00:00',
    type: 'Hearing' as any,
    location: 'Courtroom 3A',
    attendees: [],
    reminders: [],
  },
  // Add more mock events...
];

const mockPendingTasks: Task[] = [
  {
    id: '1',
    title: 'Review contract amendments',
    description: 'Review and approve contract changes for Smith case',
    assignedTo: 'current-user',
    dueDate: '2024-01-22',
    priority: Priority.HIGH,
    status: 'To Do' as any,
    estimatedHours: 2,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  // Add more mock tasks...
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentCases, setRecentCases] = useState<Case[]>(mockRecentCases);
  const [upcomingEvents, setUpcomingEvents] = useState<Calendar[]>(mockUpcomingEvents);
  const [pendingTasks, setPendingTasks] = useState<Task[]>(mockPendingTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard stats
      const [statsResponse, casesResponse] = await Promise.allSettled([
        apiService.dashboard.getStats(),
        apiService.cases.search({ limit: 5, sortBy: 'dateUpdated', sortOrder: 'desc' })
      ]);

      // Handle stats
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      } else {
        console.warn('Failed to load dashboard stats:', statsResponse.reason);
        // Keep using mock stats if API fails
      }

      // Handle recent cases
      if (casesResponse.status === 'fulfilled') {
        setRecentCases(casesResponse.value.cases || []);
      } else {
        console.warn('Failed to load recent cases:', casesResponse.reason);
        // Keep using mock cases if API fails
      }

      // TODO: Implement calendar and tasks endpoints when available
      // For now, keep using mock data for events and tasks

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'error';
      case Priority.HIGH:
        return 'warning';
      case Priority.MEDIUM:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'success';
      case CaseStatus.PENDING:
        return 'warning';
      case CaseStatus.ON_HOLD:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your cases today
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Cases"
            value={stats.totalCases}
            icon={<CasesIcon />}
            color="primary"
            gradient
            trend={{ value: 12, direction: 'up', period: 'this month' }}
            onClick={() => navigate('/cases')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Cases"
            value={stats.activeCases}
            icon={<TrendingUpIcon />}
            color="success"
            gradient
            trend={{ value: 8, direction: 'up', period: 'this week' }}
            onClick={() => navigate('/cases?status=active')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Upcoming Hearings"
            value={stats.upcomingHearings}
            icon={<HearingsIcon />}
            color="warning"
            gradient
            subtitle="Next 30 days"
            onClick={() => navigate('/calendar')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Revenue"
            value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={<RevenueIcon />}
            color="secondary"
            gradient
            trend={{ value: 15, direction: 'up', period: 'vs last month' }}
            onClick={() => navigate('/billing')}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <SectionTitle variant="h5">Quick Actions</SectionTitle>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => navigate('/cases/new')}>
            <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              New Case
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start a new case file
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => navigate('/clients/new')}>
            <PersonIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Add Client
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register new client
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => navigate('/calendar/new')}>
            <EventIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Schedule Event
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add to calendar
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => navigate('/research')}>
            <CasesIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Case Research
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find similar cases
            </Typography>
          </QuickActionCard>
        </Grid>
      </Grid>

      {/* Content Sections */}
      <Grid container spacing={3}>
        {/* Recent Cases */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SectionTitle variant="h6">Recent Cases</SectionTitle>
              <Button
                variant="text"
                onClick={() => navigate('/cases')}
                size="small"
              >
                View All
              </Button>
            </Box>
            <List>
              {recentCases.slice(0, 5).map((case_) => (
                <TaskListItem
                  key={case_.id}
                  onClick={() => navigate(`/cases/${case_.id}`)}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <CasesIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={case_.title}
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="caption">
                          {case_.clientName}
                        </Typography>
                        <Chip
                          label={case_.status}
                          size="small"
                          color={getStatusColor(case_.status)}
                          variant="outlined"
                        />
                        <Chip
                          label={case_.priority}
                          size="small"
                          color={getPriorityColor(case_.priority)}
                          variant="filled"
                        />
                      </Box>
                    }
                  />
                </TaskListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SectionTitle variant="h6">Upcoming Events</SectionTitle>
              <Button
                variant="text"
                onClick={() => navigate('/calendar')}
                size="small"
              >
                View Calendar
              </Button>
            </Box>
            <List>
              {upcomingEvents.slice(0, 5).map((event) => (
                <TaskListItem key={event.id}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                      <EventIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {new Date(event.start).toLocaleDateString()} at{' '}
                          {new Date(event.start).toLocaleTimeString()}
                        </Typography>
                        {event.location && (
                          <Typography variant="caption" color="text.secondary">
                            {event.location}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </TaskListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SectionTitle variant="h6">Pending Tasks</SectionTitle>
              <Button
                variant="text"
                onClick={() => navigate('/tasks')}
                size="small"
              >
                View All Tasks
              </Button>
            </Box>
            <Grid container spacing={2}>
              {pendingTasks.slice(0, 6).map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <TaskListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                        <TasksIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </TaskListItem>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
