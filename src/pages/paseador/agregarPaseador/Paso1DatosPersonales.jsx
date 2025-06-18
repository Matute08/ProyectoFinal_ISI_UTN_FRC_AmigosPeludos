import React, { useEffect } from "react";
import { Box, Grid, TextField, Typography, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const generoOptions = [
    { id: 1, nombre: "Masculino" },
    { id: 2, nombre: "Femenino" },
    { id: 3, nombre: "Otro" },
];

const Paso1DatosPersonales = ({ user }) => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext();

    useEffect(() => {
        if (user) {
            setValue("nombreCompleto", user.nombreCompleto || "");
            setValue("mail", user.mail || "");
      setValue("generoId", user.generoId || "")
        }
    }, [user, setValue]);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Información personal
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{xs:12, md:6}}>
                    <TextField
                        label="Nombre completo"
                        fullWidth
                        disabled
                        {...register("nombreCompleto")}
                    />
                </Grid>

                <Grid size={{xs:12, md:6}}>
                    <TextField
                        label="Correo electrónico"
                        fullWidth
                        disabled
                        {...register("mail")}
                    />
                </Grid>

                <Grid size={{xs:12, md:6}}>
                    <Controller
                        name="fechaNacimiento"
                        control={control}
                        rules={{
                            required: "La fecha es requerida",
                            validate: (value) => {
                                const edad = dayjs().diff(dayjs(value), "year");
                                return edad >= 18 || "Debés ser mayor de edad";
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Fecha de nacimiento"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.fechaNacimiento}
                                helperText={errors.fechaNacimiento?.message}
                                {...field}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{xs:12, md:6}}>
                    <Controller
                        name="generoId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                select
                                label="Género (opcional)"
                                fullWidth
                                {...field}
                            >
                                {generoOptions.map((op) => (
                                    <MenuItem key={op.id} value={op.id}>
                                        {op.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Paso1DatosPersonales;
