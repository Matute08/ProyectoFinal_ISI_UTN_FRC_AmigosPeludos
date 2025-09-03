import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Modal,
    Typography,
    TextField,
    MenuItem,
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    FormControl,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { getUserMail } from "../api/userApi";
import {
    getPublicacionPorId,
    postFormularioAdopcion,
} from "../api/formulariosApi";
import SelectBarrio from "../components/select/SelectBarrio";
import SelectCiudad from "../components/select/SelectCiudad";
import SelectProvincia from "../components/select/SelectProvincia";
import { mostrarAlertaExito, mostrarAlertaError } from "../utils/showAlert";
const FormularioAdopcion = ({ mascotaId, onClose }) => {
    const [usuario, setUsuario] = useState(null);
    const [publicacion, setPublicacion] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            const cache = localStorage.getItem("userData");
            if (cache) {
                const email = JSON.parse(cache)?.email;
                const resUser = await getUserMail(email);
                setUsuario(resUser);


            }

            const resPublicacion = await getPublicacionPorId(mascotaId);
            setPublicacion(resPublicacion);
        };
        fetchData();
    }, [mascotaId]);

    const onSubmit = async (data) => {
        const payload = {
            apellido: data.apellido,
            nombre: data.nombre,
            calle: data.calle,
            nroCalle: parseInt(data.nroCalle, 10),
            celular: data.celular,
            dni: parseInt(data.dni, 10),
            barrioId: parseInt(data.barrioId),
            tipoViviendaId: parseInt(data.tipoViviendaId, 10),
            estadoResidencia: data.estadoResidencia === "1",
            aceptaMascota: data.aceptaMascota === "1",
            viviendaCerrada: data.viviendaCerrada === "1",
            estadoFormularioId: 1,
            usuarioIdSolicitante: usuario?.id,
            usuarioIdSolicitado: publicacion?.usuarioId,
            publicacionMascotaId: mascotaId,
            fechaAlta: new Date().toISOString(),
        };
        
        try {
            await postFormularioAdopcion(payload);
            mostrarAlertaExito("Formulario enviado exitosamente", "/adopcion");
            onClose();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            mostrarAlertaError(
                "Error al enviar el formulario. Por favor, intente nuevamente."
            );
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: "90%",
                    maxWidth: 900,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    mx: "auto",
                    mt: 8,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Formulario de Adopción
                </Typography>
                <Typography mb={2}>
                    Completá este formulario para que podamos evaluar tu
                    solicitud.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                {...register("nombre", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                            />
                        </Grid>
                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="Apellido"
                                fullWidth
                                {...register("apellido", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.apellido}
                                helperText={errors.apellido?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="DNI"
                                fullWidth
                                type="number"
                                {...register("dni", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.dni}
                                helperText={errors.dni?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="Celular"
                                fullWidth
                                {...register("celular", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.celular}
                                helperText={errors.celular?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="Calle"
                                fullWidth
                                {...register("calle", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.calle}
                                helperText={errors.calle?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 6, sm: 6 }}>
                            <TextField
                                label="Altura"
                                fullWidth
                                type="number"
                                {...register("nroCalle", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.nroCalle}
                                helperText={errors.nroCalle?.message}
                            />
                        </Grid>

                        {/* Provincia */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <SelectProvincia
                                value={watch("provinciaId")}
                                onChange={(e) =>
                                    setValue("provinciaId", e.target.value)
                                }
                                error={!!errors.provinciaId}
                                helperText={errors.provinciaId?.message}
                            />
                        </Grid>
                        {/* Ciudad */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <SelectCiudad
                                provinciaId={watch("provinciaId")}
                                value={watch("ciudadId")}
                                onChange={(e) =>
                                    setValue("ciudadId", e.target.value)
                                }
                                error={!!errors.ciudadId}
                                helperText={errors.ciudadId?.message}
                            />
                        </Grid>
                        {/* Barrio */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <SelectBarrio
                                ciudadId={watch("ciudadId")}
                                value={watch("barrioId")}
                                onChange={(e) =>
                                    setValue("barrioId", e.target.value)
                                }
                                error={!!errors.barrioId}
                                helperText={errors.barrioId?.message}
                            ></SelectBarrio>
                        </Grid>

                        <Grid item size={{ xs: 6 }}>
                            <FormControl component="fieldset">
                                <FormLabel>Tipo de vivienda</FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                {...register("tipoViviendaId")}
                                            />
                                        }
                                        label="Casa"
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={
                                            <Radio
                                                {...register("tipoViviendaId")}
                                            />
                                        }
                                        label="Departamento"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 6 }}>
                            <FormControl component="fieldset">
                                <FormLabel>Condición</FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                {...register(
                                                    "estadoResidencia"
                                                )}
                                            />
                                        }
                                        label="Propietario"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                {...register(
                                                    "estadoResidencia"
                                                )}
                                            />
                                        }
                                        label="Inquilino"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 6 }}>
                            <FormControl component="fieldset">
                                <FormLabel>
                                    Permiten mascotas en la vivienda
                                </FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                {...register("aceptaMascota")}
                                            />
                                        }
                                        label="Sí"
                                    />
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                {...register("aceptaMascota")}
                                            />
                                        }
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 6 }}>
                            <FormControl component="fieldset">
                                <FormLabel>
                                    Tenés red o rejas en ventanas/balcones?
                                </FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                {...register("viviendaCerrada")}
                                            />
                                        }
                                        label="Sí"
                                    />
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                {...register("viviendaCerrada")}
                                            />
                                        }
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                label="Otras mascotas (Si/No y cuáles)"
                                fullWidth
                                {...register("otrasMascotas", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.otrasMascotas}
                                helperText={errors.otrasMascotas?.message}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12 }} textAlign="right">
                            <Button type="submit" variant="contained">
                                Enviar solicitud
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default FormularioAdopcion;
