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
import {
    getPublicacionPorId,
    postFormularioAdopcion,
} from "../api/formulariosApi";
import { useAuth } from "../auth/AuthProvider";
import SelectBarrio from "../components/select/SelectBarrio";
import SelectCiudad from "../components/select/SelectCiudad";
import SelectProvincia from "../components/select/SelectProvincia";
import { mostrarAlertaExito, mostrarAlertaError } from "../utils/showAlert";
const FormularioAdopcion = ({ mascotaId, onClose }) => {
    const [publicacion, setPublicacion] = useState(null);
    const { userData } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            const resPublicacion = await getPublicacionPorId(mascotaId);
            setPublicacion(resPublicacion);
        };
        fetchData();
    }, [mascotaId]);

    // Autocompletar campos con datos del usuario
    useEffect(() => {
        if (userData) {
            // Dividir nombre completo en nombre y apellido
            if (userData.nombreCompleto) {
                const nombreCompleto = userData.nombreCompleto.trim();
                const partes = nombreCompleto.split(' ');
                const nombre = partes[0] || '';
                const apellido = partes.slice(1).join(' ') || '';
                
                setValue('nombre', nombre, { shouldValidate: true });
                setValue('apellido', apellido, { shouldValidate: true });
            }

            // Autocompletar otros campos
            if (userData.celular) setValue('celular', userData.celular, { shouldValidate: true });
            if (userData.calle) setValue('calle', userData.calle, { shouldValidate: true });
            if (userData.nroCalle) setValue('nroCalle', userData.nroCalle, { shouldValidate: true });
            if (userData.provinciaId) setValue('provinciaId', userData.provinciaId, { shouldValidate: true });
            if (userData.ciudadId) setValue('ciudadId', userData.ciudadId, { shouldValidate: true });
            if (userData.barrioId) setValue('barrioId', userData.barrioId, { shouldValidate: true });
        }
    }, [userData, setValue]);

    // Función para solo permitir números en el campo celular
    const handleCelularChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
        if (value.length > 12) { // Máximo 12 caracteres
            value = value.substring(0, 12);
        }
        e.target.value = value;
        setValue('celular', value);
    };

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
            usuarioIdSolicitante: userData?.id,
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
        <Modal 
            open={true} 
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { xs: "95%", sm: 600, md: 900 },
                    maxHeight: { xs: "95vh", sm: "90vh" },
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    p: { xs: 2, sm: 3, md: 4 },
                    mx: "auto",
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header fijo */}
                <Box sx={{ 
                    flexShrink: 0, 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 2, 
                    mb: 2 
                }}>
                    <Typography 
                        variant="h5" 
                        gutterBottom
                        sx={{ 
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontWeight: 'bold',
                            color: 'primary.main'
                        }}
                    >
                        Formulario de Adopción
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                        Completá este formulario para que podamos evaluar tu solicitud.
                    </Typography>
                </Box>

                {/* Área de scroll */}
                <Box sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                    },
                }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}sx={{ marginTop: 1 }}>
                        <Grid item size={{ xs: 12, sm: 6 }} >
                            <TextField
                                label="Nombre"
                                fullWidth
                                size="small"
                                {...register("nombre", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Apellido"
                                fullWidth
                                size="small"
                                {...register("apellido", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.apellido}
                                helperText={errors.apellido?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="DNI"
                                fullWidth
                                size="small"
                                type="number"
                                {...register("dni", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.dni}
                                helperText={errors.dni?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Celular"
                                fullWidth
                                size="small"
                                {...register("celular", {
                                    required: "Campo obligatorio",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Solo se permiten números"
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: "Máximo 12 caracteres"
                                    }
                                })}
                                onChange={handleCelularChange}
                                error={!!errors.celular}
                                helperText={errors.celular?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 8 }}>
                            <TextField
                                label="Calle"
                                fullWidth
                                size="small"
                                {...register("calle", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.calle}
                                helperText={errors.calle?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Altura"
                                fullWidth
                                size="small"
                                type="number"
                                {...register("nroCalle", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.nroCalle}
                                helperText={errors.nroCalle?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
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

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1
                                }}>
                                    Tipo de vivienda
                                </FormLabel>
                                <RadioGroup 
                                    row 
                                    sx={{ 
                                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                        gap: { xs: 1, sm: 2 }
                                    }}
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("tipoViviendaId", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Casa"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("tipoViviendaId", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Departamento"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                </RadioGroup>
                                {errors.tipoViviendaId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.tipoViviendaId.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1
                                }}>
                                    Condición
                                </FormLabel>
                                <RadioGroup 
                                    row 
                                    sx={{ 
                                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                        gap: { xs: 1, sm: 2 }
                                    }}
                                >
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("estadoResidencia", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Propietario"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("estadoResidencia", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Inquilino"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                </RadioGroup>
                                {errors.estadoResidencia && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.estadoResidencia.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1
                                }}>
                                    Permiten mascotas en la vivienda
                                </FormLabel>
                                <RadioGroup 
                                    row 
                                    sx={{ 
                                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                        gap: { xs: 1, sm: 2 }
                                    }}
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("aceptaMascota", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Sí"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("aceptaMascota", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="No"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                </RadioGroup>
                                {errors.aceptaMascota && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.aceptaMascota.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1
                                }}>
                                    Tenés red o rejas en ventanas/balcones?
                                </FormLabel>
                                <RadioGroup 
                                    row 
                                    sx={{ 
                                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                        gap: { xs: 1, sm: 2 }
                                    }}
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("viviendaCerrada", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="Sí"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                    <FormControlLabel
                                        value="0"
                                        control={
                                            <Radio
                                                size="small"
                                                {...register("viviendaCerrada", {
                                                    required: "Campo obligatorio"
                                                })}
                                            />
                                        }
                                        label="No"
                                        sx={{ fontSize: '0.875rem' }}
                                    />
                                </RadioGroup>
                                {errors.viviendaCerrada && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.viviendaCerrada.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                label="Otras mascotas (Si/No y cuáles)"
                                fullWidth
                                size="small"
                                multiline
                                rows={3}
                                {...register("otrasMascotas", {
                                    required: "Campo obligatorio",
                                })}
                                error={!!errors.otrasMascotas}
                                helperText={errors.otrasMascotas?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        {/* Botones del formulario */}
                        <Grid item size={{ xs: 12 }}>
                            <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 3,
                                pt: 2,
                                borderTop: 1,
                                borderColor: 'divider'
                            }}>
                                <Button 
                                    type="button" 
                                    variant="outlined" 
                                    onClick={onClose}
                                    sx={{ 
                                        minWidth: 120,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained"
                                    sx={{ 
                                        minWidth: 120,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                        }
                                    }}
                                >
                                    Enviar solicitud
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                </Box>
            </Box>
        </Modal>
    );
};

export default FormularioAdopcion;
