import React from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Grid,
    TextField,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const diasSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
];
const turnos = ["manana", "tarde", "noche"];

const etiquetas = {
    manana: "Mañana",
    tarde: "Tarde",
    noche: "Noche",
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const Paso3Horarios = () => {
    const {
        watch,
        setValue,
        register,
        formState: { errors },
    } = useFormContext();

    const grilla = watch("grilla");

    const toggleCheck = (dia, turno) => {
        const estadoActual = grilla[dia][turno];
        setValue(`grilla.${dia}.${turno}`, !estadoActual);
    };

    return (
        <>
            {/* Disponibilidad Horaria */}
            <Box>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ display: "flex", justifyContent: "center" }}
                >
                    Disponibilidad horaria
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {diasSemana.map((dia) => (
                                    <TableCell key={dia} align="center">
                                        {capitalize(dia)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {turnos.map((turno) => (
                                <TableRow key={turno}>
                                    <TableCell component="th" scope="row">
                                        {etiquetas[turno]}
                                    </TableCell>
                                    {diasSemana.map((dia) => (
                                        <TableCell
                                            align="center"
                                            key={dia + turno}
                                        >
                                            <Checkbox
                                                checked={grilla[dia][turno]}
                                                onChange={() =>
                                                    toggleCheck(dia, turno)
                                                }
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Precio por paseo */}
            <Box>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ display: "flex", justifyContent: "center", mt:5}}
                >
                    Precio por hora
                </Typography>
                <Grid
                    container
                    spacing={3}
                    sx={{ display: "flex", justifyContent: "center" , mt:3}}
                >
                    <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            type="number"
                            label="Precio en pesos"
                            fullWidth
                            {...register("precioPaseo", {
                                required: "Este campo es obligatorio",
                                min: {
                                    value: 0,
                                    message: "El precio debe ser mayor a 0",
                                },
                            })}
                            error={!!errors.precioPaseo}
                            helperText={errors.precioPaseo?.message}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Paso3Horarios;
