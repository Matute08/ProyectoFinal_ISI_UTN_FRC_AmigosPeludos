// Componente SettingsPaseador.jsx (adaptado al diseño moderno)
// Incluye presentación, horario, experiencia, barrio, precio y carga de fotos con FilePond
// Requiere Material UI, React Hook Form, Firebase utils, y tus APIs personalizadas

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
    getPaseadorPorId,
    updateGrillaPaseador,
    deleteFotoPaseador,
    postFotoPaseador,
    updatePaseador,
} from "../../../../api/paseadoresApi";
import {
    uploadFilesPaseador,
    deleteFileStorage,
} from "../../../../api/firebaseUploads";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import SelectBarrio from "../../../../components/select/SelectBarrio";
import SelectExperiencia from "../../../../components/select/SelectExperiencia";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ModificarPaseador = () => {
    const { paseadorId } = useParams();
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
    const [paseador, setPaseador] = useState(null);
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
            const paseadorData = await getPaseadorPorId(paseadorId);
            const barriosRes = await getBarrios();
            setBarrios(barriosRes.data);
            setUserData(user);
            setPaseador(paseadorData.data);

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
            const horariosBD = paseadorData?.data?.grilla?.scheduleData || {};
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
                titulo: paseadorData.data.titulo,
                precioPaseo: paseadorData.data.precioPaseo,
                presentacion: paseadorData.data.presentacion,
                experienciaId: paseadorData.data.experienciaId,
                barrioId: paseadorData.data.barrioTrabajoId,
            });
        };

        init();
    }, [paseadorId, reset]);

    const toggleCheck = (dia, turno) => {
        setHorario((prev) => ({
            ...prev,
            [dia]: { ...prev[dia], [turno]: !prev[dia]?.[turno] },
        }));
    };

    const onSubmit = async (data) => {
        try {
            const dataGrilla = {
                idPaseador: parseInt(paseadorId),
                scheduleData: horario,
            };
            const nuevasFotos = [];

            for (let file of fotos) {
                const upload = await uploadFilesPaseador(file.file);
                nuevasFotos.push({ foto: upload });
            }
            await Promise.all(
                nuevasFotos.map((f) =>
                    postFotoPaseador({
                        foto: f.foto,
                        paseadorId: parseInt(paseadorId),
                    })
                )
            );

            const fotosAEliminar = fotosTemporales.filter(
                (f) => !f.estadoTemporal
            );
            for (let f of fotosAEliminar) {
                await deleteFileStorage(f.foto);
                await deleteFotoPaseador(f.id);
            }

            const payload = {
                idUsuario: user.id,
                fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
                titulo: data.titulo,
                presentacion: data.presentacion,
                experienciaId: Number(data.experienciaId),
                barrioTrabajoId: Number(data.barrioId),
                precioPaseo: Number(data.precioPaseo),
                fotos: data.fotos.map((f) => ({ foto: f })),
                grilla: { scheduleData: data.grilla },
            };

            console.log(data);
            await updatePaseador(paseadorId, payload);
            await updateGrillaPaseador(paseadorId, dataGrilla);
            navigate(`/perfil/${userData?.mail}`);

        } catch (error) {
            mostrarAlertaError(
                "Ocurrió un error al enviar tu solicitud",
                error
            );
        }
    };

    return (
        <>
            <Container sx={{ mt: 4, borderRadius: 4 }} maxWidth="md">
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" mb={2}>
                        Editar Perfil Paseador
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* fotos */}
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="subtitle1">
                                    Imágenes de Paseos
                                </Typography>
                                {fotosTemporales?.map((f) => (
                                    <img
                                        key={f.id}
                                        src={f.foto}
                                        alt="foto"
                                        width="100"
                                        style={{ marginRight: 10 }}
                                    />
                                ))}
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
                                    name="precioPaseo"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Precio por paseo"
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
                                    onClick={() =>
                                        navigate(`/perfil/${userData?.mail}`)
                                    }
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

export default ModificarPaseador;
