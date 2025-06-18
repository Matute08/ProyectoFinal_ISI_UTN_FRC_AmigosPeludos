import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Alert,
    CircularProgress,
    Paper,
    InputAdornment,
    IconButton,
    Link as MuiLink,
    MenuItem,
    Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { postNuevoUsuario, getUserMail, updateUser } from "../../api/userApi";
import SelectBarrio from "../../components/select/SelectBarrio";
import SelectCiudad from "../../components/select/SelectCiudad";
import SelectProvincia from "../../components/select/SelectProvincia";
import SelectGenero from "../../components/select/SelectGenero"

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            provinciaId: "",
            ciudadId: "",
            barrioId: "",
        },
        mode: "onBlur",
    });

    const navigate = useNavigate();
    const { register } = useAuth();

    const onSubmit = async (data) => {
        setError(null);
        setLoading(true);

        console.log(data)
        try {
            const isUser = await getUserMail(data.mail);
            const userCredential = await register(data.mail, data.password);

            if (userCredential) {
                data.habilitada = true;

                if (isUser) {
                    await updateUser(isUser.id, data);
                } else {
                    data.tipoAutenticacionId = 1;
                    data.rolId = 2;
                    await postNuevoUsuario(data);
                }

                navigate("/");
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("El correo electrónico ya está registrado.");
            } else {
                setError("Ocurrió un error al registrarse.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "url('/fondo-login.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <Paper elevation={6} sx={{ maxWidth: 800, width: "100%", p: 4 }}>
                <Box textAlign="center" mb={3}>
                    <img
                        src="/logo-amigos-peludos.png"
                        alt="Logo"
                        style={{ height: 80, marginBottom: 8 }}
                    />
                    <Typography variant="h4" gutterBottom>
                        ¡Unite a Amigos Peludos!
                    </Typography>
                    <Typography variant="subtitle1">
                        Completá tus datos para comenzar a cuidar y ayudar a las
                        mascotas 💖
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Nombre completo"
                                {...registerField("nombreCompleto", {
                                    required: "El nombre es obligatorio",
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Solo letras y espacios",
                                    },
                                })}
                                error={!!errors.nombreCompleto}
                                helperText={errors.nombreCompleto?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Correo electrónico"
                                {...registerField("mail", {
                                    required: "El Email es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Formato de email inválido",
                                    },
                                })}
                                error={!!errors.mail}
                                helperText={errors.mail?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                {...registerField("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Debe tener al menos 8 caracteres",
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <SelectGenero
                                value={watch("generoId")}
                                onChange={(e) =>
                                    setValue("generoId", e.target.value)
                                }
                                error={!!errors.generoId}
                                helperText={errors.generoId?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Número de celular"
                                {...registerField("celular", {
                                    required: "El celular es obligatorio",
                                })}
                                error={!!errors.celular}
                                helperText={errors.celular?.message}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <SelectProvincia
                                value={watch("provinciaId")}
                                onChange={(e) =>
                                    setValue("provinciaId", e.target.value)
                                }
                                error={!!errors.provinciaId}
                                helperText={errors.provinciaId?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <SelectCiudad
                                provinciaId={watch("provinciaId")}
                                value={watch("ciudadId")}
                                onChange={(e) =>
                                    setValue("ciudadId", e.target.value)
                                }
                                error={!!errors.ciudadId}
                                helperText={errors.ciudadId?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <SelectBarrio
                                ciudadId={watch("ciudadId")}
                                value={watch("barrioId")}
                                onChange={(e) =>
                                    setValue("barrioId", e.target.value)
                                }
                                error={!!errors.barrioId}
                                helperText={errors.barrioId?.message}
                            ></SelectBarrio>
                        </Grid>

                        <Grid item size={{ xs: 12 , md:6 }}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                {...registerField("calle", {
                                    required: "La dirección es obligatoria",
                                })}
                                error={!!errors.calle}
                                helperText={errors.calle?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md:6 }}>
                            <TextField
                                fullWidth
                                label="Altura"
                                {...registerField("nroCalle", {
                                    required: "La altura es obligatoria",
                                })}
                                error={!!errors.nroCalle}
                                helperText={errors.nroCalle?.message}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" mt={2}>
                        Al registrarte, aceptás nuestros{" "}
                        <MuiLink href="#" underline="hover">
                            Términos y Condiciones
                        </MuiLink>
                        .
                    </Typography>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            backgroundColor: "#2e7d32",
                            "&:hover": { backgroundColor: "#27642a" },
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Registrarme"
                        )}
                    </Button>
                </form>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        ¿Ya tenés una cuenta?{" "}
                        <MuiLink href="/iniciar-sesion" underline="hover">
                            Iniciá sesión
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register;
