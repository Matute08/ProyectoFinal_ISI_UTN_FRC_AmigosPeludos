import React, {useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
    Box,
    TextField,
    Typography,
    Grid,
    Button,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import Maps from "../../components/Maps";
import SelectBarrio from "../../components/select/SelectBarrio";
import SelectCiudad from "../../components/select/SelectCiudad";
import SelectProvincia from "../../components/select/SelectProvincia";


const Step1DatosGenerales = () => {
    const { control, setValue, watch, formState: { errors }, } = useFormContext({
        defaultValues: {
            barrioId: "",
        },
        mode: "onBlur",
    });
    const [latLng, setLatLng] = useState(null);



    // Cuando el usuario elige en el mapa
    const handleMapClick = ({ lat, lng }) => {
        setLatLng({ lat, lng });
        setValue("latitud", lat, { shouldValidate: true });
        setValue("longitud", lng, { shouldValidate: true });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Datos Generales de la Veterinaria
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="nombre"
                        control={control}
                        rules={{ required: "El nombre es obligatorio" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Nombre de la Veterinaria"
                                fullWidth
                                required
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="telefono"
                        control={control}
                        rules={{ 
                            required: "El teléfono es obligatorio",
                            pattern: {
                                value: /^\d+$/,
                                message: "Solo se permiten números"
                            },
                            maxLength: {
                                value: 15,
                                message: "Máximo 15 caracteres"
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Teléfono"
                                fullWidth
                                required
                                inputProps={{
                                    maxLength: 15,
                                    inputMode: 'numeric'
                                }}
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                }}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item size={{ xs: 6, md: 6 }}>
                    <SelectProvincia
                                value={watch("provinciaId")}
                                onChange={(e) =>
                                    setValue("provinciaId", e.target.value)
                                }
                                error={!!errors.provinciaId}
                                helperText={errors.provinciaId?.message}
                            />
                </Grid>
                <Grid item size={{ xs: 6, md: 6 }}>
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

                <Grid item size={{ xs: 6, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="direccion"
                        control={control}
                        rules={{ required: "La dirección es obligatoria" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Calle"
                                fullWidth
                                required
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <Controller
                        name="numeroCalle"
                        control={control}
                        rules={{ 
                            required: "La altura es obligatoria",
                            maxLength: {
                                value: 10,
                                message: "Máximo 10 caracteres"
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Altura"
                                fullWidth
                                required
                                type="number"
                                inputProps={{
                                    maxLength: 10
                                }}
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>
                 
                {/* <Grid size={{ xs: 6, md: 3 }}>
                    <Controller
                        name="barrio"
                        control={control}
                        rules={{ required: "El barrio es obligatorio" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                select
                                label="Barrio"
                                fullWidth
                                required
                                {...field}
                                value={field.value ?? ""} // Asegura que nunca es undefined
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                disabled={loadingBarrios}
                            >
                                <MenuItem value="">
                                    Seleccionar barrio...
                                </MenuItem>
                                {barrios.map((b) => (
                                    <MenuItem key={b.id} value={b.id}>
                                        {b.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid> */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="cuit"
                        control={control}
                        rules={{
                            required: "El CUIT es obligatorio",
                            pattern: {
                                value: /^\d{11}$/,
                                message:
                                    "El CUIT debe tener 11 dígitos numéricos",
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="CUIT"
                                fullWidth
                                required
                                inputProps={{
                                    maxLength: 11,
                                    inputMode: 'numeric'
                                }}
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                }}
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error?.message ||
                                    "Solo números, sin guiones"
                                }
                            />
                        )}
                    />
                </Grid>

                {/* Mapa */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Seleccioná la ubicación en el mapa (click en el lugar
                        exacto)
                    </Typography>
                    <Box
                        sx={{
                            height: 300,
                            width: "100%",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Maps
                            seleccionable={true}
                            onMapClick={handleMapClick}
                            markerSeleccionado={latLng} // Mostrá el marker donde el usuario clickeó
                            center={
                                latLng
                                    ? [latLng.lat, latLng.lng]
                                    : [-31.4167, -64.1833]
                            }
                            zoom={15}
                        />
                    </Box>
                    {!latLng && (
                        <Typography color="warning.main" fontSize={14}>
                            Debés seleccionar la ubicación exacta en el mapa.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step1DatosGenerales;
