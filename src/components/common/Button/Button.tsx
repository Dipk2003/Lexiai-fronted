import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled(MuiButton)<{ customVariant: ButtonProps['variant'] }>(({ theme, customVariant }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.2s ease-in-out',
  
  ...(customVariant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  }),
  
  ...(customVariant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  }),
  
  ...(customVariant === 'outline' && {
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-1px)',
    },
  }),
  
  ...(customVariant === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      transform: 'translateY(-1px)',
    },
  }),
  
  ...(customVariant === 'text' && {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}));

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  loading = false, 
  children, 
  disabled,
  ...props 
}) => {
  return (
    <StyledButton
      customVariant={variant}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
