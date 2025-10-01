import { useState, useEffect } from "react";
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
  Backdrop,
} from "@mui/material";
import { mostrarAlertaError, mostrarAlertaExito } from "../utils/showAlert";
import CustomLoader from "../components/CustomLoader"; 

export default function Login() {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  // Cargar credenciales guardadas al montar el componente
  useEffect(() => {
    const savedEmail = localStorage.getItem("loginEmail");
    const savedPassword = localStorage.getItem("loginPassword");
    const savedRemember = localStorage.getItem("loginRemember");
    
    if (savedRemember === "true" && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  // Limpiar credenciales solo cuando se desmarca "recordarme"
  useEffect(() => {
    if (!remember) {
      // Solo limpiar si ya había credenciales guardadas
      const savedEmail = localStorage.getItem("loginEmail");
      const savedPassword = localStorage.getItem("loginPassword");
      
      if (savedEmail || savedPassword) {
        setEmail("");
        setPassword("");
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("loginPassword");
      }
    }
  }, [remember]);

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email.trim()) {
      mostrarAlertaError("Por favor ingresa tu correo electrónico");
      return;
    }
    
    if (!password.trim()) {
      mostrarAlertaError("Por favor ingresa tu contraseña");
      return;
    }

    try {
      await login(email.trim(), password);
      
      // Guardar credenciales solo si se marca "recordarme"
      if (remember && email && password) {
        localStorage.setItem("loginEmail", email);
        localStorage.setItem("loginPassword", password);
        localStorage.setItem("loginRemember", "true");
      } else if (!remember) {
        // Limpiar credenciales si no se marca "recordarme"
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("loginPassword");
        localStorage.removeItem("loginRemember");
      }
      
      // Mostrar mensaje de éxito y redirigir
      mostrarAlertaExito("Sesión iniciada correctamente", "/")
      
      // Activar overlay de bloqueo después de un pequeño delay
      setTimeout(() => {
        setIsRedirecting(true);
      }, 200);
    } catch (err) {
      console.error("Error de login:", err);
      
      // Manejo específico de errores de Firebase
      if (err.code === 'auth/user-not-found') {
        mostrarAlertaError("No existe una cuenta con este correo electrónico");
      } else if (err.code === 'auth/wrong-password') {
        mostrarAlertaError("La contraseña es incorrecta");
      } else if (err.code === 'auth/invalid-email') {
        mostrarAlertaError("El formato del correo electrónico no es válido");
      } else if (err.code === 'auth/too-many-requests') {
        mostrarAlertaError("Demasiados intentos fallidos. Intenta más tarde");
      } else if (err.code === 'auth/user-disabled') {
        mostrarAlertaError("Esta cuenta ha sido deshabilitada");
      } else if (err.code === 'auth/network-request-failed') {
        mostrarAlertaError("Error de conexión. Verifica tu internet");
      } else {
        mostrarAlertaError("Error al iniciar sesión: " + (err.message || "Credenciales incorrectas"));
      }
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
      console.error("Error al resetear contraseña:", error);
      
      if (error.code === 'auth/user-not-found') {
        mostrarAlertaError("No existe una cuenta con este correo electrónico");
      } else if (error.code === 'auth/invalid-email') {
        mostrarAlertaError("El formato del correo electrónico no es válido");
      } else if (error.code === 'auth/too-many-requests') {
        mostrarAlertaError("Demasiados intentos. Intenta más tarde");
      } else if (error.code === 'auth/network-request-failed') {
        mostrarAlertaError("Error de conexión. Verifica tu internet");
      } else if (error.code === 'auth/invalid-action-code') {
        mostrarAlertaError("Error en la configuración del enlace. Contacta soporte");
      } else {
        mostrarAlertaError(`Error al enviar el correo de recuperación: ${error.message || "Error desconocido"}`);
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
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                size="small"
              />
            }
            label="Recordarme"
          />
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
      <Dialog 
        open={openResetDialog} 
        onClose={() => setOpenResetDialog(false)}
        sx={{
          '& .MuiDialog-root': {
            zIndex: 1300 // Menor que SweetAlert2 (9999)
          },
          '& .MuiDialog-paper': {
            zIndex: 1300
          }
        }}
      >
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

      {/* Overlay de bloqueo durante redirección */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 1050, // Menor que SweetAlert2 (1060) pero mayor que otros elementos
          backgroundColor: 'rgba(48, 46, 46, 0.7)'
        }}
        open={isRedirecting}
      >
        <CustomLoader text="Redirigiendo..." />
      </Backdrop>
    </Box>
  );
}
