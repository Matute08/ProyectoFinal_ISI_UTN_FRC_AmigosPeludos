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
    Container,
    CircularProgress,
} from "@mui/material";
import {
    CloudUpload,
    Link,
    Phone,
    LocationOn,
    ArrowBack,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { uploadFilesPublicidades } from "../../api/firebaseUploads";
import { getTiposAnunciante, actualizarPublicidad } from "../../api/publicidadesApi";
import { mostrarAlertaExito, mostrarAlertaError, mostrarAlertaInfo } from "../../utils/showAlert";
import Swal from "sweetalert2";
import CustomLoader from "../../components/CustomLoader";

const EditarPublicidad = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user, userData } = useAuth();
    
    // Obtener datos de la publicidad desde el estado de navegación
    const publicidadData = location.state?.publicidadData;

    // Estados principales siguiendo patrones del sistema
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [initialData, setInitialData] = useState(null);

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
    const [tiposAnunciante, setTiposAnunciante] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);

    // Cargar datos siguiendo patrones del sistema
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setSubmitError(null);
                
                // Cargar tipos de anunciantes y datos de la publicidad en paralelo
                const [tipos] = await Promise.all([
                    getTiposAnunciante(),
                ]);
                
                setTiposAnunciante(tipos);
                
                // Cargar datos de la publicidad si están disponibles
                if (publicidadData) {
                    setInitialData(publicidadData);
                    setFormData({
                        titulo: publicidadData.titulo || "",
                        descripcion: publicidadData.descripcion || "",
                        imagen: null,
                        imagenPreview: publicidadData.imagen || "",
                        url: publicidadData.url || "",
                        tipoAnunciante: publicidadData.tipoAnunciante?.id || "",
                        telefono: publicidadData.telefono || "",
                        direccion: publicidadData.direccion || "",
                    });
                } else {
                    // Si no hay datos, redirigir
                    mostrarAlertaError("No se encontraron datos de la publicidad");
                    navigate("/mis-estadisticas");
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setSubmitError("Error al cargar los datos");
                mostrarAlertaError("Error al cargar los datos");
            } finally {
                setLoading(false);
                setLoadingTipos(false);
            }
        };

        if (userData?.id) {
            fetchData();
        }
    }, [userData, publicidadData, navigate]);

    const mostrarAlertaCarga = () => {
        Swal.fire({
            title: "Actualizando publicidad...",
            text: "Por favor espera mientras procesamos los cambios",
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
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    imagen: "Solo se permiten archivos JPG, JPEG o PNG"
                }));
                return;
            }
            
            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    imagen: "El archivo no puede superar los 5MB"
                }));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    imagen: file,
                    imagenPreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
            
            // Limpiar error de imagen
            setErrors(prev => ({
                ...prev,
                imagen: null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            
            // Limpiar error del campo
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = "El título es obligatorio";
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es obligatoria";
        } else if (formData.descripcion.length > 110) {
            newErrors.descripcion = "La descripción no puede exceder 110 caracteres";
        }

        if (!formData.tipoAnunciante) {
            newErrors.tipoAnunciante = "Debes seleccionar un tipo de anunciante";
        }

        if (formData.url && !isValidUrl(formData.url)) {
            newErrors.url = "Ingresa una URL válida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            // Si la URL no tiene protocolo, agregar https://
            let urlToTest = string;
            if (!string.match(/^https?:\/\//i)) {
                urlToTest = `https://${string}`;
            }
            new URL(urlToTest);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSubmitError("Por favor corrige los errores antes de continuar");
            mostrarAlertaError("Por favor corrige los errores antes de continuar");
            return;
        }

        try {
            setSubmitLoading(true);
            setSubmitError(null);
            mostrarAlertaCarga();

            let imagenUrl = formData.imagenPreview;
            
            // Si hay una nueva imagen, subirla
            if (formData.imagen) {
                const archivo = formData.imagen;
                const nombreArchivo = `${Date.now()}-${archivo.name}`;
                imagenUrl = await uploadFilesPublicidades(archivo, nombreArchivo);
            }

            // Procesar URL para agregar protocolo si es necesario
            let urlProcesada = null;
            if (formData.url.trim()) {
                urlProcesada = formData.url.trim();
                if (!urlProcesada.match(/^https?:\/\//i)) {
                    urlProcesada = `https://${urlProcesada}`;
                }
            }

            const publicidadData = {
                titulo: formData.titulo.trim(),
                descripcion: formData.descripcion.trim(),
                imagen: imagenUrl,
                url: urlProcesada,
                tipoAnuncianteId: parseInt(formData.tipoAnunciante),
                telefono: formData.telefono.trim() || null,
                direccion: formData.direccion.trim() || null,
                usuariosId: userData.id
            };

            await actualizarPublicidad(id, publicidadData);
            
            cerrarAlertaCarga();
            mostrarAlertaExito("Publicidad actualizada correctamente");
            navigate("/mis-estadisticas");
            
        } catch (error) {
            cerrarAlertaCarga();
            console.error("Error al actualizar publicidad:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al actualizar la publicidad";
            setSubmitError(errorMessage);
            mostrarAlertaError(errorMessage);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5 }}>
                <CustomLoader />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Cargando datos de la publicidad...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/mis-estadisticas")}
                    sx={{ mb: 2 }}
                >
                    Volver a Mis Estadísticas
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    Editar Publicidad
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Modifica los datos de tu publicidad
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4 }}>
                {submitError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {submitError}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                         {/* Imagen */}
                         <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom>
                                Imagen de la publicidad
                            </Typography>
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
                                    sx={{ mb: 2 }}
                                >
                                    Seleccionar imagen
                                </Button>
                            </label>
                            {formData.imagenPreview && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={formData.imagenPreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Box>
                            )}
                            {errors.imagen && (
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    {errors.imagen}
                                </Alert>
                            )}
                        </Grid>
                        {/* Título */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Título de la publicidad"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                error={!!errors.titulo}
                                helperText={errors.titulo}
                                required
                            />
                        </Grid>
{/* Tipo de Anunciante */}
<Grid size={{ xs: 12, md: 12 }}>
                            <FormControl fullWidth error={!!errors.tipoAnunciante}>
                                <InputLabel>Tipo de Anunciante</InputLabel>
                                <Select
                                    name="tipoAnunciante"
                                    value={formData.tipoAnunciante}
                                    onChange={handleInputChange}
                                    label="Tipo de Anunciante"
                                    disabled={loadingTipos}
                                >
                                    {tiposAnunciante.map((tipo) => (
                                        <MenuItem key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.tipoAnunciante && (
                                    <Typography variant="caption" color="error">
                                        {errors.tipoAnunciante}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                       

                       

                        {/* URL */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="URL (opcional)"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                error={!!errors.url}
                                helperText={errors.url}
                                InputProps={{
                                    startAdornment: <Link sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>

                        

                        {/* Teléfono */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Teléfono (opcional)"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>

                        {/* Dirección */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Dirección (opcional)"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>
                         {/* Descripción */}
                         <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                error={!!errors.descripcion}
                                inputProps={{ maxLength: 110 }}
                                helperText={errors.descripcion || `${formData.descripcion.length}/110 caracteres`}
                                required
                            />
                        </Grid>

                        {/* Botones */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/mis-estadisticas")}
                                    disabled={submitLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitLoading}
                                    startIcon={submitLoading ? <CircularProgress size={20} /> : null}
                                >
                                    {submitLoading ? "Actualizando..." : "Actualizar Publicidad"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EditarPublicidad;
