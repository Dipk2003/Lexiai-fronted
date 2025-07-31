import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
    };
    surface: {
      light: string;
      main: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
    };
    surface?: {
      light?: string;
      main?: string;
      dark?: string;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8A50',
      dark: '#E55100',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#388E3C',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
      secondary: 'linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)',
    },
    surface: {
      light: '#FAFAFA',
      main: '#F5F5F5',
      dark: '#EEEEEE',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05)',
    '0px 1px 6px rgba(0, 0, 0, 0.07)',
    '0px 3px 12px rgba(0, 0, 0, 0.09)',
    '0px 4px 16px rgba(0, 0, 0, 0.11)',
    '0px 6px 24px rgba(0, 0, 0, 0.13)',
    '0px 8px 32px rgba(0, 0, 0, 0.15)',
    '0px 12px 40px rgba(0, 0, 0, 0.17)',
    '0px 16px 48px rgba(0, 0, 0, 0.19)',
    '0px 20px 56px rgba(0, 0, 0, 0.21)',
    '0px 24px 64px rgba(0, 0, 0, 0.23)',
    ...Array(14).fill('0px 24px 64px rgba(0, 0, 0, 0.23)'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          box-sizing: border-box;
        }
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        body {
          margin: 0;
          padding: 0;
        }
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export default theme;
