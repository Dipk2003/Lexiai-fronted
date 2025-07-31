import React from 'react';
import { Card as MuiCard, CardContent, CardActions, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'elevation' | 'outlined' | 'glass';
  padding?: number;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled(MuiCard)<{ variant: CardProps['variant']; hover: boolean }>(
  ({ theme, variant, hover }) => ({
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease-in-out',
    
    ...(variant === 'elevation' && {
      boxShadow: theme.shadows[2],
      '&:hover': hover ? {
        boxShadow: theme.shadows[8],
        transform: 'translateY(-4px)',
      } : {},
    }),
    
    ...(variant === 'outlined' && {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
      '&:hover': hover ? {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[4],
      } : {},
    }),
    
    ...(variant === 'glass' && {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: `1px solid rgba(255, 255, 255, 0.2)`,
      '&:hover': hover ? {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
      } : {},
    }),
    
    ...(hover && {
      cursor: 'pointer',
    }),
  })
);

const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3, 1, 3),
  borderBottom: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
}));

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'elevation',
  padding = 3,
  hover = false,
  className,
  onClick,
}) => {
  return (
    <StyledCard 
      variant={variant} 
      hover={hover} 
      className={className}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <CardHeader>
          {title && (
            <Typography variant="h6" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardHeader>
      )}
      
      <CardContent sx={{ padding: padding }}>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ padding: 2, justifyContent: 'flex-end' }}>
          {actions}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default Card;
