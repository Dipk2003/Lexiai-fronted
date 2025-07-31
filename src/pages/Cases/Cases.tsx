import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Gavel as CasesIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Import our custom components
import DataTable from '../../components/common/DataTable/DataTable';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import { Button } from '../../components/common';
import { 
  Case, 
  CaseStatus, 
  Priority, 
  CaseType, 
  SearchFilters, 
  TableColumn 
} from '../../types/enhanced';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const TableContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
}));

import { apiService } from '../../services/api';

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: Object.values(CaseStatus).map(status => ({ value: status, label: status })),
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select' as const,
    options: Object.values(Priority).map(priority => ({ value: priority, label: priority })),
  },
  {
    key: 'caseType',
    label: 'Case Type',
    type: 'select' as const,
    options: Object.values(CaseType).map(type => ({ value: type, label: type })),
  },
  {
    key: 'court',
    label: 'Court',
    type: 'text' as const,
  },
  {
    key: 'dateFrom',
    label: 'Date From',
    type: 'date' as const,
  },
  {
    key: 'dateTo',
    label: 'Date To',
    type: 'date' as const,
  },
];

export const Cases: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    // Fetch cases from the backend
    const fetchCases = async () => {
      setLoading(true);
      try {
        const casesData = await apiService.getUserCases();
        setCases(casesData);
      } catch (error) {
        console.error('Failed to load cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();

    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      setFilters(prev => ({ ...prev, status: statusFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [cases, searchQuery, filters]);

  const applyFiltersAndSearch = () => {
    let filtered = [...cases];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(case_ =>
        case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      
      switch (key) {
        case 'status':
          filtered = filtered.filter(case_ => case_.status === value);
          break;
        case 'priority':
          filtered = filtered.filter(case_ => case_.priority === value);
          break;
        case 'caseType':
          filtered = filtered.filter(case_ => case_.caseType === value);
          break;
        case 'court':
          filtered = filtered.filter(case_ => 
            case_.court.toLowerCase().includes(value.toLowerCase())
          );
          break;
        case 'dateFrom':
          filtered = filtered.filter(case_ => 
            new Date(case_.dateCreated) >= new Date(value)
          );
          break;
        case 'dateTo':
          filtered = filtered.filter(case_ => 
            new Date(case_.dateCreated) <= new Date(value)
          );
          break;
      }
    });

    setFilteredCases(filtered);
  };

  const handleSearch = () => {
    applyFiltersAndSearch();
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleViewCase = (case_: Case) => {
    navigate(`/cases/${case_.id}`);
  };

  const handleEditCase = (case_: Case) => {
    navigate(`/cases/${case_.id}/edit`);
  };

  const handleDeleteCase = (case_: Case) => {
    setSelectedCase(case_);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCase) return;
    
    try {
      await apiService.deleteUserCase(selectedCase.id.toString());
      setCases(prev => prev.filter(c => c.id !== selectedCase.id));
      setDeleteDialogOpen(false);
      setSelectedCase(null);
    } catch (error) {
      console.error('Failed to delete case:', error);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT: return 'error';
      case Priority.HIGH: return 'warning';
      case Priority.MEDIUM: return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE: return 'success';
      case CaseStatus.PENDING: return 'warning';
      case CaseStatus.ON_HOLD: return 'error';
      case CaseStatus.COMPLETED: return 'info';
      default: return 'default';
    }
  };

  const columns: TableColumn<Case>[] = [
    {
      id: 'caseNumber',
      label: 'Case #',
      minWidth: 120,
      format: (value: string) => (
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      ),
    },
    {
      id: 'title',
      label: 'Case Title',
      minWidth: 250,
      format: (value: string, row: Case) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {row.clientName}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'caseType',
      label: 'Type',
      minWidth: 120,
      format: (value: CaseType) => (
        <Chip label={value} size="small" variant="outlined" />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value: CaseStatus) => (
        <Chip 
          label={value} 
          size="small" 
          color={getStatusColor(value)}
          variant="filled"
        />
      ),
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      format: (value: Priority) => (
        <Chip 
          label={value} 
          size="small" 
          color={getPriorityColor(value)}
          variant="outlined"
        />
      ),
    },
    {
      id: 'court',
      label: 'Court',
      minWidth: 200,
      format: (value: string) => (
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      ),
    },
    {
      id: 'dateCreated',
      label: 'Created',
      minWidth: 120,
      format: (value: string) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'estimatedValue',
      label: 'Value',
      minWidth: 120,
      align: 'right',
      format: (value?: number) => (
        <Typography variant="body2" fontWeight="medium">
          {value ? `$${value.toLocaleString()}` : '-'}
        </Typography>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Cases Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your legal cases and track their progress
          </Typography>
        </Box>
        <Button
          variant="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cases/new')}
          size="large"
        >
          New Case
        </Button>
      </PageHeader>

      <Box mb={3}>
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search cases by title, client name, case number, or tags..."
          filters={filterOptions}
          filterValues={filters}
          onFilterChange={handleFilterChange}
        />
      </Box>

      <TableContainer>
        <DataTable
          columns={columns}
          data={filteredCases}
          loading={loading}
          onRowClick={handleViewCase}
          onView={handleViewCase}
          onEdit={handleEditCase}
          onDelete={handleDeleteCase}
          getRowId={(row) => row.id}
          emptyMessage="No cases found. Create your first case to get started."
          sortable
          pagination
        />
      </TableContainer>

      <Fab
        color="primary"
        aria-label="add case"
        onClick={() => navigate('/cases/new')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Case</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the case "{selectedCase?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="danger"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Cases;
