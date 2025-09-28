import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
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
import { postMascotaAdopcion } from "../api/publicacionesApi";
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

export default function NuevaMascotaAdopcion() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm();

    const [files, setFiles] = useState([]);
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

    
    const onSubmit = async (data) => {
        if (files.length === 0) return alert("Subí al menos una imagen");
        setSubiendo(true);
        try {
            const urls = [];
            for (const file of files) {
                const url = await uploadFilesPetsLost(file.file);
                urls.push({ foto: url });
            }

            const payload = {
                nombre: data.nombre,
                tipoId: parseInt(data.tipoMascotaId),
                razaId: parseInt(data.razaId),
                edadId: parseInt(data.edadMascotaId),
                sexoId: parseInt(data.sexoId),
                castracion: data.castracion === 0,
                descripcion: data.descripcion,
                ciudadId: parseInt(data.ciudadId),
                barrioId: parseInt(data.barrioId),
                tipoPublicacionId: 3,
                usuarioId: userData?.id,
                fotos: urls,
                color: data.color,

            };

            await postMascotaAdopcion(payload);
            mostrarAlertaExito(
                "La publicación fue creada exitosamente",
                "/adopcion"
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
                        alignItems: "center",
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
                        Agregar Mascota en Adopción
                    </Typography>
                </Box>

                <Grid spacing={3}>
                    <Grid item size={{ xs: 12, md: 8 }}>
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
                                {/* FORM */}
                                 <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Nombre"
                                            {...register("nombre", {
                                                maxLength: {
                                                    value: 50,
                                                    message: "El nombre no puede tener más de 50 caracteres"
                                                }
                                            })}
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message}
                                            inputProps={{
                                                maxLength: 50
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Color"
                                            {...register("color", {
                                                required: "Campo obligatorio",
                                                maxLength: {
                                                    value: 30,
                                                    message: "El color no puede tener más de 30 caracteres"
                                                }
                                            })}
                                            error={!!errors.color}
                                            helperText={errors.color?.message}
                                            inputProps={{
                                                maxLength: 30
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
                                        <SelectCastracion
                                            value={watch("castracion")}
                                            onChange={(e) =>
                                                setValue(
                                                    "castracion",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            error={!!errors.castracion}
                                            helperText={
                                                errors.castracion?.message
                                            }
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

                                    <Box display="flex" alignItems="center" width="100%" mt={3}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => navigate(-1)}
                                            disabled={subiendo}
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
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            );
        </>
    );
}
