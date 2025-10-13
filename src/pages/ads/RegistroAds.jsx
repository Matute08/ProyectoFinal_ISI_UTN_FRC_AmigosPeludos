import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    useTheme,
    Paper,
} from "@mui/material";
import {
    CloudUpload,
    Link,
    Phone,
    LocationOn,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { uploadFilesPublicidades } from "../../api/firebaseUploads";
import { getTiposAnunciante, crearPublicidad } from "../../api/publicidadesApi";
import { mostrarAlertaExito, mostrarAlertaError, mostrarAlertaInfo } from "../../utils/showAlert";
import Swal from "sweetalert2";

const RegistroAds = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userData } = useAuth();
    const planSeleccionado = location.state?.planPublicidad;
    const ubicacionIdSeleccionada = location.state?.ubicacionId;

    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        imagen: null,
        imagenPreview: "",
        url: "",
        tipoAnunciante: "",
        telefono: "",
        direccion: "",
    });

    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [tiposAnunciante, setTiposAnunciante] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);


    // Cargar tipos de anunciantes al montar el componente
    useEffect(() => {
        const cargarTiposAnunciante = async () => {
            try {
                setLoadingTipos(true);
                const tipos = await getTiposAnunciante();
                setTiposAnunciante(tipos);
            } catch (error) {
                console.error('Error al cargar tipos de anunciante:', error);
                mostrarAlertaError("Error al cargar tipos de anunciante");
            } finally {
                setLoadingTipos(false);
            }
        };

        cargarTiposAnunciante();
    }, []);

    const mostrarAlertaCarga = () => {
        Swal.fire({
            title: "Registrando solicitud...",
            text: "Por favor espera mientras procesamos tu solicitud",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            customClass: {
                container: 'swal-over-mui'
            },
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    swalContainer.style.zIndex = '9999';
                }
            }
        });
    };

    const cerrarAlertaCarga = () => {
        Swal.close();
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === "imagen" && files && files[0]) {
            const file = files[0];
            
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors((prev) => ({
                    ...prev,
                    imagen: "Por favor selecciona un archivo de imagen válido"
                }));
                return;
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    imagen: "La imagen no puede exceder 5MB"
                }));
                return;
            }
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({
                    ...prev,
                    imagen: file,
                    imagenPreview: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Limpiar error cuando el usuario empiece a escribir/seleccionar
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = "El título es requerido";
        } else if (formData.titulo.length > 200) {
            newErrors.titulo = "El título no puede exceder 200 caracteres";
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es requerida";
        } else if (formData.descripcion.length > 110) {
            newErrors.descripcion = "La descripción no puede exceder 110 caracteres";
        }

        if (!formData.imagen) {
            newErrors.imagen = "La imagen es requerida";
        }

        if (formData.url && formData.url.length > 500) {
            newErrors.url = "La URL no puede exceder 500 caracteres";
        }

        if (!formData.tipoAnunciante) {
            newErrors.tipoAnunciante = "El tipo de anunciante es requerido";
        }

        if (formData.telefono && formData.telefono.length > 20) {
            newErrors.telefono = "El teléfono no puede exceder 20 caracteres";
        }

        if (formData.direccion && formData.direccion.length > 200) {
            newErrors.direccion = "La dirección no puede exceder 200 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar que el usuario esté autenticado
        if (!user || !userData?.id) {
            mostrarAlertaError("Debes estar autenticado para crear una publicidad");
            navigate('/login');
            return;
        }

        if (!validateForm()) {
            mostrarAlertaError("Por favor, corrige los errores en el formulario");
            return;
        }

        setIsUploading(true);
        mostrarAlertaCarga();

        try {
            // Subir imagen a Firebase
            let imagenUrl = "";
            if (formData.imagen) {
                imagenUrl = await uploadFilesPublicidades(formData.imagen);
            }

            // Usar el ID de ubicación pasado como parámetro
            const ubicacionId = ubicacionIdSeleccionada || 1; // Default: Home si no se pasa ID

            const publicidadData = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                imagen: imagenUrl, // URL de Firebase
                url: formData.url,
                tipoanunciante: parseInt(formData.tipoAnunciante), // ID del tipo de anunciante
                telefono: formData.telefono,
                direccion: formData.direccion,
                ubicacion: ubicacionId, // ID de ubicación
                estadoid: 5, // Estado pendiente de aprobación
                activa: true,
                usuario_id: userData?.id, // ID del usuario que crea la publicidad
            };

            // Enviar datos al backend
            const response = await crearPublicidad(publicidadData);

            cerrarAlertaCarga();
            mostrarAlertaExito("¡Solicitud registrada exitosamente! Te contactaremos pronto para coordinar el pago y activación.");

            // Limpiar formulario
            setFormData({
                titulo: "",
                descripcion: "",
                imagen: null,
                imagenPreview: "",
                url: "",
                tipoAnunciante: "",
                telefono: "",
                direccion: "",
            });

            // Redirigir después del mensaje de éxito
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } catch (error) {
            console.error("Error al registrar publicidad:", error);
            cerrarAlertaCarga();
            mostrarAlertaError("Error al registrar la solicitud. Inténtalo de nuevo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
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
                {/* Header */}
                <Box textAlign="center" mb={3}>
                    <img
                        src="/logo-amigos-peludos.png"
                        alt="Logo"
                        style={{ height: 80, marginBottom: 8 }}
                    />
                    <Typography variant="h4" gutterBottom>
                        Registro de Publicidad
                    </Typography>
                    <Typography variant="subtitle1">
                        Completa los datos para registrar tu publicidad y llegar a más clientes 💼
                    </Typography>
                </Box>

                {planSeleccionado && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Plan seleccionado: {planSeleccionado.nombre}
                        </Typography>
                        <Typography variant="body2">
                            Precio: ${planSeleccionado.precio?.toLocaleString()}/mes
                        </Typography>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Título de la publicidad"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                error={!!errors.titulo}
                                helperText={errors.titulo || "Máximo 200 caracteres"}
                                required
                                placeholder="Ej: Veterinaria San Pedro - Atención 24hs"
                            />
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                error={!!errors.descripcion}
                                helperText={errors.descripcion || "Máximo 110 caracteres"}
                                multiline
                                rows={3}
                                required
                                placeholder="Describe tu servicio o negocio..."
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl
                                fullWidth
                                error={!!errors.tipoAnunciante}
                                required
                            >
                                <InputLabel>Tipo de anunciante</InputLabel>
                                <Select
                                    name="tipoAnunciante"
                                    value={formData.tipoAnunciante}
                                    onChange={handleInputChange}
                                    label="Tipo de anunciante"
                                    disabled={loadingTipos}
                                >
                                    {loadingTipos ? (
                                        <MenuItem disabled>
                                            Cargando tipos...
                                        </MenuItem>
                                    ) : tiposAnunciante.length === 0 ? (
                                        <MenuItem disabled>
                                            No hay tipos disponibles
                                        </MenuItem>
                                    ) : (
                                        tiposAnunciante.map((tipo) => (
                                            <MenuItem key={tipo.id} value={tipo.id}>
                                                {tipo.nombre}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                            {errors.tipoAnunciante && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5, display: "block" }}
                                >
                                    {errors.tipoAnunciante}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Box>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="imagen-upload"
                                    type="file"
                                    name="imagen"
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="imagen-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                    >
                                        {formData.imagen ? 'Imagen seleccionada' : 'Seleccionar imagen'}
                                    </Button>
                                </label>
                                {errors.imagen && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 0.5, display: "block" }}
                                    >
                                        {errors.imagen}
                                    </Typography>
                                )}
                                {formData.imagen && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Archivo: {formData.imagen.name}
                                        </Typography>
                                        <Box
                                            component="img"
                                            src={formData.imagenPreview}
                                            alt="Preview"
                                            sx={{
                                                width: '100%',
                                                maxHeight: 150,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                mt: 1,
                                            }}
                                        />
                                    </Box>
                                )}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 1, display: "block" }}
                                >
                                    Formatos: JPG, PNG, GIF. Máximo 5MB
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="URL del sitio web (opcional)"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                error={!!errors.url}
                                helperText={errors.url || "Enlace a tu sitio web o redes sociales"}
                                placeholder="https://tu-sitio-web.com"
                                InputProps={{
                                    startAdornment: <Link sx={{ mr: 1, color: "text.secondary" }} />,
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Teléfono (opcional)"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                error={!!errors.telefono}
                                helperText={errors.telefono || "Máximo 20 caracteres"}
                                placeholder="+54 9 11 1234-5678"
                                InputProps={{
                                    startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Dirección (opcional)"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                error={!!errors.direccion}
                                helperText={errors.direccion || "Máximo 200 caracteres"}
                                placeholder="Av. Corrientes 1234, CABA"
                                InputProps={{
                                    startAdornment: <LocationOn sx={{ mr: 1, color: "text.secondary" }} />,
                                }}
                            />
                        </Grid>
                            </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            backgroundColor: "#2e7d32",
                            "&:hover": { backgroundColor: "#27642a" },
                        }}
                        disabled={isUploading}
                    >
                        Registrar Solicitud
                    </Button>
                </form>

                <Typography variant="body2" color="text.secondary" mt={2}>
                    Al registrar tu publicidad, aceptás nuestros Terminos y Condiciones.
                    
                    
                </Typography>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        <strong>Nota:</strong> Una vez registrada tu publicidad, será revisada por nuestro equipo.
                        Te contactaremos para coordinar el pago y activación. Las fechas de inicio y fin se
                        configurarán según el plan seleccionado.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegistroAds;
