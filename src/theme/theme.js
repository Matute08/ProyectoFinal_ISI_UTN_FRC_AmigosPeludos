import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F4A261", // naranja cálido (principal)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8D6E63", // marrón suave
    },
    background: {
      default: "#FFF3E0", // fondo general crema claro
      paper: "#FFFFFF",   // fondo de tarjetas, inputs
    },
    success: {
      main: "#2E7D32", // verde para confirmar
    },
    info: {
      main: "#039BE5", // azul para info o volver
    },
    error: {
      main: "#E53935", // rojo cálido
    },
    text: {
      primary: "#333333",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h5: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
        fullWidth: true,
        InputLabelProps: { shrink: true },
      },
      styleOverrides: {
        root: {
          marginBottom: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
      
          padding: 16,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFF3E0",
          paddingTop: 24,
          paddingBottom: 24,
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
