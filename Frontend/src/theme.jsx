import { createTheme, alpha } from '@mui/material/styles';

// Define color constants for better consistency
const primaryMain = '#0d47a1';
const primaryLight = '#5472d3';
const primaryDark = '#002171';
const secondaryMain = '#00c853';
const secondaryLight = '#5efc82';
const secondaryDark = '#009624';
const neutralGrey = '#f5f7fa';
const darkGrey = '#263238';

const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: '#ffffff',
    },
    background: {
      default: neutralGrey,
      paper: '#ffffff',
    },
    text: {
      primary: darkGrey,
      secondary: alpha(darkGrey, 0.7),
    },
    divider: alpha('#000000', 0.08),
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
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
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      lineHeight: 1.75,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      lineHeight: 1.6,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    '0 25px 50px -12px rgba(0,0,0,0.25)',
    ...Array(19).fill('none'), // Fill remaining slots to match MUI's shadow array length
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(primaryMain, 0.05),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(primaryMain, 0.2),
            borderRadius: 8,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          },
        },
        sizeLarge: {
          padding: '12px 26px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryMain} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${secondaryMain} 0%, ${secondaryDark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${secondaryDark} 0%, ${secondaryMain} 100%)`,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 5px 22px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.03)',
        },
        elevation3: {
          boxShadow: '0 10px 20px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.03)',
        },
        elevation4: {
          boxShadow: '0 15px 25px rgba(0,0,0,0.07), 0 5px 10px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: alpha('#000000', 0.1),
            },
            '&:hover fieldset': {
              borderColor: alpha(primaryMain, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryMain,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(primaryMain, 0.08),
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(primaryMain, 0.1),
          color: primaryMain,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha(primaryMain, 0.1),
          color: primaryMain,
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.2),
          },
        },
        outlined: {
          borderColor: alpha(primaryMain, 0.3),
          color: primaryMain,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          margin: '8px 0',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: primaryMain,
              opacity: 1,
              border: 'none',
            },
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#e0e0e0',
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: darkGrey,
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '8px 12px',
          fontWeight: 500,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#000000', 0.08),
        },
      },
    },
  },
});

export default theme;