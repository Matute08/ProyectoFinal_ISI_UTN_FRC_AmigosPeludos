import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../auth/firebase";
import { mostrarAlertaError, mostrarAlertaExito } from "../../utils/showAlert";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oobCode, setOobCode] = useState("");

  useEffect(() => {
    // Obtener el código de reset de la URL
    const code = searchParams.get("oobCode");
    if (!code) {
      setError("Enlace de recuperación inválido o expirado");
      return;
    }
    setOobCode(code);
  }, [searchParams]);

  const validatePassword = (password) => {
    const minLength = 6;
    if (password.length < minLength) {
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!oobCode) {
      setError("Enlace de recuperación inválido");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      mostrarAlertaExito("Contraseña actualizada exitosamente", "/login");
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
      
      switch (error.code) {
        case "auth/expired-action-code":
          setError("El enlace de recuperación ha expirado. Solicita uno nuevo.");
          break;
        case "auth/invalid-action-code":
          setError("El enlace de recuperación es inválido.");
          break;
        case "auth/weak-password":
          setError("La contraseña es demasiado débil. Usa una contraseña más segura.");
          break;
        default:
          setError("Error al actualizar la contraseña. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 420, width: "100%", p: 4 }}>
        <Box textAlign="center" mb={3}>
          <img
            src="/logo-amigos-peludos.png"
            alt="Logo"
            style={{ height: 80, marginBottom: 16 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Restablecer Contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingresa tu nueva contraseña para continuar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nueva Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Mínimo 6 caracteres"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || !oobCode}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#27642a" },
            }}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleBackToLogin}
            sx={{ textTransform: "none" }}
          >
            Volver al Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
