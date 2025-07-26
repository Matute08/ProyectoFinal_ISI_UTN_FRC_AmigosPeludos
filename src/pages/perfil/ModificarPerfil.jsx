import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Alert,
    Avatar,
    Container,
    CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { uploadFileUser, deleteFileStorage } from "../../api/firebaseUploads";
import { getUserMail, updateUser } from "../../api/userApi";
import { getBarrios } from "../../api/commonApi";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { mostrarAlertaExito, mostrarAlertaError } from "../../utils/showAlert";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/CustomLoader";
import SelectGenero from "../../components/select/SelectGenero";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditarPerfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [barrios, setBarrios] = useState([]);
    const [foto, setFoto] = useState("");
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            barrioId: "",
            generoId: "",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cached = localStorage.getItem("userData");
                if (!cached) return;
                const { email } = JSON.parse(cached);
                const res = await getUserMail(email);
                setUser(res);
                setValue("nombreCompleto", res.nombreCompleto);
                setValue("generoId", res.generoId);
                setValue("celular", res.celular);
                setValue("calle", res.calle);
                setValue("nroCalle", res.nroCalle);
                setValue("barrioId", res.barrioId);
                if (res.foto) setPreviewUrl(res.foto);

                const barriosRes = await getBarrios();
                setBarrios(barriosRes.data);
            } catch (err) {
                setError("Error al cargar el perfil del usuario.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setValue]);

    useEffect(() => {
        let tempUrl;
        if (foto.length && foto[0]?.file instanceof File) {
            tempUrl = URL.createObjectURL(foto[0].file);
            setPreviewUrl(tempUrl);
        }
        return () => {
            if (tempUrl) URL.revokeObjectURL(tempUrl);
        };
    }, [foto]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let nuevaFoto = user.foto;

            if (
                foto.length > 0 &&
                foto[0]?.file instanceof File &&
                foto[0].file.size > 0
            ) {
                nuevaFoto = await uploadFileUser(foto[0].file);
                if (
                    user.foto &&
                    typeof user.foto === "string" &&
                    user.foto.includes("firebasestorage.googleapis.com") &&
                    user.foto.includes("avatarUser")
                ) {
                    await deleteFileStorage(user.foto);
                }
            }

            const payload = {
                id: user.id,
                nombreCompleto: data.nombreCompleto,
                fechaNacimiento:
                    new Date(user.fechaNacimiento).toISOString() || null,

                generoId: Number(data.generoId),
                celular: data.celular,
                calle: data.calle,
                nroCalle: Number(data.nroCalle),
                barrioId: Number(data.barrioId),
                foto: nuevaFoto,
                tieneMascota: user.tieneMascota,
                mail: user.mail,
                rolId: user.rolId,
                cuentaVerificada: user.cuentaVerificada,
                tipoAutenticacionId: user.tipoAutenticacionId,
                qr: user.qr,
                esPaseador: user.esPaseador,
                esCuidador: user.esCuidador,
                esVeterinaria: user.esVeterinaria,
                esFundacion: user.esFundacion,
            };

            await updateUser(user.id, payload);
            mostrarAlertaExito("Usuario modificado correctamente", "/perfil");
        } catch (err) {
            setError("Ocurrió un error al actualizar tu perfil.", err);
            mostrarAlertaError("No se pudo modificar el usuario", "/perfil");
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
        <Container maxWidth="md" sx={{ mt: 4, borderRadius: 4 }}>
            <Box sx={{ mt: 4 }}>
                <Paper
                    sx={{ p: 4, maxWidth: 800, mx: "auto", borderRadius: 4 }}
                >
                    <Typography variant="h5" fontWeight={700} mb={3}>
                        Modificar Perfil
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item size={{ xs: 12 }}>
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    mb={1}
                                >
                                    Foto de perfil
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        src={previewUrl || ""}
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <FilePond
                                            files={foto}
                                            onupdatefiles={(files) =>
                                                setFoto(files)
                                            }
                                            allowMultiple={false}
                                            name="foto"
                                            labelIdle="Arrastrá o hacé click para subir una imagen"
                                            acceptedFileTypes={[
                                                "image/png",
                                                "image/jpeg",
                                            ]}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre completo"
                                    {...register("nombreCompleto", {
                                        required: "Campo obligatorio",
                                    })}
                                    error={!!errors.nombreCompleto}
                                    helperText={errors.nombreCompleto?.message}
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
                                    label="Celular"
                                    {...register("celular", {
                                        required: "Campo obligatorio",
                                        pattern: {
                                            value: /^[0-9]{6,15}$/,
                                            message: "Solo números (mín. 6)",
                                        },
                                    })}
                                    error={!!errors.celular}
                                    helperText={errors.celular?.message}
                                />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Calle"
                                    {...register("calle", {
                                        required: "Campo obligatorio",
                                    })}
                                    error={!!errors.calle}
                                    helperText={errors.calle?.message}
                                />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 4 }}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Número"
                                    {...register("nroCalle", {
                                        required: "Campo obligatorio",
                                        min: {
                                            value: 1,
                                            message: "Debe ser mayor a 0",
                                        },
                                    })}
                                    error={!!errors.nroCalle}
                                    helperText={errors.nroCalle?.message}
                                />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 8 }}>
                                <Controller
                                    name="barrioId"
                                    control={control}
                                    rules={{ required: "Campo obligatorio" }}
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            fullWidth
                                            label="Barrio"
                                            {...field}
                                            error={!!errors.barrioId}
                                            helperText={
                                                errors.barrioId?.message
                                            }
                                        >
                                            {barrios.map((b) => (
                                                <MenuItem
                                                    key={b.id}
                                                    value={b.id}
                                                >
                                                    {b.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mt={4}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                size="large"
                                onClick={() => navigate("/perfil")}
                            >
                                Volver
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                disabled={loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : null
                                }
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default EditarPerfil;
