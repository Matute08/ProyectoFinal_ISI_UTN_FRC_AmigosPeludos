import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { updateFundacion, getFundacionId } from "../../api/fundacionesApi";
import { useAuth } from "../../auth/AuthProvider";
import { uploadFilesPetsFound } from "../../api/firebaseUploads";
import { mostrarAlertaExito, mostrarAlertaError } from "../../utils/showAlert";
import CustomLoader from "../../components/CustomLoader";
import Maps from "../../components/Maps";
import SelectBarrio from "../../components/select/SelectBarrio";
import SelectCiudad from "../../components/select/SelectCiudad";
import SelectProvincia from "../../components/select/SelectProvincia";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function EditarFundacion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm();
    
    const [files, setFiles] = useState([]);
    const [latLng, setLatLng] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener datos de la fundación
                const fundacionResponse = await getFundacionId(id);
                const fundacionData = fundacionResponse.data;
                
                setInitialData(fundacionData);

                // Configurar ubicación en el mapa si existe
                if (fundacionData.latitud && fundacionData.longitud) {
                    setLatLng({
                        lat: fundacionData.latitud,
                        lng: fundacionData.longitud
                    });
                }

                // Pre-llenar el formulario con los datos existentes
                reset({
                    nombre: fundacionData.nombre || "",
                    direccion: fundacionData.direccion || "",
                    nroCalle: fundacionData.nroCalle || "",
                    provinciaId: fundacionData.provinciaId || "",
                    ciudadId: fundacionData.ciudadId || "",
                    barrioId: fundacionData.barrioId || "",
                    cuit: fundacionData.cuit || "",
                    aliasCbu: fundacionData.aliasCbu || "",
                    cbu: fundacionData.cbu || "",
                    telefono: fundacionData.telefono || "",
                    paginaUrl: fundacionData.paginaUrl || "",
                    facebook: fundacionData.facebook || "",
                    instagram: fundacionData.instagram || "",
                    descripcion: fundacionData.descripcion || "",
                    motivoDonaciones: fundacionData.motivoDonaciones || "",
                });

            } catch (error) {
                console.error("Error al cargar datos de la fundación:", error);
                mostrarAlertaError("Error al cargar los datos de la fundación");
                navigate("/perfil");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, reset, navigate]);

    const onMapClick = ({ lat, lng }) => {
        setLatLng({ lat, lng });
    };

    const handleTelefonoChange = (e) => {
        const value = e.target.value;
        // Solo permitir números
        const numericValue = value.replace(/[^0-9]/g, '');
        setValue("telefono", numericValue);
    };

    const onSubmit = async (data) => {
        setSubiendo(true);
        try {
            let imagenUrl = initialData.imagen; // Mantener la imagen existente por defecto

            // Si hay archivos nuevos, subirlos
            if (files.length > 0) {
                const uploads = [];
                for (const f of files) {
                    const url = await uploadFilesPetsFound(f.file);
                    uploads.push(url);
                }
                imagenUrl = uploads[0];
            }

            // DATOS DE LA FUNDACION
            const payload = {
                id: Number(id), // ID de la fundación desde los parámetros de la URL
                nombre: data.nombre,
                direccion: data.direccion,
                nroCalle: parseInt(data.nroCalle, 10),
                barrioId: parseInt(data.barrioId, 10),
                cuit: data.cuit,
                aliasCbu: data.aliasCbu,
                cbu: data.cbu,
                telefono: data.telefono,
                paginaUrl: data.paginaUrl,
                facebook: data.facebook,
                latitud: latLng?.lat || initialData.latitud || null,
                longitud: latLng?.lng || initialData.longitud || null,
                instagram: data.instagram,
                descripcion: data.descripcion,
                motivoDonaciones: data.motivoDonaciones,
                estadoId: initialData.estadoId,
                usuarioId: userData?.id,
                imagen: imagenUrl,
                habilitado: initialData.habilitado,
            };

            await updateFundacion(id, payload);
            mostrarAlertaExito("Fundación actualizada exitosamente", "/perfil");
        } catch (err) {
            console.error("Error al actualizar fundación:", err);
            mostrarAlertaError("No se pudo actualizar la fundación");
        } finally {
            setSubiendo(false);
        }
    };

    if (loading) return <CustomLoader />;

    return (
        <>
            {subiendo && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1300,
                    }}
                >
                    <CustomLoader text="Actualizando fundación..." />
                </Box>
            )}
            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    mb: 4,
                    backgroundColor: "#e0d0b8",
                    borderRadius: 4,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "primary.main",
                        p: 2,
                        borderRadius: 2,
                        textAlign: "center",
                        boxShadow: 2,
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" color="primary.contrastText">
                        Editar Fundación
                    </Typography>
                </Box>
                <Grid spacing={3}>
                    <Grid item size={{ xs: 12 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Foto de la Fundación
                            </Typography>
                            {initialData?.imagen && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Imagen actual:
                                    </Typography>
                                    <img
                                        src={initialData.imagen}
                                        alt="Imagen actual"
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}
                            <Box sx={{ 
                                '& .filepond--panel-root': { 
                                    cursor: 'pointer !important' 
                                },
                                '& .filepond--root': { 
                                    cursor: 'pointer !important' 
                                }
                            }}>
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    labelIdle="Arrastrá o hacé click para cambiar imagen"
                                />
                            </Box>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Grid container spacing={2} mt={2}>
                                    <Grid item size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Nombre"
                                            fullWidth
                                            {...register("nombre", {
                                                required: "Requerido",
                                            })}
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message}
                                        />
                                    </Grid>

                                    {/* Provincia */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectProvincia
                                            value={watch("provinciaId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "provinciaId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.provinciaId}
                                            helperText={
                                                errors.provinciaId?.message
                                            }
                                        />
                                    </Grid>
                                    {/* Ciudad */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectCiudad
                                            provinciaId={watch("provinciaId")}
                                            value={watch("ciudadId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "ciudadId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.ciudadId}
                                            helperText={
                                                errors.ciudadId?.message
                                            }
                                        />
                                    </Grid>
                                    {/* Barrio */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectBarrio
                                            ciudadId={watch("ciudadId")}
                                            value={watch("barrioId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "barrioId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.barrioId}
                                            helperText={
                                                errors.barrioId?.message
                                            }
                                        ></SelectBarrio>
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 4}}>
                                        <TextField
                                            label="Dirección"
                                            fullWidth
                                            {...register("direccion", {
                                                required: "Requerido",
                                                maxLength: {
                                                    value: 20,
                                                    message: "Máximo 20 caracteres"
                                                }
                                            })}
                                            error={!!errors.direccion}
                                            helperText={
                                                errors.direccion?.message
                                            }
                                            inputProps={{
                                                maxLength: 20
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 20) {
                                                    e.target.value = value.slice(0, 20);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 6, sm: 4 }}>
                                        <TextField
                                            label="Altura"
                                            fullWidth
                                            {...register("nroCalle", {
                                                required: "Requerido",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Solo números",
                                                },
                                                maxLength: {
                                                    value: 5,
                                                    message: "Máximo 5 caracteres"
                                                }
                                            })}
                                            error={!!errors.nroCalle}
                                            helperText={
                                                errors.nroCalle?.message
                                            }
                                            inputProps={{
                                                maxLength: 5
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 5) {
                                                    e.target.value = value.slice(0, 5);
                                                } else {
                                                    e.target.value = value;
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="CUIT"
                                            fullWidth
                                            inputProps={{ maxLength: 11 }}
                                            {...register("cuit", {
                                                required: "Requerido",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Solo números",
                                                },
                                                minLength: {
                                                    value: 11,
                                                    message:
                                                        "El CUIT debe tener exactamente 11 dígitos",
                                                },
                                                maxLength: {
                                                    value: 11,
                                                    message:
                                                        "El CUIT debe tener exactamente 11 dígitos",
                                                },
                                            })}
                                            error={!!errors.cuit}
                                            helperText={errors.cuit?.message}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="CBU"
                                            fullWidth
                                            inputProps={{ maxLength: 22 }}
                                            {...register("cbu", {
                                                required: "Requerido",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Solo números",
                                                },
                                                minLength: {
                                                    value: 22,
                                                    message:
                                                        "El CBU debe tener exactamente 22 dígitos",
                                                },
                                                maxLength: {
                                                    value: 22,
                                                    message:
                                                        "El CBU debe tener exactamente 22 dígitos",
                                                },
                                            })}
                                            error={!!errors.cbu}
                                            helperText={errors.cbu?.message}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 22) {
                                                    e.target.value = value.slice(0, 22);
                                                } else {
                                                    e.target.value = value;
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Alias CBU"
                                            fullWidth
                                            {...register("aliasCbu", {
                                                required: "Requerido",
                                                maxLength: {
                                                    value: 20,
                                                    message: "Máximo 20 caracteres"
                                                }
                                            })}
                                            error={!!errors.aliasCbu}
                                            helperText={
                                                errors.aliasCbu?.message
                                            }
                                            inputProps={{
                                                maxLength: 20
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 20) {
                                                    e.target.value = value.slice(0, 20);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Teléfono"
                                            fullWidth
                                            inputProps={{ maxLength: 12 }}
                                            {...register("telefono", {
                                                required: "Requerido",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Solo números",
                                                },
                                                maxLength: {
                                                    value: 12,
                                                    message: "Máximo 12 caracteres",
                                                },
                                            })}
                                            onChange={handleTelefonoChange}
                                            error={!!errors.telefono}
                                            helperText={
                                                errors.telefono?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Página Web"
                                            fullWidth
                                            placeholder="https://www.tufundacion.org"
                                            {...register("paginaUrl", {
                                                maxLength: {
                                                    value: 30,
                                                    message: "Máximo 30 caracteres"
                                                }
                                            })}
                                            error={!!errors.paginaUrl}
                                            helperText={errors.paginaUrl?.message}
                                            inputProps={{
                                                maxLength: 30
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 30) {
                                                    e.target.value = value.slice(0, 30);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Facebook"
                                            fullWidth
                                            placeholder="https://www.facebook.com/tu_fundacion"
                                            {...register("facebook", {
                                                maxLength: {
                                                    value: 30,
                                                    message: "Máximo 30 caracteres"
                                                }
                                            })}
                                            error={!!errors.facebook}
                                            helperText={errors.facebook?.message}
                                            inputProps={{
                                                maxLength: 30
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 30) {
                                                    e.target.value = value.slice(0, 30);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Instagram"
                                            fullWidth
                                            placeholder="https://www.instagram.com/tu_fundacion"
                                            {...register("instagram", {
                                                maxLength: {
                                                    value: 30,
                                                    message: "Máximo 30 caracteres"
                                                }
                                            })}
                                            error={!!errors.instagram}
                                            helperText={errors.instagram?.message}
                                            inputProps={{
                                                maxLength: 30
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 30) {
                                                    e.target.value = value.slice(0, 30);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12 }}>
                                        <TextField
                                            label="Descripción"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            inputProps={{ maxLength: 300 }}
                                            {...register("descripcion", {
                                                required: "Requerido",
                                                maxLength: {
                                                    value: 300,
                                                    message:
                                                        "Máximo 300 caracteres",
                                                },
                                            })}
                                            error={!!errors.descripcion}
                                            helperText={
                                                errors.descripcion?.message
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 300) {
                                                    e.target.value = value.slice(0, 300);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12 }}>
                                        <TextField
                                            label="Uso de Donaciones"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            inputProps={{ maxLength: 300 }}
                                            {...register("motivoDonaciones", {
                                                required: "Requerido",
                                                maxLength: {
                                                    value: 300,
                                                    message:
                                                        "Máximo 300 caracteres",
                                                },
                                            })}
                                            error={!!errors.motivoDonaciones}
                                            helperText={
                                                errors.motivoDonaciones?.message
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 300) {
                                                    e.target.value = value.slice(0, 300);
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Ubicacion */}
                                    <Grid size={{ xs: 12 }}>
                                        <Box mb={2}>
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Ubicación de la Fundación (opcional):
                                            </Typography>
                                            <Box
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Maps
                                                    seleccionable={true}
                                                    onMapClick={onMapClick}
                                                    markerSeleccionado={latLng}
                                                    center={
                                                        latLng
                                                            ? [
                                                                  latLng.lat,
                                                                  latLng.lng,
                                                              ]
                                                            : initialData?.latitud && initialData?.longitud
                                                            ? [
                                                                  initialData.latitud,
                                                                  initialData.longitud,
                                                              ]
                                                            : [
                                                                  -31.4167,
                                                                  -64.1833,
                                                              ]
                                                    }
                                                    zoom={16}
                                                />
                                            </Box>
                                            
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box textAlign="right" mt={3}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        disabled={subiendo}
                                    >
                                        {subiendo ? "Guardando..." : "Guardar cambios"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() => navigate("/perfil")}
                                        sx={{ ml: 2 }}
                                    >
                                        Volver
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
