import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Gavel as GavelIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as CourtIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { format } from 'date-fns';
import './LawyerDashboard.css';

interface UserCase {
  id: number;
  title: string;
  caseNumber?: string;
  caseType: string;
  status: string;
  priority: string;
  nextHearingDate?: string;
  courtName?: string;
  client?: any;
  createdAt: string;
  updatedAt: string;
}

interface CaseStatistics {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  upcomingHearings: number;
}

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<UserCase[]>([]);
  const [upcomingHearings, setUpcomingHearings] = useState<UserCase[]>([]);
  const [statistics, setStatistics] = useState<CaseStatistics>({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    upcomingHearings: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [openNewCaseDialog, setOpenNewCaseDialog] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    caseType: '',
    description: '',
    courtName: '',
    nextHearingDate: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [casesData, statisticsData, hearingsData] = await Promise.all([
        apiService.getUserCases(),
        apiService.getCaseStatistics(),
        apiService.getUpcomingHearings()
      ]);
      
      setCases(casesData);
      setStatistics(statisticsData);
      setUpcomingHearings(hearingsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    try {
      await apiService.createUserCase(newCase);
      setOpenNewCaseDialog(false);
      setNewCase({ title: '', caseType: '', description: '', courtName: '', nextHearingDate: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleSearchCases = async () => {
    if (searchQuery.trim()) {
      try {
        const searchResults = await apiService.searchUserCases(searchQuery);
        setCases(searchResults);
      } catch (error) {
        console.error('Error searching cases:', error);
      }
    } else {
      loadDashboardData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'default';
      case 'on_hold': return 'error';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'urgent': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Welcome back, {user?.firstName} {user?.lastName}
        </Typography>
        <Fab color="primary" aria-label="add case" onClick={() => setOpenNewCaseDialog(true)}>
          <AddIcon />
        </Fab>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GavelIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Cases
                  </Typography>
                  <Typography variant="h4">
                    {statistics.totalCases}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AnalyticsIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Cases
                  </Typography>
                  <Typography variant="h4">
                    {statistics.activeCases}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Upcoming Hearings
                  </Typography>
                  <Typography variant="h4">
                    {statistics.upcomingHearings}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ArchiveIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Closed Cases
                  </Typography>
                  <Typography variant="h4">
                    {statistics.closedCases}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Search cases..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchCases()}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearchCases}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="My Cases" />
          <Tab label="Upcoming Hearings" />
        </Tabs>
        
        {selectedTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Case Title</TableCell>
                  <TableCell>Case Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Court</TableCell>
                  <TableCell>Next Hearing</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>{caseItem.caseNumber || 'N/A'}</TableCell>
                    <TableCell>{caseItem.caseType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={caseItem.status} 
                        color={getStatusColor(caseItem.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={caseItem.priority} 
                        color={getPriorityColor(caseItem.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{caseItem.courtName || 'N/A'}</TableCell>
                    <TableCell>
                      {caseItem.nextHearingDate 
                        ? format(new Date(caseItem.nextHearingDate), 'MMM dd, yyyy')
                        : 'Not scheduled'
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {selectedTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Case Title</TableCell>
                  <TableCell>Court</TableCell>
                  <TableCell>Hearing Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingHearings.map((hearing) => (
                  <TableRow key={hearing.id}>
                    <TableCell>{hearing.title}</TableCell>
                    <TableCell>{hearing.courtName}</TableCell>
                    <TableCell>
                      {hearing.nextHearingDate 
                        ? format(new Date(hearing.nextHearingDate), 'MMM dd, yyyy')
                        : 'Not scheduled'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={hearing.status} 
                        color={getStatusColor(hearing.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* New Case Dialog */}
      <Dialog open={openNewCaseDialog} onClose={() => setOpenNewCaseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Case Title"
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Case Type</InputLabel>
                <Select
                  value={newCase.caseType}
                  onChange={(e) => setNewCase({ ...newCase, caseType: e.target.value })}
                >
                  <MenuItem value="CIVIL">Civil</MenuItem>
                  <MenuItem value="CRIMINAL">Criminal</MenuItem>
                  <MenuItem value="CORPORATE">Corporate</MenuItem>
                  <MenuItem value="FAMILY">Family</MenuItem>
                  <MenuItem value="PROPERTY">Property</MenuItem>
                  <MenuItem value="TAX">Tax</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Court Name"
                value={newCase.courtName}
                onChange={(e) => setNewCase({ ...newCase, courtName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Next Hearing Date"
                type="datetime-local"
                value={newCase.nextHearingDate}
                onChange={(e) => setNewCase({ ...newCase, nextHearingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewCaseDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCase} variant="contained">
            Create Case
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LawyerDashboard;
