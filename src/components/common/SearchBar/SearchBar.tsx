import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  InputAdornment,
  IconButton,
  Chip,
  Popover,
  Paper,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Input } from '../Input/Input';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'multiselect';
  options?: { value: string; label: string }[];
}

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  filters?: FilterOption[];
  filterValues?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  showFilterChips?: boolean;
  variant?: 'outlined' | 'filled';
}

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

const FilterChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const FilterPopover = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 300,
  maxWidth: 400,
}));

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search...',
  onSearch,
  filters = [],
  filterValues = {},
  onFilterChange,
  showFilterChips = true,
  variant = 'outlined',
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [localFilters, setLocalFilters] = useState(filterValues);

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch?.();
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = useCallback((key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApplyFilters = () => {
    onFilterChange?.(localFilters);
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onFilterChange?.({});
    handleFilterClose();
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filterValues };
    delete newFilters[key];
    onFilterChange?.(newFilters);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.values(filterValues).filter(value => 
      value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }, [filterValues]);

  const renderFilterInput = (filter: FilterOption) => {
    const value = localFilters[filter.key] || '';

    switch (filter.type) {
      case 'select':
        return (
          <FormControl fullWidth key={filter.key} margin="dense">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={value}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth key={filter.key} margin="dense">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => (
                    <Chip key={val} label={val} size="small" />
                  ))}
                </Box>
              )}
            >
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            key={filter.key}
            fullWidth
            margin="dense"
            label={filter.label}
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );

      default:
        return (
          <TextField
            key={filter.key}
            fullWidth
            margin="dense"
            label={filter.label}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );
    }
  };

  const getFilterDisplayValue = (key: string, value: any) => {
    const filter = filters.find(f => f.key === key);
    if (!filter) return String(value);

    if (filter.type === 'select') {
      const option = filter.options?.find(opt => opt.value === value);
      return option?.label || value;
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  };

  return (
    <Box>
      <SearchContainer>
        <Input
          variant={variant === 'outlined' ? 'outlined' : 'filled'}
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          fullWidth
          startIcon={<SearchIcon />}
          endIcon={
            query ? (
              <IconButton
                size="small"
                onClick={() => onQueryChange('')}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            ) : undefined
          }
        />
        
        <Button
          variant="contained"
          onClick={onSearch}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 100 }}
        >
          Search
        </Button>

        {filters.length > 0 && (
          <IconButton
            onClick={handleFilterClick}
            color={activeFiltersCount > 0 ? 'primary' : 'default'}
          >
            <FilterIcon />
            {activeFiltersCount > 0 && (
              <Chip
                size="small"
                label={activeFiltersCount}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 20,
                  height: 20,
                }}
              />
            )}
          </IconButton>
        )}
      </SearchContainer>

      {showFilterChips && Object.keys(filterValues).length > 0 && (
        <FilterChipsContainer>
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            const filter = filters.find(f => f.key === key);
            return (
              <Chip
                key={key}
                label={`${filter?.label}: ${getFilterDisplayValue(key, value)}`}
                onDelete={() => handleRemoveFilter(key)}
                size="small"
                variant="outlined"
              />
            );
          })}
        </FilterChipsContainer>
      )}

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <FilterPopover>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {filters.map(renderFilterInput)}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleClearFilters} color="inherit">
              Clear
            </Button>
            <Button onClick={handleApplyFilters} variant="contained">
              Apply
            </Button>
          </Box>
        </FilterPopover>
      </Popover>
    </Box>
  );
};

export default SearchBar;
