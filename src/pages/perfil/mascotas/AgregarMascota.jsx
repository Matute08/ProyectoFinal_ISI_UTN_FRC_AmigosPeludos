// src/pages/mascotas/AgregarMascota.jsx

import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { postMascota } from "../../../api/mascotasApi";
import { uploadFilePetsUser } from "../../../api/firebaseUploads";
import { getUserMail } from "../../../api/userApi";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert"; // ajustá el path si es distinto
import SelectTipoMascota from "../../../components/select/SelectTipoMascota";
import SelectEdadMascota from "../../../components/select/SelectEdadMascota";
import SelectRaza from "../../../components/select/SelectRaza";
import SelectSexoMascota from "../../../components/select/SelectSexoMascota";
import SelectCastracion from "../../../components/select/SelectCastracion";

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

const AgregarMascota = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [usuarioReal, setUsuarioReal] = useState(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre: "",
            tipoMascotaId: "",
            razaId: "",
            edadMascotaId: "",
            sexoId: "",
            castracion: "",
            peso: "",
            color: "",
            descripcion: "",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
                const dataLocalStorage = JSON.parse(cachedUserData);
                const userEmail = dataLocalStorage.email;
                const datosUsuario = await getUserMail(userEmail);
                setUsuarioReal(datosUsuario);
            }
        };
        fetchUserData();
    }, []);

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
        setSubmitError(null);
        setLoading(true);
        try {
            let fotoUrl = "";
            if (files.length > 0) {
                fotoUrl = await uploadFilePetsUser(files[0].file);
            }

            const payload = {
                nombre: data.nombre,
                edadId: parseInt(data.edadMascotaId),
                sexoId: parseInt(data.sexoId),
                castracion: data.castracion === 0,
                peso: String(data.peso),
                descripcion: data.descripcion || null,
                idUsuario: usuarioReal.id,
                foto: fotoUrl,
                color: data.color,
                razaId: parseInt(data.razaId),
            };

            await postMascota(payload);
            mostrarAlertaExito(
                "La mascota fue creada correctamente",
                "/perfil"
            );
        } catch (error) {
            console.error(error);
            mostrarAlertaError("No se pudo agregar la mascota");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
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
                    Agregar Mascota
                </Typography>
            </Box>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12 }}>
                        <Typography variant="subtitle1">
                            Foto de la mascota
                        </Typography>
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={false}
                            maxFiles={1}
                            name="foto"
                            labelIdle="Arrastrá o seleccioná una imagen"
                        />
                    </Grid>

                    {/* Nombre */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{ required: "Nombre requerido" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Nombre"
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Tipo */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectTipoMascota
                            value={watch("tipoMascotaId")}
                            onChange={(e) =>
                                setValue("tipoMascotaId", e.target.value)
                            }
                            error={!!errors.tipoMascotaId}
                            helperText={errors.tipoMascotaId?.message}
                        />
                    </Grid>

                    {/* Raza */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectRaza
                            tipoMascotaId={watch("tipoMascotaId")}
                            value={watch("razaId")}
                            onChange={(e) => setValue("razaId", e.target.value)}
                            error={!!errors.razaId}
                            helperText={errors.razaId?.message}
                        />
                    </Grid>

                    {/* Edad */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectEdadMascota
                            value={watch("edadMascotaId")}
                            onChange={(e) =>
                                setValue("edadMascotaId", e.target.value)
                            }
                            error={!!errors.edadMascotaId}
                            helperText={errors.edadMascotaId?.message}
                        />
                    </Grid>

                    {/* Sexo */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectSexoMascota
                            value={watch("sexoId")}
                            onChange={(e) => setValue("sexoId", e.target.value)}
                            error={!!errors.sexoId}
                            helperText={errors.sexoId?.message}
                        />
                    </Grid>

                    {/* Castrado */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectCastracion
                            value={watch("castracion")}
                            onChange={(e) =>
                                setValue("castracion", parseInt(e.target.value))
                            }
                            error={!!errors.castracion}
                            helperText={errors.castracion?.message}
                        />
                    </Grid>

                    {/* Peso */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="peso"
                            control={control}
                            rules={{ required: "Peso requerido" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Peso (kg)"
                                    type="number"
                                    error={!!errors.peso}
                                    helperText={errors.peso?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Color */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="color"
                            control={control}
                            rules={{ required: "Color requerido" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Color"
                                    error={!!errors.color}
                                    helperText={errors.color?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Descripcion */}
                    <Grid item size={{ xs: 12 }}>
                        <Controller
                            name="descripcion"
                            control={control}
                            rules={{ 
                                maxLength: {
                                    value: 300,
                                    message: "La descripción no puede tener más de 300 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <Box>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Descripción"
                                        multiline
                                        rows={4}
                                        error={!!errors.descripcion}
                                        helperText={errors.descripcion?.message}
                                        inputProps={{
                                            maxLength: 300
                                        }}
                                    />
                                    <Typography 
                                        variant="caption" 
                                        color={field.value?.length > 250 ? "error" : "text.secondary"}
                                        sx={{ mt: 0.5, display: 'block' }}
                                    >
                                        {field.value?.length || 0}/300 caracteres
                                    </Typography>
                                </Box>
                            )}
                        />
                    </Grid>

                    <Grid
                        item
                        size={{ xs: 12 }}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate("/perfil")}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Agregar Mascota"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default AgregarMascota;
