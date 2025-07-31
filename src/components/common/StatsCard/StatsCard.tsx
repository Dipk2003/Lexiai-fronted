import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  gradient?: boolean;
  onClick?: () => void;
  onMoreClick?: () => void;
}

const StyledCard = styled(Card)<{ 
  gradient: boolean; 
  colorScheme: string;
  clickable: boolean;
}>(({ theme, gradient, colorScheme, clickable }) => ({
  height: '100%',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  cursor: clickable ? 'pointer' : 'default',
  
  ...(gradient && {
    background: theme.palette[colorScheme as keyof typeof theme.palette]?.main
      ? `linear-gradient(135deg, ${theme.palette[colorScheme as keyof typeof theme.palette].main} 0%, ${theme.palette[colorScheme as keyof typeof theme.palette].light} 100%)`
      : theme.palette.gradient?.primary,
    color: theme.palette.common.white,
    
    '& .MuiTypography-root': {
      color: 'inherit',
    },
    
    '& .MuiIconButton-root': {
      color: 'inherit',
    },
  }),
  
  '&:hover': clickable ? {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  } : {},
  
  '&::before': gradient ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } : {},
  
  '&:hover::before': gradient && clickable ? {
    opacity: 1,
  } : {},
}));

const IconContainer = styled(Box)<{ gradient: boolean; colorScheme: string }>(
  ({ theme, gradient, colorScheme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: theme.shape.borderRadius * 1.5,
    
    ...(!gradient && {
      backgroundColor: theme.palette[colorScheme as keyof typeof theme.palette]?.main + '20',
      color: theme.palette[colorScheme as keyof typeof theme.palette]?.main,
    }),
    
    ...(gradient && {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'inherit',
    }),
  })
);

const TrendContainer = styled(Box)<{ direction: 'up' | 'down' }>(
  ({ theme, direction }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: direction === 'up' ? theme.palette.success.main : theme.palette.error.main,
    fontSize: '0.875rem',
    fontWeight: 500,
  })
);

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  gradient = false,
  onClick,
  onMoreClick,
}) => {
  const theme = useTheme();

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <StyledCard
      gradient={gradient}
      colorScheme={color}
      clickable={!!onClick}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        {onMoreClick && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        )}

        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box>
            <Typography
              variant="body2"
              component="div"
              sx={{
                opacity: gradient ? 0.9 : 0.7,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: '2rem',
                lineHeight: 1.2,
                mt: 1,
              }}
            >
              {formatValue(value)}
            </Typography>
          </Box>

          {icon && (
            <IconContainer gradient={gradient} colorScheme={color}>
              {icon}
            </IconContainer>
          )}
        </Box>

        {(subtitle || trend) && (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  opacity: gradient ? 0.8 : 0.6,
                  fontSize: '0.75rem',
                }}
              >
                {subtitle}
              </Typography>
            )}

            {trend && (
              <TrendContainer direction={trend.direction}>
                {trend.direction === 'up' ? (
                  <TrendingUpIcon fontSize="small" />
                ) : (
                  <TrendingDownIcon fontSize="small" />
                )}
                <span>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                  {trend.period && ` ${trend.period}`}
                </span>
              </TrendContainer>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
