// src/pages/perfil/publicaciones/ModificarPublicacion.jsx

import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    Alert,
    Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import CustomLoader from "../../../components/CustomLoader";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import {
    getDetallePublicacion,
    updatePublicacion,
    deleteFotoPosteo,
    postFotoPosteo,
} from "../../../api/publicacionesApi";
import {
    getTipoMascota,
    getSexos,
    getAllEdadMascota,
    getBarrios,
} from "../../../api/commonApi";
import { getRazasPorTipo } from "../../../api/mascotasApi";
import {
    uploadFilePetsUser,
    deleteFileStorage,
} from "../../../api/firebaseUploads";
import { useAuth } from "../../../auth/AuthProvider";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert";

const ModificarPublicacion = () => {
    const { publicacionId } = useParams();
    const navigate = useNavigate();
    const [tipos, setTipos] = useState([]);
    const [razas, setRazas] = useState([]);
    const [sexos, setSexos] = useState([]);
    const [edades, setEdades] = useState([]);
    const [files, setFiles] = useState([]);
    const [fotoActual, setFotoActual] = useState([]);

    const [tipoPublicacion, setTipoPublicacion] = useState(null);
    const [coordenadas, setCoordenadas] = useState({ lat: null, lng: null });
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [barrio, setBarrios] = useState([]);
    //const [fotosEliminadas, setFotosEliminadas] = useState([]);
    const { userData } = useAuth();
    const [publicacionOriginal, setPublicacionOriginal] = useState(null);

    const {
        control,
        handleSubmit,

        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre: "",
            tipoId: "",
            razaId: "",
            edadId: "",
            sexoId: "",
            castracion: "",
            peso: "",
            barrioId: "",
            ciudadId: "",
            tipoPublicacionId: "",
            color: "",
            descripcion: "",
        },
        mode: "onBlur",
    });

    const tipoSeleccionado = watch("tipoId");



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, tiposRes, sexosRes, edadesRes, barrioRes] =
                    await Promise.all([
                        getDetallePublicacion(publicacionId),
                        getTipoMascota(),
                        getSexos(),
                        getAllEdadMascota(),
                        getBarrios(),
                    ]);

                const post = postRes;
                setPublicacionOriginal(post); // Guardar datos originales
                setTipoPublicacion(post.publicacionTipo);
                setFotoActual(
                    post.fotos?.map((f) => ({
                        id: f.id,
                        url: f.foto,
                        toBeDeleted: false,
                    })) || []
                );

                setCoordenadas({ lat: post.lat, lng: post.lng });
                setTipos(tiposRes.data);
                setSexos(sexosRes.data);
                setEdades(edadesRes.data);
                setBarrios(barrioRes.data);

                const tipoInferido = tiposRes.data.find(
                    (t) => t.tipo === post.tipoMascotaNombre
                )?.id;
                const razasRes = await getRazasPorTipo(tipoInferido);
                setRazas(razasRes.data);

                // Formatea la fecha a DD/MM/AAAA si existe
                let fechaPerdidaFormateada = "";
                if (post.fechaPerdida) {
                    const fecha = new Date(post.fechaPerdida);
                    const dia = String(fecha.getDate()).padStart(2, "0");
                    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
                    const anio = fecha.getFullYear();
                    fechaPerdidaFormateada = `${anio}-${mes}-${dia}`;
                }

                reset({
                    nombre: post.nombre,
                    tipoId: tipoInferido,
                    razaId: post.razaId,
                    edadId: post.edadId,
                    sexoId: post.sexoId,
                    color: post.color,
                    castracion: post.castrado ? "1" : "0",
                    descripcion: post.descripcion,
                    barrioId: post.barrioId,
                    ciudadId: post.ciudadId, // Agregar ciudadId
                    ciudad: post.ciudad,
                    fechaPerdida: fechaPerdidaFormateada,
                    tipoPublicacionId: post.tipoPublicacionId, // Agregar tipoPublicacionId
                });
            } catch (error) {
                console.error(error);
                setSubmitError("Error al cargar la publicación");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [publicacionId, reset]);

    useEffect(() => {
        if (!tipoSeleccionado) return;
        getRazasPorTipo(tipoSeleccionado).then((res) => setRazas(res.data));
    }, [tipoSeleccionado]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1. Eliminar fotos marcadas
            const fotosAEliminar = fotoActual.filter((f) => f.toBeDeleted);
            for (const foto of fotosAEliminar) {
                try {
                    await deleteFotoPosteo(foto.id); // desde BD
                    await deleteFileStorage(foto.url); // desde Firebase
                } catch (error) {
                    console.error(`Error al eliminar foto ${foto.id}:`, error);
                    // Continuar con el proceso aunque falle la eliminación de una foto
                }
            }

            // 2. Subir y vincular nuevas fotos
            let nuevasUrls = [];
            if (files.length > 0) {
                nuevasUrls = await Promise.all(
                    files.map((f) => uploadFilePetsUser(f.file))
                );
                for (const url of nuevasUrls) {
                    await postFotoPosteo({
                        foto: url,
                        publicacionMascotaId: parseInt(publicacionId, 10),
                    });
                }
            }

            // 3. Construir payload para update sin fotos
            const payload = {
                id: parseInt(publicacionId, 10),
                nombre: data.nombre,
                razaId: data.razaId ? parseInt(data.razaId) : publicacionOriginal.razaId,
                edadId: data.edadId ? parseInt(data.edadId) : publicacionOriginal.edadId,
                sexoId: data.sexoId ? parseInt(data.sexoId) : publicacionOriginal.sexoId,
                castracion: data.castracion === "1",
                color: data.color || publicacionOriginal.color,
                descripcion: data.descripcion || publicacionOriginal.descripcion,
                barrioId: data.barrioId ? parseInt(data.barrioId) : publicacionOriginal.barrioId,
                ciudadId: data.ciudadId ? parseInt(data.ciudadId) : publicacionOriginal.ciudadId,
                telefono: data.telefono || publicacionOriginal.telefono,
                calle: data.calle || publicacionOriginal.calle,
                fechaPerdida: data.fechaPerdida ? new Date(data.fechaPerdida + 'T00:00:00.000Z').toISOString() : publicacionOriginal.fechaPerdida,
                latitud: coordenadas.lat || publicacionOriginal.lat || publicacionOriginal.latitud,
                longitud: coordenadas.lng || publicacionOriginal.lng || publicacionOriginal.longitud,
                usuarioId: userData?.id || publicacionOriginal.usuarioId,
                tipoPublicacionId: data.tipoPublicacionId ? parseInt(data.tipoPublicacionId) : publicacionOriginal.tipoPublicacionId,
            };
            
            // Asegurar que todos los campos requeridos estén presentes
            if (!payload.ciudadId) payload.ciudadId = 1;
            if (!payload.latitud) payload.latitud = publicacionOriginal.lat || publicacionOriginal.latitud || 0;
            if (!payload.longitud) payload.longitud = publicacionOriginal.lng || publicacionOriginal.longitud || 0;
            
            const updateResponse = await updatePublicacion(publicacionId, payload);
            mostrarAlertaExito(
                "Publicación actualizada correctamente",
                "/perfil"
            );
        } catch (err) {
            console.error("Error al actualizar publicación:", err);
            mostrarAlertaError("Ocurrió un error al guardar los cambios");
        } finally {
            setLoading(false);
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
                Modificar Publicación
            </Typography>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {/* Campos comunes */}
                    {/* Fotos */}
                    <Grid item size={{ xs: 12 }}>
                        <Typography variant="subtitle1">
                            Fotos actuales
                        </Typography>
                        <Grid container spacing={1}>
                            {fotoActual.map((foto, idx) => (
                                <Grid item key={idx} size={{ xs: 6, sm: 4 }}>
                                    <Box position="relative">
                                        <img
                                            src={foto.url}
                                            alt={`Foto ${idx}`}
                                            style={{
                                                width: 150,
                                                height: 150,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                opacity: foto.toBeDeleted
                                                    ? 0.4
                                                    : 1,
                                                filter: foto.toBeDeleted
                                                    ? "grayscale(100%)"
                                                    : "none",
                                            }}
                                        />
                                        <Button
                                            size="small"
                                            color={
                                                foto.toBeDeleted
                                                    ? "success"
                                                    : "error"
                                            }
                                            variant="contained"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                            }}
                                            onClick={() =>
                                                setFotoActual((prev) =>
                                                    prev.map((f, i) =>
                                                        i === idx
                                                            ? {
                                                                  ...f,
                                                                  toBeDeleted:
                                                                      !f.toBeDeleted,
                                                              }
                                                            : f
                                                    )
                                                )
                                            }
                                        >
                                            {foto.toBeDeleted ? "↩" : "X"}
                                        </Button>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item size={{ xs: 12 }}>
                        <Typography variant="subtitle1">
                            Cambiar fotos
                        </Typography>
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={5}
                            name="fotos"
                            labelIdle="Arrastrá o seleccioná nuevas imágenes"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{ 
                                required: tipoPublicacion !== "Encontrada" ? "Requerido" : false 
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label={tipoPublicacion === "Encontrada" ? "Nombre (opcional)" : "Nombre"}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                />
                            )}
                        />
                    </Grid>
                    {/* Tipo */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Controller
                                name="tipoId"
                                control={control}
                                rules={{ required: "Tipo requerido" }}
                                render={({ field }) => (
                                    <Select {...field} label="Tipo">
                                        {tipos.map((t) => (
                                            <MenuItem key={t.id} value={t.id}>
                                                {t.tipo}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Raza */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Raza</InputLabel>
                            <Controller
                                name="razaId"
                                control={control}
                                rules={{ required: "Raza requerida" }}
                                render={({ field }) => (
                                    <Select {...field} label="Raza">
                                        {razas.map((r) => (
                                            <MenuItem key={r.id} value={r.id}>
                                                {r.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Edad */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Edad</InputLabel>
                            <Controller
                                name="edadId"
                                control={control}
                                rules={{ required: "Edad requerida" }}
                                render={({ field }) => (
                                    <Select {...field} label="Edad">
                                        {edades.map((e) => (
                                            <MenuItem key={e.id} value={e.id}>
                                                {e.descripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Sexo */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Sexo</InputLabel>
                            <Controller
                                name="sexoId"
                                control={control}
                                rules={{ required: "Sexo requerido" }}
                                render={({ field }) => (
                                    <Select {...field} label="Sexo">
                                        {sexos.map((s) => (
                                            <MenuItem key={s.id} value={s.id}>
                                                {s.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Castrado */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Castrado/a</InputLabel>
                            <Controller
                                name="castracion"
                                control={control}
                                rules={{ required: "Campo requerido" }}
                                render={({ field }) => (
                                    <Select {...field} label="Castrado/a">
                                        <MenuItem value="1">Sí</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
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

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Barrio</InputLabel>
                            <Controller
                                name="barrioId"
                                control={control}
                                rules={{ required: "Barrio requerido" }}
                                render={({ field }) => (
                                    <Select {...field} label="Barrio">
                                        {barrio.map((s) => (
                                            <MenuItem key={s.id} value={s.id}>
                                                {s.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    {/* Fecha solo si es Perdida */}
                    {tipoPublicacion === "Perdida" && (
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="fechaPerdida"
                                control={control}
                                rules={{ required: "Fecha requerida" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        fullWidth
                                        label="Fecha de pérdida"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Grid>
                    )}
                    {/* Descripcion */}
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
                            variant="outlined"
                            onClick={() => navigate("/perfil")}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
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
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default ModificarPublicacion;
