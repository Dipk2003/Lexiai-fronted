import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  rows?: number;
}

const LoadingContainer = styled(Box)<{ fullScreen: boolean }>(({ theme, fullScreen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  
  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: theme.zIndex.modal,
  }),
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: 'pulse 1.5s infinite',
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
  },
  '@keyframes pulse': {
    '0%, 80%, 100%': {
      opacity: 0.3,
    },
    '40%': {
      opacity: 1,
    },
  },
}));

const getSizeProps = (size: LoadingProps['size']) => {
  switch (size) {
    case 'small':
      return { size: 24, textVariant: 'body2' as const };
    case 'large':
      return { size: 60, textVariant: 'h6' as const };
    default:
      return { size: 40, textVariant: 'body1' as const };
  }
};

const SkeletonLoader: React.FC<{ rows: number }> = ({ rows }) => (
  <Box sx={{ width: '100%' }}>
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        height={40}
        sx={{ mb: 1, borderRadius: 1 }}
        animation="wave"
      />
    ))}
  </Box>
);

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'medium',
  text,
  fullScreen = false,
  rows = 3,
}) => {
  const sizeProps = getSizeProps(size);

  const renderContent = () => {
    switch (variant) {
      case 'skeleton':
        return <SkeletonLoader rows={rows} />;
        
      case 'dots':
        return (
          <>
            <DotsContainer>
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </DotsContainer>
            {text && (
              <Typography variant={sizeProps.textVariant} color="text.secondary">
                {text}
              </Typography>
            )}
          </>
        );
        
      default:
        return (
          <>
            <CircularProgress size={sizeProps.size} thickness={4} />
            {text && (
              <Typography variant={sizeProps.textVariant} color="text.secondary">
                {text}
              </Typography>
            )}
          </>
        );
    }
  };

  return (
    <LoadingContainer fullScreen={fullScreen}>
      {renderContent()}
    </LoadingContainer>
  );
};

export default Loading;
