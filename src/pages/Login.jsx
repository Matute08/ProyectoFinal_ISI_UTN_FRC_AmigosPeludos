import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { mostrarAlertaError, mostrarAlertaExito } from "../utils/showAlert"; 

export default function Login() {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      mostrarAlertaExito("Bienvenido de nuevo! :)", "/")
    } catch (err) {
      mostrarAlertaError("No se encuentra registrado")
      //alert("Error al iniciar sesión: " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      alert("Error con Google: " + err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      mostrarAlertaError("Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      await resetPassword(resetEmail);
      mostrarAlertaExito("Se ha enviado un correo de recuperación a tu email");
      setOpenResetDialog(false);
      setResetEmail("");
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        mostrarAlertaError("No existe una cuenta con este correo electrónico");
      } else if (error.code === 'auth/invalid-email') {
        mostrarAlertaError("El formato del correo electrónico no es válido");
      } else {
        mostrarAlertaError("Error al enviar el correo de recuperación");
      }
    }
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
        <Box textAlign="center" mb={2}>
          <img
            src="/logo-amigos-peludos.png"
            alt="Logo"
            style={{ height: 80, marginBottom: 8 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ¡Bienvenido de nuevo!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Iniciá sesión para continuar en Amigos Peludos
          </Typography>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Correo Electrónico"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                size="small"
              />
            }
            label="Recordarme"
          /> */}
          <Link 
            component="button"
            variant="body2"
            onClick={() => setOpenResetDialog(true)}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            ¿Olvidó su contraseña?
          </Link>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#2e7d32",
            "&:hover": { backgroundColor: "#27642a" },
          }}
          onClick={handleLogin}
        >
          Iniciar Sesión
        </Button>

        <Divider sx={{ my: 3 }}></Divider>

        {/* <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogle}
          sx={{ textTransform: "none" }}
        >
          Ingresar con Google
        </Button> */}

        <Typography variant="body2" textAlign="center" mt={3}>
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" underline="hover">
            Registrate
          </Link>
        </Typography>
      </Paper>

      {/* Modal para reset de contraseña */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Typography>
          <TextField
            fullWidth
            label="Correo Electrónico"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="ejemplo@gmail.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleResetPassword}
            variant="contained"
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#27642a" },
            }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
