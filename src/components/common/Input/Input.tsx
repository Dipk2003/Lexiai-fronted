import React from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'filled' | 'outlined' | 'standard' | 'search';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
}

const StyledTextField = styled(TextField)<{ customVariant: InputProps['variant'] }>(
  ({ theme, customVariant }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1.5),
      transition: 'all 0.2s ease-in-out',
      
      ...(customVariant === 'search' && {
        borderRadius: theme.spacing(3),
        paddingRight: theme.spacing(1),
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 2,
          borderColor: theme.palette.primary.main,
        },
      }),
      
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.action.hover,
      },
      
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: 2,
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
        },
      },
      
      '&.Mui-error': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.error.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          boxShadow: `0 0 0 3px ${theme.palette.error.main}20`,
        },
      },
    },
    
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    
    '& .MuiFormHelperText-root': {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(0.5),
    },
  })
);

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  startIcon,
  endIcon,
  error = false,
  helperText,
  ...props
}) => {
  const getVariant = () => {
    if (variant === 'search') return 'outlined';
    return variant as 'filled' | 'outlined' | 'standard';
  };

  return (
    <StyledTextField
      customVariant={variant}
      variant={getVariant()}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
        ...props.InputProps,
      }}
      {...props}
    />
  );
};

export default Input;
