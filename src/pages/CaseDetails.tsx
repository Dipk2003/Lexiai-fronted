import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as AIIcon,
  Gavel as LegalIcon,
  Lightbulb as InsightIcon,
} from '@mui/icons-material';

interface LegalCase {
  id: number;
  title: string;
  caseNumber: string;
  courtName: string;
  caseType: string;
  decisionDate: string;
  filingDate: string;
  judgeName: string;
  plaintiff: string;
  defendant: string;
  legalCitation: string;
  jurisdiction: string;
  caseSummary: string;
  keyIssues: string;
  legalPrecedents: string;
  outcome: string;
  sourceUrl: string;
  keywords: string;
  // GPT Enhanced fields
  relevanceScore?: number;
  keyPoints?: string;
  legalPrinciples?: string;
  practicalImplications?: string;
  relatedConcepts?: string;
  aiEnhanced?: boolean;
}

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<LegalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:8080/api/search/cases/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCaseData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching case details:', err);
        setError('Failed to load case details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error || !caseData) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Case not found'}
        </Alert>
        <Button variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" flex={1}>
            {caseData.title}
          </Typography>
          {caseData.aiEnhanced && (
            <Chip 
              icon={<AIIcon />} 
              label="AI Enhanced" 
              color="secondary" 
              variant="filled"
            />
          )}
          <Box display="flex" gap={1}>
            <Tooltip title="Save Case">
              <IconButton>
                <BookmarkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Download PDF
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="body1" color="text.secondary">
              {caseData.courtName}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="text.secondary">
              {caseData.decisionDate || caseData.filingDate}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={caseData.caseType || 'Legal Case'} 
              color="primary" 
              variant="outlined"
            />
          </Grid>
          {caseData.relevanceScore && (
            <Grid item>
              <Chip 
                label={`Relevance: ${caseData.relevanceScore}%`} 
                color="info" 
                variant="outlined"
              />
            </Grid>
          )}
        </Grid>

        <Typography variant="body2" color="text.secondary" mt={2}>
          Case Number: {caseData.caseNumber}
        </Typography>
        {caseData.legalCitation && (
          <Typography variant="body2" color="text.secondary">
            Citation: {caseData.legalCitation}
          </Typography>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Case Summary
              </Typography>
              <Typography variant="body1" paragraph>
                {caseData.caseSummary}
              </Typography>

              {/* GPT Enhanced Key Points */}
              {caseData.keyPoints && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AIIcon color="secondary" />
                        <Typography variant="h6">AI-Generated Key Points</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {caseData.keyPoints}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}

              {/* GPT Enhanced Legal Principles */}
              {caseData.legalPrinciples && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LegalIcon color="primary" />
                      <Typography variant="h6">Legal Principles</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {caseData.legalPrinciples}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* GPT Enhanced Practical Implications */}
              {caseData.practicalImplications && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <InsightIcon color="warning" />
                      <Typography variant="h6">Practical Implications</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {caseData.practicalImplications}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Key Issues */}
              {caseData.keyIssues && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Key Issues
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {caseData.keyIssues}
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Legal Precedents */}
              {caseData.legalPrecedents && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Legal Precedents
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {caseData.legalPrecedents}
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Outcome */}
              {caseData.outcome && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Outcome
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {caseData.outcome}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Case Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Case Information
              </Typography>
              
              {caseData.judgeName && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Judge
                  </Typography>
                  <Chip label={caseData.judgeName} size="small" sx={{ mr: 1, mb: 1 }} />
                </Box>
              )}

              {(caseData.plaintiff || caseData.defendant) && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parties
                  </Typography>
                  {caseData.plaintiff && (
                    <Typography variant="body2">
                      <strong>Plaintiff:</strong> {caseData.plaintiff}
                    </Typography>
                  )}
                  {caseData.defendant && (
                    <Typography variant="body2">
                      <strong>Defendant:</strong> {caseData.defendant}
                    </Typography>
                  )}
                </Box>
              )}

              {caseData.jurisdiction && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Jurisdiction
                  </Typography>
                  <Chip label={caseData.jurisdiction} size="small" variant="outlined" />
                </Box>
              )}

              {caseData.keywords && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Keywords
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {caseData.keywords.split(',').map((keyword, index) => (
                      <Chip key={index} label={keyword.trim()} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* GPT Enhanced Related Concepts */}
          {caseData.relatedConcepts && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AIIcon color="secondary" />
                  <Typography variant="h6">
                    Related Concepts
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {caseData.relatedConcepts}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Source Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Source Information
              </Typography>
              
              {caseData.sourceUrl && (
                <Box mb={2}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={caseData.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    View Original Source
                  </Button>
                </Box>
              )}
              
              <Typography variant="body2" color="text.secondary">
                <strong>Source Type:</strong> {caseData.sourceType || 'Unknown'}
              </Typography>
              
              {caseData.aiEnhanced && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This case has been enhanced with AI analysis for better insights and understanding.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetails;
