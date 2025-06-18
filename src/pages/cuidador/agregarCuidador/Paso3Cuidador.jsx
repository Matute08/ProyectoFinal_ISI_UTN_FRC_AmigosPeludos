import React from "react";
import { Box, Grid, Typography, TextField, MenuItem } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import SelectExperiencia from "../../../components/select/SelectExperiencia";

const Paso3Cuidador = () => {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext();

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Presentación y experiencia
            </Typography>
            <Grid container spacing={3}>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <TextField
                        label="Título atractivo"
                        fullWidth
                        {...register("titulo", {
                            required: "Campo obligatorio",
                            minLength: {
                                value: 5,
                                message: "Mínimo 5 caracteres",
                            },
                            maxLength: {
                                value: 100,
                                message: "Máximo 100 caracteres",
                            },
                        })}
                        error={!!errors.titulo}
                        helperText={errors.titulo?.message}
                    />
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <SelectExperiencia
                        value={watch("experienciaId")}
                        onChange={(e) =>
                            setValue("experienciaId", e.target.value)
                        }
                        error={!!errors.experienciaId}
                        helperText={errors.experienciaId?.message}
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <TextField
                        label="Presentación personal"
                        fullWidth
                        multiline
                        rows={5}
                        {...register("presentacion", {
                            required: "Campo obligatorio",
                            minLength: {
                                value: 30,
                                message: "Mínimo 30 caracteres",
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
            </Grid>
        </Box>
    );
};

export default Paso3Cuidador;
