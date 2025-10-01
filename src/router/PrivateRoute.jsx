import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Box, CircularProgress } from "@mui/material";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
