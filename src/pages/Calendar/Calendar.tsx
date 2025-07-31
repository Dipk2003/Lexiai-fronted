import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Fab,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

import { Calendar as CalendarEvent, CalendarEventType, ReminderType, Case } from '../../types/enhanced';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const CalendarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const DayHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const DayCell = styled(Paper)<{ isToday?: boolean; isSelected?: boolean; isOtherMonth?: boolean }>(({ theme, isToday, isSelected, isOtherMonth }) => ({
  minHeight: 120,
  padding: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isOtherMonth 
    ? theme.palette.grey[100] 
    : theme.palette.background.paper,
  border: isToday 
    ? `2px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.divider}`,
  boxShadow: isSelected ? theme.shadows[4] : theme.shadows[1],
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-1px)',
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[3],
  },
}));

const ViewToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
}));

const ViewButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  minWidth: 80,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  
  // Dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: CalendarEventType.MEETING,
    location: '',
    caseId: '',
    attendees: [] as string[],
    reminders: [] as any[],
  });

  useEffect(() => {
    loadEvents();
    loadCases();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.calendar.getEvents();
      setEvents(response);
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      const response = await apiService.cases.getAll();
      setCases(response.cases);
    } catch (error) {
      console.error('Failed to load cases:', error);
    }
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'next' ? 1 : -1), 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => direction === 'next' ? addDays(prev, 7) : subDays(prev, 7));
    } else if (viewMode === 'day') {
      setCurrentDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
    }
  };

  const handleEventSave = async () => {
    try {
      const eventData = {
        ...eventForm,
        attendees: eventForm.attendees,
        reminders: eventForm.reminders.map(r => ({
          type: r.type,
          time: parseInt(r.time),
          sent: false,
        })),
      };

      if (isEditing && selectedEvent) {
        await apiService.calendar.updateEvent(selectedEvent.id, eventData);
      } else {
        await apiService.calendar.createEvent(eventData);
      }

      await loadEvents();
      handleEventDialogClose();
    } catch (error) {
      console.error('Failed to save event:', error);
      setError('Failed to save event. Please try again.');
    }
  };

  const handleEventDelete = async () => {
    if (!selectedEvent) return;

    try {
      await apiService.calendar.deleteEvent(selectedEvent.id);
      await loadEvents();
      handleEventDialogClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleEventDialogClose = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
    setIsEditing(false);
    setEventForm({
      title: '',
      description: '',
      start: '',
      end: '',
      type: CalendarEventType.MEETING,
      location: '',
      caseId: '',
      attendees: [],
      reminders: [],
    });
  };

  const handleCreateEvent = (date?: Date) => {
    const eventDate = date || selectedDate || new Date();
    setEventForm({
      ...eventForm,
      start: format(eventDate, 'yyyy-MM-dd\'T\'HH:mm'),
      end: format(addDays(eventDate, 0), 'yyyy-MM-dd\'T\'HH:mm'),
    });
    setIsEditing(false);
    setEventDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      type: event.type,
      location: event.location || '',
      caseId: event.caseId || '',
      attendees: event.attendees,
      reminders: event.reminders.map(r => ({ type: r.type, time: r.time.toString() })),
    });
    setIsEditing(true);
    setEventDialogOpen(true);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.start), date));
  };

  const getEventColor = (type: CalendarEventType) => {
    switch (type) {
      case CalendarEventType.HEARING: return 'error';
      case CalendarEventType.MEETING: return 'primary';
      case CalendarEventType.DEADLINE: return 'warning';
      case CalendarEventType.CONSULTATION: return 'info';
      case CalendarEventType.COURT_APPEARANCE: return 'secondary';
      case CalendarEventType.DEPOSITION: return 'success';
      default: return 'default';
    }
  };

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }

    return (
      <CalendarGrid>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <DayCell
              key={day.toISOString()}
              isToday={isToday}
              isSelected={isSelected}
              isOtherMonth={!isCurrentMonth}
              onClick={() => setSelectedDate(day)}
              onDoubleClick={() => handleCreateEvent(day)}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isCurrentMonth ? 'inherit' : 'text.disabled'
                }}
              >
                {day.getDate()}
              </Typography>
              
              {dayEvents.slice(0, 3).map(event => (
                <EventCard
                  key={event.id}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                >
                  <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                    <Chip
                      label={event.title}
                      size="small"
                      color={getEventColor(event.type)}
                      variant="filled"
                      sx={{ 
                        width: '100%', 
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                  </CardContent>
                </EventCard>
              ))}
              
              {dayEvents.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{dayEvents.length - 3} more
                </Typography>
              )}
            </DayCell>
          );
        })}
      </CalendarGrid>
    );
  };

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(event => new Date(event.start) >= new Date())
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 50);

    return (
      <Paper sx={{ mt: 2 }}>
        <List>
          {upcomingEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              <ListItem
                onClick={() => handleEditEvent(event)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: `${getEventColor(event.type)}.main` }}>
                    <EventIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {format(parseISO(event.start), 'MMM dd, yyyy • h:mm a')}
                      </Typography>
                      {event.location && (
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption">{event.location}</Typography>
                        </Box>
                      )}
                      <Chip
                        label={event.type}
                        size="small"
                        color={getEventColor(event.type)}
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < upcomingEvents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          
          {upcomingEvents.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No upcoming events"
                secondary="Click the + button to create your first event"
              />
            </ListItem>
          )}
        </List>
      </Paper>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CalendarContainer>
        {/* Header */}
        <HeaderSection>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your schedule and appointments
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <ViewToggle>
              <ViewButton 
                active={viewMode === 'month'} 
                onClick={() => setViewMode('month')}
              >
                Month
              </ViewButton>
              <ViewButton 
                active={viewMode === 'week'} 
                onClick={() => setViewMode('week')}
              >
                Week
              </ViewButton>
              <ViewButton 
                active={viewMode === 'day'} 
                onClick={() => setViewMode('day')}
              >
                Day
              </ViewButton>
              <ViewButton 
                active={viewMode === 'agenda'} 
                onClick={() => setViewMode('agenda')}
              >
                Agenda
              </ViewButton>
            </ViewToggle>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleCreateEvent()}
            >
              New Event
            </Button>
          </Box>
        </HeaderSection>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Navigation */}
        {viewMode !== 'agenda' && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={() => handleDateNavigation('prev')}>
              <ChevronLeftIcon />
            </IconButton>
            
            <Typography variant="h5">
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            
            <IconButton onClick={() => handleDateNavigation('next')}>
              <ChevronRightIcon />
            </IconButton>
            
            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </Box>
        )}

        {/* Calendar Views */}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'agenda' && renderAgendaView()}

        {/* Event Dialog */}
        <Dialog
          open={eventDialogOpen}
          onClose={handleEventDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                fullWidth
                required
              />
              
              <TextField
                label="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Start Date & Time"
                  type="datetime-local"
                  value={eventForm.start}
                  onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  label="End Date & Time"
                  type="datetime-local"
                  value={eventForm.end}
                  onChange={(e) => setEventForm({ ...eventForm, end: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={eventForm.type}
                    label="Event Type"
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as CalendarEventType })}
                  >
                    {Object.values(CalendarEventType).map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Related Case</InputLabel>
                  <Select
                    value={eventForm.caseId}
                    label="Related Case"
                    onChange={(e) => setEventForm({ ...eventForm, caseId: e.target.value })}
                  >
                    <MenuItem value="">None</MenuItem>
                    {cases.map(case_ => (
                      <MenuItem key={case_.id} value={case_.id}>
                        {case_.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <TextField
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEventDialogClose}>Cancel</Button>
            {isEditing && (
              <Button onClick={handleEventDelete} color="error">
                Delete
              </Button>
            )}
            <Button onClick={handleEventSave} variant="contained">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add event"
          onClick={() => handleCreateEvent()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      </CalendarContainer>
    </LocalizationProvider>
  );
};

export default Calendar;
