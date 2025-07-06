import React from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock case data
  const caseData = {
    id: '1',
    title: 'Smith v. Johnson Manufacturing Inc.',
    court: 'Superior Court of California',
    date: '2023-12-15',
    judges: ['Judge Sarah Williams', 'Judge Robert Chen'],
    citation: '2023 Cal. Super. 1234',
    category: 'Contract Law',
    tags: ['Breach of Contract', 'Manufacturing', 'Damages', 'Commercial Law'],
    summary: 'A landmark case involving breach of contract and damages in manufacturing agreements.',
    fullText: `
This case involves a dispute between Smith Industries and Johnson Manufacturing Inc. regarding a breach of contract in their manufacturing agreement dated January 15, 2022.

BACKGROUND:
The plaintiff, Smith Industries, entered into a manufacturing agreement with Johnson Manufacturing Inc. for the production of specialized automotive components. The contract specified delivery schedules, quality standards, and penalty clauses for non-compliance.

FACTS:
1. Johnson Manufacturing failed to deliver goods on the agreed schedule
2. The delivered products did not meet the specified quality standards
3. Smith Industries suffered significant financial losses due to the breach
4. Johnson Manufacturing refused to acknowledge the breach or provide remedies

LEGAL ISSUES:
The court addressed the following key legal issues:
- Whether Johnson Manufacturing's actions constituted a material breach of contract
- The appropriate measure of damages for the breach
- The enforceability of penalty clauses in commercial contracts

HOLDING:
The court held that Johnson Manufacturing's failure to deliver conforming goods on schedule constituted a material breach of contract. The court awarded Smith Industries compensatory damages totaling $2.3 million, including lost profits and additional costs incurred.

REASONING:
The court applied the standard contract law principles of material breach and consequential damages. The court noted that in commercial contracts, time is often of the essence, and failure to meet delivery schedules can constitute material breach even if goods are eventually delivered.

SIGNIFICANCE:
This case establishes important precedent for:
- Time-sensitive delivery obligations in manufacturing contracts
- Calculation of consequential damages in commercial disputes
- Enforceability of penalty clauses versus liquidated damages

The decision reinforces the importance of clear contractual terms and the courts' willingness to award substantial damages for material breaches in commercial relationships.
    `,
    similarCases: [
      { id: '2', title: 'Tech Corp v. Manufacturing Solutions', relevance: 92 },
      { id: '3', title: 'Global Industries v. Production Partners', relevance: 87 },
      { id: '4', title: 'Atlantic Manufacturing v. Precision Components', relevance: 84 },
    ],
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" flex={1}>
            {caseData.title}
          </Typography>
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
              {caseData.court}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="text.secondary">
              {caseData.date}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={caseData.category} 
              color="primary" 
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" mt={2}>
          Citation: {caseData.citation}
        </Typography>
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
                {caseData.summary}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Full Text
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {caseData.fullText}
              </Typography>
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
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Judges
                </Typography>
                {caseData.judges.map((judge) => (
                  <Chip key={judge} label={judge} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {caseData.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Similar Cases */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Similar Cases
              </Typography>
              {caseData.similarCases.map((similarCase) => (
                <Box key={similarCase.id} mb={2}>
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {similarCase.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Relevance: {similarCase.relevance}%
                  </Typography>
                </Box>
              ))}
              <Button size="small" color="primary">
                View More Similar Cases
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetails;
