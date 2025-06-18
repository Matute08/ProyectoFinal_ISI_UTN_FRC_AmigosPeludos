import React from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import SelectTipoVivienda from "../../../components/select/SelectTipoVivienda";

const Paso2Cuidador = () => {
    const {
        control,
        formState: { errors },
        setValue,watch
    } = useFormContext();



    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Información sobre tu vivienda
            </Typography>
            <Grid container spacing={3} sx={{display:"flex", justifyContent:"center"}}>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <SelectTipoVivienda
                            value={watch("tipoViviendaId")}
                            onChange={(e) => setValue("tipoViviendaId", e.target.value)}
                            error={!!errors.tipoViviendaId}
                            helperText={errors.tipoViviendaId?.message}
                        />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{display:"flex", justifyContent:"center"}}>
                <Grid item size={{ xs: 12, md: 6 }}>
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
                        label="¿Tenés patio o balcón?"
                    />
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
                        label="¿Contás con transporte propio?"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Paso2Cuidador;
