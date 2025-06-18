// src/pages/mascotas/SettingsPet.jsx

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
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FilePond } from "react-filepond";
import CustomLoader from "../../../components/CustomLoader";
import "filepond/dist/filepond.min.css";
import { getMascotaId, updatePets } from "../../../api/mascotasApi";

import {
    uploadFilePetsUser,
    deleteFileStorage,
} from "../../../api/firebaseUploads";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert"; // o la ruta correcta según tu estructura
import SelectTipoMascota from "../../../components/select/SelectTipoMascota";
import SelectEdadMascota from "../../../components/select/SelectEdadMascota";
import SelectRaza from "../../../components/select/SelectRaza";
import SelectSexoMascota from "../../../components/select/SelectSexoMascota";
import SelectCastracion from "../../../components/select/SelectCastracion";

const ModificarMascota = () => {
    const { mascotaId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");
    const [files, setFiles] = useState([]);

    const {
        control,
        handleSubmit,

        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mascota] = await Promise.all([getMascotaId(mascotaId)]);
                setInitialData(mascota.data);
                setFotoPreview(mascota.data.foto);
                reset({
                    nombre: mascota.data.nombre,
                    tipoMascotaId: mascota.data.raza.tipoMascotaId ,
                    razaId: mascota.data.raza.id,
                    sexoId: mascota.data.sexoId,
                    peso: mascota.data.peso,
                    castracion: mascota.data.castracion ? "1" : "0",
                    color: mascota.data.color,
                    descripcion: mascota.data.descripcion,
                    edadMascotaId: mascota.data.edadId
                });
            } catch (e) {
                console.error(e);
                setSubmitError("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mascotaId, reset]);

    const onSubmit = async (data) => {
        setSubmitError(null);
        let newPhotoUrl = null;
        try {
            if (files.length > 0) {
                if (initialData.foto) {
                    try {
                        await deleteFileStorage(initialData.foto);
                    } catch (e) {
                        console.warn(
                            "No se pudo borrar imagen anterior (posiblemente no existe):",
                            e.message
                        );
                    }
                }
                newPhotoUrl = await uploadFilePetsUser(files[0].file);
            }

            const payload = {
                id: initialData.id,
                nombre: data.nombre,
                edadId: parseInt(data.edadMascotaId),
                sexoId: parseInt(data.sexoId),
                castracion: data.castracion === 0,
                peso: String(data.peso),
                descripcion: data.descripcion || null,
                idUsuario: initialData.idUsuario,
                foto: newPhotoUrl !== null ? newPhotoUrl : initialData.foto,
                color: data.color,
                razaId: parseInt(data.razaId),
            };

            await updatePets(mascotaId, payload);

            mostrarAlertaExito(
                "La mascota fue modificada correctamente",
                "/perfil"
            );
        } catch (e) {
            console.error(e);
            mostrarAlertaError("No se pudo modificar la mascota");
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h5" mb={2}>
                Modificar Mascota
            </Typography>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12 }}>
                        <Typography variant="subtitle1">Foto actual</Typography>
                        <Box my={2}>
                            <img
                                src={
                                    fotoPreview || "/images/placeholder-pet.png"
                                }
                                alt="Mascota"
                                style={{
                                    width: 150,
                                    height: 150,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                        </Box>
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={false}
                            maxFiles={1}
                            name="foto"
                            labelIdle="Arrastrá o seleccioná una nueva imagen"
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{ required: "Requerido" }}
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

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectTipoMascota
                            value={watch("tipoMascotaId")}
                            onChange={(e) =>{
                                setValue("tipoMascotaId", e.target.value)
                                setValue("razaId", "");

                            }
                            }
                            error={!!errors.tipoMascotaId}
                            helperText={errors.tipoMascotaId?.message}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectRaza
                            tipoMascotaId={watch("tipoMascotaId")}
                            value={watch("razaId")}
                            onChange={(e) => setValue("razaId", e.target.value)
                            }
                            error={!!errors.razaId}
                            helperText={errors.razaId?.message}
                        />
                    </Grid>

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

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="peso"
                            control={control}
                            rules={{ required: "Requerido" }}
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

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <SelectSexoMascota
                            value={watch("sexoId")}
                            onChange={(e) => setValue("sexoId", e.target.value)}
                            error={!!errors.sexoId}
                            helperText={errors.sexoId?.message}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="color"
                            control={control}
                            rules={{ required: "Requerido" }}
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

                    <Grid item size={{ xs: 12 }}>
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                />
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
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate("/perfil")}
                        >
                            Volver
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Guardar Cambios
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default ModificarMascota;
