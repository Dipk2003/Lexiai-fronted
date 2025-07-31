import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  LinearProgress,
  Alert,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

import { Document, DocumentType, Case } from '../../types/enhanced';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const DocumentsContainer = styled(Box)(({ theme }) => ({
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

const FilterSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const DocumentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const UploadDropzone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main + '10',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '20',
    borderColor: theme.palette.primary.dark,
  },
  
  '&.dragActive': {
    backgroundColor: theme.palette.primary.main + '30',
    borderColor: theme.palette.primary.dark,
  },
}));

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const { user } = useAuth();
  
  // State management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  
  // UI states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (caseId) {
      loadCaseDetails();
      loadDocuments();
    }
  }, [caseId]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, typeFilter, sortBy]);

  const loadCaseDetails = async () => {
    if (!caseId) return;
    
    try {
      const caseData = await apiService.cases.getById(caseId);
      setCaseDetails(caseData);
    } catch (error) {
      console.error('Failed to load case details:', error);
    }
  };

  const loadDocuments = async () => {
    if (!caseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.documents.getByCaseId(caseId);
      setDocuments(response);
    } catch (error) {
      console.error('Failed to load documents:', error);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!caseId) return;
    
    setUploadLoading(true);
    try {
      for (const file of acceptedFiles) {
        await apiService.documents.upload(caseId, file);
      }
      await loadDocuments();
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  }, [caseId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleDownload = async (document: Document) => {
    try {
      const blob = await apiService.documents.download(document.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
      setError('Failed to download document.');
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await apiService.documents.delete(selectedDocument.id);
      await loadDocuments();
      setDeleteDialogOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete document:', error);
      setError('Failed to delete document.');
    }
  };

  const getFileIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PDF:
        return <PdfIcon color="error" />;
      case DocumentType.WORD:
        return <DocIcon color="primary" />;
      case DocumentType.IMAGE:
        return <ImageIcon color="success" />;
      default:
        return <FileIcon color="disabled" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && documents.length === 0) {
    return (
      <DocumentsContainer>
        <Typography variant="h4" gutterBottom>Documents</Typography>
        <LinearProgress />
        <Box mt={2}>
          <Typography>Loading documents...</Typography>
        </Box>
      </DocumentsContainer>
    );
  }

  return (
    <DocumentsContainer>
      {/* Header */}
      <HeaderSection>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Documents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {caseDetails ? `Case: ${caseDetails.title}` : 'Manage case documents'}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Documents
          </Button>
        </Box>
      </HeaderSection>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <FilterSection>
        <TextField
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'ALL')}
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value={DocumentType.PDF}>PDF</MenuItem>
            <MenuItem value={DocumentType.WORD}>Word</MenuItem>
            <MenuItem value={DocumentType.IMAGE}>Image</MenuItem>
            <MenuItem value={DocumentType.SPREADSHEET}>Spreadsheet</MenuItem>
            <MenuItem value={DocumentType.OTHER}>Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="size">Size</MenuItem>
            <MenuItem value="type">Type</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filteredDocuments.length} documents
        </Typography>
      </FilterSection>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredDocuments.map((document) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={document.id}>
              <DocumentCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getFileIcon(document.type)}
                      <Typography variant="subtitle2" noWrap>
                        {document.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, document)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {document.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {document.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box display="flex" justify-content="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(document.size)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleDownload(document)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(document)}
                  >
                    Download
                  </Button>
                </CardActions>
              </DocumentCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          <List>
            {filteredDocuments.map((document, index) => (
              <React.Fragment key={document.id}>
                <ListItem>
                  <ListItemIcon>
                    {getFileIcon(document.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={document.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" component="span">
                          {document.description}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(document.size)} • {new Date(document.uploadedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, document)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <FolderIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {documents.length === 0
              ? "No documents have been uploaded yet."
              : "No documents match your current filters."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Documents
          </Button>
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
          <UploadDropzone
            {...getRootProps()}
            className={isDragActive ? 'dragActive' : ''}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Support for PDF, Word, Images, and more (Max 50MB per file)
            </Typography>
            {uploadLoading && (
              <Box mt={2}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading files...
                </Typography>
              </Box>
            )}
          </UploadDropzone>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploadLoading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItemComponent onClick={() => {
            if (selectedDocument) handleDownload(selectedDocument);
            handleMenuClose();
          }}>
            <ViewIcon sx={{ mr: 1 }} fontSize="small" />
            View
          </MenuItemComponent>
          <MenuItemComponent onClick={() => {
            if (selectedDocument) handleDownload(selectedDocument);
            handleMenuClose();
          }}>
            <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
            Download
          </MenuItemComponent>
          <MenuItemComponent onClick={() => {
            // TODO: Implement share functionality
            handleMenuClose();
          }}>
            <ShareIcon sx={{ mr: 1 }} fontSize="small" />
            Share
          </MenuItemComponent>
          <Divider />
          <MenuItemComponent
            onClick={() => {
              setDeleteDialogOpen(true);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItemComponent>
        </MenuList>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="upload document"
        onClick={() => setUploadDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <UploadIcon />
      </Fab>
    </DocumentsContainer>
  );
};

export default Documents;
