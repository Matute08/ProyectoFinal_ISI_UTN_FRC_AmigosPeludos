import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getUserMail } from "../../../../api/userApi";
import { getBarrios } from "../../../../api/commonApi";
import {
    getCuidadoresId,
    updateCuidador,
    postFotoCuidador,
    deleteFotoCuidador,
} from "../../../../api/cuidadoresApi";
import {
    uploadFilesCuidador,
    deleteFileStorage,
} from "../../../../api/firebaseUploads";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import SelectBarrio from "../../../../components/select/SelectBarrio";
import SelectExperiencia from "../../../../components/select/SelectExperiencia";
import SelectTipoVivienda from "../../../../components/select/SelectTipoVivienda";
import { mostrarAlertaError, mostrarAlertaExito } from "../../../../utils/showAlert";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ModificarCuidador = () => {
    const { cuidadorId } = useParams();
    const navigate = useNavigate();
    const diasSemana = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ];
    const etiquetas = { manana: "Mañana", tarde: "Tarde", noche: "Noche" };
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const [userData, setUserData] = useState(null);
    const [cuidador, setCuidador] = useState(null);
    const [horario, setHorario] = useState({});
    const [fotos, setFotos] = useState([]);
    const [fotosTemporales, setFotosTemporales] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [loading, setLoading] = useState(true);

    const turnos = ["manana", "tarde", "noche"];

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            barrioId: "",
        },
    });

    useEffect(() => {
        const init = async () => {
            const local = localStorage.getItem("userData");
            if (!local) return;

            const user = await getUserMail(JSON.parse(local).email);
            const cuidadorData = await getCuidadoresId(cuidadorId);
            const barriosRes = await getBarrios();
            

            
            setBarrios(barriosRes.data);
            setUserData(user);
            setCuidador(cuidadorData.data);

            // Armar estructura base
            const horarioBase = {};
            diasSemana.forEach((dia) => {
                horarioBase[dia] = {
                    manana: false,
                    tarde: false,
                    noche: false,
                };
            });

            // Combinar con lo que venga de la base
            const horariosBD = cuidadorData?.data?.grilla?.scheduleData || {};
            const horarioFinal = { ...horarioBase };

            for (const dia in horariosBD) {
                horarioFinal[dia] = {
                    ...horarioBase[dia],
                    ...horariosBD[dia],
                };
            }

            setHorario(horarioFinal);

            // Setear valores del formulario
            reset({
                titulo: cuidadorData.data.titulo,
                precioCuidado: cuidadorData.data.precioCuidado,
                presentacion: cuidadorData.data.presentacion,
                experienciaId: cuidadorData.data.experienciaId,
                barrioId: cuidadorData.data.barrioId,
                calle: cuidadorData.data.calle,
                nroCalle: cuidadorData.data.nroCalle,
                piso: cuidadorData.data.piso,
                tipoViviendaId: cuidadorData.data.tipoViviendaId,
                patioBalcon: cuidadorData.data.patioBalcon,
                transportePropio: cuidadorData.data.transportePropio,
            });

            // Cargar fotos existentes
            if (cuidadorData.data.fotos && cuidadorData.data.fotos.length > 0) {
                const fotosExistentes = cuidadorData.data.fotos.map(foto => ({
                    id: foto.id,
                    foto: typeof foto === 'object' ? foto.foto : foto,
                    estadoTemporal: true
                }));
                setFotosTemporales(fotosExistentes);
            }

        };

        init();
    }, [cuidadorId, reset]);

    const toggleCheck = (dia, turno) => {
        setHorario((prev) => ({
            ...prev,
            [dia]: { ...prev[dia], [turno]: !prev[dia]?.[turno] },
        }));
    };

    const onSubmit = async (data) => {
        try {
            // Manejo de fotos nuevas - subir a Firebase y obtener URLs
            const nuevasFotos = [];

            for (let file of fotos) {
                const upload = await uploadFilesCuidador(file.file);
                nuevasFotos.push({ foto: upload });
            }
            
            // Subir nuevas fotos al backend
            await Promise.all(
                nuevasFotos.map((f) =>
                    postFotoCuidador({
                        foto: f.foto,
                        cuidadorId: parseInt(cuidadorId),
                    })
                )
            );

            // Eliminar fotos marcadas para eliminar
            const fotosAEliminar = fotosTemporales.filter(
                (f) => !f.estadoTemporal
            );
            for (let f of fotosAEliminar) {
                await deleteFileStorage(f.foto);
                await deleteFotoCuidador(f.id);
            }

            const payload = {
                // Mantener todos los campos existentes del cuidador
                ...cuidador,
                // Actualizar solo los campos modificados
                titulo: data.titulo,
                presentacion: data.presentacion,
                experienciaId: Number(data.experienciaId),
                barrioId: Number(data.barrioId),
                calle: data.calle,
                nroCalle: Number(data.nroCalle),
                piso: data.piso || "",
                tipoViviendaId: Number(data.tipoViviendaId),
                patioBalcon: Boolean(data.patioBalcon),
                transportePropio: Boolean(data.transportePropio),
                precioCuidado: Number(data.precioCuidado),
            };


            
            await updateCuidador(cuidadorId, payload);
            
            // Mostrar mensaje de éxito
            mostrarAlertaExito("Perfil de cuidador actualizado exitosamente", "/perfil");

        } catch (error) {
            console.error("Error en onSubmit:", error);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            console.error("Response headers:", error.response?.headers);
            
            mostrarAlertaError(
                `Error al actualizar: ${error.response?.data?.title || error.message}`
            );
        }
    };

    return (
        <>
            <Container sx={{ mt: 4, borderRadius: 4 }} maxWidth="md">
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" mb={2}>
                        Editar Perfil Cuidador
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* fotos */}
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="subtitle1">
                                    Imágenes del Servicio
                                </Typography>
                                {fotosTemporales?.length > 0 ? (
                                    fotosTemporales.map((f) => (
                                    <Box key={f.id} sx={{ display: 'inline-block', position: 'relative', mr: 1, mb: 1 }}>
                                        <img
                                            src={f.foto}
                                            alt="foto"
                                            width="100"
                                            style={{ 
                                                opacity: f.estadoTemporal ? 1 : 0.5,
                                                border: f.estadoTemporal ? '2px solid green' : '2px solid red'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setFotosTemporales(prev => 
                                                    prev.map(foto => 
                                                        foto.id === f.id 
                                                            ? { ...foto, estadoTemporal: !foto.estadoTemporal }
                                                            : foto
                                                    )
                                                );
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                backgroundColor: f.estadoTemporal ? 'error.main' : 'success.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: f.estadoTemporal ? 'error.dark' : 'success.dark',
                                                }
                                            }}
                                        >
                                            {f.estadoTemporal ? '✕' : '✓'}
                                        </IconButton>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    No hay imágenes subidas. Puedes agregar nuevas imágenes abajo.
                                </Typography>
                            )}
                                <FilePond
                                    files={fotos}
                                    onupdatefiles={setFotos}
                                    allowMultiple
                                    maxFiles={4}
                                />
                            </Grid>
                            
                            {/* titulo */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="titulo"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Título"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            
                            {/* precio */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="precioCuidado"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Precio por hora"
                                            type="number"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Grid>

                            {/* experiencia */}
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <SelectExperiencia
                                    value={watch("experienciaId")}
                                    onChange={(e) =>
                                        setValue(
                                            "experienciaId",
                                            e.target.value
                                        )
                                    }
                                    error={!!errors.experienciaId}
                                    helperText={errors.experienciaId?.message}
                                />
                            </Grid>
                            
                            {/* barrio */}
                            <Grid item size={{ xs: 12, md: 6 }}>
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

                            {/* calle */}
                            <Grid item size={{ xs: 12, sm: 8 }}>
                                <Controller
                                    name="calle"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Calle"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Grid>

                            {/* número de calle */}
                            <Grid item size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="nroCalle"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Número"
                                            type="number"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Grid>

                            {/* piso */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="piso"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Piso (opcional)"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>

                            {/* tipo de vivienda */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <SelectTipoVivienda
                                    value={watch("tipoViviendaId")}
                                    onChange={(e) =>
                                        setValue(
                                            "tipoViviendaId",
                                            e.target.value
                                        )
                                    }
                                    error={!!errors.tipoViviendaId}
                                    helperText={errors.tipoViviendaId?.message}
                                />
                            </Grid>

                            {/* checkboxes */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name="patioBalcon"
                                                control={control}
                                                defaultValue={false}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                    />
                                                )}
                                            />
                                        }
                                        label="Patio o Balcón"
                                    />
                                </FormGroup>
                            </Grid>

                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name="transportePropio"
                                                control={control}
                                                defaultValue={false}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                    />
                                                )}
                                            />
                                        }
                                        label="Transporte Propio"
                                    />
                                </FormGroup>
                            </Grid>

                            {/* presentacion */}
                            <Grid item size={{ xs: 12 }}>
                                <Controller
                                    name="presentacion"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Presentación"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            
                            {/* horario */}
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="subtitle1">
                                    Disponibilidad horaria
                                </Typography>

                                <TableContainer
                                    component={Paper}
                                    elevation={3}
                                    sx={{ mt: 2 }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                {diasSemana.map((dia) => (
                                                    <TableCell
                                                        key={dia}
                                                        align="center"
                                                    >
                                                        {capitalize(dia)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {turnos.map((turno) => (
                                                <TableRow key={turno}>
                                                    <TableCell>
                                                        {etiquetas[turno]}
                                                    </TableCell>
                                                    {diasSemana.map((dia) => (
                                                        <TableCell
                                                            align="center"
                                                            key={dia + turno}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    horario[
                                                                        dia
                                                                    ]?.[
                                                                        turno
                                                                    ] || false
                                                                }
                                                                onChange={() =>
                                                                    toggleCheck(
                                                                        dia,
                                                                        turno
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            {/* botones */}
                            <Grid
                                item
                                size={{ xs: 12 }}
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                            >
                                <Button type="submit" variant="contained">
                                    Actualizar
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/perfil")}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default ModificarCuidador; 