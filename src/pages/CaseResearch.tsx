import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Gavel as GavelIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  DateRange as DateRangeIcon,
  Clear as ClearIcon,
  Psychology,
} from '@mui/icons-material';
import { format } from 'date-fns';



const CaseResearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const courts = [
    'All Courts',
    'Supreme Court',
    'Federal District Court',
    'State Supreme Court',
    'Superior Court of California',
    'Court of Appeals',
  ];

  const categories = [
    'All Categories',
    'Contract Law',
    'Intellectual Property',
    'Environmental Law',
    'Corporate Law',
    'Employment Law',
    'Criminal Law',
    'Family Law',
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchRequest = {
        query: searchQuery,
        courtName: selectedCourt === 'All Courts' ? undefined : selectedCourt,
        caseType: selectedCategory === 'All Categories' ? undefined : selectedCategory,
        jurisdiction: selectedCourt === 'All Courts' ? undefined : selectedCourt,
        searchType: 'keyword',
        page: currentPage - 1,
        size: 10
      };
      
      console.log('Searching with filters:', searchRequest);
      const response = await apiService.searchCases(searchRequest);
      
      if (response && response.cases) {
        setResults(response.cases);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCourt('');
    setSelectedCategory('');
    setSortBy('relevance');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      {/* Search Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Legal Case Research
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Search through millions of legal cases with AI-powered relevance ranking
        </Typography>

        {/* Search Bar */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your legal query (e.g., 'breach of contract manufacturing')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <ClearIcon />
                </IconButton>
              ),
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {/* Quick Search Suggestions */}
        <Box display="flex" gap={1} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary" mr={1}>
            Popular searches:
          </Typography>
          {['Contract disputes', 'Employment law', 'IP infringement', 'Corporate mergers'].map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              size="small"
              onClick={() => setSearchQuery(suggestion)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Filters</Typography>
                <Button size="small" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Court</InputLabel>
                <Select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  label="Court"
                >
                  {courts.map((court) => (
                    <MenuItem key={court} value={court}>
                      {court}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="date">Date (Newest)</MenuItem>
                  <MenuItem value="court">Court</MenuItem>
                </Select>
              </FormControl>

              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Date Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    type="date"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={9}>
          {/* Results Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {results.length} results found {searchQuery && `for "${searchQuery}"`}
            </Typography>
            <Box display="flex" gap={1}>
              <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                Export
              </Button>
              <Button variant="outlined" size="small" startIcon={<FilterIcon />}>
                More Filters
              </Button>
            </Box>
          </Box>

          {isLoading && <LinearProgress sx={{ mb: 3 }} />}

          {/* Results List */}
          <Box>
            {results.map((case_, index) => (
              <Card key={case_.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        {case_.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          {case_.courtName || case_.court}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {case_.decisionDate ? format(new Date(case_.decisionDate), 'MMM dd, yyyy') : 
                           case_.date ? format(new Date(case_.date), 'MMM dd, yyyy') : 'No date'}
                        </Typography>
                        <Chip 
                          label={case_.caseType || case_.category || 'Unknown'} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        {case_.aiEnhanced && (
                          <Chip 
                            icon={<Psychology />} 
                            label="AI Enhanced" 
                            size="small" 
                            color="secondary" 
                            variant="filled"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Citation: {case_.legalCitation || case_.citation || 'No citation'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" color="text.secondary">
                        Relevance:
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={case_.relevanceScore}
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" fontWeight="medium">
                        {case_.relevanceScore}%
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {case_.caseSummary || case_.summary || case_.description || 'No summary available'}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {case_.keywords ? 
                        case_.keywords.split(',').map((tag, tagIndex) => (
                          <Chip key={tagIndex} label={tag.trim()} size="small" variant="outlined" />
                        )) :
                        case_.tags ? case_.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        )) : null
                      }
                    </Box>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Save to session">
                        <IconButton size="small">
                          <BookmarkIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton size="small">
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Button variant="outlined" size="small" onClick={() => navigate(`/case/${case_.id}`)}>
                        View Full Case
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Judges:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {case_.judges.map((judge) => (
                        <Chip key={judge} label={judge} size="small" />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={10}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseResearch;
