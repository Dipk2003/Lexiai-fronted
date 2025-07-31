import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Gavel as GavelIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Balance as BalanceIcon,
  Description as DocumentIcon,
  DateRange as DateIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Import our custom components
import SearchBar from '../../components/common/SearchBar/SearchBar';
import { Card, Button, Loading } from '../../components/common';
import { ResearchCase } from '../../types/enhanced';
import { apiService } from '../../services/apiService';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const SearchSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  border: `1px solid ${theme.palette.divider}`,
}));

const ResultCard = styled(Card)<{ expanded: boolean }>(({ theme, expanded }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
  
  ...(expanded && {
    boxShadow: theme.shadows[4],
  }),
}));

const RelevanceBar = styled(Box)<{ score: number }>(({ theme, score }) => ({
  height: 4,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 2,
  overflow: 'hidden',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${score}%`,
    backgroundColor: score >= 80 ? theme.palette.success.main :
                   score >= 60 ? theme.palette.warning.main :
                   theme.palette.error.main,
    borderRadius: 2,
    transition: 'width 0.5s ease-in-out',
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

// Mock data for case research
const mockResearchCases: ResearchCase[] = [
  {
    id: '1',
    title: 'Doe v. ABC Manufacturing Corp.',
    court: 'Superior Court of California, Los Angeles County',
    date: '2023-08-15',
    citation: '2023 Cal. Super. LEXIS 12345',
    judges: ['Hon. Maria Rodriguez'],
    summary: 'Product liability case involving defective manufacturing processes that resulted in consumer injury. The court found the manufacturer liable for design defects and awarded significant damages for medical expenses and pain and suffering.',
    fullText: 'Full case text would be displayed here...',
    relevanceScore: 92,
    category: 'Product Liability',
    tags: ['Product Liability', 'Manufacturing Defect', 'Personal Injury', 'Damages'],
    similar: [],
  },
  {
    id: '2',
    title: 'Smith v. XYZ Electronics Inc.',
    court: 'Federal District Court, Northern District of California',
    date: '2023-06-22',
    citation: '2023 U.S. Dist. LEXIS 9876',
    judges: ['Hon. James Wilson'],
    summary: 'Class action lawsuit regarding defective consumer electronics that posed safety hazards. The court certified the class and ultimately approved a settlement providing compensation and product recalls.',
    fullText: 'Full case text would be displayed here...',
    relevanceScore: 87,
    category: 'Class Action',
    tags: ['Class Action', 'Consumer Protection', 'Electronics', 'Settlement'],
    similar: [],
  },
  {
    id: '3',
    title: 'Johnson v. MegaCorp Industries',
    court: 'Court of Appeals, Ninth Circuit',
    date: '2023-03-10',
    citation: '2023 9th Cir. LEXIS 5432',
    judges: ['Hon. Sarah Chen', 'Hon. Michael Brown', 'Hon. Lisa Davis'],
    summary: 'Appeal regarding the standard of proof required in product liability cases involving complex manufacturing processes. The appellate court clarified evidentiary standards and burden of proof requirements.',
    fullText: 'Full case text would be displayed here...',
    relevanceScore: 78,
    category: 'Appellate Decision',
    tags: ['Appeals', 'Standards of Proof', 'Manufacturing', 'Evidence'],
    similar: [],
  },
];

const courtOptions = [
  'Superior Court of California',
  'Federal District Court',
  'Court of Appeals',
  'Supreme Court',
  'State Court',
];

const categoryOptions = [
  'Product Liability',
  'Class Action',
  'Personal Injury',
  'Contract Dispute',
  'Corporate Law',
  'Intellectual Property',
  'Employment Law',
  'Real Estate',
];

const filterOptions = [
  {
    key: 'court',
    label: 'Court',
    type: 'select' as const,
    options: courtOptions.map(court => ({ value: court, label: court })),
  },
  {
    key: 'category',
    label: 'Category',
    type: 'multiselect' as const,
    options: categoryOptions.map(category => ({ value: category, label: category })),
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

export const Research: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<ResearchCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [bookmarkedCases, setBookmarkedCases] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load initial results or saved searches
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, filters]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Use the real API service
      const results = await apiService.searchCases(searchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to mock data if API fails
      let filteredResults = mockResearchCases.filter(case_ =>
        case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredResults);
    } finally {
      setLoading(false);
    }
  };

  const toggleCaseExpansion = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const toggleBookmark = (caseId: string) => {
    const newBookmarked = new Set(bookmarkedCases);
    if (newBookmarked.has(caseId)) {
      newBookmarked.delete(caseId);
    } else {
      newBookmarked.add(caseId);
    }
    setBookmarkedCases(newBookmarked);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <PageContainer>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Legal Case Research
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search through thousands of legal cases to find relevant precedents and references
        </Typography>
      </Box>

      {/* Search Section */}
      <SearchSection>
        <Typography variant="h6" gutterBottom>
          Search Legal Cases
        </Typography>
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search by case name, keywords, or legal concepts..."
          filters={filterOptions}
          filterValues={filters}
          onFilterChange={handleFilterChange}
          variant="outlined"
        />
        
        {searchQuery && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Search suggestions based on your query:
            </Typography>
            <Box mt={1}>
              <FilterChip label="Product Liability" size="small" />
              <FilterChip label="Manufacturing Defect" size="small" />
              <FilterChip label="Personal Injury" size="small" />
              <FilterChip label="Damages" size="small" />
            </Box>
          </Box>
        )}
      </SearchSection>

      {/* Results Section */}
      {loading ? (
        <Box>
          {[...Array(3)].map((_, index) => (
            <Paper key={index} sx={{ p: 3, mb: 2 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={60} />
              <Box display="flex" gap={1} mt={2}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
                <Skeleton variant="rounded" width={90} height={24} />
              </Box>
            </Paper>
          ))}
        </Box>
      ) : searchResults.length > 0 ? (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Found {searchResults.length} relevant cases
            </Typography>
          </Box>

          {searchResults.map((case_) => (
            <ResultCard
              key={case_.id}
              expanded={expandedCase === case_.id}
              onClick={() => toggleCaseExpansion(case_.id)}
            >
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {case_.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {case_.court}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <DateIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(case_.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {case_.citation}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(case_.id);
                      }}
                      color={bookmarkedCases.has(case_.id) ? 'primary' : 'default'}
                    >
                      {bookmarkedCases.has(case_.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                    </IconButton>
                    
                    <Box minWidth={80}>
                      <Typography variant="caption" color="text.secondary">
                        Relevance: {case_.relevanceScore}%
                      </Typography>
                      <RelevanceBar score={case_.relevanceScore} />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {case_.summary}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {case_.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Judges: {case_.judges.join(', ')}
                  </Typography>
                  
                  <Button
                    variant="text"
                    endIcon={expandedCase === case_.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCaseExpansion(case_.id);
                    }}
                  >
                    {expandedCase === case_.id ? 'Less Details' : 'More Details'}
                  </Button>
                </Box>

                <Collapse in={expandedCase === case_.id}>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Full Case Summary
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {case_.fullText}
                      </Typography>
                      
                      <Typography variant="h6" gutterBottom>
                        Key Legal Points
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <BalanceIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Burden of Proof"
                            secondary="Plaintiff must demonstrate defect caused injury"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <DocumentIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Evidence Requirements"
                            secondary="Expert testimony required for complex manufacturing processes"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Case Actions
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button variant="primary" size="small">
                          Export Case
                        </Button>
                        <Button variant="outline" size="small">
                          Find Similar Cases
                        </Button>
                        <Button variant="text" size="small">
                          Add to Research Notes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Collapse>
              </Box>
            </ResultCard>
          ))}
        </Box>
      ) : searchQuery ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No cases found matching your search criteria. Try adjusting your search terms or filters.
        </Alert>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <GavelIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Start Your Legal Research
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Enter search terms above to find relevant cases, precedents, and legal references
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search by case names, legal concepts, court names, or keywords
          </Typography>
        </Paper>
      )}
    </PageContainer>
  );
};

export default Research;
