import {
    Box,
    Button,
    Container,
    Grid,
    Menu,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mostrarAlertaExito, mostrarAlertaError } from "../utils/showAlert";
import Maps from "../components/Maps";
import { uploadFilesPetsLost } from "../api/firebaseUploads";
import { postMascotaPerdida } from "../api/publicacionesApi";
import CustomLoader from "../components/CustomLoader";
import { useAuth } from "../auth/AuthProvider";
import SelectTipoMascota from "../components/select/SelectTipoMascota";
import SelectEdadMascota from "../components/select/SelectEdadMascota";
import SelectRaza from "../components/select/SelectRaza";
import SelectSexoMascota from "../components/select/SelectSexoMascota";
import SelectCastracion from "../components/select/SelectCastracion";
import SelectBarrio from "../components/select/SelectBarrio";
import SelectCiudad from "../components/select/SelectCiudad";
import SelectProvincia from "../components/select/SelectProvincia";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Estilos CSS personalizados para FilePond
const filePondStyles = `
    .filepond--root {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    .filepond--panel-root {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    .filepond--drop-label {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    .filepond--label-action {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    
    /* Efectos hover */
    .filepond--root:hover {
        background-color: rgba(255, 193, 7, 0.1) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        transform: translateY(-2px) !important;
    }
    
    .filepond--panel-root:hover {
        background-color: rgba(255, 193, 7, 0.1) !important;
    }
    
    .filepond--drop-label:hover {
        color:rgb(0, 0, 0) !important;
        font-weight: bold !important;
    }
    
    .filepond--label-action:hover {
        color:rgb(0, 0, 0) !important;
        text-decoration: underline !important;
        font-weight: bold !important;
    }
`;

export default function NuevaMascotaPerdida() {
    const {
        register,
        handleSubmit,
        watch,

        formState: { errors },
        setValue,
    } = useForm();

    const [files, setFiles] = useState([]);
    const [latLng, setLatLng] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const navigate = useNavigate();
    const { userData } = useAuth();

    // Agregar estilos CSS al DOM
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = filePondStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const onMapClick = ({ lat, lng }) => {
        setLatLng({ lat, lng });
    };

    const onSubmit = async (data) => {
        if (!latLng)
            return mostrarAlertaError("Seleccioná la ubicación en el mapa");
        if (files.length === 0)
            return mostrarAlertaError("Subí al menos una imagen");
        setSubiendo(true);

        try {
            const urls = [];
            for (const file of files) {
                const url = await uploadFilesPetsLost(file.file);
                urls.push({ foto: url });
            }

            data.fechaPerdida = new Date(data.fechaPerdida).toISOString();

            const payload = {
                nombre: data.nombre,
                razaId: parseInt(data.razaId),
                edadId: parseInt(data.edadMascotaId),
                sexoId: parseInt(data.sexoId),
                castracion: data.castracion === 0,
                descripcion: data.descripcion,
                telefono: data.telefono,
                fechaPerdida: data.fechaPerdida,
                ciudadId: parseInt(data.ciudadId),
                barrioId: parseInt(data.barrioId),
                calle: `${data.calle} ${data.nroCalle}`,
                latitud: latLng.lat,
                longitud: latLng.lng,
                tipoPublicacionId: 1,
                usuarioId: userData?.id,
                fotos: urls,
                color: data.color,
            };


            await postMascotaPerdida(payload);
            mostrarAlertaExito(
                "La publicación fue creada exitosamente",
                "/perdidos"
            );
        } catch (error) {
            console.error("Error al publicar:", error);
            mostrarAlertaError();
        } finally {
            setSubiendo(false);
        }
    };

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
                        aligns: "center",
                        justifyContent: "center",
                        zIndex: 1300, // mayor que el resto
                    }}
                >
                    <CustomLoader text="Publicando..." />
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
                        Agregar Mascota Perdida
                    </Typography>
                </Box>

                <Grid spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="subtitle1" mb={2}>
                                Fotos de la mascota *
                            </Typography>
                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple
                                maxFiles={4}
                                acceptedFileTypes={["image/*"]}
                                labelIdle="Arrastrá y soltá tus imágenes o <span class='filepond--label-action'>buscalas</span>"
                            />

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* FILAS */}
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            label="Nombre (opcional)"
                                            {...register("nombre", {
                                                maxLength: {
                                                    value: 35,
                                                    message: "El nombre no puede tener más de 35 caracteres"
                                                }
                                            })}
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message}
                                            inputProps={{
                                                maxLength: 35
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            label="Color"
                                            {...register("color", {
                                                required: "Campo obligatorio",
                                                maxLength: {
                                                    value: 35,
                                                    message: "El color no puede tener más de 35 caracteres"
                                                }
                                            })}
                                            error={!!errors.color}
                                            helperText={errors.color?.message}
                                            inputProps={{
                                                maxLength: 35
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectTipoMascota
                                            value={watch("tipoMascotaId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "tipoMascotaId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.tipoMascotaId}
                                            helperText={
                                                errors.tipoMascotaId?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectRaza
                                            tipoMascotaId={watch(
                                                "tipoMascotaId"
                                            )}
                                            value={watch("razaId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "razaId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.razaId}
                                            helperText={errors.razaId?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectEdadMascota
                                            value={watch("edadMascotaId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "edadMascotaId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.edadMascotaId}
                                            helperText={
                                                errors.edadMascotaId?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <SelectSexoMascota
                                            value={watch("sexoId")}
                                            onChange={(e) =>
                                                setValue(
                                                    "sexoId",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.sexoId}
                                            helperText={errors.sexoId?.message}
                                        />
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Fecha de Pérdida"
                                            type="date"
                                            {...register("fechaPerdida", {
                                                required: "Campo obligatorio",
                                            })}
                                            error={!!errors.fechaPerdida}
                                            helperText={
                                                errors.fechaPerdida?.message
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>
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
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Calle"
                                            {...register("calle", {
                                                required: "Campo obligatorio",
                                            })}
                                            error={!!errors.calle}
                                            helperText={errors.calle?.message}
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Altura"
                                            type="number"
                                            {...register("nroCalle", {
                                                required: "Campo obligatorio",
                                            })}
                                            error={!!errors.nroCalle}
                                            helperText={
                                                errors.nroCalle?.message
                                            }
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Número de celular"
                                            {...register("telefono", {
                                                required: "Campo obligatorio",
                                            })}
                                            error={!!errors.telefono}
                                            helperText={
                                                errors.telefono?.message
                                            }
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Box>
                                            <TextField
                                                label="Observaciones"
                                                multiline
                                                rows={3}
                                                {...register("descripcion", {
                                                    maxLength: {
                                                        value: 300,
                                                        message: "Las observaciones no pueden tener más de 300 caracteres"
                                                    }
                                                })}
                                                error={!!errors.descripcion}
                                                helperText={errors.descripcion?.message}
                                                inputProps={{
                                                    maxLength: 300
                                                }}
                                                fullWidth
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography 
                                                variant="caption" 
                                                color={watch("descripcion")?.length > 250 ? "error" : "text.secondary"}
                                                sx={{ display: 'block' }}
                                            >
                                                {watch("descripcion")?.length || 0}/300 caracteres
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Box mb={2}>
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Ubicación de Pérdida:
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
                                                    markerSeleccionado={latLng} // Mostrá el marker donde el usuario clickeó
                                                    center={
                                                        latLng
                                                            ? [
                                                                  latLng.lat,
                                                                  latLng.lng,
                                                              ]
                                                            : [
                                                                  -31.4167,
                                                                  -64.1833,
                                                              ]
                                                    }
                                                    zoom={16}
                                                />
                                            </Box>
                                            {!latLng && (
                                                <Typography
                                                    color="error"
                                                    fontSize={14}
                                                    mt={1}
                                                >
                                                    Debes marcar la ubicación
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box display="flex" alignItems="center" width="100%" mt={3}>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        disabled={subiendo}
                                        onClick={() => navigate(-1)}
                                    >
                                        Volver
                                    </Button>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        disabled={subiendo}
                                    >
                                        Publicar
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
