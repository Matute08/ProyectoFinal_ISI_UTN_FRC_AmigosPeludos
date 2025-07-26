import React, { useEffect } from "react";
import { Box, Grid, TextField, Typography, MenuItem } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import SelectExperiencia from "../../../components/select/SelectExperiencia";
import SelectBarrio from "../../../components/select/SelectBarrio";
import SelectCiudad from "../../../components/select/SelectCiudad";
import SelectProvincia from "../../../components/select/SelectProvincia";

const Paso2Descripcion = ({ user }) => {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext();

    useEffect(() => {
        if (user) {
            // Usuario disponible
        }
    }, [user, setValue]);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Presentación profesional
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Título de tu publicación"
                        fullWidth
                        {...register("titulo", {
                            required: "Este campo es requerido",
                        })}
                        error={!!errors.titulo}
                        helperText={errors.titulo?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Presentación"
                        multiline
                        rows={5}
                        fullWidth
                        {...register("presentacion", {
                            required: "Este campo es requerido",
                            minLength: {
                                value: 30,
                                message: "Al menos 30 caracteres",
                            },
                            maxLength: {
                                value: 1000,
                                message: "Máximo 1000 caracteres",
                            },
                        })}
                        error={!!errors.presentacion}
                        helperText={errors.presentacion?.message}
                    />
                </Grid>

                <Grid item size={{ xs: 6, md: 3 }}>
                    <SelectExperiencia
                        value={watch("experienciaId")}
                        onChange={(e) =>
                            setValue("experienciaId", e.target.value)
                        }
                        error={!!errors.experienciaId}
                        helperText={errors.experienciaId?.message}
                    />
                </Grid>

                <Grid item size={{ xs: 6, md: 3 }}>
                    <SelectProvincia
                        value={watch("provinciaId")}
                        onChange={(e) =>
                            setValue("provinciaId", e.target.value)
                        }
                        error={!!errors.provinciaId}
                        helperText={errors.provinciaId?.message}
                    />
                </Grid>
                <Grid item size={{ xs: 6, md: 3 }}>
                    <SelectCiudad
                        provinciaId={watch("provinciaId")}
                        value={watch("ciudadId")}
                        onChange={(e) => setValue("ciudadId", e.target.value)}
                        error={!!errors.ciudadId}
                        helperText={errors.ciudadId?.message}
                    />
                </Grid>

                <Grid item size={{ xs: 6, md: 3 }}>
                    <SelectBarrio
                        ciudadId={watch("ciudadId")}
                        value={watch("barrioId")}
                        onChange={(e) => setValue("barrioId", e.target.value)}
                        error={!!errors.barrioId}
                        helperText={errors.barrioId?.message}
                    ></SelectBarrio>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Paso2Descripcion;
