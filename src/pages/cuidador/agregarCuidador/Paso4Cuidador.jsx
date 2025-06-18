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
  Alert
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const turnos = ["manana", "tarde", "noche"];
const etiquetas = {
  manana: "Mañana",
  tarde: "Tarde",
  noche: "Noche",
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const Paso4Cuidador = () => {
  const {
    watch,
    setValue,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = useFormContext();

  const grilla = watch("grilla");

  const toggleCheck = (dia, turno) => {
    const estadoActual = grilla[dia][turno];
    const nuevoEstado = {
      ...grilla,
      [dia]: {
        ...grilla[dia],
        [turno]: !estadoActual,
      },
    };

    setValue(`grilla.${dia}.${turno}`, !estadoActual);

    const algunoSeleccionado = Object.values(nuevoEstado).some((diaObj) =>
      Object.values(diaObj).some((valor) => valor)
    );

    if (!algunoSeleccionado) {
      setError("grilla", {
        type: "manual",
        message: "Seleccioná al menos un horario disponible.",
      });
    } else {
      clearErrors("grilla");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Disponibilidad horaria y precio del cuidado
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ mb: 2 }}>
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
                  <TableCell align="center" key={dia + turno}>
                    <Checkbox
                      checked={grilla[dia][turno]}
                      onChange={() => toggleCheck(dia, turno)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {errors.grilla && (
        <Alert severity="error" sx={{ mb: 2 }}>{errors.grilla.message}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            label="Precio cuidado (por hora)"
            fullWidth
            {...register("precioCuidado", {
              required: "Este campo es obligatorio",
              min: {
                value: 0,
                message: "Debe ser mayor a 0",
              },
            })}
            error={!!errors.precioCuidado}
            helperText={errors.precioCuidado?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Paso4Cuidador;