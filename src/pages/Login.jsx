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
} from "@mui/material";
import { mostrarAlertaError, mostrarAlertaExito } from "../utils/showAlert"; 

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
            Bienvenido de nuevo !
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
          <Link href="#" variant="body2">
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
    </Box>
  );
}
