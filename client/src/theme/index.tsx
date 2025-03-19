import { createTheme, alpha } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'IRANSans, Vazirmatn, Arial',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '1.6rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          '@media (max-width:600px)': {
            padding: '6px 12px',
            fontSize: '0.8rem',
          },
          '&.MuiButton-contained': {
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '6px',
          },
        },
        sizeSmall: {
          '@media (max-width:600px)': {
            padding: '4px',
          },
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: '1.2rem',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px 6px',
          },
        },
        sizeSmall: {
          '@media (max-width:600px)': {
            padding: '6px 4px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          '@media (max-width:600px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          },
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      light: '#6573c3',
      main: '#3f51b5',
      dark: '#2c387e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f73378',
      main: '#f50057',
      dark: '#ab003c',
      contrastText: '#fff',
    },
    error: {
      light: '#ef5350',
      main: '#f44336',
      dark: '#d32f2f',
    },
    warning: {
      light: '#ff9800',
      main: '#ed6c02',
      dark: '#e65100',
    },
    info: {
      light: '#03a9f4',
      main: '#0288d1',
      dark: '#01579b',
    },
    success: {
      light: '#4caf50',
      main: '#2e7d32',
      dark: '#1b5e20',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
}, faIR);

export default theme; 