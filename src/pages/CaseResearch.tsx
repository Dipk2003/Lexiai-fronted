import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data for demonstration
const mockResults = [
  {
    id: '1',
    title: 'Smith v. Johnson Manufacturing Inc.',
    court: 'Superior Court of California',
    date: '2023-12-15',
    judges: ['Judge Sarah Williams', 'Judge Robert Chen'],
    summary: 'A landmark case involving breach of contract and damages in manufacturing agreements. The court ruled in favor of the plaintiff, establishing important precedent for commercial contract disputes.',
    citation: '2023 Cal. Super. 1234',
    relevanceScore: 95,
    category: 'Contract Law',
    tags: ['Breach of Contract', 'Manufacturing', 'Damages', 'Commercial Law'],
  },
  {
    id: '2',
    title: 'Tech Solutions Corp v. DataFlow Systems',
    court: 'Federal District Court (Northern District of California)',
    date: '2023-11-28',
    judges: ['Judge Michael Thompson'],
    summary: 'Intellectual property dispute involving software licensing and trade secrets. The court granted preliminary injunction protecting proprietary algorithms.',
    citation: '2023 N.D. Cal. 5678',
    relevanceScore: 88,
    category: 'Intellectual Property',
    tags: ['Trade Secrets', 'Software', 'Licensing', 'Injunction'],
  },
  {
    id: '3',
    title: 'Green Energy Partners v. State Regulatory Board',
    court: 'State Supreme Court',
    date: '2023-10-20',
    judges: ['Chief Justice Maria Rodriguez', 'Justice David Park', 'Justice Lisa Chang'],
    summary: 'Environmental law case challenging renewable energy regulations. Court upheld state authority to regulate green energy projects while protecting private investment.',
    citation: '2023 State Sup. 9012',
    relevanceScore: 82,
    category: 'Environmental Law',
    tags: ['Environmental Regulation', 'Renewable Energy', 'State Authority'],
  },
];

const CaseResearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState(mockResults);
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
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, this would call the API with search parameters
    }, 1500);
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
                          {case_.court}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(case_.date), 'MMM dd, yyyy')}
                        </Typography>
                        <Chip 
                          label={case_.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Citation: {case_.citation}
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
                    {case_.summary}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {case_.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
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
                      <Button variant="outlined" size="small">
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
