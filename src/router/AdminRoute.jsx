import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { CircularProgress, Container, Typography, Box } from "@mui/material";

export default function AdminRoute({ children }) {
  const { user, userData, loading } = useAuth();

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando datos del usuario...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay datos del usuario o no es administrador, redirigir al home
  if (!userData || userData.rolId !== 1) {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, mostrar el contenido
  return children;
}
