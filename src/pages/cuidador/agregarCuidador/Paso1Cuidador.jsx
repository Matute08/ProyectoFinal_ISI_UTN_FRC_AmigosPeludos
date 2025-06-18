import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Controller,  useFormContext } from "react-hook-form";
import { getBarrios } from "../../../api/commonApi";
import dayjs from "dayjs";
import SelectBarrio from "../../../components/select/SelectBarrio"

const Paso1Cuidador = ({ user }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [barrios, setBarrios] = useState([]);

  useEffect(() => {
    const fetchBarrios = async () => {
      const res = await getBarrios();
      setBarrios(res.data);
    };
    fetchBarrios();

    if (user) {
      setValue("nombreCompleto", user.nombreCompleto || "");
      setValue("mail", user.mail || "");
      setValue("barrioId", user.barrioId || "")
      setValue("calle", user.calle || "")
      setValue("nroCalle", user.nroCalle || "")
    }
  }, [user, setValue]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Datos personales y ubicación
      </Typography>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre completo"
            fullWidth
            disabled
            {...register("nombreCompleto", { required: "Campo obligatorio" })}
            error={!!errors.nombreCompleto}
            helperText={errors.nombreCompleto?.message}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            label="Correo electrónico"
            fullWidth
            disabled
            {...register("mail", { required: "Campo obligatorio" })}
            error={!!errors.mail}
            helperText={errors.mail?.message}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Controller
            name="fechaNacimiento"
            control={control}
            rules={{
              required: "Campo obligatorio",
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

        <Grid item size={{ xs: 12, md: 6 }}>
          <Controller
            name="barrioId"
            control={control}
            rules={{ required: "Selecciona un barrio" }}
            render={({ field }) => (
              <TextField
                select
                label="Barrio"
                fullWidth
                error={!!errors.barrioId}
                helperText={errors.barrioId?.message}
                {...field}
              >
                {barrios.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            label="Calle"
            fullWidth
            {...register("calle", { required: "Campo obligatorio" })}
            error={!!errors.calle}
            helperText={errors.calle?.message}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <TextField
            label="Altura"
            type="number"
            fullWidth
            {...register("nroCalle", { required: "Campo obligatorio" })}
            error={!!errors.nroCalle}
            helperText={errors.nroCalle?.message}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <TextField
            label="Piso (opcional)"
            fullWidth
            {...register("piso")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Paso1Cuidador;
