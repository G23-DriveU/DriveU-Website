import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          ":hover": {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
  },
});

export default theme;